import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrder, setDisplayOrder } from "../../redux/reducers";

const Deck = () => {
  const [languages, setLanguages] = useState([]);
  const dispatch = useDispatch();

  const isRandomOrder = useSelector((state) => state.flashcards.isRandomOrder);
  const isFrontDisplayed = useSelector((state) => state.flashcards.isFrontDisplayed);

  async function fetchLanguagesAndDecksFromFirebase() {
    const languagesCollectionRef = collection(db, "languages");

    try {
      const languagesQuerySnapshot = await getDocs(languagesCollectionRef);
      const languagesData = [];

      for (const languageDoc of languagesQuerySnapshot.docs) {
        const languageId = languageDoc.id;

        const languageData = {
          id: languageId,
          decks: []
        };

        const decksCollectionRef = collection(db, `languages/${languageId}/decks`);
        const decksQuerySnapshot = await getDocs(decksCollectionRef);

        for (const deckDoc of decksQuerySnapshot.docs) {
          const deckId = deckDoc.id;
          const deckData = deckDoc.data();
          languageData.decks.push({
            id: deckId,
            ...deckData
          });
        }

        languagesData.push(languageData);
      }

      setLanguages(languagesData);
    } catch (error) {
      console.error("Error fetching languages and decks:", error);
    }
  }

  useEffect(() => {
    fetchLanguagesAndDecksFromFirebase();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-black flex justify-center items-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2  ">
        <h1 className="text-2xl font-bold mb-4 flex justify-center items-center">Language Page</h1>
        
        <div className="space-y-4">
          {languages.map((language) => (
            <div key={language.id}>
              <h2 className="text-xl font-semibold mb-2">{language.id}</h2>
              <ul className="space-y-2">
                {language.decks.map((deck) => (
                  <li key={deck.id}>
                    <Link
                      to={`/languages/${encodeURIComponent(language.id)}/decks/${encodeURIComponent(deck.name)}`}
                      className="text-blue-500 hover:underline block transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      {deck.name}
                    </Link>
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