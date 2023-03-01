import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAIp34XVx-FJ-xcGmhKeKj8gAA7BYYhXk",
  authDomain: "next-fire-app-8039a.firebaseapp.com",
  projectId: "next-fire-app-8039a",
  storageBucket: "next-fire-app-8039a.appspot.com",
  messagingSenderId: "383814181219",
  appId: "1:383814181219:web:72ea41744f83cf9f68f356",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize other services on firebaseApp...
export const db = getFirestore();
export const auth = getAuth();

export default firebaseApp;
