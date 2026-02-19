-- Create billing_history if it doesn't exist
CREATE TABLE IF NOT EXISTS public.billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_billing_history_tenant_id ON public.billing_history(tenant_id);

-- Ensure get_tenant_stats function exists and is correct for the dashboard
CREATE OR REPLACE FUNCTION public.get_tenant_stats(tenant_uuid UUID)
RETURNS TABLE (
  project_count BIGINT,
  unit_count BIGINT,
  storage_used BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM projects WHERE projects.tenant_id = tenant_uuid)::BIGINT,
    (SELECT COUNT(*) FROM units u JOIN projects p ON u.project_id = p.id WHERE p.tenant_id = tenant_uuid)::BIGINT,
    (
      SELECT COALESCE(SUM(d.file_size), 0)
      FROM documents d
      JOIN projects p ON d.project_id = p.id
      WHERE p.tenant_id = tenant_uuid
    )::BIGINT;
END;
$$;
