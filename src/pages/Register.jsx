import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    const result = await registerUser(data)
    if (result.success) {
      navigate('/dashboard')
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
            Junte-se à revolução contra os gurus!
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
            {/* Name */}
            <div>
              <label className="block text-cb-white font-medium mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cb-white/60" />
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  className={`input-base pl-12 ${errors.name ? 'input-error' : ''}`}
                  {...register('name', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres'
                    }
                  })}
                />
              </div>
              {errors.name && (
                <p className="text-cb-red-rage text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

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
                  placeholder="Mínimo 8 caracteres"
                  className={`input-base pl-12 pr-12 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 8,
                      message: 'Senha deve ter pelo menos 8 caracteres'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Senha deve conter pelo menos: 1 minúscula, 1 maiúscula e 1 número'
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

            {/* Confirm Password */}
            <div>
              <label className="block text-cb-white font-medium mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cb-white/60" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  className={`input-base pl-12 pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: value =>
                      value === password || 'Senhas não coincidem'
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cb-white/60 hover:text-cb-gold"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-cb-red-rage text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 text-cb-gold bg-cb-gray-medium border-cb-gray-light rounded focus:ring-cb-gold"
                {...register('terms', {
                  required: 'Você deve aceitar os termos'
                })}
              />
              <label htmlFor="terms" className="text-sm text-cb-white/70">
                Eu aceito os{' '}
                <Link to="/terms" className="text-cb-gold hover:text-cb-gold-dark">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link to="/privacy" className="text-cb-gold hover:text-cb-gold-dark">
                  Política de Privacidade
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-cb-red-rage text-sm">{errors.terms.message}</p>
            )}

            {/* Marketing */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="marketing"
                className="w-4 h-4 mt-1 text-cb-gold bg-cb-gray-medium border-cb-gray-light rounded focus:ring-cb-gold"
                {...register('marketing')}
              />
              <label htmlFor="marketing" className="text-sm text-cb-white/70">
                Quero receber dicas exclusivas e atualizações sobre novos cursos
              </label>
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
                  Criando conta...
                </div>
              ) : (
                <>
                  INICIAR VINGANÇA 🔥
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-cb-white/70">
              Já faz parte da revolução?{' '}
              <Link
                to="/login"
                className="text-cb-gold hover:text-cb-gold-dark font-semibold transition-colors"
              >
                Entrar no arsenal
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

        {/* Benefits */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="bg-cb-gold/10 border border-cb-gold/30 rounded-lg p-6">
            <h3 className="text-cb-gold font-bold mb-3">🎯 Ao se registrar você ganha:</h3>
            <ul className="text-cb-white/80 text-sm space-y-2">
              <li>✅ Acesso imediato ao arsenal completo</li>
              <li>✅ 7 dias de garantia total</li>
              <li>✅ Grupo VIP no Telegram</li>
              <li>✅ Atualizações semanais gratuitas</li>
              <li>✅ Suporte 24/7 da comunidade</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register