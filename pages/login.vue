<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-brand-600 dark:text-brand-500">Soalify</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Bank Soal Guru SD Interaktif</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Email Guru</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            placeholder="guru@sekolah.sch.id"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Kata Sandi</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl shadow-lg transition disabled:opacity-50"
        >
          {{ isSubmitting ? 'Memproses...' : 'Masuk ke Gudang Soal' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const { login } = useAuth()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const handleLogin = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    await login(email.value, password.value)
    navigateTo('/dashboard')
  } catch (err) {
    errorMessage.value = 'Login gagal. Periksa kembali email & kata sandi Anda.'
  } finally {
    isSubmitting.value = false
  }
}
</script>