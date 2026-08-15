<!-- pages/dashboard/index.vue -->
<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">Pilih Kelas Ajar</h1>
        <p class="text-slate-500 text-sm mt-1">
          Gudang soal disesuaikan dengan kelas dan mapel yang Anda ampu.
        </p>
      </div>
      <NuxtLink
        to="/pengaturan"
        class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        ⚙️ Atur Kelas & Mapel
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-500">
      Memuat data kelas...
    </div>

    <!-- Jika belum atur kelas -->
    <div
      v-else-if="kelasAjar.length === 0"
      class="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border p-8"
    >
      <p class="text-slate-500 mb-4">
        Anda belum memilih kelas yang Anda ajar.
      </p>
      <NuxtLink
        to="/pengaturan"
        class="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium"
        >Atur Pengaturan Mengajar</NuxtLink
      >
    </div>

    <!-- Grid Kelas Sesuai Pengaturan Guru -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <NuxtLink
        v-for="kelas in kelasAjar"
        :key="kelas"
        :to="`/dashboard/kelas/${kelas}`"
        class="group p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-500 transition"
      >
        <div class="flex justify-between items-center">
          <div
            class="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 font-bold text-xl flex items-center justify-center"
          >
            {{ kelas }}
          </div>
          <span
            class="text-slate-400 group-hover:translate-x-1 transition-transform"
            >➡️</span
          >
        </div>
        <h2 class="text-lg font-bold mt-4">Kelas {{ kelas }} SD</h2>
        <p class="text-xs text-slate-500 mt-1">
          Mapel: {{ mapelAjar.join(", ") }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { doc, getDoc } from "firebase/firestore";
definePageMeta({ middleware: "auth" });

const { db } = useFirebase();
const { user } = useAuth();

const loading = ref(true);
const kelasAjar = ref([]);
const mapelAjar = ref([]);

onMounted(async () => {
  if (user.value) {
    const docRef = doc(db, "pengaturanGuru", user.value.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      kelasAjar.value = data.kelasAjar || [];
      mapelAjar.value = data.mapelAjar || [];
    }
  }
  loading.value = false;
});
</script>
