// src/pages/Verify.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

export default function Verify() {
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const checkVerification = async () => {
    setChecking(true);
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error.message);
      return;
    }

    if (data?.user?.email_confirmed_at) {
      navigate('/profile'); // or your landing page
    } else {
      alert('Email still not verified. Please check your inbox.');
    }

    setChecking(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="mb-6">
          A verification link has been sent to your email address.
          Please check your inbox and confirm before continuing.
        </p>
        <button
          onClick={checkVerification}
          disabled={checking}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {checking ? 'Checking...' : 'I have verified my email'}
        </button>
      </div>
    </div>
  );
}
