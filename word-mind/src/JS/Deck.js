import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrder, setDisplayOrder } from "../redux/reducers/reducers";


const Deck = () => {
  const [languages, setLanguages] = useState([]);
  const dispatch = useDispatch();

  const isRandomOrder = useSelector((state) => state.flashcards.isRandomOrder);
  const isFrontDisplayed = useSelector(
    (state) => state.flashcards.isFrontDisplayed
  );

  async function fetchLanguagesAndDecksFromFirebase() {
    const languagesCollectionRef = collection(db, "languages");

    try {
      const languagesQuerySnapshot = await getDocs(languagesCollectionRef);
      const languagesData = [];

      for (const languageDoc of languagesQuerySnapshot.docs) {
        const languageId = languageDoc.id;
        


        const languageData = {
          id: languageId,
          decks: [],
        };

        const decksCollectionRef = collection(
          db,
          `languages/${languageId}/decks`
        );
        const decksQuerySnapshot = await getDocs(decksCollectionRef);

        for (const deckDoc of decksQuerySnapshot.docs) {
          const deckId = deckDoc.id;
          const deckData = deckDoc.data();
          
          if (auth.currentUser){
          const currentUser = auth.currentUser;
            // Check if the current user has liked the deck
            const isLikedByUser =
              Array.isArray(deckData.accessUser) &&
              deckData.accessUser.some((user) => user.userId === currentUser.uid);

              languageData.decks.push({
                id: deckId,
                isLikedByUser: isLikedByUser,
                ...deckData,
              });
          } else {

            languageData.decks.push({
              id: deckId,
              ...deckData,
            });
          }

        }

        languagesData.push(languageData);
      }

      setLanguages(languagesData);
    } catch (error) {
      console.error("Error fetching languages and decks:", error);
    }
  }

  async function handleLike(deckId) {
    try {
        const languagesCollectionRef = collection(db, "languages");

        const languagesQuerySnapshot = await getDocs(languagesCollectionRef);

        for (const languageDoc of languagesQuerySnapshot.docs) {
            const languageId = languageDoc.id;

            const decksCollectionRef = collection(
                db,
                `languages/${languageId}/decks`
            );

            const deckDoc = await getDoc(doc(decksCollectionRef, deckId));

            if (deckDoc.exists()) {
                const deckData = deckDoc.data();
                const currentUser = auth.currentUser;

                if (!currentUser) {
                    console.log("User not authenticated");
                    return;
                }

                const isLikedByUser = Array.isArray(deckData.accessUser) &&
                    deckData.accessUser.some((user) => user.userId === currentUser.uid);

                const deckRef = doc(decksCollectionRef, deckId);

                let updatedAccessUser;
                if (isLikedByUser) {
                    updatedAccessUser = deckData.accessUser.filter(
                        (user) => user.userId !== currentUser.uid
                    );
                } else {
                    updatedAccessUser = [
                        ...deckData.accessUser,
                        { userId: currentUser.uid },
                    ];
                }

                await updateDoc(deckRef, { accessUser: updatedAccessUser });
            }
        }

        fetchLanguagesAndDecksFromFirebase();
    } catch (error) {
        console.error("Error handling like:", error);
    }
}

  useEffect(() => {
    fetchLanguagesAndDecksFromFirebase();
  }, []);

  return (
    <div className="p-5 min-h-screen  flex justify-center ">
      <div className=" p-3 bg-gray-100 shadow-md rounded-lg  w-full md:w-1/2 lg:w-1/3">
        <h1 className="text-4xl font-bold mb-4 flex justify-center items-center">
          DECK LISTS
        </h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-2 mb-4">
          <div className="flex items-center mb-2 md:mb-0">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="hidden toggle-checkbox"
                checked={isRandomOrder}
                onChange={() => dispatch(setOrder(!isRandomOrder))}
              />
              <div
                className={`relative w-10 h-6 bg-gray-300 rounded-full transition-colors ${
                  isRandomOrder ? "bg-green-400" : "bg-gray-200"
                } `}
              >
                <div
                  className={`absolute left-1 transition-transform duration-300 ease-in-out h-1 w-4 pt-4 mt-1 bg-white rounded-full  ${
                    isRandomOrder ? "transform translate-x-full pt-4 mt-1" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-2">Random Order</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="hidden toggle-checkbox"
                checked={isFrontDisplayed}
                onChange={() => dispatch(setDisplayOrder(!isFrontDisplayed))}
              />
              <div
                className={`relative w-10 h-6 bg-gray-300 rounded-full transition-colors ${
                  isFrontDisplayed ? "bg-green-400" : "bg-gray-200"
                }`}
              >
                <div
                  className={`absolute left-1 transition-transform duration-300 ease-in-out h-1 w-4 pt-4 mt-1 bg-white rounded-full ${
                    isFrontDisplayed
                      ? "transform translate-x-full pt-4 mt-1"
                      : ""
                  }`}
                ></div>
              </div>
              <span className="ml-2">Random Side</span>
            </label>
          </div>
        </div>

        <div className="space-y-6 ml-4 sm:ml-10">
  {languages.map((language) => (
    <div key={language.id} className="border border-gray-200 p-4 rounded shadow-md mr-7">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">{language.id}</h2>
      <ul className="space-y-3">
        {language.decks.map((deck) => (
          <li key={deck.id} className="flex items-center space-x-3">
            <Link
              to={`/languages/${encodeURIComponent(language.id)}/decks/${encodeURIComponent(deck.name)}`}
              className="text-blue-500 hover:underline transition duration-300 ease-in-out transform hover:scale-105 text-lg sm:text-xl"
            >
              {deck.name}
            </Link>
            <button
              onClick={() => handleLike(deck.id)}
              className={`px-4 py-2 rounded-full font-semibold ${
                deck.isLikedByUser ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
              } hover:bg-opacity-80 transition-colors duration-300 flex items-center space-x-2`}
            >
              {deck.isLikedByUser ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Added
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-1.054 0-2.07-.21-3-.588A4.27 4.27 0 007 10.412V7.588A4.27 4.27 0 0010 6a4.27 4.27 0 003-.588V10.41c0 .487.135.956.37 1.362A3.998 3.998 0 0110 16z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default Deck;
