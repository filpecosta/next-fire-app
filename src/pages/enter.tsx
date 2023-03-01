import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../../lib/firebaseInit'
import React, { useContext } from 'react'
import { UserContext } from 'lib/context'

export default function Enter() {
  const user = null
  const { username } = useContext(UserContext)

  // Sign in with Google button
  // Component SignInButton
  function SignInButton() {
    async function signInWithGoogle() {
      try {
        await signInWithPopup(auth, googleProvider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
      } catch (error) {
        console.log(error)
      }
    }
    return (
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={'/google.png'} /> Sign in with Google
      </button>
    );
  }




  // Sign out button
  function SignOutButton() {

    async function logout() {
      signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
        console.log(error)
      });
    }


    return (
      <button onClick={logout}>
        Sign Out
      </button>
    )
  }

  // 



  // 1° user signed out <SignInButton />
  // 2° user signed in, but missing username <UsernameForm />
  // 3° user signed in, has username <SignOutButton />
  return (
    <main>
      {
        user ? (
          !username ? (
            // tem usuario, mas nao tem username
            <UsernameForm />
          ) : (
            // tem usuario, e tem username
            <SignOutButton />
          )
        ) : (
          // não tem usuario
          <SignInButton />
        )
      }
    </main>
  )
} 