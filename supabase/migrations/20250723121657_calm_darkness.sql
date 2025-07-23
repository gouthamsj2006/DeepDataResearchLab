/*
  # Update user profiles schema for HireDeck

  1. Schema Changes
    - Remove `age` and `degree` columns from user_profiles
    - Add `role` column to user_profiles
    - Update existing data to have default role

  2. Security
    - Maintain existing RLS policies
*/

-- Add role column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role text DEFAULT 'Student';
  END IF;
END $$;

-- Remove age column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'age'
  ) THEN
    ALTER TABLE user_profiles DROP COLUMN age;
  END IF;
END $$;

-- Remove degree column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'degree'
  ) THEN
    ALTER TABLE user_profiles DROP COLUMN degree;
  END IF;
END $$;

-- Update existing records to have Student role if null
UPDATE user_profiles SET role = 'Student' WHERE role IS NULL;

-- Make role column NOT NULL
ALTER TABLE user_profiles ALTER COLUMN role SET NOT NULL;