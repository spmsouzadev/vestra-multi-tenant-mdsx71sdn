-- Migration to fix and update get_tenant_stats function
-- Implements required statistics: total_projects, total_units, total_owners, total_revenue

CREATE OR REPLACE FUNCTION public.get_tenant_stats(tenant_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  total_projects INTEGER;
  total_units INTEGER;
  total_owners INTEGER;
  total_revenue NUMERIC;
BEGIN
  -- Count projects for the tenant
  SELECT COUNT(*) INTO total_projects 
  FROM projects 
  WHERE tenant_id = tenant_uuid;
  
  -- Count units in projects belonging to the tenant
  SELECT COUNT(*) INTO total_units 
  FROM units u
  JOIN projects p ON u.project_id = p.id
  WHERE p.tenant_id = tenant_uuid;
  
  -- Count unique owners in units belonging to the tenant
  SELECT COUNT(DISTINCT u.owner_id) INTO total_owners
  FROM units u
  JOIN projects p ON u.project_id = p.id
  WHERE p.tenant_id = tenant_uuid
  AND u.owner_id IS NOT NULL;

  -- Sum total revenue from billing_history (sum of all amounts)
  -- Using COALESCE to handle case with no billing history
  SELECT COALESCE(SUM(amount), 0) INTO total_revenue
  FROM billing_history
  WHERE tenant_id = tenant_uuid;

  -- Return the statistics as a JSONB object
  RETURN jsonb_build_object(
    'total_projects', total_projects,
    'total_units', total_units,
    'total_owners', total_owners,
    'total_revenue', total_revenue
  );
END;
$$;
