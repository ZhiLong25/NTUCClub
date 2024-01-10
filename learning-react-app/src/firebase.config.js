// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOotQQqU92mk9dWywb1oCfHJNX42UCnqo",
  authDomain: "power-bbe1d.firebaseapp.com",
  projectId: "power-bbe1d",
  storageBucket: "power-bbe1d.appspot.com",
  messagingSenderId: "212809970178",
  appId: "1:212809970178:web:bb6bf2779119547c38ad1b",
  measurementId: "G-MRPK5J116C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);