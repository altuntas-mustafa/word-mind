import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/reducers/user';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      // Dispatch the clearUser action to reset the user state in Redux
      dispatch(clearUser());

      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-black p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-11/12 lg:w-3/4 xl:w-1/2 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Logout</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Logout;
