import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import './Admin.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])

  const load = () => {
    api.get('/admin/users')
      .then(r => setUsers(Array.isArray(r.data) ? r.data : []))
      .catch(() => setUsers([]))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      await api.delete(`/admin/users/${id}`)
      load()
    }
  }

  return (
    <div className="admin-page container">
      <Link to="/admin" className="back-link">← Dashboard</Link>
      <div className="admin-table-section">
        <div className="admin-table-header">
          <h2>Users ({users.length})</h2>
        </div>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.phone || '—'}</td>
                <td>
                  <span className="status-badge" style={{ background: user.role === 'ADMIN' ? '#fff3e0' : '#e3f2fd', color: user.role === 'ADMIN' ? '#e65100' : '#1565c0' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontSize: '12px', color: '#666' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                </td>
                <td>
                  {user.role !== 'ADMIN' && (
                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
