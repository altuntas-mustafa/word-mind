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
    <div className=" flex-col justify-center items-center min-h-screen">
      <h2 className="font-serif text-x mb-4 text-center justify-center">{deckName}</h2>
      <div className="w-full mt-20 bg-white flex flex-col items-center text-3xl ">
        {!isFlipped && (
          <div className="mb-3 font-normal text-gray-900 dark:text-gray-700 flex flex-col items-center justify-center">
            <div className="mb-3 font-normal text-gray-900 dark:text-gray-700 items-center text-center ">
              {isFrontDisplayed && Math.random() < 0.5 ? (
                <p>{currentFlashcard.back} </p>
              ) : (
                <p> {currentFlashcard.front}</p>
              )}
            </div>
              
          </div>
          
        )}

        {isFlipped && (
          <div className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex flex-col items-center justify-center">
             <p className="mb-1 font-normal text-gray-700 dark:text-gray-400 font-serif">
              {currentFlashcard.front}
            </p>
            <hr className="w-full h-0.5 bg-black my-3" />
            
            <p className="mb-1 font-normal text-gray-700 dark:text-gray-400 font-serif">
              {currentFlashcard.back}
            </p>
          </div>
        )}
        {isFlipped && !isLastFlashcard ? (<button
            className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleNextCard}
            >
            Next Card
          </button>) : (
            
            <button
            className="px-3 py-2 mt-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleFlip}
            >
          Flip
        </button>
        )}
        {isLastFlashcard &&  (
          <Link to="/decks" className="viewDeck">
            Go to Decks
          </Link>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
