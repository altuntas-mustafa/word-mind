import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
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
    <div className="flex-col justify-center items-center min-h-screen">
      <h2 className="font-serif text-x mb-4 text-center justify-center">
        {deckName}
      </h2>
      
      <div className="w-full mt-20 bg-white flex flex-col items-center text-3xl">
  {!isFlipped ? (
    <div className="mb-3 font-normal text-gray-900 dark:text-gray-700 flex flex-col items-center justify-center h-[300px] w-[400px] overflow-hidden">
      <div className="mb-3 font-normal text-gray-900 dark:text-gray-700 items-center text-center overflow-hidden flex-grow">
        <div className="flex items-center justify-center h-full">
          {isFrontDisplayed && Math.random() < 0.5 ? (
            <p className="whitespace-pre-wrap">{currentFlashcard.back}</p>
          ) : (
            <p className="whitespace-pre-wrap">{currentFlashcard.front}</p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="mb-3 font-normal text-gray-900 dark:text-gray-700 flex flex-col items-center justify-center h-[300px] w-[400px] overflow-hidden">
      <p className="mb-1 font-normal text-gray-900 dark:text-gray-700 font-serif whitespace-pre-wrap">
        {currentFlashcard.front}
      </p>
      <hr className="w-screen h-0.5 bg-black my-3 border-none" />
      <p className="mb-1 font-normal text-gray-900 dark:text-gray-700 font-serif whitespace-pre-wrap">
        {currentFlashcard.back}
      </p>
    </div>
  )}
</div>


      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-4 mt-4">
        {!isFlipped ? (
          <button
            className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-24"
            onClick={handleFlip}
          >
            Flip
          </button>
        ) : isLastFlashcard ? (
          <Link
            to="/"
            className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-24"
          >
            Go to Decks
          </Link>
        ) : (
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-24"
            onClick={handleNextCard}
          >
            Next Card
          </button>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
