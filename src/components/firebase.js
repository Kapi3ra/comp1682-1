import { initializeApp } from "firebase/app";
import { getAnalytics, setAnalyticsCollectionEnabled, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjYy1FzTbcsoe1DfKG4yazPIS5dBR2Y7A",
  authDomain: "comp1682-d543e.firebaseapp.com",
  projectId: "comp1682-d543e",
  storageBucket: "comp1682-d543e.firebasestorage.app",
  messagingSenderId: "818781240757",
  appId: "1:818781240757:web:8be501cebf330f8464edfc",
  measurementId: "G-BXDJV3KGMG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported
let analytics = null;
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);

      // Disable analytics until user consents
      setAnalyticsCollectionEnabled(analytics, false);
    } else {
      console.warn("Analytics is not supported in this environment.");
    }
  })
  .catch((error) => console.error("Error checking analytics support:", error));

// Function to enable analytics if supported
export const enableAnalytics = () => {
  if (analytics) {
    setAnalyticsCollectionEnabled(analytics, true);
    console.log("Analytics enabled.");
  } else {
    console.warn("Analytics is not supported or not initialized.");
  }
};

// Export other Firebase services
export const db = getFirestore(app);
export const auth = getAuth();
export default app;
