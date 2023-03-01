import '@/styles/globals.css'
import Navbar from 'components/Navbar'
import { UserContext } from 'lib/context'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, firestore } from 'lib/firebaseInit'
import { useUserData } from 'lib/hooks'

export default function App({ Component, pageProps }: AppProps) {

  const userData = useUserData()



  return (
    <>
      <UserContext.Provider value={userData}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </>
  )
}
