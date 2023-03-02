import React from 'react'
import UserProfile from 'components/UserProfile'
import PostFeed from 'components/PostFeed'
import { firestore, getUserWithUsername, postToJson } from 'lib/firebaseInit'
import { collection, limit, orderBy, where, query, getDocs } from 'firebase/firestore'

export default function UserProfilePage({ user, posts }: any) {
  console.log("🚀 ~ file: index.tsx:8 ~ UserProfilePage ~ posts:", posts)
  console.log("🚀 ~ file: index.tsx:7 ~ UserProfilePage ~ user:", user)
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}


export async function getServerSideProps({ query: urlQuery }: any) {
  const { username } = urlQuery

  const userDoc = await getUserWithUsername(username)
  console.log("🚀 ~ file: index.tsx:20 ~ getServerSideProps ~ userDoc:", userDoc)

  if (!userDoc) {
    return {
      notFound: true
    }
  }

  let user = null
  let posts = null

  if (userDoc) {
    user = userDoc.data()


    const postsQuery = query(
      collection(firestore, userDoc.ref.path, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    )

    posts = (await getDocs(postsQuery)).docs.map((doc) => {
      return postToJson(doc)
    })



  }

  user = postToJson(userDoc)

  return {
    props: {
      user,
      posts
    }
  }
}