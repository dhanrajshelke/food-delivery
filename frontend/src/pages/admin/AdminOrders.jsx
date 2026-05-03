import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import './Admin.css'

const STATUS_COLORS = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PREPARING: '#8b5cf6',
  OUT_FOR_DELIVERY: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444'
}

const STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('ALL')

  const load = () => api.get('/admin/orders')
    .then(r => setOrders(Array.isArray(r.data) ? r.data : []))
    .catch(() => setOrders([]))
  useEffect(() => { load() }, [])

  const updateStatus = async (orderId, status) => {
    await api.put(`/admin/orders/${orderId}/status?status=${status}`)
    load()
  }

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="admin-page container">
      <Link to="/admin" className="back-link">← Dashboard</Link>
      <div className="admin-table-section">
        <div className="admin-table-header">
          <h2>Orders ({filtered.length})</h2>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px' }}>
            <option value="ALL">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <table>
          <thead><tr><th>Order #</th><th>Customer</th><th>Restaurant</th><th>Amount</th><th>Status</th><th>Date</th><th>Update Status</th></tr></thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user?.name}</td>
                <td>{order.restaurant?.name}</td>
                <td>₹{order.totalAmount?.toFixed(2)}</td>
                <td>
                  <span className="status-badge" style={{ background: STATUS_COLORS[order.status] + '22', color: STATUS_COLORS[order.status] }}>
                    {order.status?.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(order.placedAt).toLocaleDateString('en-IN')}
                </td>
                <td>
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '12px' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
