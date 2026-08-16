#!/usr/bin/env python3
"""Fetch FDA food enforcement records from openFDA API."""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT = PROJECT_ROOT / "fda_sample.json"
API_BASE = "https://api.fda.gov/food/enforcement.json"
FIELDS = (
    "event_id",
    "recall_number",
    "recalling_firm",
    "product_description",
    "reason_for_recall",
    "classification",
    "status",
    "report_date",
    "distribution_pattern",
    "code_info",
    "more_code_info",
    "product_quantity",
    "voluntary_mandated",
    "recall_initiation_date",
    "initial_firm_notification",
    "product_type",
    "city",
    "state",
    "country",
    "address_1",
    "address_2",
    "center_classification_date",
    "termination_date",
)
OUTPUT_FILE = str(DEFAULT_OUTPUT)
PAGE_LIMIT = 1000
SLEEP_SECONDS = 0.5
ENV_API_KEY = "OPENFDA_API_KEY"
FULL_HISTORY_START = "20120620"


def load_dotenv(path: Path = PROJECT_ROOT / ".env") -> None:
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def resolve_api_key(cli_key: str | None) -> str:
    api_key = cli_key or os.environ.get(ENV_API_KEY)
    if not api_key:
        print(
            f"Missing API key. Set {ENV_API_KEY} in .env or pass --api-key.",
            file=sys.stderr,
        )
        sys.exit(1)
    return api_key


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Fetch FDA food enforcement data from openFDA"
    )
    parser.add_argument(
        "--api-key",
        default=None,
        help=f"openFDA API key (overrides {ENV_API_KEY} env var)",
    )
    parser.add_argument(
        "--full",
        action="store_true",
        help=f"Fetch full history from {FULL_HISTORY_START} to today (batched by year)",
    )
    parser.add_argument(
        "--days",
        type=int,
        default=30,
        help="Fetch records with report_date within the past N days (default: 30)",
    )
    parser.add_argument(
        "--include-ongoing",
        action="store_true",
        help="Also fetch all Ongoing recalls to capture status updates on older records",
    )
    parser.add_argument(
        "--output",
        default=OUTPUT_FILE,
        help=f"Output JSON file path (default: {OUTPUT_FILE})",
    )
    return parser.parse_args()


def date_range_past_days(days: int) -> tuple[str, str]:
    end = datetime.now()
    start = end - timedelta(days=days)
    return start.strftime("%Y%m%d"), end.strftime("%Y%m%d")


def full_history_ranges() -> list[tuple[str, str, str]]:
    today = datetime.now().strftime("%Y%m%d")
    current_year = datetime.now().year
    ranges: list[tuple[str, str, str]] = [("2012", FULL_HISTORY_START, "20121231")]

    for year in range(2013, current_year):
        ranges.append((str(year), f"{year}0101", f"{year}1231"))

    ranges.append((str(current_year), f"{current_year}0101", today))
    return ranges


def extract_fields(record: dict) -> dict:
    return {field: record.get(field) for field in FIELDS}


def build_url(api_key: str, search: str, skip: int) -> str:
    params = {
        "search": search,
        "limit": PAGE_LIMIT,
        "skip": skip,
        "api_key": api_key,
    }
    return f"{API_BASE}?{urllib.parse.urlencode(params)}"


def fetch_all_pages(api_key: str, search: str, label: str) -> list[dict]:
    records: list[dict] = []
    skip = 0

    print(f"Fetching {label}...")

    while True:
        url = build_url(api_key, search, skip)
        request = urllib.request.Request(url, headers={"Accept": "application/json"})

        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                data = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                break
            body = exc.read().decode("utf-8", errors="replace")
            print(f"HTTP {exc.code}: {body}", file=sys.stderr)
            sys.exit(1)
        except urllib.error.URLError as exc:
            print(f"Network error: {exc.reason}", file=sys.stderr)
            sys.exit(1)
        except json.JSONDecodeError as exc:
            print(f"Invalid JSON response: {exc}", file=sys.stderr)
            sys.exit(1)

        results = data.get("results") or []
        if not results:
            break

        records.extend(extract_fields(record) for record in results)

        total = data.get("meta", {}).get("results", {}).get("total", 0)
        skip += len(results)

        if skip >= total:
            break

        time.sleep(SLEEP_SECONDS)

    print(f"  -> {len(records)} records")
    return records


def record_key(record: dict) -> str | None:
    recall_number = str(record.get("recall_number") or "").strip()
    if recall_number:
        return recall_number
    event_id = str(record.get("event_id") or "").strip()
    product = str(record.get("product_description") or "").strip()
    if event_id and product:
        return f"{event_id}:{product}"
    return event_id or None


def merge_by_record_key(*groups: list[dict]) -> list[dict]:
    merged: dict[str, dict] = {}
    for group in groups:
        for record in group:
            key = record_key(record)
            if key:
                merged[key] = record
    return list(merged.values())


def merge_by_event_id(*groups: list[dict]) -> list[dict]:
    return merge_by_record_key(*groups)


def fetch_full_history(api_key: str) -> list[dict]:
    merged: dict[str, dict] = {}

    print(f"Full history backfill: {FULL_HISTORY_START} to today (by year)")
    for label, start_date, end_date in full_history_ranges():
        search = f"report_date:[{start_date} TO {end_date}]"
        batch = fetch_all_pages(
            api_key,
            search,
            f"{label} report_date {start_date} to {end_date}",
        )
        for record in batch:
            key = record_key(record)
            if key:
                merged[key] = record
        print(f"  cumulative unique records: {len(merged)}")

    return list(merged.values())


def main() -> None:
    load_dotenv()
    args = parse_args()
    api_key = resolve_api_key(args.api_key)

    if args.full:
        all_records = fetch_full_history(api_key)
        print(f"Full history total (deduped by recall_number): {len(all_records)}")
    else:
        start_date, end_date = date_range_past_days(args.days)
        date_search = f"report_date:[{start_date} TO {end_date}]"
        date_records = fetch_all_pages(
            api_key,
            date_search,
            f"report_date {start_date} to {end_date}",
        )
        all_records = date_records

        if args.include_ongoing:
            ongoing_records = fetch_all_pages(
                api_key,
                'status:"Ongoing"',
                "all Ongoing recalls (status refresh)",
            )
            all_records = merge_by_event_id(date_records, ongoing_records)
            print(f"Merged total (deduped by recall_number): {len(all_records)}")

    output_path = Path(args.output)
    with output_path.open("w", encoding="utf-8") as file:
        json.dump(all_records, file, indent=2, ensure_ascii=False)
        file.write("\n")

    print(f"Saved {len(all_records)} records to {output_path}")


if __name__ == "__main__":
    main()
