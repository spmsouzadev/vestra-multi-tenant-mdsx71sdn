DO $$
DECLARE
  v_admin_id uuid;
  v_builder_id uuid;
  v_owner_user_id uuid;
  
  v_tenant_vestra uuid;
  v_tenant_global uuid;

  v_proj_vestra1 uuid;
  v_proj_vestra2 uuid;
  v_proj_global uuid;

  v_owner_carlos uuid;

  v_unit_101 uuid;
  v_unit_102 uuid;
  v_unit_103 uuid;
  v_unit_104 uuid;
  v_unit_105 uuid;

  v_cat_estrutura uuid;
  v_cat_eletrica uuid;
  v_cat_hidraulica uuid;

  v_doc_planta uuid;
  v_doc_memorial uuid;
  v_doc_manual uuid;
  v_doc_termo uuid;
BEGIN
  -- 1. Setup Auth Users (Admin, Owner)
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@example.com';
  IF v_admin_id IS NULL THEN
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@example.com',
      crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Master Admin", "role": "MASTER"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;

  SELECT id INTO v_owner_user_id FROM auth.users WHERE email = 'owner@example.com';
  IF v_owner_user_id IS NULL THEN
    v_owner_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_owner_user_id, '00000000-0000-0000-0000-000000000000', 'owner@example.com',
      crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Carlos Oliveira", "role": "OWNER"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;

  -- 2. Setup Tenants
  SELECT id INTO v_tenant_vestra FROM public.tenants WHERE cnpj = '12.345.678/0001-90';
  IF v_tenant_vestra IS NULL THEN
    SELECT id INTO v_tenant_vestra FROM public.tenants WHERE name = 'Vestra';
    IF v_tenant_vestra IS NULL THEN
      v_tenant_vestra := gen_random_uuid();
      INSERT INTO public.tenants (id, name, cnpj, status, primary_color)
      VALUES (v_tenant_vestra, 'Vestra', '12.345.678/0001-90', 'ACTIVE', '#1e40af');
    ELSE
      UPDATE public.tenants SET cnpj = '12.345.678/0001-90', primary_color = '#1e40af' WHERE id = v_tenant_vestra;
    END IF;
  END IF;

  SELECT id INTO v_tenant_global FROM public.tenants WHERE cnpj = '98.765.432/0001-21';
  IF v_tenant_global IS NULL THEN
    v_tenant_global := gen_random_uuid();
    INSERT INTO public.tenants (id, name, cnpj, status, primary_color)
    VALUES (v_tenant_global, 'Global Construtora', '98.765.432/0001-21', 'ACTIVE', '#15803d');
  END IF;

  -- 3. Setup Auth User (Builder Admin) with Tenant Link
  SELECT id INTO v_builder_id FROM auth.users WHERE email = 'ana@vestra.com';
  IF v_builder_id IS NULL THEN
    v_builder_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_builder_id, '00000000-0000-0000-0000-000000000000', 'ana@vestra.com',
      crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', json_build_object('name', 'Ana Vestra', 'role', 'ADMIN', 'tenantId', v_tenant_vestra),
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    UPDATE auth.users 
    SET raw_user_meta_data = json_build_object('name', 'Ana Vestra', 'role', 'ADMIN', 'tenantId', v_tenant_vestra)
    WHERE id = v_builder_id;
  END IF;

  -- 4. Setup Projects
  SELECT id INTO v_proj_vestra1 FROM public.projects WHERE name = 'Residencial Vestra' AND tenant_id = v_tenant_vestra;
  IF v_proj_vestra1 IS NULL THEN
    v_proj_vestra1 := gen_random_uuid();
    INSERT INTO public.projects (id, tenant_id, name, city, state, manager, status, phase, total_units, address)
    VALUES (v_proj_vestra1, v_tenant_vestra, 'Residencial Vestra', 'São Paulo', 'SP', 'Ana Vestra', 'Em Obras', 'Alvenaria', 50, 'Av. Paulista, 1000');
  ELSE
    UPDATE public.projects SET status='Em Obras', phase='Alvenaria', total_units=50 WHERE id = v_proj_vestra1;
  END IF;

  SELECT id INTO v_proj_vestra2 FROM public.projects WHERE name = 'Vestra Tower' AND tenant_id = v_tenant_vestra;
  IF v_proj_vestra2 IS NULL THEN
    v_proj_vestra2 := gen_random_uuid();
    INSERT INTO public.projects (id, tenant_id, name, city, state, manager, status, phase, total_units, address)
    VALUES (v_proj_vestra2, v_tenant_vestra, 'Vestra Tower', 'Campinas', 'SP', 'Ana Vestra', 'Pronto', 'Entregue', 100, 'Av. Brasil, 500');
  END IF;

  SELECT id INTO v_proj_global FROM public.projects WHERE name = 'Global Heights' AND tenant_id = v_tenant_global;
  IF v_proj_global IS NULL THEN
    v_proj_global := gen_random_uuid();
    INSERT INTO public.projects (id, tenant_id, name, city, state, manager, status, phase, total_units, address)
    VALUES (v_proj_global, v_tenant_global, 'Global Heights', 'Rio de Janeiro', 'RJ', 'João Global', 'Lançamento', 'Fundação', 80, 'Av. Atlântica, 100');
  END IF;

  -- 5. Setup Owner linked to User
  SELECT id INTO v_owner_carlos FROM public.owners WHERE email = 'owner@example.com';
  IF v_owner_carlos IS NULL THEN
    v_owner_carlos := gen_random_uuid();
    INSERT INTO public.owners (id, name, email, user_id)
    VALUES (v_owner_carlos, 'Carlos Oliveira', 'owner@example.com', v_owner_user_id);
  END IF;

  -- 6. Setup Units for Residencial Vestra
  SELECT id INTO v_unit_101 FROM public.units WHERE project_id = v_proj_vestra1 AND number = '101' AND block = 'A';
  IF v_unit_101 IS NULL THEN
    v_unit_101 := gen_random_uuid();
    INSERT INTO public.units (id, project_id, owner_id, block, number, floor, status, bedrooms, bathrooms, area, price)
    VALUES (v_unit_101, v_proj_vestra1, v_owner_carlos, 'A', '101', '10', 'SOLD', 3, 2, 85.5, 750000.00);
  ELSE
    UPDATE public.units SET owner_id = v_owner_carlos, status = 'SOLD' WHERE id = v_unit_101;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.units WHERE project_id = v_proj_vestra1 AND number = '102' AND block = 'A') THEN
    INSERT INTO public.units (project_id, block, number, floor, status, bedrooms, bathrooms, area, price)
    VALUES (v_proj_vestra1, 'A', '102', '10', 'AVAILABLE', 2, 1, 65.0, 550000.00);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.units WHERE project_id = v_proj_vestra1 AND number = '103' AND block = 'A') THEN
    INSERT INTO public.units (project_id, block, number, floor, status, bedrooms, bathrooms, area, price)
    VALUES (v_proj_vestra1, 'A', '103', '10', 'RESERVED', 2, 1, 65.0, 560000.00);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.units WHERE project_id = v_proj_vestra1 AND number = '201' AND block = 'B') THEN
    INSERT INTO public.units (project_id, block, number, floor, status, bedrooms, bathrooms, area, price)
    VALUES (v_proj_vestra1, 'B', '201', '2', 'AVAILABLE', 1, 1, 45.0, 350000.00);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.units WHERE project_id = v_proj_vestra1 AND number = '202' AND block = 'B') THEN
    INSERT INTO public.units (project_id, block, number, floor, status, bedrooms, bathrooms, area, price)
    VALUES (v_proj_vestra1, 'B', '202', '2', 'SOLD', 3, 2, 90.0, 800000.00);
  END IF;

  -- 7. Setup Warranty Categories
  SELECT id INTO v_cat_estrutura FROM public.warranty_categories WHERE tenant_id = v_tenant_vestra AND name = 'Estrutura';
  IF v_cat_estrutura IS NULL THEN
    v_cat_estrutura := gen_random_uuid();
    INSERT INTO public.warranty_categories (id, tenant_id, name, term_months)
    VALUES (v_cat_estrutura, v_tenant_vestra, 'Estrutura', 60);
  ELSE
    UPDATE public.warranty_categories SET term_months = 60 WHERE id = v_cat_estrutura;
  END IF;

  SELECT id INTO v_cat_eletrica FROM public.warranty_categories WHERE tenant_id = v_tenant_vestra AND name = 'Elétrica';
  IF v_cat_eletrica IS NULL THEN
    v_cat_eletrica := gen_random_uuid();
    INSERT INTO public.warranty_categories (id, tenant_id, name, term_months)
    VALUES (v_cat_eletrica, v_tenant_vestra, 'Elétrica', 12);
  ELSE
    UPDATE public.warranty_categories SET term_months = 12 WHERE id = v_cat_eletrica;
  END IF;

  SELECT id INTO v_cat_hidraulica FROM public.warranty_categories WHERE tenant_id = v_tenant_vestra AND name = 'Hidráulica';
  IF v_cat_hidraulica IS NULL THEN
    v_cat_hidraulica := gen_random_uuid();
    INSERT INTO public.warranty_categories (id, tenant_id, name, term_months)
    VALUES (v_cat_hidraulica, v_tenant_vestra, 'Hidráulica', 24);
  ELSE
    UPDATE public.warranty_categories SET term_months = 24 WHERE id = v_cat_hidraulica;
  END IF;

  -- 8. Setup Unit Warranties
  IF NOT EXISTS (SELECT 1 FROM public.unit_warranties WHERE unit_id = v_unit_101 AND category_id = v_cat_estrutura) THEN
    INSERT INTO public.unit_warranties (unit_id, category_id, start_date, expiration_date, status)
    VALUES (v_unit_101, v_cat_estrutura, (NOW() - interval '6 months')::date, (NOW() + interval '54 months')::date, 'Vigente');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.unit_warranties WHERE unit_id = v_unit_101 AND category_id = v_cat_eletrica) THEN
    INSERT INTO public.unit_warranties (unit_id, category_id, start_date, expiration_date, status)
    VALUES (v_unit_101, v_cat_eletrica, (NOW() - interval '6 months')::date, (NOW() + interval '6 months')::date, 'Vigente');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.unit_warranties WHERE unit_id = v_unit_101 AND category_id = v_cat_hidraulica) THEN
    INSERT INTO public.unit_warranties (unit_id, category_id, start_date, expiration_date, status)
    VALUES (v_unit_101, v_cat_hidraulica, (NOW() - interval '6 months')::date, (NOW() + interval '18 months')::date, 'Vigente');
  END IF;

  -- 9. Setup Documents
  SELECT id INTO v_doc_planta FROM public.documents WHERE project_id = v_proj_vestra1 AND title = 'Planta Baixa - Arquitetura';
  IF v_doc_planta IS NULL THEN
    v_doc_planta := gen_random_uuid();
    INSERT INTO public.documents (id, project_id, title, category, visibility, current_version, file_type, file_size)
    VALUES (v_doc_planta, v_proj_vestra1, 'Planta Baixa - Arquitetura', 'Projetos', 'INTERNAL', 1, 'pdf', 2500000);

    INSERT INTO public.document_versions (document_id, version_number, file_path, file_name, file_size, file_type)
    VALUES (v_doc_planta, 1, 'projects/' || v_proj_vestra1 || '/planta_baixa.pdf', 'planta_baixa.pdf', 2500000, 'application/pdf');
  END IF;

  SELECT id INTO v_doc_memorial FROM public.documents WHERE project_id = v_proj_vestra1 AND title = 'Memorial Descritivo';
  IF v_doc_memorial IS NULL THEN
    v_doc_memorial := gen_random_uuid();
    INSERT INTO public.documents (id, project_id, title, category, visibility, current_version, file_type, file_size)
    VALUES (v_doc_memorial, v_proj_vestra1, 'Memorial Descritivo', 'Documentação', 'INTERNAL', 1, 'pdf', 1200000);

    INSERT INTO public.document_versions (document_id, version_number, file_path, file_name, file_size, file_type)
    VALUES (v_doc_memorial, 1, 'projects/' || v_proj_vestra1 || '/memorial.pdf', 'memorial.pdf', 1200000, 'application/pdf');
  END IF;

  SELECT id INTO v_doc_manual FROM public.documents WHERE unit_id = v_unit_101 AND title = 'Manual do Proprietário';
  IF v_doc_manual IS NULL THEN
    v_doc_manual := gen_random_uuid();
    INSERT INTO public.documents (id, project_id, unit_id, title, category, visibility, current_version, file_type, file_size)
    VALUES (v_doc_manual, v_proj_vestra1, v_unit_101, 'Manual do Proprietário', 'Manuais', 'PUBLIC', 1, 'pdf', 5500000);

    INSERT INTO public.document_versions (document_id, version_number, file_path, file_name, file_size, file_type)
    VALUES (v_doc_manual, 1, 'units/' || v_unit_101 || '/manual.pdf', 'manual.pdf', 5500000, 'application/pdf');
  END IF;

  SELECT id INTO v_doc_termo FROM public.documents WHERE unit_id = v_unit_101 AND title = 'Termo de Entrega de Chaves';
  IF v_doc_termo IS NULL THEN
    v_doc_termo := gen_random_uuid();
    INSERT INTO public.documents (id, project_id, unit_id, title, category, visibility, current_version, file_type, file_size)
    VALUES (v_doc_termo, v_proj_vestra1, v_unit_101, 'Termo de Entrega de Chaves', 'Contratos', 'PUBLIC', 1, 'pdf', 800000);

    INSERT INTO public.document_versions (document_id, version_number, file_path, file_name, file_size, file_type)
    VALUES (v_doc_termo, 1, 'units/' || v_unit_101 || '/termo.pdf', 'termo.pdf', 800000, 'application/pdf');
  END IF;

  -- 10. Setup Billing History
  IF (SELECT count(*) FROM public.billing_history WHERE tenant_id = v_tenant_vestra AND description LIKE 'Mensalidade Seed%') = 0 THEN
    INSERT INTO public.billing_history (tenant_id, invoice_number, amount, status, due_date, paid_at, description)
    VALUES 
      (v_tenant_vestra, 'INV-2026-V1', 1499.00, 'PAID', (NOW() - interval '3 months'), (NOW() - interval '3 months' + interval '2 days'), 'Mensalidade Seed - Mês 1'),
      (v_tenant_vestra, 'INV-2026-V2', 1499.00, 'PAID', (NOW() - interval '2 months'), (NOW() - interval '2 months' + interval '1 days'), 'Mensalidade Seed - Mês 2'),
      (v_tenant_vestra, 'INV-2026-V3', 1499.00, 'PAID', (NOW() - interval '1 months'), (NOW() - interval '1 months' + interval '3 days'), 'Mensalidade Seed - Mês 3');
  END IF;

  IF (SELECT count(*) FROM public.billing_history WHERE tenant_id = v_tenant_global AND description LIKE 'Mensalidade Seed%') = 0 THEN
    INSERT INTO public.billing_history (tenant_id, invoice_number, amount, status, due_date, description)
    VALUES 
      (v_tenant_global, 'INV-2026-G1', 2999.00, 'PENDING', (NOW() + interval '15 days'), 'Mensalidade Seed - Pendente');
  END IF;

END $$;
