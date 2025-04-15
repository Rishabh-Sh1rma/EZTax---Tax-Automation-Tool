/*
  # Initial Schema Setup for Tax Buddy Application

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - first_name (text)
      - last_name (text)
      - mobile (text)
      - role (text)
      - created_at (timestamp)
    
    - user_details
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - age (integer)
      - gender (text)
      - address (text)
      - work_type (text)
      - created_at (timestamp)
    
    - tax_calculations
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - basic_salary (numeric)
      - other_income (numeric)
      - special_allowance (numeric)
      - rent_paid (numeric)
      - hra_received (numeric)
      - lta (numeric)
      - da_received (numeric)
      - metro_city (boolean)
      - education_loan_interest (numeric)
      - home_loan_interest (numeric)
      - investment_funds (text)
      - investment_amount (numeric)
      - medical_insurance_below_60 (integer)
      - medical_insurance_above_60 (integer)
      - insurance_amount_below_60 (numeric)
      - insurance_amount_above_60 (numeric)
      - created_at (timestamp)
      - tax_year (text)
      - regime (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  mobile text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create user_details table
CREATE TABLE user_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  age integer,
  gender text,
  address text,
  work_type text,
  created_at timestamptz DEFAULT now()
);

-- Create tax_calculations table
CREATE TABLE tax_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
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
  created_at timestamptz DEFAULT now(),
  tax_year text,
  regime text
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tax calculations"
  ON tax_calculations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax calculations"
  ON tax_calculations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tax calculations"
  ON tax_calculations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create admin policies
CREATE POLICY "Admins can view all data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view all details"
  ON user_details
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Admins can view all tax calculations"
  ON tax_calculations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));