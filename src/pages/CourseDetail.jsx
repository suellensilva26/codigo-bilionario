import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  Lock,
  BookOpen,
  Award,
  Download,
  Share2,
  Heart,
  MessageCircle,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw,
  Loader
} from 'lucide-react'
import ReactPlayer from 'react-player'
import toast from 'react-hot-toast'

// Services
import { coursesService, MOCK_COURSES } from '../services/coursesService'
import useAuthStore from '../store/authStore'
import { SubscriptionGuard } from '../components/auth/ProtectedRoute'

// Mock de curso - Em produção virá da API
const mockCourse = {
  id: 1,
  title: 'Marketing Digital Avançado',
  instructor: 'Pedro Sobral',
  instructorAvatar: 'https://via.placeholder.com/60x60/FFD700/000?text=PS',
  thumbnail: 'https://via.placeholder.com/800x450/1a1a1a/FFD700?text=Marketing+Digital',
  category: 'marketing',
  duration: '12h 30min',
  students: 15420,
  rating: 4.8,
  level: 'Avançado',
  description: 'Domine as estratégias mais avançadas de marketing digital e transforme sua carreira. Aprenda com cases reais e técnicas que realmente funcionam no mercado atual.',
  whatYouWillLearn: [
    'Estratégias avançadas de tráfego pago',
    'Funis de conversão de alta performance',
    'Copy persuasiva que vende',
    'Automação de marketing',
    'Analytics e métricas que importam',
    'Growth hacking para escalar negócios'
  ],
  modules: [
    {
      id: 1,
      title: 'Fundamentos do Marketing Digital',
      lessons: [
        { id: 1, title: 'Introdução ao Marketing Digital', duration: '15:30', completed: true, videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
        { id: 2, title: 'Mindset do Marketeiro Digital', duration: '22:15', completed: true, videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
        { id: 3, title: 'Ferramentas Essenciais', duration: '18:45', completed: false, videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' }
      ]
    },
    {
      id: 2,
      title: 'Tráfego Pago Avançado',
      lessons: [
        { id: 4, title: 'Facebook Ads Mastery', duration: '35:20', completed: false, videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
        { id: 5, title: 'Google Ads Profissional', duration: '28:10', completed: false, videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
        { id: 6, title: 'Instagram Ads que Convertem', duration: '24:35', completed: false, videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' }
      ]
    },
    {
      id: 3,
      title: 'Funis de Conversão',
      lessons: [
        { id: 7, title: 'Anatomia de um Funil Perfeito', duration: '26:40', completed: false, videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
        { id: 8, title: 'Landing Pages de Alta Conversão', duration: '31:15', completed: false, videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
        { id: 9, title: 'Email Marketing Avançado', duration: '29:25', completed: false, videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' }
      ]
    }
  ]
}

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeModule, setActiveModule] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Em produção, buscar curso da API baseado no ID
    setCourse(mockCourse)
    // Definir primeira aula como atual
    if (mockCourse.modules[0]?.lessons[0]) {
      setCurrentLesson(mockCourse.modules[0].lessons[0])
    }
  }, [id])

  useEffect(() => {
    // Calcular progresso do curso
    if (course) {
      const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
      const completedLessons = course.modules.reduce((acc, module) => 
        acc + module.lessons.filter(lesson => lesson.completed).length, 0
      )
      setProgress(Math.round((completedLessons / totalLessons) * 100))
    }
  }, [course])

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson)
    setIsPlaying(true)
  }

  const markLessonComplete = (lessonId) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        )
      }))
    }))
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cb-gold"></div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{course.title} - Código Bilionário</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="bg-cb-gray-dark border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center text-gray-400 hover:text-cb-gold transition-colors mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Voltar aos Cursos
            </button>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">{course.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <img 
                      src={course.instructorAvatar} 
                      alt={course.instructor}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    {course.instructor}
                  </div>
                  <div className="flex items-center">
                    <Star size={16} className="text-cb-gold mr-1" />
                    {course.rating}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {course.students.toLocaleString()} alunos
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {course.duration}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 lg:mt-0">
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Seu Progresso</div>
                    <div className="text-lg font-bold text-cb-gold">{progress}%</div>
                  </div>
                  <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cb-gold to-yellow-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-cb-gray-dark rounded-xl overflow-hidden">
                {currentLesson ? (
                  <div className="aspect-video">
                    <ReactPlayer
                      url={currentLesson.videoUrl}
                      width="100%"
                      height="100%"
                      controls
                      playing={isPlaying}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => markLessonComplete(currentLesson.id)}
                      config={{
                        file: {
                          attributes: {
                            controlsList: 'nodownload'
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <Play size={64} className="text-cb-gold mx-auto mb-4" />
                      <p className="text-gray-400">Selecione uma aula para começar</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Lesson Info */}
              {currentLesson && (
                <div className="mt-6 bg-cb-gray-dark rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-2">{currentLesson.title}</h2>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock size={16} className="mr-1" />
                        {currentLesson.duration}
                        {currentLesson.completed && (
                          <>
                            <CheckCircle size={16} className="text-green-500 ml-4 mr-1" />
                            Concluída
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <Heart size={20} className="text-gray-400 hover:text-red-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <Share2 size={20} className="text-gray-400 hover:text-cb-gold" />
                      </button>
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <Download size={20} className="text-gray-400 hover:text-cb-gold" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Description */}
              <div className="mt-6 bg-cb-gray-dark rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Sobre este curso</h3>
                <p className="text-gray-300 mb-6">{course.description}</p>
                
                <h4 className="font-semibold mb-3">O que você vai aprender:</h4>
                <ul className="space-y-2">
                  {course.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={16} className="text-cb-gold mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Course Content */}
            <div className="lg:col-span-1">
              <div className="bg-cb-gray-dark rounded-xl p-6 sticky top-8">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <BookOpen size={20} className="mr-2 text-cb-gold" />
                  Conteúdo do Curso
                </h3>
                
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border border-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setActiveModule(activeModule === moduleIndex ? -1 : moduleIndex)}
                        className="w-full p-4 text-left hover:bg-gray-800 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-semibold mb-1">{module.title}</h4>
                          <p className="text-sm text-gray-400">
                            {module.lessons.length} aulas • {module.lessons.filter(l => l.completed).length} concluídas
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: activeModule === moduleIndex ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowLeft size={16} className="rotate-90" />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {activeModule === moduleIndex && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="border-t border-gray-800">
                              {module.lessons.map((lesson) => (
                                <button
                                  key={lesson.id}
                                  onClick={() => handleLessonSelect(lesson)}
                                  className={`w-full p-3 text-left hover:bg-gray-800 transition-colors flex items-center justify-between border-b border-gray-800 last:border-b-0 ${
                                    currentLesson?.id === lesson.id ? 'bg-cb-gold/10 border-cb-gold/20' : ''
                                  }`}
                                >
                                  <div className="flex items-center">
                                    {lesson.completed ? (
                                      <CheckCircle size={16} className="text-green-500 mr-3" />
                                    ) : (
                                      <Play size={16} className="text-gray-400 mr-3" />
                                    )}
                                    <div>
                                      <p className="text-sm font-medium">{lesson.title}</p>
                                      <p className="text-xs text-gray-400">{lesson.duration}</p>
                                    </div>
                                  </div>
                                  
                                  {currentLesson?.id === lesson.id && (
                                    <div className="w-2 h-2 bg-cb-gold rounded-full"></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Course Actions */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <button className="w-full bg-cb-gold text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center mb-3">
                    <Award size={20} className="mr-2" />
                    Certificado de Conclusão
                  </button>
                  
                  <button className="w-full bg-gray-800 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center">
                    <MessageCircle size={20} className="mr-2" />
                    Dúvidas e Suporte
                  </button>
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