import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Cart.css'

export default function Cart() {
  const { cart, updateItem, removeItem, totalAmount, itemCount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState(user?.address || '')
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const handlePlaceOrder = async () => {
    if (!address.trim()) { setError('Please enter delivery address'); return }
    setPlacing(true)
    try {
      const res = await api.post('/orders/place', { deliveryAddress: address, paymentMethod })
      navigate(`/orders/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (!cart || itemCount === 0) {
    return (
      <div className="empty-cart container">
        <div className="empty-cart-content">
          <span>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add items from a restaurant to get started</p>
          <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page container">
      <h1 className="page-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.foodItem.imageUrl} alt={item.foodItem.name} />
              <div className="cart-item-info">
                <h4>{item.foodItem.name}</h4>
                <p>₹{item.foodItem.price}</p>
              </div>
              <div className="qty-controls">
                <button onClick={() => updateItem(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
              </div>
              <span className="item-subtotal">₹{(item.foodItem.price * item.quantity).toFixed(2)}</span>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{totalAmount.toFixed(2)}</span></div>
          <div className="summary-row"><span>Delivery Fee</span><span>₹30</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{(totalAmount + 30).toFixed(2)}</span></div>

          <div className="form-group">
            <label>Delivery Address</label>
            <textarea rows={3} className="cart-textarea"
              value={address} onChange={e => setAddress(e.target.value)}
              placeholder="Enter delivery address" />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select className="cart-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              <option value="ONLINE">Online Payment</option>
              <option value="CARD">Credit/Debit Card</option>
            </select>
          </div>

          {error && <p className="error-msg">{error}</p>}
          <button className="btn-primary place-order-btn" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing Order...' : `Place Order • ₹${(totalAmount + 30).toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
