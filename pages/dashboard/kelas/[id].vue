<template>
  <div>
    <!-- Header Navigation -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <NuxtLink to="/dashboard" class="text-sm text-brand-600 dark:text-brand-400 hover:underline">← Kembali ke Dashboard</NuxtLink>
        <h1 class="text-2xl font-bold mt-1">Gudang Soal Kelas {{ kelasId }} SD</h1>
      </div>

      <!-- Filter/Tambah Mapel -->
      <div class="flex gap-2">
        <select 
          v-model="selectedMapel" 
          class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        >
          <option v-for="mapel in daftarMapel" :key="mapel" :value="mapel">{{ mapel }}</option>
        </select>
        <button 
          @click="showModalTambah = true"
          class="bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-xl transition shadow"
        >
          + Tambah Soal
        </button>
      </div>
    </div>

    <!-- Daftar Soal -->
    <div v-if="loadingData" class="text-center py-12">Memuat data soal...</div>
    <div v-else-if="daftarSoal.length === 0" class="text-center py-12 text-slate-500">
      Belum ada soal untuk mata pelajaran <b>{{ selectedMapel }}</b> di Kelas {{ kelasId }}.
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="(item, index) in daftarSoal" 
        :key="item.id" 
        class="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div class="flex justify-between items-start gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700">
                Soal #{{ index + 1 }}
              </span>
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                {{ item.tingkatKesulitan || 'Sedang' }}
              </span>
            </div>
            <p class="font-medium text-base whitespace-pre-line">{{ item.pertanyaan }}</p>
            <div class="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
              Kunci Jawaban: {{ item.kunciJawaban }}
            </div>
          </div>
          <button @click="hapusSoal(item.id)" class="text-red-500 hover:text-red-700 text-sm">Hapus</button>
        </div>
      </div>
    </div>

    <!-- Modal Form Tambah Soal -->
    <div v-if="showModalTambah" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 w-full max-w-lg p-6 rounded-2xl shadow-xl space-y-4">
        <h2 class="text-xl font-bold">Tambah Soal {{ selectedMapel }}</h2>
        
        <div>
          <label class="block text-sm font-medium mb-1">Pertanyaan Soal</label>
          <textarea 
            v-model="formSoal.pertanyaan" 
            rows="3" 
            placeholder="Tuliskan teks pertanyaan soal..."
            class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Kunci Jawaban / Pembahasan</label>
          <input 
            v-model="formSoal.kunciJawaban" 
            type="text" 
            placeholder="Contoh: A atau Pembahasan singkat"
            class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button @click="showModalTambah = false" class="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl">Batal</button>
          <button @click="simpanSoal" class="px-4 py-2 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700">Simpan Soal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'

const route = useRoute()
const kelasId = route.params.id
const { db } = useFirebase()
const { user } = useAuth()

const daftarMapel = ['Matematika', 'Bahasa Indonesia', 'IPAS', 'Pancasila/PKn', 'Seni Budaya', 'Agama']
const selectedMapel = ref(daftarMapel[0])
const daftarSoal = ref([])
const loadingData = ref(true)
const showModalTambah = ref(false)

const formSoal = ref({
  pertanyaan: '',
  kunciJawaban: '',
  tingkatKesulitan: 'Sedang'
})

// Load Soal dari Firestore berdasarkan ID Guru (User), Kelas, dan Mapel
const loadSoal = async () => {
  if (!user.value) return
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
    console.error('Gagal mengambil data soal:', e)
  } finally {
    loadingData.value = false
  }
}

const simpanSoal = async () => {
  if (!formSoal.value.pertanyaan) return
  try {
    await addDoc(collection(db, 'soal'), {
      userId: user.value.uid,
      kelas: Number(kelasId),
      mapel: selectedMapel.value,
      pertanyaan: formSoal.value.pertanyaan,
      kunciJawaban: formSoal.value.kunciJawaban,
      createdAt: new Date()
    })
    formSoal.value.pertanyaan = ''
    formSoal.value.kunciJawaban = ''
    showModalTambah.value = false
    loadSoal()
  } catch (e) {
    console.error('Gagal menyimpan soal:', e)
  }
}

const hapusSoal = async (id) => {
  if (confirm('Yakin ingin menghapus soal ini?')) {
    await deleteDoc(doc(db, 'soal', id))
    loadSoal()
  }
}

watch(selectedMapel, () => loadSoal())
onMounted(() => loadSoal())
</script>