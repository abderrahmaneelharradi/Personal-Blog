const Comment = require("../models/comment")
const Post = require("../models/post")

const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username")
      .sort({ createdAt: -1 })

    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const createComment = async (req, res) => {
  try {
    const { content } = req.body
    const { postId } = req.params

    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      post: postId,
    })

    await comment.save()
    await comment.populate("author", "username")

    res.status(201).json({
      message: "Comment created successfully",
      comment,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" })
    }

    await Comment.findByIdAndDelete(req.params.id)

    res.json({ message: "Comment deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getCommentsByPost,
  createComment,
  deleteComment,
}
