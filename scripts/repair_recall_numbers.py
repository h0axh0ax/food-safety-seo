#!/usr/bin/env python3
"""Remove legacy recall_number placeholders left by migration 001.

Migration 001 copied numeric event_id into recall_number. Later syncs wrote
the official F-/H- numbers as separate rows. Safe repair:

1) Delete digit-only placeholders when the same event_id already has an
   official recall_number.
2) For remaining dirty rows, look up openFDA by event_id, upsert official
   rows, then delete the placeholders.
"""

from __future__ import annotations

import argparse
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

from categorize import categorize_product
from data_quality import (
    collect_dirty_rows,
    event_ids_with_official_number,
    is_digit_placeholder,
    is_dirty_recall_number,
    is_official_recall_number,
    iter_recall_rows,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

API_BASE = "https://api.fda.gov/food/enforcement.json"
DELETE_BATCH = 100
FDA_DATE_FIELDS = (
    "report_date",
    "recall_initiation_date",
    "center_classification_date",
    "termination_date",
)
FDA_TEXT_FIELDS = (
    "distribution_pattern",
    "code_info",
    "more_code_info",
    "product_quantity",
    "voluntary_mandated",
    "initial_firm_notification",
    "product_type",
    "city",
    "state",
    "country",
    "address_1",
    "address_2",
)


def get_client():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise SystemExit("Missing SUPABASE_URL or SUPABASE_KEY")
    return create_client(url, key)


def chunked(items: list, size: int):
    for index in range(0, len(items), size):
        yield items[index : index + size]


def parse_fda_date(value: str | None) -> str | None:
    if not value:
        return None
    cleaned = str(value).strip()
    if len(cleaned) == 8 and cleaned.isdigit():
        return f"{cleaned[:4]}-{cleaned[4:6]}-{cleaned[6:8]}"
    return cleaned


def generate_slug(text: str) -> str:
    import re

    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text)
    return text.strip("-")


def fetch_openfda_by_event(event_id: str, api_key: str) -> list[dict]:
    records: list[dict] = []
    skip = 0
    while True:
        params = {
            "search": f'event_id:"{event_id}"',
            "limit": 100,
            "skip": skip,
            "api_key": api_key,
        }
        url = f"{API_BASE}?{urllib.parse.urlencode(params)}"
        request = urllib.request.Request(url, headers={"Accept": "application/json"})
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                break
            raise
        batch = payload.get("results") or []
        if not batch:
            break
        records.extend(batch)
        total = payload.get("meta", {}).get("results", {}).get("total", 0)
        skip += len(batch)
        if skip >= total:
            break
        time.sleep(0.25)
    return records


def build_recall_row(item: dict, brand_slug: str) -> dict | None:
    event_id = str(item.get("event_id") or "").strip()
    recall_number = str(item.get("recall_number") or "").strip()
    product = str(item.get("product_description") or "").strip()
    if not event_id:
        return None
    if not is_official_recall_number(recall_number):
        if product:
            recall_number = f"{event_id}:{product}"
        else:
            return None

    row = {
        "event_id": event_id,
        "recall_number": recall_number,
        "brand_slug": brand_slug,
        "product_description": item.get("product_description"),
        "reason_for_recall": item.get("reason_for_recall"),
        "classification": item.get("classification"),
        "status": item.get("status"),
        "report_date": parse_fda_date(item.get("report_date")),
        "primary_category": categorize_product(item.get("product_description")),
    }
    for field in FDA_TEXT_FIELDS:
        row[field] = item.get(field)
    for field in FDA_DATE_FIELDS:
        if field == "report_date":
            continue
        row[field] = parse_fda_date(item.get(field))
    return row


def repair_orphans_via_openfda(
    supabase,
    orphan_rows: list[dict],
    api_key: str,
) -> tuple[int, int]:
    by_event: dict[str, list[dict]] = {}
    for row in orphan_rows:
        event_id = str(row.get("event_id") or "").strip()
        if event_id:
            by_event.setdefault(event_id, []).append(row)

    upserted = 0
    deleted = 0

    for event_id, rows in by_event.items():
        time.sleep(0.25)
        remote_records = fetch_openfda_by_event(event_id, api_key)
        if not remote_records:
            print(f"  OPENFDA MISS event_id={event_id} ({len(rows)} dirty rows)")
            digit_ids = [
                row["id"]
                for row in rows
                if row.get("id") is not None
                and is_digit_placeholder(row.get("recall_number"))
            ]
            if digit_ids:
                supabase.table("recalls").delete().in_("id", digit_ids).execute()
                deleted += len(digit_ids)
                print(
                    f"  deleted {len(digit_ids)} digit placeholder(s) for missing "
                    f"event_id={event_id}; kept any synthetic keys"
                )
            continue

        brand_slug = None
        # Prefer an existing brand_slug from any row already on this event.
        existing = (
            supabase.table("recalls")
            .select("brand_slug")
            .eq("event_id", event_id)
            .limit(5)
            .execute()
            .data
            or []
        )
        for item in existing:
            if item.get("brand_slug"):
                brand_slug = item["brand_slug"]
                break
        if not brand_slug:
            firm = remote_records[0].get("recalling_firm") or "Unknown Brand"
            brand_slug = generate_slug(firm) or f"brand-{event_id}"
            supabase.table("brands").upsert(
                {"name": firm, "slug": brand_slug, "total_recalls": 0},
                on_conflict="slug",
            ).execute()

        payload = []
        for item in remote_records:
            row = build_recall_row(item, brand_slug)
            if row:
                payload.append(row)

        if not payload:
            print(
                f"  SKIP delete event_id={event_id}: OpenFDA returned "
                f"{len(remote_records)} row(s) but no usable recall_number"
            )
            continue

        supabase.table("recalls").upsert(payload, on_conflict="recall_number").execute()
        upserted += len(payload)
        print(f"  upserted {len(payload)} official row(s) for event_id={event_id}")

        ids = [row["id"] for row in rows if row.get("id") is not None]
        if ids:
            for batch in chunked(ids, DELETE_BATCH):
                supabase.table("recalls").delete().in_("id", batch).execute()
                deleted += len(batch)
            print(f"  deleted {len(ids)} dirty row(s) for event_id={event_id}")

    return upserted, deleted


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Apply deletes/upserts (default is dry-run)",
    )
    parser.add_argument(
        "--restore-events",
        default="",
        help="Comma-separated event_id list to re-upsert from OpenFDA",
    )
    args = parser.parse_args()

    supabase = get_client()
    api_key = os.getenv("OPENFDA_API_KEY")
    dirty = collect_dirty_rows(supabase)
    official_events = event_ids_with_official_number(supabase)

    digit_rows = dirty["digit"]
    synthetic_rows = dirty["synthetic"]
    deletable = [
        row
        for row in digit_rows
        if str(row.get("event_id") or "").strip() in official_events
    ]
    blocked_digit = [row for row in digit_rows if row not in deletable]
    orphan_rows = blocked_digit + synthetic_rows

    print(f"digit placeholders:           {len(digit_rows)}")
    print(f"safe delete (has official):   {len(deletable)}")
    print(f"digit needing OpenFDA repair: {len(blocked_digit)}")
    print(f"synthetic keys:               {len(synthetic_rows)}")
    print(f"empty recall_number:          {len(dirty['empty'])}")

    restore_ids = [item.strip() for item in args.restore_events.split(",") if item.strip()]
    if restore_ids:
        if not api_key:
            raise SystemExit("OPENFDA_API_KEY required for --restore-events")
        print(f"Restoring {len(restore_ids)} event_id(s) from OpenFDA...")
        fake_rows = [{"id": None, "event_id": event_id} for event_id in restore_ids]
        restored, _deleted = repair_orphans_via_openfda(supabase, fake_rows, api_key)
        print(f"Restored upserts: {restored}")

    if not args.apply:
        print("\nDry-run only. Re-run with --apply to delete placeholders.")
        return

    deleted_safe = 0
    for batch in chunked(deletable, DELETE_BATCH):
        ids = [row["id"] for row in batch]
        supabase.table("recalls").delete().in_("id", ids).execute()
        deleted_safe += len(ids)
        print(f"  deleted safe placeholders {deleted_safe}/{len(deletable)}")

    upserted = 0
    deleted_orphan = 0
    if orphan_rows:
        if not api_key:
            raise SystemExit("OPENFDA_API_KEY required to repair orphan dirty rows")
        print(f"\nRepairing {len(orphan_rows)} orphan dirty row(s) via OpenFDA...")
        upserted, deleted_orphan = repair_orphans_via_openfda(
            supabase, orphan_rows, api_key
        )

    remaining_dirty = [
        row
        for row in iter_recall_rows(supabase, "id,recall_number,event_id")
        if is_dirty_recall_number(row.get("recall_number"))
        or not (row.get("recall_number") or "").strip()
    ]
    remaining_digit = [
        row
        for row in remaining_dirty
        if is_digit_placeholder(row.get("recall_number"))
        or not (row.get("recall_number") or "").strip()
    ]

    print(f"\nDone.")
    print(f"  safe deletes:     {deleted_safe}")
    print(f"  orphan upserts:   {upserted}")
    print(f"  orphan deletes:   {deleted_orphan}")
    print(f"  remaining dirty:  {len(remaining_dirty)}")

    if remaining_digit:
        for row in remaining_digit[:20]:
            print(f"  leftover id={row['id']} recall_number={row.get('recall_number')!r}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
