import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchLanguagesAndDecksFromFirebase,
  deleteDeckFromCollection,
} from "./firebaseUtils";
import { auth } from "../firebase/firebase";
import OrderAndDisplaySide from "../Components/OrderAndDisplaySide";

const Deck = () => {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchLanguagesAndDecksFromFirebase(setLanguages);
  }, []); // Empty dependency array, so it runs only once on initial mount

  const handleDeleteClick = async (languageId, deckId) => {
    try {
      await deleteDeckFromCollection(languageId, deckId, false);
      // Refetch languages and decks after successful addition/deletion
      fetchLanguagesAndDecksFromFirebase(setLanguages);
    } catch (error) {
      console.error("Error while adding/deleting deck:", error);
    }
  };

  return (
    <div className="p-5 min-h-screen  flex justify-center ">
      <div className=" p-3 bg-gray-100 shadow-md rounded-lg  w-full md:w-1/2 lg:w-1/3">
        <h1 className="text-4xl  mb-4 flex justify-center items-center font-abel">
          DECK LISTS
        </h1>
        <OrderAndDisplaySide />

        <div className="space-y-6 ml-4 sm:ml-10">
          {languages.map((language) => (
            <div
              key={language.id}
              className="border border-gray-200 p-4 rounded shadow-md mr-7"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-center font-['Roboto']">
                {language.id}
              </h2>
              <ul className="space-y-3 font-abel">
                {language.decks.map((deck) => (
                  <li key={deck.id} className="flex items-center space-x-3">
                    <Link
                      to={`/deck/languages/${encodeURIComponent(
                        language.id
                      )}/decks/${encodeURIComponent(deck.isLikedByUser)}/${encodeURIComponent(deck.name)}`}
                      className="text-blue-500 hover:underline transition duration-300 ease-in-out transform hover:scale-105 text-lg sm:text-xl"
                    >
                      {deck.name}
                    </Link>
                    {auth.currentUser ? (
                      <div className="flex items-center space-x-2">
                        {deck.creatorUser === auth.currentUser.uid ? (
                          <button
                            onClick={() => {
                              handleDeleteClick(language.id, deck.id);
                            }}
                            className="px-4 py-2 rounded-full font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 flex items-center space-x-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 448 512"
                            >
                              <path
                                fill="currentColor"
                                d="M364 24H84c-22.1 0-40 17.9-40 40v384c0 22.1 17.9 40 40 40h280c22.1 0-40-17.9-40-40V64c0-22.1-17.9-40-40-40zm-16 392c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v224zm-64 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v224zm-64 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v224zm-64 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v224z"
                              ></path>
                            </svg>
                            <div>Delete From EveryOne</div>
                          </button>
                        ) : null}
                      </div>
                    ) : null}
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
