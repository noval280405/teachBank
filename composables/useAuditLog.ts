import { addDoc, collection } from 'firebase/firestore'

export const useAuditLog = () => {
  const { db } = useFirebase()
  const { user } = useAuth()

  const catatAktivitas = async (aksi: string, detail: Record<string, unknown> = {}) => {
    if (!user.value) return
    try {
      await addDoc(collection(db, 'auditAktivitas'), {
        userId: user.value.uid,
        aksi,
        detail,
        createdAt: new Date(),
        userAgent: process.client ? navigator.userAgent.slice(0, 250) : '',
      })
    } catch (error) {
      console.warn('Audit aktivitas tidak dapat disimpan:', error)
    }
  }

  return { catatAktivitas }
}
