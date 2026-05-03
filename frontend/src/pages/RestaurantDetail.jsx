import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import FoodItemCard from '../components/FoodItemCard'
import './RestaurantDetail.css'

export default function RestaurantDetail() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [foodItems, setFoodItems] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/restaurants/${id}`),
      api.get(`/food-items/restaurant/${id}`)
    ]).then(([r, f]) => {
      setRestaurant(r.data)
      setFoodItems(f.data)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading">Loading...</div>
  if (!restaurant) return <div className="loading">Restaurant not found</div>

  const categories = ['All', ...new Set(foodItems.map(f => f.category))]
  const filtered = activeCategory === 'All' ? foodItems : foodItems.filter(f => f.category === activeCategory)

  return (
    <div className="restaurant-detail">
      <div className="restaurant-hero" style={{ backgroundImage: `url(${restaurant.imageUrl})` }}>
        <div className="restaurant-hero-overlay">
          <div className="container">
            <h1>{restaurant.name}</h1>
            <p>{restaurant.description}</p>
            <div className="restaurant-stats">
              <span>⭐ {restaurant.rating}</span>
              <span>🕐 {restaurant.deliveryTime} mins</span>
              <span>🚚 ₹{restaurant.deliveryFee} delivery</span>
              <span>📍 {restaurant.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-section container">
        <div className="category-tabs">
          {categories.map(cat => (
            <button key={cat} className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div className="food-grid">
          {filtered.map(item => <FoodItemCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  )
}
