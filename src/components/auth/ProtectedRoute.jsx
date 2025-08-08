import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import LoadingScreen from '../common/LoadingScreen'

const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  requiredPlan = null,
  fallbackPath = '/login',
  showUpgrade = false 
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Verificando acesso..." />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    )
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // If user is not admin but trying to access admin routes
    if (requiredRole === 'admin') {
      return (
        <div className="min-h-screen bg-cb-black flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-poppins font-bold text-cb-white mb-4">
              Acesso Negado
            </h1>
            <p className="text-cb-white/70 mb-6">
              Você não tem permissão de administrador para acessar esta área.
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn-primary px-6 py-3"
            >
              Voltar
            </button>
          </div>
        </div>
      )
    }
    
    return <Navigate to="/dashboard" replace />
  }

  // Check subscription-based access
  if (requiredPlan && user.subscriptionStatus !== 'active') {
    if (showUpgrade) {
      return (
        <div className="min-h-screen bg-cb-black flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="text-6xl mb-4">💎</div>
            <h1 className="text-2xl font-poppins font-bold text-cb-white mb-4">
              Assinatura Necessária
            </h1>
            <p className="text-cb-white/70 mb-6">
              Para acessar este conteúdo, você precisa de uma assinatura ativa.
            </p>
            <div className="space-y-3">
              <Navigate to="/subscription" className="btn-primary w-full">
                Ativar Assinatura
              </Navigate>
              <button
                onClick={() => window.history.back()}
                className="btn-outline w-full"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )
    }
    
    return <Navigate to="/subscription" replace />
  }

  // Check plan hierarchy access
  if (requiredPlan) {
    const planHierarchy = { basic: 1, premium: 2, elite: 3 }
    const userPlanLevel = planHierarchy[user.plan] || 0
    const requiredLevel = planHierarchy[requiredPlan] || 0
    
    if (userPlanLevel < requiredLevel) {
      if (showUpgrade) {
        return (
          <div className="min-h-screen bg-cb-black flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8 card-premium">
              <div className="text-6xl mb-4">⬆️</div>
              <h1 className="text-2xl font-poppins font-bold text-cb-white mb-4">
                Upgrade Necessário
              </h1>
              <p className="text-cb-white/70 mb-2">
                Este conteúdo requer o plano <span className="text-cb-gold font-semibold uppercase">{requiredPlan}</span>
              </p>
              <p className="text-cb-white/60 text-sm mb-6">
                Seu plano atual: <span className="text-cb-gold font-semibold uppercase">{user.plan}</span>
              </p>
              
              <div className="space-y-3">
                <Navigate to="/subscription" className="btn-primary w-full">
                  Fazer Upgrade
                </Navigate>
                <button
                  onClick={() => window.history.back()}
                  className="btn-outline w-full"
                >
                  Voltar
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-cb-gray-dark rounded-lg">
                <p className="text-cb-gold font-semibold text-sm mb-2">
                  💡 Por que fazer upgrade?
                </p>
                <ul className="text-cb-white/70 text-xs space-y-1">
                  {requiredPlan === 'premium' && (
                    <>
                      <li>• 70% dos cursos (vs 30% no básico)</li>
                      <li>• Grupos VIP no Telegram</li>
                      <li>• Downloads para offline</li>
                      <li>• Qualidade até 1080p</li>
                    </>
                  )}
                  {requiredPlan === 'elite' && (
                    <>
                      <li>• Acesso total a todos os cursos</li>
                      <li>• Mentoria 1:1 mensal</li>
                      <li>• Sistema de afiliados</li>
                      <li>• Qualidade 4K</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )
      }
      
      return <Navigate to="/subscription" replace />
    }
  }

  // All checks passed, render the protected content
  return <>{children}</>
}

export default ProtectedRoute