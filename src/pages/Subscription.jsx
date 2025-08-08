import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  Check, 
  Crown, 
  Zap, 
  Shield, 
  Star, 
  ArrowRight,
  Sparkles,
  Target,
  Gift,
  Clock,
  Users,
  Award,
  Flame
} from 'lucide-react'
import { Elements } from '@stripe/react-stripe-js'
import { stripeService, SUBSCRIPTION_PLANS, paymentAnalytics } from '../lib/stripe'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

// 🎯 SUBSCRIPTION PAGE - CÓDIGO BILIONÁRIO
const Subscription = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, updateUser } = useAuthStore()
  
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
    }
  }, [isAuthenticated, navigate, location])

  // Handle plan selection
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId)
    paymentAnalytics.trackPlanView(planId)
  }

  // Handle subscription purchase
  const handleSubscribe = async (planId) => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return
    }

    setIsProcessing(true)
    paymentAnalytics.trackCheckoutStart(planId)

    try {
      // For demo mode, simulate payment
      const isDemoMode = window.location.hostname !== 'localhost' && !process.env.NODE_ENV === 'production'
      
      if (isDemoMode) {
        const result = await stripeService.simulatePayment({
          planId,
          userId: user.uid
        })

        if (result.success) {
          // Update user state
          const plan = SUBSCRIPTION_PLANS[planId]
          const endDate = new Date()
          
          switch (plan.interval) {
            case 'month':
              endDate.setMonth(endDate.getMonth() + 1)
              break
            case 'quarter':
              endDate.setMonth(endDate.getMonth() + 3)
              break
            case 'year':
              endDate.setFullYear(endDate.getFullYear() + 1)
              break
          }

          await updateUser({
            subscription: {
              plan: planId,
              status: 'active',
              startDate: new Date().toISOString(),
              endDate: endDate.toISOString()
            }
          })

          paymentAnalytics.trackPurchase(planId, `demo_${Date.now()}`)
          navigate('/dashboard', { state: { subscriptionSuccess: true } })
        }
      } else {
        // Real Stripe checkout
        const result = await stripeService.createCheckoutSession({
          planId,
          userId: user.uid,
          userEmail: user.email,
          successUrl: `${window.location.origin}/subscription/success?plan=${planId}`,
          cancelUrl: `${window.location.origin}/subscription?canceled=true`
        })

        if (result.success) {
          await stripeService.redirectToCheckout(result.sessionId)
        } else {
          throw new Error(result.error)
        }
      }
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Erro ao processar assinatura. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Planos - Código Bilionário | Escolha Seu Arsenal</title>
        <meta name="description" content="Escolha seu plano no Código Bilionário. Acesse 200+ cursos por R$ 97/mês. Pare de enriquecer gurus!" />
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-cb-gray-dark to-black">
          <div className="absolute inset-0 bg-gradient-to-br from-cb-gold/5 to-transparent" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center space-x-2 text-cb-gold mb-6">
                <Flame className="w-8 h-8" />
                <span className="text-lg font-semibold">REVOLUÇÃO DIGITAL</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Pare de Enriquecer
                <br />
                <span className="text-cb-gold">Gurus Digitais</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Acesse <strong>TODOS</strong> os cursos que eles vendem separadamente por R$ 500+ cada, 
                por apenas <strong className="text-cb-gold">R$ 97/mês</strong>
              </p>

              <div className="flex items-center justify-center space-x-8 text-white">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cb-gold">200+</div>
                  <div className="text-sm text-gray-400">Cursos Completos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cb-gold">50k+</div>
                  <div className="text-sm text-gray-400">Alunos Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cb-gold">97%</div>
                  <div className="text-sm text-gray-400">Satisfação</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Escolha Seu Arsenal Digital
            </h2>
            <p className="text-gray-400 text-lg">
              Todos os planos incluem acesso completo à plataforma
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {Object.values(SUBSCRIPTION_PLANS).map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative rounded-2xl p-8 border-2 transition-all duration-300 ${
                  plan.popular
                    ? 'border-cb-gold bg-gradient-to-br from-cb-gold/10 to-transparent scale-105'
                    : selectedPlan === plan.id
                    ? 'border-cb-gold bg-cb-gray-dark'
                    : 'border-gray-700 bg-cb-gray-dark hover:border-cb-gold/50'
                }`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-cb-gold text-black px-4 py-1 rounded-full text-sm font-bold flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      MAIS ESCOLHIDO
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-cb-gold rounded-xl flex items-center justify-center mx-auto mb-4">
                    {plan.id === 'basic' && <Zap className="w-8 h-8 text-black" />}
                    {plan.id === 'premium' && <Crown className="w-8 h-8 text-black" />}
                    {plan.id === 'elite' && <Shield className="w-8 h-8 text-black" />}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-cb-gold mb-1">
                      R$ {plan.price}
                    </div>
                    <div className="text-gray-400">
                      por {plan.interval === 'month' ? 'mês' : plan.interval === 'quarter' ? 'trimestre' : 'ano'}
                    </div>
                    {plan.originalPrice && (
                      <div className="text-sm text-gray-500">
                        De <span className="line-through">R$ {plan.originalPrice}</span>
                        <span className="text-cb-gold ml-2">{plan.savings}</span>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-cb-gold mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    plan.popular
                      ? 'bg-cb-gold hover:bg-yellow-400 text-black'
                      : 'bg-transparent border-2 border-cb-gold text-cb-gold hover:bg-cb-gold hover:text-black'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? (
                    <span>Processando...</span>
                  ) : (
                    <>
                      <span>ESCOLHER {plan.name.toUpperCase()}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Comparison Toggle */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-cb-gold hover:text-yellow-400 transition-colors flex items-center mx-auto space-x-2"
            >
              <span>Ver comparação detalhada</span>
              <motion.div
                animate={{ rotate: showComparison ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4 rotate-90" />
              </motion.div>
            </button>
          </div>

          {/* Detailed Comparison */}
          <motion.div
            initial={false}
            animate={{ height: showComparison ? 'auto' : 0, opacity: showComparison ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="bg-cb-gray-dark rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white text-center mb-8">
                Comparação Detalhada dos Planos
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-4 text-gray-300">Funcionalidade</th>
                      <th className="pb-4 text-center text-gray-300">Básico</th>
                      <th className="pb-4 text-center text-cb-gold">Premium</th>
                      <th className="pb-4 text-center text-gray-300">Elite</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-800">
                      <td className="py-4">Número de cursos</td>
                      <td className="py-4 text-center">50+</td>
                      <td className="py-4 text-center text-cb-gold">150+</td>
                      <td className="py-4 text-center">200+</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4">Duração do acesso</td>
                      <td className="py-4 text-center">30 dias</td>
                      <td className="py-4 text-center text-cb-gold">90 dias</td>
                      <td className="py-4 text-center">Vitalício</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4">Suporte</td>
                      <td className="py-4 text-center">Email</td>
                      <td className="py-4 text-center text-cb-gold">Prioritário</td>
                      <td className="py-4 text-center">VIP 24/7</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4">Downloads</td>
                      <td className="py-4 text-center">Limitados</td>
                      <td className="py-4 text-center text-cb-gold">Ilimitados</td>
                      <td className="py-4 text-center">Ilimitados</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4">Lives exclusivas</td>
                      <td className="py-4 text-center">❌</td>
                      <td className="py-4 text-center text-cb-gold">✅</td>
                      <td className="py-4 text-center">✅</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4">Mentoria em grupo</td>
                      <td className="py-4 text-center">❌</td>
                      <td className="py-4 text-center">❌</td>
                      <td className="py-4 text-center text-cb-gold">✅</td>
                    </tr>
                    <tr>
                      <td className="py-4">Comunidade exclusiva</td>
                      <td className="py-4 text-center">❌</td>
                      <td className="py-4 text-center">❌</td>
                      <td className="py-4 text-center text-cb-gold">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-cb-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h4 className="text-white font-semibold mb-2">Pagamento Seguro</h4>
                <p className="text-gray-400 text-sm">Criptografia SSL e Stripe</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-cb-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-black" />
                </div>
                <h4 className="text-white font-semibold mb-2">Acesso Imediato</h4>
                <p className="text-gray-400 text-sm">Liberado em segundos</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-cb-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <h4 className="text-white font-semibold mb-2">50k+ Alunos</h4>
                <p className="text-gray-400 text-sm">Comunidade ativa</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-cb-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-black" />
                </div>
                <h4 className="text-white font-semibold mb-2">Garantia 7 dias</h4>
                <p className="text-gray-400 text-sm">Reembolso total</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Quick */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-cb-gray-dark rounded-2xl p-8 border border-gray-700 mt-16"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Perguntas Frequentes
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-cb-gold font-semibold mb-2">
                  Posso cancelar a qualquer momento?
                </h4>
                <p className="text-gray-300 text-sm">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem multas ou taxas.
                </p>
              </div>
              
              <div>
                <h4 className="text-cb-gold font-semibold mb-2">
                  Os cursos são atualizados?
                </h4>
                <p className="text-gray-300 text-sm">
                  Sim! Adicionamos novos cursos mensalmente e atualizamos o conteúdo existente.
                </p>
              </div>
              
              <div>
                <h4 className="text-cb-gold font-semibold mb-2">
                  Funciona no celular?
                </h4>
                <p className="text-gray-300 text-sm">
                  Perfeitamente! Nossa plataforma é 100% responsiva e funciona em todos os dispositivos.
                </p>
              </div>
              
              <div>
                <h4 className="text-cb-gold font-semibold mb-2">
                  Tem certificado?
                </h4>
                <p className="text-gray-300 text-sm">
                  Sim! Todos os cursos incluem certificado digital de conclusão reconhecido.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Subscription