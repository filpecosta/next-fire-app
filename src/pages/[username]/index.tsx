import React, { useEffect } from 'react'
import UserProfile from 'components/UserProfile'
import PostFeed from 'components/PostFeed'
import { firestore, getUserWithUsername, postToJson } from 'lib/firebaseInit'
import { collection, limit, orderBy, where, query, getDocs, addDoc, collectionGroup } from 'firebase/firestore'

export default function UserProfilePage({ user, posts }: any) {


  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}


export async function getServerSideProps({ query: urlQuery }: any) {
  const { username } = urlQuery


  // Get the user with the username
  const userDoc = await getUserWithUsername(username)
  console.log("🚀 ~ file: index.tsx:21 ~ getServerSideProps ~ userDoc:", userDoc)

  if (!userDoc) {
    return {
      notFound: true
    }
  }

  let user = null
  let posts = null

  if (userDoc) {

    user = userDoc.data()
    // Convert a Firestore document to JSON
    user = postToJson(userDoc)

    // Create a query against the collection
    const postsQuery = query(
      collection(firestore, userDoc.ref.path, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    )

    // Get the posts from the query
    posts = (await getDocs(postsQuery)).docs.map((doc) => {
      return postToJson(doc)
    })

  }





  return {
    props: {
      user,
      posts,
    }
  }
}