// 📁 GOOGLE DRIVE SERVICE - CÓDIGO BILIONÁRIO
import toast from 'react-hot-toast'

// Google Drive API Configuration
const GOOGLE_DRIVE_API_KEY = "AIzaSyAAQRrzHeS1zq-GVfYvuf6ymi7AVPZgZQA"
const GOOGLE_DRIVE_FOLDER_ID = "1MUiuoKIP1H41uHGawOqU3t0MDWukW2i"

// 📁 GOOGLE DRIVE SERVICE
export const googleDriveService = {
  // Initialize Google Drive API
  async initializeAPI() {
    try {
      if (typeof window === 'undefined') return false
      
      // Load Google API
      if (!window.gapi) {
        await this.loadGoogleAPI()
      }
      
      await window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: GOOGLE_DRIVE_API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        })
      })
      
      return true
    } catch (error) {
      console.error('❌ Google Drive API Init Error:', error)
      return false
    }
  },

  // Load Google API script
  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  },

  // Get files from specific folder
  async getFilesFromFolder(folderId = GOOGLE_DRIVE_FOLDER_ID) {
    try {
      await this.initializeAPI()
      
      const response = await window.gapi.client.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,webContentLink,thumbnailLink)',
        orderBy: 'modifiedTime desc'
      })
      
      return {
        success: true,
        files: response.result.files || []
      }
    } catch (error) {
      console.error('❌ Get Files Error:', error)
      return {
        success: false,
        error: error.message,
        files: []
      }
    }
  },

  // Get video files specifically
  async getVideoFiles(folderId = GOOGLE_DRIVE_FOLDER_ID) {
    try {
      const result = await this.getFilesFromFolder(folderId)
      
      if (!result.success) {
        return result
      }
      
      // Filter video files
      const videoFiles = result.files.filter(file => 
        file.mimeType.startsWith('video/') || 
        file.name.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i)
      )
      
      return {
        success: true,
        files: videoFiles
      }
    } catch (error) {
      console.error('❌ Get Video Files Error:', error)
      return {
        success: false,
        error: error.message,
        files: []
      }
    }
  },

  // Get course materials (PDFs, docs, etc.)
  async getCourseMaterials(folderId = GOOGLE_DRIVE_FOLDER_ID) {
    try {
      const result = await this.getFilesFromFolder(folderId)
      
      if (!result.success) {
        return result
      }
      
      // Filter document files
      const materialFiles = result.files.filter(file => 
        file.mimeType.includes('pdf') ||
        file.mimeType.includes('document') ||
        file.mimeType.includes('presentation') ||
        file.mimeType.includes('spreadsheet') ||
        file.name.match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt)$/i)
      )
      
      return {
        success: true,
        files: materialFiles
      }
    } catch (error) {
      console.error('❌ Get Course Materials Error:', error)
      return {
        success: false,
        error: error.message,
        files: []
      }
    }
  },

  // Get file download link
  async getFileDownloadLink(fileId) {
    try {
      await this.initializeAPI()
      
      const response = await window.gapi.client.drive.files.get({
        fileId: fileId,
        fields: 'webContentLink,webViewLink'
      })
      
      return {
        success: true,
        downloadLink: response.result.webContentLink,
        viewLink: response.result.webViewLink
      }
    } catch (error) {
      console.error('❌ Get Download Link Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Sync course content from Google Drive
  async syncCourseContent() {
    try {
      toast.loading('Sincronizando conteúdo...', { id: 'sync' })
      
      const [videosResult, materialsResult] = await Promise.all([
        this.getVideoFiles(),
        this.getCourseMaterials()
      ])
      
      if (!videosResult.success || !materialsResult.success) {
        throw new Error('Erro ao sincronizar arquivos')
      }
      
      const syncData = {
        videos: videosResult.files,
        materials: materialsResult.files,
        syncedAt: new Date().toISOString(),
        totalFiles: videosResult.files.length + materialsResult.files.length
      }
      
      // Store in localStorage for caching
      localStorage.setItem('drive_sync_data', JSON.stringify(syncData))
      
      toast.success(`${syncData.totalFiles} arquivos sincronizados!`, { id: 'sync' })
      
      return {
        success: true,
        data: syncData
      }
    } catch (error) {
      console.error('❌ Sync Content Error:', error)
      toast.error('Erro na sincronização', { id: 'sync' })
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get cached sync data
  getCachedSyncData() {
    try {
      const cached = localStorage.getItem('drive_sync_data')
      if (cached) {
        const data = JSON.parse(cached)
        
        // Check if cache is less than 1 hour old
        const syncTime = new Date(data.syncedAt)
        const now = new Date()
        const hoursDiff = (now - syncTime) / (1000 * 60 * 60)
        
        if (hoursDiff < 1) {
          return {
            success: true,
            data,
            cached: true
          }
        }
      }
      
      return { success: false, cached: false }
    } catch (error) {
      console.error('❌ Get Cached Data Error:', error)
      return { success: false, cached: false }
    }
  },

  // Auto-organize files by category
  organizeFilesByCategory(files) {
    const organized = {
      marketing: [],
      copywriting: [],
      sales: [],
      development: [],
      business: [],
      design: [],
      other: []
    }
    
    files.forEach(file => {
      const fileName = file.name.toLowerCase()
      
      if (fileName.includes('marketing') || fileName.includes('ads') || fileName.includes('facebook')) {
        organized.marketing.push(file)
      } else if (fileName.includes('copy') || fileName.includes('texto') || fileName.includes('persuasao')) {
        organized.copywriting.push(file)
      } else if (fileName.includes('vendas') || fileName.includes('sales') || fileName.includes('negociacao')) {
        organized.sales.push(file)
      } else if (fileName.includes('desenvolvimento') || fileName.includes('personal') || fileName.includes('mindset')) {
        organized.development.push(file)
      } else if (fileName.includes('business') || fileName.includes('negocio') || fileName.includes('empreendedor')) {
        organized.business.push(file)
      } else if (fileName.includes('design') || fileName.includes('criativo') || fileName.includes('visual')) {
        organized.design.push(file)
      } else {
        organized.other.push(file)
      }
    })
    
    return organized
  },

  // Format file size
  formatFileSize(bytes) {
    if (!bytes) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Get file icon based on type
  getFileIcon(mimeType, fileName) {
    if (mimeType.startsWith('video/')) return '🎥'
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('document')) return '📝'
    if (mimeType.includes('presentation')) return '📊'
    if (mimeType.includes('spreadsheet')) return '📈'
    if (mimeType.includes('image')) return '🖼️'
    if (mimeType.includes('audio')) return '🎵'
    if (fileName.match(/\.(zip|rar|7z)$/i)) return '📦'
    
    return '📁'
  },

  // Demo mode - Return mock data
  getMockDriveData() {
    return {
      success: true,
      data: {
        videos: [
          {
            id: 'mock_video_1',
            name: 'Marketing Digital - Aula 1.mp4',
            mimeType: 'video/mp4',
            size: '524288000', // 500MB
            createdTime: '2024-01-15T10:00:00Z',
            modifiedTime: '2024-01-15T10:00:00Z',
            webViewLink: 'https://drive.google.com/file/d/mock_video_1/view',
            webContentLink: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'mock_video_2',
            name: 'Copywriting Avançado - Módulo 1.mp4',
            mimeType: 'video/mp4',
            size: '314572800', // 300MB
            createdTime: '2024-01-16T14:30:00Z',
            modifiedTime: '2024-01-16T14:30:00Z',
            webViewLink: 'https://drive.google.com/file/d/mock_video_2/view',
            webContentLink: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          }
        ],
        materials: [
          {
            id: 'mock_material_1',
            name: 'Guia Completo Marketing Digital.pdf',
            mimeType: 'application/pdf',
            size: '5242880', // 5MB
            createdTime: '2024-01-15T09:00:00Z',
            modifiedTime: '2024-01-15T09:00:00Z',
            webViewLink: 'https://drive.google.com/file/d/mock_material_1/view',
            webContentLink: 'https://drive.google.com/uc?id=mock_material_1'
          },
          {
            id: 'mock_material_2',
            name: 'Templates de Copy.docx',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: '1048576', // 1MB
            createdTime: '2024-01-16T11:00:00Z',
            modifiedTime: '2024-01-16T11:00:00Z',
            webViewLink: 'https://drive.google.com/file/d/mock_material_2/view',
            webContentLink: 'https://drive.google.com/uc?id=mock_material_2'
          }
        ],
        syncedAt: new Date().toISOString(),
        totalFiles: 4
      }
    }
  }
}

export default googleDriveService