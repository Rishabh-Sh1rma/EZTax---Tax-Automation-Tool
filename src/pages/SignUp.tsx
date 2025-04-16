import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calculator } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    mobile: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password, firstName, lastName, mobile } = formData;

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
            mobile,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Check if user is already logged in (email auto-confirmed)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Insert profile into users table if logged in
        const { error: insertError } = await supabase.from('users').upsert([
          {
            id: session.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            mobile: mobile,
          },
        ]);

        if (insertError) {
          console.error('Insert error:', insertError.message);
          toast.error('Signup succeeded but failed to save profile.');
        } else {
          toast.success('Signup complete! Profile created.');
          navigate('/profile');
        }
      } else {
        // Not logged in yet, ask to verify email
        toast.success('Verification link sent to your email.');
        navigate('/verify', { state: { email: formData.email } });
      }
    } catch (error: any) {
      console.error('Signup error:', error.message);
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-emerald-500 p-6 flex flex-col items-center">
          <Calculator className="w-12 h-12 text-white mb-2" />
          <h1 className="text-2xl font-bold text-white">TAX BUDDY!</h1>
          <p className="text-emerald-100 text-center">Manage your expense in no time!</p>
        </div>

        <form onSubmit={handleSignUp} className="p-6 space-y-4">
          {[ 
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'First Name', name: 'firstName', type: 'text' },
            { label: 'Last Name', name: 'lastName', type: 'text' },
            { label: 'Mobile Number', name: 'mobile', type: 'tel' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                required
                value={(formData as any)[name]}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-200"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-500 hover:text-emerald-600 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
