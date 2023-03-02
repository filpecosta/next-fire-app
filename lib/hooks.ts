import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebaseInit";

export function useUserData() {
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (user) {
      getUserData(user);
    }
  }, [user]);

  // async function getUserData(user: any) {
  //   const docRef = doc(firestore, "users", user.uid);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     setUsername(docSnap.data()?.username);
  //     console.log("Document data:", docSnap.data()?.username);
  //   } else {
  //     setUsername(null);
  //     // doc.data() will be undefined in this case
  //     console.log("No such document - username!");
  //   }
  // }

  async function getUserData(user: any) {
    const unsub = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
      console.log("Current data: ", doc.data());

      if (doc.data()) {
        setUsername(doc.data()?.username);
        console.log("Document data:", doc.data()?.username);
      } else {
        setUsername(null);
        // doc.data() will be undefined in this case
        console.log("No such document - username!");
      }
    });
  }

  return { user, username };
}
