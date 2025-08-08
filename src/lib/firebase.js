import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth'
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import toast from 'react-hot-toast'

// 🔥 FIREBASE CONFIGURATION - CÓDIGO BILIONÁRIO
const firebaseConfig = {
  apiKey: "AIzaSyDbLRT5HsSOGWkWgeSvEYkMFKLBgOkOuPg",
  authDomain: "codigo-bilionario-c3332.firebaseapp.com",
  projectId: "codigo-bilionario-c3332",
  storageBucket: "codigo-bilionario-c3332.firebasestorage.app",
  messagingSenderId: "128320061692",
  appId: "1:128320061692:web:8e992fa5f2ab7136d41779",
  measurementId: "G-ZJW9EFR04X"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Initialize Analytics (only in browser)
let analytics = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}
export { analytics }

// 🛡️ AUTHENTICATION SERVICES
export const authService = {
  // Register new user
  async register({ email, password, name, phone }) {
    try {
      // Create user account
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with name
      await updateProfile(user, { displayName: name })
      
      // Send email verification
      await sendEmailVerification(user)
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        phone: phone || '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFD700&color=000000&size=150`,
        subscription: {
          plan: 'free',
          status: 'inactive',
          startDate: null,
          endDate: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null
        },
        progress: {},
        preferences: {
          notifications: true,
          theme: 'dark',
          language: 'pt-BR'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        emailVerified: false,
        isActive: true,
        role: 'user'
      })
      
      toast.success('🎉 Conta criada! Verifique seu email para ativar.')
      
      return {
        success: true,
        user: {
          uid: user.uid,
          name,
          email,
          emailVerified: user.emailVerified
        }
      }
    } catch (error) {
      console.error('❌ Register Error:', error)
      
      let message = 'Erro ao criar conta. Tente novamente.'
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Este email já está em uso.'
          break
        case 'auth/weak-password':
          message = 'Senha muito fraca. Use pelo menos 6 caracteres.'
          break
        case 'auth/invalid-email':
          message = 'Email inválido.'
          break
        case 'auth/operation-not-allowed':
          message = 'Operação não permitida. Contate o suporte.'
          break
      }
      
      toast.error(message)
      return { success: false, error: message }
    }
  },

  // Login user
  async login({ email, password }) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp()
      })
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const userData = userDoc.exists() ? userDoc.data() : null
      
      if (!user.emailVerified) {
        toast.error('📧 Verifique seu email antes de fazer login.')
        await signOut(auth)
        return { success: false, error: 'Email não verificado' }
      }
      
      if (userData && !userData.isActive) {
        toast.error('🚫 Conta desativada. Contate o suporte.')
        await signOut(auth)
        return { success: false, error: 'Conta desativada' }
      }
      
      toast.success(`🔥 Bem-vindo ao arsenal, ${userData?.name || 'Guerreiro'}!`)
      
      return {
        success: true,
        user: {
          uid: user.uid,
          name: userData?.name || user.displayName,
          email: user.email,
          avatar: userData?.avatar || user.photoURL,
          subscription: userData?.subscription || { plan: 'free', status: 'inactive' },
          emailVerified: user.emailVerified,
          role: userData?.role || 'user'
        }
      }
    } catch (error) {
      console.error('❌ Login Error:', error)
      
      let message = 'Erro ao fazer login. Verifique suas credenciais.'
      
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuário não encontrado.'
          break
        case 'auth/wrong-password':
          message = 'Senha incorreta.'
          break
        case 'auth/invalid-email':
          message = 'Email inválido.'
          break
        case 'auth/user-disabled':
          message = 'Conta desabilitada. Contate o suporte.'
          break
        case 'auth/too-many-requests':
          message = 'Muitas tentativas. Tente novamente mais tarde.'
          break
      }
      
      toast.error(message)
      return { success: false, error: message }
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth)
      toast.success('👋 Logout realizado com sucesso!')
      return { success: true }
    } catch (error) {
      console.error('❌ Logout Error:', error)
      toast.error('Erro ao fazer logout.')
      return { success: false, error: error.message }
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('📧 Email de recuperação enviado!')
      return { success: true }
    } catch (error) {
      console.error('❌ Reset Password Error:', error)
      
      let message = 'Erro ao enviar email de recuperação.'
      
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuário não encontrado.'
          break
        case 'auth/invalid-email':
          message = 'Email inválido.'
          break
      }
      
      toast.error(message)
      return { success: false, error: message }
    }
  },

  // Resend email verification
  async resendEmailVerification() {
    try {
      const user = auth.currentUser
      if (user && !user.emailVerified) {
        await sendEmailVerification(user)
        toast.success('📧 Email de verificação reenviado!')
        return { success: true }
      }
      return { success: false, error: 'Usuário não encontrado ou já verificado' }
    } catch (error) {
      console.error('❌ Resend Email Error:', error)
      toast.error('Erro ao reenviar email de verificação.')
      return { success: false, error: error.message }
    }
  },

  // Get current user data
  async getCurrentUser() {
    try {
      const user = auth.currentUser
      if (!user) return null
      
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const userData = userDoc.exists() ? userDoc.data() : null
      
      return {
        uid: user.uid,
        name: userData?.name || user.displayName,
        email: user.email,
        avatar: userData?.avatar || user.photoURL,
        subscription: userData?.subscription || { plan: 'free', status: 'inactive' },
        emailVerified: user.emailVerified,
        role: userData?.role || 'user',
        ...userData
      }
    } catch (error) {
      console.error('❌ Get Current User Error:', error)
      return null
    }
  },

  // Update user profile
  async updateUserProfile(updates) {
    try {
      const user = auth.currentUser
      if (!user) throw new Error('Usuário não autenticado')
      
      // Update Firebase Auth profile
      if (updates.name && updates.name !== user.displayName) {
        await updateProfile(user, { displayName: updates.name })
      }
      
      // Update Firestore document
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      toast.success('✅ Perfil atualizado com sucesso!')
      return { success: true }
    } catch (error) {
      console.error('❌ Update Profile Error:', error)
      toast.error('Erro ao atualizar perfil.')
      return { success: false, error: error.message }
    }
  },

  // Auth state observer
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback)
  }
}

// 📊 USER ANALYTICS
export const analyticsService = {
  // Track user events
  trackEvent(eventName, parameters = {}) {
    if (analytics && typeof window !== 'undefined') {
      import('firebase/analytics').then(({ logEvent }) => {
        logEvent(analytics, eventName, {
          ...parameters,
          timestamp: new Date().toISOString(),
          user_id: auth.currentUser?.uid
        })
      })
    }
  },

  // Track page views
  trackPageView(pageName) {
    this.trackEvent('page_view', { page_name: pageName })
  },

  // Track course interactions
  trackCourseEvent(action, courseId, courseName) {
    this.trackEvent('course_interaction', {
      action,
      course_id: courseId,
      course_name: courseName
    })
  }
}

export default app