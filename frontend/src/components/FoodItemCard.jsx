import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import './FoodItemCard.css'

const FALLBACK = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop'

export default function FoodItemCard({ item }) {
  const { user } = useAuth()
  const { addToCart, loading } = useCart()
  const navigate = useNavigate()

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return }
    await addToCart(item.id, 1)
  }

  return (
    <div className="food-card">
      <div className="food-img">
        <img src={item.imageUrl || FALLBACK} alt={item.name} onError={e => { e.target.src = FALLBACK }} />
      </div>
      <div className="food-info">
        <div className="food-header">
          <span>{item.isVeg ? '🟢' : '🔴'}</span>
          <span className="food-category">{item.category}</span>
        </div>
        <h4>{item.name}</h4>
        <p className="food-desc">{item.description}</p>
        <div className="food-footer">
          <span className="food-price">₹{item.price}</span>
          <button className="add-btn" onClick={handleAdd} disabled={loading || !item.isAvailable}>
            {item.isAvailable ? '+ Add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  )
}
