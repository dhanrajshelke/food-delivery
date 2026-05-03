import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons broken by webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Red icon for restaurant (pickup)
const restaurantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

// Blue icon for delivery address
const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

// Geocode an address string using OpenStreetMap Nominatim (free, no key)
async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  const data = await res.json()
  if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
  return null
}

export default function DeliveryMap({ restaurantAddress, deliveryAddress, restaurantName }) {
  const [restaurantCoords, setRestaurantCoords] = useState(null)
  const [deliveryCoords, setDeliveryCoords] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!restaurantAddress && !deliveryAddress) return
    Promise.all([
      restaurantAddress ? geocode(restaurantAddress) : Promise.resolve(null),
      deliveryAddress   ? geocode(deliveryAddress)   : Promise.resolve(null),
    ]).then(([rc, dc]) => {
      setRestaurantCoords(rc)
      setDeliveryCoords(dc)
      setLoading(false)
    })
  }, [restaurantAddress, deliveryAddress])

  // Center map between both points, fallback to Pune
  const center = restaurantCoords || deliveryCoords || [18.5204, 73.8567]

  const mapsUrl = deliveryAddress
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(deliveryAddress)}`
    : '#'

  if (loading) return <div className="map-loading">📍 Loading map...</div>

  return (
    <div className="delivery-map-wrapper">
      <div className="map-legend">
        <span className="legend-item"><span className="dot red" /> Restaurant (Pickup)</span>
        <span className="legend-item"><span className="dot blue" /> Delivery Address</span>
      </div>

      <MapContainer center={center} zoom={13} style={{ height: '320px', width: '100%', borderRadius: '12px' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />

        {restaurantCoords && (
          <Marker position={restaurantCoords} icon={restaurantIcon}>
            <Popup>🍽️ <strong>{restaurantName || 'Restaurant'}</strong><br />{restaurantAddress}</Popup>
          </Marker>
        )}

        {deliveryCoords && (
          <Marker position={deliveryCoords} icon={deliveryIcon}>
            <Popup>🏠 <strong>Delivery Here</strong><br />{deliveryAddress}</Popup>
          </Marker>
        )}

        {restaurantCoords && deliveryCoords && (
          <Polyline positions={[restaurantCoords, deliveryCoords]} color="#f97316" weight={3} dashArray="8 6" />
        )}
      </MapContainer>

      <a href={mapsUrl} target="_blank" rel="noreferrer" className="open-maps-btn">
        🗺️ Open in Google Maps for Navigation
      </a>
    </div>
  )
}
