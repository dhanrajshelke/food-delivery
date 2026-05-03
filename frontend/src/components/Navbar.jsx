import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">🍔 FoodRush</Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/restaurants">Restaurants</Link>
          {user && <Link to="/orders">My Orders</Link>}
          {isAdmin && <Link to="/admin" className="admin-link">Admin</Link>}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn">
                🛒 Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <span className="user-name">Hi, {user.name?.split(' ')[0]}</span>
              <button className="btn-primary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>
    </nav>
  )
}
