import axios from 'axios'
import toast from 'react-hot-toast'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log requests in development
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { response, config } = error

    // Token expired or invalid
    if (response?.status === 401 && !config._retry) {
      config._retry = true
      
      try {
        // Try to refresh token
        const refreshResponse = await api.post('/auth/refresh')
        const { token } = refreshResponse.data
        
        // Update token
        localStorage.setItem('authToken', token)
        config.headers.Authorization = `Bearer ${token}`
        
        // Retry original request
        return api(config)
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('authToken')
        window.location.href = '/login'
        toast.error('Sessão expirada. Faça login novamente.')
        return Promise.reject(refreshError)
      }
    }

    // Rate limiting
    if (response?.status === 429) {
      const message = response.data?.message || 'Muitas tentativas. Tente novamente em alguns minutos.'
      toast.error(message, {
        duration: 5000,
        icon: '⚠️'
      })
      return Promise.reject(error)
    }

    // Server errors
    if (response?.status >= 500) {
      toast.error('Erro interno do servidor. Tente novamente.', {
        duration: 4000,
        icon: '🔥'
      })
      return Promise.reject(error)
    }

    // Client errors (400-499)
    if (response?.status >= 400 && response?.status < 500) {
      const message = response.data?.message || 'Erro na requisição'
      
      // Don't show toast for specific endpoints
      const silentEndpoints = ['/auth/refresh']
      const isSilentEndpoint = silentEndpoints.some(endpoint => 
        config.url?.includes(endpoint)
      )
      
      if (!isSilentEndpoint) {
        toast.error(message, {
          duration: 4000,
          icon: '❌'
        })
      }
    }

    // Network errors
    if (!response) {
      toast.error('Erro de conexão. Verifique sua internet.', {
        duration: 4000,
        icon: '🌐'
      })
    }

    return Promise.reject(error)
  }
)

// API helper functions
export const apiHelpers = {
  // Upload file with progress
  uploadWithProgress: (url, formData, onProgress) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress?.(progress)
      }
    })
  },

  // Download file
  downloadFile: async (url, filename) => {
    try {
      const response = await api.get(url, {
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
      
      return { success: true }
    } catch (error) {
      toast.error('Erro ao baixar arquivo')
      return { success: false, error }
    }
  },

  // Retry request with exponential backoff
  retryRequest: async (requestFn, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn()
      } catch (error) {
        if (attempt === maxRetries) {
          throw error
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
}

export default api