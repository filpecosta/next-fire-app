import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { auth, storage } from 'lib/firebaseInit'
import React from 'react'
import Loader from './Loader'

export default function ImageUploader() {
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [downloadURL, setDownloadURL] = React.useState('')



  function uploadFile(e: any) {
    // Transform in array and get the first element, it is a file
    const file = Array.from(e.target.files)[0]
    // Get the extension of the file
    // @ts-ignore
    const extension = file.type.split('/')[1]

    // Create a reference to the file of bucket storage
    // like, /uploads/JAJKS914942JAFK902A466MA/1234567890.png
    const fileRef = ref(storage, `uploads/${auth?.currentUser?.uid}/${Date.now()}.${extension}`);
    setUploading(true)

    // Start the upload
    // @ts-ignore
    const task = uploadBytesResumable(fileRef, file)

    // Listen to the upload progress with on method
    task.on('state_changed', (snapshot) => {
      // Get the progress of the upload
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
      setProgress(Number(pct))
    })


    // Get the download url after the upload
    task.then((d) => {
      getDownloadURL(fileRef)
        .then((url) => {
          console.log("🚀 ~ file: ImageUploader.tsx:45 ~ task.then ~ fileRef:", fileRef)
          setDownloadURL(url)
          setUploading(false)
        })
    })

  }



  return (
    <div className='box'>
      <Loader show={uploading} />

      {uploading && (<h3>{progress}</h3>)}

      {!uploading && (
        <>
          <label className='btn'>
            📸 Upload Image
            <input type="file" onChange={(e) => uploadFile(e)} accept="image/x-png,image/gif,image/jpeg" />
          </label>
        </>
      )}

      {downloadURL && (
        <code className='upload-snippet'>
          {`![alt](${downloadURL})`}
        </code>
      )}

    </div>
  )
}
