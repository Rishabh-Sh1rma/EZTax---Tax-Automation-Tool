/*
  # Add INSERT policy for users table

  1. Changes
    - Add new RLS policy to allow users to insert their own data during registration
    
  2. Security
    - Policy ensures users can only insert rows where the ID matches their auth ID
    - Maintains security while enabling user registration
*/

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);