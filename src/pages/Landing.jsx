import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Trophy,
  DollarSign,
  Users,
  Star,
  Clock
} from 'lucide-react'
import { MARKETING_MESSAGES, SOCIAL_PROOF } from '../utils/constants'

const Landing = () => {
  return (
    <div className="min-h-screen bg-cb-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cb-black via-cb-gray-dark to-cb-black" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cb-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cb-red-rage/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container-cb section-spacing">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-8xl font-poppins font-black text-gradient-gold mb-4 leading-tight">
                CÓDIGO
              </h1>
              <h2 className="text-3xl md:text-6xl font-poppins font-black text-gradient-gold mb-6">
                BILIONÁRIO
              </h2>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              <h3 className="text-2xl md:text-4xl font-poppins font-bold text-cb-red-rage mb-4">
                {MARKETING_MESSAGES.HERO_TITLE}
              </h3>
              <p className="text-xl md:text-2xl text-cb-white/90 mb-6">
                {MARKETING_MESSAGES.HERO_SUBTITLE}
              </p>
              <div className="inline-block bg-cb-gold/10 border border-cb-gold/30 rounded-lg px-6 py-3">
                <p className="text-cb-gold font-semibold">
                  💰 Economia de R$ 50.000+ vs. comprar cursos separados
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                to="/register"
                className="btn-primary px-8 py-4 text-lg font-bold uppercase group"
              >
                {MARKETING_MESSAGES.HERO_CTA}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/login"
                className="btn-outline px-8 py-4 text-lg font-bold"
              >
                JÁ SOU MEMBRO
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-cb-gold mb-1">
                  {SOCIAL_PROOF.TOTAL_STUDENTS.toLocaleString()}+
                </div>
                <div className="text-sm text-cb-white/70">Alunos Vingados</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-cb-gold mb-1">
                  {SOCIAL_PROOF.TOTAL_COURSES}+
                </div>
                <div className="text-sm text-cb-white/70">Cursos Premium</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-cb-gold mb-1">
                  {SOCIAL_PROOF.MONEY_SAVED}
                </div>
                <div className="text-sm text-cb-white/70">Economizados</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-cb-gold mb-1">
                  {SOCIAL_PROOF.AVERAGE_RATING}★
                </div>
                <div className="text-sm text-cb-white/70">Avaliação Média</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 bg-cb-gray-dark/50">
        <div className="container-cb">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-poppins font-bold text-cb-red-rage mb-6">
              CANSADO DESTA REALIDADE? 😡
            </h2>
            <p className="text-xl text-cb-white/80 mb-8">
              Se você se identifica com pelo menos 3 dessas frustrações, VOCÊ É NOSSO PÚBLICO!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {MARKETING_MESSAGES.PAIN_POINTS.map((pain, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-cb-red-rage/10 border border-cb-red-rage/30 rounded-lg p-6 hover:bg-cb-red-rage/20 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">😤</div>
                  <p className="text-cb-white/90 italic">"{pain}"</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-block bg-cb-red-rage/20 border border-cb-red-rage rounded-lg px-8 py-4">
              <p className="text-cb-red-rage font-bold text-xl">
                🔥 CHEGA! É HORA DA VINGANÇA!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="container-cb">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-poppins font-bold text-cb-gold mb-6">
              A VINGANÇA PERFEITA 💎
            </h2>
            <p className="text-xl text-cb-white/80 mb-8">
              Tenha TODOS os cursos que eles vendem por <strong className="text-cb-gold">R$ 500+ cada</strong> por apenas <strong className="text-cb-gold">R$ 97/mês</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Arsenal Completo",
                description: "200+ cursos dos maiores gurus em um só lugar",
                value: "R$ 50.000+ de valor"
              },
              {
                icon: DollarSign,
                title: "Preço Revolucionário",
                description: "R$ 97/mês vs. R$ 500+ por curso individual",
                value: "99%+ de economia"
              },
              {
                icon: Zap,
                title: "Atualizações Constantes",
                description: "Novos cursos adicionados semanalmente",
                value: "3-5 cursos/semana"
              },
              {
                icon: Users,
                title: "Comunidade VIP",
                description: "Network exclusivo de implementadores reais",
                value: "50.000+ membros"
              },
              {
                icon: Trophy,
                title: "Sem Mais Compras",
                description: "Acesso vitalício a tudo que for adicionado",
                value: "Para sempre"
              },
              {
                icon: Clock,
                title: "Acesso Imediato",
                description: "Comece sua vingança em menos de 2 minutos",
                value: "24/7 disponível"
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="card-premium p-6 text-center hover:scale-105 transition-transform"
                >
                  <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-cb-black" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold text-cb-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-cb-white/70 mb-3">
                    {feature.description}
                  </p>
                  <div className="text-cb-gold font-bold">
                    {feature.value}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-cb-gray-dark/50">
        <div className="container-cb">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-poppins font-bold text-cb-gold mb-6">
              FAÇA A CONTA 🧮
            </h2>
            
            <div className="bg-cb-black border border-cb-gold/30 rounded-lg p-8 mb-8">
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-cb-gray-medium pb-2">
                  <span className="text-cb-white/80">Curso Guru A (Marketing):</span>
                  <span className="text-cb-red-rage font-bold">R$ 497</span>
                </div>
                <div className="flex justify-between items-center border-b border-cb-gray-medium pb-2">
                  <span className="text-cb-white/80">Curso Guru B (Vendas):</span>
                  <span className="text-cb-red-rage font-bold">R$ 397</span>
                </div>
                <div className="flex justify-between items-center border-b border-cb-gray-medium pb-2">
                  <span className="text-cb-white/80">Curso Guru C (Design):</span>
                  <span className="text-cb-red-rage font-bold">R$ 297</span>
                </div>
                <div className="flex justify-between items-center border-b border-cb-gray-medium pb-2">
                  <span className="text-cb-white/80">+ 197 outros cursos:</span>
                  <span className="text-cb-red-rage font-bold">R$ 49.309</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-4">
                  <span className="text-cb-white">TOTAL SEPARADO:</span>
                  <span className="text-cb-red-rage">R$ 50.500</span>
                </div>
              </div>
            </div>

            <div className="text-6xl mb-4">⚡</div>
            
            <div className="bg-gradient-gold rounded-lg p-8 text-cb-black">
              <div className="text-3xl font-poppins font-black mb-2">
                CÓDIGO BILIONÁRIO
              </div>
              <div className="text-5xl font-poppins font-black mb-4">
                R$ 97/mês
              </div>
              <div className="text-xl font-bold">
                = TODOS OS 200+ CURSOS
              </div>
            </div>

            <div className="mt-8 p-6 bg-cb-gold/10 border border-cb-gold rounded-lg">
              <div className="text-2xl font-bold text-cb-gold mb-2">
                💰 ECONOMIA: R$ 50.403 (99,8%)
              </div>
              <p className="text-cb-white/80">
                Você economiza mais em <strong>1 mês</strong> do que a maioria ganha em <strong>1 ano</strong>!
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/register"
                className="btn-primary px-12 py-4 text-xl font-bold uppercase animate-pulse"
              >
                INICIAR VINGANÇA AGORA 🔥
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-16">
        <div className="container-cb">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-poppins font-bold text-cb-white mb-6">
              EX-TROUXAS DEPOEM 🎯
            </h2>
            <p className="text-xl text-cb-white/80">
              Veja quem já parou de enriquecer guru e começou a se enriquecer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Carlos M.",
                role: "Ex-vítima de 12 gurus",
                text: "Gastei R$ 8.500 em cursos separados. Em 2 meses no CB já recuperei o investimento aplicando apenas 1 estratégia.",
                savings: "R$ 8.403 economizados"
              },
              {
                name: "Marina S.",
                role: "Agência Digital",
                text: "Parei de ser trouxa e comecei a lucrar. Hoje faturo R$ 50k/mês usando conhecimento que antes custaria R$ 15k+.",
                savings: "1.500% ROI"
              },
              {
                name: "Pedro L.",
                role: "Afiliado",
                text: "Primeiro mês: quebrado. Segundo mês: R$ 12k. Terceiro mês: R$ 35k. A vingança nunca foi tão doce!",
                savings: "R$ 47k no trimestre"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="card-premium p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-cb-gold fill-current" />
                  ))}
                </div>
                <p className="text-cb-white/90 italic mb-4">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-cb-gold/20 pt-4">
                  <div className="font-bold text-cb-white">{testimonial.name}</div>
                  <div className="text-cb-white/60 text-sm mb-2">{testimonial.role}</div>
                  <div className="text-cb-gold font-bold text-sm">
                    💰 {testimonial.savings}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-cb-red-rage/20 to-cb-gold/20">
        <div className="container-cb text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-6xl font-poppins font-black text-cb-gold mb-6">
              SUA HORA É AGORA! ⚡
            </h2>
            <p className="text-xl text-cb-white/90 mb-8">
              Pare de ser <strong className="text-cb-red-rage">ATM de guru</strong> e comece a ser <strong className="text-cb-gold">CEO de você mesmo</strong>!
            </p>
            
            <div className="bg-cb-black/50 border border-cb-gold/30 rounded-lg p-6 mb-8">
              <div className="text-cb-gold font-bold text-lg mb-2">
                ⚠️ ATENÇÃO: Esta oferta pode sair do ar a qualquer momento
              </div>
              <p className="text-cb-white/70">
                Posso ser processado pelos gurus por expor este esquema. 
                <br />
                Garante sua vaga AGORA antes que seja tarde!
              </p>
            </div>

            <Link
              to="/register"
              className="btn-primary px-12 py-6 text-2xl font-bold uppercase mb-4 animate-bounce-gold"
            >
              COMEÇAR VINGANÇA POR R$ 97 🔥
            </Link>

            <p className="text-cb-white/60 text-sm">
              ✅ Acesso imediato • ✅ 7 dias de garantia • ✅ Cancele quando quiser
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing