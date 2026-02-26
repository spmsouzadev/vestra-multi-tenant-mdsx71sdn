-- Migration: Reset and Seed PRIME Engenharia
-- Timestamp: 2026-02-26T22:30:00.000Z

-- 1. Ensure project_issues table exists
CREATE TABLE IF NOT EXISTS public.project_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'OPEN',
  priority TEXT DEFAULT 'MEDIUM',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.project_issues ENABLE ROW LEVEL SECURITY;
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'project_issues' AND policyname = 'Allow read access project_issues'
  ) THEN
    CREATE POLICY "Allow read access project_issues" ON public.project_issues FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'project_issues' AND policyname = 'Allow write access project_issues'
  ) THEN
    CREATE POLICY "Allow write access project_issues" ON public.project_issues FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- 2. Data Cleanup and Seeding
DO $$
DECLARE
  v_tenant_prime uuid := gen_random_uuid();
  v_proj_matrinchan uuid := gen_random_uuid();
  v_proj_acqua uuid := gen_random_uuid();
  
  v_cat_estrutura uuid := gen_random_uuid();
  v_cat_hidraulica uuid := gen_random_uuid();
  v_cat_eletrica uuid := gen_random_uuid();
  
  i integer;
  u_id uuid;
  o_id uuid;
  doc_id uuid;
BEGIN
  -- 1. Data Cleanup (Reverse order of dependencies)
  DELETE FROM public.document_versions;
  DELETE FROM public.document_logs;
  DELETE FROM public.documents;
  DELETE FROM public.unit_warranties;
  DELETE FROM public.warranty_categories;
  DELETE FROM public.project_issues;
  DELETE FROM public.units;
  DELETE FROM public.projects;
  DELETE FROM public.owners;
  DELETE FROM public.billing_history;
  DELETE FROM public.leads;
  DELETE FROM public.audit_logs;
  DELETE FROM public.tenants;
  
  DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
  DELETE FROM auth.users WHERE id NOT IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');

  -- 2. Tenant Creation: PRIME Engenharia
  INSERT INTO public.tenants (id, name, cnpj, status, primary_color)
  VALUES (v_tenant_prime, 'PRIME Engenharia', '11.222.333/0001-44', 'ACTIVE', '#0f172a');

  -- Create a tenant admin user
  DECLARE
    v_admin_id uuid := gen_random_uuid();
  BEGIN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@primeengenharia.com.br',
      crypt('prime123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', json_build_object('name', 'Admin PRIME', 'role', 'ADMIN', 'tenantId', v_tenant_prime),
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END;

  -- 3. Warranty Categories
  INSERT INTO public.warranty_categories (id, tenant_id, name, term_months, description) VALUES
  (v_cat_estrutura, v_tenant_prime, 'Estrutura', 60, 'Garantia estrutural do imóvel'),
  (v_cat_hidraulica, v_tenant_prime, 'Hidráulica', 24, 'Instalações hidráulicas e sanitárias'),
  (v_cat_eletrica, v_tenant_prime, 'Elétrica', 24, 'Instalações elétricas');

  -- 4. Project 1: Edifício Matrinchan
  INSERT INTO public.projects (id, tenant_id, name, city, state, manager, status, phase, total_units, address, open_issues)
  VALUES (v_proj_matrinchan, v_tenant_prime, 'Edifício Matrinchan', 'São Paulo', 'SP', 'Carlos Gerente', 'ACTIVE', 'Entrega', 100, 'Rua das Flores, 123', 2);

  -- Project-level documents
  doc_id := gen_random_uuid();
  INSERT INTO public.documents (id, project_id, title, category, visibility, current_version, file_type, file_size)
  VALUES (doc_id, v_proj_matrinchan, 'Memorial Descritivo', 'Documentação', 'PUBLIC', 1, 'pdf', 1500000);
  INSERT INTO public.document_versions (document_id, version_number, file_path, file_name, file_size, file_type)
  VALUES (doc_id, 1, 'projects/' || v_proj_matrinchan || '/memorial.pdf', 'memorial.pdf', 1500000, 'application/pdf');

  doc_id := gen_random_uuid();
  INSERT INTO public.documents (id, project_id, title, category, visibility, current_version, file_type, file_size)
  VALUES (doc_id, v_proj_matrinchan, 'Planta Humanizada', 'Projetos', 'PUBLIC', 1, 'pdf', 2500000);
  INSERT INTO public.document_versions (document_id, version_number, file_path, file_name, file_size, file_type)
  VALUES (doc_id, 1, 'projects/' || v_proj_matrinchan || '/planta.pdf', 'planta.pdf', 2500000, 'application/pdf');

  -- Issues for Matrinchan
  INSERT INTO public.project_issues (project_id, description, status, priority)
  VALUES 
  (v_proj_matrinchan, 'Pintura descascando no hall de entrada', 'OPEN', 'MEDIUM'),
  (v_proj_matrinchan, 'Portão da garagem com ruído', 'OPEN', 'HIGH');

  -- Matrinchan Units and Owners
  FOR i IN 1..100 LOOP
    u_id := gen_random_uuid();
    
    IF i <= 5 THEN
      -- Create Auth User for Owner
      DECLARE
        v_owner_user_id uuid := gen_random_uuid();
      BEGIN
        INSERT INTO auth.users (
          id, instance_id, email, encrypted_password, email_confirmed_at,
          created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
          is_super_admin, role, aud,
          confirmation_token, recovery_token, email_change_token_new,
          email_change, email_change_token_current,
          phone, phone_change, phone_change_token, reauthentication_token
        ) VALUES (
          v_owner_user_id, '00000000-0000-0000-0000-000000000000', 'proprietario.m' || i || '@example.com',
          crypt('senha123', gen_salt('bf')), NOW(), NOW(), NOW(),
          '{"provider": "email", "providers": ["email"]}', json_build_object('name', 'Proprietário Matrinchan ' || i, 'role', 'OWNER'),
          false, 'authenticated', 'authenticated',
          '', '', '', '', '', NULL, '', '', ''
        );

        o_id := gen_random_uuid();
        INSERT INTO public.owners (id, name, email, user_id)
        VALUES (o_id, 'Proprietário Matrinchan ' || i, 'proprietario.m' || i || '@example.com', v_owner_user_id);
        
        INSERT INTO public.units (id, project_id, owner_id, block, number, floor, status, bedrooms, bathrooms, area, price)
        VALUES (u_id, v_proj_matrinchan, o_id, 'Único', i::text, ((i-1)/4 + 1)::text, 'SOLD', 2, 1, 65.0, 500000.00);

        -- Warranties
        INSERT INTO public.unit_warranties (unit_id, category_id, start_date, expiration_date, status)
        VALUES 
        (u_id, v_cat_estrutura, CURRENT_DATE, CURRENT_DATE + interval '5 years', 'Vigente'),
        (u_id, v_cat_hidraulica, CURRENT_DATE, CURRENT_DATE + interval '2 years', 'Vigente'),
        (u_id, v_cat_eletrica, CURRENT_DATE, CURRENT_DATE + interval '2 years', 'Vigente');

        -- Unit Document
        doc_id := gen_random_uuid();
        INSERT INTO public.documents (id, project_id, unit_id, title, category, visibility, current_version, file_type, file_size)
        VALUES (doc_id, v_proj_matrinchan, u_id, 'Manual do Proprietário', 'Manuais', 'PUBLIC', 1, 'pdf', 3000000);
        INSERT INTO public.document_versions (document_id, version_number, file_path, file_name, file_size, file_type)
        VALUES (doc_id, 1, 'units/' || u_id || '/manual.pdf', 'manual.pdf', 3000000, 'application/pdf');

      END;
    ELSE
      INSERT INTO public.units (id, project_id, block, number, floor, status, bedrooms, bathrooms, area, price)
      VALUES (u_id, v_proj_matrinchan, 'Único', i::text, ((i-1)/4 + 1)::text, 'AVAILABLE', 2, 1, 65.0, 500000.00);
    END IF;
  END LOOP;

  -- 5. Project 2: Edifício Acqua Blu
  INSERT INTO public.projects (id, tenant_id, name, city, state, manager, status, phase, total_units, address, open_issues)
  VALUES (v_proj_acqua, v_tenant_prime, 'Edifício Acqua Blu', 'Santos', 'SP', 'Mariana Gerente', 'ACTIVE', 'Entrega', 10, 'Av. da Praia, 456', 1);

  -- Project-level documents
  doc_id := gen_random_uuid();
  INSERT INTO public.documents (id, project_id, title, category, visibility, current_version, file_type, file_size)
  VALUES (doc_id, v_proj_acqua, 'Memorial Descritivo Acqua', 'Documentação', 'PUBLIC', 1, 'pdf', 1800000);
  INSERT INTO public.document_versions (document_id, version_number, file_path, file_name, file_size, file_type)
  VALUES (doc_id, 1, 'projects/' || v_proj_acqua || '/memorial_acqua.pdf', 'memorial_acqua.pdf', 1800000, 'application/pdf');

  doc_id := gen_random_uuid();
  INSERT INTO public.documents (id, project_id, title, category, visibility, current_version, file_type, file_size)
  VALUES (doc_id, v_proj_acqua, 'Projeto Arquitetônico', 'Projetos', 'PUBLIC', 1, 'pdf', 4000000);
  INSERT INTO public.document_versions (document_id, version_number, file_path, file_name, file_size, file_type)
  VALUES (doc_id, 1, 'projects/' || v_proj_acqua || '/arq_acqua.pdf', 'arq_acqua.pdf', 4000000, 'application/pdf');

  -- Issues for Acqua Blu
  INSERT INTO public.project_issues (project_id, description, status, priority)
  VALUES 
  (v_proj_acqua, 'Vazamento na piscina da cobertura', 'OPEN', 'CRITICAL');

  -- Acqua Blu Units and Owners
  FOR i IN 1..10 LOOP
    u_id := gen_random_uuid();
    
    IF i <= 3 THEN
      -- Create Auth User for Owner
      DECLARE
        v_owner_user_id uuid := gen_random_uuid();
      BEGIN
        INSERT INTO auth.users (
          id, instance_id, email, encrypted_password, email_confirmed_at,
          created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
          is_super_admin, role, aud,
          confirmation_token, recovery_token, email_change_token_new,
          email_change, email_change_token_current,
          phone, phone_change, phone_change_token, reauthentication_token
        ) VALUES (
          v_owner_user_id, '00000000-0000-0000-0000-000000000000', 'proprietario.a' || i || '@example.com',
          crypt('senha123', gen_salt('bf')), NOW(), NOW(), NOW(),
          '{"provider": "email", "providers": ["email"]}', json_build_object('name', 'Proprietário Acqua ' || i, 'role', 'OWNER'),
          false, 'authenticated', 'authenticated',
          '', '', '', '', '', NULL, '', '', ''
        );

        o_id := gen_random_uuid();
        INSERT INTO public.owners (id, name, email, user_id)
        VALUES (o_id, 'Proprietário Acqua ' || i, 'proprietario.a' || i || '@example.com', v_owner_user_id);
        
        INSERT INTO public.units (id, project_id, owner_id, block, number, floor, status, bedrooms, bathrooms, area, price)
        VALUES (u_id, v_proj_acqua, o_id, 'A', (100 + i)::text, '1', 'SOLD', 3, 2, 120.0, 1200000.00);

        -- Warranties
        INSERT INTO public.unit_warranties (unit_id, category_id, start_date, expiration_date, status)
        VALUES 
        (u_id, v_cat_estrutura, CURRENT_DATE, CURRENT_DATE + interval '5 years', 'Vigente'),
        (u_id, v_cat_hidraulica, CURRENT_DATE, CURRENT_DATE + interval '2 years', 'Vigente');

        -- Unit Document
        doc_id := gen_random_uuid();
        INSERT INTO public.documents (id, project_id, unit_id, title, category, visibility, current_version, file_type, file_size)
        VALUES (doc_id, v_proj_acqua, u_id, 'Manual do Proprietário Premium', 'Manuais', 'PUBLIC', 1, 'pdf', 5000000);
        INSERT INTO public.document_versions (document_id, version_number, file_path, file_name, file_size, file_type)
        VALUES (doc_id, 1, 'units/' || u_id || '/manual_premium.pdf', 'manual_premium.pdf', 5000000, 'application/pdf');

      END;
    ELSE
      INSERT INTO public.units (id, project_id, block, number, floor, status, bedrooms, bathrooms, area, price)
      VALUES (u_id, v_proj_acqua, 'A', (100 + i)::text, '1', 'AVAILABLE', 3, 2, 120.0, 1200000.00);
    END IF;
  END LOOP;

END $$;
