import AuthCheck from 'components/AuthCheck'
import PostFeed from 'components/PostFeed';
import { collection, doc, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { UserContext } from 'lib/context';
import { useRouter } from 'next/router';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast'
import { useContext } from 'react';
import { firestore, auth } from '../../../lib/firebaseInit';
import kebabCase from 'lodash.kebabcase'

export default function AdminPostsPage() {

  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}


function PostList() {
  // Get a  Firestore collection reference to 'users/{uid}/posts' 
  // @ts-ignore
  const ref = collection(firestore, 'users', auth.currentUser.uid, 'posts')
  // Create a query against the collection to sort by 'createdAt' in descending order
  const postQuery = query(ref, orderBy('createdAt', 'desc'))

  // Add a listener to the query and receive an array of posts to get real time updates
  // using this you cant use other options like delete a document
  const [querySnapshot] = useCollection(postQuery)

  // Get the data from each document and map it to a post object
  const posts = querySnapshot?.docs.map(doc => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  )

}


function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = React.useState('')

  // Ensure slug is URL safe removing spaces and special characters
  const slug = encodeURI(kebabCase(title))

  // Validate length
  const isValid = title.length > 3 && title.length < 100


  async function createPost(e: any) {
    e.preventDefault()

    // Get a uid of the current user
    // @ts-ignore
    const uid = auth.currentUser.uid

    // Create a reference to the desired collection
    // like 'users/{uid}/posts/{slug}'
    // for example 'users/abc123/posts/my-new-post'
    // to create a document in that collection
    const ref = doc(firestore, 'users', uid, 'posts', slug)

    // Then create the document
    // creating a 'schema' for the document
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      // 👇 add the timestamp, with serverTimestamp() from firebase
      // its more accurate than Date.now()
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0
    }

    // Then use the setDoc() method to create the document
    // and pass the data as the second argument
    await setDoc(ref, data)

    // Then show a toast notification
    toast.success('Post created!')

    // Finally, redirect to the new post URL
    router.push(`/admin/${slug}`)

  }

  return (
    <form onSubmit={createPost}>
      <input value={title} onChange={(e) => setTitle(e.target.value)}
        placeholder="My New Amazing Post!"
      />
      <p>
        <strong>Slug: {slug}</strong>
      </p>
      <button type='submit' disabled={!isValid} className='btn-green'>
        Create a New Post
      </button>

    </form>
  )

}