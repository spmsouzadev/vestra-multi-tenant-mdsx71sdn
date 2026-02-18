-- Ensure tables exist and schema is up to date
-- This migration consolidates schema definitions to avoid dependencies issues and connection timeouts

-- Tenants table (if not exists)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  status TEXT DEFAULT 'ACTIVE',
  admin_email TEXT,
  plan TEXT DEFAULT 'Standard',
  subscription_status TEXT DEFAULT 'Active',
  last_payment_date TIMESTAMPTZ,
  storage_used BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Owners table
CREATE TABLE IF NOT EXISTS owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  document TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  manager TEXT,
  address TEXT,
  total_units INTEGER DEFAULT 0,
  delivered_units INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  delivery_date DATE,
  status TEXT DEFAULT 'PLANNING',
  phase TEXT DEFAULT 'PLANNING',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units table
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
  number TEXT NOT NULL,
  block TEXT,
  floor TEXT,
  type TEXT,
  status TEXT DEFAULT 'AVAILABLE',
  price NUMERIC(15, 2),
  area NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT,
  url TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_units_project_id ON units(project_id);
CREATE INDEX IF NOT EXISTS idx_units_owner_id ON units(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);

-- Create function for tenant stats
CREATE OR REPLACE FUNCTION get_tenant_stats(tenant_uuid UUID)
RETURNS TABLE (
  project_count BIGINT,
  unit_count BIGINT,
  storage_used BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
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
