<template>
  <div>
    <!-- Header Navigation -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <NuxtLink to="/dashboard" class="text-sm text-brand-600 dark:text-brand-400 hover:underline">← Kembali ke Dashboard</NuxtLink>
        <h1 class="text-2xl font-bold mt-1">Gudang Soal Kelas {{ kelasId }} SD</h1>
      </div>

      <div class="flex gap-2 w-full sm:w-auto">
        <!-- Filter Mapel Terpisah (Hanya Mapel yang Diajar Guru Ini) -->
        <select 
          v-if="mapelAjar.length > 0"
          v-model="selectedMapel" 
          class="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-semibold text-sm outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option v-for="m in mapelAjar" :key="m" :value="m">{{ m }}</option>
        </select>

        <button 
          @click="showModalTambah = true"
          :disabled="!selectedMapel"
          class="bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-xl transition shadow text-sm disabled:opacity-50"
        >
          + Buat Soal
        </button>
      </div>
    </div>

    <!-- State Loading -->
    <div v-if="loadingData" class="text-center py-12 text-slate-500">Memuat data soal...</div>
    
    <!-- State Belum Ada Mapel -->
    <div v-else-if="mapelAjar.length === 0" class="text-center py-12 text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border p-6">
      <p class="mb-4">Anda belum menambahkan Mata Pelajaran di Pengaturan.</p>
      <NuxtLink to="/pengaturan" class="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl">Atur Mapel Sekarang</NuxtLink>
    </div>

    <!-- State Kosong Soal -->
    <div v-else-if="daftarSoal.length === 0" class="text-center py-12 text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border">
      Belum ada soal untuk mata pelajaran <b>{{ selectedMapel }}</b> di Kelas {{ kelasId }}.
    </div>

    <!-- Daftar Soal Pilihan Ganda -->
    <div v-else class="space-y-4">
      <div 
        v-for="(item, index) in daftarSoal" 
        :key="item.id" 
        class="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div class="flex justify-between items-start gap-4 mb-3">
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
            Soal #{{ index + 1 }} - {{ item.mapel }}
          </span>
          <button @click="hapusSoal(item.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
        </div>

        <p class="font-bold text-base mb-3">{{ item.pertanyaan }}</p>

        <!-- Display Opsi A, B, C, D (Urutan Terjamin) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
          <div 
            v-for="kunci in ['a', 'b', 'c', 'd']" 
            :key="kunci"
            v-show="item.opsi && item.opsi[kunci]"
            :class="[
              'p-2.5 rounded-xl border transition',
              item.kunciJawaban === kunci 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 font-semibold text-green-700 dark:text-green-300' 
                : 'border-slate-200 dark:border-slate-700'
            ]"
          >
            <span class="uppercase font-bold mr-1">{{ kunci }}.</span> {{ item.opsi[kunci] }}
            <span v-if="item.kunciJawaban === kunci" class="ml-2 text-xs">✓ (Kunci)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form Input Soal Pilihan Ganda (A-D) -->
    <div v-if="showModalTambah" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-white dark:bg-slate-800 w-full max-w-lg p-6 rounded-2xl shadow-xl space-y-4 my-8">
        <h2 class="text-xl font-bold">Buat Soal Pilihan Ganda ({{ selectedMapel }})</h2>
        
        <div>
          <label class="block text-sm font-medium mb-1">Pertanyaan Soal</label>
          <textarea 
            v-model="formSoal.pertanyaan" 
            rows="3" 
            placeholder="Tuliskan pertanyaan di sini..."
            class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          ></textarea>
        </div>

        <!-- Tips Pengecoh Jawaban -->
        <div class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
          💡 <b>Tips Guru:</b> Buatlah jawaban salah (pengecoh) yang realistis dan mendekati jawaban benar agar melatih ketelitian siswa.
        </div>

        <!-- Input Opsi A - D -->
        <div class="space-y-2">
          <label class="block text-sm font-medium">Pilihan Jawaban A, B, C, D:</label>
          
          <div v-for="kunci in ['a', 'b', 'c', 'd']" :key="kunci" class="flex items-center gap-2">
            <span class="font-bold uppercase w-4 text-center text-sm">{{ kunci }}</span>
            <input 
              v-model="formSoal.opsi[kunci]"
              type="text" 
              :placeholder="`Jawaban ${kunci.toUpperCase()}`"
              class="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-brand-500"
            />
            <!-- Radio Button Kunci Jawaban -->
            <label class="flex items-center gap-1 text-xs cursor-pointer px-2 py-1 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-700">
              <input type="radio" name="kunciJawaban" :value="kunci" v-model="formSoal.kunciJawaban" />
              <span>Kunci</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <button @click="showModalTambah = false" class="px-4 py-2 text-sm text-slate-500 rounded-xl">Batal</button>
          <button @click="simpanSoal" class="px-5 py-2 text-sm bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow">Simpan Soal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore'

definePageMeta({ 
  middleware: 'auth',
  key: route => route.fullPath // Mencegah bug cache saat pindah antar-kelas
})

const route = useRoute()
const kelasId = route.params.id
const { db } = useFirebase()
const { user, initAuth } = useAuth()

const mapelAjar = ref([])
const selectedMapel = ref('')
const daftarSoal = ref([])
const loadingData = ref(true)
const showModalTambah = ref(false)

const formSoal = ref({
  pertanyaan: '',
  opsi: { a: '', b: '', c: '', d: '' },
  kunciJawaban: 'a'
})

// Load Mapel Guru dari Firestore
const loadPengaturanGuru = async () => {
  if (!user.value) return
  try {
    const docRef = doc(db, 'pengaturanGuru', user.value.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      mapelAjar.value = docSnap.data().mapelAjar || []
      if (mapelAjar.value.length > 0 && !selectedMapel.value) {
        selectedMapel.value = mapelAjar.value[0]
      }
    }
  } catch (e) {
    console.error('Gagal memuat pengaturan guru:', e)
  }
}

// Load Soal per User, Kelas, dan Mapel
const loadSoal = async () => {
  if (!user.value || !selectedMapel.value) {
    loadingData.value = false
    return
  }
  loadingData.value = true
  try {
    const q = query(
      collection(db, 'soal'),
      where('userId', '==', user.value.uid),
      where('kelas', '==', Number(kelasId)),
      where('mapel', '==', selectedMapel.value)
    )
    const snapshot = await getDocs(q)
    daftarSoal.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    console.error('Gagal memuat soal:', e)
  } finally {
    loadingData.value = false
  }
}

const simpanSoal = async () => {
  if (!formSoal.value.pertanyaan || !formSoal.value.opsi.a || !formSoal.value.opsi.b) {
    alert('Harap isi pertanyaan dan minimal pilihan A dan B!')
    return
  }
  try {
    await addDoc(collection(db, 'soal'), {
      userId: user.value.uid,
      kelas: Number(kelasId),
      mapel: selectedMapel.value,
      pertanyaan: formSoal.value.pertanyaan,
      opsi: formSoal.value.opsi,
      kunciJawaban: formSoal.value.kunciJawaban,
      createdAt: new Date()
    })
    
    // Reset Form
    formSoal.value.pertanyaan = ''
    formSoal.value.opsi = { a: '', b: '', c: '', d: '' }
    formSoal.value.kunciJawaban = 'a'
    showModalTambah.value = false
    await loadSoal()
  } catch (e) {
    console.error('Gagal menyimpan soal:', e)
  }
}

const hapusSoal = async (id) => {
  if (confirm('Hapus soal ini dari gudang?')) {
    await deleteDoc(doc(db, 'soal', id))
    await loadSoal()
  }
}

watch(selectedMapel, () => {
  if (selectedMapel.value) loadSoal()
})

onMounted(async () => {
  if (initAuth) await initAuth()
  await loadPengaturanGuru()
  await loadSoal()
})
</script>