-- Add new columns to tenants table
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS admin_email TEXT;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'Standard';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'Active';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS storage_used BIGINT DEFAULT 0;

-- Create function to get tenant stats
CREATE OR REPLACE FUNCTION get_tenant_stats(tenant_uuid UUID)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  project_count INTEGER;
  unit_count INTEGER;
  storage_size BIGINT;
BEGIN
  -- Count projects
  SELECT COUNT(*) INTO project_count FROM projects WHERE tenant_id = tenant_uuid;
  
  -- Count units in projects belonging to the tenant
  SELECT COUNT(*) INTO unit_count 
  FROM units u
  JOIN projects p ON u.project_id = p.id
  WHERE p.tenant_id = tenant_uuid;
  
  -- Sum file size of documents in projects belonging to the tenant
  SELECT COALESCE(SUM(file_size), 0) INTO storage_size
  FROM documents d
  JOIN projects p ON d.project_id = p.id
  WHERE p.tenant_id = tenant_uuid;

  RETURN json_build_object(
    'project_count', project_count,
    'unit_count', unit_count,
    'storage_used', storage_size
  );
END;
$$;
