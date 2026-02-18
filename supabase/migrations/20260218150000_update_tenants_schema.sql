-- Update Tenants Schema with new columns
-- This migration separates the schema updates from the initial creation to avoid timeouts and ensure clarity

ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS admin_email TEXT;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'Standard';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'Active';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS storage_used BIGINT DEFAULT 0;
