const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const stripe = require('stripe');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Security middleware
app.use(helmet());
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://codigo-bilionario.vercel.app',
    process.env.FRONTEND_URL,
    process.env.PRODUCTION_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Stripe webhook needs raw body - MUST be before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Regular JSON middleware
app.use(express.json({ limit: '10mb' }));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'codigo-bilionario-secret-key-2024';

// 🎯 SUBSCRIPTION PLANS - Same as frontend
const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Plano Básico',
    price: 97,
    priceId: 'price_basic_monthly',
    interval: 'month'
  },
  premium: {
    id: 'premium',
    name: 'Plano Premium',
    price: 247,
    priceId: 'price_premium_quarterly',
    interval: 'quarter'
  },
  elite: {
    id: 'elite',
    name: 'Plano Elite',
    price: 847,
    priceId: 'price_elite_annual',
    interval: 'year'
  }
};

// Mock database
const users = [
  {
    id: 1,
    name: 'Admin Código Bilionário',
    email: 'admin@codigobilionario.com',
    password: '$2b$10$YourHashedPasswordHere',
    role: 'admin',
    subscription: {
      plan: 'elite',
      status: 'active',
      expiresAt: new Date('2025-12-31')
    }
  }
];

// 🔥 STATUS ROUTE
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend Código Bilionário funcionando!',
    stripe: !!process.env.STRIPE_SECRET_KEY,
    timestamp: new Date().toISOString()
  });
});

// 🔐 AUTH ROUTES
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Demo login
    if (password === 'admin123') {
      const user = {
        id: Date.now(),
        name: 'Demo User',
        email: email,
        role: 'user',
        subscription: {
          plan: 'basic',
          status: 'active',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      };

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        user,
        token
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// 💰 STRIPE ROUTES

// Create Checkout Session
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, userEmail, successUrl, cancelUrl, planId } = req.body;

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Plano não encontrado' });
    }

    // Create Stripe checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: plan.name,
              description: `Acesso ao Código Bilionário - ${plan.name}`,
              images: ['https://codigo-bilionario.vercel.app/logo.png'],
            },
            unit_amount: plan.price * 100, // Stripe uses cents
            recurring: {
              interval: plan.interval === 'quarter' ? 'month' : plan.interval,
              interval_count: plan.interval === 'quarter' ? 3 : 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        userId,
        planId,
        userEmail
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
          userEmail
        }
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: 'required',
      automatic_tax: { enabled: false },
      allow_promotion_codes: true,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Stripe Checkout Error:', error);
    res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
  }
});

// Stripe Webhook Handler
app.post('/api/stripe/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Payment successful for session:', session.id);
      
      // Here you would update your database
      // For now, just log the success
      console.log('User:', session.metadata.userId);
      console.log('Plan:', session.metadata.planId);
      console.log('Customer:', session.customer);
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('✅ Invoice payment succeeded:', invoice.id);
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('❌ Subscription cancelled:', subscription.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Cancel Subscription
app.post('/api/stripe/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    const subscription = await stripeInstance.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    res.json({ subscription });
  } catch (error) {
    console.error('❌ Cancel Subscription Error:', error);
    res.status(500).json({ error: 'Erro ao cancelar assinatura' });
  }
});

// Get Subscription Details
app.get('/api/stripe/subscription/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId);
    res.json(subscription);
  } catch (error) {
    console.error('❌ Get Subscription Error:', error);
    res.status(500).json({ error: 'Erro ao buscar assinatura' });
  }
});

// Update Payment Method (Customer Portal)
app.post('/api/stripe/update-payment-method', async (req, res) => {
  try {
    const { customerId } = req.body;

    const session = await stripeInstance.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.FRONTEND_URL || 'http://localhost:5173/dashboard',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Customer Portal Error:', error);
    res.status(500).json({ error: 'Erro ao criar sessão do portal' });
  }
});

// 📊 ANALYTICS ROUTES
app.get('/api/analytics/revenue', (req, res) => {
  // Mock revenue data
  res.json({
    total: 125000,
    monthly: 15000,
    subscriptions: {
      basic: 450,
      premium: 280,
      elite: 120
    }
  });
});

// 👥 USERS ROUTES
app.get('/api/users/stats', (req, res) => {
  res.json({
    total: 850,
    active: 720,
    new_this_month: 95,
    churn_rate: 3.2
  });
});

// 📚 COURSES ROUTES
app.get('/api/courses', (req, res) => {
  // Mock courses data
  const courses = [
    {
      id: 1,
      title: 'Marketing Digital Avançado',
      instructor: 'Pedro Sobral',
      duration: '12h 30min',
      students: 15420,
      rating: 4.8,
      category: 'marketing',
      thumbnail: 'https://via.placeholder.com/400x225/1a1a1a/FFD700?text=Marketing+Digital',
      price: 497,
      level: 'Avançado'
    },
    {
      id: 2,
      title: 'Copywriting Milionário',
      instructor: 'Ana Silva',
      duration: '8h 45min',
      students: 12350,
      rating: 4.9,
      category: 'copywriting',
      thumbnail: 'https://via.placeholder.com/400x225/1a1a1a/FFD700?text=Copywriting',
      price: 397,
      level: 'Intermediário'
    }
  ];

  res.json({ courses, total: courses.length });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Código Bilionário Backend rodando na porta ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💰 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configurado' : 'Não configurado'}`);
});

module.exports = app;