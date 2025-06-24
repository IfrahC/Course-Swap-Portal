// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <-- Add this line
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMbaB7KJhIjoJT5JcVWuW7RbQ7b96Hxn8",
  authDomain: "hucourseswap.firebaseapp.com",
  projectId: "hucourseswap",
  storageBucket: "hucourseswap.firebasestorage.app",
  messagingSenderId: "1066163183237",
  appId: "1:1066163183237:web:d2141f61064ed13ad853ec",
  measurementId: "G-SYNZ3BJBBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
export default firebaseConfig;