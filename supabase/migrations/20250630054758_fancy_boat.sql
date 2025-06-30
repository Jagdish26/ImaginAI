/*
  # Create transformations table

  1. New Tables
    - `transformations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `original_filename` (text, original file name)
      - `output_url` (text, URL to transformed image)
      - `status` (text, processing status)
      - `created_at` (timestamp)
      - `completed_at` (timestamp)
      - `file_size` (integer, original file size in bytes)
      - `processing_time` (integer, processing time in milliseconds)
      - `style` (text, transformation style applied)

  2. Security
    - Enable RLS on `transformations` table
    - Add policy for users to read their own transformations
    - Add policy for users to create their own transformations
    - Add policy for admins to view all transformations

  3. Indexes
    - Index on user_id for fast user lookups
    - Index on created_at for chronological queries
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS transformations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_filename text NOT NULL,
  output_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  file_size integer,
  processing_time integer,
  style text DEFAULT 'ghibli' CHECK (style IN ('ghibli', 'spirited_away', 'totoro', 'howls_castle')),
  error_message text
);

ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;

-- Users can read their own transformations
CREATE POLICY "Users can read own transformations"
  ON transformations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own transformations
CREATE POLICY "Users can create own transformations"
  ON transformations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own transformations (for status updates)
CREATE POLICY "Users can update own transformations"
  ON transformations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all transformations for analytics
CREATE POLICY "Admins can view all transformations"
  ON transformations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transformations_user_id ON transformations(user_id);
CREATE INDEX IF NOT EXISTS idx_transformations_created_at ON transformations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transformations_status ON transformations(status);
CREATE INDEX IF NOT EXISTS idx_transformations_style ON transformations(style);