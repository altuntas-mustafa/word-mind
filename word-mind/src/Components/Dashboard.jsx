import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserInfo } from '../JS/UserInfo';
import Login from './Login';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [languageData, setLanguageData] = useState([]);


  useEffect(() => {
    async function fetchUserInfoAsync() {
      await UserInfo(dispatch);
      await fetchUserLikedDecks();
      setIsLoading(false);
    }

    fetchUserInfoAsync();
  }, [dispatch]);

  async function fetchUserLikedDecks() {
    const languagesCollectionRef = collection(db, 'languages');
    const languagesQuerySnapshot = await getDocs(languagesCollectionRef);
  
    const user = auth.currentUser;
    const userLikedDeckIds = [];
  
    // Fetch user-liked deck IDs
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
  
      if (userData && userData.likedDecks) {
        userLikedDeckIds.push(...userData.likedDecks);
      }
    }
  
    const languageDataArray = [];
  
    for (const languageDoc of languagesQuerySnapshot.docs) {
      const languageId = languageDoc.id;
  
      const decksCollectionRef = collection(db, `languages/${languageId}/decks`);
      const decksQuerySnapshot = await getDocs(decksCollectionRef);
  
      const userLikedDecks = [];
      for (const deckDoc of decksQuerySnapshot.docs) {
        const deckId = deckDoc.id;
        const deckData = deckDoc.data();
  
        const isLikedByUser = userLikedDeckIds.includes(deckId);
  
        if (isLikedByUser) {
          userLikedDecks.push({ id: deckId, ...deckData });
        }
      }
  
      if (userLikedDecks.length > 0) {
        languageDataArray.push({ id: languageId, userLikedDecks });
      }
    }
  
    setLanguageData(languageDataArray);
  }
  console.log(languageData);
  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <p>Loading...</p>
      ) : user.isAuthenticated ? (
        <>
          <h1>Welcome to the App, {user.displayName}!</h1>
          {languageData.map((language) => (
            <div key={language.id}>
              <h2 className="text-2xl font-semibold mb-2">{language.id}</h2>
              <ul className="space-y-3">
                {language.userLikedDecks.map((deck) => (
                  <li key={deck.id} className="flex items-center space-x-3">
                    <Link
                      to={`/languages/${encodeURIComponent(language.id)}/decks/${encodeURIComponent(deck.name)}`}
                      className="text-blue-500 hover:underline transition duration-300 ease-in-out transform hover:scale-105 text-lg sm:text-xl"
                    >
                      {deck.name}
                    </Link>
                    {/* Add other deck information here */}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      ) : (
        <div>
          <p>You are not logged in. Please log in to access the dashboard.</p>
          <Login />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
