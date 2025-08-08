import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Play, Clock, Star, Users } from 'lucide-react'

const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  
  // DADOS DIRETOS - SEM USESTATE, SEM USEEFFECT, SEM PROBLEMAS
  const courses = {
    '1': {
      id: '1',
      title: 'Marketing Digital Avançado',
      description: 'Domine as estratégias de marketing digital que realmente funcionam',
      category: 'Marketing Digital',
      level: 'intermediário',
      rating: 4.8,
      students: 15420,
      duration: '8h 30m',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      instructor: 'Carlos Mendes'
    },
    '2': {
      id: '2',
      title: 'Desenvolvimento Pessoal Premium',
      description: 'Transforme sua mentalidade e alcance seus objetivos',
      category: 'Desenvolvimento Pessoal',
      level: 'iniciante',
      rating: 4.9,
      students: 8760,
      duration: '6h 15m',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      instructor: 'Ana Silva'
    },
    '3': {
      id: '3',
      title: 'Investimentos e Finanças',
      description: 'Aprenda a investir seu dinheiro de forma inteligente',
      category: 'Finanças',
      level: 'avançado',
      rating: 4.7,
      students: 12340,
      duration: '12h 45m',
      thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
      instructor: 'Roberto Santos'
    }
  }

  const course = courses[courseId] || courses['1'] // FALLBACK GARANTIDO
  
  console.log('🎯 CourseDetail - courseId:', courseId, 'course:', course?.title)

  // SEM LOADING, SEM VERIFICAÇÕES COMPLEXAS - DIRETO AO PONTO

  return (
    <>
      <Helmet>
        <title>Marketing Digital Avançado - Código Bilionário</title>
        <meta name="description" content="Curso de Marketing Digital do Código Bilionário" />
      </Helmet>

      <div className="min-h-screen bg-cb-black text-cb-white">
        {/* Header */}
        <div className="bg-cb-gray border-b border-cb-gold/20">
          <div className="container mx-auto px-6 py-4">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center text-cb-gold hover:text-white transition-colors mb-4"
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
                    <h1 className="text-3xl font-bold mb-2">Marketing Digital Avançado</h1>
                    <p className="text-gray-300 mb-4">Domine as estratégias de marketing digital que realmente funcionam</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-cb-gold" />
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
                <div className="bg-cb-gray/50 rounded-lg p-6">
                  <div className="space-y-4">
                    <button className="w-full bg-cb-gold text-black py-3 px-4 rounded-lg font-bold hover:bg-cb-gold/90 transition-colors flex items-center justify-center gap-2">
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
              <div className="bg-cb-gray rounded-lg p-8 text-center mb-6">
                <Play className="w-16 h-16 text-cb-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Player de Vídeo</h3>
                <p className="text-gray-400">
                  Em breve você poderá assistir às aulas deste curso aqui!
                </p>
              </div>

              {/* Course Description */}
              <div className="bg-cb-gray rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Sobre o Curso</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Domine as estratégias de marketing digital que realmente funcionam no mercado atual.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-cb-gold mb-2">Nível</h4>
                    <p className="text-gray-300">Intermediário</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-cb-gold mb-2">Categoria</h4>
                    <p className="text-gray-300">Marketing Digital</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <div className="lg:col-span-1">
              <div className="bg-cb-gray rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Aulas do Curso</h2>
                
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((lesson) => (
                    <div
                      key={lesson}
                      className="p-4 rounded-lg bg-cb-black hover:bg-cb-gold/10 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cb-gray text-gray-400 flex items-center justify-center text-sm font-bold">
                          {lesson}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">Aula {lesson}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>15:30</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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