import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Zap, Target } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

// 🔥 VALIDATION SCHEMA
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória')
})

// 🚀 LOGIN PAGE - CÓDIGO BILIONÁRIO
const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, isAuthenticated, resetPassword } = useAuthStore()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // Handle form submission
  const onSubmit = async (data) => {
    const result = await login(data)
    
    if (result.success) {
      const from = location.state?.from || '/dashboard'
      navigate(from, { replace: true })
    }
  }

  // Handle password reset
  const handleForgotPassword = async () => {
    const email = getValues('email')
    
    if (!email) {
      toast.error('Digite seu email primeiro')
      return
    }

    setIsResettingPassword(true)
    const result = await resetPassword(email)
    setIsResettingPassword(false)

    if (result.success) {
      toast.success('📧 Email de recuperação enviado!')
    }
  }

  // Demo login function
  const handleDemoLogin = async () => {
    const demoCredentials = {
      email: 'demo@codigobilionario.com',
      password: 'demo123456'
    }
    
    const result = await login(demoCredentials)
    
    if (result.success) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <>
      <Helmet>
        <title>Login - Código Bilionário | Acesse o Arsenal</title>
        <meta name="description" content="Faça login no Código Bilionário e acesse mais de 200 cursos digitais por uma fração do preço." />
      </Helmet>

      <div className="min-h-screen bg-black flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md w-full space-y-8"
          >
            {/* Logo */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-cb-gold rounded-xl mb-6"
              >
                <span className="text-2xl font-bold text-black">CB</span>
              </motion.div>
              
              <h1 className="text-4xl font-bold text-white mb-2">
                CÓDIGO BILIONÁRIO
              </h1>
              
              <p className="text-gray-400">
                Bem-vindo de volta ao arsenal!
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-cb-gray-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cb-gold focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-cb-gray-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cb-gold focus:border-transparent"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cb-gold bg-cb-gray-dark border-gray-600 rounded focus:ring-cb-gold focus:ring-2"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Lembrar de mim
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isResettingPassword}
                  className="text-sm text-cb-gold hover:text-yellow-400 transition-colors disabled:opacity-50"
                >
                  {isResettingPassword ? 'Enviando...' : 'Esqueci a senha'}
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-cb-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cb-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowRight className="h-5 w-5 text-black group-hover:translate-x-1 transition-transform" />
                </span>
                {isSubmitting || isLoading ? 'ENTRANDO...' : 'ENTRAR NO ARSENAL'}
              </motion.button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">ou</span>
                </div>
              </div>

              {/* Demo Button */}
              <motion.button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center items-center py-3 px-4 border border-cb-gold text-sm font-medium rounded-lg text-cb-gold bg-transparent hover:bg-cb-gold hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cb-gold disabled:opacity-50 transition-all duration-200"
              >
                <Zap className="w-4 h-4 mr-2" />
                TESTE COM CONTA DEMO
              </motion.button>
            </form>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Ainda não faz parte da revolução?{' '}
                <Link
                  to="/register"
                  className="text-cb-gold hover:text-yellow-400 font-medium transition-colors"
                >
                  Junte-se ao arsenal
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                ← Voltar ao início
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Hero */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-cb-gray-dark to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cb-gold/10 to-transparent" />
          
          <div className="relative z-10 flex flex-col justify-center px-12 py-24">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-2 text-cb-gold">
                <Sparkles className="w-6 h-6" />
                <span className="font-semibold">ACESSO TOTAL</span>
              </div>
              
              <h2 className="text-4xl font-bold text-white leading-tight">
                Mais de 200 Cursos
                <br />
                <span className="text-cb-gold">Por R$ 97/mês</span>
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Pare de enriquecer gurus! Acesse todo o conhecimento digital 
                que você precisa por uma fração do preço.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cb-gold rounded-full flex items-center justify-center">
                    <Target className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-white">Marketing Digital Avançado</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cb-gold rounded-full flex items-center justify-center">
                    <Target className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-white">Desenvolvimento Pessoal</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cb-gold rounded-full flex items-center justify-center">
                    <Target className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-white">Vendas & Negociação</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-cb-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-cb-gold/5 rounded-full blur-3xl" />
        </div>
      </div>
    </>
  )
}

export default Login