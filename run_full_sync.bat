@echo off
cd /d "%~dp0"
echo Full history backfill - may take 10-30 minutes...
python scripts\run_full_sync.py
pause
