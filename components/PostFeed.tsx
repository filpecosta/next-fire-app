import Link from 'next/link'
import React from 'react'

export default function PostFeed({ posts, admin }: any) {
  console.log("🚀 ~ file: PostFeed.tsx:5 ~ PostFeed ~ posts:", posts)


  return (
    posts ? (
      <>
        {posts.map((post: any) => {
          return (
            <PostItem key={post.slug} post={post} admin={admin} />
          )
        })}
      </>
    ) : null
  )


}


function PostItem({ post, admin = false }: any) {
  // Calculate word count and reading time
  const wordCount = post.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  return (
    <div className='card'>
      <Link href={`/${post.username}`}>
        <strong>By @{post.username}</strong>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          {post.title}
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span>
          ❤️ {post.heartCount || 0} Hearts
        </span>
      </footer>
    </div>
  )
}