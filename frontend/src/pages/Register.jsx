import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      setError('Phone number must be exactly 10 digits')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create account 🚀</h2>
          <p>Join FoodRush today</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {[
            { label: 'Full Name', field: 'name', type: 'text', placeholder: 'John Doe', required: true },
            { label: 'Email', field: 'email', type: 'email', placeholder: 'you@example.com', required: true },
            { label: 'Password', field: 'password', type: 'password', placeholder: 'Min 6 characters', required: true },
            { label: 'Phone', field: 'phone', type: 'tel', placeholder: '10-digit mobile number' },
            { label: 'Delivery Address', field: 'address', type: 'text', placeholder: 'Your address' },
          ].map(({ label, field, type, placeholder, required }) => (
            <div key={field} className="form-group">
              <label>{label}</label>
              <input type={type} placeholder={placeholder} required={required}
                value={form[field]} onChange={set(field)} />
            </div>
          ))}
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  )
}
