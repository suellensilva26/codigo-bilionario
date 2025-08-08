const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Secret key para JWT (em produção, use uma variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'codigo-bilionario-secret-key-2024';

// Mock database de usuários
const users = [
  {
    id: 1,
    name: 'Admin Código Bilionário',
    email: 'admin@codigobilionario.com',
    password: '$2b$10$YourHashedPasswordHere', // senha: admin123
    role: 'admin',
    subscription: {
      plan: 'elite',
      status: 'active',
      expiresAt: new Date('2025-12-31')
    }
  }
];

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', message: 'Backend Código Bilionário funcionando!' });
});

// Rota de login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Para demonstração, aceita qualquer email com senha "admin123"
    if (password === 'admin123') {
      const user = {
        id: 1,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        role: 'user',
        subscription: {
          plan: 'premium',
          status: 'active',
          expiresAt: new Date('2025-12-31')
        }
      };

      // Se for o email admin, dar privilégios admin
      if (email === 'admin@codigobilionario.com') {
        user.role = 'admin';
        user.subscription.plan = 'elite';
        user.name = 'Admin Código Bilionário';
      }

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar login'
    });
  }
});

// Rota de registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se usuário já existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Criar novo usuário
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'user',
      subscription: {
        plan: 'trial',
        status: 'active',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias trial
      }
    };

    users.push(newUser);

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        subscription: newUser.subscription
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar conta'
    });
  }
});

// Rota para obter perfil do usuário
app.get('/api/auth/profile', (req, res) => {
  // Middleware de autenticação simples
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido'
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id) || {
      id: decoded.id,
      name: decoded.email.split('@')[0],
      email: decoded.email,
      role: decoded.role,
      subscription: {
        plan: 'premium',
        status: 'active',
        expiresAt: new Date('2025-12-31')
      }
    };

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend Código Bilionário rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log('\n🔐 Login de teste:');
  console.log('   Email: admin@codigobilionario.com');
  console.log('   Senha: admin123\n');
});