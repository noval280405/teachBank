// composables/useAuth.ts
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import type { User } from 'firebase/auth'

export const useAuth = () => {
  const { auth } = useFirebase()
  const user = useState<User | null>('user', () => null)
  const loading = useState<boolean>('auth-loading', () => true)

  // Inisialisasi Auth Listener
  const initAuth = () => {
    return new Promise<User | null>((resolve) => {
      // Jika sudah tidak loading (sudah terinisialisasi sebelumnya), langsung resolve
      if (!loading.value) {
        resolve(user.value)
        return
      }

      if (process.client && auth) {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          user.value = currentUser
          loading.value = false
          unsubscribe() // Hentikan listener penunggu awal
          resolve(currentUser)
        })
      } else {
        loading.value = false
        resolve(null)
      }
    })
  }

  const login = async (email: string, pass: string) => {
    return await signInWithEmailAndPassword(auth, email, pass)
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
    return navigateTo('/login')
  }

  const kirimVerifikasi = async () => { if (user.value && !user.value.emailVerified) await sendEmailVerification(user.value) }
  const kirimResetPassword = async (email?: string) => {
    const target = email || user.value?.email
    if (!target) throw new Error('Email tidak tersedia')
    await sendPasswordResetEmail(auth, target)
  }
  const gantiPassword = async (passwordBaru: string) => { if (!user.value) throw new Error('Belum login'); await updatePassword(user.value, passwordBaru) }
  const autentikasiUlang = async (password: string) => {
    if (!user.value?.email) throw new Error('Email tidak tersedia')
    await reauthenticateWithCredential(user.value, EmailAuthProvider.credential(user.value.email, password))
  }
  const hapusAkunAuth = async () => { if (!user.value) throw new Error('Belum login'); await deleteUser(user.value); user.value = null }

  return { user, loading, initAuth, login, logout, kirimVerifikasi, kirimResetPassword, gantiPassword, autentikasiUlang, hapusAkunAuth }
}
