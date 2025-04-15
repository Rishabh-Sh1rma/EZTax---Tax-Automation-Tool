/*
  # Complete Tax Calculator Schema Setup

  1. Tables
    - users: Core user information
    - user_details: Extended user profile information
    - tax_calculations: Tax calculation records
    
  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
    - Ensure proper data isolation between users
    
  3. Changes
    - Drop existing tables and recreate with proper constraints
    - Add comprehensive RLS policies
    - Set up proper foreign key relationships
*/

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  mobile text,
  role text DEFAULT 'user'::text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- User Details Table
CREATE TABLE IF NOT EXISTS user_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  age integer,
  gender text,
  address text,
  work_type text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;

-- Tax Calculations Table
CREATE TABLE IF NOT EXISTS tax_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  basic_salary numeric DEFAULT 0,
  other_income numeric DEFAULT 0,
  special_allowance numeric DEFAULT 0,
  rent_paid numeric DEFAULT 0,
  hra_received numeric DEFAULT 0,
  lta numeric DEFAULT 0,
  da_received numeric DEFAULT 0,
  metro_city boolean DEFAULT false,
  education_loan_interest numeric DEFAULT 0,
  home_loan_interest numeric DEFAULT 0,
  investment_funds text,
  investment_amount numeric DEFAULT 0,
  medical_insurance_below_60 integer DEFAULT 0,
  medical_insurance_above_60 integer DEFAULT 0,
  insurance_amount_below_60 numeric DEFAULT 0,
  insurance_amount_above_60 numeric DEFAULT 0,
  tax_year text,
  regime text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- User Details Policies
CREATE POLICY "Users can view own details"
  ON user_details
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own details"
  ON user_details
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own details"
  ON user_details
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own details"
  ON user_details
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tax Calculations Policies
CREATE POLICY "Users can view own calculations"
  ON tax_calculations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations"
  ON tax_calculations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calculations"
  ON tax_calculations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
  ON tax_calculations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all calculations"
  ON tax_calculations
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');