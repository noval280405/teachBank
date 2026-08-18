<!-- pages/dashboard/kelas/[id]/print.vue -->
<template>
  <ClientOnly>
    <div class="bg-slate-100 min-h-screen p-4 print:p-0 print:bg-white text-slate-900 font-serif">
      
      <!-- Toolbar Pengaturan Cetak (Sembunyi saat cetak) -->
      <div class="max-w-[210mm] mx-auto mb-4 p-4 bg-white rounded-2xl shadow-md border border-slate-200 flex flex-wrap justify-between items-center gap-3 print:hidden font-sans">
        <div>
          <NuxtLink :to="`/dashboard/kelas/${printData.kelas || ''}/cetak`" class="text-xs text-brand-600 hover:underline font-semibold">
            ← Kembali ke Generator Cetak
          </NuxtLink>
          <h1 class="font-bold text-slate-800 text-lg">Pratinjau Lembar Ujian</h1>
          <p class="text-xs text-slate-500">Gunakan opsi di bawah untuk menyesuaikan tampilan kertas sebelum mencetak.</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Toggle Layout 2 Kolom -->
          <label class="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none">
            <input type="checkbox" v-model="duaKolom" class="rounded text-brand-600" />
            <span>2 Kolom (Hemat Kertas)</span>
          </label>

          <!-- Toggle Lembar Kunci Jawaban -->
          <label class="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none">
            <input type="checkbox" v-model="tampilkanKunci" class="rounded text-brand-600" />
            <span>Kunci Jawaban Guru</span>
          </label>

          <button 
            @click="triggerPrint" 
            class="bg-brand-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-brand-700 shadow transition flex items-center gap-2"
          >
            🖨️ Cetak / Simpan PDF
          </button>
        </div>
      </div>

      <!-- Lembar Kertas Ujian (Ukuran A4) -->
      <div class="kertas-ujian max-w-[210mm] mx-auto bg-white p-[12mm] sm:p-[15mm] border print:border-none print:p-0 shadow-xl print:shadow-none text-black leading-relaxed">
        
        <!-- Kop Ujian Sekolah (Dinamis dari Data Input) -->
        <div class="border-b-4 border-double border-black pb-3 mb-4 text-center">
          <h2 class="text-xl font-bold uppercase tracking-wider">{{ printData.infoUjian?.namaSekolah || 'SD NEGERI UTAMA' }}</h2>
          <h3 class="text-base font-bold uppercase tracking-wide">
            {{ printData.infoUjian?.namaUjian || 'PENILAIAN TENGAH SEMESTER (PTS)' }}
          </h3>
          <p class="text-xs italic mt-0.5">Tahun Ajaran {{ printData.infoUjian?.tahunAjaran || '2025/2026' }}</p>
        </div>

        <!-- Tabel Identitas Siswa -->
        <div class="border border-black p-2.5 mb-5 font-sans">
          <table class="w-full text-xs border-collapse">
            <tbody>
              <tr>
                <td class="py-1 font-bold w-28">MATA PELAJARAN</td>
                <td class="py-1">: {{ printData.mapel || '-' }}</td>
                <td class="py-1 font-bold w-28">HARI / TANGGAL</td>
                <td class="py-1">: .......................................</td>
              </tr>
              <tr>
                <td class="py-1 font-bold">KELAS</td>
                <td class="py-1">: {{ printData.kelas }} {{ printData.jenjang || 'SD' }}</td>
                <td class="py-1 font-bold">WAKTU</td>
                <td class="py-1">: 90 Menit</td>
              </tr>
              <tr>
                <td class="py-1 font-bold">NAMA SISWA</td>
                <td class="py-1">: ...................................................</td>
                <td class="py-1 font-bold">NOMOR ABSEN</td>
                <td class="py-1">: ....................</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Bagian I: Pilihan Ganda -->
        <div v-if="printData.pg && printData.pg.length > 0" class="mb-6 font-sans">
          <p class="font-bold text-xs mb-3">I. Berilah tanda silang (X) pada huruf a, b, c, atau d di depan jawaban yang paling benar!</p>
          
          <div :class="[duaKolom ? 'columns-1 sm:columns-2 print:columns-2 gap-6' : 'space-y-3']">
            <div 
              v-for="(soal, index) in printData.pg" 
              :key="soal.id" 
              class="break-inside-avoid mb-4 text-xs leading-snug"
            >
              <!-- Pertanyaan -->
              <div class="flex items-start gap-1.5 font-medium">
                <span class="font-bold w-6 shrink-0 text-right">{{ index + 1 }}.</span>
                <div class="flex-1 text-slate-900">
                  <p>{{ soal.pertanyaan }}</p>

                  <!-- Gambar Soal PG (Jika Ada) -->
                  <div v-if="soal.imageUrl" class="my-2">
                    <img 
                      :src="soal.imageUrl" 
                      alt="Gambar Soal" 
                      class="max-h-40 max-w-full object-contain rounded border border-slate-200 print:border-black p-0.5"
                    />
                  </div>
                </div>
              </div>

              <!-- Pilihan Jawaban A-D -->
              <div class="pl-7 mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1">
                <div v-for="kunci in ['a', 'b', 'c', 'd']" :key="kunci" v-show="soal.opsi?.[kunci]">
                  <span class="font-bold uppercase">{{ kunci }}.</span> {{ soal.opsi[kunci] }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bagian II: Essay / Uraian -->
        <div v-if="printData.essay && printData.essay.length > 0" class="mb-6 font-sans break-inside-avoid">
          <p class="font-bold text-xs mb-3">II. Jawablah pertanyaan-pertanyaan di bawah ini dengan singkat dan tepat!</p>
          
          <div class="space-y-4">
            <div 
              v-for="(soal, index) in printData.essay" 
              :key="soal.id" 
              class="break-inside-avoid text-xs"
            >
              <div class="flex items-start gap-1.5 font-medium">
                <span class="font-bold w-6 shrink-0 text-right">{{ (printData.pg?.length || 0) + index + 1 }}.</span>
                <div class="flex-1 text-slate-900">
                  <p>{{ soal.pertanyaan }}</p>

                  <!-- Gambar Soal Essay (Jika Ada) -->
                  <div v-if="soal.imageUrl" class="my-2">
                    <img 
                      :src="soal.imageUrl" 
                      alt="Gambar Soal Essay" 
                      class="max-h-48 max-w-full object-contain rounded border border-slate-200 print:border-black p-0.5"
                    />
                  </div>
                </div>
              </div>

              <!-- Garis Tempat Jawaban Siswa -->
              <div class="pl-7 mt-2 space-y-2">
                <div class="border-b border-dotted border-slate-400 h-4 w-full"></div>
                <div class="border-b border-dotted border-slate-400 h-4 w-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lembar Kunci Jawaban TERPISAH (Khusus Pegangan Guru) -->
        <div v-if="tampilkanKunci" class="break-before-page pt-6 border-t-2 border-dashed border-black font-sans">
          <div class="text-center mb-4">
            <h3 class="text-sm font-bold uppercase">Kunci Jawaban & Pegangan Guru</h3>
            <p class="text-[11px] text-slate-600">Mata Pelajaran: {{ printData.mapel }} | Kelas {{ printData.kelas }} {{ printData.jenjang || 'SD' }}</p>
          </div>

          <div class="grid grid-cols-5 gap-2 text-xs">
            <div 
              v-for="(soal, index) in printData.pg" 
              :key="'kunci-pg-' + soal.id" 
              class="p-1.5 border border-slate-300 rounded text-center"
            >
              <span class="font-bold">{{ index + 1 }}.</span> 
              <span class="uppercase font-extrabold ml-1 text-brand-600">{{ soal.kunciJawaban || '-' }}</span>
            </div>
          </div>

          <div v-if="printData.essay && printData.essay.length > 0" class="mt-4 space-y-2">
            <h4 class="text-xs font-bold uppercase">Pedoman / Kunci Jawaban Essay:</h4>
            <div 
              v-for="(soal, index) in printData.essay" 
              :key="'kunci-essay-' + soal.id" 
              class="text-xs p-2 border border-slate-200 rounded bg-slate-50 print:bg-transparent"
            >
              <p class="font-bold">Soal #{{ (printData.pg?.length || 0) + index + 1 }}:</p>
              <p class="italic text-slate-700 print:text-black mb-1">{{ soal.kunciJawaban || 'Kebijakan guru dalam memberikan skor.' }}</p>

              <!-- Referensi Gambar Soal pada Kunci Jawaban -->
              <div v-if="soal.imageUrl" class="mt-1">
                <img 
                  :src="soal.imageUrl" 
                  alt="Referensi Gambar" 
                  class="max-h-24 object-contain rounded border border-slate-200 p-0.5"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
setPageLayout(false)

const printData = ref({
  infoUjian: {},
  kelas: '',
  jenjang: 'SD',
  mapel: '',
  pg: [],
  essay: []
})

const duaKolom = ref(true)
const tampilkanKunci = ref(false)

const triggerPrint = () => {
  window.print()
}

onMounted(() => {
  const data = localStorage.getItem('teachbank_print_payload')
  if (data) {
    try {
      printData.value = JSON.parse(data)
    } catch (e) {
      console.error('Gagal membaca data cetak:', e)
    }
  }
})
</script>

<style>
@media print {
  @page {
    size: A4 portrait;
    margin: 12mm 15mm;
  }
  
  body {
    background: white !important;
    color: black !important;
  }

  /* Mencegah soal terpotong di pertengahan halaman */
  .break-inside-avoid {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  /* Memaksa kunci jawaban pindah ke halaman baru saat dicetak */
  .break-before-page {
    break-before: page !important;
    page-break-before: always !important;
  }

  /* Memastikan gambar tidak terdistorsi saat diprint */
  img {
    max-width: 100% !important;
    height: auto !important;
    page-break-inside: avoid !important;
  }
}
</style>
