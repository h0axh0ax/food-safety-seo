#!/usr/bin/env python3
"""Backward-compatible entry point — runs scripts/run_sync.py."""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
raise SystemExit(
    subprocess.call([sys.executable, str(ROOT / "scripts" / "run_sync.py")])
)
