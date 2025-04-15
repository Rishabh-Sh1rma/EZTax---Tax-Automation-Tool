import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

interface TaxCalculationForm {
  basic_salary: number | '';
  other_income: number | '';
  special_allowance: number | '';
  rent_paid: number | '';
  hra_received: number | '';
  lta: number | '';
  da_received: number | '';
  metro_city: boolean;
  education_loan_interest: number | '';
  home_loan_interest: number | '';
  investment_funds: string;
  investment_amount: number | '';
  medical_insurance_below_60: number | '';
  medical_insurance_above_60: number | '';
  insurance_amount_below_60: number | '';
  insurance_amount_above_60: number | '';
  tax_year: string;
  regime: 'old' | 'new';
}

const initialFormState: TaxCalculationForm = {
  basic_salary: '',
  other_income: '',
  special_allowance: '',
  rent_paid: '',
  hra_received: '',
  lta: '',
  da_received: '',
  metro_city: false,
  education_loan_interest: '',
  home_loan_interest: '',
  investment_funds: 'NONE',
  investment_amount: '',
  medical_insurance_below_60: '',
  medical_insurance_above_60: '',
  insurance_amount_below_60: '',
  insurance_amount_above_60: '',
  tax_year: '2024-25',
  regime: 'new'
};

export default function TaxCalculator() {
  const [form, setForm] = useState<TaxCalculationForm>(initialFormState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to save tax calculations');
        navigate('/login');
        return;
      }

      const finalData = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, value === '' ? 0 : value])
      );

      const { error } = await supabase
        .from('tax_calculations')
        .insert([{ user_id: user.id, ...finalData }]);

      if (error) throw error;

      toast.success('Tax calculation saved successfully!');
      setForm(initialFormState);
      navigate('/summary');
    } catch (error) {
      toast.error('Error saving tax calculation');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Tax Calculator</h1>
        <form onSubmit={handleSubmit} className="space-y-10 bg-white p-6 rounded-xl shadow-xl">
          {/* Income Details */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Income Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Basic Salary (per annum)', name: 'basic_salary' },
                { label: 'Other Income', name: 'other_income' }
              ].map(({ label, name }) => (
                <label key={name} className="flex flex-col text-sm">
                  {label}
                  <input
                    type="number"
                    name={name}
                    value={form[name as keyof TaxCalculationForm]}
                    onChange={handleInputChange}
                    className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Allowances */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Allowances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Special Allowance', name: 'special_allowance' },
                { label: 'Rent Paid (per annum)', name: 'rent_paid' },
                { label: 'HRA Received (per annum)', name: 'hra_received' },
                { label: 'LTA', name: 'lta' },
                { label: 'Dearness Allowance (DA)', name: 'da_received' }
              ].map(({ label, name }) => (
                <label key={name} className="flex flex-col text-sm">
                  {label}
                  <input
                    type="number"
                    name={name}
                    value={form[name as keyof TaxCalculationForm]}
                    onChange={handleInputChange}
                    className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>
              ))}
              <div className="col-span-full flex gap-6 items-center">
                <span className="text-gray-600">Do you live in a metro city?</span>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="metro_city" checked={form.metro_city} onChange={() => setForm(f => ({ ...f, metro_city: true }))} />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="metro_city" checked={!form.metro_city} onChange={() => setForm(f => ({ ...f, metro_city: false }))} />
                  No
                </label>
              </div>
            </div>
          </section>

          {/* Deductions */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Deductions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Education Loan Interest', name: 'education_loan_interest' },
                { label: 'Home Loan Interest', name: 'home_loan_interest' },
                { label: 'Investment Amount', name: 'investment_amount' },
                { label: 'Medical Insurance (< 60 yrs)', name: 'medical_insurance_below_60' },
                { label: 'Medical Insurance (60+ yrs)', name: 'medical_insurance_above_60' },
                { label: 'Insurance Amount (< 60 yrs)', name: 'insurance_amount_below_60' },
                { label: 'Insurance Amount (60+ yrs)', name: 'insurance_amount_above_60' }
              ].map(({ label, name }) => (
                <label key={name} className="flex flex-col text-sm">
                  {label}
                  <input
                    type="number"
                    name={name}
                    value={form[name as keyof TaxCalculationForm]}
                    onChange={handleInputChange}
                    className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>
              ))}

              <label className="flex flex-col text-sm">
                Investment in Funds
                <select
                  name="investment_funds"
                  value={form.investment_funds}
                  onChange={handleInputChange}
                  className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="NONE">NONE</option>
                  <option value="ELSS">ELSS</option>
                  <option value="PPF">PPF</option>
                  <option value="NSC">NSC</option>
                </select>
              </label>
            </div>
          </section>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200"
            >
              {loading ? 'Saving...' : 'Calculate Tax'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
