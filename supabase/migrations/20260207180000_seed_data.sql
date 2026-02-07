-- Seed Data for Testing (using safe inserts to avoid conflicts)

-- Tenants
INSERT INTO public.tenants (id, name, cnpj, status, logo_url, primary_color)
VALUES 
    ('a1111111-1111-4111-a111-111111111111', 'Alpha Construções', '12.345.678/0001-90', 'ACTIVE', 'https://img.usecurling.com/i?q=building&color=blue', '#2563EB'),
    ('a2222222-2222-4222-a222-222222222222', 'Beta Incorporadora', '98.765.432/0001-10', 'ACTIVE', 'https://img.usecurling.com/i?q=crane&color=orange', '#EAB308'),
    ('a3333333-3333-4333-a333-333333333333', 'Gamma Engenharia', '45.123.789/0001-55', 'SUSPENDED', 'https://img.usecurling.com/i?q=helmet&color=gray', '#64748B')
ON CONFLICT (id) DO NOTHING;

-- Projects
INSERT INTO public.projects (id, tenant_id, name, city, state, manager, address, total_units, delivered_units, open_issues, completion_percentage, delivery_date, status, phase, image_url)
VALUES
    ('b1111111-1111-4111-b111-111111111111', 'a1111111-1111-4111-a111-111111111111', 'Residencial Horizonte', 'São Paulo', 'SP', 'Eng. Ricardo Silva', 'Av. Paulista, 1000, São Paulo', 40, 0, 5, 75, '2026-12-01', 'CONSTRUCTION', 'EXECUTION', 'https://img.usecurling.com/p/400/300?q=modern%20apartment%20building'),
    ('b2222222-2222-4222-b222-222222222222', 'a1111111-1111-4111-a111-111111111111', 'Torre Crystal', 'São Paulo', 'SP', 'Arq. Julia Santos', 'Rua Oscar Freire, 500, São Paulo', 20, 0, 0, 10, '2027-06-01', 'PLANNING', 'PRE_SALES', 'https://img.usecurling.com/p/400/300?q=luxury%20condo'),
    ('b3333333-3333-4333-b333-333333333333', 'a2222222-2222-4222-a222-222222222222', 'Vila Verde', 'Campinas', 'SP', 'Eng. Pedro Costa', 'Rua das Flores, 20, Campinas', 100, 100, 2, 100, '2025-10-01', 'DELIVERED', 'POST_DELIVERY', 'https://img.usecurling.com/p/400/300?q=suburban%20houses')
ON CONFLICT (id) DO NOTHING;

-- Owners
INSERT INTO public.owners (id, name, email, phone, document)
VALUES
    ('c1111111-1111-4111-c111-111111111111', 'Roberto Proprietário', 'roberto@gmail.com', '(11) 99999-9999', '123.456.789-00'),
    ('c2222222-2222-4222-c222-222222222222', 'Fernanda Lima', 'fernanda@gmail.com', '(11) 98888-8888', '321.654.987-00')
ON CONFLICT (id) DO NOTHING;

-- Units
INSERT INTO public.units (id, project_id, block, number, floor, bedrooms, bathrooms, typology, area, price, status, owner_id)
VALUES
    ('d1111111-1111-4111-d111-111111111111', 'b1111111-1111-4111-b111-111111111111', 'A', '101', '1º', 2, 1, '2D', 65, 450000, 'SOLD', 'c1111111-1111-4111-c111-111111111111'),
    ('d2222222-2222-4222-d222-222222222222', 'b1111111-1111-4111-b111-111111111111', 'A', '102', '1º', 2, 1, '2D', 65, 450000, 'AVAILABLE', NULL),
    ('d3333333-3333-4333-d333-333333333333', 'b1111111-1111-4111-b111-111111111111', 'A', '103', '1º', 3, 2, '3D', 85, 650000, 'RESERVED', NULL),
    ('d4444444-4444-4444-d444-444444444444', 'b1111111-1111-4111-b111-111111111111', 'B', '201', '2º', 2, 1, '2D', 65, 460000, 'AVAILABLE', NULL),
    ('d5555555-5555-5555-d555-555555555555', 'b1111111-1111-4111-b111-111111111111', 'B', '202', '2º', 1, 1, 'Studio', 40, 300000, 'SOLD', 'c2222222-2222-4222-c222-222222222222'),
    ('d6666666-6666-6666-d666-666666666666', 'b2222222-2222-4222-b222-222222222222', 'Unico', '10', '10º', 4, 3, '4D', 150, 1500000, 'AVAILABLE', NULL),
    ('d7777777-7777-7777-d777-777777777777', 'b2222222-2222-4222-b222-222222222222', 'Unico', '11', '11º', 4, 3, '4D', 150, 1550000, 'AVAILABLE', NULL)
ON CONFLICT (id) DO NOTHING;

-- Documents (Assuming mock file data for display, links won't work without actual storage files)
INSERT INTO public.documents (id, project_id, title, description, category, visibility, current_version, file_type, file_size, created_by)
VALUES
    ('e1111111-1111-4111-e111-111111111111', 'b1111111-1111-4111-b111-111111111111', 'Planta Baixa - Bloco A.pdf', NULL, 'Projetos', 'SHARED', 1, 'pdf', 2516582, NULL),
    ('e2222222-2222-4222-e222-222222222222', 'b1111111-1111-4111-b111-111111111111', 'Alvará de Construção.pdf', NULL, 'Habite-se', 'INTERNAL', 1, 'pdf', 1153433, NULL),
    ('e3333333-3333-4333-e333-333333333333', 'b1111111-1111-4111-b111-111111111111', 'Manual do Proprietário.pdf', NULL, 'Manuais', 'SHARED', 2, 'pdf', 5872025, NULL)
ON CONFLICT (id) DO NOTHING;
