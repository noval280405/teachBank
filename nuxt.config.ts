// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-08-14',
  devtools: { enabled: true },
 modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  runtimeConfig: {
    public: {
      firebaseAppCheckKey: process.env.NUXT_PUBLIC_FIREBASE_APP_CHECK_KEY || ''
    }
  },
  css: ['~/assets/css/main.css']
})
