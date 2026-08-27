<template>
  <div
    class="pointer-events-none fixed left-1/2 top-4 z-[300] w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 space-y-2 sm:left-auto sm:right-4 sm:top-20 sm:translate-x-0"
    role="region"
    aria-label="Notifikasi"
    aria-live="polite"
    aria-atomic="true"
  >
    <TransitionGroup name="toast">
      <div v-for="item in items" :key="item.id" :class="['pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-3 text-sm shadow-xl dark:bg-slate-800', colors[item.kind]]" role="status">
        <AppIcon :name="item.kind === 'success' ? 'check' : item.kind === 'error' || item.kind === 'warning' ? 'alert' : 'file'" class="mt-0.5 h-4 w-4 shrink-0" />
        <p class="flex-1 leading-relaxed">{{ item.message }}</p><button @click="dismiss(item.id)" class="rounded p-1 opacity-60 hover:opacity-100" aria-label="Tutup notifikasi"><AppIcon name="x" class="h-3.5 w-3.5" /></button>
      </div>
    </TransitionGroup>
  </div>
</template>
<script setup>
const { items, dismiss } = useToast()
const colors = { success: 'border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300', error: 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-300', warning: 'border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300', info: 'border-brand-200 text-brand-700 dark:border-brand-800 dark:text-brand-300' }
</script>
<style scoped>
.toast-enter-active,.toast-leave-active{transition:.2s ease}.toast-enter-from,.toast-leave-to{opacity:0;transform:translateX(1rem)}
</style>
