// composables/useAuth.ts
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
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

  return { user, loading, initAuth, login, logout }
}