import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import {  useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Login error:', error.message);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-black p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-11/12 lg:w-3/4 xl:w-1/2 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <button
        onClick={handleGoogleLogin}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Log In with Google
      </button>
    </div>
  </div>
  
  );
};

export default Login;
