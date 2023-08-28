import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="flex items-start justify-center min-h-screen bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Log In with Google
        </button>
        {/* <p className="mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500">
            Sign up
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
