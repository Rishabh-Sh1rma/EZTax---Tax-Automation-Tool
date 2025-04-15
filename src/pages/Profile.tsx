import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

interface UserDetails {
  age: number | null;
  gender: string | null;
  address: string | null;
  work_type: string | null;
}

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
  });

  const [userDetails, setUserDetails] = useState<UserDetails>({
    age: null,
    gender: '',
    address: '',
    work_type: '',
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Safe fetch from users table
      const { data: profileRows, error: profileError } = await supabase
        .from('users')
        .select('first_name, last_name, mobile')
        .eq('id', user.id)
        .limit(1);

      if (profileError) throw profileError;

      const profileData = profileRows?.[0];
      if (profileData) {
        setUserProfile({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          mobile: profileData.mobile || '',
        });
      }

      // Safe fetch from user_details table
      const { data: detailsRows, error: detailsError } = await supabase
        .from('user_details')
        .select('age, gender, address, work_type')
        .eq('user_id', user.id)
        .limit(1);

      if (detailsError) throw detailsError;

      const detailsData = detailsRows?.[0];
      if (detailsData) {
        setUserDetails({
          age: detailsData.age,
          gender: detailsData.gender,
          address: detailsData.address,
          work_type: detailsData.work_type,
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error.message);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error: profileError } = await supabase
        .from('users')
        .update(userProfile)
        .eq('id', user.id);

      if (profileError) throw profileError;

      const { error: detailsError } = await supabase
        .from('user_details')
        .upsert({
          user_id: user.id,
          ...userDetails,
        });

      if (detailsError) throw detailsError;

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast.error('Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Profile Fields */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                value={userProfile.first_name}
                onChange={(val: string) => setUserProfile({ ...userProfile, first_name: val })}
              />
              <InputField
                label="Last Name"
                value={userProfile.last_name}
                onChange={(val: string) => setUserProfile({ ...userProfile, last_name: val })}
              />
            </div>

            <InputField
              label="Mobile"
              value={userProfile.mobile}
              onChange={(val: string) => setUserProfile({ ...userProfile, mobile: val })}
              type="tel"
            />

            {/* Details Fields */}
            <InputField
              label="Age"
              type="number"
              value={userDetails.age ?? ''}
              onChange={(val: string) =>
                setUserDetails({ ...userDetails, age: parseInt(val) || null })
              }
            />

            <SelectField
              label="Gender"
              value={userDetails.gender ?? ''}
              onChange={(val: string) => setUserDetails({ ...userDetails, gender: val })}
              options={['male', 'female', 'other']}
            />

            <TextAreaField
              label="Address"
              value={userDetails.address ?? ''}
              onChange={(val: string) => setUserDetails({ ...userDetails, address: val })}
            />

            <SelectField
              label="Work Type"
              value={userDetails.work_type ?? ''}
              onChange={(val: string) => setUserDetails({ ...userDetails, work_type: val })}
              options={['salaried', 'business']}
            />

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable input component
const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
    />
  </div>
);

// Reusable select component
const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

// Reusable textarea component
const TextAreaField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
    />
  </div>
);
