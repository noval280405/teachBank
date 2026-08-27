<template>
  <div class="relative min-h-screen overflow-x-clip bg-slate-50 text-slate-800 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
    <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true"><div class="absolute -left-40 top-40 h-80 w-80 rounded-full bg-brand-200/20 blur-3xl dark:bg-brand-900/10"></div><div class="absolute -right-40 top-96 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-900/10"></div></div>
    <!-- Navbar Header -->
    <header class="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/10">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div class="flex min-w-0 items-center gap-5 lg:gap-8">
        <NuxtLink to="/dashboard" class="group flex items-center gap-2.5">
          <span class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/20 transition-transform group-hover:scale-105"><AppIcon name="book" class="h-4.5 w-4.5" /></span><span class="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Soal<span class="text-brand-600 dark:text-brand-400">ify</span></span>
        </NuxtLink>

        <nav v-if="user" class="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          <NuxtLink to="/dashboard" :class="navClass('/dashboard', true)"><AppIcon name="home" class="h-4 w-4" /> Dashboard</NuxtLink>
          <NuxtLink to="/analisis" :class="navClass('/analisis')"><AppIcon name="pie" class="h-4 w-4" /> Analisis</NuxtLink>
          <NuxtLink to="/kolaborasi" :class="navClass('/kolaborasi')"><AppIcon name="copy" class="h-4 w-4" /> Kolaborasi</NuxtLink>
          <NuxtLink to="/pengaturan" :class="navClass('/pengaturan')"><AppIcon name="settings" class="h-4 w-4" /> Pengaturan</NuxtLink>
        </nav></div>

        <div class="flex items-center gap-2">
          <!-- Toggle Dark Mode -->
          <button 
            @click="toggleDarkMode" 
            class="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Ubah Mode Tampilan"
            aria-label="Ubah mode tampilan"
          >
            <AppIcon v-if="colorMode.value === 'dark'" name="sun" class="h-4 w-4" />
            <AppIcon v-else name="moon" class="h-4 w-4" />
          </button>

          <!-- User Profile & Logout -->
          <div v-if="user" class="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800">
            <NuxtLink to="/akun" class="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-xs font-bold uppercase text-brand-700 ring-1 ring-brand-100 hover:ring-brand-300 dark:bg-brand-900/30 dark:text-brand-300 dark:ring-brand-800" aria-label="Buka pengaturan akun">{{ userInitial }}</NuxtLink>
            <div class="hidden max-w-40 lg:block"><p class="truncate text-xs font-bold">Akun Guru</p><p class="truncate text-[10px] text-slate-500">{{ user.email }}</p></div>
            <button 
              @click="logout" 
              class="inline-flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30"
              title="Keluar dari akun"
            >
              <AppIcon name="logout" class="h-4 w-4" /><span class="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative mx-auto max-w-7xl px-4 pb-6 pt-[5.5rem] sm:px-6 sm:pb-8 sm:pt-24">
      <slot />
    </main>

    <nav v-if="user" class="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 md:hidden" aria-label="Navigasi mobile"><NuxtLink to="/dashboard" :class="mobileNavClass('/dashboard', true)"><AppIcon name="home" class="h-4 w-4" /> Bank</NuxtLink><NuxtLink to="/analisis" :class="mobileNavClass('/analisis')"><AppIcon name="pie" class="h-4 w-4" /> Analisis</NuxtLink><NuxtLink to="/kolaborasi" :class="mobileNavClass('/kolaborasi')"><AppIcon name="copy" class="h-4 w-4" /> Tim</NuxtLink><NuxtLink to="/pengaturan" :class="mobileNavClass('/pengaturan')"><AppIcon name="settings" class="h-4 w-4" /> Atur</NuxtLink></nav>
    <AppToast />
  </div>
</template>

<script setup>
const colorMode = useColorMode()
const { user, logout } = useAuth()
const route = useRoute()

const userInitial = computed(() => user.value?.email?.charAt(0) || 'G')

const isActive = (path, includeChildren = false) =>
  includeChildren ? route.path.startsWith(path) : route.path === path

const navClass = (path, includeChildren = false) => [
  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
  isActive(path, includeChildren)
    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
]

const mobileNavClass = (path, includeChildren = false) => [
  'flex min-w-0 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-semibold transition',
  isActive(path, includeChildren)
    ? 'bg-brand-600 text-white shadow-sm'
    : 'text-slate-500 dark:text-slate-400',
]

const toggleDarkMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
