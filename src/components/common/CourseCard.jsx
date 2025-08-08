import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Clock, Users, Play, Sparkles } from 'lucide-react'

const CourseCard = ({ course }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="group bg-cb-gray-dark rounded-xl overflow-hidden border border-gray-800 hover:border-cb-gold/50 transition-all duration-300"
    >
      <Link to={`/course/${course.id}`}>
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-cb-gold/90 text-black rounded-full p-3">
              <Play size={24} fill="currentColor" />
            </div>
          </div>

          {/* Featured Badge */}
          {course.featured && (
            <div className="absolute top-3 left-3 bg-cb-gold text-cb-black text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <Sparkles size={12} className="mr-1" />
              DESTAQUE
            </div>
          )}

          {/* Level Badge */}
          <div className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${
            course.level === 'Iniciante' ? 'bg-green-500 text-white' :
            course.level === 'Intermediário' ? 'bg-yellow-500 text-black' :
            'bg-red-500 text-white'
          }`}>
            {course.level}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cb-gold transition-colors">
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-cb-gray-light text-sm mb-3">
            por {course.instructor}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-cb-gray-light mb-4">
            <div className="flex items-center">
              <Star size={14} className="text-cb-gold mr-1" />
              <span className="font-semibold text-cb-gold mr-1">{course.rating}</span>
              <span>({course.students.toLocaleString()})</span>
            </div>
            
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              {course.duration}
            </div>
          </div>

          {/* Modules */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-cb-gray-light">
              {course.modules} módulos
            </div>
            
            <div className="text-cb-gold font-semibold text-sm">
              Acessar Curso →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CourseCard