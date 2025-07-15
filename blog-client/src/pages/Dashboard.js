"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import PostForm from "../components/PostForm"
import { useAuth } from "../context/AuthContext"

const Dashboard = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserPosts()
  }, [])

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/posts")
      setPosts(response.data)
    } catch (error) {
      console.error("Error fetching user posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return
    }

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`)
      setPosts(posts.filter((post) => post._id !== postId))
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingPost(null)
    fetchUserPosts()
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setShowForm(true)
  }

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard - {user.username}</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          Nouvel article
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <PostForm
              post={editingPost}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false)
                setEditingPost(null)
              }}
            />
          </div>
        </div>
      )}

      <div className="user-posts">
        <h2>Mes articles ({posts.length})</h2>

        {posts.length === 0 ? (
          <p>Vous n'avez pas encore publié d'articles.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card dashboard-post">
                {post.image && <img src={post.image || "/placeholder.svg"} alt={post.title} className="post-image" />}

                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p>{post.content.substring(0, 100)}...</p>

                  <div className="post-meta">
                    <span>{new Date(post.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>

                  <div className="post-actions">
                    <button onClick={() => handleEditPost(post)} className="btn btn-secondary btn-sm">
                      Modifier
                    </button>
                    <button onClick={() => handleDeletePost(post._id)} className="btn btn-danger btn-sm">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
