#!/usr/bin/env python3
"""Sync FDA sample JSON into Supabase brands and recalls tables."""

import json
import os
import re
import time
from collections import Counter
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

from categorize import categorize_product
from data_quality import is_digit_placeholder, is_official_recall_number

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
DATA_FILE = PROJECT_ROOT / "fda_sample.json"
BATCH_SIZE = 200
MAX_RETRIES = 3

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


def get_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("请确保 .env 文件中已配置 SUPABASE_URL 和 SUPABASE_KEY")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def generate_slug(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text)
    return text.strip("-")


def resolve_brand_slug(raw_firm: str, event_id: str) -> str:
    slug = generate_slug(raw_firm)
    if slug:
        return slug
    return f"brand-{event_id}"


def parse_fda_date(value: str | None) -> str | None:
    if not value:
        return None
    cleaned = str(value).strip()
    if len(cleaned) == 8 and cleaned.isdigit():
        return f"{cleaned[:4]}-{cleaned[4:6]}-{cleaned[6:8]}"
    return cleaned


def resolve_recall_number(item: dict) -> str | None:
    """Prefer official openFDA recall_number. Never store bare numeric event_id."""
    recall_number = str(item.get("recall_number") or "").strip()
    if is_official_recall_number(recall_number):
        return recall_number
    # Rare non-standard official values: keep if present and not a digit placeholder.
    if recall_number and not is_digit_placeholder(recall_number):
        return recall_number

    event_id = str(item.get("event_id") or "").strip()
    product = str(item.get("product_description") or "").strip()
    if event_id and product:
        # Last-resort synthetic key — monitoring flags these if they pile up.
        return f"{event_id}:{product}"
    return None


def chunked(items: list, size: int):
    for index in range(0, len(items), size):
        yield items[index : index + size]


def log(message: str) -> None:
    print(message, flush=True)


def execute_with_retry(action, label: str):
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return action()
        except Exception as exc:
            if attempt >= MAX_RETRIES:
                raise
            wait = attempt * 2
            log(f"  retry {label} ({attempt}/{MAX_RETRIES}): {exc}")
            time.sleep(wait)


def column_exists(supabase: Client, table: str, column: str) -> bool:
    try:
        supabase.table(table).select(column).limit(1).execute()
        return True
    except Exception as exc:
        if "does not exist" in str(exc):
            return False
        raise


def sync_data() -> None:
    if not DATA_FILE.is_file():
        raise FileNotFoundError(f"未找到数据文件: {DATA_FILE}")

    supabase = get_client()
    has_category_column = column_exists(supabase, "recalls", "primary_category")
    has_recall_number_column = column_exists(supabase, "recalls", "recall_number")
    has_code_info_column = column_exists(supabase, "recalls", "code_info")

    if not has_category_column:
        log(
            "警告: recalls.primary_category 列不存在。"
            "请在 Supabase SQL Editor 运行 migrations/002_add_primary_category.sql 后重新同步。"
        )
    if not has_recall_number_column:
        log(
            "警告: recalls.recall_number 列不存在。"
            "请在 Supabase SQL Editor 运行 migrations/001_recall_number.sql 后重新同步。"
        )
    if not has_code_info_column:
        log(
            "警告: 扩展 FDA 字段未迁移。"
            "请运行 migrations/003_add_fda_enforcement_fields.sql 后重新同步以写入完整字段。"
        )

    with DATA_FILE.open("r", encoding="utf-8") as file:
        records = json.load(file)

    log(f"找到 {len(records)} 条数据，开始处理...")

    brands_by_slug: dict[str, dict] = {}
    recall_rows: list[dict] = []
    skipped = 0

    for item in records:
        raw_firm = item.get("recalling_firm") or "Unknown Brand"
        event_id = str(item.get("event_id") or "").strip()
        recall_number = resolve_recall_number(item)
        brand_slug = resolve_brand_slug(raw_firm, event_id)

        if not event_id or not recall_number:
            skipped += 1
            continue

        brands_by_slug[brand_slug] = {"name": raw_firm, "slug": brand_slug}
        product_description = item.get("product_description")
        primary_category = categorize_product(product_description)
        row = {
            "event_id": event_id,
            "brand_slug": brand_slug,
            "product_description": product_description,
            "reason_for_recall": item.get("reason_for_recall"),
            "classification": item.get("classification"),
            "status": item.get("status"),
            "report_date": parse_fda_date(item.get("report_date")),
        }

        if has_recall_number_column:
            row["recall_number"] = recall_number

        if has_category_column:
            row["primary_category"] = primary_category

        if has_code_info_column:
            for field in FDA_TEXT_FIELDS:
                row[field] = item.get(field)
            for field in FDA_DATE_FIELDS:
                if field == "report_date":
                    continue
                row[field] = parse_fda_date(item.get(field))

        recall_rows.append(row)

    counts = Counter(row["brand_slug"] for row in recall_rows)
    brand_list = []
    for slug, brand in brands_by_slug.items():
        brand_list.append(
            {
                "name": brand["name"],
                "slug": slug,
                "total_recalls": counts[slug],
            }
        )

    log(f"写入 {len(brand_list)} 个品牌（含 total_recalls）...")
    for batch_index, batch in enumerate(chunked(brand_list, BATCH_SIZE), start=1):
        execute_with_retry(
            lambda b=batch: supabase.table("brands").upsert(b, on_conflict="slug").execute(),
            f"brands batch {batch_index}",
        )
        log(f"  brands batch {batch_index}/{(len(brand_list) + BATCH_SIZE - 1) // BATCH_SIZE}")

    category_counts = Counter(
        categorize_product(row["product_description"]) for row in recall_rows
    )
    log("产品类型分布 (规则匹配):")
    for slug, count in category_counts.most_common():
        log(f"  {slug}: {count}")

    if not has_category_column:
        category_map = {
            row["event_id"]: categorize_product(row["product_description"])
            for row in recall_rows
        }
        map_path = PROJECT_ROOT / "recall_categories.json"
        map_path.write_text(
            json.dumps(category_map, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        log(f"已写入临时分类文件: {map_path}（迁移 SQL 执行后重新 sync 可入库）")

    conflict_key = "recall_number" if has_recall_number_column else "event_id"
    log(
        f"写入 {len(recall_rows)} 条召回记录（批量 {BATCH_SIZE}，"
        f"upsert on {conflict_key}）..."
    )
    synced = 0
    failed = 0

    for batch_index, batch in enumerate(chunked(recall_rows, BATCH_SIZE), start=1):
        try:
            execute_with_retry(
                lambda b=batch: supabase.table("recalls")
                .upsert(b, on_conflict=conflict_key)
                .execute(),
                f"recalls batch {batch_index}",
            )
            synced += len(batch)
            log(f"  recalls batch {batch_index}: {synced}/{len(recall_rows)}")
        except Exception as exc:
            failed += len(batch)
            log(f"  recalls batch {batch_index} FAIL: {exc}")

    log(
        f"\n同步完成: 写入/更新 {synced} 条召回记录，"
        f"失败 {failed} 条，跳过 {skipped} 条无效数据。"
    )


if __name__ == "__main__":
    sync_data()
