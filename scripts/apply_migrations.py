#!/usr/bin/env python3
"""Apply SQL migrations via Supabase SQL API (requires DATABASE_URL in .env)."""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

MIGRATIONS_DIR = PROJECT_ROOT / "migrations"


def run_sql(database_url: str, sql: str) -> None:
    try:
        import psycopg2
    except ImportError as exc:
        raise SystemExit(
            "Install psycopg2-binary: pip install psycopg2-binary"
        ) from exc

    with psycopg2.connect(database_url) as conn:
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute(sql)


def main() -> None:
    database_url = os.getenv("DATABASE_URL") or os.getenv("SUPABASE_DB_URL")
    if not database_url:
        print(
            "Set DATABASE_URL in .env (Supabase Dashboard -> Settings -> Database -> URI)",
            file=sys.stderr,
        )
        print("\nOr run these files manually in Supabase SQL Editor:", file=sys.stderr)
        for path in sorted(MIGRATIONS_DIR.glob("*.sql")):
            print(f"  - {path.name}", file=sys.stderr)
        sys.exit(1)

    for path in sorted(MIGRATIONS_DIR.glob("*.sql")):
        sql = path.read_text(encoding="utf-8")
        print(f"Applying {path.name}...")
        run_sql(database_url, sql)
        print("  OK")

    print("All migrations applied.")


if __name__ == "__main__":
    main()
