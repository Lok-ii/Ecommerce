// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmGrP6cLmL8NlvofDDI_pUkdj_nxxA0D4",
  authDomain: "express-buy-d7f41.firebaseapp.com",
  projectId: "express-buy-d7f41",
  storageBucket: "express-buy-d7f41.appspot.com",
  messagingSenderId: "227257996087",
  appId: "1:227257996087:web:cfbdf20426868515c180b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;