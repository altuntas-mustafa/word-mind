import React, { useState } from "react";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import Popup from "./Popup";

const AddDeck = () => {
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deckInfo, setDeckInfo] = useState({
    deckName: "",
    language: "",
    cards: [
      { front: "", back: "" },
      { front: "", back: "" },
    ],
  });

  const [selectedOption, setSelectedOption] = useState("manual");
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleCardChange = (index, field, value) => {
    const newCards = [...deckInfo.cards];
    newCards[index][field] = value;
    setDeckInfo({ ...deckInfo, cards: newCards });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonData = JSON.parse(event.target.result);
      setDeckInfo({
        deckName: jsonData.deckName || "",
        language: jsonData.language || "",
        cards: jsonData.cards || [],
      });
      setUploadedFile(file);
      setSelectedOption("manual");
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deckInfo.deckName || !deckInfo.language) {
      setErrorMessage("Please fill out the deck name and language fields.");
      setIsErrorPopupVisible(true);
      return;
    }
    if (
      deckInfo.cards.some(
        (card) =>
          (card.front.trim() + "" + card.back.trim()).split("").length < 2
      )
    ){
      setErrorMessage("Each card should have at least 2 total words (front and back combined).");
      setIsErrorPopupVisible(true);
      
      return;
    }

    const deckQuery = query(
      collection(db, "languages", deckInfo.language, "decks"),
      where("name", "==", deckInfo.deckName)
    );
    const deckQuerySnapshot = await getDocs(deckQuery);

    if (!deckQuerySnapshot.empty) {
      setErrorMessage( "A deck with the same name already exists. Please choose a different deck name.");
      setIsErrorPopupVisible(true);
      
      return;
    }

    try {
      const deckDocRef = doc(
        db,
        "languages",
        deckInfo.language,
        "decks",
        deckInfo.deckName
      );
      await setDoc(deckDocRef, {
        name: deckInfo.deckName,
      });

      const flashcardsCollectionRef = collection(deckDocRef, "flashcards");
      deckInfo.cards.forEach(async (card) => {
        await addDoc(flashcardsCollectionRef, {
          front: card.front,
          back: card.back,
        });
      });

      setIsSuccessPopupVisible(true);

      setDeckInfo({
        deckName: "",
        language: "",
        cards: [
          { front: "", back: "" },
          { front: "", back: "" },
        ],
      });
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-6 p-6 bg-gray-100 rounded-lg shadow-md h-screen">
        <h2 className="text-2xl font-semibold mb-4">Create New Deck</h2>
        <nav className="flex space-x-4">
          <div
            className={`py-2 px-4 rounded ${
              selectedOption === "manual"
                ? "bg-blue-500 text-white"
                : "bg-white"
            } cursor-pointer`}
            onClick={() => setSelectedOption("manual")}
          >
            Manual Input
          </div>
          <div
            className={`py-2 px-4 rounded ${
              selectedOption === "upload"
                ? "bg-blue-500 text-white"
                : "bg-white"
            } cursor-pointer`}
            onClick={() => setSelectedOption("upload")}
          >
            Upload JSON File
          </div>
        </nav>
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          {selectedOption === "upload" && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Upload JSON File:
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          {(selectedOption === "manual" || uploadedFile) && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Deck Name:
                </label>
                <input
                  type="text"
                  value={deckInfo.deckName}
                  onChange={(e) =>
                    setDeckInfo({ ...deckInfo, deckName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Language:
                </label>
                <input
                  type="text"
                  value={deckInfo.language}
                  onChange={(e) =>
                    setDeckInfo({ ...deckInfo, language: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-4">
                {deckInfo.cards.map((card, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Front:
                      </label>
                      <input
                        type="text"
                        value={card.front}
                        onChange={(e) =>
                          handleCardChange(index, "front", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Back:
                      </label>
                      <input
                        type="text"
                        value={card.back}
                        onChange={(e) =>
                          handleCardChange(index, "back", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setDeckInfo({
                      ...deckInfo,
                      cards: [...deckInfo.cards, { front: "", back: "" }],
                    })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Card
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Create Deck
                </button>
              </div>
            </div>
          )}
        </form>
         {/* Success Popup */}
      <Popup
        isVisible={isSuccessPopupVisible}
        onClose={() => setIsSuccessPopupVisible(false)}
        type="success"
        message="Deck and cards created successfully!"
      />
      
     {/* Error Popup */}
     <Popup
        isVisible={isErrorPopupVisible}
        onClose={() => setIsErrorPopupVisible(false)}
        type="error"
        message={errorMessage}
      />
      </div>
    </>
  );
};

export default AddDeck;
