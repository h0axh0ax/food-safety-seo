#!/usr/bin/env python3
"""
Poll openFDA and sync changes to Supabase.

openFDA does not push webhooks — this script polls the API, merges new/updated
records (including Ongoing status refreshes), and upserts into Supabase.
"""

import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent


def run_step(command: list[str]) -> None:
    label = " ".join(command)
    print(f"\n>>> {label}")
    result = subprocess.run(command, check=False)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def main() -> None:
    started = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"=== FDA sync pipeline started at {started} ===")

    run_step(
        [
            sys.executable,
            str(SCRIPTS_DIR / "fetch_fda.py"),
            "--days",
            "45",
            "--include-ongoing",
        ]
    )
    run_step([sys.executable, str(SCRIPTS_DIR / "sync_to_supabase.py")])

    finished = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"\n=== FDA sync pipeline finished at {finished} ===")


if __name__ == "__main__":
    main()
