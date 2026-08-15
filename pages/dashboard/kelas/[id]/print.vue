<!-- pages/dashboard/kelas/[id]/print.vue -->
<template>
  <ClientOnly>
    <div class="bg-slate-100 min-h-screen p-4 print:p-0 print:bg-white text-slate-900">
      <!-- Toolbar Atas (Otomatis Sembunyi Saat Cetak/Print) -->
      <div class="max-w-[210mm] mx-auto mb-4 p-4 bg-white rounded-xl shadow flex justify-between items-center print:hidden">
        <div>
          <h1 class="font-bold text-slate-800">Preview Lembar Ujian</h1>
          <p class="text-xs text-slate-500">Klik tombol di kanan untuk langsung mencetak atau menyimpannya sebagai PDF.</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="triggerPrint" class="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700">
            🖨️ Cetak / Save to PDF
          </button>
        </div>
      </div>

      <!-- Kertas Ujian (Ukuran Cetak Standar) -->
      <div class="kertas-ujian max-w-[210mm] mx-auto bg-white p-[15mm] border print:border-none print:p-0 shadow-lg print:shadow-none text-black">
        <!-- Kop Ujian Sekolah -->
        <div class="border-b-4 border-double border-black pb-3 mb-4 text-center">
          <h2 class="text-lg font-bold uppercase tracking-wide">PENILAIAN AKHIR SEMESTER (PAS)</h2>
          <h3 class="text-md font-semibold">TANGGUNG JAWAB KURIKULUM DEPARTEMEN PENDIDIKAN</h3>
          <p class="text-xs mt-0.5">Tahun Ajaran 2026/2027</p>
        </div>

        <!-- Identitas Siswa & Mapel -->
        <table class="w-full text-xs font-semibold mb-4 border-collapse">
          <tbody>
            <tr>
              <td class="py-1 w-28">MATA PELAJARAN</td>
              <td class="py-1">: {{ printData.mapel }}</td>
              <td class="py-1 w-24">HARI / TANGGAL</td>
              <td class="py-1">: ........................</td>
            </tr>
            <tr>
              <td class="py-1">KELAS</td>
              <td class="py-1">: {{ printData.kelas }} SD</td>
              <td class="py-1">WAKTU</td>
              <td class="py-1">: 90 Menit</td>
            </tr>
            <tr>
              <td class="py-1">NAMA SISWA</td>
              <td class="py-1">: ......................................</td>
              <td class="py-1">NOMOR ABSEN</td>
              <td class="py-1">: ................</td>
            </tr>
          </tbody>
        </table>

        <!-- Bagian I: Pilihan Ganda -->
        <div v-if="printData.pg && printData.pg.length > 0" class="mb-6">
          <p class="font-bold text-xs mb-2">I. Berilah tanda silang (X) pada huruf a, b, c, atau d pada jawaban yang paling benar!</p>
          <ol class="list-decimal pl-4 space-y-3 text-xs leading-relaxed">
            <li v-for="soal in printData.pg" :key="soal.id" class="pl-1">
              <div>{{ soal.pertanyaan }}</div>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 pl-2">
                <div>a. {{ soal.opsi?.a }}</div>
                <div>b. {{ soal.opsi?.b }}</div>
                <div>c. {{ soal.opsi?.c }}</div>
                <div>d. {{ soal.opsi?.d }}</div>
              </div>
            </li>
          </ol>
        </div>

        <!-- Bagian II: Essay / Uraian -->
        <div v-if="printData.essay && printData.essay.length > 0">
          <p class="font-bold text-xs mb-2">II. Jawablah pertanyaan-pertanyaan di bawah ini dengan singkat dan tepat!</p>
          <ol class="list-decimal pl-4 space-y-4 text-xs leading-relaxed">
            <li v-for="soal in printData.essay" :key="soal.id" class="pl-1">
              <div>{{ soal.pertanyaan }}</div>
              <div class="h-12 border-b border-dashed border-slate-300 print:border-slate-400 mt-1"></div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
// PEMBETULAN: Menggunakan setPageLayout atau definePageMeta untuk menonaktifkan layout navbar
setPageLayout(false)

const printData = ref({ kelas: '', mapel: '', pg: [], essay: [] })

const triggerPrint = () => {
  window.print()
}

onMounted(() => {
  const data = localStorage.getItem('teachbank_print_payload')
  if (data) {
    printData.value = JSON.parse(data)
  }
})
</script>

<style>
@media print {
  @page {
    size: A4 portrait;
    margin: 15mm;
  }
  body {
    background: white !important;
  }
}
</style>