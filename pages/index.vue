<template>
  <div class="min-h-screen flex items-center justify-center">
    <p class="text-slate-500">Mengarahkan ke halaman login...</p>
  </div>
</template>

<script setup>
// Mengarahkan otomatis pengguna dari halaman "/" ke halaman "/login"
definePageMeta({
  redirect: '/login'
})
</script>