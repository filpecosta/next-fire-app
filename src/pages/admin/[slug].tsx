import AuthCheck from 'components/AuthCheck'
import ImageUploader from 'components/ImageUploader'
import Metatags from 'components/Metatags'
import { doc, getDoc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore'
import { watch } from 'fs'
import { auth, firestore } from 'lib/firebaseInit'
import { useRouter } from 'next/router'
import React from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

export default function AdminPostEdit() {
  return (
    <main>
      <Metatags title={'Admin Page'} />
      <AuthCheck>
        <PostManager />
      </AuthCheck>
    </main>
  )
}


function PostManager() {
  // Enable preview mode or not
  const [preview, setPreview] = React.useState(false)

  // Get slug of post from url, to get it in firestore
  const router = useRouter()
  const { slug } = router.query

  // Grab the post from firestore with the slug + auth.currentUser.uid of the collection 'posts'
  // its path is: /users/{uid}/posts/{slug}
  // example: /users/123/posts/my-first-post
  // @ts-ignore
  const docRef = doc(firestore, "users", auth.currentUser.uid, 'posts', slug);


  // Get the document
  // const docSnap = await getDoc(docRef);
  // Or using useDocumentDataOnce hook
  const [post] = useDocumentDataOnce(docRef)


  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());
  // } else {
  //   // doc.data() will be undefined in this case
  //   console.log("No such document!");
  // }


  return (
    <main>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm defaultValues={post} postRef={docRef} preview={preview} />
          </section>

          <ImageUploader />

          {/* Area to change preview mode */}
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
          </aside>
        </>
      )}
    </main>
  )

}


// PostForm with react-hook-form, to edit the post.
// #defaultValues is the post data from firestore
// #postRef is the post reference from firestore
// #preview is the preview mode, if true, the post will be preview mode
function PostForm({ defaultValues, postRef, preview }: any) {
  // defaultValues is the post data from firestore, it is a first value of the form
  // mode is onChange, so the form will be updated when the user change the input
  // register is a function to register the input of react-hook-form, its like a useState value of a standard  form
  // handleSubmit is a function to submit the form, its like a onSubmit of a standard form, do not needed to use preventDefault()

  const { register, handleSubmit, watch, reset, formState: { errors, isDirty, isValid } } = useForm({ defaultValues, mode: 'onChange' })




  // Function will be called when the form is submitted
  // this automatically receive the data of the form, and the event of the form like 'content' and 'published' field
  async function updatePost({ content, published }: any) {

    // Update the post in firestore
    await updateDoc(postRef, {
      content,
      published,
      // Update the timestamp of the post wiht the serverTimestamp of firestore timestamp
      updatedAt: serverTimestamp()
    })

    // When the post is updated, the form will be reseted with the new data
    reset({ content, published })

    toast.success('Post updated successfully')

  }

  return (
    // onSubmit receive a handleSubmit + updatePost function, that will be called when the form is submitted
    <form onSubmit={handleSubmit(updatePost)}>
      {/* // if form it is in a preview mode, then watch will be called, and the post will be updated */}
      {preview && (
        // Watch is a function to watch the input of the form, and return the value of the input
        // of 'content' in a object, like {content: 'the value of the input'}.
        // Its come of defaultValues and register content.
        <ReactMarkdown>{watch('content')}</ReactMarkdown>
      )}

      {/* // if form it is not in a preview mode, then the form will be showed */}
      {!preview && (
        <div>
          {/* To connect textare with the form, you should passing a ref with register */}
          <textarea  {...register('content', {
            // Validation of the content and custom message error
            maxLength: { value: 20000, message: 'content is to long' },
            minLength: { value: 10, message: 'content is to short' },
            required: { value: true, message: 'content is required' }
          })}></textarea>

          {/* Error message if errors.content have something to show in UI */}
          {/* @ts-ignore */}
          {errors.content && <p className='text-danger'>{errors.content.message}</p>}



          <fieldset>
            {/* To connect input checkbox with form, ref is a register */}
            <input type='checkbox' {...register('published')} />
            <label>Published</label>
          </fieldset>

          <button type='submit' className='btn-green' disabled={!isDirty || !isValid}>
            Save Changes
          </button>
        </div>
      )}
    </form>
  )
}