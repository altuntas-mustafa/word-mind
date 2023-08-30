// // languageFunctions.js
// import { doc, getDoc, setDoc, query, collection, getDocs, where } from "firebase/firestore";
// import { db } from "../firebase/firebase";

// export const checkAndCreateLanguage = async (language) => {
//   const languageDocRef = doc(db, "languages", language);
//   const languageDocSnapshot = await getDoc(languageDocRef);

//   if (!languageDocSnapshot.exists()) {
//     await setDoc(languageDocRef, { name: language });
//   }
// };

// export const checkAndCreateDeck = async (language, deckName) => {
//   const languageDocRef = doc(db, "languages", language);
//   const deckQuery = query(
//     collection(languageDocRef, "decks"),
//     where("name", "==", deckName)
//   );
//   const deckQuerySnapshot = await getDocs(deckQuery);

//   if (deckQuerySnapshot.empty) {
//     const deckDocRef = doc(languageDocRef, "decks", deckName);
//     await setDoc(deckDocRef, {
//       name: deckName,
//     });
//     return true;
//   } else {
//     return false;
//   }
// };
