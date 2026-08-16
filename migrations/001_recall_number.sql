-- Run once in Supabase SQL Editor (Dashboard -> SQL -> New query)
-- Enables one row per FDA recall_number (product-level records)

ALTER TABLE recalls ADD COLUMN IF NOT EXISTS recall_number TEXT;

UPDATE recalls
SET recall_number = event_id
WHERE recall_number IS NULL;

ALTER TABLE recalls DROP CONSTRAINT IF EXISTS recalls_event_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS recalls_recall_number_key
ON recalls (recall_number);

-- event_id is no longer unique (multiple products per event); keep for lookups
CREATE INDEX IF NOT EXISTS recalls_event_id_idx ON recalls (event_id);
