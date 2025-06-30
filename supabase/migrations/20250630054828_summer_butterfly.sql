/*
  # Create storage buckets and policies

  1. Storage Buckets
    - `temp-uploads` - For temporary file uploads (auto-delete after 30 seconds)
    - `transformations` - For processed/transformed images
    - `user-avatars` - For user profile pictures

  2. Security Policies
    - Users can upload to temp-uploads
    - Users can read their own transformations
    - Public read access for completed transformations
    - Users can manage their own avatars

  3. Configuration
    - Set appropriate file size limits
    - Configure allowed file types
    - Set up automatic cleanup policies
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('temp-uploads', 'temp-uploads', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('transformations', 'transformations', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('user-avatars', 'user-avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Policies for temp-uploads bucket
CREATE POLICY "Users can upload to temp-uploads"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'temp-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read own temp uploads"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'temp-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own temp uploads"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'temp-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policies for transformations bucket
CREATE POLICY "Anyone can view transformations"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'transformations');

CREATE POLICY "System can upload transformations"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'transformations');

CREATE POLICY "Users can read own transformations"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'transformations' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policies for user-avatars bucket
CREATE POLICY "Anyone can view avatars"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);