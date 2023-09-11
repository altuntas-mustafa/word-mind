import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { changeWordLevel } from "./firebaseUtils";

const Flashcards = () => {
  const { userId, deckName, language } = useParams();
  const [shuffledFlashcards, setShuffledFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [randomSide, setRandomSide] = useState("front");

  const isRandomOrder = useSelector((state) => state.flashcards.isRandomOrder);
  const isFrontDisplayed = useSelector(
    (state) => state.flashcards.isFrontDisplayed
  );

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {


    if (isFrontDisplayed && Math.random() < 0.5) {
      setRandomSide("back");
    } else {
      setRandomSide("front");
    }
    if (currentCardIndex < shuffledFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleNextCardUser = async (userId, languageId, deckName, flashcardId, level) => {
    await changeWordLevel(userId, languageId, deckName, flashcardId, level)

    if (isFrontDisplayed && Math.random() < 0.5) {
      setRandomSide("back");
    } else {
      setRandomSide("front");
    }
    if (currentCardIndex < shuffledFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

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

      const shuffledFlashcards = isRandomOrder
        ? shuffleArray(flashcards)
        : flashcards;
      if (isMounted) {
        setShuffledFlashcards(shuffledFlashcards);
        setCurrentCardIndex(0);
        setIsFlipped(false);
      }
    };
    fetchFlashcards().catch((error) => {
      console.error("Error fetching flashcards:", error);
    });

    return () => {
      isMounted = false;
    };
  }, [deckName, language, isRandomOrder, userId]);

  useEffect(() => { });
  if (shuffledFlashcards.length === 0) {
    return <div>Loading...</div>;
  }

  const currentFlashcard = shuffledFlashcards[currentCardIndex];
  const isLastFlashcard = currentCardIndex === shuffledFlashcards.length - 1;

  return (
    <div className="flex-col justify-center items-center min-h-screen">
      <h2 className="font-abel text-x mb-4 text-center justify-center">
        {deckName}
      </h2>

      <div className="w-full mt-20 bg-white flex flex-col items-center text-3xl mt-40 font-abel">
        {isFlipped && isFrontDisplayed ? (
          <div className="mb-3 font-normal text-gray-900 dark:text-gray-700 flex flex-col items-center justify-center overflow-hidden">
            {randomSide === "front" ? (
              <>
                <p className="mb-1 font-normal text-gray-900 dark:text-gray-700  whitespace-pre-wrap ">
                  {currentFlashcard.front}
                </p>
                <hr className="w-screen h-0.5 bg-black my-3 border-none" />
                <p className="mb-1 font-normal text-gray-900 dark:text-gray-700  whitespace-pre-wrap">
                  {currentFlashcard.back}
                </p>
              </>
            ) : (
              <>
                <p className="mb-1 font-normal text-gray-900 dark:text-gray-700  whitespace-pre-wrap ">
                  {currentFlashcard.back}
                </p>
                <hr className="w-screen h-0.5 bg-black my-3 border-none" />
                <p className="mb-1 font-normal text-gray-900 dark:text-gray-700  whitespace-pre-wrap">
                  {currentFlashcard.front}
                </p>
              </>
            )}
          </div>
        ) : isFlipped && !isFrontDisplayed ? (
          <div className="mb-3 font-normal text-gray-900 dark:text-gray-700 flex flex-col items-center justify-center overflow-hidden">
            <>
              <p className="mb-1 font-normal text-gray-900 dark:text-gray-700  whitespace-pre-wrap ">
                {currentFlashcard.front}
              </p>
              <hr className="w-screen h-0.5 bg-black my-3 border-none" />
              <p className="mb-1 font-normal text-gray-900 dark:text-gray-700  whitespace-pre-wrap">
                {currentFlashcard.back}
              </p>
            </>
          </div>
        ) : !isFlipped && !isFrontDisplayed ? (
          <div className="mb-3 font-normal text-gray-900 dark:text-gray-700 flex flex-col items-center justify-center overflow-hidden">
            <p className="mb-1 font-normal text-gray-900 dark:text-gray-700  whitespace-pre-wrap ">
              {currentFlashcard.front}
            </p>
          </div>
        ) : (
          <div className="mb-3 font-normal text-gray-900 dark:text-gray-700 flex flex-col items-center justify-center overflow-hidden">
            <div className="mb-3 font-normal text-gray-900 dark:text-gray-700 items-center text-center overflow-hidden flex-grow">
              <div className="flex items-center justify-center h-full">
                {isFrontDisplayed && randomSide === "back" ? (
                  <>
                    <p className="whitespace-pre-wrap">
                      {currentFlashcard.back}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap">
                      {currentFlashcard.front}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-4  font-abel w-full ">
        {!isFlipped ? (
          <button
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-xl px-4 py-4 min-w-24 min-h-16 text-center  w-full"
            onClick={handleFlip}
          >
            Flip
          </button>

        ) : isLastFlashcard ? (
          <>
            {userId ? (
              <>
                <div className="flex w-full justify-between">
                  <button
                    className="text-white bg-gradient-to-br from-red-400 to-red-600 hover:bg-gradient-to-bl hover:from-red-500 hover:to-red-700 focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800 font-medium text-xl px-4 py-4 min-h-18 text-center flex-grow"
                    onClick={() => handleNextCardUser(userId, language, deckName, currentFlashcard.id, 5)}
                  >
                    FAIL
                  </button>
                  <button
                    className="text-white bg-gradient-to-br from-yellow-400 to-yellow-600 hover:bg-gradient-to-bl hover:from-yellow-500 hover:to-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-200 dark:focus:ring-yellow-800 font-medium text-xl px-4 py-4 min-h-18 text-center flex-grow"
                    onClick={() => handleNextCardUser(userId, language, deckName, currentFlashcard.id, 4)}
                  >
                    HARD
                  </button>
                  <button
                    className="text-white bg-gradient-to-br from-green-400 to-green-600 hover:bg-gradient-to-bl hover:from-green-500 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium text-xl px-4 py-4 min-h-18 text-center flex-grow"
                    onClick={() => handleNextCardUser(userId, language, deckName, currentFlashcard.id, 2)}
                  >
                    GOOD
                  </button>
                  <button
                    className="text-white bg-gradient-to-br from-blue-400 to-blue-600 hover:bg-gradient-to-bl hover:from-blue-500 hover:to-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium text-xl px-4 py-4 min-h-18 text-center flex-grow"
                    onClick={() => handleNextCardUser(userId, language, deckName, currentFlashcard.id, 1)}
                  >
                    EASY
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/" // Redirect to the root path if userId is not present
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-xl px-4 py-4 min-w-24 min-h-16 text-center  w-full"

              >
                Go to Decks
              </Link>
            )}
          </>
        ) : (userId ? (
          <>
            <div className="flex w-full justify-between">
              <button
                className="text-white bg-gradient-to-br from-red-400 to-red-600 hover:bg-gradient-to-bl hover:from-red-500 hover:to-red-700 focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800 font-medium text-xl px-4 py-4 min-h-18 text-center flex-grow"
                onClick={() => handleNextCardUser(userId, language, deckName, currentFlashcard.id, 5)}
              >
                FAIL
              </button>
              <button
                className="text-white bg-gradient-to-br from-yellow-400 to-yellow-600 hover:bg-gradient-to-bl hover:from-yellow-500 hover:to-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-200 dark:focus:ring-yellow-800 font-medium text-xl px-4 py-4 min-h-18 text-center flex-grow"
                onClick={() => handleNextCardUser(userId, language, deckName, currentFlashcard.id, 4)}
              >
                HARD
              </button>
              <button
                className="text-white bg-gradient-to-br from-green-400 to-green-600 hover:bg-gradient-to-bl hover:from-green-500 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium text-xl px-4 py-4 min-h-18 text-center flex-grow"
                onClick={() => handleNextCardUser(userId, language, deckName, currentFlashcard.id, 2)}
              >
                GOOD
              </button>
              <button
                className="text-white bg-gradient-to-br from-blue-400 to-blue-600 hover:bg-gradient-to-bl hover:from-blue-500 hover:to-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium text-xl px-4 py-4 min-h-18 text-center flex-grow"
                onClick={() => handleNextCardUser(userId, language, deckName, currentFlashcard.id, 1)}
              >
                EASY
              </button>
            </div>


          </>
        ) : (
          <button
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 min-w-24 min-h-10 text-center mr-2 mb-2"
            onClick={handleNextCard}
          >
            Next Card
          </button>
        ))}
      </div>
    </div>
  );
};

export default Flashcards;
