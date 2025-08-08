import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    const result = await login(data)
    if (result.success) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-gold rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-cb-black font-poppins font-black text-2xl">CB</span>
          </div>
          <h1 className="text-3xl font-poppins font-bold text-gradient-gold mb-2">
            CÓDIGO BILIONÁRIO
          </h1>
          <p className="text-cb-white/70">
            Bem-vindo de volta ao arsenal!
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card-premium p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-cb-white font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cb-white/60" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className={`input-base pl-12 ${errors.email ? 'input-error' : ''}`}
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email inválido'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-cb-red-rage text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-cb-white font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cb-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  className={`input-base pl-12 pr-12 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cb-white/60 hover:text-cb-gold"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-cb-red-rage text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-cb-gold bg-cb-gray-medium border-cb-gray-light rounded focus:ring-cb-gold"
                  {...register('remember')}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-cb-white/70">
                  Lembrar de mim
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-cb-gold hover:text-cb-gold-dark transition-colors"
              >
                Esqueci a senha
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-lg font-semibold group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cb-black mr-2" />
                  Entrando...
                </div>
              ) : (
                <>
                  ENTRAR NO ARSENAL
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cb-gray-medium" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-cb-gray-medium text-cb-white/60">ou</span>
              </div>
            </div>

            {/* Demo Login */}
            <button
              type="button"
              onClick={() => {
                toast.success('🎯 Usando credenciais de demonstração!')
                login({ email: 'demo@codigobilionario.com', password: 'demo123' })
              }}
              className="btn-outline w-full py-3 text-sm"
            >
              🚀 TESTE COM CONTA DEMO
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-cb-white/70">
              Ainda não faz parte da revolução?{' '}
              <Link
                to="/register"
                className="text-cb-gold hover:text-cb-gold-dark font-semibold transition-colors"
              >
                Junte-se ao arsenal
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-cb-white/60 hover:text-cb-white text-sm transition-colors"
            >
              ← Voltar ao início
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login