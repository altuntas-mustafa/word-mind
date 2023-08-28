import React from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { Link } from 'react-router-dom';

const DashBoard = () => {
  // Initialize Firebase auth
  const firebaseAuth = getAuth();

  // State to track user's login status
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Listen for changes in the user's login status
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user); // Update the user state based on login status
    });

    return () => {
      unsubscribe(); // Cleanup the auth state listener
    };
  }, [firebaseAuth]);

  return (
    <div className="container mx-auto p-4">
      {user ? (
        // If user is logged in, show the welcome message
        <h1>Welcome to the App</h1>
      ) : (
        // If user is not logged in, show the login link
        <div>
          <p>You are not logged in. Please log in to access the dashboard.</p>
          <Link to="/login">Log In</Link>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
