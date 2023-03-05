import AuthCheck from 'components/AuthCheck'
import HeartButton from 'components/HeartButton'
import PostContent from 'components/PostContent'
import { collectionGroup, doc, getDoc, getDocs, limit, query } from 'firebase/firestore'
import { firestore, getUserWithUsername, postToJson } from 'lib/firebaseInit'
import React from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'

export default function SlugPost(props: any) {
  // Get the post from props
  // with the path to the post
  const postRef = doc(firestore, props.path)

  // Get the post from the database with useDocumentData hook
  // 
  const [realTimePost] = useDocumentData(postRef)

  // If the post is real time, use that, otherwise use the post from props
  // this will make the post real time, so if the post is updated, it will update in the UI
  const post = realTimePost || props.post

  return (
    <main>
      <section>
        <PostContent post={post} />
      </section>

      <aside className='card'>
        <p>
          <strong>{post.heartCount || 0}  🤍</strong>
        </p>

        <AuthCheck>
          <HeartButton postRef={postRef} />
        </AuthCheck>

      </aside>
    </main>
  )
}


// When a user navigates to a post, 
// and getStaticProps will run on the server to get the post data
// getStaticPaths will run on the server to generate the paths for the post pages
export async function getStaticProps({ params }: any) {
  // Get the user's username and slug from the params
  const { username, slug } = params

  // Get the user's document with the username
  const userDoc = await getUserWithUsername(username)

  // Declare the post variable and path to get of out of the if statement
  let post
  let path

  // Get the post from the user's document
  if (userDoc) {
    // Get the post's document reference
    const postRef = doc(firestore, userDoc.ref.path, 'posts', slug)

    // Get the post's data from the document
    post = postToJson(await getDoc(postRef))

    // Get the path to the post
    path = postRef.path

  }

  // Return the post and path as props
  return {
    props: {
      post,
      path
    },
    // Revalidate every 5 seconds, ISR (Incremental Static Regeneration)
    revalidate: 5000
  }


}

// Get the paths for the post pages with getStaticPaths
export async function getStaticPaths() {

  // Make query to get all posts from the collection group
  const q = query(
    collectionGroup(firestore, 'posts'),
    limit(20)
  )

  // Get the posts from the query with getDocs
  const snapshot = await getDocs(q)

  // Get the paths from the posts
  const paths = snapshot.docs.map((doc) => {
    // Get the username and slug from the document
    const { slug, username } = doc.data()

    // Return the path object, with the username and slug
    return {
      params: { username, slug }
    }

  })

  // Return the paths as props
  // must be in this format
  // paths: [
  //   { params: { username: 'username', slug: 'slug' } },
  // ]
  return {
    // Paths: an array of path objects
    paths,
    // Fallback: true means that if a path is not returned from getStaticPaths,
    // then Next.js will attempt to generate the path on the fly.
    // Fallback: false means that if a path is not returned from getStaticPaths,
    // then Next.js will return a 404 page.
    // Fallback: 'blocking' means that if a path is not returned from getStaticPaths,
    // then Next.js will return a 404 page, but will attempt to generate the path on the fly.
    fallback: 'blocking'
  }

}