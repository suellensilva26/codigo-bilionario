import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Play, Clock, Star, Users } from 'lucide-react'

// COMPONENTE NUCLEAR - SEM DEPENDÊNCIAS EXTERNAS, SEM VARIÁVEIS DINÂMICAS
const CourseDetail = () => {
  const navigate = useNavigate()
  
  // DADOS COMPLETAMENTE ESTÁTICOS - IMPOSSÍVEL DAR ERRO
  console.log('🎯 CourseDetail carregado - VERSÃO NUCLEAR 5.1.0')

  return (
    <>
      <Helmet>
        <title>Marketing Digital Avançado - Código Bilionário</title>
        <meta name="description" content="Curso de Marketing Digital do Código Bilionário" />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="bg-gray-900 border-b border-yellow-500/20">
          <div className="container mx-auto px-6 py-4">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center text-yellow-500 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar aos Cursos
            </button>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Course Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                    alt="Marketing Digital Avançado"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h1 className="text-3xl font-bold mb-2 text-white">Marketing Digital Avançado</h1>
                    <p className="text-gray-300 mb-4">Domine as estratégias de marketing digital que realmente funcionam</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>4.8</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>8h 30m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>15.420 estudantes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lg:w-64">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="space-y-4">
                    <button className="w-full bg-yellow-500 text-black py-3 px-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                      <Play className="w-5 h-5" />
                      Assistir Curso
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player Area */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg p-8 text-center mb-6">
                <Play className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Player de Vídeo</h3>
                <p className="text-gray-400">
                  Em breve você poderá assistir às aulas deste curso aqui!
                </p>
              </div>

              {/* Course Description */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Sobre o Curso</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Domine as estratégias de marketing digital que realmente funcionam no mercado atual. 
                  Aprenda técnicas avançadas para gerar leads, converter vendas e escalar seu negócio online.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-yellow-500 mb-2">Nível</h4>
                    <p className="text-gray-300">Intermediário</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-500 mb-2">Categoria</h4>
                    <p className="text-gray-300">Marketing Digital</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-white">Aulas do Curso</h2>
                
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-black hover:bg-yellow-500/10 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1 text-white">Introdução ao Marketing Digital</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>15:30</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-black hover:bg-yellow-500/10 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1 text-white">Estratégias de Tráfego Pago</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>22:15</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-black hover:bg-yellow-500/10 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1 text-white">Copywriting Persuasivo</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>18:45</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-black hover:bg-yellow-500/10 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1 text-white">Funis de Conversão</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>25:10</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-black hover:bg-yellow-500/10 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center text-sm font-bold">
                        5
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1 text-white">Analytics e Métricas</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>19:30</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetail