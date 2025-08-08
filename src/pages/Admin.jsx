import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, BookOpen, DollarSign, BarChart3, Settings } from 'lucide-react'

const Admin = () => {
  return (
    <div className="min-h-screen bg-cb-black">
      <div className="container-cb py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-cb-gold" />
            <h1 className="text-3xl font-poppins font-bold text-gradient-gold">
              ADMIN DASHBOARD 🔧
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: Users,
                title: 'Usuários Ativos',
                value: '2.847',
                change: '+12%',
                color: 'text-blue-400'
              },
              {
                icon: BookOpen,
                title: 'Cursos Ativos',
                value: '203',
                change: '+5%',
                color: 'text-green-400'
              },
              {
                icon: DollarSign,
                title: 'Receita Mensal',
                value: 'R$ 276.459',
                change: '+23%',
                color: 'text-cb-gold'
              },
              {
                icon: BarChart3,
                title: 'Conversão',
                value: '12.4%',
                change: '+2.1%',
                color: 'text-purple-400'
              },
              {
                icon: Users,
                title: 'Novos Hoje',
                value: '156',
                change: '+8%',
                color: 'text-cyan-400'
              },
              {
                icon: Settings,
                title: 'Churn Rate',
                value: '3.2%',
                change: '-0.5%',
                color: 'text-red-400'
              }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="card-premium p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                    <span className="text-green-400 text-sm font-semibold">
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-cb-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-cb-white/60 text-sm">
                    {stat.title}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛠️</div>
            <h2 className="text-2xl font-poppins font-bold text-cb-gold mb-4">
              DASHBOARD ADMINISTRATIVO
            </h2>
            <p className="text-cb-white/70 max-w-md mx-auto">
              Funcionalidades completas de administração serão implementadas: 
              gestão de usuários, cursos, pagamentos, relatórios e muito mais!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Admin