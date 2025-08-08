import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles, Zap, Target, Shield } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

// 🔥 VALIDATION SCHEMA
const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  phone: yup
    .string()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido')
    .required('Telefone é obrigatório'),
  password: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas não conferem')
    .required('Confirmação de senha é obrigatória'),
  terms: yup
    .boolean()
    .oneOf([true], 'Você deve aceitar os termos de uso')
})

// 🚀 REGISTER PAGE - CÓDIGO BILIONÁRIO
const Register = () => {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, isAuthenticated } = useAuthStore()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Phone mask
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3')
      if (value.length <= 10) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3')
      }
    }
    
    setValue('phone', value)
  }

  // Handle form submission
  const onSubmit = async (data) => {
    const { confirmPassword, terms, ...userData } = data
    
    const result = await registerUser(userData)
    
    if (result.success) {
      toast.success('🎉 Conta criada! Verifique seu email para ativar.')
      navigate('/login', { 
        state: { 
          message: 'Conta criada com sucesso! Verifique seu email para fazer login.' 
        } 
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>Cadastro - Código Bilionário | Junte-se à Revolução</title>
        <meta name="description" content="Crie sua conta no Código Bilionário e acesse mais de 200 cursos digitais por R$ 97/mês. Pare de enriquecer gurus!" />
      </Helmet>

      <div className="min-h-screen bg-black flex">
        {/* Left Side - Hero */}
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
                <Shield className="w-6 h-6" />
                <span className="font-semibold">REVOLUÇÃO DIGITAL</span>
              </div>
              
              <h2 className="text-4xl font-bold text-white leading-tight">
                Pare de Enriquecer
                <br />
                <span className="text-cb-gold">Gurus Digitais</span>
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Acesse TODO o conhecimento que eles vendem separadamente 
                por R$ 500+ cada, por apenas R$ 97/mês.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cb-gold rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-white">200+ Cursos Completos</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cb-gold rounded-full flex items-center justify-center">
                    <Target className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-white">Acesso Vitalício</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cb-gold rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-white">Atualizações Constantes</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-cb-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-cb-gold/5 rounded-full blur-3xl" />
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
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
                JUNTE-SE AO ARSENAL
              </h1>
              
              <p className="text-gray-400">
                Crie sua conta e inicie a revolução
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('name')}
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-cb-gray-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cb-gold focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

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

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('phone')}
                    type="tel"
                    onChange={handlePhoneChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-cb-gray-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cb-gold focus:border-transparent"
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
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
                    placeholder="Mínimo 6 caracteres"
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

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-cb-gray-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cb-gold focus:border-transparent"
                    placeholder="Digite a senha novamente"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  {...register('terms')}
                  id="terms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-cb-gold bg-cb-gray-dark border-gray-600 rounded focus:ring-cb-gold focus:ring-2"
                />
                <label htmlFor="terms" className="ml-3 block text-sm text-gray-300">
                  Eu aceito os{' '}
                  <Link to="/terms" className="text-cb-gold hover:text-yellow-400 transition-colors">
                    Termos de Uso
                  </Link>
                  {' '}e{' '}
                  <Link to="/privacy" className="text-cb-gold hover:text-yellow-400 transition-colors">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-400">{errors.terms.message}</p>
              )}

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
                {isSubmitting || isLoading ? 'CRIANDO CONTA...' : 'JUNTAR-SE AO ARSENAL'}
              </motion.button>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Já faz parte da revolução?{' '}
                <Link
                  to="/login"
                  className="text-cb-gold hover:text-yellow-400 font-medium transition-colors"
                >
                  Fazer login
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
      </div>
    </>
  )
}

export default Register