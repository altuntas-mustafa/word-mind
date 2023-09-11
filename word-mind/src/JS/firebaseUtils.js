import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

// Function to handle form submission (create language, deck, and add to user liked decks)
export const handleSubmit = async (
  deckInfo,
  user,
  setIsErrorPopupVisible,
  setIsSuccessPopupVisible,
  setErrorMessage,
  setDeckInfo
) => {
  if (!deckInfo.deckName || !deckInfo.language) {
    setErrorMessage("Please fill out the deck name and language fields.");
    setIsErrorPopupVisible(true);
    return;
  }
  console.log(deckInfo.cards);
  if (
    deckInfo.cards.some(
      (card) => (card.front.trim() + "" + card.back.trim()).split("").length < 2
    )
  ) {
    setErrorMessage(
      "Each card should have at least 2 total words (front and back combined)."
    );
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
      setErrorMessage(
        "A deck with the same name already exists. Please choose a different deck name."
      );
      setIsErrorPopupVisible(true);
      return;
    }

    // If the language and deck are valid, create the deck
    const deckDocRef = doc(languageDocRef, "decks", deckInfo.deckName);
    await setDoc(deckDocRef, {
      name: deckInfo.deckName,
      creatorUser: user.id,
      flashcards: deckInfo.cards
    });

    const flashcardsCollectionRef = collection(deckDocRef, "flashcards");
    await Promise.all(
      deckInfo.cards.map(async (card) => {

        // Add the card document to Firestore with the updated memoriseLevel and averageLevel
        await addDoc(flashcardsCollectionRef, {
          front: card.front,
          back: card.back,
          memoriseLevel: [5], // Use the updated memoriseLevel
          averageLevel: 5, // Store the calculated averageLevel
        });
      })
    );


    // Call addLanguageDeckAndHandleLike to add the deck to the user's collection
    await addLanguageDeckAndHandleLike(deckInfo.language, deckInfo.deckName);
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


export async function addLanguageDeckAndHandleLike(languageId, deckId) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.log("User not authenticated");
    return;
  }

  try {
    const languagesCollectionRef = collection(db, "languages");
    const languageDocRef = doc(languagesCollectionRef, languageId);
    const deckCollectionRef = collection(languageDocRef, "decks");
    const deckDocRef = doc(deckCollectionRef, deckId);
    const deckDocSnapshot = await getDoc(deckDocRef);

    if (deckDocSnapshot.exists()) {
      const flashcardsCollectionRef = collection(deckDocRef, "flashcards");
      const flashcardsQuerySnapshot = await getDocs(flashcardsCollectionRef);


      const userLanguageCollection = collection(
        db,
        "users",
        currentUser.uid,
        "languages"
      );
      // Check if the language already exists
      const languageDocRef = doc(userLanguageCollection, languageId);
      const languageDocSnapshot = await getDoc(languageDocRef);

      if (!languageDocSnapshot.exists()) {
        // If the language doesn't exist, create it
        await setDoc(languageDocRef, { name: languageId });
      }

      const userDeckCollection = collection(
        userLanguageCollection,
        languageId,
        "decks"
      );
      const userDeckDoc = doc(userDeckCollection, deckId);
      const flashcardsData = flashcardsQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      await setDoc(
        userDeckDoc,
        {
          flashcards: flashcardsData,
          name: deckId
        },
        { merge: true }
      );

      const deckData = deckDocSnapshot.data();
      const isLikedByUser =
        Array.isArray(deckData.accessUser) &&
        deckData.accessUser.some((user) => user.userId === currentUser.uid);
      const deckRef = doc(deckCollectionRef, deckId);
      let updatedAccessUser;

      if (isLikedByUser) {
        updatedAccessUser = deckData.accessUser.filter(
          (user) => user.userId !== currentUser.uid
        );
        await deleteDoc(userDeckDoc);
      } else {
        updatedAccessUser = [
          ...(deckData.accessUser || []),
          { userId: currentUser.uid },
        ];
      }

      await updateDoc(deckRef, { accessUser: updatedAccessUser });
    } else {
      console.error("Deck does not exist");
    }

  } catch (error) {
    console.error("Error adding language, deck, and handling like:", error);
  }
}



export async function deleteDeckFromCollection(languageId, deckId, isUserCollection = false) {
  try {
    const currentUser = auth.currentUser;
    const collectionPath = isUserCollection
      ? `users/${currentUser.uid}/languages/${languageId}/decks`
      : `languages/${languageId}/decks`;

    const deckDocCollection = collection(db, collectionPath);
    const userDeckDoc = doc(deckDocCollection, deckId);

    // Delete the deck document
    await deleteDoc(userDeckDoc);

    // Delete all flashcards in the subcollection
    const flashcardsQuery = query(collection(userDeckDoc, 'flashcards'));
    const flashcardsSnapshot = await getDocs(flashcardsQuery);

    flashcardsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Check if the 'decks' subcollection is empty
    const decksQuery = query(collection(db, collectionPath));
    const decksSnapshot = await getDocs(decksQuery);

    if (decksSnapshot.size === 0) {
      const languageDocPath = isUserCollection
        ? `users/${currentUser.uid}/languages/${languageId}`
        : `languages/${languageId}`;

      try {
        const languageDoc = doc(db, languageDocPath);
        await deleteDoc(languageDoc);
      } catch (error) {
        console.error("Error deleting language:", error);
      }
    }
    if (isUserCollection) {
      addLanguageDeckAndHandleLike(languageId, deckId);
    }
  } catch (error) {
    console.error('Error deleting deck:', error);
  }
}


export async function fetchLanguagesAndDecksFromFirebase(setLanguages) {
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
        const currentUser = auth.currentUser;
        const isLikedByUser =
          currentUser &&
          Array.isArray(deckData.accessUser) &&
          deckData.accessUser.some((user) => user.userId === currentUser.uid);

        languageData.decks.push({
          id: deckId,
          isLikedByUser: isLikedByUser || false,
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



export async function changeWordLevel(userId, languageId, deckName, cardId, level) {
  console.log(userId);
  try {
    // Get a reference to the user's document
    const userDocRef = doc(collection(db, "users"), userId);

    // Check if the language document exists
    const languageDocRef = doc(userDocRef, "languages", languageId);

    // Check if the deck document exists within the language
    const deckQuery = query(
      collection(languageDocRef, "decks"),
      where("name", "==", deckName)
    );

    const deckQuerySnapshot = await getDocs(deckQuery);
    const deckDoc = deckQuerySnapshot.docs[0];

    if (deckDoc) {
      // // Construct the path to the flashcard within the deck
      // const flashcardPath = `flashcards.${cardId}`;

      // Get the current flashcard data
      const flashcardDocRef = doc(deckDoc.ref, "flashcards", cardId); // Updated path

      const flashcardDocSnapshot = await getDoc(flashcardDocRef);

      if (flashcardDocSnapshot.exists()) {
        // Flashcard data exists, update it
        const flashcardData = flashcardDocSnapshot.data();

        // Update the memoriseLevel array for the specific flashcard
        const memoriseLevelArray = flashcardData.memoriseLevel || [];
        memoriseLevelArray.push(level);

        // Calculate the average level
        const averageLevel = memoriseLevelArray.reduce((acc, val) => acc + val, 0) / memoriseLevelArray.length;

        // Update the flashcard data with the new memoriseLevel and averageLevel
        await updateDoc(flashcardDocRef, {
          memoriseLevel: memoriseLevelArray,
          averageLevel: averageLevel,
        });

        console.log(`Updated flashcard ${cardId} with level ${level} and averageLevel ${averageLevel}`);
      } else {
        // Flashcard data doesn't exist, create it
        const newFlashcardData = {
          memoriseLevel: [level],
          averageLevel: level, // Set initial average level to the same as the level
        };

        await setDoc(flashcardDocRef, newFlashcardData);

        console.log(`Created flashcard ${cardId} with level ${level} and averageLevel ${level}`);
      }
    } else {
      console.error(`Deck '${deckName}' not found in language '${languageId}' for user '${userId}'.`);
    }
  } catch (error) {
    console.error('Error updating flashcard level:', error);
  }
}



export async function addCurrentUserToUsersCollection() {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    // console.log('User not authenticated');
    return;
  }

  const userDocRef = doc(db, 'users', currentUser.uid);

  try {
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      // If the document doesn't exist, create it with the user's UID
      await setDoc(userDocRef, {
        userId: currentUser.uid
      });
    }
  } catch (error) {
    console.error('Error adding current user to "users" collection:', error);
  }
}