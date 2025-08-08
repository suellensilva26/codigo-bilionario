import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Star, 
  Users, 
  BookOpen, 
  Download,
  Share2,
  Heart,
  CheckCircle,
  Lock
} from 'lucide-react'
import ReactPlayer from 'react-player'
import { coursesService } from '../services/coursesService'
import useAuthStore from '../store/authStore'
import LoadingScreen from '../components/common/LoadingScreen'

const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user, canAccessContent } = useAuthStore()
  
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showPlayer, setShowPlayer] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const courseData = await coursesService.getCourseById(courseId)
      
      if (!courseData) {
        navigate('/courses')
        return
      }
      
      setCourse(courseData)
      
      // Set first video as current if user has access
      if (courseData.lessons && courseData.lessons.length > 0 && canAccessContent(courseData.level)) {
        setCurrentVideo(courseData.lessons[0])
      }
      
      // Load progress
      const userProgress = await coursesService.getCourseProgress(courseId)
      setProgress(userProgress?.percentage || 0)
      
    } catch (error) {
      console.error('Error loading course:', error)
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }

  const handleVideoSelect = (lesson) => {
    if (!canAccessContent(course.level)) {
      alert('Você precisa de uma assinatura premium para acessar este conteúdo!')
      return
    }
    
    setCurrentVideo(lesson)
    setShowPlayer(true)
  }

  const handleProgress = async (lessonId) => {
    try {
      await coursesService.markLessonComplete(courseId, lessonId)
      // Reload progress
      const userProgress = await coursesService.getCourseProgress(courseId)
      setProgress(userProgress?.percentage || 0)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  if (loading) {
    return <LoadingScreen message="Carregando curso..." />
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-cb-black text-cb-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
          <Link to="/courses" className="text-cb-gold hover:underline">
            Voltar aos cursos
          </Link>
        </div>
      </div>
    )
  }

  const hasAccess = canAccessContent(course.level)

  return (
    <>
      <Helmet>
        <title>{course.title} - Código Bilionário</title>
        <meta name="description" content={course.description} />
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
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-gray-300 mb-4">{course.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-cb-gold" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students} estudantes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons?.length || 0} aulas</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Progresso do Curso</span>
                      <span className="text-sm text-cb-gold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className="bg-cb-gold h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="lg:w-64">
                <div className="bg-cb-gray/50 rounded-lg p-6">
                  {!hasAccess ? (
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-cb-gold mx-auto mb-4" />
                      <h3 className="text-lg font-bold mb-2">Conteúdo Premium</h3>
                      <p className="text-gray-400 mb-4">
                        Upgrade sua assinatura para acessar este curso
                      </p>
                      <Link
                        to="/subscription"
                        className="w-full bg-cb-gold text-black py-3 px-4 rounded-lg font-bold hover:bg-cb-gold/90 transition-colors inline-block text-center"
                      >
                        Fazer Upgrade
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowPlayer(true)}
                        className="w-full bg-cb-gold text-black py-3 px-4 rounded-lg font-bold hover:bg-cb-gold/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Assistir Curso
                      </button>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button className="p-2 bg-cb-gray rounded-lg hover:bg-cb-gold/20 transition-colors">
                          <Download className="w-5 h-5 mx-auto" />
                        </button>
                        <button className="p-2 bg-cb-gray rounded-lg hover:bg-cb-gold/20 transition-colors">
                          <Share2 className="w-5 h-5 mx-auto" />
                        </button>
                        <button className="p-2 bg-cb-gray rounded-lg hover:bg-cb-gold/20 transition-colors">
                          <Heart className="w-5 h-5 mx-auto" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              {showPlayer && currentVideo && hasAccess ? (
                <div className="bg-black rounded-lg overflow-hidden mb-6">
                  <ReactPlayer
                    url={currentVideo.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
                    width="100%"
                    height="400px"
                    controls
                    playing={isPlaying}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => handleProgress(currentVideo.id)}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{currentVideo.title}</h3>
                    <p className="text-gray-400">{currentVideo.description}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-cb-gray rounded-lg p-8 text-center mb-6">
                  <Play className="w-16 h-16 text-cb-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    {hasAccess ? 'Selecione uma aula para começar' : 'Conteúdo Bloqueado'}
                  </h3>
                  <p className="text-gray-400">
                    {hasAccess 
                      ? 'Escolha uma aula na lista ao lado para começar a assistir'
                      : 'Faça upgrade para acessar este conteúdo premium'
                    }
                  </p>
                </div>
              )}

              {/* Course Description */}
              <div className="bg-cb-gray rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Sobre o Curso</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {course.longDescription || course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-cb-gold mb-2">Nível</h4>
                    <p className="text-gray-300 capitalize">{course.level}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-cb-gold mb-2">Categoria</h4>
                    <p className="text-gray-300">{course.category}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <div className="lg:col-span-1">
              <div className="bg-cb-gray rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Aulas do Curso</h2>
                
                {course.lessons && course.lessons.length > 0 ? (
                  <div className="space-y-3">
                    {course.lessons.map((lesson, index) => (
                      <motion.div
                        key={lesson.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          currentVideo?.id === lesson.id
                            ? 'bg-cb-gold/20 border border-cb-gold'
                            : 'bg-cb-black hover:bg-cb-gold/10'
                        } ${!hasAccess ? 'opacity-50' : ''}`}
                        onClick={() => handleVideoSelect(lesson)}
                        whileHover={{ scale: hasAccess ? 1.02 : 1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            currentVideo?.id === lesson.id
                              ? 'bg-cb-gold text-black'
                              : 'bg-cb-gray text-gray-400'
                          }`}>
                            {hasAccess ? (
                              lesson.completed ? <CheckCircle className="w-4 h-4" /> : index + 1
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{lesson.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.duration || '10:00'}</span>
                            </div>
                          </div>
                          
                          {currentVideo?.id === lesson.id && (
                            <Play className="w-4 h-4 text-cb-gold" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhuma aula disponível ainda</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetail