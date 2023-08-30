import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch from react-redux
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { setUser } from '../redux/reducers/user'; // Import the setUser action
import Login from './Login';

const DashBoard = () => {
  const firebaseAuth = getAuth();
  const user = useSelector(state => state.user); // Access user info from Redux store
  console.log(user);
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const [isLoading, setIsLoading] = React.useState(true); // State to track loading status

  // Fetch user information again when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // If user is logged in, dispatch the setUser action to update the store
        dispatch(setUser({
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
        }));
      }
      setIsLoading(false); // Mark loading as complete
    });

    return () => {
      unsubscribe(); // Cleanup the auth state listener
    };
  }, [dispatch, firebaseAuth]); // Make sure to include dispatch and firebaseAuth in the dependency array

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <p>Loading...</p> // Show loading indicator while fetching user data
      ) : user.isAuthenticated ? (
        // If user is logged in, show the welcome message with displayName from Redux store
        <h1>Welcome to the App, {user.displayName}!</h1>
      ) : (
        // If user is not logged in, show the login link
        <div>
          <p>You are not logged in. Please log in to access the dashboard.</p>
          <Login />
        </div>
      )}
    </div>
  );
};

export default DashBoard;
