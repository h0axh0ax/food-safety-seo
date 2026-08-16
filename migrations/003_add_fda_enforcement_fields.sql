-- Additional openFDA food enforcement fields (official text, unchanged in app)
-- Run after 001_recall_number.sql and 002_add_primary_category.sql

ALTER TABLE recalls ADD COLUMN IF NOT EXISTS distribution_pattern TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS code_info TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS more_code_info TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS product_quantity TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS voluntary_mandated TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS recall_initiation_date DATE;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS initial_firm_notification TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS product_type TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS address_1 TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS address_2 TEXT;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS center_classification_date DATE;
ALTER TABLE recalls ADD COLUMN IF NOT EXISTS termination_date DATE;

CREATE INDEX IF NOT EXISTS recalls_event_id_idx ON recalls (event_id);
CREATE INDEX IF NOT EXISTS recalls_recall_number_idx ON recalls (recall_number);
