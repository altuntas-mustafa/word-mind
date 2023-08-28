import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrder, setDisplayOrder } from "../redux/reducers";

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
          languageData.decks.push({
            id: deckId,
            ...deckData,
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
    <div className="p-5 min-h-screen bg-black flex justify-center  ">
      <div className="bg-white p-3 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3">
        <h1 className="text-4xl font-bold mb-4 flex justify-center items-center">
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
              <span className="ml-2">Random Order</span>
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
              <span className="ml-2">Random Side</span>
            </label>
          </div>
        </div>

        <div className="space-y-4 ml-10  ">
          {languages.map((language) => (
            <div key={language.id}>
              <h2 className="text-4xl font-semibold mb-2">{language.id}</h2>
              <ul className="space-y-2 ml-10">
                {language.decks.map((deck) => (
                  <li key={deck.id}>
                    <Link
                      to={`/languages/${encodeURIComponent(
                        language.id
                      )}/decks/${encodeURIComponent(deck.name)}`}
                      className="text-blue-500 hover:underline block transition duration-300 ease-in-out transform hover:scale-105 text-2xl"
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