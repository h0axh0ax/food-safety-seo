-- Run in Supabase SQL Editor if not yet applied

ALTER TABLE recalls ADD COLUMN IF NOT EXISTS primary_category TEXT NOT NULL DEFAULT 'other';

CREATE INDEX IF NOT EXISTS recalls_primary_category_idx ON recalls (primary_category);
