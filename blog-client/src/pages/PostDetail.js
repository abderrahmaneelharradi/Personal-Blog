"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import CommentSection from "../components/CommentSection"

const PostDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`)
      setPost(response.data)
    } catch (error) {
      setError("Article non trouvé")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Chargement de l'article...</div>
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>{error}</h2>
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  return (
    <div className="post-detail">
      <article className="post-article">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span>Par {post.author.username}</span>
            <span>{new Date(post.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </header>

        {post.image && <img src={post.image || "/placeholder.svg"} alt={post.title} className="post-featured-image" />}

        <div className="post-content">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <CommentSection postId={id} />

      <div className="post-navigation">
        <Link to="/" className="btn btn-secondary">
          ← Retour aux articles
        </Link>
      </div>
    </div>
  )
}

export default PostDetail
