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
  Sparkles,
  X
} from 'lucide-react'

// Components
import CourseCard from '../components/common/CourseCard'

// Mock de cursos - Em produção virá da API
const mockCourses = [
  {
    id: 1,
    title: 'Marketing Digital Avançado',
    instructor: 'Pedro Sobral',
    thumbnail: 'https://via.placeholder.com/400x225/1a1a1a/FFD700?text=Marketing+Digital',
    category: 'marketing',
    duration: '12h 30min',
    students: 15420,
    rating: 4.8,
    level: 'Avançado',
    modules: 24,
    featured: true
  },
  {
    id: 2,
    title: 'Python para Data Science',
    instructor: 'Ana Silva',
    thumbnail: 'https://via.placeholder.com/400x225/1a1a1a/FFD700?text=Python',
    category: 'programacao',
    duration: '18h 45min',
    students: 23150,
    rating: 4.9,
    level: 'Intermediário',
    modules: 32
  },
  {
    id: 3,
    title: 'Vendas no Instagram',
    instructor: 'Carlos Maia',
    thumbnail: 'https://via.placeholder.com/400x225/1a1a1a/FFD700?text=Instagram',
    category: 'vendas',
    duration: '8h 15min',
    students: 34820,
    rating: 4.7,
    level: 'Iniciante',
    modules: 18
  },
  {
    id: 4,
    title: 'Design UI/UX Profissional',
    instructor: 'Julia Costa',
    thumbnail: 'https://via.placeholder.com/400x225/1a1a1a/FFD700?text=UI+UX',
    category: 'design',
    duration: '16h 20min',
    students: 12340,
    rating: 4.9,
    level: 'Avançado',
    modules: 28
  },
  {
    id: 5,
    title: 'Copywriting que Vende',
    instructor: 'Rafael Oliveira',
    thumbnail: 'https://via.placeholder.com/400x225/1a1a1a/FFD700?text=Copywriting',
    category: 'marketing',
    duration: '10h 40min',
    students: 19870,
    rating: 4.8,
    level: 'Intermediário',
    modules: 20
  },
  {
    id: 6,
    title: 'Finanças Pessoais',
    instructor: 'Mariana Santos',
    thumbnail: 'https://via.placeholder.com/400x225/1a1a1a/FFD700?text=Financas',
    category: 'negocios',
    duration: '6h 30min',
    students: 45230,
    rating: 4.6,
    level: 'Iniciante',
    modules: 15
  },
  {
    id: 7,
    title: 'Mindset Milionário',
    instructor: 'Bruno Ferreira',
    thumbnail: 'https://via.placeholder.com/400x225/1a1a1a/FFD700?text=Mindset',
    category: 'desenvolvimento',
    duration: '5h 45min',
    students: 67890,
    rating: 4.5,
    level: 'Iniciante',
    modules: 12,
    featured: true
  },
  {
    id: 8,
    title: 'E-commerce do Zero',
    instructor: 'Fernanda Lima',
    thumbnail: 'https://via.placeholder.com/400x225/1a1a1a/FFD700?text=Ecommerce',
    category: 'negocios',
    duration: '14h 20min',
    students: 28450,
    rating: 4.8,
    level: 'Intermediário',
    modules: 26
  }
]

// Categorias disponíveis
const categories = [
  { id: 'all', name: 'Todos', icon: Sparkles, count: 247 },
  { id: 'marketing', name: 'Marketing', icon: Target, count: 45 },
  { id: 'programacao', name: 'Programação', icon: Code, count: 38 },
  { id: 'vendas', name: 'Vendas', icon: DollarSign, count: 52 },
  { id: 'design', name: 'Design', icon: Palette, count: 31 },
  { id: 'negocios', name: 'Negócios', icon: Briefcase, count: 42 },
  { id: 'desenvolvimento', name: 'Desenvolvimento Pessoal', icon: Brain, count: 39 }
]

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filteredCourses, setFilteredCourses] = useState(mockCourses)

  // Filtrar cursos baseado na categoria e busca
  useEffect(() => {
    let filtered = mockCourses

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCourses(filtered)
  }, [selectedCategory, searchTerm])

  // Course Card Component
  const CourseCard = ({ course }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group relative bg-gradient-to-br from-cb-gray-dark to-cb-black rounded-xl overflow-hidden border border-cb-gray-dark hover:border-cb-gold/30 transition-all duration-300"
    >
      <Link to={`/course/${course.id}`}>
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay com Play Button */}
          <div className="absolute inset-0 bg-gradient-to-t from-cb-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 bg-cb-gold rounded-full flex items-center justify-center shadow-lg shadow-cb-gold/30"
              >
                <Play className="w-8 h-8 text-cb-black ml-1" fill="currentColor" />
              </motion.div>
            </div>
          </div>

          {/* Badge Featured */}
          {course.featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-cb-gold to-cb-gold-dark px-3 py-1 rounded-full">
              <span className="text-cb-black text-xs font-bold">DESTAQUE</span>
            </div>
          )}

          {/* Duration */}
          <div className="absolute bottom-3 right-3 bg-cb-black/80 backdrop-blur px-2 py-1 rounded">
            <span className="text-cb-white text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-cb-white mb-1 line-clamp-2 group-hover:text-cb-gold transition-colors">
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-sm text-cb-gray-light mb-3">
            por {course.instructor}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-xs text-cb-gray-light">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-cb-gold" fill="currentColor" />
                {course.rating}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {course.students.toLocaleString('pt-BR')}
              </span>
            </div>
            <span className="text-xs font-medium text-cb-gold">
              {course.modules} módulos
            </span>
          </div>

          {/* Level Badge */}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${
              course.level === 'Iniciante' ? 'bg-green-500/20 text-green-400' :
              course.level === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {course.level}
            </span>
            
            {/* Arrow Icon */}
            <ChevronRight className="w-4 h-4 text-cb-gray-light group-hover:text-cb-gold transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  )

  return (
    <>
      <Helmet>
        <title>Biblioteca de Cursos - Código Bilionário</title>
        <meta name="description" content="Acesse mais de 200 cursos completos dos maiores especialistas do mercado" />
      </Helmet>

      <div className="min-h-screen pb-20">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-cb-black via-cb-gray-dark/20 to-cb-black pt-8 pb-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Title */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold font-poppins text-cb-gold mb-2">
                    Biblioteca Completa
                  </h1>
                  <p className="text-cb-gray-light text-lg">
                    <span className="text-cb-gold font-bold">247 cursos</span> no seu arsenal digital
                  </p>
                </div>
                
                {/* Filter Toggle Mobile */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden p-3 bg-cb-gray-dark rounded-lg border border-cb-gray-medium"
                >
                  <Filter className="w-5 h-5 text-cb-gold" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cb-gray-light" />
                <input
                  type="text"
                  placeholder="Buscar por curso ou instrutor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-cb-gray-dark border border-cb-gray-medium rounded-lg text-cb-white placeholder-cb-gray-light focus:border-cb-gold focus:outline-none focus:ring-2 focus:ring-cb-gold/20 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-cb-gray-light hover:text-cb-white" />
                  </button>
                )}
              </div>

              {/* Categories - Desktop */}
              <div className="hidden md:flex items-center justify-center gap-2 flex-wrap">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                        selectedCategory === category.id
                          ? 'bg-cb-gold text-cb-black border-cb-gold'
                          : 'bg-cb-gray-dark border-cb-gray-medium text-cb-gray-light hover:border-cb-gold/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm opacity-70">({category.count})</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setShowFilters(false)
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          selectedCategory === category.id
                            ? 'bg-cb-gold text-cb-black'
                            : 'bg-cb-gray-dark text-cb-gray-light'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium flex-1 text-left">{category.name}</span>
                        <span className="text-sm opacity-70">({category.count})</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Course Grid */}
        <div className="container mx-auto px-4 pt-8">
          {filteredCourses.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 text-cb-gray-medium mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cb-white mb-2">
                Nenhum curso encontrado
              </h3>
              <p className="text-cb-gray-light">
                Tente buscar por outros termos ou categorias
              </p>
            </motion.div>
          )}
        </div>

        {/* Load More Button */}
        {filteredCourses.length >= 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 mt-12 text-center"
          >
            <button className="px-8 py-3 bg-gradient-to-r from-cb-gold to-cb-gold-dark text-cb-black font-bold rounded-lg hover:shadow-lg hover:shadow-cb-gold/30 transition-all">
              Carregar Mais Cursos
            </button>
          </motion.div>
        )}
      </div>
    </>
  )
}

export default Courses