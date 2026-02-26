DO $$
DECLARE
  v_tenant_id uuid;
  v_user_id uuid;
  v_project_id uuid;
BEGIN
  -- 1. Create Tenant
  IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE name = 'Vestra') THEN
    v_tenant_id := gen_random_uuid();
    INSERT INTO public.tenants (id, name, cnpj, status, primary_color)
    VALUES (v_tenant_id, 'Vestra', '12.345.678/0001-99', 'ACTIVE', '#0f172a');
  ELSE
    SELECT id INTO v_tenant_id FROM public.tenants WHERE name = 'Vestra' LIMIT 1;
  END IF;

  -- 2. Create User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ana@vestra.com') THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'ana@vestra.com',
      crypt('password123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      json_build_object('name', 'Ana Vestra', 'role', 'ADMIN', 'tenantId', v_tenant_id),
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  ELSE
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'ana@vestra.com' LIMIT 1;
    UPDATE auth.users 
    SET raw_user_meta_data = json_build_object('name', 'Ana Vestra', 'role', 'ADMIN', 'tenantId', v_tenant_id)
    WHERE id = v_user_id;
  END IF;

  -- 3. Create Project
  IF NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Residencial Vestra' AND tenant_id = v_tenant_id) THEN
    v_project_id := gen_random_uuid();
    INSERT INTO public.projects (
      id, tenant_id, name, city, state, manager, status, phase, completion_percentage, total_units, delivered_units, address, image_url
    ) VALUES (
      v_project_id,
      v_tenant_id,
      'Residencial Vestra',
      'São Paulo',
      'SP',
      'Ana Vestra',
      'IN_PROGRESS',
      'Alvenaria',
      45,
      120,
      0,
      'Av. Paulista, 1000',
      'https://img.usecurling.com/p/800/600?q=modern%20building'
    );
  END IF;
END $$;
