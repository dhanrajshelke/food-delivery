import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

// Simple helper to call API and update cart state, swallows errors silently
async function cartRequest(fn, setCart) {
  try {
    const res = await fn()
    setCart(res.data)
  } catch (e) {
    console.error('Cart error', e)
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) { setCart(null); return }
    api.get('/cart').then(r => setCart(r.data)).catch(() => {})
  }, [user])

  const addToCart = async (foodItemId, quantity = 1) => {
    setLoading(true)
    await cartRequest(() => api.post('/cart/add', { foodItemId, quantity }), setCart)
    setLoading(false)
  }

  const updateItem = (cartItemId, quantity) =>
    cartRequest(() => api.put(`/cart/item/${cartItemId}?quantity=${quantity}`), setCart)

  const removeItem = (cartItemId) =>
    cartRequest(() => api.delete(`/cart/item/${cartItemId}`), setCart)

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear')
      setCart(prev => prev ? { ...prev, cartItems: [] } : null)
    } catch (e) {}
  }

  const itemCount = cart?.cartItems?.reduce((sum, i) => sum + i.quantity, 0) || 0
  const totalAmount = cart?.cartItems?.reduce((sum, i) => sum + i.foodItem.price * i.quantity, 0) || 0

  return (
    <CartContext.Provider value={{ cart, addToCart, updateItem, removeItem, clearCart, itemCount, totalAmount, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
