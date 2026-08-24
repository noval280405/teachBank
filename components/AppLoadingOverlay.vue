<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="loading-overlay">
        <div
          v-if="show"
          class="fixed inset-0 z-[250] grid place-items-center overflow-hidden bg-slate-950/55 p-5 backdrop-blur-md"
          role="status"
          aria-live="polite"
          :aria-label="title"
        >
          <div class="pointer-events-none absolute inset-0">
            <span class="absolute left-[12%] top-[18%] h-28 w-28 rounded-full bg-brand-400/20 blur-3xl"></span>
            <span class="absolute bottom-[16%] right-[12%] h-36 w-36 rounded-full bg-indigo-400/20 blur-3xl"></span>
          </div>

          <div class="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/60 bg-white/95 p-7 text-center shadow-2xl shadow-slate-950/25 dark:border-slate-700 dark:bg-slate-900/95">
            <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-indigo-500 to-amber-400"></div>

            <div class="relative mx-auto mb-5 h-24 w-24">
              <span class="loading-ring absolute inset-0 rounded-full border-2 border-dashed border-brand-300 dark:border-brand-700"></span>
              <span class="absolute inset-3 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/30"></span>
              <span class="absolute inset-0 grid place-items-center text-white">
                <AppIcon name="book" class="h-9 w-9" />
              </span>
              <span class="loading-spark absolute right-0 top-1 grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-amber-950 shadow-md">
                <AppIcon name="sparkle" class="h-4 w-4" />
              </span>
            </div>

            <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-600 dark:text-brand-300">TeachBank</p>
            <h2 class="mt-2 text-lg font-bold text-slate-800 dark:text-white">{{ title }}</h2>
            <p class="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{{ description }}</p>

            <div class="mx-auto mt-5 flex w-20 justify-center gap-1.5" aria-hidden="true">
              <span v-for="item in 3" :key="item" class="loading-dot h-2 w-2 rounded-full bg-brand-500" :style="{ animationDelay: `${(item - 1) * 160}ms` }"></span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: "Menyiapkan TeachBank" },
  description: { type: String, default: "Mohon tunggu sebentar, data terbaik sedang kami siapkan." },
});
</script>

<style scoped>
.loading-ring { animation: loading-spin 8s linear infinite; }
.loading-spark { animation: loading-float 1.8s ease-in-out infinite; }
.loading-dot { animation: loading-bounce 1s ease-in-out infinite; }
.loading-overlay-enter-active,
.loading-overlay-leave-active { transition: opacity 180ms ease; }
.loading-overlay-enter-active > div:last-child,
.loading-overlay-leave-active > div:last-child { transition: transform 180ms ease, opacity 180ms ease; }
.loading-overlay-enter-from,
.loading-overlay-leave-to { opacity: 0; }
.loading-overlay-enter-from > div:last-child,
.loading-overlay-leave-to > div:last-child { opacity: 0; transform: translateY(10px) scale(.97); }
@keyframes loading-spin { to { transform: rotate(360deg); } }
@keyframes loading-float { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-7px) rotate(5deg); } }
@keyframes loading-bounce { 0%, 100% { opacity: .3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-5px); } }
@media (prefers-reduced-motion: reduce) {
  .loading-ring, .loading-spark, .loading-dot { animation: none; }
}
</style>
