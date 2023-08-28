import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Flashcards = () => {
  const { deckName, language } = useParams();
  const [shuffledFlashcards, setShuffledFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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
    if (currentCardIndex < shuffledFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchFlashcards = async () => {
      const flashcardsCollectionRef = collection(
        db,
        `languages/${language}/decks/${deckName}/flashcards`
      );
      const flashcardsQuerySnapshot = await getDocs(flashcardsCollectionRef);
      const flashcards = [];

      flashcardsQuerySnapshot.forEach((flashcardDoc) => {
        flashcards.push(flashcardDoc.data());
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
  }, [deckName, language, isRandomOrder]);

  if (shuffledFlashcards.length === 0) {
    return <div>Loading...</div>;
  }

  const currentFlashcard = shuffledFlashcards[currentCardIndex];
  const isLastFlashcard = currentCardIndex === shuffledFlashcards.length - 1;

  return (
    <div className="flex justify-center items-center ">
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700  ">
        <h2>{deckName}</h2>
        <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          <div className="mb-3 font-normal text-gray-700 dark:text-gray-400 items-center ">
            {isFrontDisplayed && Math.random() < 0.5 ? (
              <p>{currentFlashcard.back}</p>
            ) : (
              <p>{currentFlashcard.front}</p>
            )}
            <button
              className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
              onClick={handleFlip}
            >
              Flip
            </button>
          </div>

          {isFlipped && (
            <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {currentFlashcard.front}
              <hr className="line" />
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {currentFlashcard.back}
              </p>
              {isLastFlashcard && (
                <Link to="/decks" className="viewDeck">
                  Go to Decks
                </Link>
              )}
              {!isLastFlashcard && (
                <button
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleNextCard}
                >
                  Next Cardd
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
