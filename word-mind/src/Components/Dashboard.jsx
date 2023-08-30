import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch from react-redux
import Login from './Login';
import { UserInfo } from '../JS/UserInfo';

const DashBoard = () => {
  const user = useSelector(state => state.user); // Access user info from Redux store
  console.log(user);
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const [isLoading, setIsLoading] = React.useState(true); // State to track loading status

  useEffect(() => {
    // Define an async function
    async function fetchUserInfoAsync() {
      await UserInfo(dispatch); // Await the UserInfo function
      setIsLoading(false);
    }
  
    // Call the async function
    fetchUserInfoAsync();
  }, [dispatch]);
  


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