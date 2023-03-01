import React from 'react'
import toast from 'react-hot-toast'

export default function AdminPostsPage() {

  return (
    <main>
      <button onClick={() => toast.success('hi!')}>
        Click me to toast!
      </button>
    </main>
  )
}
