import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQWjOMi_txWlRspr2gjFIZ3LDdOZe0FwE",
    authDomain: "ankiapp-clone.firebaseapp.com",
    projectId: "ankiapp-clone",
    storageBucket: "ankiapp-clone.appspot.com",
    messagingSenderId: "454343593837",
    appId: "1:454343593837:web:085e3d784310e0fb101464"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Move this line after initializing `app`

export { db, auth };
