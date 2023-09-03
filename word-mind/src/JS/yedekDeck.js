import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  runTransaction,
} from "firebase/firestore";
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
          if (auth.currentUser) {
            const currentUser = auth.currentUser;
            // Check if the current user has liked the deck
            const isLikedByUser =
              Array.isArray(deckData.accessUser) &&
              deckData.accessUser.some(
                (user) => user.userId === currentUser.uid
              );

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

  async function addLanguageAndDeckToUser(languageId, deckId) {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log("User not authenticated");
      return;
    }

    try {
      // Fetch the deck info from the languages collection
      const languagesCollectionRef = collection(db, "languages");
      const languageDocRef = doc(languagesCollectionRef, languageId);
      const deckCollectionRef = collection(languageDocRef, "decks");
      const deckDocRef = doc(deckCollectionRef, deckId);
      const deckDocSnapshot = await getDoc(deckDocRef);

      if (deckDocSnapshot.exists()) {
        // Fetch the flashcard data from the deck
        const flashcardsCollectionRef = collection(deckDocRef, "flashcards");
        const flashcardsQuerySnapshot = await getDocs(flashcardsCollectionRef);
        console.log(flashcardsQuerySnapshot.docs);
        // Create references to collections
        const languagesCollection = collection(
          db,
          "users",
          currentUser.uid,
          "languages"
        );
        const languageDoc = doc(languagesCollection, languageId);
        const decksCollection = collection(languageDoc, "decks");
        const deckDoc = doc(decksCollection, deckId);



        // Retrieve flashcard data as an array
        const flashcardsData = flashcardsQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update the user document with the new data
        await setDoc(  
          deckDoc,
          {
            flashcards: flashcardsData,
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error(
        "Error adding language, deck, and flashcards to user:",
        error
      );
    }
  }

  async function handleLike(deckId) {
    try {
      const languagesCollectionRef = collection(db, "languages");
      const usersCollectionRef = collection(db, "users");

      const languagesQuerySnapshot = await getDocs(languagesCollectionRef);
      const usersQuerySnapshot = await getDocs(usersCollectionRef);

      // for (const userDoc of usersQuerySnapshot.docs) {
      //   console.log('data', userDoc.id);
      // }

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

          const isLikedByUser =
            Array.isArray(deckData.accessUser) &&
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
        <h1 className="text-4xl  mb-4 flex justify-center items-center font-abel">
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
              <span className="ml-2 font-abel">Random Order</span>
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
              <span className="ml-2 font-abel">Random Side</span>
            </label>
          </div>
        </div>

        <div className="space-y-6 ml-4 sm:ml-10">
          {languages.map((language) => (
            <div
              key={language.id}
              className="border border-gray-200 p-4 rounded shadow-md mr-7"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-center font-['Roboto']">
                {language.id}
              </h2>
              <ul className="space-y-3 font-abel">
                {language.decks.map((deck) => (
                  <li key={deck.id} className="flex items-center space-x-3">
                    <Link
                      to={`/languages/${encodeURIComponent(
                        language.id
                      )}/decks/${encodeURIComponent(deck.name)}`}
                      className="text-blue-500 hover:underline transition duration-300 ease-in-out transform hover:scale-105 text-lg sm:text-xl"
                    >
                      {deck.name}
                    </Link>
                    <button
                      onClick={() => {
                        addLanguageAndDeckToUser(language.id, deck.id);
                        handleLike(deck.id);
                      }}
                      className={`px-4 py-2 rounded-full font-semibold ${
                        deck.isLikedByUser
                          ? "bg-green-400 text-white"
                          : "bg-gray-200 text-gray-700"
                      } hover:bg-opacity-80 transition-colors duration-300 flex items-center space-x-2`}
                    >
                      {deck.isLikedByUser ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 448 512"
                          >
                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                          </svg>
                          <div>Added</div>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 512 512"
                          >
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                          </svg>
                          <div>Add</div>
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
