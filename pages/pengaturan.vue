<!-- pages/pengaturan.vue -->
<template>
  <div class="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
    <h1 class="text-2xl font-bold mb-2">⚙️ Pengaturan Mengajar</h1>
    <p class="text-slate-500 text-sm mb-6">Atur kelas dan mata pelajaran yang Anda ampu agar gudang soal Anda tersusun rapi.</p>

    <div v-if="loading" class="py-8 text-center text-slate-500">Memuat pengaturan...</div>

    <form v-else @submit.prevent="simpanPengaturan" class="space-y-6">
      <!-- Pilih Kelas yang Diajar -->
      <div>
        <label class="block font-semibold mb-2">Kelas yang Anda Ajar:</label>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <label 
            v-for="k in 6" 
            :key="k" 
            :class="[
              'flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition',
              form.kelasAjar.includes(k) 
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 font-bold text-brand-600 dark:text-brand-400' 
                : 'border-slate-300 dark:border-slate-700'
            ]"
          >
            <input type="checkbox" :value="k" v-model="form.kelasAjar" class="hidden" />
            <span>Kelas {{ k }}</span>
          </label>
        </div>
      </div>

      <!-- Pilih / Input Mapel yang Diajar -->
      <div>
        <label class="block font-semibold mb-2">Mata Pelajaran yang Anda Ampu:</label>
        
        <!-- Pilihan Cepat -->
        <div class="flex flex-wrap gap-2 mb-3">
          <button 
            type="button"
            v-for="m in opsiMapelStandar" 
            :key="m"
            @click="toggleMapel(m)"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg border transition',
              form.mapelAjar.includes(m)
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
            ]"
          >
            {{ form.mapelAjar.includes(m) ? '✓ ' + m : '+ ' + m }}
          </button>
        </div>

        <!-- Custom Mapel Input -->
        <div class="flex gap-2">
          <input 
            v-model="mapelBaru" 
            type="text" 
            placeholder="Tambah Mapel Lain (misal: Bahasa Sunda)..." 
            class="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          />
          <button 
            type="button" 
            @click="tambahMapelCustom"
            class="px-4 py-2 bg-slate-200 dark:bg-slate-700 font-medium text-sm rounded-xl hover:bg-slate-300"
          >
            Tambah
          </button>
        </div>
      </div>

      <!-- Tombol Simpan -->
      <button 
        type="submit" 
        :disabled="saving"
        class="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl shadow transition disabled:opacity-50"
      >
        {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { doc, getDoc, setDoc } from 'firebase/firestore'

definePageMeta({ middleware: 'auth' })

const { db } = useFirebase()
const { user } = useAuth()

const loading = ref(true)
const saving = ref(false)
const mapelBaru = ref('')

const opsiMapelStandar = ['Agama', 'PJOK', 'Matematika', 'Bahasa Indonesia', 'IPAS', 'Pancasila/PKn', 'Seni Budaya']

const form = ref({
  kelasAjar: [],
  mapelAjar: []
})

const toggleMapel = (m) => {
  if (form.value.mapelAjar.includes(m)) {
    form.value.mapelAjar = form.value.mapelAjar.filter(item => item !== m)
  } else {
    form.value.mapelAjar.push(m)
  }
}

const tambahMapelCustom = () => {
  if (mapelBaru.value.trim() && !form.value.mapelAjar.includes(mapelBaru.value.trim())) {
    form.value.mapelAjar.push(mapelBaru.value.trim())
    mapelBaru.value = ''
  }
}

const loadPengaturan = async () => {
  if (!user.value) return
  try {
    const docRef = doc(db, 'pengaturanGuru', user.value.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      form.value = docSnap.data()
    }
  } catch (e) {
    console.error('Gagal memuat pengaturan:', e)
  } finally {
    loading.value = false
  }
}

const simpanPengaturan = async () => {
  if (!user.value) return
  saving.value = true
  try {
    await setDoc(doc(db, 'pengaturanGuru', user.value.uid), {
      kelasAjar: form.value.kelasAjar,
      mapelAjar: form.value.mapelAjar
    })
    alert('Pengaturan berhasil disimpan!')
    navigateTo('/dashboard')
  } catch (e) {
    alert('Gagal menyimpan pengaturan.')
  } finally {
    saving.value = false
  }
}

onMounted(() => loadPengaturan())
</script>