"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import PostList from "../components/PostList"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async (search = "") => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/api/posts${search ? `?search=${search}` : ""}`)
      setPosts(response.data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPosts(searchTerm)
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to My Blog</h1>
        <p>Discover the latest articles and share your thoughts</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for an article..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      <div className="posts-section">
        {loading ? <div className="loading">Loading articles...</div> : <PostList posts={posts} />}
      </div>
    </div>
  )
}

export default Home
