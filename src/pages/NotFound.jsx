import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-8xl font-poppins font-black text-gradient-gold mb-4">
            404
          </div>
          <h1 className="text-2xl font-poppins font-bold text-cb-white mb-4">
            Página Não Encontrada
          </h1>
          <p className="text-cb-white/70 mb-8">
            Ops! Parece que esta página se perdeu no arsenal digital. 
            Que tal voltar para continuar sua vingança?
          </p>
          
          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="btn-primary px-6 py-3 inline-flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Voltar ao Dashboard</span>
            </Link>
            
            <div>
              <button
                onClick={() => window.history.back()}
                className="btn-ghost px-6 py-2 inline-flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-cb-white/60">
            <p className="text-sm">
              🚀 Dica: Use o menu de navegação para encontrar o que procura!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound