-- Create full schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants Table (Base Schema)
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table (Extension of auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'ADMIN', -- MASTER, ADMIN, OWNER
  tenant_id UUID REFERENCES public.tenants(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  manager TEXT NOT NULL,
  address TEXT NOT NULL,
  total_units INTEGER DEFAULT 0,
  delivered_units INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  delivery_date TIMESTAMPTZ,
  actual_delivery_date TIMESTAMPTZ,
  status TEXT DEFAULT 'PLANNING',
  phase TEXT DEFAULT 'PRE_SALES',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Owners Table
CREATE TABLE IF NOT EXISTS public.owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  document TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units Table
CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  block TEXT,
  number TEXT NOT NULL,
  floor TEXT,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  typology TEXT,
  area NUMERIC,
  price NUMERIC,
  status TEXT DEFAULT 'AVAILABLE',
  owner_id UUID REFERENCES public.owners(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_type TEXT,
  business_name TEXT NOT NULL,
  cnpj TEXT,
  manager_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  location TEXT,
  units_per_month TEXT,
  plan TEXT,
  status TEXT DEFAULT 'NEW',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.units(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  version INTEGER DEFAULT 1,
  tags TEXT[],
  visibility TEXT DEFAULT 'INTERNAL',
  is_visible_to_owners BOOLEAN DEFAULT FALSE,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  file_size BIGINT DEFAULT 0,
  type TEXT
);

-- Document Versions Table
CREATE TABLE IF NOT EXISTS public.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_name TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Warranty Categories Table
CREATE TABLE IF NOT EXISTS public.warranty_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  term_months INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unit Warranties Table
CREATE TABLE IF NOT EXISTS public.unit_warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.warranty_categories(id),
  start_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  status TEXT DEFAULT 'Vigente',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Logs Table
CREATE TABLE IF NOT EXISTS public.document_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  user_id UUID,
  user_name TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  details TEXT
);

-- Tenant Stats Function
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
