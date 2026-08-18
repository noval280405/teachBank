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
          <select v-if="printData.pakets?.length > 1" v-model="paketAktif" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold"><option v-for="paket in printData.pakets" :key="paket.label" :value="paket.label">Paket {{ paket.label }}</option></select>
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
            <AppIcon name="printer" class="h-4 w-4" /> Cetak / Simpan PDF
          </button>
          <button @click="downloadWord" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><AppIcon name="file" class="h-4 w-4" />Word</button>
        </div>
      </div>

      <!-- Lembar Kertas Ujian (Ukuran A4) -->
      <div id="lembar-ujian" class="kertas-ujian relative max-w-[210mm] mx-auto bg-white p-[12mm] sm:p-[15mm] border print:border-none print:p-0 shadow-xl print:shadow-none text-black leading-relaxed">
        <div v-if="printData.watermark" class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"><span class="-rotate-45 select-none whitespace-nowrap text-7xl font-black tracking-widest text-slate-900/[0.07]">{{ printData.watermark }}</span></div>
        <div class="relative z-10">
        
        <!-- Kop Ujian Sekolah (Dinamis dari Data Input) -->
        <div class="border-b-4 border-double border-black pb-3 mb-4 text-center">
          <h2 class="text-xl font-bold uppercase tracking-wider">{{ printData.infoUjian?.namaSekolah || 'SD NEGERI UTAMA' }}</h2>
          <h3 class="text-base font-bold uppercase tracking-wide">
            {{ printData.infoUjian?.namaUjian || 'PENILAIAN TENGAH SEMESTER (PTS)' }}
          </h3>
          <p class="text-xs italic mt-0.5">Tahun Ajaran {{ printData.infoUjian?.tahunAjaran || '2025/2026' }}</p>
          <p v-if="printData.pakets?.length > 1" class="mt-1 text-sm font-black">PAKET {{ paketAktif }}</p>
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
        <div v-if="activeData.pg && activeData.pg.length > 0" class="mb-6 font-sans">
          <p class="font-bold text-xs mb-3">I. Berilah tanda silang (X) pada huruf a, b, c, atau d di depan jawaban yang paling benar!</p>
          
          <div :class="[duaKolom ? 'columns-1 sm:columns-2 print:columns-2 gap-6' : 'space-y-3']">
            <div 
              v-for="(soal, index) in activeData.pg" 
              :key="soal.id" 
              class="break-inside-avoid mb-4 text-xs leading-snug"
            >
              <!-- Pertanyaan -->
              <div class="flex items-start gap-1.5 font-medium">
                <span class="font-bold w-6 shrink-0 text-right">{{ index + 1 }}.</span>
                <div class="flex-1 text-slate-900">
                  <MathText :text="soal.pertanyaan" tag="p" />

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
                  <span class="font-bold uppercase">{{ kunci }}.</span> <MathText :text="soal.opsi[kunci]" />
                  <img v-if="soal.opsiGambar?.[kunci]" :src="soal.opsiGambar[kunci]" :alt="`Gambar opsi ${kunci}`" class="mt-1 max-h-20 max-w-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bagian II: Essay / Uraian -->
        <div v-if="activeData.essay && activeData.essay.length > 0" class="mb-6 font-sans break-inside-avoid">
          <p class="font-bold text-xs mb-3">II. Jawablah pertanyaan-pertanyaan di bawah ini dengan singkat dan tepat!</p>
          
          <div class="space-y-4">
            <div 
              v-for="(soal, index) in activeData.essay" 
              :key="soal.id" 
              class="break-inside-avoid text-xs"
            >
              <div class="flex items-start gap-1.5 font-medium">
                <span class="font-bold w-6 shrink-0 text-right">{{ (activeData.pg?.length || 0) + index + 1 }}.</span>
                <div class="flex-1 text-slate-900">
                  <MathText :text="soal.pertanyaan" tag="p" />

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
              v-for="(soal, index) in activeData.pg" 
              :key="'kunci-pg-' + soal.id" 
              class="p-1.5 border border-slate-300 rounded text-center"
            >
              <span class="font-bold">{{ index + 1 }}.</span> 
              <span class="uppercase font-extrabold ml-1 text-brand-600">{{ soal.kunciJawaban || '-' }}</span>
            </div>
          </div>

          <div v-if="activeData.essay && activeData.essay.length > 0" class="mt-4 space-y-2">
            <h4 class="text-xs font-bold uppercase">Pedoman / Kunci Jawaban Essay:</h4>
            <div 
              v-for="(soal, index) in activeData.essay" 
              :key="'kunci-essay-' + soal.id" 
              class="text-xs p-2 border border-slate-200 rounded bg-slate-50 print:bg-transparent"
            >
              <p class="font-bold">Soal #{{ (activeData.pg?.length || 0) + index + 1 }}:</p>
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
    </div>
  </ClientOnly>
</template>

<script setup>
import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun, Math as OfficeMath, MathRun, MathFraction, MathRadical, MathSuperScript, MathSubScript, MathSubSuperScript, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign } from 'docx'

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
const paketAktif = ref('A')
const activeData = computed(() => printData.value.pakets?.find(p => p.label === paketAktif.value) || printData.value)

const triggerPrint = () => {
  window.print()
}

const readLatexArgument = (source, start) => {
  if (source[start] !== '{') return { value: source[start] || '', end: start + 1 }
  let depth = 0
  for (let index = start; index < source.length; index++) {
    if (source[index] === '{') depth++
    if (source[index] === '}' && --depth === 0) return { value: source.slice(start + 1, index), end: index + 1 }
  }
  return { value: source.slice(start + 1), end: source.length }
}

const latexToOfficeMath = (formula) => {
  const source = String(formula || '').replace(/\\left|\\right/g, '')
  const components = []
  const commandSymbols = { '\\pm': '±', '\\times': '×', '\\div': '÷', '\\cdot': '·', '\\le': '≤', '\\ge': '≥', '\\neq': '≠', '\\pi': 'π', '\\theta': 'θ', '\\Delta': 'Δ', '\\,': ' ' }
  let index = 0
  while (index < source.length) {
    if (source.startsWith('\\frac', index)) {
      const numerator = readLatexArgument(source, index + 5); const denominator = readLatexArgument(source, numerator.end)
      components.push(new MathFraction({ numerator: latexToOfficeMath(numerator.value), denominator: latexToOfficeMath(denominator.value) })); index = denominator.end; continue
    }
    if (source.startsWith('\\sqrt', index)) {
      const radicand = readLatexArgument(source, index + 5)
      components.push(new MathRadical({ children: latexToOfficeMath(radicand.value) })); index = radicand.end; continue
    }
    const command = Object.keys(commandSymbols).find(item => source.startsWith(item, index))
    if (command) { components.push(new MathRun(commandSymbols[command])); index += command.length; continue }
    if (source.startsWith('\\text', index)) { const text = readLatexArgument(source, index + 5); components.push(new MathRun(text.value)); index = text.end; continue }
    if (source[index] === '\\') { const match = source.slice(index).match(/^\\[A-Za-z]+/); components.push(new MathRun(match ? match[0].slice(1) : source[index])); index += match?.[0].length || 1; continue }

    const base = source[index]
    let cursor = index + 1; let subScript = null; let superScript = null
    while (source[cursor] === '_' || source[cursor] === '^') {
      const type = source[cursor++]; const argument = readLatexArgument(source, cursor); cursor = argument.end
      if (type === '_') subScript = latexToOfficeMath(argument.value); else superScript = latexToOfficeMath(argument.value)
    }
    const baseChildren = [new MathRun(base)]
    if (subScript && superScript) components.push(new MathSubSuperScript({ children: baseChildren, subScript, superScript }))
    else if (subScript) components.push(new MathSubScript({ children: baseChildren, subScript }))
    else if (superScript) components.push(new MathSuperScript({ children: baseChildren, superScript }))
    else components.push(new MathRun(base))
    index = cursor
  }
  return components
}

const wordRuns = (text, bold = false) => {
  const result = []; const pattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g; let last = 0
  for (const match of String(text || '').matchAll(pattern)) {
    if (match.index > last) result.push(new TextRun({ text: text.slice(last, match.index), bold }))
    const raw = match[0].startsWith('$$') ? match[0].slice(2, -2) : match[0].slice(1, -1)
    result.push(new OfficeMath({ children: latexToOfficeMath(raw) }))
    last = match.index + match[0].length
  }
  if (last < String(text || '').length) result.push(new TextRun({ text: String(text).slice(last), bold }))
  return result.length ? result : [new TextRun({ text: String(text || ''), bold })]
}

const imageForWord = async (source) => {
  if (!source) return null
  try {
    const url = source.startsWith('/') ? `${window.location.origin}${source}` : source
    const blob = await fetch(url).then(response => { if (!response.ok) throw new Error('Gambar tidak dapat diunduh'); return response.blob() })
    const objectUrl = URL.createObjectURL(blob)
    const loadedImage = await new Promise((resolve, reject) => { const element = new window.Image(); element.onload = () => resolve(element); element.onerror = reject; element.src = objectUrl })
    const scale = Math.min(1, 420 / loadedImage.naturalWidth, 220 / loadedImage.naturalHeight)
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(loadedImage.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(loadedImage.naturalHeight * scale))
    const context = canvas.getContext('2d'); context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(loadedImage, 0, 0, canvas.width, canvas.height)
    URL.revokeObjectURL(objectUrl)
    const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    return { data: await pngBlob.arrayBuffer(), width: canvas.width, height: canvas.height }
  } catch (error) { console.warn('Gambar dilewati saat ekspor Word:', error); return null }
}

const downloadWord = async () => {
  const data = activeData.value
  const cell = (label, value, width, writingRow = false) => new TableCell({ width: { size: width, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.CENTER, margins: { top: writingRow ? 190 : 145, bottom: writingRow ? 190 : 145, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18 }), new TextRun({ text: `: ${value}`, size: 18 })], spacing: { line: 280 } })] })
  const children = [
    new Paragraph({ children: [new TextRun({ text: (printData.value.infoUjian?.namaSekolah || 'SEKOLAH').toUpperCase(), bold: true, size: 30, color: '000000', font: 'Times New Roman' })], alignment: AlignmentType.CENTER, spacing: { after: 50 } }),
    new Paragraph({ children: [new TextRun({ text: (printData.value.infoUjian?.namaUjian || 'UJIAN').toUpperCase(), bold: true, size: 23, color: '000000', font: 'Times New Roman' })], alignment: AlignmentType.CENTER, spacing: { after: 25 } }),
    new Paragraph({ children: [new TextRun({ text: `Tahun Ajaran ${printData.value.infoUjian?.tahunAjaran || '-'}`, italics: true, size: 18, color: '000000', font: 'Times New Roman' })], alignment: AlignmentType.CENTER, border: { bottom: { style: BorderStyle.DOUBLE, size: 8, color: '000000', space: 6 } } }),
    new Paragraph({ children: [new TextRun({ text: '', size: 6 })], spacing: { before: 80, after: 100, line: 100 } }),
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE, size: 8, color: '000000' }, bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' }, left: { style: BorderStyle.SINGLE, size: 8, color: '000000' }, right: { style: BorderStyle.SINGLE, size: 8, color: '000000' }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } }, rows: [
      new TableRow({ children: [cell('MATA PELAJARAN', printData.value.mapel || '-', 50), cell('HARI / TANGGAL', '................................', 50)] }),
      new TableRow({ children: [cell('KELAS', `${printData.value.kelas} ${printData.value.jenjang || 'SD'}`, 50), cell('WAKTU', '90 Menit', 50)] }),
      new TableRow({ children: [cell('NAMA SISWA', '................................', 50, true), cell('NOMOR ABSEN', '................', 50, true)] }),
    ] }),
    new Paragraph({ children: [new TextRun({ text: 'I. Berilah tanda silang (X) pada huruf a, b, c, atau d di depan jawaban yang paling benar!', bold: true, size: 18 })], spacing: { before: 260, after: 100 } }),
  ]
  for (const [index, soal] of data.pg.entries()) {
    children.push(new Paragraph({ children: [new TextRun({ text: `${index + 1}. `, bold: true, size: 18 }), ...wordRuns(soal.pertanyaan, true)], spacing: { before: 140, after: 40 }, keepNext: true }))
    const questionImage = await imageForWord(soal.imageUrl); if (questionImage) children.push(new Paragraph({ children: [new ImageRun({ type: 'png', data: questionImage.data, transformation: { width: questionImage.width, height: questionImage.height } })], alignment: AlignmentType.CENTER }))
    for (const key of ['a','b','c','d']) if (soal.opsi?.[key]) { children.push(new Paragraph({ children: [new TextRun({ text: `      ${key.toUpperCase()}. `, bold: true, size: 18 }), ...wordRuns(soal.opsi[key])], spacing: { after: 20 } })); const optionImage = await imageForWord(soal.opsiGambar?.[key]); if (optionImage) children.push(new Paragraph({ children: [new ImageRun({ type: 'png', data: optionImage.data, transformation: { width: optionImage.width, height: optionImage.height } })], indent: { left: 500 } })) }
  }
  if (data.essay.length) {
    children.push(new Paragraph({ children: [new TextRun({ text: 'II. Jawablah pertanyaan-pertanyaan di bawah ini dengan singkat dan tepat!', bold: true, size: 18 })], spacing: { before: 360, after: 180 } }))
    for (const [index, soal] of data.essay.entries()) {
      children.push(new Paragraph({ children: [new TextRun({ text: `${data.pg.length + index + 1}. `, bold: true, size: 18 }), ...wordRuns(soal.pertanyaan)], spacing: { before: 260, after: 160, line: 300 }, keepNext: true }))
      const image = await imageForWord(soal.imageUrl)
      if (image) children.push(new Paragraph({ children: [new ImageRun({ type: 'png', data: image.data, transformation: { width: image.width, height: image.height } })], alignment: AlignmentType.CENTER, spacing: { before: 80, after: 180 } }))
      children.push(
        new Paragraph({ text: '........................................................................................................................................', spacing: { before: 80, after: 100 } }),
        new Paragraph({ text: '........................................................................................................................................', spacing: { after: 100 } }),
        new Paragraph({ text: '........................................................................................................................................', spacing: { after: 240 } }),
      )
    }
  }
  const documentWord = new Document({ styles: { default: { document: { run: { font: 'Arial', size: 18, color: '000000' }, paragraph: { spacing: { line: 240 } } } } }, sections: [{ properties: { page: { margin: { top: 680, right: 850, bottom: 680, left: 850 } } }, children }] })
  const blob = await Packer.toBlob(documentWord)
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${printData.value.mapel || 'ujian'}-paket-${paketAktif.value}.docx`; link.click(); URL.revokeObjectURL(url)
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
