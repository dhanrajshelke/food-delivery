import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import './OrderDetail.css'

// Lazy load map so Leaflet CSS doesn't affect other pages
const DeliveryMap = lazy(() => import('../components/DeliveryMap'))

const STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data)).finally(() => setLoading(false))

    // Listen for live status updates from admin
    const es = new EventSource(`http://localhost:8081/api/sse/orders/${id}`)
    es.addEventListener('status-update', e => {
      setOrder(prev => prev ? { ...prev, status: e.data } : prev)
    })
    return () => es.close()
  }, [id])

  if (loading) return <div className="loading">Loading order...</div>
  if (!order) return <div className="loading">Order not found</div>

  const currentStep = STEPS.indexOf(order.status)

  return (
    <div className="order-detail container">
      <Link to="/orders" className="back-link">← Back to Orders</Link>
      <h1 className="page-title">Order #{order.id}</h1>

      {order.status !== 'CANCELLED' && (
        <div className="order-tracker">
          {STEPS.map((step, i) => (
            <div key={step} className={`tracker-step ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}>
              <div className="step-dot">{i < currentStep ? '✓' : i + 1}</div>
              <span>{step.replace(/_/g, ' ')}</span>
              {i < STEPS.length - 1 && <div className={`step-line ${i < currentStep ? 'done' : ''}`} />}
            </div>
          ))}
        </div>
      )}

      <div className="order-detail-layout">
        {/* Delivery map — shown when order is out for delivery or delivered */}
        {(order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED') && (
          <div className="map-section">
            <h3>🚴 Delivery Route</h3>
            <Suspense fallback={<div className="map-loading">Loading map...</div>}>
              <DeliveryMap
                restaurantAddress={order.restaurant?.address}
                deliveryAddress={order.deliveryAddress}
                restaurantName={order.restaurant?.name}
              />
            </Suspense>
          </div>
        )}

        <div className="order-items-section">
          <h3>Items from {order.restaurant?.name}</h3>
          {order.orderItems?.map(oi => (
            <div key={oi.id} className="order-item-row">
              <img src={oi.foodItem?.imageUrl} alt={oi.foodItem?.name} />
              <div className="oi-info">
                <span>{oi.foodItem?.name}</span>
                <span className="oi-qty">x{oi.quantity}</span>
              </div>
              <span className="oi-price">₹{(oi.price * oi.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="order-info-section">
          <div className="info-card">
            <h4>Delivery Address</h4>
            <p>{order.deliveryAddress}</p>
          </div>
          <div className="info-card">
            <h4>Payment</h4>
            <p>{order.paymentMethod?.replace(/_/g, ' ')}</p>
          </div>
          <div className="info-card">
            <h4>Bill Summary</h4>
            <div className="bill-row"><span>Item Total</span><span>₹{order.totalAmount?.toFixed(2)}</span></div>
            <div className="bill-row"><span>Delivery Fee</span><span>₹30</span></div>
            <div className="bill-row total"><span>Grand Total</span><span>₹{(order.totalAmount + 30).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
