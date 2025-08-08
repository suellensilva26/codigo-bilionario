import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Currency Formatting
export const formatCurrency = (value, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(value)
}

// Number Formatting
export const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value)
}

// Compact Number Formatting
export const formatCompactNumber = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value)
}

// Date Formatting
export const formatDate = (date, pattern = 'dd/MM/yyyy') => {
  if (!date) return ''
  const dateObject = typeof date === 'string' ? parseISO(date) : date
  return format(dateObject, pattern, { locale: ptBR })
}

// Relative Time Formatting
export const formatRelativeTime = (date) => {
  if (!date) return ''
  const dateObject = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObject, {
    addSuffix: true,
    locale: ptBR
  })
}

// Duration Formatting (seconds to human readable)
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

// File Size Formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Text Truncation
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + suffix
}

// Percentage Formatting
export const formatPercentage = (value, decimals = 0) => {
  return `${(value * 100).toFixed(decimals)}%`
}

// Slug Generation
export const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Random ID Generation
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// URL Validation
export const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// Deep Clone Object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

// Debounce Function
export const debounce = (func, wait, immediate) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// Throttle Function
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Array Utilities
export const arrayUtils = {
  // Remove duplicates from array
  unique: (arr) => [...new Set(arr)],
  
  // Shuffle array
  shuffle: (arr) => {
    const newArr = [...arr]
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
    }
    return newArr
  },
  
  // Group array by key
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key]
      if (!groups[group]) groups[group] = []
      groups[group].push(item)
      return groups
    }, {})
  },
  
  // Sort array by multiple keys
  sortBy: (arr, ...keys) => {
    return arr.sort((a, b) => {
      for (const key of keys) {
        const aVal = a[key]
        const bVal = b[key]
        if (aVal < bVal) return -1
        if (aVal > bVal) return 1
      }
      return 0
    })
  }
}

// Color Utilities
export const colorUtils = {
  // Convert hex to RGB
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  },
  
  // Generate random color
  randomColor: () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  },
  
  // Check if color is dark
  isDark: (hex) => {
    const rgb = colorUtils.hexToRgb(hex)
    if (!rgb) return false
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness < 128
  }
}

// Local Storage Utilities
export const storage = {
  // Set item with expiration
  setItem: (key, value, expirationInMinutes = null) => {
    const item = {
      value: value,
      timestamp: Date.now(),
      expiration: expirationInMinutes ? Date.now() + (expirationInMinutes * 60 * 1000) : null
    }
    localStorage.setItem(key, JSON.stringify(item))
  },
  
  // Get item with expiration check
  getItem: (key) => {
    try {
      const itemStr = localStorage.getItem(key)
      if (!itemStr) return null
      
      const item = JSON.parse(itemStr)
      
      // Check if expired
      if (item.expiration && Date.now() > item.expiration) {
        localStorage.removeItem(key)
        return null
      }
      
      return item.value
    } catch (error) {
      console.error('Error getting item from localStorage:', error)
      return null
    }
  },
  
  // Remove item
  removeItem: (key) => {
    localStorage.removeItem(key)
  },
  
  // Clear all items
  clear: () => {
    localStorage.clear()
  }
}

// Device Detection
export const device = {
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },
  
  isTablet: () => {
    return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768
  },
  
  isDesktop: () => {
    return !device.isMobile() && !device.isTablet()
  },
  
  getScreenSize: () => {
    const width = window.innerWidth
    if (width < 640) return 'sm'
    if (width < 768) return 'md'
    if (width < 1024) return 'lg'
    if (width < 1280) return 'xl'
    return '2xl'
  }
}

// Progress Calculation
export const calculateProgress = (current, total) => {
  if (!total || total === 0) return 0
  return Math.min(Math.round((current / total) * 100), 100)
}

// Plan Access Checker
export const canAccessPlan = (userPlan, requiredPlan) => {
  const planHierarchy = { basic: 1, premium: 2, elite: 3 }
  const userLevel = planHierarchy[userPlan] || 0
  const requiredLevel = planHierarchy[requiredPlan] || 0
  return userLevel >= requiredLevel
}

// Video Time Formatter
export const formatVideoTime = (seconds) => {
  if (!seconds || seconds < 0) return '00:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Course Progress Calculator
export const calculateCourseProgress = (completedLessons, totalLessons) => {
  if (!totalLessons || totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}

// Search Highlighter
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark class="bg-cb-gold text-cb-black">$1</mark>')
}

// Copy to Clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return { success: true }
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return { success: true }
    } catch (fallbackError) {
      document.body.removeChild(textArea)
      return { success: false, error: fallbackError }
    }
  }
}

// Social Sharing
export const shareContent = {
  whatsapp: (text, url) => {
    const message = encodeURIComponent(`${text} ${url}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  },
  
  telegram: (text, url) => {
    const message = encodeURIComponent(`${text} ${url}`)
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
  },
  
  twitter: (text, url) => {
    const message = encodeURIComponent(text)
    window.open(`https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(url)}`, '_blank')
  },
  
  facebook: (url) => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  },
  
  native: async (title, text, url) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    }
    return { success: false, error: 'Native sharing not supported' }
  }
}

// Analytics Helper
export const trackEvent = (eventName, properties = {}) => {
  // Implementation would depend on analytics service (GA, Mixpanel, etc.)
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, properties)
  }
  
  // Console log for development
  if (import.meta.env.VITE_NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, properties)
  }
}