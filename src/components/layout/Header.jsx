import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Search, 
  User, 
  Settings, 
  LogOut,
  Crown,
  Book,
  BarChart3,
  CreditCard
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Cursos', href: '/courses', icon: Book },
    { name: 'Assinatura', href: '/subscription', icon: CreditCard },
  ]

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <header className="bg-cb-black/95 backdrop-blur-sm border-b border-cb-gold/20 sticky top-0 z-50">
      <div className="container-cb">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-cb-black font-poppins font-black text-xl">CB</span>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 bg-gradient-gold rounded-lg opacity-20"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-poppins font-bold text-gradient-gold">
                CÓDIGO BILIONÁRIO
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    isActivePath(item.href)
                      ? 'text-cb-gold bg-cb-gold/10'
                      : 'text-cb-white/70 hover:text-cb-gold hover:bg-cb-gold/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                  {isActivePath(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-cb-gold/10 rounded-lg border border-cb-gold/30"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button className="p-2 text-cb-white/70 hover:text-cb-gold transition-colors rounded-lg hover:bg-cb-gold/5">
              <Search className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-cb-gold/5 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                    <span className="text-cb-black font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-cb-white font-medium text-sm">
                      {user?.name || 'Usuário'}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Crown className="w-3 h-3 text-cb-gold" />
                      <span className="text-cb-gold text-xs font-semibold uppercase">
                        {user?.plan || 'básico'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-cb-gray-dark border border-cb-gold/20 rounded-lg shadow-cb-premium overflow-hidden"
                  >
                    {/* User Info */}
                    <div className="p-4 border-b border-cb-gray-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center">
                          <span className="text-cb-black font-bold text-lg">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-cb-white font-semibold">
                            {user?.name || 'Usuário'}
                          </p>
                          <p className="text-cb-white/60 text-sm">
                            {user?.email}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Crown className="w-3 h-3 text-cb-gold" />
                            <span className="text-cb-gold text-xs font-semibold uppercase">
                              Plano {user?.plan || 'básico'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-cb-gold/5 text-cb-white/80 hover:text-cb-gold transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Meu Perfil</span>
                      </Link>
                      
                      <Link
                        to="/subscription"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-cb-gold/5 text-cb-white/80 hover:text-cb-gold transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Assinatura</span>
                      </Link>

                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-cb-gold/5 text-cb-white/80 hover:text-cb-gold transition-colors w-full text-left"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configurações</span>
                      </button>

                      <hr className="my-2 border-cb-gray-medium" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-red-500/10 text-cb-white/80 hover:text-red-400 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-cb-white/70 hover:text-cb-gold transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-cb-gold/20 py-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActivePath(item.href)
                          ? 'text-cb-gold bg-cb-gold/10 border-l-4 border-cb-gold'
                          : 'text-cb-white/70 hover:text-cb-gold hover:bg-cb-gold/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false)
            setIsMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}

export default Header