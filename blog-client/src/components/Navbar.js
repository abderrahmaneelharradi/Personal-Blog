"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Mon Blog
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Accueil
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <span className="nav-user">Bonjour, {user.username}</span>
              <button onClick={handleLogout} className="nav-button">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Connexion
              </Link>
              <Link to="/register" className="nav-button">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
