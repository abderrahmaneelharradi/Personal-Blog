const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authMiddleware = require("./middlewares/authMiddleware")
const { register, login, getProfile } = require("./controllers/authController")
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
} = require("./controllers/postController")
const { getCommentsByPost, createComment, deleteComment } = require("./controllers/commentController")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mern-blog")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Auth routes
app.post("/api/auth/register", register)
app.post("/api/auth/login", login)
app.get("/api/auth/profile", authMiddleware, getProfile)

// Post routes
app.get("/api/posts", getAllPosts)
app.get("/api/posts/:id", getPostById)
app.post("/api/posts", authMiddleware, createPost)
app.put("/api/posts/:id", authMiddleware, updatePost)
app.delete("/api/posts/:id", authMiddleware, deletePost)
app.get("/api/user/posts", authMiddleware, getUserPosts)

// Comment routes
app.get("/api/posts/:postId/comments", getCommentsByPost)
app.post("/api/posts/:postId/comments", authMiddleware, createComment)
app.delete("/api/comments/:id", authMiddleware, deleteComment)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
