import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../../store/authStore'
import LoadingScreen from '../common/LoadingScreen'

// 🛡️ PROTECTED ROUTE COMPONENT - CÓDIGO BILIONÁRIO
const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireSubscription = false,
  requiredPlan = 'basic',
  adminOnly = false,
  redirectTo = '/login' 
}) => {
  const { 
    user, 
    isAuthenticated, 
    isInitialized, 
    hasActiveSubscription, 
    canAccessContent, 
    isAdmin,
    initializeAuth 
  } = useAuthStore()
  
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!isInitialized) {
        await initializeAuth()
      }
      setIsChecking(false)
    }

    checkAuth()
  }, [isInitialized, initializeAuth])

  // Show loading while checking authentication
  if (isChecking || !isInitialized) {
    return <LoadingScreen message="Verificando autenticação..." />
  }

  // If route doesn't require auth, just render children
  if (!requireAuth) {
    return children
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  // Check if email is verified
  if (!user.emailVerified) {
    return <EmailVerificationRequired />
  }

  // Check if admin access is required
  if (adminOnly && !isAdmin()) {
    return <AccessDenied reason="Acesso restrito a administradores" />
  }

  // Check if subscription is required
  if (requireSubscription && !hasActiveSubscription()) {
    return (
      <Navigate 
        to="/subscription" 
        state={{ from: location.pathname, reason: 'subscription_required' }} 
        replace 
      />
    )
  }

  // Check if specific plan is required
  if (requiredPlan !== 'basic' && !canAccessContent(requiredPlan)) {
    return <AccessDenied reason={`Plano ${requiredPlan} necessário para acessar este conteúdo`} />
  }

  // All checks passed, render the protected content
  return children
}

// 📧 EMAIL VERIFICATION REQUIRED COMPONENT
const EmailVerificationRequired = () => {
  const { resendEmailVerification } = useAuthStore()
  const [isResending, setIsResending] = useState(false)

  const handleResendEmail = async () => {
    setIsResending(true)
    await resendEmailVerification()
    setIsResending(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-cb-gray-dark rounded-xl p-8 text-center border border-gray-800"
      >
        <div className="w-16 h-16 bg-cb-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Verifique seu Email
        </h2>
        
        <p className="text-gray-300 mb-6">
          Enviamos um link de verificação para seu email. 
          Clique no link para ativar sua conta.
        </p>
        
        <button
          onClick={handleResendEmail}
          disabled={isResending}
          className="w-full bg-cb-gold hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isResending ? 'Enviando...' : 'Reenviar Email'}
        </button>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <a
            href="/logout"
            className="text-cb-gold hover:text-yellow-400 text-sm transition-colors"
          >
            Fazer logout
          </a>
        </div>
      </motion.div>
    </div>
  )
}

// 🚫 ACCESS DENIED COMPONENT
const AccessDenied = ({ reason }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-cb-gray-dark rounded-xl p-8 text-center border border-red-500/20"
      >
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Acesso Negado
        </h2>
        
        <p className="text-gray-300 mb-6">
          {reason || 'Você não tem permissão para acessar esta página.'}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-cb-gold hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Voltar
          </button>
          
          <a
            href="/subscription"
            className="block w-full bg-transparent border border-cb-gold text-cb-gold hover:bg-cb-gold hover:text-black font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Ver Planos
          </a>
        </div>
      </motion.div>
    </div>
  )
}

// 🎯 SUBSCRIPTION GUARD - For specific content
export const SubscriptionGuard = ({ children, requiredPlan = 'basic' }) => {
  const { hasActiveSubscription, canAccessContent } = useAuthStore()

  if (!hasActiveSubscription()) {
    return (
      <div className="bg-cb-gray-dark rounded-xl p-6 text-center border border-cb-gold/20">
        <div className="w-12 h-12 bg-cb-gold rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">
          Conteúdo Premium
        </h3>
        
        <p className="text-gray-300 mb-4">
          Este conteúdo está disponível apenas para assinantes.
        </p>
        
        <a
          href="/subscription"
          className="inline-block bg-cb-gold hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Assinar Agora
        </a>
      </div>
    )
  }

  if (!canAccessContent(requiredPlan)) {
    return (
      <div className="bg-cb-gray-dark rounded-xl p-6 text-center border border-cb-gold/20">
        <div className="w-12 h-12 bg-cb-gold rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">
          Upgrade Necessário
        </h3>
        
        <p className="text-gray-300 mb-4">
          Este conteúdo requer o plano {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}.
        </p>
        
        <a
          href="/subscription"
          className="inline-block bg-cb-gold hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Fazer Upgrade
        </a>
      </div>
    )
  }

  return children
}

export default ProtectedRoute