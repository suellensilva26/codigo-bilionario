import { db } from '../lib/firebase'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore'
import { analyticsService } from '../lib/firebase'
import toast from 'react-hot-toast'

// 🎭 DEMO MODE CHECK
const IS_DEMO_MODE = true // Forçando demo sempre

// 📚 COURSES SERVICE - CÓDIGO BILIONÁRIO
export const coursesService = {
  // Get course by ID
  async getCourseById(courseId) {
    if (IS_DEMO_MODE) {
      // Return mock course data
      const mockCourse = MOCK_COURSES.find(course => course.id === courseId)
      if (!mockCourse) return null
      
      return {
        ...mockCourse,
        lessons: [
          {
            id: '1',
            title: 'Introdução ao Curso',
            description: 'Bem-vindo ao curso! Nesta aula vamos conhecer o que você vai aprender.',
            duration: '15:30',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            completed: false
          },
          {
            id: '2',
            title: 'Conceitos Fundamentais',
            description: 'Vamos entender os conceitos básicos que você precisa saber.',
            duration: '22:15',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            completed: false
          },
          {
            id: '3',
            title: 'Prática Guiada',
            description: 'Hora de colocar a mão na massa com exercícios práticos.',
            duration: '35:45',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            completed: false
          }
        ],
        longDescription: `Este é um curso completo sobre ${mockCourse.title}. 
        
        Você vai aprender desde os conceitos básicos até técnicas avançadas que vão te ajudar a dominar completamente este assunto.
        
        O curso é totalmente prático, com exemplos reais e exercícios que você pode aplicar imediatamente no seu dia a dia.`
      }
    }
    
    try {
      const docRef = doc(db, 'courses', courseId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting course:', error)
      return null
    }
  },

  // Get course progress
  async getCourseProgress(courseId) {
    if (IS_DEMO_MODE) {
      // Return mock progress
      return {
        courseId,
        percentage: Math.floor(Math.random() * 100),
        completedLessons: [],
        lastWatched: new Date().toISOString()
      }
    }
    
    // Firebase implementation would go here
    return { percentage: 0, completedLessons: [] }
  },

  // Mark lesson as complete
  async markLessonComplete(courseId, lessonId) {
    if (IS_DEMO_MODE) {
      console.log(`✅ Aula ${lessonId} do curso ${courseId} marcada como completa (demo)`)
      return true
    }
    
    // Firebase implementation would go here
    return true
  },

  // Get all courses with filters
  async getCourses({ category = null, search = '', level = null, limit: queryLimit = 50 } = {}) {
    try {
      let coursesQuery = collection(db, 'courses')
      
      // Apply filters
      const conditions = []
      if (category) conditions.push(where('category', '==', category))
      if (level) conditions.push(where('level', '==', level))
      
      if (conditions.length > 0) {
        coursesQuery = query(coursesQuery, ...conditions)
      }
      
      // Add ordering and limit
      coursesQuery = query(
        coursesQuery, 
        orderBy('createdAt', 'desc'), 
        limit(queryLimit)
      )
      
      const snapshot = await getDocs(coursesQuery)
      let courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Client-side search filter (for better UX)
      if (search) {
        const searchLower = search.toLowerCase()
        courses = courses.filter(course => 
          course.title.toLowerCase().includes(searchLower) ||
          course.instructor.toLowerCase().includes(searchLower) ||
          course.description?.toLowerCase().includes(searchLower)
        )
      }
      
      return { success: true, courses }
    } catch (error) {
      console.error('❌ Get Courses Error:', error)
      return { success: false, error: error.message, courses: [] }
    }
  },

  // Get course by ID
  async getCourseById(courseId) {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId))
      
      if (!courseDoc.exists()) {
        return { success: false, error: 'Curso não encontrado' }
      }
      
      const course = { id: courseDoc.id, ...courseDoc.data() }
      
      // Track course view
      analyticsService.trackCourseEvent('view', courseId, course.title)
      
      return { success: true, course }
    } catch (error) {
      console.error('❌ Get Course Error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get user's course progress
  async getUserProgress(userId, courseId) {
    try {
      const progressDoc = await getDoc(doc(db, 'userProgress', `${userId}_${courseId}`))
      
      if (!progressDoc.exists()) {
        return {
          success: true,
          progress: {
            courseId,
            userId,
            completedLessons: [],
            currentLesson: 0,
            progressPercentage: 0,
            totalWatchTime: 0,
            lastWatched: null,
            isCompleted: false,
            certificateIssued: false
          }
        }
      }
      
      return { success: true, progress: progressDoc.data() }
    } catch (error) {
      console.error('❌ Get Progress Error:', error)
      return { success: false, error: error.message }
    }
  },

  // Update user progress
  async updateProgress(userId, courseId, progressData) {
    try {
      const progressRef = doc(db, 'userProgress', `${userId}_${courseId}`)
      
      const updateData = {
        ...progressData,
        userId,
        courseId,
        updatedAt: serverTimestamp()
      }
      
      await setDoc(progressRef, updateData, { merge: true })
      
      // Track progress update
      analyticsService.trackCourseEvent('progress_update', courseId, '', {
        progress_percentage: progressData.progressPercentage
      })
      
      return { success: true }
    } catch (error) {
      console.error('❌ Update Progress Error:', error)
      return { success: false, error: error.message }
    }
  },

  // Mark lesson as completed
  async markLessonCompleted(userId, courseId, lessonId, watchTime = 0) {
    try {
      const { success, progress } = await this.getUserProgress(userId, courseId)
      
      if (!success) {
        throw new Error('Erro ao buscar progresso do usuário')
      }
      
      // Add lesson to completed if not already there
      const completedLessons = progress.completedLessons || []
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId)
      }
      
      // Get course to calculate progress
      const courseResult = await this.getCourseById(courseId)
      if (!courseResult.success) {
        throw new Error('Curso não encontrado')
      }
      
      const course = courseResult.course
      const totalLessons = course.lessons?.length || 1
      const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100)
      
      const updateData = {
        completedLessons,
        progressPercentage,
        totalWatchTime: (progress.totalWatchTime || 0) + watchTime,
        lastWatched: serverTimestamp(),
        isCompleted: progressPercentage === 100,
        updatedAt: serverTimestamp()
      }
      
      // Issue certificate if course is completed
      if (updateData.isCompleted && !progress.certificateIssued) {
        updateData.certificateIssued = true
        updateData.certificateIssuedAt = serverTimestamp()
        
        toast.success('🎉 Parabéns! Curso concluído! Certificado disponível!')
        
        // Track course completion
        analyticsService.trackCourseEvent('complete', courseId, course.title)
      }
      
      await this.updateProgress(userId, courseId, updateData)
      
      return { success: true, progress: updateData }
    } catch (error) {
      console.error('❌ Mark Lesson Completed Error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get user's enrolled courses
  async getEnrolledCourses(userId) {
    try {
      const progressQuery = query(
        collection(db, 'userProgress'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      )
      
      const snapshot = await getDocs(progressQuery)
      const enrolledCourses = []
      
      for (const doc of snapshot.docs) {
        const progress = doc.data()
        
        // Get course details
        const courseResult = await this.getCourseById(progress.courseId)
        if (courseResult.success) {
          enrolledCourses.push({
            ...courseResult.course,
            progress
          })
        }
      }
      
      return { success: true, courses: enrolledCourses }
    } catch (error) {
      console.error('❌ Get Enrolled Courses Error:', error)
      return { success: false, error: error.message, courses: [] }
    }
  },

  // Search courses
  async searchCourses(searchTerm, options = {}) {
    try {
      // For now, get all courses and filter client-side
      // In production, you'd use Algolia or similar for better search
      const result = await this.getCourses({ ...options, limit: 100 })
      
      if (!result.success) {
        return result
      }
      
      const searchLower = searchTerm.toLowerCase()
      const filteredCourses = result.courses.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.instructor.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower) ||
        course.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
      
      // Track search
      analyticsService.trackEvent('search', {
        search_term: searchTerm,
        results_count: filteredCourses.length
      })
      
      return { success: true, courses: filteredCourses }
    } catch (error) {
      console.error('❌ Search Courses Error:', error)
      return { success: false, error: error.message, courses: [] }
    }
  },

  // Get course categories
  async getCategories() {
    try {
      // For now, return static categories
      // In production, you'd get this from Firestore
      const categories = [
        {
          id: 'marketing',
          name: 'Marketing Digital',
          icon: '📱',
          count: 45,
          color: '#3B82F6'
        },
        {
          id: 'copywriting',
          name: 'Copywriting',
          icon: '✍️',
          count: 32,
          color: '#10B981'
        },
        {
          id: 'sales',
          name: 'Vendas',
          icon: '💼',
          count: 28,
          color: '#F59E0B'
        },
        {
          id: 'development',
          name: 'Desenvolvimento Pessoal',
          icon: '🧠',
          count: 38,
          color: '#8B5CF6'
        },
        {
          id: 'business',
          name: 'Negócios',
          icon: '🏢',
          count: 25,
          color: '#EF4444'
        },
        {
          id: 'design',
          name: 'Design',
          icon: '🎨',
          count: 22,
          color: '#EC4899'
        }
      ]
      
      return { success: true, categories }
    } catch (error) {
      console.error('❌ Get Categories Error:', error)
      return { success: false, error: error.message, categories: [] }
    }
  },

  // Get featured courses
  async getFeaturedCourses(limit = 6) {
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('featured', '==', true),
        orderBy('rating', 'desc'),
        orderBy('students', 'desc'),
        limit(limit)
      )
      
      const snapshot = await getDocs(coursesQuery)
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return { success: true, courses }
    } catch (error) {
      console.error('❌ Get Featured Courses Error:', error)
      // Fallback to regular courses if featured query fails
      return await this.getCourses({ limit })
    }
  },

  // Rate course
  async rateCourse(userId, courseId, rating, review = '') {
    try {
      const ratingRef = doc(db, 'courseRatings', `${userId}_${courseId}`)
      
      await setDoc(ratingRef, {
        userId,
        courseId,
        rating,
        review,
        createdAt: serverTimestamp()
      }, { merge: true })
      
      // Track rating
      analyticsService.trackCourseEvent('rate', courseId, '', { rating })
      
      toast.success('Avaliação enviada com sucesso!')
      return { success: true }
    } catch (error) {
      console.error('❌ Rate Course Error:', error)
      toast.error('Erro ao enviar avaliação')
      return { success: false, error: error.message }
    }
  }
}

// 📊 MOCK DATA for development
export const MOCK_COURSES = [
  {
    id: '1',
    title: 'Marketing Digital Avançado',
    instructor: 'Pedro Sobral',
    instructorAvatar: 'https://ui-avatars.com/api/?name=Pedro+Sobral&background=FFD700&color=000000&size=150',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&crop=center',
    category: 'marketing',
    duration: '12h 30min',
    students: 15420,
    rating: 4.8,
    level: 'Avançado',
    price: 497,
    originalPrice: 997,
    featured: true,
    description: 'Domine as estratégias mais avançadas de marketing digital e multiplique seus resultados online.',
    whatYouWillLearn: [
      'Estratégias de tráfego pago no Google e Facebook',
      'Funis de vendas de alta conversão',
      'Email marketing que vende no automático',
      'Growth hacking para escalar negócios',
      'Analytics e métricas que importam'
    ],
    lessons: [
      {
        id: 1,
        title: 'Introdução ao Marketing Digital',
        duration: '45min',
        type: 'video',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        description: 'Fundamentos essenciais do marketing digital moderno',
        free: true
      },
      {
        id: 2,
        title: 'Estratégias de Tráfego Pago',
        duration: '1h 20min',
        type: 'video',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        description: 'Como criar campanhas que convertem',
        resources: ['Planilha de Campanhas', 'Checklist de Otimização']
      },
      {
        id: 3,
        title: 'Funis de Vendas Profissionais',
        duration: '2h 15min',
        type: 'video',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        description: 'Construindo funis que vendem 24/7'
      }
    ],
    tags: ['marketing', 'tráfego pago', 'funis', 'vendas'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Copywriting Milionário',
    instructor: 'Ana Silva',
    instructorAvatar: 'https://ui-avatars.com/api/?name=Ana+Silva&background=FFD700&color=000000&size=150',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=450&fit=crop&crop=center',
    category: 'copywriting',
    duration: '8h 45min',
    students: 12350,
    rating: 4.9,
    level: 'Intermediário',
    price: 397,
    originalPrice: 697,
    featured: true,
    description: 'Aprenda a escrever textos que vendem e multiplique suas conversões.',
    whatYouWillLearn: [
      'Fórmulas de copy que convertem',
      'Gatilhos mentais poderosos',
      'Headlines que capturam atenção',
      'Storytelling para vendas',
      'Copy para diferentes plataformas'
    ],
    lessons: [
      {
        id: 1,
        title: 'Fundamentos do Copywriting',
        duration: '30min',
        type: 'video',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        free: true
      },
      {
        id: 2,
        title: 'Gatilhos Mentais',
        duration: '45min',
        type: 'video',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
      }
    ],
    tags: ['copywriting', 'vendas', 'persuasão'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: 'Vendas de Alto Impacto',
    instructor: 'Carlos Santos',
    instructorAvatar: 'https://ui-avatars.com/api/?name=Carlos+Santos&background=FFD700&color=000000&size=150',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&crop=center',
    category: 'sales',
    duration: '10h 15min',
    students: 8920,
    rating: 4.7,
    level: 'Avançado',
    price: 597,
    originalPrice: 1197,
    featured: false,
    description: 'Técnicas avançadas de vendas para fechar mais negócios.',
    whatYouWillLearn: [
      'Técnicas de fechamento',
      'Objeções e como superá-las',
      'Vendas consultivas',
      'Negociação avançada',
      'CRM e follow-up'
    ],
    lessons: [
      {
        id: 1,
        title: 'Introdução às Vendas',
        duration: '40min',
        type: 'video',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        free: true
      }
    ],
    tags: ['vendas', 'negociação', 'fechamento'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15')
  }
]

export default coursesService