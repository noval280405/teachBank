// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Hanya jalankan verifikasi auth di browser (client-side)
  if (process.server) return

  const { user, initAuth } = useAuth()

  // Tunggu Firebase selesai membaca token/session dari Local Storage
  await initAuth()

  // Jika user tidak login dan bukan di halaman login, lemparkan ke /login
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // Jika user SUDAH login tapi mencoba akses halaman /login, lemparkan ke dashboard
  if (user.value && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})