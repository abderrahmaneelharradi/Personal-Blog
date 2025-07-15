"use client"

import { useState } from "react"
import axios from "axios"

const PostForm = ({ post, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    image: post?.image || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (post) {
        // Update existing post
        await axios.put(`http://localhost:5000/api/posts/${post._id}`, formData)
      } else {
        // Create new post
        await axios.post("http://localhost:5000/api/posts", formData)
      }

      onSuccess()
    } catch (error) {
      setError(error.response?.data?.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="post-form-container">
      <h2>{post ? "Modifier l'article" : "Nouvel article"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">URL de l'image (optionnel)</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Contenu</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Enregistrement..." : post ? "Modifier" : "Publier"}
          </button>

          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default PostForm
