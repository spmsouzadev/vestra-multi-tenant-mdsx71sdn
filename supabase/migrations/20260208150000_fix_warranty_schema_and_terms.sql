-- Migration to ensure term_months column exists and is used instead of term_years

DO $$
BEGIN
    -- 1. Add term_months column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'warranty_categories' AND column_name = 'term_months') THEN
        ALTER TABLE warranty_categories ADD COLUMN term_months INTEGER DEFAULT 0;
    END IF;

    -- 2. Migrate data from term_years to term_months if term_years exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'warranty_categories' AND column_name = 'term_years') THEN
        -- Update term_months based on term_years for rows where term_months is 0
        UPDATE warranty_categories 
        SET term_months = term_years * 12 
        WHERE term_months = 0 AND term_years IS NOT NULL AND term_years > 0;
    END IF;

    -- 3. Set default for any remaining 0 values (new rows or failed migrations)
    UPDATE warranty_categories SET term_months = 60 WHERE term_months <= 0;

    -- 4. Enforce NOT NULL constraint
    ALTER TABLE warranty_categories ALTER COLUMN term_months SET NOT NULL;

    -- 5. Drop term_years column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'warranty_categories' AND column_name = 'term_years') THEN
        ALTER TABLE warranty_categories DROP COLUMN term_years;
    END IF;
END $$;
