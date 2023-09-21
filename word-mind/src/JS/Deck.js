import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchLanguagesAndDecksFromFirebase,
} from "./firebaseUtils";
import { auth } from "../firebase/firebase";
import OrderAndDisplaySide from "../Components/OrderAndDisplaySide";

const Deck = () => {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchLanguagesAndDecksFromFirebase(setLanguages);
  }, []); // Empty dependency array, so it runs only once on initial mount

  // const handleDeleteClick = async (languageId, deckId) => {
  //   try {
  //     await deleteDeckFromCollection(languageId, deckId, false);
  //     // Refetch languages and decks after successful addition/deletion
  //     fetchLanguagesAndDecksFromFirebase(setLanguages);
  //   } catch (error) {
  //     console.error("Error while adding/deleting deck:", error);
  //   }
  // };

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
                  <Link
                    key={deck.id}
                    to={
                      auth.currentUser
                        ? deck.creatorUser === auth.currentUser.uid
                          ? `/deck/languages/${encodeURIComponent(
                            language.id
                          )}/decks/${encodeURIComponent(
                            deck.isLikedByUser
                          )}/${encodeURIComponent(deck.name)}/creator`
                          : `/deck/languages/${encodeURIComponent(
                            language.id
                          )}/decks/${encodeURIComponent(
                            deck.isLikedByUser
                          )}/${encodeURIComponent(deck.name)}/notcreator`
                        : `/deck/languages/${encodeURIComponent(
                          language.id
                        )}/decks/${encodeURIComponent(
                          deck.isLikedByUser
                        )}/${encodeURIComponent(deck.name)}/notcreator`
                    }
                    className="flex items-center space-x-3 w-full sm:text-sm"
                  >
                    <div className="flex-1 inline-flex items-center h-20 px-5 duration-150 bg-gradient-to-r from-blue-600 via-blue-300 to-green-300 border-b border-gray-400 rounded-lg focus:shadow-outline hover:bg-gray-400 text-0.1l lg:text-2xl text-white font-semibold">
                      {deck.name}
                      <span className="text-3xl md:text-4xl  lg:text-5xl ml-auto">&gt;</span>
                    </div>


                  </Link>
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
