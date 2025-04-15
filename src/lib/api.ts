import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  mobile: string | null;
  role: string;
}

export interface UserDetails {
  id: string;
  user_id: string;
  age: number | null;
  gender: string | null;
  address: string | null;
  work_type: string | null;
}

export interface TaxCalculation {
  id: string;
  user_id: string;
  basic_salary: number;
  other_income: number;
  special_allowance: number;
  rent_paid: number;
  hra_received: number;
  lta: number;
  da_received: number;
  metro_city: boolean;
  education_loan_interest: number;
  home_loan_interest: number;
  investment_funds: string | null;
  investment_amount: number;
  medical_insurance_below_60: number;
  medical_insurance_above_60: number;
  insurance_amount_below_60: number;
  insurance_amount_above_60: number;
  tax_year: string;
  regime: 'old' | 'new';
  created_at: string;
}

// User Profile Functions
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('users')
    .update(profile)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// User Details Functions
export const getUserDetails = async (): Promise<UserDetails | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_details')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const upsertUserDetails = async (details: Partial<UserDetails>): Promise<UserDetails> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_details')
    .upsert({ user_id: user.id, ...details })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Tax Calculations Functions
export const getTaxCalculations = async (): Promise<TaxCalculation[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('tax_calculations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const saveTaxCalculation = async (calculation: Omit<TaxCalculation, 'id' | 'user_id' | 'created_at'>): Promise<TaxCalculation> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('tax_calculations')
    .insert([{ user_id: user.id, ...calculation }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTaxCalculation = async (id: string, calculation: Partial<TaxCalculation>): Promise<TaxCalculation> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('tax_calculations')
    .update(calculation)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTaxCalculation = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('tax_calculations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
};