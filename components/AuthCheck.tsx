import { UserContext } from 'lib/context'
import Link from 'next/link'
import React, { useContext } from 'react'

export default function AuthCheck(props: any) {
  // Get the user from the UserContext
  const { username } = useContext(UserContext)

  // If there is no user, redirect to /enter
  // but if there is a user, render the children
  return (
    username ? (
      props.children
    ) : (
      props.fallback || <Link href={'/enter'}>You must be signed in</Link>
    )
  )

}
