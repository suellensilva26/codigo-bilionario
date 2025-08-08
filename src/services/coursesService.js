// 🚨 COURSESSERVICE DESABILITADO - NÃO USAR!
// Use dados diretos nos componentes!

console.error('🚨 COURSESSERVICE DESABILITADO!')

export const coursesService = {
  async getCourseById(courseId) {
    console.error('🚨 MÉTODO DESABILITADO - Use dados diretos no componente!')
    return null
  },

  async getCourses() {
    console.error('🚨 MÉTODO DESABILITADO - Use dados diretos no componente!')
    return []
  },

  async getCourseProgress() {
    console.error('🚨 MÉTODO DESABILITADO - Use dados diretos no componente!')
    return { progress: 0, completedLessons: [] }
  },

  async markLessonComplete() {
    console.error('🚨 MÉTODO DESABILITADO - Use dados diretos no componente!')
    return false
  }
}

export default coursesService