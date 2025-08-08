import api from './api'

// Demo mode check
const IS_DEMO_MODE = !import.meta.env.VITE_API_URL && window.location.hostname !== 'localhost'

// Mock data for demo
const mockUser = {
  id: 1,
  name: 'Demo User',
  email: 'demo@codigobilionario.com',
  avatar: 'https://via.placeholder.com/150x150/FFD700/000?text=CB',
  subscription: {
    plan: 'premium',
    status: 'active',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }
}

export const authService = {
  // Login user
  async login(credentials) {
    if (IS_DEMO_MODE) {
      // Demo mode - simulate successful login
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      const token = 'demo-token-' + Date.now()
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(mockUser))
      return { user: mockUser, token }
    }
    
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register new user
  async register(userData) {
    if (IS_DEMO_MODE) {
      // Demo mode - simulate successful registration
      await new Promise(resolve => setTimeout(resolve, 1000))
      const token = 'demo-token-' + Date.now()
      const user = { ...mockUser, name: userData.name, email: userData.email }
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      return { user, token }
    }
    
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Logout user
  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Get current user profile
  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  },

  // Refresh authentication token
  async refreshToken() {
    const response = await api.post('/auth/refresh')
    return response.data
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password
  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { 
      token, 
      password 
    })
    return response.data
  },

  // Verify email
  async verifyEmail(token) {
    const response = await api.get(`/auth/verify-email?token=${token}`)
    return response.data
  },

  // Resend verification email
  async resendVerification(email) {
    const response = await api.post('/auth/resend-verification', { email })
    return response.data
  },

  // Change password (authenticated user)
  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  },

  // Get user sessions
  async getSessions() {
    const response = await api.get('/auth/sessions')
    return response.data
  },

  // Revoke specific session
  async revokeSession(sessionId) {
    const response = await api.delete(`/auth/sessions/${sessionId}`)
    return response.data
  },

  // Revoke all sessions except current
  async revokeAllSessions() {
    const response = await api.post('/auth/revoke-all-sessions')
    return response.data
  },

  // Check if user has required subscription
  async checkSubscriptionAccess(requiredPlan = 'basic') {
    const response = await api.get(`/auth/subscription-access?plan=${requiredPlan}`)
    return response.data
  }
}