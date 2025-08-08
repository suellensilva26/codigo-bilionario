import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Check, Zap } from 'lucide-react'
import { PLANS } from '../utils/constants'

const Subscription = () => {
  return (
    <div className="container-cb py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-poppins font-bold text-gradient-gold mb-4">
          ESCOLHA SEU PLANO 💰
        </h1>
        <p className="text-xl text-cb-white/80 max-w-2xl mx-auto">
          Pare de pagar R$ 500+ por curso individual. 
          Tenha acesso ao <strong className="text-cb-gold">arsenal completo</strong>!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.values(PLANS).map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`relative ${plan.popular ? 'scale-105' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-cb-gold text-cb-black px-4 py-1 rounded-full text-sm font-bold">
                  🔥 MAIS POPULAR
                </div>
              </div>
            )}
            
            <div className={`card-base p-8 h-full ${
              plan.popular ? 'border-cb-gold shadow-cb-premium' : ''
            }`}>
              <div className="text-center mb-6">
                <Crown className={`w-12 h-12 mx-auto mb-4 ${
                  plan.color === 'gold' ? 'text-cb-gold' : 'text-cb-white/60'
                }`} />
                <h3 className="text-2xl font-poppins font-bold text-cb-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-poppins font-black text-cb-gold mb-2">
                  R$ {plan.price}
                  <span className="text-lg text-cb-white/60">/mês</span>
                </div>
                <p className="text-cb-white/60 text-sm">
                  {plan.maxCourses} cursos disponíveis
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-cb-gold mt-0.5 flex-shrink-0" />
                    <span className="text-cb-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 font-bold rounded-lg transition-all ${
                plan.popular 
                  ? 'btn-primary' 
                  : 'btn-outline'
              }`}>
                {plan.popular ? (
                  <>
                    <Zap className="w-4 h-4 inline mr-2" />
                    ESCOLHER PLANO
                  </>
                ) : (
                  'SELECIONAR'
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Guarantee */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center mt-12"
      >
        <div className="bg-cb-gold/10 border border-cb-gold/30 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-cb-gold font-bold text-lg mb-2">
            🛡️ GARANTIA DE 7 DIAS
          </h3>
          <p className="text-cb-white/80">
            Não ficou satisfeito? Devolvemos 100% do seu dinheiro sem perguntas. 
            Nossa vingança é contra os gurus, não contra você!
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Subscription