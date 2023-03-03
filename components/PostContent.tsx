import Link from 'next/link'
import React from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

// Component to render the content of the post
export default function PostContent({ post }: any) {

  // Get the createdAt date from the post
  // If the post.createdAt is a number, convert it to a date
  // If the post.createdAt is a firebase.firestore.Timestamp, convert it to a date with toDate() method
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate()


  return (
    <div className='card'>
      <h1>{post?.title}</h1>
      <span className='text-sm'>
        Written by
        <Link href={`/${post?.username}`} className='text-info'>
          @{post?.username}
        </Link>
        on {createdAt.toISOString()}
      </span>

      {/* Insert content and convert to HTML to the user */}
      <ReactMarkdown>
        {post?.content}
      </ReactMarkdown>
    </div>
  )
}
