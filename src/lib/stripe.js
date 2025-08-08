import { loadStripe } from '@stripe/stripe-js'
import { db } from './firebase'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'

// 💰 STRIPE CONFIGURATION - CÓDIGO BILIONÁRIO
const STRIPE_PUBLIC_KEY = "pk_test_51RjSGF03zOhUqQDfZE76uS2bnVTa1449EDz0LHkg0o4zgAnB98H68wVRqXqamsPTpwGBIw4RSFylAyMnzsUwEbYs009YhhCYXu"

// Initialize Stripe
let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
  }
  return stripePromise
}

// 🎯 SUBSCRIPTION PLANS - CÓDIGO BILIONÁRIO
export const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Plano Básico',
    price: 97,
    priceId: 'price_basic_monthly', // Será criado no Stripe
    interval: 'month',
    features: [
      '50+ Cursos Digitais',
      'Acesso por 30 dias',
      'Suporte por email',
      'Downloads limitados',
      'Certificados digitais'
    ],
    popular: false,
    description: 'Ideal para iniciantes'
  },
  premium: {
    id: 'premium',
    name: 'Plano Premium',
    price: 247,
    priceId: 'price_premium_quarterly', // Será criado no Stripe
    interval: 'quarter',
    originalPrice: 291, // 97 * 3
    features: [
      '150+ Cursos Digitais',
      'Acesso por 90 dias',
      'Suporte prioritário',
      'Downloads ilimitados',
      'Certificados digitais',
      'Acesso a lives exclusivas',
      'Material complementar'
    ],
    popular: true,
    description: 'Mais escolhido pelos alunos',
    savings: '15% de desconto'
  },
  elite: {
    id: 'elite',
    name: 'Plano Elite',
    price: 847,
    priceId: 'price_elite_annual', // Será criado no Stripe
    interval: 'year',
    originalPrice: 1164, // 97 * 12
    features: [
      '200+ Cursos Digitais',
      'Acesso vitalício',
      'Suporte VIP 24/7',
      'Downloads ilimitados',
      'Certificados digitais',
      'Acesso a lives exclusivas',
      'Material complementar',
      'Mentoria em grupo',
      'Acesso antecipado a novos cursos',
      'Comunidade exclusiva'
    ],
    popular: false,
    description: 'Máximo resultado',
    savings: '27% de desconto'
  }
}

// 💳 STRIPE PAYMENT SERVICE
export const stripeService = {
  // Initialize Stripe
  async getStripeInstance() {
    return await getStripe()
  },

  // Create checkout session
  async createCheckoutSession({ planId, userId, userEmail, successUrl, cancelUrl }) {
    try {
      const plan = SUBSCRIPTION_PLANS[planId]
      if (!plan) {
        throw new Error('Plano não encontrado')
      }

      // In a real app, this would be a server-side call
      // For demo purposes, we'll simulate the checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId,
          userEmail,
          successUrl,
          cancelUrl,
          planId
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar sessão de checkout')
      }

      const session = await response.json()
      return { success: true, sessionId: session.id }

    } catch (error) {
      console.error('❌ Stripe Checkout Error:', error)
      return { success: false, error: error.message }
    }
  },

  // Redirect to checkout
  async redirectToCheckout(sessionId) {
    try {
      const stripe = await getStripe()
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('❌ Redirect to Checkout Error:', error)
      toast.error('Erro ao redirecionar para o checkout')
      return { success: false, error: error.message }
    }
  },

  // Process successful payment (called after webhook)
  async handlePaymentSuccess({ userId, planId, subscriptionId, customerId }) {
    try {
      const plan = SUBSCRIPTION_PLANS[planId]
      if (!plan) {
        throw new Error('Plano não encontrado')
      }

      // Calculate end date based on plan interval
      const startDate = new Date()
      let endDate = new Date()

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
        default:
          endDate.setMonth(endDate.getMonth() + 1)
      }

      // Update user subscription in Firestore
      await updateDoc(doc(db, 'users', userId), {
        subscription: {
          plan: planId,
          status: 'active',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          updatedAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      })

      toast.success(`🎉 Assinatura ${plan.name} ativada com sucesso!`)
      return { success: true }

    } catch (error) {
      console.error('❌ Payment Success Handler Error:', error)
      return { success: false, error: error.message }
    }
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      })

      if (!response.ok) {
        throw new Error('Erro ao cancelar assinatura')
      }

      toast.success('Assinatura cancelada com sucesso')
      return { success: true }

    } catch (error) {
      console.error('❌ Cancel Subscription Error:', error)
      toast.error('Erro ao cancelar assinatura')
      return { success: false, error: error.message }
    }
  },

  // Get subscription details
  async getSubscriptionDetails(subscriptionId) {
    try {
      const response = await fetch(`/api/stripe/subscription/${subscriptionId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes da assinatura')
      }

      const subscription = await response.json()
      return { success: true, subscription }

    } catch (error) {
      console.error('❌ Get Subscription Error:', error)
      return { success: false, error: error.message }
    }
  },

  // Update payment method
  async updatePaymentMethod(customerId) {
    try {
      const response = await fetch('/api/stripe/update-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar método de pagamento')
      }

      const session = await response.json()
      
      // Redirect to Stripe customer portal
      window.location.href = session.url
      
      return { success: true }

    } catch (error) {
      console.error('❌ Update Payment Method Error:', error)
      toast.error('Erro ao atualizar método de pagamento')
      return { success: false, error: error.message }
    }
  },

  // Demo mode - Simulate successful payment
  async simulatePayment({ planId, userId }) {
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const plan = SUBSCRIPTION_PLANS[planId]
      if (!plan) {
        throw new Error('Plano não encontrado')
      }

      // Calculate end date
      const startDate = new Date()
      let endDate = new Date()

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

      // Update user subscription
      await updateDoc(doc(db, 'users', userId), {
        subscription: {
          plan: planId,
          status: 'active',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          stripeCustomerId: `demo_customer_${userId}`,
          stripeSubscriptionId: `demo_sub_${Date.now()}`,
          updatedAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      })

      toast.success(`🎉 Pagamento simulado! ${plan.name} ativado!`)
      return { success: true }

    } catch (error) {
      console.error('❌ Simulate Payment Error:', error)
      toast.error('Erro na simulação de pagamento')
      return { success: false, error: error.message }
    }
  }
}

// 📊 ANALYTICS FOR PAYMENTS
export const paymentAnalytics = {
  trackPlanView(planId) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_plan', {
        plan_id: planId,
        plan_name: SUBSCRIPTION_PLANS[planId]?.name
      })
    }
  },

  trackCheckoutStart(planId) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'BRL',
        value: SUBSCRIPTION_PLANS[planId]?.price,
        plan_id: planId
      })
    }
  },

  trackPurchase(planId, transactionId) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        currency: 'BRL',
        value: SUBSCRIPTION_PLANS[planId]?.price,
        plan_id: planId
      })
    }
  }
}

export default stripeService