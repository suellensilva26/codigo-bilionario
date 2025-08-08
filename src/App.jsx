import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'

// Store
import useAuthStore from './store/authStore'

// Components
import LoadingScreen from './components/common/LoadingScreen'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'

// Pages - Lazy Loading for better performance
const Landing = React.lazy(() => import('./pages/Landing'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Courses = React.lazy(() => import('./pages/Courses'))
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'))
const Profile = React.lazy(() => import('./pages/Profile'))
const Subscription = React.lazy(() => import('./pages/Subscription'))
const Admin = React.lazy(() => import('./pages/Admin'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

// Page Transition Variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
}

function App() {
  const { user, isLoading, isInitialized, initializeAuth } = useAuthStore()

  // Initialize Firebase Auth on app startup
  useEffect(() => {
    if (!isInitialized) {
      initializeAuth()
    }
  }, [isInitialized, initializeAuth])

  // Show loading screen while initializing authentication
  if (!isInitialized) {
    return <LoadingScreen message="Inicializando aplicação..." />
  }

  return (
    <>
      <Helmet>
        <title>Código Bilionário - Pare de Enriquecer Gurus!</title>
        <meta 
          name="description" 
          content="200+ cursos completos por R$ 97/mês. A vingança perfeita contra a indústria predatória de cursos online." 
        />
      </Helmet>

      <div className="min-h-screen bg-cb-black text-cb-white">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  user ? <Navigate to="/dashboard" replace /> : (
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                      key="landing"
                    >
                      <Landing />
                    </motion.div>
                  )
                } 
              />
              
              <Route 
                path="/login" 
                element={
                  user ? <Navigate to="/dashboard" replace /> : (
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                      key="login"
                    >
                      <Login />
                    </motion.div>
                  )
                }
              />
              
              <Route 
                path="/register" 
                element={
                  user ? <Navigate to="/dashboard" replace /> : (
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                      key="register"
                    >
                      <Register />
                    </motion.div>
                  )
                }
              />

              {/* Protected Routes with Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        key="dashboard"
                      >
                        <Dashboard />
                      </motion.div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        key="courses"
                      >
                        <Courses />
                      </motion.div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/course/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        key="course-detail"
                      >
                        <CourseDetail />
                      </motion.div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        key="profile"
                      >
                        <Profile />
                      </motion.div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/subscription"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        key="subscription"
                      >
                        <Subscription />
                      </motion.div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                      key="admin"
                    >
                      <Admin />
                    </motion.div>
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found */}
              <Route 
                path="*" 
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    key="not-found"
                  >
                    <NotFound />
                  </motion.div>
                }
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>
    </>
  )
}

export default App