-- Add phone column to tenants table
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create billing_history table
CREATE TABLE IF NOT EXISTS billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL, -- 'PAID', 'PENDING', 'OVERDUE'
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_billing_history_tenant_id ON billing_history(tenant_id);

-- Insert some sample billing data for existing tenants (safe if table is new)
INSERT INTO billing_history (tenant_id, invoice_number, amount, status, due_date, paid_at)
SELECT 
  id, 
  'INV-' || to_char(created_at, 'YYYY') || '-001', 
  CASE WHEN plan = 'Enterprise' THEN 2999.00 WHEN plan = 'Professional' THEN 1499.00 ELSE 899.00 END,
  'PAID',
  (created_at + interval '1 month')::date,
  (created_at + interval '1 month')::date
FROM tenants
WHERE NOT EXISTS (SELECT 1 FROM billing_history WHERE billing_history.tenant_id = tenants.id);
