import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import RestaurantCard from '../components/RestaurantCard'
import './RestaurantList.css'

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchParams] = useSearchParams()

  const fetchRestaurants = (query) => {
    setLoading(true)
    const url = query ? `/restaurants/search?q=${query}` : '/restaurants'
    api.get(url)
      .then(r => setRestaurants(Array.isArray(r.data) ? r.data : []))
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setSearch(q)
    fetchRestaurants(q)
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRestaurants(search.trim())
  }

  return (
    <div className="restaurant-list-page container">
      <h1 className="page-title">Restaurants</h1>
      <form className="list-search" onSubmit={handleSearch}>
        <input type="text" placeholder="Search by name or cuisine..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading ? (
        <div className="loading">Loading restaurants...</div>
      ) : restaurants.length === 0 ? (
        <div className="loading">No restaurants found</div>
      ) : (
        <div className="restaurants-grid">
          {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </div>
  )
}
