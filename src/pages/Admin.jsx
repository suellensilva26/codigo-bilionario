import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  TrendingUp,
  Eye,
  Download,
  Upload,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  FileText,
  Video,
  Image,
  Database
} from 'lucide-react'

// Services
import useAuthStore from '../store/authStore'
import { googleDriveService } from '../lib/googleDrive'
import toast from 'react-hot-toast'

// 👑 ADMIN DASHBOARD - CÓDIGO BILIONÁRIO
const Admin = () => {
  const { user, isAdmin } = useAuthStore()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    users: { total: 2847, active: 2456, new: 142 },
    revenue: { total: 284750, monthly: 45200, growth: 12.5 },
    courses: { total: 247, published: 198, draft: 49 },
    engagement: { completion: 78.5, rating: 4.7, retention: 85.2 }
  })
  
  const [driveFiles, setDriveFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])

  // Load Google Drive files
  const loadDriveFiles = async () => {
    setIsLoading(true)
    try {
      // For demo mode, use mock data
      const isDemoMode = window.location.hostname !== 'localhost'
      
      if (isDemoMode) {
        const mockData = googleDriveService.getMockDriveData()
        setDriveFiles([...mockData.data.videos, ...mockData.data.materials])
      } else {
        const result = await googleDriveService.syncCourseContent()
        if (result.success) {
          setDriveFiles([...result.data.videos, ...result.data.materials])
        }
      }
    } catch (error) {
      console.error('Error loading drive files:', error)
      toast.error('Erro ao carregar arquivos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'content') {
      loadDriveFiles()
    }
  }, [activeTab])

  // Redirect if not admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-gray-400">Você não tem permissões de administrador.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Código Bilionário</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-cb-gray-dark border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-cb-gold rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-sm text-gray-400">Código Bilionário</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-cb-gold">Administrador</p>
                </div>
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=FFD700&color=000000`}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <nav className="space-y-2">
                {[
                  { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
                  { id: 'users', name: 'Usuários', icon: Users },
                  { id: 'revenue', name: 'Receita', icon: DollarSign },
                  { id: 'courses', name: 'Cursos', icon: BookOpen },
                  { id: 'content', name: 'Conteúdo', icon: Database },
                  { id: 'analytics', name: 'Analytics', icon: Activity },
                  { id: 'settings', name: 'Configurações', icon: Settings }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-cb-gold text-black'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Visão Geral</h2>
                    <p className="text-gray-400">Dashboard administrativo do Código Bilionário</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-cb-gray-dark rounded-xl p-6 border border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-green-500 text-sm font-medium">+{stats.users.new}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{stats.users.total.toLocaleString()}</h3>
                      <p className="text-gray-400 text-sm">Usuários Totais</p>
                      <p className="text-green-500 text-xs mt-2">{stats.users.active.toLocaleString()} ativos</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-cb-gray-dark rounded-xl p-6 border border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-green-500 text-sm font-medium">+{stats.revenue.growth}%</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">R$ {stats.revenue.total.toLocaleString()}</h3>
                      <p className="text-gray-400 text-sm">Receita Total</p>
                      <p className="text-green-500 text-xs mt-2">R$ {stats.revenue.monthly.toLocaleString()} este mês</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-cb-gray-dark rounded-xl p-6 border border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-blue-500 text-sm font-medium">{stats.courses.draft} rascunhos</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{stats.courses.total}</h3>
                      <p className="text-gray-400 text-sm">Cursos Totais</p>
                      <p className="text-green-500 text-xs mt-2">{stats.courses.published} publicados</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-cb-gray-dark rounded-xl p-6 border border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-cb-gold rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-green-500 text-sm font-medium">{stats.engagement.rating}★</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{stats.engagement.completion}%</h3>
                      <p className="text-gray-400 text-sm">Taxa de Conclusão</p>
                      <p className="text-green-500 text-xs mt-2">{stats.engagement.retention}% retenção</p>
                    </motion.div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-cb-gray-dark rounded-xl p-6 border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-6">Atividade Recente</h3>
                    <div className="space-y-4">
                      {[
                        { type: 'user', message: 'Novo usuário registrado: João Silva', time: '2 min atrás', status: 'success' },
                        { type: 'payment', message: 'Pagamento processado: R$ 97,00', time: '5 min atrás', status: 'success' },
                        { type: 'course', message: 'Curso "Marketing Digital" atualizado', time: '15 min atrás', status: 'info' },
                        { type: 'error', message: 'Erro no upload de vídeo', time: '1 hora atrás', status: 'error' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            activity.status === 'success' ? 'bg-green-500' :
                            activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-white text-sm">{activity.message}</p>
                            <p className="text-gray-400 text-xs">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Management Tab */}
              {activeTab === 'content' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Gestão de Conteúdo</h2>
                      <p className="text-gray-400">Gerenciar arquivos do Google Drive</p>
                    </div>
                    <button
                      onClick={loadDriveFiles}
                      disabled={isLoading}
                      className="flex items-center space-x-2 bg-cb-gold hover:bg-yellow-400 disabled:bg-gray-600 text-black font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>Sincronizar</span>
                    </button>
                  </div>

                  {/* Files Table */}
                  <div className="bg-cb-gray-dark rounded-xl border border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">Arquivos ({driveFiles.length})</h3>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Buscar arquivos..."
                              className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cb-gold"
                            />
                          </div>
                          <button className="p-2 text-gray-400 hover:text-white">
                            <Filter className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-900/50">
                          <tr>
                            <th className="text-left p-4 text-gray-300 font-medium">Arquivo</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Tipo</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Tamanho</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Modificado</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {driveFiles.map((file) => (
                            <tr key={file.id} className="border-b border-gray-800 hover:bg-gray-900/30">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="text-2xl">
                                    {googleDriveService.getFileIcon(file.mimeType, file.name)}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">{file.name}</p>
                                    <p className="text-gray-400 text-sm">ID: {file.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                                  {file.mimeType.split('/')[1]?.toUpperCase() || 'Unknown'}
                                </span>
                              </td>
                              <td className="p-4 text-gray-300">
                                {googleDriveService.formatFileSize(file.size)}
                              </td>
                              <td className="p-4 text-gray-300">
                                {new Date(file.modifiedTime).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => window.open(file.webViewLink, '_blank')}
                                    className="p-2 text-gray-400 hover:text-cb-gold transition-colors"
                                    title="Visualizar"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => window.open(file.webContentLink, '_blank')}
                                    className="p-2 text-gray-400 hover:text-cb-gold transition-colors"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-cb-gold transition-colors">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {driveFiles.length === 0 && !isLoading && (
                      <div className="p-8 text-center">
                        <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Nenhum arquivo encontrado</p>
                        <button
                          onClick={loadDriveFiles}
                          className="mt-4 text-cb-gold hover:text-yellow-400 transition-colors"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Other tabs can be added here */}
              {activeTab !== 'overview' && activeTab !== 'content' && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h3>
                  <p className="text-gray-400">Esta seção está em desenvolvimento</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Admin