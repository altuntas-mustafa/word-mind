import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const handleSubmit = async (deckInfo, user, setIsErrorPopupVisible, setIsSuccessPopupVisible, setErrorMessage, setDeckInfo) => {
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

  try {
    // Check if the language already exists
    const languageDocRef = doc(db, "languages", deckInfo.language);
    const languageDocSnapshot = await getDoc(languageDocRef);

    if (!languageDocSnapshot.exists()) {
      // If the language doesn't exist, create it
      await setDoc(languageDocRef, { name: deckInfo.language });
    }

    // Check if the deck already exists within the language
    const deckQuery = query(
      collection(languageDocRef, "decks"),
      where("name", "==", deckInfo.deckName)
    );
    const deckQuerySnapshot = await getDocs(deckQuery);

    if (!deckQuerySnapshot.empty) {
      setErrorMessage("A deck with the same name already exists. Please choose a different deck name.");
      setIsErrorPopupVisible(true);
      return;
    }

    // If the language and deck are valid, create the deck
    const deckDocRef = doc(languageDocRef, "decks", deckInfo.deckName);
    await setDoc(deckDocRef, {
      name: deckInfo.deckName,
      creatorUser: user.id,
      accessUser: [{ userId: user.id }],
    });

    const flashcardsCollectionRef = collection(deckDocRef, "flashcards");
    await Promise.all(deckInfo.cards.map(async (card) => {
      await addDoc(flashcardsCollectionRef, {
        front: card.front,
        back: card.back,
      });
    }));

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
