// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjYy1FzTbcsoe1DfKG4yazPIS5dBR2Y7A",
  authDomain: "comp1682-d543e.firebaseapp.com",
  projectId: "comp1682-d543e",
  storageBucket: "comp1682-d543e.firebasestorage.app",
  messagingSenderId: "818781240757",
  appId: "1:818781240757:web:8be501cebf330f8464edfc",
  measurementId: "G-BXDJV3KGMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db=getFirestore(app);
export const auth=getAuth();
export default app;