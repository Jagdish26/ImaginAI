/*
  # Create usage tracking table

  1. New Tables
    - `usage_tracking`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `week_start` (date, start of the week for tracking)
      - `transforms_used` (integer, number of transforms used this week)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `usage_tracking` table
    - Add policy for users to read their own usage
    - Add policy for system to update usage
    - Add policy for admins to view all usage

  3. Constraints
    - Unique constraint on user_id + week_start
    - Check constraint for non-negative transforms_used

  4. Functions
    - Function to get current week usage
    - Function to increment usage counter
*/

CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start date NOT NULL,
  transforms_used integer NOT NULL DEFAULT 0 CHECK (transforms_used >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users can read their own usage tracking
CREATE POLICY "Users can read own usage tracking"
  ON usage_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own usage tracking
CREATE POLICY "Users can create own usage tracking"
  ON usage_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own usage tracking
CREATE POLICY "Users can update own usage tracking"
  ON usage_tracking
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all usage tracking
CREATE POLICY "Admins can view all usage tracking"
  ON usage_tracking
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
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_week_start ON usage_tracking(week_start);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_week ON usage_tracking(user_id, week_start);

-- Function to get the start of the current week (Monday)
CREATE OR REPLACE FUNCTION get_week_start(input_date date DEFAULT CURRENT_DATE)
RETURNS date AS $$
BEGIN
  RETURN input_date - (EXTRACT(DOW FROM input_date)::integer - 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get current week usage for a user
CREATE OR REPLACE FUNCTION get_current_week_usage(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  current_usage integer := 0;
  week_start_date date;
BEGIN
  week_start_date := get_week_start();
  
  SELECT COALESCE(transforms_used, 0) INTO current_usage
  FROM usage_tracking
  WHERE user_id = p_user_id AND week_start = week_start_date;
  
  RETURN current_usage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage counter
CREATE OR REPLACE FUNCTION increment_usage(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  week_start_date date;
  new_usage integer;
BEGIN
  week_start_date := get_week_start();
  
  INSERT INTO usage_tracking (user_id, week_start, transforms_used)
  VALUES (p_user_id, week_start_date, 1)
  ON CONFLICT (user_id, week_start)
  DO UPDATE SET 
    transforms_used = usage_tracking.transforms_used + 1,
    updated_at = now()
  RETURNING transforms_used INTO new_usage;
  
  RETURN new_usage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can perform transformation
CREATE OR REPLACE FUNCTION can_user_transform(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
  current_usage integer;
  user_limit integer;
BEGIN
  -- Get current week usage
  current_usage := get_current_week_usage(p_user_id);
  
  -- Get user's weekly limit from their subscription
  SELECT st.transforms_per_week INTO user_limit
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE us.user_id = p_user_id 
    AND us.status = 'active'
    AND (us.expires_at IS NULL OR us.expires_at > now())
  ORDER BY st.transforms_per_week DESC
  LIMIT 1;
  
  -- Default to free tier if no subscription found
  IF user_limit IS NULL THEN
    SELECT transforms_per_week INTO user_limit
    FROM subscription_tiers
    WHERE name = 'Free'
    LIMIT 1;
  END IF;
  
  RETURN current_usage < user_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;