-- Create Warranty Categories Table
CREATE TABLE IF NOT EXISTS public.warranty_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    term_years INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Unit Warranties Table
CREATE TABLE IF NOT EXISTS public.unit_warranties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.warranty_categories(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Vigente', -- 'Vigente', 'Expirada', 'Suspensa'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.warranty_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_warranties ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access warranties" ON public.warranty_categories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access unit_warranties" ON public.unit_warranties FOR SELECT USING (auth.role() = 'authenticated');

-- Allow write access to authenticated users (simplified for this task)
CREATE POLICY "Allow write access warranties" ON public.warranty_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access unit_warranties" ON public.unit_warranties FOR ALL USING (auth.role() = 'authenticated');

-- Seed Default Categories for existing tenants
DO $$
DECLARE
    t record;
BEGIN
    FOR t IN SELECT id FROM public.tenants LOOP
        INSERT INTO public.warranty_categories (tenant_id, name, term_years, description)
        VALUES
            (t.id, 'Estrutura', 5, 'Fundação, vigas, pilares e lajes'),
            (t.id, 'Impermeabilização', 5, 'Mantas, ralos e áreas molhadas'),
            (t.id, 'Instalações hidráulicas', 5, 'Tubulações e conexões embutidas'),
            (t.id, 'Instalações elétricas', 5, 'Fios, cabos e quadros'),
            (t.id, 'Revestimentos internos', 3, 'Cerâmicas, azulejos e pisos'),
            (t.id, 'Pintura interna', 2, 'Paredes e tetos'),
            (t.id, 'Esquadrias', 2, 'Portas e janelas de madeira/alumínio'),
            (t.id, 'Louças e metais', 1, 'Torneiras, registros e louças sanitárias')
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;
