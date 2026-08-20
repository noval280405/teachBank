import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: "AIzaSyAtlns1ykxpb8itm3gMQcp8dgW-Xn3H5y0",
  authDomain: "clinic-management-erp.firebaseapp.com",
  projectId: "clinic-management-erp",
  storageBucket: "clinic-management-erp.firebasestorage.app",
  messagingSenderId: "794499631983",
  appId: "1:794499631983:web:619b6faf0a09df80aeb69a"
}

export const useFirebase = () => {
  const apps = getApps()
  const app: FirebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig)
  
  // Menggunakan useState agar instance Firestore & Auth konsisten di Nuxt
  const db = useState<Firestore | null>('fb-db', () => null)
  const auth = useState<Auth | null>('fb-auth', () => null)
  const storage = useState<FirebaseStorage | null>('fb-storage', () => null)
  const appCheckReady = useState<boolean>('fb-app-check-ready', () => false)

  // Hanya inisialisasi di browser (client-side)
  if (process.client) {
    if (!db.value) db.value = getFirestore(app)
    if (!auth.value) auth.value = getAuth(app)
    if (!storage.value) storage.value = getStorage(app)
    const appCheckKey = useRuntimeConfig().public.firebaseAppCheckKey as string
    if (appCheckKey && !appCheckReady.value) {
      initializeAppCheck(app, { provider: new ReCaptchaV3Provider(appCheckKey), isTokenAutoRefreshEnabled: true })
      appCheckReady.value = true
    }
  }

  return { db: db.value!, auth: auth.value!, storage: storage.value! }
}
