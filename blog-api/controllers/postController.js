const Post = require("../models/post")
const Comment = require("../models/comment")

const getAllPosts = async (req, res) => {
  try {
    const { search } = req.query
    let query = {}

    if (search) {
      query = {
        $or: [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }],
      }
    }

    const posts = await Post.find(query).populate("author", "username").sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username")

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json(post)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const createPost = async (req, res) => {
  try {
    const { title, content, image } = req.body

    const post = new Post({
      title,
      content,
      image,
      author: req.user._id,
    })

    await post.save()
    await post.populate("author", "username")

    res.status(201).json({
      message: "Post created successfully",
      post,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const updatePost = async (req, res) => {
  try {
    const { title, content, image } = req.body

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this post" })
    }

    post.title = title || post.title
    post.content = content || post.content
    post.image = image || post.image

    await post.save()
    await post.populate("author", "username")

    res.json({
      message: "Post updated successfully",
      post,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" })
    }

    // Delete associated comments
    await Comment.deleteMany({ post: req.params.id })

    // Delete the post
    await Post.findByIdAndDelete(req.params.id)

    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).populate("author", "username").sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
}
