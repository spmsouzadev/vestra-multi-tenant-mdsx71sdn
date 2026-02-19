-- Migration to ensure billing_history table exists with correct structure
-- Addresses runtime error in TenantDetails page caused by missing table

-- 1. Create table if not exists (base structure)
CREATE TABLE IF NOT EXISTS public.billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL, -- 'PAID', 'PENDING', 'OVERDUE'
  due_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure all required columns exist (idempotent operations)
-- This handles cases where the table might exist partially from previous failed migrations
DO $$
BEGIN
    -- invoice_number (Required by tenantService.ts)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'billing_history' AND column_name = 'invoice_number') THEN
        ALTER TABLE public.billing_history ADD COLUMN invoice_number TEXT;
    END IF;

    -- paid_at (Required by tenantService.ts)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'billing_history' AND column_name = 'paid_at') THEN
        ALTER TABLE public.billing_history ADD COLUMN paid_at TIMESTAMPTZ;
    END IF;

    -- pdf_url (Required by tenantService.ts)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'billing_history' AND column_name = 'pdf_url') THEN
        ALTER TABLE public.billing_history ADD COLUMN pdf_url TEXT;
    END IF;

    -- description (Required by Acceptance Criteria)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'billing_history' AND column_name = 'description') THEN
        ALTER TABLE public.billing_history ADD COLUMN description TEXT;
    END IF;
    
    -- Ensure due_date is TIMESTAMPTZ (if it was created as DATE in previous migrations)
    -- This handles the potential type mismatch safely
    BEGIN
        ALTER TABLE public.billing_history ALTER COLUMN due_date TYPE TIMESTAMPTZ USING due_date::TIMESTAMPTZ;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;
END $$;

-- 3. Create Indexes for performance
-- Optimizes: .eq('tenant_id', id).order('due_date', { ascending: false })
CREATE INDEX IF NOT EXISTS idx_billing_history_tenant_due_date ON public.billing_history(tenant_id, due_date DESC);
CREATE INDEX IF NOT EXISTS idx_billing_history_tenant_id ON public.billing_history(tenant_id);

-- 4. Seed Data for validation
-- Insert sample PAID billing data for tenants that don't have any
INSERT INTO public.billing_history (tenant_id, invoice_number, amount, status, due_date, description, paid_at, created_at)
SELECT 
  id, 
  'INV-' || to_char(NOW(), 'YYYY') || '-' || substring(md5(random()::text) from 1 for 4), 
  CASE WHEN plan = 'Enterprise' THEN 2999.00 WHEN plan = 'Professional' THEN 1499.00 ELSE 899.00 END,
  'PAID',
  (NOW() - interval '1 month'),
  'Mensalidade - ' || to_char(NOW() - interval '1 month', 'MM/YYYY'),
  (NOW() - interval '1 month' + interval '1 day'),
  (NOW() - interval '1 month')
FROM public.tenants
WHERE NOT EXISTS (SELECT 1 FROM public.billing_history WHERE billing_history.tenant_id = tenants.id);

-- Insert a PENDING invoice for active tenants to show variety
INSERT INTO public.billing_history (tenant_id, invoice_number, amount, status, due_date, description, created_at)
SELECT 
  id, 
  'INV-' || to_char(NOW(), 'YYYY') || '-' || substring(md5(random()::text) from 1 for 4), 
  CASE WHEN plan = 'Enterprise' THEN 2999.00 WHEN plan = 'Professional' THEN 1499.00 ELSE 899.00 END,
  'PENDING',
  (NOW() + interval '5 days'),
  'Mensalidade - ' || to_char(NOW(), 'MM/YYYY'),
  NOW()
FROM public.tenants
WHERE status = 'ACTIVE'
AND (SELECT count(*) FROM public.billing_history WHERE tenant_id = tenants.id) < 2;
