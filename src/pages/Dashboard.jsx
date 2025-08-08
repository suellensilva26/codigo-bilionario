import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Book, Clock, TrendingUp, Crown, Zap } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Dashboard = () => {
  const { user } = useAuthStore()

  return (
    <div className="container-cb py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-cb-gold/10 to-cb-gold/5 border border-cb-gold/30 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center">
              <span className="text-cb-black font-poppins font-black text-2xl">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-poppins font-bold text-cb-white mb-1">
                Bem-vindo, {user?.name || 'Usuário'}! 🔥
              </h1>
              <p className="text-cb-white/70">
                Pronto para continuar sua vingança contra os gurus?
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Crown className="w-4 h-4 text-cb-gold" />
                <span className="text-cb-gold text-sm font-semibold uppercase">
                  Plano {user?.plan || 'básico'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          {
            icon: Book,
            title: 'Cursos Acessados',
            value: '42',
            subtitle: 'de 200+ disponíveis',
            color: 'text-cb-gold'
          },
          {
            icon: Trophy,
            title: 'Cursos Concluídos',
            value: '12',
            subtitle: 'certificados emitidos',
            color: 'text-green-400'
          },
          {
            icon: Clock,
            title: 'Tempo de Estudo',
            value: '87h',
            subtitle: 'este mês',
            color: 'text-blue-400'
          },
          {
            icon: TrendingUp,
            title: 'Economia Total',
            value: 'R$ 15.420',
            subtitle: 'vs. comprar separado',
            color: 'text-cb-gold'
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card-base p-6 hover:card-premium transition-all">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg bg-${stat.color.replace('text-', '')}/10`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-cb-white">{stat.title}</h3>
                </div>
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-cb-white/60 text-sm">
                {stat.subtitle}
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
      >
        <div className="card-premium p-6">
          <h2 className="text-xl font-poppins font-bold text-cb-gold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Ações Rápidas
          </h2>
          <div className="space-y-3">
            <button className="btn-primary w-full py-3 text-left">
              🚀 Continuar último curso
            </button>
            <button className="btn-outline w-full py-3 text-left">
              📚 Explorar novos cursos
            </button>
            <button className="btn-ghost w-full py-3 text-left">
              🎯 Ver meu progresso
            </button>
          </div>
        </div>

        <div className="card-base p-6">
          <h2 className="text-xl font-poppins font-bold text-cb-white mb-4">
            📈 Seu Progresso
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-cb-white/80 text-sm">Marketing Digital</span>
                <span className="text-cb-gold text-sm font-semibold">75%</span>
              </div>
              <div className="w-full bg-cb-gray-medium rounded-full h-2">
                <div className="bg-gradient-gold h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-cb-white/80 text-sm">Vendas Online</span>
                <span className="text-cb-gold text-sm font-semibold">45%</span>
              </div>
              <div className="w-full bg-cb-gray-medium rounded-full h-2">
                <div className="bg-gradient-gold h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-cb-white/80 text-sm">Programação</span>
                <span className="text-cb-gold text-sm font-semibold">20%</span>
              </div>
              <div className="w-full bg-cb-gray-medium rounded-full h-2">
                <div className="bg-gradient-gold h-2 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="card-base p-6"
      >
        <h2 className="text-xl font-poppins font-bold text-cb-white mb-6">
          🕒 Atividade Recente
        </h2>
        <div className="space-y-4">
          {[
            {
              action: 'Completou aula',
              course: 'Facebook Ads Mastery',
              time: '2 horas atrás',
              icon: '✅'
            },
            {
              action: 'Iniciou curso',
              course: 'Copywriting Persuasivo',
              time: '1 dia atrás',
              icon: '🚀'
            },
            {
              action: 'Baixou material',
              course: 'E-book: Mindset Milionário',
              time: '2 dias atrás',
              icon: '📥'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-cb-gold/5 transition-colors">
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <p className="text-cb-white font-medium">
                  {activity.action} <span className="text-cb-gold">{activity.course}</span>
                </p>
                <p className="text-cb-white/60 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard