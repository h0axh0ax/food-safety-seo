#!/usr/bin/env python3
"""One-time full history backfill: fetch all openFDA food recalls and sync to Supabase."""

import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent


def run_step(command: list[str]) -> None:
    print(f"\n>>> {' '.join(command)}")
    result = subprocess.run(command, check=False)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def main() -> None:
    started = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"=== FDA FULL backfill started at {started} ===")
    print("This may take 10-30 minutes depending on network speed.")

    run_step([sys.executable, str(SCRIPTS_DIR / "fetch_fda.py"), "--full"])
    run_step([sys.executable, str(SCRIPTS_DIR / "sync_to_supabase.py")])

    finished = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"\n=== FDA FULL backfill finished at {finished} ===")


if __name__ == "__main__":
    main()
