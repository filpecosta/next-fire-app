import { doc, getDoc, increment, writeBatch } from 'firebase/firestore'
import { auth, firestore } from 'lib/firebaseInit'
import React from 'react'
import { useDocument, useDocumentData } from 'react-firebase-hooks/firestore'

export default function HeartButton({ postRef }: any) {

  // @ts-ignore
  const heartRef = doc(firestore, postRef.path, 'hearts', auth?.currentUser?.uid)

  const [heartDoc] = useDocument(heartRef)

  //  I cant use this 'standard firebase method' because component cant be async
  // const heartDocStandard = await getDoc(heartRef)

  async function addHeart() {
    const uid = auth?.currentUser?.uid
    // Create a batch
    const batch = writeBatch(firestore)

    // Add a new heart document to the post with the current user's uid and field heartCount with ...value increment + 1
    batch.update(postRef, {
      heartCount: increment(1)
    })
    // With heartRef, add a new document with the current user's uid in the field
    batch.set(heartRef, {
      uid
    })

    batch.commit()

  }


  async function removeHeart() {
    const batch = writeBatch(firestore)

    batch.update(postRef, {
      heartCount: increment(-1)
    })

    batch.delete(heartRef)

    batch.commit()
  }

  return (
    heartDoc?.exists() ? (
      <button onClick={removeHeart}>💔 Unheart</button>
    ) : (
      <button onClick={addHeart}>🤍 Heart</button>
    )
  )
}
