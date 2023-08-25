import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../CSS/FlashCards.css";

const Flashcards = () => {
  const { deckName, language } = useParams();
  const [shuffledFlashcards, setShuffledFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const isRandomOrder = useSelector((state) => state.flashcards.isRandomOrder);
  const isFrontDisplayed = useSelector((state) => state.flashcards.isFrontDisplayed);

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
      const flashcardsCollectionRef = collection(db, `languages/${language}/decks/${deckName}/flashcards`);
      const flashcardsQuerySnapshot = await getDocs(flashcardsCollectionRef);
      const flashcards = [];

      flashcardsQuerySnapshot.forEach((flashcardDoc) => {
        flashcards.push(flashcardDoc.data());
      });

      const shuffledFlashcards = isRandomOrder ? shuffleArray(flashcards) : flashcards;

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
    <div className="flashcards-container">
      <h2>{deckName}</h2>
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
        <div className="flashcard-content front">
          {isFrontDisplayed && Math.random() < 0.5 ? (
            <p>{currentFlashcard.back}</p>
          ) : (
            <p>{currentFlashcard.front}</p>
          )}
          <button onClick={handleFlip}>Flip</button>
        </div>

        {isFlipped && (
          <div className="flashcard-content back">
            <p className="front-word">{currentFlashcard.front}</p>
            <hr className="line" />
            <p className="back-word">{currentFlashcard.back}</p>
            {isLastFlashcard && (
              <Link to="/decks" className="viewDeck">
                Go to Decks
              </Link>
            )}
            {!isLastFlashcard && (
              <button onClick={handleNextCard}>Next Card</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
