// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


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

export { db };