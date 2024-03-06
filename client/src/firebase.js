// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "projectdancecourse.firebaseapp.com",
  projectId: "projectdancecourse",
  storageBucket: "projectdancecourse.appspot.com",
  messagingSenderId: "359729688383",
  appId: "1:359729688383:web:c04be831177e83217a2d8a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
