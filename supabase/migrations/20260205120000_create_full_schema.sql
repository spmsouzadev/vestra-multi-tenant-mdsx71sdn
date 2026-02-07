-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Tenants Table
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    logo_url TEXT,
    primary_color TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    manager TEXT NOT NULL,
    address TEXT,
    total_units INTEGER DEFAULT 0,
    delivered_units INTEGER DEFAULT 0,
    open_issues INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    delivery_date DATE,
    status TEXT NOT NULL,
    phase TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Owners Table
CREATE TABLE IF NOT EXISTS public.owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    document TEXT,
    user_id UUID REFERENCES auth.users(id), -- Link to auth user if they have login
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Units Table
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.owners(id), -- Can be null
    block TEXT NOT NULL,
    number TEXT NOT NULL,
    floor TEXT NOT NULL,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    typology TEXT,
    area NUMERIC,
    price NUMERIC,
    status TEXT NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE, -- Optional, if linked to specific unit
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'Projetos', 'Habite-se', 'ART', 'Manuais', 'Garantias', 'Vistorias'
    visibility TEXT NOT NULL DEFAULT 'INTERNAL', -- 'INTERNAL', 'SHARED', 'PUBLIC'
    current_version INTEGER NOT NULL DEFAULT 1,
    file_type TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create Document Versions Table
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Insert Storage Bucket for Documents if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users for now (refined by app logic)
CREATE POLICY "Allow read access" ON public.documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access versions" ON public.document_versions FOR SELECT USING (auth.role() = 'authenticated');

-- Allow insert/update/delete for authenticated users (refined by app logic)
CREATE POLICY "Allow all access" ON public.documents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access versions" ON public.document_versions FOR ALL USING (auth.role() = 'authenticated');

-- Storage Policies
CREATE POLICY "Give access to authenticated users" ON storage.objects FOR ALL USING (auth.role() = 'authenticated');

-- Seed Data (Matching Mock Data for testing)
-- We use fixed UUIDs for testing consistency if possible, but here we just insert generic data
-- For the purpose of the task, we rely on the app creating data or users manually adding it.
