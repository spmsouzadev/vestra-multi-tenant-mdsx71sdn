-- Migration to support duration in months for warranty categories

-- Add term_months column
ALTER TABLE warranty_categories ADD COLUMN IF NOT EXISTS term_months INTEGER DEFAULT 0;

-- Migrate existing data (convert years to months)
UPDATE warranty_categories SET term_months = term_years * 12 WHERE term_months = 0 AND term_years IS NOT NULL;

-- If for some reason term_years was null (unlikely due to previous schema), set a default
UPDATE warranty_categories SET term_months = 60 WHERE term_months = 0;

-- Make term_months NOT NULL
ALTER TABLE warranty_categories ALTER COLUMN term_months SET NOT NULL;

-- Remove term_years as requested ("replace")
ALTER TABLE warranty_categories DROP COLUMN IF EXISTS term_years;

-- Function to automatically expire warranties is not needed as expiration_date is stored,
-- but the status update logic is handled in the application layer or we could add a computed column/view.
-- For now, adhering to the application logic described.
