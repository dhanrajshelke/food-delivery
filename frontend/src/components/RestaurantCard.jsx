import { Link } from 'react-router-dom'
import './RestaurantCard.css'

const FALLBACK_IMAGES = {
  'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop',
  'South Indian': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop',
  'Street Food': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop',
  'Hyderabadi': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
  'Rajasthani': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop',
  'Bengali': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop',
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop'

export default function RestaurantCard({ restaurant }) {
  const imgSrc = restaurant.imageUrl || FALLBACK_IMAGES[restaurant.cuisineType] || DEFAULT_IMG

  const handleImgError = (e) => {
    e.target.src = FALLBACK_IMAGES[restaurant.cuisineType] || DEFAULT_IMG
  }

  return (
    <Link to={`/restaurants/${restaurant.id}`} className="restaurant-card">
      <div className="restaurant-img">
        <img
          src={imgSrc}
          alt={restaurant.name}
          onError={handleImgError}
        />
        <div className="cuisine-tag">{restaurant.cuisineType}</div>
        {!restaurant.isOpen && <div className="closed-overlay">Closed</div>}
      </div>
      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p className="description">{restaurant.description}</p>
        <div className="restaurant-meta">
          <span className="rating">⭐ {restaurant.rating}</span>
          <span className="dot">•</span>
          <span>🕐 {restaurant.deliveryTime} mins</span>
          <span className="dot">•</span>
          <span>🚚 ₹{restaurant.deliveryFee}</span>
        </div>
        <p className="address">📍 {restaurant.city}</p>
      </div>
    </Link>
  )
}
