import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import './Admin.css'

const EMPTY = { name: '', description: '', address: '', city: '', phone: '', cuisineType: '', rating: 4.0, deliveryTime: 30, deliveryFee: 30, isOpen: true, imageUrl: '' }

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    api.get('/admin/restaurants')
      .then(r => setRestaurants(Array.isArray(r.data) ? r.data : []))
      .catch(err => setError(err.response?.data?.error || 'Failed to load restaurants'))
  }
  useEffect(() => { load() }, [])

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) await api.put(`/admin/restaurants/${editing}`, form)
    else await api.post('/admin/restaurants', form)
    setShowModal(false)
    setForm(EMPTY)
    setEditing(null)
    load()
  }

  const handleEdit = (r) => {
    setForm(r)
    setEditing(r.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this restaurant?')) {
      await api.delete(`/admin/restaurants/${id}`)
      load()
    }
  }

  return (
    <div className="admin-page container">
      <Link to="/admin" className="back-link">← Dashboard</Link>
      {error && <p className="error-msg" style={{marginBottom:'16px'}}>{error}</p>}
      <div className="admin-table-section">
        <div className="admin-table-header">
          <h2>Restaurants ({restaurants.length})</h2>
          <button className="btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setShowModal(true) }}>+ Add Restaurant</button>
        </div>
        <table>
          <thead><tr><th>Name</th><th>Cuisine</th><th>City</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {restaurants.map(r => (
              <tr key={r.id}>
                <td><strong>{r.name}</strong></td>
                <td>{r.cuisineType}</td>
                <td>{r.city}</td>
                <td>⭐ {r.rating}</td>
                <td><span className="status-badge" style={{ background: r.isOpen ? '#e8f5e9' : '#fce4ec', color: r.isOpen ? '#2e7d32' : '#c62828' }}>{r.isOpen ? 'Open' : 'Closed'}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(r)}>Edit</button>
                    <Link to={`/admin/restaurants/${r.id}/food-items`} className="btn-view">Menu</Link>
                    <button className="btn-delete" onClick={() => handleDelete(r.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editing ? 'Edit Restaurant' : 'Add Restaurant'}</h3>
            <form className="modal-form" onSubmit={handleSubmit}>
              {[['name','Name'],['description','Description'],['address','Address'],['city','City'],['phone','Phone'],['cuisineType','Cuisine Type'],['imageUrl','Image URL']].map(([f, l]) => (
                <div className="form-group" key={f}>
                  <label>{l}</label>
                  <input type="text" value={form[f] || ''} onChange={set(f)} required={['name','address'].includes(f)} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group"><label>Rating</label><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={set('rating')} /></div>
                <div className="form-group"><label>Delivery Time (min)</label><input type="number" value={form.deliveryTime} onChange={set('deliveryTime')} /></div>
                <div className="form-group"><label>Delivery Fee (₹)</label><input type="number" value={form.deliveryFee} onChange={set('deliveryFee')} /></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" checked={form.isOpen} onChange={set('isOpen')} /> Is Open
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
