// ❌ SANGAT SALAH (Error):
// import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'

// ✅ BENAR (Gunakan 'type' untuk impor Interface/Type TypeScript):
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'

export const useAuth = () => {
  const { auth } = useFirebase()
  const user = useState<User | null>('user', () => null)
  const loading = useState<boolean>('auth-loading', () => true)

  if (process.client) {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
      loading.value = false
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

  return { user, loading, login, logout }
}