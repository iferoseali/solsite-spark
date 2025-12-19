-- Create storage bucket for pre-rendered sites
INSERT INTO storage.buckets (id, name, public)
VALUES ('pre-rendered-sites', 'pre-rendered-sites', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to pre-rendered sites
CREATE POLICY "Pre-rendered sites are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'pre-rendered-sites');

-- Allow service role to upload pre-rendered sites
CREATE POLICY "Service role can upload pre-rendered sites"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'pre-rendered-sites');

-- Allow service role to update pre-rendered sites  
CREATE POLICY "Service role can update pre-rendered sites"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'pre-rendered-sites');

-- Allow service role to delete pre-rendered sites
CREATE POLICY "Service role can delete pre-rendered sites"
ON storage.objects
FOR DELETE
USING (bucket_id = 'pre-rendered-sites');