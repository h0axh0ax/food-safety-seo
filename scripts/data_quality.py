#!/usr/bin/env python3
"""Shared helpers for recall_number hygiene and sync monitoring."""

from __future__ import annotations

import re
from typing import Iterable

from supabase import Client

# Official openFDA food enforcement numbers vary by era:
# F-1234-2024, F2225-2012, F-1773, F-1855.2013
OFFICIAL_RECALL_NUMBER = re.compile(
    r"^[A-Za-z]+-?\d+[.\-]?\d*$"
)
DIGIT_ONLY = re.compile(r"^\d+$")
PLACEHOLDER_VALUES = {"n/a", "na", "none", "-", "null"}
PAGE_SIZE = 1000


def is_official_recall_number(value: str | None) -> bool:
    text = (value or "").strip()
    if not text or text.lower() in PLACEHOLDER_VALUES:
        return False
    if is_digit_placeholder(text) or is_synthetic_recall_number(text):
        return False
    return bool(OFFICIAL_RECALL_NUMBER.match(text))


def is_digit_placeholder(value: str | None) -> bool:
    """Migration 001 copied numeric event_id into recall_number."""
    return bool(DIGIT_ONLY.match((value or "").strip()))


def is_synthetic_recall_number(value: str | None) -> bool:
    """Fallback key used when openFDA omitted recall_number: event_id:product."""
    text = (value or "").strip()
    if ":" not in text:
        return False
    prefix, _sep, _rest = text.partition(":")
    return bool(prefix) and DIGIT_ONLY.match(prefix) is not None


def is_dirty_recall_number(value: str | None) -> bool:
    return is_digit_placeholder(value) or is_synthetic_recall_number(value)


def iter_recall_rows(
    supabase: Client,
    columns: str = "id,recall_number,event_id",
) -> Iterable[dict]:
    offset = 0
    while True:
        response = (
            supabase.table("recalls")
            .select(columns)
            .order("id", desc=False)
            .range(offset, offset + PAGE_SIZE - 1)
            .execute()
        )
        rows = response.data or []
        if not rows:
            break
        yield from rows
        if len(rows) < PAGE_SIZE:
            break
        offset += PAGE_SIZE


def collect_dirty_rows(supabase: Client) -> dict[str, list[dict]]:
    digit: list[dict] = []
    synthetic: list[dict] = []
    empty: list[dict] = []

    for row in iter_recall_rows(supabase, "id,recall_number,event_id"):
        recall_number = (row.get("recall_number") or "").strip()
        if not recall_number:
            empty.append(row)
        elif is_digit_placeholder(recall_number):
            digit.append(row)
        elif is_synthetic_recall_number(recall_number):
            synthetic.append(row)

    return {"digit": digit, "synthetic": synthetic, "empty": empty}


def event_ids_with_official_number(supabase: Client) -> set[str]:
    official: set[str] = set()
    for row in iter_recall_rows(supabase, "event_id,recall_number"):
        if is_official_recall_number(row.get("recall_number")):
            official.add(str(row.get("event_id") or "").strip())
    return official
