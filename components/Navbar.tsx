import React from 'react'
import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from 'lib/context'
import Image from 'next/image'


export default function Navbar() {
  const { user, username } = useContext(UserContext)
  console.log("🚀 ~ file: Navbar.tsx:9 ~ Navbar ~ user:", user)
  console.log("🚀 ~ file: Navbar.tsx:9 ~ Navbar ~ username:", username)


  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link href="/">
            <button className='btn-logo' >Feed</button>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className='push-left'>
              <Link href="/admin">
                <button className='btn-blue' >Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                {/* <img src={user?.photoURL} /> */}
                <Image src={user?.photoURL} alt="user photo" width={30} height={30} />
              </Link>
            </li>
          </>
        )
        }

        {/* user is not signed OR has not created username */}
        {!username &&
          (
            <li>
              <Link href={'/enter'}>
                <button className='btn-blue' >Log in</button>
              </Link>
            </li>
          )
        }
      </ul>
    </nav>
  )
}
