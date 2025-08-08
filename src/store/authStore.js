import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await authService.login(credentials)
          const { user, token } = response
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          // Store token in localStorage for API calls
          localStorage.setItem('authToken', token)
          
          toast.success(`Bem-vindo de volta, ${user.name}!`, {
            icon: '🔥',
            duration: 3000
          })
          
          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Erro ao fazer login'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await authService.register(userData)
          const { user, token } = response
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          localStorage.setItem('authToken', token)
          
          toast.success('🚀 Bem-vindo ao arsenal digital!', {
            duration: 4000
          })
          
          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Erro ao criar conta'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } catch (error) {
          // Even if logout fails on server, clear local state
          console.error('Logout error:', error)
        } finally {
          // Clear state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          
          // Clear localStorage
          localStorage.removeItem('authToken')
          
          toast.success('Logout realizado com sucesso!')
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true })
        try {
          const response = await authService.updateProfile(profileData)
          const updatedUser = response.data.user
          
          set({
            user: updatedUser,
            isLoading: false
          })
          
          toast.success('Perfil atualizado!')
          return { success: true, user: updatedUser }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Erro ao atualizar perfil'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      refreshToken: async () => {
        try {
          const response = await authService.refreshToken()
          const { token } = response
          
          set({ token })
          localStorage.setItem('authToken', token)
          
          return { success: true }
        } catch (error) {
          // If refresh fails, logout user
          get().logout()
          return { success: false }
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('authToken')
        
        if (!token) {
          set({ isLoading: false, isAuthenticated: false })
          return
        }
        
        set({ isLoading: true })
        
        try {
          const response = await authService.getProfile()
          const user = response.user
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          // Token is invalid, clear everything
          localStorage.removeItem('authToken')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true })
        try {
          await authService.forgotPassword(email)
          set({ isLoading: false })
          
          toast.success('E-mail de recuperação enviado!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Erro ao enviar e-mail'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      resetPassword: async (token, password) => {
        set({ isLoading: true })
        try {
          await authService.resetPassword(token, password)
          set({ isLoading: false })
          
          toast.success('Senha alterada com sucesso!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Erro ao alterar senha'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      // Utility getters
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },

      hasActiveSubscription: () => {
        const { user } = get()
        return user?.subscriptionStatus === 'active'
      },

      getSubscriptionPlan: () => {
        const { user } = get()
        return user?.plan || 'basic'
      },

      canAccessContent: (requiredPlan = 'basic') => {
        const { user } = get()
        if (!user || user.subscriptionStatus !== 'active') return false
        
        const planHierarchy = { basic: 1, premium: 2, elite: 3 }
        const userPlanLevel = planHierarchy[user.plan] || 0
        const requiredLevel = planHierarchy[requiredPlan] || 0
        
        return userPlanLevel >= requiredLevel
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export { useAuthStore }