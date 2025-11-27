-- Add photo_url column to residents table
ALTER TABLE public.residents
ADD COLUMN photo_url TEXT;

-- Create storage bucket for official photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('official-photos', 'official-photos', true);

-- Storage policies for official photos
CREATE POLICY "Official photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'official-photos');

CREATE POLICY "Authenticated users can upload official photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'official-photos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update official photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'official-photos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete official photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'official-photos' AND
  auth.role() = 'authenticated'
);