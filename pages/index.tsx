import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import React from 'react'
import axios from 'axios'
import Link from 'next/link'

type Post = {
  title: string
  slug: string
  excerpt: string
  html: string
}

const getPosts = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ghost/api/v3/content/posts/?key=${process.env.NEXT_PUBLIC_CONTENT_API_KEY}&fields=title,slug,custom_excerpt`)
  const { posts } = res.data
  return posts
}

const Home:React.FC<{ posts: Post[] }> = props => {
  const { posts } = props
  return (
    <div className={styles.container}>
      <h1>Hello Blog!</h1>
      <ul>
        {posts.map(post => (
          <li className={styles.postItem} key={post.slug}>
            <Link href='/post/[slug]' as={`/post/${post.slug}`}>
              <a>{post.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const getStaticProps = async () => {
  const posts = await getPosts()
  return { 
    props: { posts },
    revalidate: 10 
   }
}

export default Home
