-- Create storage bucket for project logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-logos', 'project-logos', true);

-- Allow anyone to view logos (public bucket)
CREATE POLICY "Public logo access"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-logos');

-- Allow authenticated users to upload logos
CREATE POLICY "Users can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-logos');

-- Allow users to update their logos
CREATE POLICY "Users can update logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-logos');

-- Allow users to delete logos
CREATE POLICY "Users can delete logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-logos');