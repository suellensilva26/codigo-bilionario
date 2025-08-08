import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Play,
  TrendingUp,
  Code,
  DollarSign,
  Palette,
  Target,
  Briefcase,
  Heart,
  Brain,
  ChevronRight,
  ArrowRight,
  Sparkles,
  X,
  BookOpen,
  Award,
  Zap,
  Grid,
  List
} from 'lucide-react'

// Components
import CourseCard from '../components/common/CourseCard'
import LoadingScreen from '../components/common/LoadingScreen'

// Services
import { coursesService, MOCK_COURSES } from '../services/coursesService'
import useAuthStore from '../store/authStore'

// 📚 COURSES PAGE - CÓDIGO BILIONÁRIO
const Courses = () => {
  const { user, hasActiveSubscription } = useAuthStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load courses and categories
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // For demo mode, use mock data
        const isDemoMode = window.location.hostname !== 'localhost'
        
        if (isDemoMode) {
          // Use mock data for demo
          setCourses(MOCK_COURSES)
          setCategories([
            { id: 'all', name: 'Todos os Cursos', icon: '📚', count: MOCK_COURSES.length },
            { id: 'marketing', name: 'Marketing Digital', icon: '📱', count: 1 },
            { id: 'copywriting', name: 'Copywriting', icon: '✍️', count: 1 },
            { id: 'sales', name: 'Vendas', icon: '💼', count: 1 }
          ])
        } else {
          // Load real data from Firebase
          const [coursesResult, categoriesResult] = await Promise.all([
            coursesService.getCourses(),
            coursesService.getCategories()
          ])
          
          if (coursesResult.success) {
            setCourses(coursesResult.courses.length > 0 ? coursesResult.courses : MOCK_COURSES)
          } else {
            setCourses(MOCK_COURSES) // Fallback to mock data
          }
          
          if (categoriesResult.success) {
            setCategories([
              { id: 'all', name: 'Todos os Cursos', icon: '📚', count: coursesResult.courses?.length || MOCK_COURSES.length },
              ...categoriesResult.categories
            ])
          }
        }
      } catch (err) {
        console.error('Error loading courses:', err)
        setError('Erro ao carregar cursos')
        setCourses(MOCK_COURSES) // Fallback to mock data
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter and sort courses
  useEffect(() => {
    let filtered = [...courses]

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.instructor.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.students || 0) - (a.students || 0))
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      default:
        break
    }

    setFilteredCourses(filtered)
  }, [courses, selectedCategory, selectedLevel, searchTerm, sortBy])

  // Handle search
  const handleSearch = async (term) => {
    setSearchTerm(term)
    
    if (term.length > 2) {
      setIsLoading(true)
      const result = await coursesService.searchCourses(term)
      if (result.success) {
        setCourses(result.courses)
      }
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen message="Carregando cursos..." />
  }

  return (
    <>
      <Helmet>
        <title>Cursos - Código Bilionário | 200+ Cursos Digitais</title>
        <meta name="description" content="Acesse mais de 200 cursos digitais por R$ 97/mês. Marketing Digital, Copywriting, Vendas e muito mais!" />
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-cb-gray-dark to-black border-b border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-cb-gold/5 to-transparent" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center space-x-2 text-cb-gold mb-4">
                <BookOpen className="w-6 h-6" />
                <span className="font-semibold">BIBLIOTECA DIGITAL</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Catálogo de Cursos
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Mais de <strong className="text-cb-gold">200 cursos</strong> dos principais especialistas 
                em marketing digital, vendas e empreendedorismo
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar cursos, instrutores ou temas..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-gray-700 rounded-xl bg-cb-gray-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cb-gold focus:border-transparent text-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-80 flex-shrink-0"
            >
              <div className="bg-cb-gray-dark rounded-xl p-6 border border-gray-800 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Filtros</h3>
                  <button
                    onClick={() => {
                      setSelectedCategory('all')
                      setSelectedLevel('all')
                      setSearchTerm('')
                    }}
                    className="text-cb-gold hover:text-yellow-400 text-sm transition-colors"
                  >
                    Limpar
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-4">Categorias</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-cb-gold text-black'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm opacity-75">{category.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-4">Nível</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'all', name: 'Todos os Níveis' },
                      { id: 'Iniciante', name: 'Iniciante' },
                      { id: 'Intermediário', name: 'Intermediário' },
                      { id: 'Avançado', name: 'Avançado' }
                    ].map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedLevel === level.id
                            ? 'bg-cb-gold text-black'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h4 className="text-white font-medium mb-4">Ordenar por</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cb-gold"
                  >
                    <option value="popular">Mais Populares</option>
                    <option value="rating">Melhor Avaliados</option>
                    <option value="newest">Mais Recentes</option>
                    <option value="price-low">Menor Preço</option>
                    <option value="price-high">Maior Preço</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
                  </h2>
                  {searchTerm && (
                    <p className="text-gray-400 mt-1">
                      Resultados para "{searchTerm}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' ? 'bg-cb-gold text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' ? 'bg-cb-gold text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-cb-gold text-black rounded-lg font-medium"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filtros</span>
                  </button>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
                  <p className="text-red-400 text-center">{error}</p>
                </div>
              )}

              {/* Empty State */}
              {filteredCourses.length === 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Nenhum curso encontrado
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Tente ajustar os filtros ou buscar por outros termos
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                      setSelectedLevel('all')
                    }}
                    className="bg-cb-gold hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Ver Todos os Cursos
                  </button>
                </motion.div>
              )}

              {/* Courses Grid/List */}
              {filteredCourses.length > 0 && (
                <motion.div
                  layout
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-6'
                  }
                >
                  <AnimatePresence>
                    {filteredCourses.map((course) => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        viewMode={viewMode}
                        hasAccess={hasActiveSubscription()}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Load More Button */}
              {filteredCourses.length > 0 && filteredCourses.length >= 20 && (
                <div className="text-center mt-12">
                  <button className="bg-cb-gold hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg transition-colors">
                    Carregar Mais Cursos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!hasActiveSubscription() && (
          <div className="bg-gradient-to-r from-cb-gold/10 to-transparent border-t border-gray-800 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-cb-gold rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-black" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  Acesse TODOS os Cursos
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Por apenas <strong className="text-cb-gold">R$ 97/mês</strong>, tenha acesso completo 
                  a mais de 200 cursos digitais dos principais especialistas
                </p>
                
                <Link
                  to="/subscription"
                  className="inline-flex items-center space-x-2 bg-cb-gold hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-lg transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  <span>COMEÇAR AGORA</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Courses