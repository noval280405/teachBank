<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold">Pilih Kelas SD</h1>
      <p class="text-slate-500 dark:text-slate-400">Silakan pilih kelas untuk mengelola bank soal dan mata pelajaran Anda.</p>
    </div>

    <!-- Grid Kelas 1-6 SD -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <NuxtLink 
        v-for="kelas in 6" 
        :key="kelas" 
        :to="`/dashboard/kelas/${kelas}`"
        class="group p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-500 transition duration-200"
      >
        <div class="flex justify-between items-center">
          <div class="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 font-bold text-xl flex items-center justify-center">
            {{ kelas }}
          </div>
          <span class="text-slate-400 group-hover:translate-x-1 transition-transform">➡️</span>
        </div>
        <h2 class="text-lg font-bold mt-4">Kelas {{ kelas }} SD</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola soal, kuis, dan materi kelas {{ kelas }}.</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
</script>