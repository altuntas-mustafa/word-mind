import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchLanguagesAndDecksFromFirebase,
  addLanguageDeckAndHandleLike,
  deleteDeckFromCollection,
} from "./firebaseUtils";
import { auth } from "../firebase/firebase";
import OrderAndDisplaySide from "../Components/OrderAndDisplaySide";

const Deck = () => {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchLanguagesAndDecksFromFirebase(setLanguages);
  }, []); // Empty dependency array, so it runs only once on initial mount

  const handleLikeClick = async (languageId, deckId) => {
    try {
      await addLanguageDeckAndHandleLike(languageId, deckId);
      // Refetch languages and decks after successful addition/deletion
      fetchLanguagesAndDecksFromFirebase(setLanguages);
    } catch (error) {
      console.error("Error while adding/deleting deck:", error);
    }
  };
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
                      )}/decks/${encodeURIComponent(deck.name)}`}
                      className="text-blue-500 hover:underline transition duration-300 ease-in-out transform hover:scale-105 text-lg sm:text-xl"
                    >
                      {deck.name}
                    </Link>
                    {auth.currentUser ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            try {
                              handleLikeClick(language.id, deck.id);
                            } catch (error) {
                              console.error(
                                "Error while adding/deleting deck:",
                                error
                              );
                            }
                          }}
                          className={`px-4 py-2 rounded-full font-semibold ${
                            deck.isLikedByUser
                              ? "bg-green-400 text-white"
                              : "bg-gray-200 text-gray-700"
                          } hover:bg-opacity-80 transition-colors duration-300 flex items-center space-x-2`}
                        >
                          {deck.isLikedByUser ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 448 512"
                              >
                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                              </svg>
                              <div>Added</div>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 512 512"
                              >
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0-14 10.7 24-24s24 10.7 24 24H280v64c0-13.3-10.7-24-24-24s-14-10.7 24-24z" />
                              </svg>
                              <div>Add</div>
                            </>
                          )}
                        </button>
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
