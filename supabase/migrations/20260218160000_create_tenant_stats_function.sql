-- Create a function to get tenant statistics
-- This function calculates the total projects, units, and storage used for a specific tenant
-- It is used in the Tenant Details dashboard

CREATE OR REPLACE FUNCTION get_tenant_stats(tenant_uuid UUID)
RETURNS TABLE (
  project_count BIGINT,
  unit_count BIGINT,
  storage_used BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM projects WHERE projects.tenant_id = tenant_uuid)::BIGINT as project_count,
    (SELECT COUNT(*) FROM units u JOIN projects p ON u.project_id = p.id WHERE p.tenant_id = tenant_uuid)::BIGINT as unit_count,
    (
      SELECT COALESCE(SUM(d.file_size), 0)
      FROM documents d
      JOIN projects p ON d.project_id = p.id
      WHERE p.tenant_id = tenant_uuid
    )::BIGINT as storage_used;
END;
$$;
