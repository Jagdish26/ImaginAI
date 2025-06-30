/*
  # Create user subscriptions table

  1. New Tables
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `tier_id` (uuid, foreign key to subscription_tiers)
      - `status` (text, subscription status)
      - `created_at` (timestamp)
      - `expires_at` (timestamp, null for lifetime subscriptions)
      - `stripe_subscription_id` (text, for payment tracking)

  2. Security
    - Enable RLS on `user_subscriptions` table
    - Add policy for users to read their own subscriptions
    - Add policy for users to create their own subscriptions
    - Add policy for admins to manage all subscriptions

  3. Indexes
    - Index on user_id for fast lookups
    - Index on tier_id for analytics
*/

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier_id uuid REFERENCES subscription_tiers(id) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  stripe_subscription_id text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own subscriptions
CREATE POLICY "Users can create own subscriptions"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions"
  ON user_subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_id ON user_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- Function to automatically assign free tier to new users
CREATE OR REPLACE FUNCTION assign_free_tier_to_new_user()
RETURNS TRIGGER AS $$
DECLARE
  free_tier_id uuid;
BEGIN
  -- Get the free tier ID
  SELECT id INTO free_tier_id FROM subscription_tiers WHERE name = 'Free' LIMIT 1;
  
  -- Insert subscription for new user
  IF free_tier_id IS NOT NULL THEN
    INSERT INTO user_subscriptions (user_id, tier_id, status)
    VALUES (NEW.id, free_tier_id, 'active');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to assign free tier to new users
CREATE OR REPLACE TRIGGER assign_free_tier_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_free_tier_to_new_user();