import { setUser } from '../redux/reducers/user';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const UserInfo = (dispatch) => {
  return new Promise((resolve, reject) => {
    const firebaseAuth = getAuth();

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // If user is logged in, dispatch the setUser action to update the store
        dispatch(setUser({
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
        }));
      }

      // You can resolve the promise here after user information is dispatched
      resolve();

      // Clean up the auth state listener
      return () => {
        unsubscribe();
      };
    });
  });
};
