<!-- pages/dashboard/kelas/[id]/cetak.vue -->
<template>
  <ClientOnly>
    <div class="max-w-5xl mx-auto space-y-6 pb-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <NuxtLink :to="`/dashboard/kelas/${kelasId}`" class="text-sm text-brand-600 dark:text-brand-400 hover:underline">← Kembali ke Bank Soal</NuxtLink>
          <h1 class="text-2xl font-bold mt-1">🖨️ Generator Cetak Ujian - Kelas {{ kelasId }} SD</h1>
        </div>
        
        <div class="flex items-center gap-2">
          <select v-model="selectedMapel" class="px-3 py-2 border rounded-xl bg-white dark:bg-slate-800 text-sm font-semibold">
            <option v-for="m in mapelAjar" :key="m" :value="m">{{ m }}</option>
          </select>
          <button 
            @click="bukaKertasCetak" 
            :disabled="terpilihPG.length === 0 && terpilihEssay.length === 0" 
            class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow disabled:opacity-50 transition"
          >
            🖨️ Cetak Lembar Ujian ({{ terpilihPG.length + terpilihEssay.length }} Soal)
          </button>
        </div>
      </div>

      <!-- Panel Kontrol Pengaturan Jumlah Soal -->
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Pengaturan PG -->
        <div class="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700">
          <div class="flex justify-between items-center">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Input Target PG</label>
            <span class="text-xs text-slate-500">Tersedia: {{ listSoalPG.length }} soal</span>
          </div>
          <div class="flex gap-2">
            <input 
              v-model.number="targetJumlahPG" 
              type="number" 
              min="1" 
              :max="listSoalPG.length" 
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium" 
              placeholder="Jumlah PG (Misal: 15)" 
            />
          </div>
          <div class="flex gap-2 pt-1">
            <button @click="pilihSemuaDenganLimit('pg')" class="flex-1 py-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-lg text-xs font-semibold hover:bg-brand-100">
              ✅ Pilih Semua (Maks {{ targetJumlahPG }})
            </button>
            <button @click="pilihAcak('pg')" class="flex-1 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-semibold hover:bg-purple-100">
              🎲 Acak ({{ targetJumlahPG }} Soal)
            </button>
          </div>
        </div>

        <!-- Pengaturan Essay -->
        <div class="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700">
          <div class="flex justify-between items-center">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Input Target Essay</label>
            <span class="text-xs text-slate-500">Tersedia: {{ listSoalEssay.length }} soal</span>
          </div>
          <div class="flex gap-2">
            <input 
              v-model.number="targetJumlahEssay" 
              type="number" 
              min="1" 
              :max="listSoalEssay.length" 
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium" 
              placeholder="Jumlah Essay (Misal: 5)" 
            />
          </div>
          <div class="flex gap-2 pt-1">
            <button @click="pilihSemuaDenganLimit('essay')" class="flex-1 py-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-lg text-xs font-semibold hover:bg-brand-100">
              ✅ Pilih Semua (Maks {{ targetJumlahEssay }})
            </button>
            <button @click="pilihAcak('essay')" class="flex-1 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-semibold hover:bg-purple-100">
              🎲 Acak ({{ targetJumlahEssay }} Soal)
            </button>
          </div>
        </div>
      </div>

      <!-- Tombol Clear / Reset -->
      <div class="flex justify-between items-center text-xs">
        <span class="text-slate-500">Total soal terpilih saat ini: <b>{{ terpilihPG.length }} PG</b> dan <b>{{ terpilihEssay.length }} Essay</b></span>
        <button @click="resetPilihan" class="text-red-500 hover:underline font-semibold">Clear Semua Pilihan</button>
      </div>

      <!-- Tab Jenis Soal -->
      <div class="flex border-b border-slate-200 dark:border-slate-700">
        <button @click="activeTab = 'pg'" :class="['px-5 py-2.5 font-bold text-sm border-b-2 transition', activeTab === 'pg' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400']">
          Pilihan Ganda (Terpilih {{ terpilihPG.length }}/{{ targetJumlahPG }})
        </button>
        <button @click="activeTab = 'essay'" :class="['px-5 py-2.5 font-bold text-sm border-b-2 transition', activeTab === 'essay' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400']">
          Essay / Uraian (Terpilih {{ terpilihEssay.length }}/{{ targetJumlahEssay }})
        </button>
      </div>

      <!-- Daftar Soal PG -->
      <div v-if="activeTab === 'pg'" class="space-y-3">
        <div 
          v-for="soal in listSoalPG" 
          :key="soal.id" 
          :class="['p-4 rounded-xl border transition flex items-start gap-4 cursor-pointer', terpilihPG.includes(soal.id) ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700']" 
          @click="togglePilih(soal.id, 'pg')"
        >
          <input type="checkbox" :checked="terpilihPG.includes(soal.id)" class="mt-1 rounded text-brand-600" />
          <div class="flex-1 space-y-1">
            <div class="flex items-center gap-2">
              <span v-if="soal.dipakai" class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">⚠️ Sudah Pernah Dicetak</span>
              <span v-else class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">✨ Belum Pernah Dipakai</span>
            </div>
            <p class="font-medium text-sm text-slate-800 dark:text-slate-100">{{ soal.pertanyaan }}</p>
          </div>
        </div>
      </div>

      <!-- Daftar Soal Essay -->
      <div v-if="activeTab === 'essay'" class="space-y-3">
        <div 
          v-for="soal in listSoalEssay" 
          :key="soal.id" 
          :class="['p-4 rounded-xl border transition flex items-start gap-4 cursor-pointer', terpilihEssay.includes(soal.id) ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700']" 
          @click="togglePilih(soal.id, 'essay')"
        >
          <input type="checkbox" :checked="terpilihEssay.includes(soal.id)" class="mt-1 rounded text-brand-600" />
          <div class="flex-1 space-y-1">
            <div class="flex items-center gap-2">
              <span v-if="soal.dipakai" class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">⚠️ Sudah Pernah Dicetak</span>
              <span v-else class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">✨ Belum Pernah Dipakai</span>
            </div>
            <p class="font-medium text-sm text-slate-800 dark:text-slate-100">{{ soal.pertanyaan }}</p>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const kelasId = Number(route.params.id)
const { db } = useFirebase()
const { user } = useAuth()

const activeTab = ref('pg')
const mapelAjar = ref([])
const selectedMapel = ref('')
const listSoalPG = ref([])
const listSoalEssay = ref([])

const terpilihPG = ref([])
const terpilihEssay = ref([])

const targetJumlahPG = ref(15)
const targetJumlahEssay = ref(5)

const loadPengaturan = async () => {
  if (!user.value) return
  const docSnap = await getDoc(doc(db, 'pengaturanGuru', user.value.uid))
  if (docSnap.exists()) {
    mapelAjar.value = docSnap.data().mapelAjar || []
    if (mapelAjar.value.length > 0) selectedMapel.value = mapelAjar.value[0]
  }
}

const loadSoal = async () => {
  if (!user.value || !selectedMapel.value) return
  const q = query(
    collection(db, 'soal'),
    where('userId', '==', user.value.uid),
    where('kelas', '==', kelasId),
    where('mapel', '==', selectedMapel.value)
  )
  const snap = await getDocs(q)
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  listSoalPG.value = all.filter(s => s.tipe !== 'essay')
  listSoalEssay.value = all.filter(s => s.tipe === 'essay')
}

const togglePilih = (id, tipe) => {
  const target = tipe === 'pg' ? terpilihPG : terpilihEssay
  const limit = tipe === 'pg' ? targetJumlahPG.value : targetJumlahEssay.value

  if (target.value.includes(id)) {
    target.value = target.value.filter(item => item !== id)
  } else {
    if (target.value.length >= limit) {
      alert(`Batas maksimum pemilihan untuk tipe ini adalah ${limit} soal (sesuai input target).`)
      return
    }
    target.value.push(id)
  }
}

// Fitur Pilih Semua (Dibatasi oleh Input Target)
const pilihSemuaDenganLimit = (tipe) => {
  const list = tipe === 'pg' ? listSoalPG.value : listSoalEssay.value
  const limit = tipe === 'pg' ? targetJumlahPG.value : targetJumlahEssay.value

  // Ambil sebanyak target batas limit
  const selectedIds = list.slice(0, limit).map(s => s.id)

  if (tipe === 'pg') terpilihPG.value = selectedIds
  else terpilihEssay.value = selectedIds
}

// Fitur Pilih Acak (Dibatasi oleh Input Target)
const pilihAcak = (tipe) => {
  const list = tipe === 'pg' ? listSoalPG.value : listSoalEssay.value
  const limit = tipe === 'pg' ? targetJumlahPG.value : targetJumlahEssay.value

  const shuffled = [...list].sort(() => 0.5 - Math.random())
  const selectedIds = shuffled.slice(0, limit).map(s => s.id)
  
  if (tipe === 'pg') terpilihPG.value = selectedIds
  else terpilihEssay.value = selectedIds
}

const resetPilihan = () => {
  terpilihPG.value = []
  terpilihEssay.value = []
}

const bukaKertasCetak = async () => {
  // 1. Langsung buka window baru (Mencegah Popup Blocker Browser)
  const printWindow = window.open('', '_blank')

  // 2. Simpan payload data pilihan ke LocalStorage
  const printData = {
    kelas: kelasId,
    mapel: selectedMapel.value,
    pg: listSoalPG.value.filter(s => terpilihPG.value.includes(s.id)),
    essay: listSoalEssay.value.filter(s => terpilihEssay.value.includes(s.id))
  }
  localStorage.setItem('teachbank_print_payload', JSON.stringify(printData))

  // 3. Arahkan window yang baru dibuka ke halaman print
  if (printWindow) {
    printWindow.location.href = `/dashboard/kelas/${kelasId}/print`
  }

  // 4. Update status dokumen di Firestore (di background tanpa menahan window)
  const ids = [...terpilihPG.value, ...terpilihEssay.value]
  for (const id of ids) {
    updateDoc(doc(db, 'soal', id), { dipakai: true, terakhirDipakai: new Date() })
  }
}

watch(selectedMapel, () => {
  resetPilihan()
  loadSoal()
})

onMounted(async () => {
  await loadPengaturan()
  loadSoal()
})
</script>