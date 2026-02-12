// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJOEQs5wX9BAtvJNCWhGbEdtV1h54kIcE",
  authDomain: "ludo-game-c3108.firebaseapp.com",
  databaseURL: "https://ludo-game-c3108-default-rtdb.firebaseio.com",
  projectId: "ludo-game-c3108",
  storageBucket: "ludo-game-c3108.firebasestorage.app",
  messagingSenderId: "277601811060",
  appId: "1:277601811060:web:3697b61a4838fae6daef21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)