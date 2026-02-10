-- Update the main tenant name to VESTRA as per rebranding requirements
UPDATE public.tenants
SET name = 'VESTRA',
    primary_color = '#0f172a' -- Setting a professional dark slate color consistent with VESTRA branding
WHERE id = 'a1111111-1111-4111-a111-111111111111';
