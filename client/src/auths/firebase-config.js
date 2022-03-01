// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3U7_k914Z8yFdNcAePDEmLHfq4mYymyY",
  authDomain: "project-1-8e11b.firebaseapp.com",
  projectId: "project-1-8e11b",
  storageBucket: "project-1-8e11b.appspot.com",
  messagingSenderId: "365009250921",
  appId: "1:365009250921:web:79baa21a6119f7ddb350f8",
  measurementId: "G-7L121MZ8RT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
