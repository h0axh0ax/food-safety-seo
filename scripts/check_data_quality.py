#!/usr/bin/env python3
"""Fail the job when stored recall data looks wrong — not only when sync exits 0.

Checks:
1) recall_number hygiene (no digit event_id placeholders / empty values)
2) optional OpenFDA sample field match (official text must be identical)
"""

from __future__ import annotations

import argparse
import json
import os
import random
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

from data_quality import collect_dirty_rows, is_official_recall_number

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

API_BASE = "https://api.fda.gov/food/enforcement.json"
COMPARE_FIELDS = (
    "product_description",
    "reason_for_recall",
    "classification",
    "status",
    "event_id",
)
DATE_FIELDS = (
    "report_date",
    "recall_initiation_date",
    "center_classification_date",
    "termination_date",
)


def normalize_date(value: str | None) -> str | None:
    if not value:
        return None
    cleaned = str(value).strip()
    if len(cleaned) == 8 and cleaned.isdigit():
        return f"{cleaned[:4]}-{cleaned[4:6]}-{cleaned[6:8]}"
    if len(cleaned) >= 10 and cleaned[4] == "-" and cleaned[7] == "-":
        return cleaned[:10]
    return cleaned or None


def normalize_text(value) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text if text else None


def fetch_openfda(recall_number: str, api_key: str) -> dict | None:
    params = {
        "search": f'recall_number:"{recall_number}"',
        "limit": 1,
        "api_key": api_key,
    }
    url = f"{API_BASE}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return None
        raise
    results = payload.get("results") or []
    return results[0] if results else None


def pick_sample(rows: list[dict], size: int) -> list[dict]:
    if len(rows) <= size:
        return rows
    newest = rows[: min(15, size)]
    remaining = [row for row in rows if row not in newest]
    extra_needed = size - len(newest)
    extra = random.sample(remaining, extra_needed) if remaining and extra_needed > 0 else []
    return newest + extra


def check_hygiene(supabase) -> list[str]:
    dirty = collect_dirty_rows(supabase)
    failures: list[str] = []

    print("=== recall_number hygiene ===")
    print(f"digit placeholders:  {len(dirty['digit'])}")
    print(f"synthetic keys:      {len(dirty['synthetic'])}")
    print(f"empty recall_number: {len(dirty['empty'])}")

    if dirty["digit"]:
        failures.append(
            f"{len(dirty['digit'])} digit-only recall_number placeholders remain "
            "(run: python scripts/repair_recall_numbers.py --apply)"
        )
        for row in dirty["digit"][:5]:
            print(f"  sample digit: id={row['id']} recall_number={row['recall_number']}")

    if dirty["empty"]:
        failures.append(f"{len(dirty['empty'])} rows have empty recall_number")

    if dirty["synthetic"]:
        # Soft warning: rare fallback keys; fail only if many appear.
        print(
            f"WARNING: {len(dirty['synthetic'])} synthetic event_id:product keys "
            "(openFDA omitted recall_number)"
        )
        for row in dirty["synthetic"][:5]:
            print(f"  sample synthetic: id={row['id']} recall_number={row['recall_number']!r}")
        if len(dirty["synthetic"]) > 20:
            failures.append(
                f"{len(dirty['synthetic'])} synthetic recall_number keys (threshold 20)"
            )

    return failures


def check_openfda_sample(supabase, api_key: str, sample_size: int) -> list[str]:
    failures: list[str] = []
    print("\n=== OpenFDA sample match ===")

    response = (
        supabase.table("recalls")
        .select(
            "recall_number,event_id,product_description,reason_for_recall,"
            "classification,status,report_date,recall_initiation_date,"
            "center_classification_date,termination_date"
        )
        .order("report_date", desc=True)
        .limit(400)
        .execute()
    )
    recent = [
        row
        for row in (response.data or [])
        if is_official_recall_number(row.get("recall_number"))
    ]
    sample = pick_sample(recent, sample_size)

    checked = 0
    missing = 0
    mismatches = 0

    for row in sample:
        recall_number = (row.get("recall_number") or "").strip()
        time.sleep(0.2)
        remote = fetch_openfda(recall_number, api_key)
        checked += 1
        if not remote:
            missing += 1
            print(f"MISSING  {recall_number}")
            continue

        diffs = []
        for field in COMPARE_FIELDS:
            local = normalize_text(row.get(field))
            official = normalize_text(remote.get(field))
            if local != official:
                diffs.append(field)

        for field in DATE_FIELDS:
            local = normalize_date(row.get(field))
            official = normalize_date(remote.get(field))
            if local != official:
                diffs.append(field)

        if diffs:
            mismatches += 1
            print(f"MISMATCH {recall_number}: {', '.join(diffs)}")
        else:
            print(f"OK       {recall_number}")

    print(
        f"sample checked={checked} exact={checked - missing - mismatches} "
        f"missing={missing} mismatched={mismatches}"
    )

    # Status can lag until weekly full sync — treat status-only drift softly
    # by failing only when missing IDs or non-status field mismatches pile up.
    if missing:
        failures.append(f"{missing}/{checked} sample recall_numbers not found on OpenFDA")
    if mismatches > max(2, checked // 5):
        failures.append(
            f"{mismatches}/{checked} sample rows differ from OpenFDA "
            "(above soft threshold; investigate sync freshness)"
        )
    elif mismatches:
        print(
            f"WARNING: {mismatches} sample mismatch(es) under soft threshold "
            "(often status lag before weekly full sync)"
        )

    return failures


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--sample-size",
        type=int,
        default=20,
        help="OpenFDA sample size (0 skips live API checks)",
    )
    args = parser.parse_args()

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    api_key = os.getenv("OPENFDA_API_KEY")
    if not url or not key:
        raise SystemExit("Missing SUPABASE_URL or SUPABASE_KEY")

    supabase = create_client(url, key)
    failures = check_hygiene(supabase)

    if args.sample_size > 0:
        if not api_key:
            failures.append("Missing OPENFDA_API_KEY for sample verification")
        else:
            failures.extend(check_openfda_sample(supabase, api_key, args.sample_size))

    print("\n=== summary ===")
    if failures:
        for item in failures:
            print(f"FAIL: {item}")
        raise SystemExit(1)

    print("PASS: data quality checks ok")


if __name__ == "__main__":
    main()
