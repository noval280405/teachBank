export default defineNuxtPlugin((nuxtApp) => {
  const record = (type: string, value: unknown) => {
    try {
      const key = 'teachbank_error_log'
      const previous = JSON.parse(localStorage.getItem(key) || '[]')
      const message = value instanceof Error ? value.message : String(value || 'Kesalahan tidak diketahui')
      localStorage.setItem(key, JSON.stringify([...previous, { type, message, path: location.pathname, at: new Date().toISOString() }].slice(-30)))
    } catch { /* Penyimpanan monitoring tidak boleh mengganggu aplikasi. */ }
  }
  nuxtApp.hook('vue:error', error => record('vue', error))
  window.addEventListener('error', event => record('window', event.error || event.message))
  window.addEventListener('unhandledrejection', event => record('promise', event.reason))
})

