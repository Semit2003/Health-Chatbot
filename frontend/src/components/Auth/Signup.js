import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/Auth/authService'
import './Auth.module.css'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [medicalId, setMedicalId] = useState('')
  const [role, setRole] = useState('patient') // Default role
  const [error, setError] = useState('')
  const [message, setMessage] = useState('') // Add this line
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('') // Clear previous errors
    setMessage('') // Clear previous messages
    if (!email && !phoneNumber) {
      setError('Either email or phone number is required.')
      return
    }
    try {
      await authService.signup({
        username,
        password,
        email,
        phoneNumber,
        medicalId,
        role,
      })
      setMessage('Signup successful! Redirecting to login page...')
      // Redirect to login page after 1.5 seconds
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error signing up')
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>Medical ID</label>
          <input
            type="text"
            value={medicalId}
            onChange={(e) => setMedicalId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <button type="submit" className="btn-primary">
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default Signup
