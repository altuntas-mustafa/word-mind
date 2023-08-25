import React, { useState } from "react";
import { collection, addDoc, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "../CSS/AddDeck.css";

const AddDeck = () => {
  const [deckInfo, setDeckInfo] = useState({
    deckName: "",
    language: "",
    cards: [
      { front: "", back: "" },
      { front: "", back: "" },
    ],
  });

  const [selectedOption, setSelectedOption] = useState("manual"); // Default option is manual
  const [uploadedFile, setUploadedFile] = useState(null); // Track uploaded file

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
      setUploadedFile(file); // Set the uploaded file here
      setSelectedOption("manual"); // Switch to manual input
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deckInfo.deckName || !deckInfo.language) {
      alert("Please fill out the deck name and language fields.");
      return;
    }

    if (
      deckInfo.cards.some(
        (card) =>
          (card.front.trim() + " " + card.back.trim()).split(" ").length < 2
      )
    ) {
      alert("Each card should have at least 2 total words (front and back combined).");
      return;
    }

    const deckQuery = query(collection(db, "languages", deckInfo.language, "decks"), where("name", "==", deckInfo.deckName));
    const deckQuerySnapshot = await getDocs(deckQuery);

    if (!deckQuerySnapshot.empty) {
      alert("A deck with the same name already exists. Please choose a different deck name.");
      return;
    }

    try {
      const deckDocRef = doc(db, "languages", deckInfo.language, "decks", deckInfo.deckName);
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

      console.log("Deck and cards created successfully");
      
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
    <div className="add-deck-container">
      <h2 className="form-heading">Create New Deck</h2>
      <nav className="option-navbar">
        <div
          className={`option ${selectedOption === "manual" ? "selected" : ""}`}
          onClick={() => setSelectedOption("manual")}
        >
          Manual Input
        </div>
        <div
          className={`option ${selectedOption === "upload" ? "selected" : ""}`}
          onClick={() => setSelectedOption("upload")}
        >
          Upload JSON File
        </div>
      </nav>
      <form onSubmit={handleSubmit}>
        {selectedOption === "upload" && (
          <div className="form-group">
            <label>Upload JSON File:</label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
            />
          </div>
        )}
        {selectedOption === "manual" || uploadedFile ? ( // Render manual input form if selected or file uploaded
          <div>
            <div className="form-group">
              <label>Deck Name:</label>
              <input
                type="text"
                value={deckInfo.deckName}
                onChange={(e) =>
                  setDeckInfo({ ...deckInfo, deckName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label> Language :</label>
              <input
                type="text"
                value={deckInfo.language}
                onChange={(e) =>
                  setDeckInfo({ ...deckInfo, language: e.target.value })
                }
              />
            </div>
            <div className="card-group">
              {deckInfo.cards.map((card, index) => (
                <div key={index} className="input-group">
                  <label>Front:</label>
                  <input
                    type="text"
                    value={card.front}
                    onChange={(e) =>
                      handleCardChange(index, "front", e.target.value)
                    }
                  />
                  <label>Back:</label>
                  <input
                    type="text"
                    value={card.back}
                    onChange={(e) =>
                      handleCardChange(index, "back", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
            <div className="button-container">
              <button
                type="button"
                className="add-card-button"
                onClick={() =>
                  setDeckInfo({
                    ...deckInfo,
                    cards: [...deckInfo.cards, { front: "", back: "" }],
                  })
                }
              >
                Add Card
              </button>
              <button type="submit" className="create-deck-button">
                Create Deck
              </button>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default AddDeck;
