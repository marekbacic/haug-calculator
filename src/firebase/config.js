import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBODpeDXianUxhYBJM1-O3j19qVGmA6QIY",
  authDomain: "haugchemie1.firebaseapp.com",
  projectId: "haugchemie1",
  storageBucket: "haugchemie1.firebasestorage.app",
  messagingSenderId: "873970413604",
  appId: "1:873970413604:web:acd25cbdba08576a45e8b1"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };