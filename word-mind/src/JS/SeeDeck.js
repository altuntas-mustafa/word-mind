import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useParams, Link } from "react-router-dom";
import {
  addLanguageDeckAndHandleLike,
  deleteDeckFromCollection,
} from "./firebaseUtils";

const SeeDeck = () => {
  const { creator, userId, deckName, language, isLiked } = useParams();
  const [deckFlashcards, setDeckFlashcards] = useState([]);
  const [localIsLiked, setLocalIsLiked] = useState(false); // Initialize with false
  const currentUser = auth.currentUser;
  useEffect(() => {
    let isMounted = true;

    // Set localIsLiked based on the initial value of isLiked
    setLocalIsLiked(isLiked === "true");

    const fetchFlashcards = async () => {
      const collectionPath =
        userId !== undefined
          ? `users/${userId}/languages/${language}/decks`
          : `languages/${language}/decks`;

      const flashcardsQuerySnapshot = await getDocs(
        query(collection(db, collectionPath), where("name", "==", deckName))
      );

      const flashcards = [];

      flashcardsQuerySnapshot.docs.forEach((deckDoc) => {
        // Assuming there's only one deck with the specified name, so we take the first one
        const deckData = deckDoc.data();
        const flashcardsData = deckData.flashcards || [];
        flashcards.push(...flashcardsData);
      });

      if (isMounted) {
        setDeckFlashcards(flashcards);
      }
    };

    fetchFlashcards().catch((error) => {
      console.error("Error fetching flashcards:", error);
    });

    return () => {
      isMounted = false;
    };
  }, [deckName, language, userId, isLiked]);

  const handleLikeClick = async (languageId, deckId) => {
    try {
      await addLanguageDeckAndHandleLike(languageId, deckId);
      setLocalIsLiked(!localIsLiked);
    } catch (error) {
      console.error("Error while adding/deleting deck:", error);
    }
  };
  const handleDeleteClick = async (languageId, deckId, isUser) => {
    try {
      await deleteDeckFromCollection(languageId, deckId, isUser);
      if (userId) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error while adding/deleting deck:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center flex items-center justify-center md:text-xl sm:text-sm">
        <span className="lg:text-2xl md:text-xl">
          {deckName}
        </span>

        <div className="flex items-center justify-center space-x-2 pl-2">
          {currentUser && creator === "creator" ? (
            <>
              <button
                onClick={() => {
                  try {
                    handleLikeClick(language, deckName);
                  } catch (error) {
                    console.error("Error while adding/deleting deck:", error);
                  }
                }}
                className={`px-4 py-2 rounded-full font-semibold ${localIsLiked
                  ? "bg-green-400 text-white"
                  : "bg-gray-200 text-gray-700"
                  } hover:bg-opacity-80 transition-colors duration-300 flex items-center space-x-2 text-sm md:text-base`}
              >
                {localIsLiked ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 448 512"
                      className="w-5 h-5"
                    >
                      <path
                        fill="currentColor"
                        d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                      />
                    </svg>
                    <div>Liked</div>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                      className="w-5 h-5"
                    >
                      <path
                        fill="currentColor"
                        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0-14 10.7 24-24s24 10.7 24 24H280v64c0-13.3-10.7-24-24-24s-14-10.7 24-24z"
                      />
                    </svg>
                    <div>Like</div>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  handleDeleteClick(language, deckName, false);
                }}
                className="px-3 py-2 rounded-full font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 flex items-center space-x-2 text-sm md:text-base"
              >
                <div>X DELETE</div>
              </button>
            </>
          ) : currentUser && userId ? (
            <button
              onClick={() => {
                handleDeleteClick(language, deckName, true);
              }}
              className="px-4 py-2 rounded-full font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 flex items-center space-x-2 text-sm md:text-base"
            >
              <div>X DELETE</div>
            </button>
          ) : currentUser && creator !== "creator" ? (
            <>
              <button
                onClick={() => {
                  try {
                    handleLikeClick(language, deckName);
                  } catch (error) {
                    console.error("Error while adding/deleting deck:", error);
                  }
                }}
                className={`px-4 py-2 rounded-full font-semibold ${localIsLiked
                  ? "bg-green-400 text-white"
                  : "bg-gray-200 text-gray-700"
                  } hover:bg-opacity-80 transition-colors duration-300 flex items-center space-x-2 text-sm md:text-base`}
              >
                {localIsLiked ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 448 512"
                      className="w-5 h-5"
                    >
                      <path
                        fill="currentColor"
                        d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                      />
                    </svg>
                    <div>Liked</div>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                      className="w-5 h-5"
                    >
                      <path
                        fill="currentColor"
                        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0-14 10.7 24-24s24 10.7 24 24H280v64c0-13.3-10.7-24-24-24s-14-10.7 24-24z"
                      />
                    </svg>
                    <div>Like</div>
                  </>
                )}
              </button>
            </>
          ) : null}
        </div>
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deckFlashcards.map((flashcard, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg p-4 shadow-lg hover:shadow-xl transition duration-300"
          >
            <h3 className="text-lg font-semibold mb-2">
              Flashcard {index + 1}
            </h3>
            <div className="mb-2">
              <p className="text-gray-700 font-semibold">Front:</p>
              <p className="text-2xl text-blue-600 font-bold uppercase">
                {flashcard.front}
              </p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Back:</p>
              <p className="text-2xl text-green-600 font-bold uppercase">
                {flashcard.back}
              </p>
              {/* {userId && (
                  <>
                  {flashcard.averageLevel === 5 && (
                    <>
                  <p className="text-gray-700 font-semibold">Level Of Card</p>
                  <p className="text-2xl text-red-600 font-bold uppercase">
                      Fail
                  </p>
                  </>
                   )}
                  </>
              )} */}
            </div>
          </div>
        ))}
      </div>

      {/* Conditional Button */}
      {userId ? (
        <Link
          to={`/users/${userId}/languages/${encodeURIComponent(
            language
          )}/decks/${encodeURIComponent(deckName)}`}
          className="fixed bottom-0 left-0 w-full bg-blue-500 text-white py-3 text-center font-semibold hover:bg-blue-600 transition-colors duration-300"
        >
          Review
        </Link>
      ) : (
        <Link
          to={`/languages/${encodeURIComponent(
            language
          )}/decks/${encodeURIComponent(deckName)}`}
          className="fixed bottom-0 left-0 w-full bg-blue-500 text-white py-3 text-center font-semibold hover:bg-blue-600 transition-colors duration-300"
        >
          Review
        </Link>
      )}
    </div>
  );
};

export default SeeDeck;
