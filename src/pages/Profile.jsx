import React from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Crown, Calendar } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Profile = () => {
  const { user } = useAuthStore()

  return (
    <div className="container-cb py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-poppins font-bold text-gradient-gold mb-8">
          MEU PERFIL 👤
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="card-premium p-6 mb-8">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center">
                  <span className="text-cb-black font-poppins font-black text-3xl">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-poppins font-bold text-cb-white mb-1">
                    {user?.name || 'Usuário'}
                  </h2>
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-4 h-4 text-cb-white/60" />
                    <span className="text-cb-white/80">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-cb-gold" />
                    <span className="text-cb-gold font-semibold uppercase">
                      Plano {user?.plan || 'básico'}
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="btn-primary px-6 py-3">
                Editar Perfil
              </button>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="card-base p-6">
              <h3 className="font-poppins font-bold text-cb-white mb-4">
                Estatísticas
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cb-white/70">Cursos iniciados</span>
                  <span className="text-cb-gold font-bold">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cb-white/70">Concluídos</span>
                  <span className="text-cb-gold font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cb-white/70">Tempo total</span>
                  <span className="text-cb-gold font-bold">87h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cb-white/70">Economia</span>
                  <span className="text-cb-gold font-bold">R$ 15.420</span>
                </div>
              </div>
            </div>

            <div className="card-base p-6">
              <h3 className="font-poppins font-bold text-cb-white mb-4">
                Membro desde
              </h3>
              <div className="flex items-center space-x-2 text-cb-white/80">
                <Calendar className="w-4 h-4" />
                <span>Janeiro 2025</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile