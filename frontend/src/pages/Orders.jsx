import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import './Orders.css'

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  PREPARING: '#8b5cf6',
  OUT_FOR_DELIVERY: '#06b6d4',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444'
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading orders...</div>

  return (
    <div className="orders-page container">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <span>📦</span>
          <h3>No orders yet</h3>
          <Link to="/restaurants" className="btn-primary">Order Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <Link to={`/orders/${order.id}`} key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>{order.restaurant?.name}</h3>
                  <p className="order-date">
                    {new Date(order.placedAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className="order-status" style={{ color: STATUS_COLORS[order.status] }}>
                  {order.status?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="order-items-preview">
                {order.orderItems?.slice(0, 3).map(oi => (
                  <span key={oi.id}>{oi.foodItem?.name} x{oi.quantity}</span>
                ))}
                {order.orderItems?.length > 3 && <span>+{order.orderItems.length - 3} more</span>}
              </div>
              <div className="order-footer">
                <span>Order #{order.id}</span>
                <span className="order-total">₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
