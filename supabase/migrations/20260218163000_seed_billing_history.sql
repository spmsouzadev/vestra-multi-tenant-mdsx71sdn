-- Insert some sample billing data for existing tenants
-- Moved to a separate migration to avoid timeouts during table creation
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
