#!/usr/bin/env python3
"""Recompute primary_category for all recalls in Supabase from product_description."""

from __future__ import annotations

import os
import sys
import time
from collections import Counter, defaultdict
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

from categorize import categorize_product

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

PAGE_SIZE = 1000
ID_BATCH_SIZE = 500
MAX_RETRIES = 3


def log(message: str) -> None:
    print(message, flush=True)


def get_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise SystemExit("Missing SUPABASE_URL or SUPABASE_KEY in .env")
    return create_client(url, key)


def execute_with_retry(fn, label: str):
    last_exc: Exception | None = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return fn()
        except Exception as exc:
            last_exc = exc
            log(f"  {label} attempt {attempt} failed: {exc}")
            time.sleep(min(2**attempt, 8))
    raise last_exc  # type: ignore[misc]


def chunked(items: list[int], size: int) -> list[list[int]]:
    return [items[i : i + size] for i in range(0, len(items), size)]


def fetch_all_recalls(client: Client) -> list[dict]:
    rows: list[dict] = []
    offset = 0
    while True:
        response = (
            client.table("recalls")
            .select("id,product_description,primary_category")
            .order("id")
            .range(offset, offset + PAGE_SIZE - 1)
            .execute()
        )
        batch = response.data or []
        if not batch:
            break
        rows.extend(batch)
        log(f"  fetched {len(rows)} recalls...")
        if len(batch) < PAGE_SIZE:
            break
        offset += PAGE_SIZE
    return rows


def main() -> None:
    client = get_client()
    log("Loading recalls...")
    recalls = fetch_all_recalls(client)
    log(f"Loaded {len(recalls)} recalls")

    updates_by_category: dict[str, list[int]] = defaultdict(list)
    changes = Counter()
    distribution = Counter()

    for recall in recalls:
        new_category = categorize_product(recall.get("product_description"))
        old_category = recall.get("primary_category")
        distribution[new_category] += 1
        if old_category != new_category:
            changes[f"{old_category}->{new_category}"] += 1
            updates_by_category[new_category].append(recall["id"])

    total_updates = sum(len(ids) for ids in updates_by_category.values())
    log(f"Recategorizing {total_updates} recalls in batches")
    for transition, count in changes.most_common(20):
        log(f"  {transition}: {count}")

    updated = 0
    for category, ids in sorted(updates_by_category.items()):
        for batch_index, id_batch in enumerate(chunked(ids, ID_BATCH_SIZE), start=1):
            execute_with_retry(
                lambda cat=category, batch=id_batch: client.table("recalls")
                .update({"primary_category": cat})
                .in_("id", batch)
                .execute(),
                f"{category} batch {batch_index}",
            )
            updated += len(id_batch)
            log(f"  updated {updated}/{total_updates} ({category})")

    log("\nCategory distribution after recategorization:")
    for slug, count in distribution.most_common():
        log(f"  {slug}: {count}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
