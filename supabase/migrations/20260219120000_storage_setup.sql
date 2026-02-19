-- Create the storage bucket for tenant logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('tenant-logos', 'tenant-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for tenant-logos bucket
-- We use a specific name to avoid conflicts with other policies

-- Allow public read access to all files in the bucket
DROP POLICY IF EXISTS "Public Access tenant-logos" ON storage.objects;
CREATE POLICY "Public Access tenant-logos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'tenant-logos' );

-- Allow authenticated users to upload files
-- ideally this should be restricted to admins, but for now authenticated is enough per requirements
DROP POLICY IF EXISTS "Auth Upload tenant-logos" ON storage.objects;
CREATE POLICY "Auth Upload tenant-logos"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'tenant-logos' AND auth.role() = 'authenticated' );

-- Allow authenticated users to update their files
DROP POLICY IF EXISTS "Auth Update tenant-logos" ON storage.objects;
CREATE POLICY "Auth Update tenant-logos"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'tenant-logos' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete their files
DROP POLICY IF EXISTS "Auth Delete tenant-logos" ON storage.objects;
CREATE POLICY "Auth Delete tenant-logos"
ON storage.objects FOR DELETE
USING ( bucket_id = 'tenant-logos' AND auth.role() = 'authenticated' );
