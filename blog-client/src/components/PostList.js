import { Link } from "react-router-dom"

const PostList = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="no-posts">
        <p>Aucun article trouvé.</p>
      </div>
    )
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <article key={post._id} className="post-card">
          {post.image && <img src={post.image || "/placeholder.svg"} alt={post.title} className="post-image" />}

          <div className="post-content">
            <h2 className="post-title">
              <Link to={`/post/${post._id}`}>{post.title}</Link>
            </h2>

            <p className="post-excerpt">{post.content.substring(0, 150)}...</p>

            <div className="post-meta">
              <span className="post-author">Par {post.author.username}</span>
              <span className="post-date">{new Date(post.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>

            <Link to={`/post/${post._id}`} className="read-more">
              Lire la suite
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}

export default PostList
