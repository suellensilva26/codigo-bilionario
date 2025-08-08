// 🛡️ SECURITY SERVICE - CÓDIGO BILIONÁRIO
import { analyticsService } from './firebase'
import toast from 'react-hot-toast'

// 🔒 SECURITY CONFIGURATION
const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_CONCURRENT_SESSIONS: 3,
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  SUSPICIOUS_ACTIVITY_THRESHOLD: 10
}

// 🛡️ SECURITY SERVICE
export const securityService = {
  // Track login attempts
  trackLoginAttempt(email, success, ip = null) {
    try {
      const key = `login_attempts_${email}`
      const attempts = JSON.parse(localStorage.getItem(key) || '[]')
      
      const attempt = {
        timestamp: Date.now(),
        success,
        ip,
        userAgent: navigator.userAgent
      }
      
      attempts.push(attempt)
      
      // Keep only recent attempts (last hour)
      const recentAttempts = attempts.filter(
        a => Date.now() - a.timestamp < 60 * 60 * 1000
      )
      
      localStorage.setItem(key, JSON.stringify(recentAttempts))
      
      // Check for suspicious activity
      const failedAttempts = recentAttempts.filter(a => !a.success)
      
      if (failedAttempts.length >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        this.lockAccount(email)
        
        // Track security event
        analyticsService.trackEvent('security_lockout', {
          email,
          failed_attempts: failedAttempts.length,
          ip
        })
        
        toast.error(`Muitas tentativas de login falharam. Conta bloqueada por ${SECURITY_CONFIG.LOCKOUT_DURATION / 60000} minutos.`)
        return false
      }
      
      return true
    } catch (error) {
      console.error('❌ Track Login Attempt Error:', error)
      return true // Don't block on error
    }
  },

  // Check if account is locked
  isAccountLocked(email) {
    try {
      const key = `account_locked_${email}`
      const lockData = JSON.parse(localStorage.getItem(key) || 'null')
      
      if (!lockData) return false
      
      // Check if lockout period has expired
      if (Date.now() - lockData.timestamp > SECURITY_CONFIG.LOCKOUT_DURATION) {
        localStorage.removeItem(key)
        return false
      }
      
      return true
    } catch (error) {
      console.error('❌ Check Account Lock Error:', error)
      return false
    }
  },

  // Lock account
  lockAccount(email) {
    try {
      const key = `account_locked_${email}`
      const lockData = {
        timestamp: Date.now(),
        reason: 'too_many_failed_attempts'
      }
      
      localStorage.setItem(key, JSON.stringify(lockData))
    } catch (error) {
      console.error('❌ Lock Account Error:', error)
    }
  },

  // Unlock account
  unlockAccount(email) {
    try {
      const key = `account_locked_${email}`
      localStorage.removeItem(key)
      
      // Clear login attempts
      localStorage.removeItem(`login_attempts_${email}`)
      
      toast.success('Conta desbloqueada com sucesso')
    } catch (error) {
      console.error('❌ Unlock Account Error:', error)
    }
  },

  // Rate limiting
  checkRateLimit(identifier = 'global') {
    try {
      const key = `rate_limit_${identifier}`
      const requests = JSON.parse(localStorage.getItem(key) || '[]')
      
      // Clean old requests
      const now = Date.now()
      const recentRequests = requests.filter(
        timestamp => now - timestamp < SECURITY_CONFIG.RATE_LIMIT_WINDOW
      )
      
      if (recentRequests.length >= SECURITY_CONFIG.RATE_LIMIT_REQUESTS) {
        toast.error('Muitas solicitações. Tente novamente em alguns minutos.')
        return false
      }
      
      // Add current request
      recentRequests.push(now)
      localStorage.setItem(key, JSON.stringify(recentRequests))
      
      return true
    } catch (error) {
      console.error('❌ Rate Limit Check Error:', error)
      return true // Don't block on error
    }
  },

  // Detect suspicious activity
  detectSuspiciousActivity(userId, activity) {
    try {
      const key = `suspicious_activity_${userId}`
      const activities = JSON.parse(localStorage.getItem(key) || '[]')
      
      const suspiciousActivity = {
        type: activity.type,
        timestamp: Date.now(),
        details: activity.details,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
      
      activities.push(suspiciousActivity)
      
      // Keep only recent activities (last 24 hours)
      const recentActivities = activities.filter(
        a => Date.now() - a.timestamp < 24 * 60 * 60 * 1000
      )
      
      localStorage.setItem(key, JSON.stringify(recentActivities))
      
      // Check threshold
      if (recentActivities.length >= SECURITY_CONFIG.SUSPICIOUS_ACTIVITY_THRESHOLD) {
        this.flagSuspiciousUser(userId)
        
        // Track security event
        analyticsService.trackEvent('suspicious_activity_detected', {
          user_id: userId,
          activity_count: recentActivities.length,
          activity_types: [...new Set(recentActivities.map(a => a.type))]
        })
      }
    } catch (error) {
      console.error('❌ Detect Suspicious Activity Error:', error)
    }
  },

  // Flag suspicious user
  flagSuspiciousUser(userId) {
    try {
      const key = `flagged_user_${userId}`
      const flagData = {
        timestamp: Date.now(),
        reason: 'suspicious_activity',
        auto_flagged: true
      }
      
      localStorage.setItem(key, JSON.stringify(flagData))
      
      // Notify user
      toast.error('Atividade suspeita detectada. Sua conta foi sinalizada para revisão.')
    } catch (error) {
      console.error('❌ Flag Suspicious User Error:', error)
    }
  },

  // Session management
  createSession(userId, deviceInfo = {}) {
    try {
      const sessionId = this.generateSecureId()
      const session = {
        id: sessionId,
        userId,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          ...deviceInfo
        },
        ipAddress: null // Would be set by backend
      }
      
      // Store session
      const key = `user_sessions_${userId}`
      const sessions = JSON.parse(localStorage.getItem(key) || '[]')
      
      // Limit concurrent sessions
      if (sessions.length >= SECURITY_CONFIG.MAX_CONCURRENT_SESSIONS) {
        // Remove oldest session
        sessions.shift()
      }
      
      sessions.push(session)
      localStorage.setItem(key, JSON.stringify(sessions))
      
      // Set current session
      localStorage.setItem('current_session', JSON.stringify(session))
      
      return sessionId
    } catch (error) {
      console.error('❌ Create Session Error:', error)
      return null
    }
  },

  // Validate session
  validateSession(userId, sessionId) {
    try {
      const key = `user_sessions_${userId}`
      const sessions = JSON.parse(localStorage.getItem(key) || '[]')
      
      const session = sessions.find(s => s.id === sessionId)
      
      if (!session) return false
      
      // Check session timeout
      if (Date.now() - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
        this.destroySession(userId, sessionId)
        return false
      }
      
      // Update last activity
      session.lastActivity = Date.now()
      localStorage.setItem(key, JSON.stringify(sessions))
      
      return true
    } catch (error) {
      console.error('❌ Validate Session Error:', error)
      return false
    }
  },

  // Destroy session
  destroySession(userId, sessionId) {
    try {
      const key = `user_sessions_${userId}`
      const sessions = JSON.parse(localStorage.getItem(key) || '[]')
      
      const filteredSessions = sessions.filter(s => s.id !== sessionId)
      localStorage.setItem(key, JSON.stringify(filteredSessions))
      
      // Clear current session if it matches
      const currentSession = JSON.parse(localStorage.getItem('current_session') || 'null')
      if (currentSession && currentSession.id === sessionId) {
        localStorage.removeItem('current_session')
      }
    } catch (error) {
      console.error('❌ Destroy Session Error:', error)
    }
  },

  // Content protection (basic watermarking)
  addWatermark(element, userId, courseId) {
    try {
      if (!element || !userId) return
      
      // Create watermark overlay
      const watermark = document.createElement('div')
      watermark.className = 'video-watermark'
      watermark.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        color: rgba(255, 215, 0, 0.7);
        font-size: 12px;
        font-weight: bold;
        pointer-events: none;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.3);
        padding: 4px 8px;
        border-radius: 4px;
        font-family: monospace;
      `
      
      // Dynamic watermark text
      const userHash = this.hashString(userId).substring(0, 8)
      const timestamp = new Date().toISOString().substring(0, 16)
      watermark.textContent = `CB-${userHash}-${timestamp}`
      
      // Add to element
      element.style.position = 'relative'
      element.appendChild(watermark)
      
      // Refresh watermark every 30 seconds
      setInterval(() => {
        const newTimestamp = new Date().toISOString().substring(0, 16)
        watermark.textContent = `CB-${userHash}-${newTimestamp}`
      }, 30000)
      
    } catch (error) {
      console.error('❌ Add Watermark Error:', error)
    }
  },

  // Disable right-click and keyboard shortcuts
  enableContentProtection() {
    try {
      // Disable right-click
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        this.detectSuspiciousActivity('unknown', {
          type: 'right_click_attempt',
          details: { url: window.location.href }
        })
      })
      
      // Disable common keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U') ||
          (e.ctrlKey && e.key === 'S')
        ) {
          e.preventDefault()
          this.detectSuspiciousActivity('unknown', {
            type: 'dev_tools_attempt',
            details: { key: e.key, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey }
          })
        }
      })
      
      // Disable text selection on videos
      const style = document.createElement('style')
      style.textContent = `
        .video-container, .video-container * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
      `
      document.head.appendChild(style)
      
    } catch (error) {
      console.error('❌ Enable Content Protection Error:', error)
    }
  },

  // Generate secure ID
  generateSecureId() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => 
      (Math.random() * 16 | 0).toString(16)
    )
  },

  // Hash string (simple implementation)
  hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  },

  // Monitor for suspicious patterns
  startSecurityMonitoring(userId) {
    try {
      // Monitor rapid clicks
      let clickCount = 0
      document.addEventListener('click', () => {
        clickCount++
        setTimeout(() => clickCount--, 1000)
        
        if (clickCount > 10) {
          this.detectSuspiciousActivity(userId, {
            type: 'rapid_clicking',
            details: { clicks_per_second: clickCount }
          })
        }
      })
      
      // Monitor tab visibility
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.detectSuspiciousActivity(userId, {
            type: 'tab_hidden',
            details: { timestamp: Date.now() }
          })
        }
      })
      
      // Monitor console usage
      const originalLog = console.log
      console.log = function(...args) {
        securityService.detectSuspiciousActivity(userId, {
          type: 'console_usage',
          details: { args: args.slice(0, 3) } // Limit logged data
        })
        originalLog.apply(console, args)
      }
      
    } catch (error) {
      console.error('❌ Start Security Monitoring Error:', error)
    }
  },

  // Get security report
  getSecurityReport(userId) {
    try {
      const report = {
        loginAttempts: JSON.parse(localStorage.getItem(`login_attempts_${userId}`) || '[]'),
        suspiciousActivities: JSON.parse(localStorage.getItem(`suspicious_activity_${userId}`) || '[]'),
        sessions: JSON.parse(localStorage.getItem(`user_sessions_${userId}`) || '[]'),
        isLocked: this.isAccountLocked(userId),
        isFlagged: !!localStorage.getItem(`flagged_user_${userId}`)
      }
      
      return report
    } catch (error) {
      console.error('❌ Get Security Report Error:', error)
      return null
    }
  }
}

export default securityService