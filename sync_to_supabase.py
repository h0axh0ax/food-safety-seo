#!/usr/bin/env python3
"""Sync FDA sample JSON into Supabase brands and recalls tables."""

import json
import os
import re
import sys
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
DATA_FILE = Path("fda_sample.json")


def get_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("请确保 .env 文件中已配置 SUPABASE_URL 和 SUPABASE_KEY")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def generate_slug(text: str) -> str:
    """把品牌名转换为符合 URL 规范的 slug。"""
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text)
    return text.strip("-")


def resolve_brand_slug(raw_firm: str, event_id: str) -> str:
    slug = generate_slug(raw_firm)
    if slug:
        return slug
    return f"brand-{event_id}"


def parse_report_date(value: str | None) -> str | None:
    """将 FDA 的 YYYYMMDD 转为 Postgres date 格式 YYYY-MM-DD。"""
    if not value or len(value) != 8 or not value.isdigit():
        return value
    return f"{value[:4]}-{value[4:6]}-{value[6:8]}"


def sync_data() -> None:
    if not DATA_FILE.is_file():
        raise FileNotFoundError(f"未找到数据文件: {DATA_FILE}")

    supabase = get_client()

    with DATA_FILE.open("r", encoding="utf-8") as file:
        records = json.load(file)

    print(f"找到 {len(records)} 条样本数据，开始处理...")

    synced = 0
    skipped = 0

    for item in records:
        raw_firm = item.get("recalling_firm") or "Unknown Brand"
        event_id = str(item.get("event_id") or "").strip()
        brand_slug = resolve_brand_slug(raw_firm, event_id)

        if not event_id:
            skipped += 1
            continue

        brand_data = {"name": raw_firm, "slug": brand_slug}
        supabase.table("brands").upsert(
            brand_data,
            on_conflict="slug",
            ignore_duplicates=True,
        ).execute()

        recall_data = {
            "event_id": event_id,
            "brand_slug": brand_slug,
            "product_description": item.get("product_description"),
            "reason_for_recall": item.get("reason_for_recall"),
            "classification": item.get("classification"),
            "status": item.get("status"),
            "report_date": parse_report_date(item.get("report_date")),
        }

        try:
            supabase.table("recalls").upsert(
                recall_data,
                on_conflict="event_id",
            ).execute()
            synced += 1
            print(f"[OK] {event_id} ({raw_firm})")
        except Exception as exc:
            print(f"[FAIL] {event_id}: {exc}", file=sys.stderr)

    print("\n正在重新计算品牌召回总数...")
    brands_res = supabase.table("brands").select("slug").execute()
    for brand in brands_res.data or []:
        slug = brand["slug"]
        count_res = (
            supabase.table("recalls")
            .select("*", count="exact", head=True)
            .eq("brand_slug", slug)
            .execute()
        )
        total_count = count_res.count or 0
        supabase.table("brands").update({"total_recalls": total_count}).eq(
            "slug", slug
        ).execute()

    print(
        f"\n同步完成: 写入/更新 {synced} 条召回记录，跳过 {skipped} 条无效数据。"
    )


if __name__ == "__main__":
    sync_data()
