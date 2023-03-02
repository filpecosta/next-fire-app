import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";

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
export const firestore = getFirestore();
export const auth = getAuth();

export default firebaseApp;

export const googleProvider = new GoogleAuthProvider();

export const googleSignIn = async () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // The signed-in user info.
      const user = result.user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

// Receber o users/{uid} com o username
export async function getUserWithUsername(username: any) {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", username),
    limit(1)
  );

  // const querySnapshot = await getDocs(q);
  const querySnapshot = await (await getDocs(q)).docs[0];

  return querySnapshot;
}

// Converts a firestore document to JSON
export function postToJson(doc: any) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt?.toMillis() || 0,
    updatedAt: data?.updatedAt?.toMillis() || 0,
  };
}
