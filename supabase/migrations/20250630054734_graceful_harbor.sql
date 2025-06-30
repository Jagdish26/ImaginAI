/*
  # Create subscription tiers table

  1. New Tables
    - `subscription_tiers`
      - `id` (uuid, primary key)
      - `name` (text, subscription tier name)
      - `price_monthly` (integer, price in cents/paise)
      - `transforms_per_week` (integer, weekly transformation limit)
      - `features` (jsonb, additional features as JSON)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `subscription_tiers` table
    - Add policy for public read access (anyone can view tiers)
    - Add policy for authenticated admin users to manage tiers

  3. Initial Data
    - Insert Free and Pro tier data
*/

CREATE TABLE IF NOT EXISTS subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  price_monthly integer NOT NULL DEFAULT 0,
  transforms_per_week integer NOT NULL DEFAULT 0,
  features jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read subscription tiers (public information)
CREATE POLICY "Anyone can view subscription tiers"
  ON subscription_tiers
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users with admin role can modify tiers
CREATE POLICY "Only admins can manage subscription tiers"
  ON subscription_tiers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert initial subscription tiers
INSERT INTO subscription_tiers (name, price_monthly, transforms_per_week, features) VALUES
  ('Free', 0, 5, '{"description": "Perfect for trying out the magic", "support": "Community", "resolution": "Standard", "priority": false}'),
  ('Pro', 30000, 20, '{"description": "For creators and enthusiasts", "support": "Email", "resolution": "High", "priority": true, "api_access": true}')
ON CONFLICT (name) DO NOTHING;