"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const CommentSection = ({ postId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  
    const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }


  useEffect(() => {
    fetchComments()
  }, [postId])



  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, {
        content: newComment,
      })

      setComments([response.data.comment, ...comments])
      setNewComment("")
    } catch (error) {
      console.error("Error creating comment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return
    }

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`)
      setComments(comments.filter((comment) => comment._id !== commentId))
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  return (
    <div className="comment-section">
      <h3>Commentaires ({comments.length})</h3>

      {user && (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            rows="3"
            className="comment-input"
            required
          />
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Publication..." : "Publier"}
          </button>
        </form>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <div className="comment-header">
              <span className="comment-author">{comment.author.username}</span>
              <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString("fr-FR")}</span>
              {user && user.id === comment.author._id && (
                <button onClick={() => handleDeleteComment(comment._id)} className="delete-comment">
                  Supprimer
                </button>
              )}
            </div>
            <p className="comment-content">{comment.content}</p>
          </div>
        ))}
      </div>

      {comments.length === 0 && <p className="no-comments">Aucun commentaire pour le moment.</p>}
    </div>
  )
}

export default CommentSection
