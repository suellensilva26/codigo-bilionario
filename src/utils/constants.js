// Plans Configuration - Código Bilionário
export const PLANS = {
  BASIC: {
    id: 'basic',
    name: 'BÁSICO',
    price: 47,
    monthlyPrice: 47,
    yearlyPrice: 470, // 2 months free
    features: [
      '30% dos cursos disponíveis',
      'Suporte por email',
      'Certificados de conclusão',
      'Acesso mobile e desktop',
      'Qualidade até 720p'
    ],
    popular: false,
    color: 'gray',
    maxCourses: 60, // 30% of 200
    maxQuality: '720p',
    downloadEnabled: false
  },
  PREMIUM: {
    id: 'premium',
    name: 'PREMIUM',
    price: 147,
    monthlyPrice: 147,
    yearlyPrice: 1470, // 2 months free
    features: [
      '70% dos cursos disponíveis',
      'Grupos VIP no Telegram',
      'Suporte prioritário',
      'Downloads para offline',
      'Webinars exclusivos',
      'Qualidade até 1080p'
    ],
    popular: true,
    color: 'gold',
    maxCourses: 140, // 70% of 200
    maxQuality: '1080p',
    downloadEnabled: true
  },
  ELITE: {
    id: 'elite',
    name: 'ELITE',
    price: 497,
    monthlyPrice: 497,
    yearlyPrice: 4970, // 2 months free
    features: [
      'Acesso total e vitalício',
      'Mentoria 1:1 mensal',
      'Sistema de afiliados',
      'Acesso antecipado',
      'Certificados premium',
      'Suporte VIP 24/7',
      'Qualidade 4K'
    ],
    popular: false,
    color: 'platinum',
    maxCourses: 200, // 100% of courses
    maxQuality: '4k',
    downloadEnabled: true
  }
}

// Course Categories
export const CATEGORIES = [
  { 
    id: 'marketing', 
    name: 'Marketing Digital', 
    icon: 'TrendingUp',
    description: 'Estratégias de marketing que realmente funcionam',
    courseCount: 45
  },
  { 
    id: 'vendas', 
    name: 'Vendas', 
    icon: 'DollarSign',
    description: 'Técnicas de vendas dos maiores closers',
    courseCount: 32
  },
  { 
    id: 'programacao', 
    name: 'Programação', 
    icon: 'Code',
    description: 'Linguagens e frameworks mais demandados',
    courseCount: 28
  },
  { 
    id: 'design', 
    name: 'Design', 
    icon: 'Palette',
    description: 'Design gráfico, UI/UX e branding',
    courseCount: 22
  },
  { 
    id: 'business', 
    name: 'Business', 
    icon: 'Briefcase',
    description: 'Empreendedorismo e gestão de negócios',
    courseCount: 35
  },
  { 
    id: 'crypto', 
    name: 'Criptomoedas', 
    icon: 'Bitcoin',
    description: 'Trading e investimentos em crypto',
    courseCount: 18
  },
  { 
    id: 'dropshipping', 
    name: 'Dropshipping', 
    icon: 'Package',
    description: 'E-commerce sem estoque',
    courseCount: 15
  },
  { 
    id: 'afiliados', 
    name: 'Marketing de Afiliados', 
    icon: 'Share2',
    description: 'Ganhe comissões promovendo produtos',
    courseCount: 25
  }
]

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
}

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended'
}

// Course Levels
export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
}

// Course Status
export const COURSE_STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
  PREMIUM: 'premium'
}

// Payment Methods
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  MERCADOPAGO: 'mercadopago',
  PIX: 'pix',
  BOLETO: 'boleto',
  CREDIT_CARD: 'credit_card'
}

// App Configuration
export const APP_CONFIG = {
  NAME: 'Código Bilionário',
  TAGLINE: 'Pare de Enriquecer Gurus!',
  DESCRIPTION: '200+ cursos completos por R$ 97/mês. A vingança perfeita contra a indústria predatória de cursos.',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'suporte@codigobilionario.com',
  TELEGRAM_GROUP: 'https://t.me/codigobilionario',
  INSTAGRAM: 'https://instagram.com/codigobilionario',
  YOUTUBE: 'https://youtube.com/@codigobilionario'
}

// File Upload Limits
export const UPLOAD_LIMITS = {
  VIDEO: {
    MAX_SIZE: 2 * 1024 * 1024 * 1024, // 2GB
    ALLOWED_TYPES: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
    ALLOWED_EXTENSIONS: ['.mp4', '.avi', '.mov', '.wmv']
  },
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  },
  DOCUMENT: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx']
  }
}

// Video Quality Options
export const VIDEO_QUALITIES = [
  { value: 'auto', label: 'Auto', resolution: 'Automático' },
  { value: '360p', label: '360p', resolution: '640x360' },
  { value: '480p', label: '480p', resolution: '854x480' },
  { value: '720p', label: '720p HD', resolution: '1280x720' },
  { value: '1080p', label: '1080p FHD', resolution: '1920x1080' },
  { value: '4k', label: '4K UHD', resolution: '3840x2160' }
]

// Playback Speeds
export const PLAYBACK_SPEEDS = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' }
]

// Analytics Events
export const ANALYTICS_EVENTS = {
  // User Events
  USER_REGISTERED: 'user_registered',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  
  // Course Events
  COURSE_VIEWED: 'course_viewed',
  COURSE_STARTED: 'course_started',
  COURSE_COMPLETED: 'course_completed',
  LESSON_COMPLETED: 'lesson_completed',
  
  // Payment Events
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_RENEWED: 'subscription_renewed',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  
  // Engagement Events
  VIDEO_PLAYED: 'video_played',
  VIDEO_PAUSED: 'video_paused',
  VIDEO_COMPLETED: 'video_completed',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied'
}

// Social Proof Data
export const SOCIAL_PROOF = {
  TOTAL_STUDENTS: 50000,
  TOTAL_COURSES: 200,
  AVERAGE_RATING: 4.8,
  SUCCESS_STORIES: 1250,
  MONEY_SAVED: 'R$ 2.5M+',
  MONTHLY_GROWTH: '15%'
}

// Marketing Messages
export const MARKETING_MESSAGES = {
  HERO_TITLE: 'CHEGA DE ENRIQUECER GURUS!',
  HERO_SUBTITLE: '200+ cursos completos por menos que o preço de UM',
  HERO_CTA: 'COMEÇAR VINGANÇA AGORA',
  
  PAIN_POINTS: [
    'Já gastei R$ 3.000 em cursos e continuo no mesmo lugar',
    'O guru está rico e eu continuo pobre',
    'Trabalho 8h para ganhar R$ 50 (R$ 6,25/hora)',
    'Vejo MLK de 19 anos ganhando R$ 30k/mês',
    'Compro curso, não implemento, compro outro'
  ],
  
  SOLUTION_POINTS: [
    '200+ cursos pelo preço de 1',
    'Economia de R$ 50.000+',
    'Atualizações semanais',
    'Sem mais compras individuais',
    'Arsenal completo de conhecimento'
  ]
}

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE_BR: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
}

// Default Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100
}

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  COURSES_LIST: 'courses_list',
  COURSE_DETAIL: 'course_detail',
  USER_PROGRESS: 'user_progress',
  CATEGORIES: 'categories',
  FEATURED_COURSES: 'featured_courses'
}

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Algo deu errado. Tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Você não tem permissão para acessar este conteúdo.',
  SESSION_EXPIRED: 'Sua sessão expirou. Faça login novamente.',
  SUBSCRIPTION_REQUIRED: 'Esta funcionalidade requer uma assinatura ativa.',
  PAYMENT_FAILED: 'Falha no pagamento. Tente novamente.',
  UPLOAD_FAILED: 'Falha no upload. Verifique o arquivo e tente novamente.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  REGISTER: 'Conta criada com sucesso!',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
  PASSWORD_CHANGED: 'Senha alterada com sucesso!',
  SUBSCRIPTION_ACTIVATED: 'Assinatura ativada! Bem-vindo ao arsenal!',
  COURSE_COMPLETED: 'Parabéns! Curso concluído com sucesso!',
  PROGRESS_SAVED: 'Progresso salvo automaticamente.'
}