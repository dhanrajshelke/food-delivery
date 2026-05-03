import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/axios'
import './Admin.css'

const EMPTY = { name: '', description: '', price: '', category: '', isVeg: false, isAvailable: true, imageUrl: '' }

export default function AdminFoodItems() {
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)

  const load = () => {
    api.get(`/admin/restaurants/${id}/food-items`).then(r => setItems(r.data))
    api.get(`/restaurants/${id}`).then(r => setRestaurant(r.data))
  }
  useEffect(() => { load() }, [id])

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) await api.put(`/admin/food-items/${editing}`, form)
    else await api.post(`/admin/restaurants/${id}/food-items`, form)
    setShowModal(false)
    setForm(EMPTY)
    setEditing(null)
    load()
  }

  const handleEdit = (item) => {
    setForm(item)
    setEditing(item.id)
    setShowModal(true)
  }

  const handleDelete = async (itemId) => {
    if (window.confirm('Delete this item?')) {
      await api.delete(`/admin/food-items/${itemId}`)
      load()
    }
  }

  return (
    <div className="admin-page container">
      <Link to="/admin/restaurants" className="back-link">← Restaurants</Link>
      <div className="admin-table-section">
        <div className="admin-table-header">
          <h2>{restaurant?.name} — Menu ({items.length})</h2>
          <button className="btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setShowModal(true) }}>+ Add Item</button>
        </div>
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Type</th><th>Available</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong></td>
                <td>{item.category}</td>
                <td>₹{item.price}</td>
                <td><span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>{item.isVeg ? 'Veg' : 'Non-Veg'}</span></td>
                <td><span className="status-badge" style={{ background: item.isAvailable ? '#e8f5e9' : '#fce4ec', color: item.isAvailable ? '#2e7d32' : '#c62828' }}>{item.isAvailable ? 'Yes' : 'No'}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
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
            <h3>{editing ? 'Edit Food Item' : 'Add Food Item'}</h3>
            <form className="modal-form" onSubmit={handleSubmit}>
              {[['name','Name'],['description','Description'],['category','Category'],['imageUrl','Image URL']].map(([f, l]) => (
                <div className="form-group" key={f}>
                  <label>{l}</label>
                  <input type="text" value={form[f] || ''} onChange={set(f)} required={f === 'name'} />
                </div>
              ))}
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" step="0.01" value={form.price} onChange={set('price')} required />
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input type="checkbox" checked={form.isVeg} onChange={set('isVeg')} /> Vegetarian
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input type="checkbox" checked={form.isAvailable} onChange={set('isAvailable')} /> Available
                </label>
              </div>
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
