import Link from 'next/link'
import axios from 'axios'
import styles from '../../styles/Home.module.scss'
import React, { useState } from 'react'

type Post = {
    slug: string
    title: string
    html: string
}

const getPost = async (slug: string) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${process.env.NEXT_PUBLIC_CONTENT_API_KEY}&fields=title,slug,html`)
    const { posts } = res.data
    return posts[0]
}

const Post: React.FC<{ post: Post }> = props => {
    const { post } = props
    const [enableLoadComments, setEnableLoadComments] = useState<boolean>(true)

    const loadComments = () => {
        setEnableLoadComments(false)
        ;(window as any).disqus_config = function () {
            this.page.url = window.location.href 
            this.page.identifier = post.slug
        };
        const script = document.createElement('script')
        script.src = 'https://nextjs-ghostcms-blog-1.disqus.com/embed.js'
        script.setAttribute('data-timestamp', Date.now().toString())
        document.body.appendChild(script)
    }

    return (
        <div className={styles.container}>
            <p className={styles.goBack}>
                <Link href='/'>
                    <a>Go Back</a>
                </Link>
            </p>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
            {enableLoadComments && (<p className={styles.goBack} onClick={loadComments}>Load Comments</p>)}
            <div id="disqus_thread"></div>
        </div>
    )
}

export const getStaticProps = async ({ params }) => {
    const post = await getPost(params.slug)
    return { 
        props: { post }, 
        revalidate: 10 
    }
}

export const getStaticPaths = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ghost/api/v3/content/posts/?key=${process.env.NEXT_PUBLIC_CONTENT_API_KEY}&fields=title,slug,custom_excerpt`)
    const { posts } = res.data
    const slugs = posts.map(post => post.slug)
    const paths = slugs.map(slug => ({ params: { slug } }))
    return {
        paths,
        fallback: true
    }
}

export default Post