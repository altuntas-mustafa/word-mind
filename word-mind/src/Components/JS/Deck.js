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
    <div className="deck-container bg-gray-100 p-4 flex flex-col items-center mt-12">
      <h1 className="deck-title text-3xl font-bold mb-4">Language Page</h1>
      <div className="options mb-4">
        <div className="toggle-container">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isRandomOrder}
              onChange={() => dispatch(setOrder(!isRandomOrder))}
            />
            <span className="text-sm">Random Order</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isFrontDisplayed}
              onChange={() => dispatch(setDisplayOrder(!isFrontDisplayed))}
            />
            <span className="text-sm">Random Side</span>
          </label>
        </div>
      </div>
      <div className="language-list-container">
        <ul className="language-list">
          {languages.map((language) => (
            <li key={language.id} className="language-item mb-4">
              <h2 className="language-name text-lg font-semibold">{language.id}</h2>
              <ul className="deck-list">
                {language.decks.map((deck) => (
                  <li key={deck.id} className="deck-item">
                    <Link
                      to={`/languages/${encodeURIComponent(language.id)}/decks/${encodeURIComponent(deck.name)}`}
                      className="deck-link text-blue-500 hover:underline"
                    >
                      {deck.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Deck;
