import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import './Admin.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ restaurants: 0, orders: 0, users: 0, revenue: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/admin/restaurants'),
      api.get('/admin/orders'),
      api.get('/admin/users')
    ]).then(([r, o, u]) => {
      const rData = Array.isArray(r.data) ? r.data : []
      const oData = Array.isArray(o.data) ? o.data : []
      const uData = Array.isArray(u.data) ? u.data : []
      const revenue = oData.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0)
      setStats({ restaurants: rData.length, orders: oData.length, users: uData.length, revenue })
    }).catch(() => {})
  }, [])

  return (
    <div className="admin-page container">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Manage your food delivery platform</p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">🏪</span>
          <div><h3>{stats.restaurants}</h3><p>Restaurants</p></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div><h3>{stats.orders}</h3><p>Total Orders</p></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div><h3>{stats.users}</h3><p>Users</p></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <div><h3>₹{stats.revenue.toFixed(0)}</h3><p>Revenue</p></div>
        </div>
      </div>

      <div className="admin-nav-cards">
        <Link to="/admin/restaurants" className="admin-nav-card">
          <span>🏪</span>
          <h3>Manage Restaurants</h3>
          <p>Add, edit, or remove restaurants</p>
        </Link>
        <Link to="/admin/orders" className="admin-nav-card">
          <span>📦</span>
          <h3>Manage Orders</h3>
          <p>View and update order statuses</p>
        </Link>
        <Link to="/admin/users" className="admin-nav-card">
          <span>👥</span>
          <h3>Manage Users</h3>
          <p>View and manage user accounts</p>
        </Link>
      </div>
    </div>
  )
}
