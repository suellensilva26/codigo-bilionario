import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService, analyticsService } from '../lib/firebase'
import toast from 'react-hot-toast'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialized: false,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true })
        
        try {
          const result = await authService.login(credentials)
          
          if (result.success) {
            set({
              user: result.user,
              isAuthenticated: true,
              isLoading: false
            })
            
            // Track login event
            analyticsService.trackEvent('login', {
              method: 'email',
              user_id: result.user.uid
            })
            
            return { success: true }
          } else {
            set({ isLoading: false })
            return { success: false, error: result.error }
          }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true })
        
        try {
          const result = await authService.register(userData)
          
          if (result.success) {
            // Don't auto-login after register (email verification required)
            set({ isLoading: false })
            
            // Track registration event
            analyticsService.trackEvent('sign_up', {
              method: 'email',
              user_id: result.user.uid
            })
            
            return { success: true }
          } else {
            set({ isLoading: false })
            return { success: false, error: result.error }
          }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },
      
      logout: async () => {
        set({ isLoading: true })
        
        try {
          const result = await authService.logout()
          
          if (result.success) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            })
            
            // Clear persisted data
            localStorage.removeItem('auth-storage')
            
            // Track logout event
            analyticsService.trackEvent('logout')
            
            return { success: true }
          }
        } catch (error) {
          console.error('Logout error:', error)
        }
        
        set({ isLoading: false })
      },
      
      resetPassword: async (email) => {
        set({ isLoading: true })
        
        try {
          const result = await authService.resetPassword(email)
          set({ isLoading: false })
          return result
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },
      
      resendEmailVerification: async () => {
        set({ isLoading: true })
        
        try {
          const result = await authService.resendEmailVerification()
          set({ isLoading: false })
          return result
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      
      setInitialized: (initialized) => {
        set({ isInitialized: initialized })
      },
      
      updateUser: async (updates) => {
        const currentUser = get().user
        if (!currentUser) return { success: false, error: 'Usuário não autenticado' }
        
        set({ isLoading: true })
        
        try {
          const result = await authService.updateUserProfile(updates)
          
          if (result.success) {
            set({
              user: { ...currentUser, ...updates },
              isLoading: false
            })
            
            // Track profile update
            analyticsService.trackEvent('profile_update', {
              user_id: currentUser.uid,
              fields_updated: Object.keys(updates)
            })
          } else {
            set({ isLoading: false })
          }
          
          return result
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },
      
      // Initialize auth state from Firebase
      initializeAuth: () => {
        return new Promise((resolve) => {
          const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser && firebaseUser.emailVerified) {
              // User is signed in and verified
              const userData = await authService.getCurrentUser()
              
              if (userData) {
                set({
                  user: userData,
                  isAuthenticated: true,
                  isInitialized: true
                })
              } else {
                set({
                  user: null,
                  isAuthenticated: false,
                  isInitialized: true
                })
              }
            } else {
              // User is signed out or not verified
              set({
                user: null,
                isAuthenticated: false,
                isInitialized: true
              })
            }
            
            resolve()
            unsubscribe() // Clean up listener after initialization
          })
        })
      },
      
      // Check if user has active subscription
      hasActiveSubscription: () => {
        const user = get().user
        return user?.subscription?.status === 'active' && 
               user?.subscription?.plan !== 'free' &&
               new Date(user?.subscription?.endDate) > new Date()
      },
      
      // Check if user is admin
      isAdmin: () => {
        const user = get().user
        return user?.role === 'admin' || user?.role === 'super_admin'
      },
      
      // Get subscription info
      getSubscriptionInfo: () => {
        const user = get().user
        return user?.subscription || { plan: 'free', status: 'inactive' }
      },

      // Get subscription plan
      getSubscriptionPlan: () => {
        const user = get().user
        return user?.subscription?.plan || 'free'
      },

      // Check if user can access content based on plan
      canAccessContent: (requiredPlan = 'basic') => {
        const user = get().user
        if (!user || user.subscription?.status !== 'active') return false
        
        const planHierarchy = { free: 0, basic: 1, premium: 2, elite: 3 }
        const userPlanLevel = planHierarchy[user.subscription?.plan] || 0
        const requiredLevel = planHierarchy[requiredPlan] || 0
        
        return userPlanLevel >= requiredLevel
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export { useAuthStore }
export default useAuthStore