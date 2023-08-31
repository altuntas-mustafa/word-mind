import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/user';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Dispatch the setUser action to update the Redux store
      dispatch(setUser({
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
      }));

      navigate('/dashboard');
    } catch (error) {
      console.error('Google Login error:', error.message);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-300 rounded-lg shadow-md p-4">
      <div className="bg-gray-100 rounded-lg shadow-md p-8 w-full md:w-11/12 lg:w-3/4 xl:w-1/2 mt-8">
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
