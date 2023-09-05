import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useParams, Link } from "react-router-dom";

const SeeDeck = () => {
  const { userId, deckName, language } = useParams();
  const [deckFlashcards, setDeckFlashcards] = useState([]);
  const [currentUser, setcurrentUser] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchFlashcards = async () => {
      setcurrentUser(auth.currentUser)
      const collectionPath = userId !== undefined
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
      setDeckFlashcards(flashcards);
    };

    fetchFlashcards().catch((error) => {
      console.error("Error fetching flashcards:", error);
    });

    return () => {
      isMounted = false;
    };
  }, [deckName, language, userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">{deckName}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deckFlashcards.map((flashcard, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg p-4 shadow-lg hover:shadow-xl transition duration-300"
          >
            <h3 className="text-lg font-semibold mb-2">Flashcard {index + 1}</h3>
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
            </div>
          </div>
        ))}
      </div>
      {/* Conditional Button */}
      {userId ? (
        <Link
          to={`/review/${userId}/${encodeURIComponent(language)}/${encodeURIComponent(deckName)}`}
          className="fixed bottom-0 left-0 w-full bg-blue-500 text-white py-3 text-center font-semibold hover:bg-blue-600 transition-colors duration-300"
        >
          Review
        </Link>
      ) : (
        <Link
          to={`/users/${encodeURIComponent(currentUser.uid)}/languages/${encodeURIComponent(language)}/decks/${encodeURIComponent(deckName)}`}
          className="fixed bottom-0 left-0 w-full bg-blue-500 text-white py-3 text-center font-semibold hover:bg-blue-600 transition-colors duration-300"
        >
          Add to Your List
        </Link>
      )}
    </div>
  );
};

export default SeeDeck;
