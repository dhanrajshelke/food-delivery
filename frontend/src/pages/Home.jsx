import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import RestaurantCard from '../components/RestaurantCard'
import './Home.css'

const CUISINES = ['North Indian', 'South Indian', 'Biryani', 'Street Food', 'Rajasthani', 'Bengali']

const FEATURES = [
  { icon: '🚀', title: 'Fast Delivery', desc: 'Get your food in 30 minutes or less' },
  { icon: '🍽️', title: 'Wide Selection', desc: 'Hundreds of restaurants and cuisines' },
  { icon: '💳', title: 'Easy Payment', desc: 'Multiple payment options available' },
]

export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/restaurants')
      .then(r => setRestaurants(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/restaurants?q=${search}`)
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <h1>Hungry? We've got you covered 🍕</h1>
          <p>Order from the best restaurants near you</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input type="text" placeholder="Search restaurants or cuisines..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>
      </section>

      <section className="cuisines-section container">
        <h2>Browse by Cuisine</h2>
        <div className="cuisine-chips">
          {CUISINES.map(c => (
            <Link key={c} to={`/restaurants?q=${c}`} className="cuisine-chip">{c}</Link>
          ))}
        </div>
      </section>

      <section className="restaurants-section container">
        <h2>Popular Restaurants</h2>
        <div className="restaurants-grid">
          {restaurants.slice(0, 6).map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
        <div className="view-all">
          <Link to="/restaurants" className="btn-secondary">View All Restaurants</Link>
        </div>
      </section>

      <section className="features">
        <div className="features-grid container">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <span>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
