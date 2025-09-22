// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Log to check if environment variables are loading
console.log("Firebase API Key:", process.env.REACT_APP_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Check if any config values are missing
const missingConfig = Object.entries(firebaseConfig).filter(([key, value]) => !value);
if (missingConfig.length > 0) {
  console.error("Missing Firebase config values:", missingConfig);
  throw new Error("Firebase configuration is incomplete. Check your environment variables.");
}

const app = initializeApp(firebaseConfig);

// Export auth instance
export const auth = getAuth(app);