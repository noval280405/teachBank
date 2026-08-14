<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
    <!-- Navbar Header -->
    <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/dashboard" class="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-500">
          <span>📚 Soalify</span>
        </NuxtLink>

        <div class="flex items-center gap-4">
          <!-- Toggle Dark Mode -->
          <button 
            @click="toggleDarkMode" 
            class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Ubah Mode Tampilan"
          >
            <span v-if="colorMode.value === 'dark'">☀️</span>
            <span v-else>🌙</span>
          </button>

          <!-- User Profile & Logout -->
          <div v-if="user" class="flex items-center gap-3">
            <span class="text-sm font-medium hidden sm:inline">{{ user.email }}</span>
            <button 
              @click="logout" 
              class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
const colorMode = useColorMode()
const { user, logout } = useAuth()

const toggleDarkMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>