// 🎭 DEMO AUTHENTICATION - CÓDIGO BILIONÁRIO
// Sistema de autenticação demo para funcionar sem backend

import toast from 'react-hot-toast'

// Mock user database
const DEMO_USERS = [
  {
    id: 'demo-1',
    uid: 'demo-uid-1',
    name: 'Demo User',
    email: 'demo@codigobilionario.com',
    password: 'demo123',
    subscription: {
      plan: 'premium',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    createdAt: new Date().toISOString()
  }
]

// 🎯 DEMO AUTH SERVICE
export const demoAuth = {
  // Register new user (demo)
  async register(userData) {
    try {
      console.log('🎭 DEMO AUTH: Iniciando registro com dados:', userData)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Validate input
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Todos os campos são obrigatórios')
      }
      
      if (userData.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres')
      }
      
      // Check if email already exists
      const existingUser = DEMO_USERS.find(user => user.email === userData.email)
      if (existingUser) {
        throw new Error('Este email já está em uso')
      }
      
      // Create new user
      const newUser = {
        id: `demo-${Date.now()}`,
        uid: `demo-uid-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        subscription: {
          plan: 'basic',
          status: 'active',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        createdAt: new Date().toISOString(),
        emailVerified: true // Demo mode - always verified
      }
      
      // Add to demo database
      DEMO_USERS.push(newUser)
      
      // Store in localStorage for persistence
      localStorage.setItem('demo_users', JSON.stringify(DEMO_USERS))
      
      // Create session
      const token = `demo-token-${Date.now()}`
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      
      toast.success('🎉 Conta criada com sucesso!')
      
      return {
        success: true,
        user: {
          uid: newUser.uid,
          name: newUser.name,
          email: newUser.email,
          emailVerified: newUser.emailVerified,
          subscription: newUser.subscription
        },
        token
      }
      
    } catch (error) {
      console.error('Demo Register Error:', error)
      toast.error(error.message || 'Erro ao criar conta')
      
      return {
        success: false,
        error: error.message || 'Erro ao criar conta'
      }
    }
  },

  // Login user (demo)
  async login(credentials) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Validate input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email e senha são obrigatórios')
      }
      
      // Load users from localStorage if available
      const storedUsers = localStorage.getItem('demo_users')
      if (storedUsers) {
        const users = JSON.parse(storedUsers)
        DEMO_USERS.push(...users.filter(u => !DEMO_USERS.find(existing => existing.email === u.email)))
      }
      
      // Find user
      const user = DEMO_USERS.find(u => 
        u.email === credentials.email && u.password === credentials.password
      )
      
      if (!user) {
        throw new Error('Email ou senha incorretos')
      }
      
      // Create session
      const token = `demo-token-${Date.now()}`
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      toast.success(`Bem-vindo, ${user.name}!`)
      
      return {
        success: true,
        user: {
          uid: user.uid,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          subscription: user.subscription
        },
        token
      }
      
    } catch (error) {
      console.error('Demo Login Error:', error)
      toast.error(error.message || 'Erro ao fazer login')
      
      return {
        success: false,
        error: error.message || 'Erro ao fazer login'
      }
    }
  },

  // Logout user (demo)
  async logout() {
    try {
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      
      toast.success('Logout realizado com sucesso')
      
      return { success: true }
      
    } catch (error) {
      console.error('Demo Logout Error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get current user (demo)
  getCurrentUser() {
    try {
      const token = localStorage.getItem('authToken')
      const user = localStorage.getItem('currentUser')
      
      if (!token || !user) {
        return null
      }
      
      return JSON.parse(user)
      
    } catch (error) {
      console.error('Get Current User Error:', error)
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('currentUser')
    
    return !!(token && user)
  },

  // Reset password (demo)
  async resetPassword(email) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (!email) {
        throw new Error('Email é obrigatório')
      }
      
      // Check if user exists
      const user = DEMO_USERS.find(u => u.email === email)
      
      if (!user) {
        throw new Error('Email não encontrado')
      }
      
      toast.success('Email de recuperação enviado!')
      
      return {
        success: true,
        message: 'Email de recuperação enviado com sucesso'
      }
      
    } catch (error) {
      console.error('Demo Reset Password Error:', error)
      toast.error(error.message || 'Erro ao enviar email de recuperação')
      
      return {
        success: false,
        error: error.message || 'Erro ao enviar email de recuperação'
      }
    }
  }
}

export default demoAuth