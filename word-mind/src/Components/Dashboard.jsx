import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserInfo } from "../JS/UserInfo";
import Login from "./Login";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { addCurrentUserToUsersCollection } from "../JS/firebaseUtils";
import OrderAndDisplaySide from "./OrderAndDisplaySide";

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [languageData, setLanguageData] = useState([]);
  const [currentUser, setcurrentUser] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUserInfoAsync() {
      await UserInfo(dispatch);
      async function fetchUserLikedDecks() {
        try {
          setcurrentUser(auth.currentUser);

          if (!currentUser) {
            // console.log('User not authenticated');
            return;
          }

          const userLanguageCollectionRef = collection(
            db,
            "users",
            currentUser.uid,
            "languages"
          );

          const userLanguagesQuerySnapshot = await getDocs(
            userLanguageCollectionRef
          );

          const languageDataArray = [];

          for (const userLanguageDoc of userLanguagesQuerySnapshot.docs) {
            const languageId = userLanguageDoc.id;
            const userDeckCollectionRef = collection(
              userLanguageDoc.ref,
              "decks"
            );
            const userDeckQuerySnapshot = await getDocs(userDeckCollectionRef);

            const userLikedDecks = [];

            for (const userDeckDoc of userDeckQuerySnapshot.docs) {
              const deckId = userDeckDoc.id;
              const deckData = userDeckDoc.data();

              userLikedDecks.push({ id: deckId, ...deckData });
            }

            if (userLikedDecks.length > 0) {
              languageDataArray.push({ id: languageId, userLikedDecks });
            }
          }
          setLanguageData(languageDataArray);
        } catch (error) {
          console.error("Error fetching user-liked decks:", error);
        }
      }
      await fetchUserLikedDecks();
      await addCurrentUserToUsersCollection();

      setIsLoading(false);
    }

    fetchUserInfoAsync();
  }, [dispatch, user, currentUser]);

  addCurrentUserToUsersCollection();

  return (
    <div className=" bg-gray-300 rounded-lg shadow-md justify-center items-center">
    <div className="p-5 min-h-screen  flex justify-center ">
    <div className=" p-3 bg-gray-100 shadow-md rounded-lg  w-full md:w-1/2 lg:w-1/3">
        {isLoading ? (
          <p>Loading...</p>
        ) : user.isAuthenticated ? (
          <>
            <h1 className="text-4xl font-semibold text-center mb-4 mb-10">
              Language Decks
            </h1>

            <OrderAndDisplaySide />
            {languageData.map((language) => (
              <div
                key={language.id}
                className={`border border-gray-200 p-4 rounded shadow-md mt-10 ${
                  selectedLanguage === language.id
                    ? ""
                    : "text-black duration-150 bg-gradient-to-r from-blue-600 via-blue-300 to-green-300 border-b border-gray-400 rounded-lg focus:shadow-outline mt-4"
                }`}
              >
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-center font-['Roboto'] cursor-pointer "
                  onClick={() =>
                    setSelectedLanguage(
                      selectedLanguage === language.id ? null : language.id
                    )
                  }
                >
                  {language.id}{" "}
                </h2>
                {selectedLanguage === language.id && (
                  <ul className="space-y-3 font-abel mt-3">
                    {language.userLikedDecks.map((deck) => (
                      <Link
                        key={deck.id}
                        to={`/deck/users/${encodeURIComponent(
                          currentUser.uid
                        )}/languages/${encodeURIComponent(
                          language.id
                        )}/decks/${encodeURIComponent(deck.id)}`}
                        className="flex items-center space-x-3 w-full"
                      >
                        <div className="flex-1 inline-flex items-center h-20 px-5 duration-150 bg-gradient-to-r from-blue-600 via-blue-300 to-green-300 border-b border-gray-400 rounded-lg focus:shadow-outline hover:bg-gray-400 text-0.1l lg:text-2xl text-white font-semibold">
                          {deck.name}
                          <span className="text-3xl md:text-4xl  lg:text-5xl ml-auto">
                            &gt;
                          </span>
                        </div>
                      </Link>
                    ))}
                  </ul>
                )}
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
    </div>
    </div>

  );
};

export default Dashboard;
