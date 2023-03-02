import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth, firestore, googleProvider } from '../../lib/firebaseInit'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from 'lib/context'
import { doc, getDoc, writeBatch } from 'firebase/firestore'
import debounce from 'lodash.debounce'

export default function Enter() {
  const { user, username } = useContext(UserContext)
  console.log("🚀 ~ file: enter.tsx:10 ~ Enter ~ username:", username)
  console.log("🚀 ~ file: enter.tsx:10 ~ Enter ~ user:", user)

  // Sign in with Google button
  // Component SignInButton
  function SignInButton() {
    async function signInWithGoogle() {
      try {
        await signInWithPopup(auth, googleProvider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            // ...
          }).catch((error) => {
            console.log(error)
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




  // Sign out button Component
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


  // Username form Component
  function UsernameForm() {

    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, username } = useContext(UserContext)


    // 1° check length of username
    // 2° check if username is alphanumeric
    // 3° check if username is available in firestore



    function onChange(e: any) {
      const value = e.target.value.toLowerCase()
      const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

      if (value.length < 3) {
        setFormValue(value)
        setLoading(false)
        setIsValid(false)
      }

      if (re.test(value)) {
        setFormValue(value)
        setLoading(true)
        setIsValid(false)
      }
    }



    useEffect(() => {
      checkUsername(formValue)
    }, [formValue])


    const checkUsername = useCallback(
      debounce(async (username: any) => {
        if (username.length >= 3) {
          const docRef = doc(firestore, "username", username);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log('Firestore read')
            setIsValid(false)
            setLoading(false)
          } else {
            setIsValid(true)
            setLoading(false)
            // doc.data() will be undefined in this case
            console.log("No such document!");
            console.log('Firestore read')
          }

        }
      }, 500),
      []
    )



    async function onSubmit(e: any) {
      e.preventDefault()


      // Get a new write batch
      const batch = writeBatch(firestore);

      const userRef = doc(firestore, "users", user.uid);
      const usernameRef = doc(firestore, "username", formValue);


      try {
        batch.set(userRef, {
          uid: user.uid,
          username: formValue,
          photoURL: user.photoURL,
          displayName: user.displayName
        });

        batch.set(usernameRef, { uid: user.uid });

        // Commit the batch
        await batch.commit();
      } catch (error) {
        console.log(error)
      }

    }


    return (
      !username && (
        <section>
          <h3>Choose Username</h3>
          <form onSubmit={onSubmit}>
            <input type={'text'} value={formValue} onChange={onChange} placeholder="username" name="username" />

            <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

            <button type={'submit'} className="btn-green" disabled={!isValid}>
              Choose
            </button>

            <h3>Debug State</h3>
            <div>
              Username: {formValue}
              <br />
              Loading: {loading.toString()}
              <br />
              isValid: {isValid.toString()}
            </div>
          </form>

        </section>
      )
    )
  }


  function UsernameMessage({ username, isValid, loading }: any) {

    if (loading) {
      return <p>Checking...</p>
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken! :(</p>
    } else {
      return <p></p>
    }
  }


  // 1° user signed out <SignInButton />
  // 2° user signed in, but missing username <UsernameForm />
  // 3° user signed in, has username <SignOutButton />
  return (
    <main>
      {
        user ? (
          !username ? (
            // @ts-ignore
            <UsernameForm />
          ) : (
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