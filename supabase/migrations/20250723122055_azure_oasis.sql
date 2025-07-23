/*
  # Add role column to user_profiles table

  1. Changes
    - Add `role` column to user_profiles table with default 'Student'
    - Update existing records to have proper roles

  2. Security
    - Maintain existing RLS policies
*/

-- Add role column to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role text NOT NULL DEFAULT 'Student';
  END IF;
END $$;