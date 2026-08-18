#!/usr/bin/env python3
"""Compare stored recall fields against live OpenFDA records.

Official text fields must match exactly. Dates are compared after
normalizing FDA YYYYMMDD to ISO YYYY-MM-DD.
"""

from __future__ import annotations

import json
import os
import random
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

API_BASE = "https://api.fda.gov/food/enforcement.json"
COMPARE_FIELDS = (
    "product_description",
    "reason_for_recall",
    "classification",
    "status",
    "event_id",
    "recalling_firm",
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
    query = f'recall_number:"{recall_number}"'
    params = {
        "search": query,
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
    newest = rows[: min(25, size)]
    remaining = [row for row in rows if row not in newest]
    extra_needed = size - len(newest)
    extra = random.sample(remaining, extra_needed) if remaining else []
    return newest + extra


def main() -> None:
    sample_size = int(sys.argv[1]) if len(sys.argv) > 1 else 40
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    api_key = os.getenv("OPENFDA_API_KEY")

    if not supabase_url or not supabase_key:
        raise SystemExit("Missing SUPABASE_URL or SUPABASE_KEY")
    if not api_key:
        raise SystemExit("Missing OPENFDA_API_KEY")

    supabase = create_client(supabase_url, supabase_key)
    response = (
        supabase.table("recalls")
        .select(
            "recall_number, event_id, product_description, reason_for_recall, "
            "classification, status, report_date, recall_initiation_date, "
            "center_classification_date, termination_date, brand_slug, brands(name)"
        )
        .order("report_date", desc=True)
        .limit(400)
        .execute()
    )
    rows = response.data or []
    sample = pick_sample(rows, sample_size)

    checked = 0
    missing = 0
    mismatches: list[dict] = []

    print(f"Checking {len(sample)} stored records against OpenFDA...\n")

    for row in sample:
        recall_number = (row.get("recall_number") or "").strip()
        if not recall_number or ":" in recall_number:
            continue

        time.sleep(0.25)
        remote = fetch_openfda(recall_number, api_key)
        checked += 1

        if not remote:
            missing += 1
            print(f"MISSING  {recall_number}  (not found on OpenFDA)")
            continue

        diffs = []
        brands_raw = row.get("brands")
        brand_name = None
        if isinstance(brands_raw, dict):
            brand_name = brands_raw.get("name")
        elif isinstance(brands_raw, list) and brands_raw:
            brand_name = brands_raw[0].get("name")

        stored_firm = normalize_text(brand_name)
        remote_firm = normalize_text(remote.get("recalling_firm"))
        if stored_firm != remote_firm:
            diffs.append(("recalling_firm", stored_firm, remote_firm))

        for field in ("product_description", "reason_for_recall", "classification", "status", "event_id"):
            local = normalize_text(row.get(field))
            official = normalize_text(remote.get(field))
            if local != official:
                diffs.append((field, local, official))

        for field in DATE_FIELDS:
            local = normalize_date(row.get(field))
            official = normalize_date(remote.get(field))
            if local != official:
                diffs.append((field, local, official))

        if diffs:
            mismatches.append({"recall_number": recall_number, "diffs": diffs})
            print(f"MISMATCH {recall_number}")
            for field, local, official in diffs:
                print(f"  {field}")
                print(f"    stored:  {str(local)[:160]}")
                print(f"    openfda: {str(official)[:160]}")
        else:
            print(f"OK       {recall_number}")

    print("\n--- summary ---")
    print(f"checked:    {checked}")
    print(f"exact match:{checked - missing - len(mismatches)}")
    print(f"missing:    {missing}")
    print(f"mismatched: {len(mismatches)}")

    if mismatches or missing:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
