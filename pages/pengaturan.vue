<template>
  <div class="mx-auto max-w-6xl space-y-6 pb-16 text-slate-800 dark:text-slate-100">
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-800 to-brand-600 p-6 text-white shadow-xl sm:p-8">
      <div class="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10"></div>
      <div class="relative flex items-start gap-5"><div class="flex items-start gap-4"><span class="hidden h-12 w-12 place-items-center rounded-2xl bg-white/15 sm:grid"><AppIcon name="settings" class="h-6 w-6" /></span><div><p class="text-xs font-bold uppercase tracking-[.2em] text-brand-100">Preferensi Guru</p><h1 class="mt-1 text-2xl font-bold sm:text-3xl">Tempat & Penugasan Mengajar</h1><p class="mt-2 max-w-2xl text-sm text-brand-100">Pisahkan setiap sekolah agar kelas dan bank soal tidak tertukar.</p></div></div></div>
    </div>
    <div v-if="loading" class="rounded-2xl border bg-white py-16 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800"><AppIcon name="loader" class="mx-auto mb-3 h-6 w-6 animate-spin text-brand-500" />Memuat pengaturan...</div>
    <form v-else @submit.prevent="simpanPengaturan" class="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div class="space-y-5">
        <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"><p class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Tambah penugasan berdasarkan jenjang</p><div class="grid grid-cols-3 gap-2"><button v-for="jenjang in jenjangOptions" :key="`add-${jenjang}`" type="button" @click="tambahPenugasan(jenjang)" class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-xs font-bold text-slate-600 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"><AppIcon name="plus" class="h-3.5 w-3.5" />{{ jenjang }}</button></div></section>
        <article v-for="(tugas, index) in penugasanTerurut" :id="`penugasan-${tugas.id}`" :key="tugas.id" :class="['scroll-mt-24 overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-all duration-300 dark:bg-slate-800', warnaJenjang(tugas.jenjang).card]">
          <div :class="['flex items-center justify-between border-b px-5 py-4', warnaJenjang(tugas.jenjang).header]"><div class="flex items-center gap-3"><span :class="['grid h-9 w-9 place-items-center rounded-xl', warnaJenjang(tugas.jenjang).icon]"><AppIcon name="school" class="h-4 w-4" /></span><div><div class="flex items-center gap-2"><h2 :class="['font-bold', warnaJenjang(tugas.jenjang).text]">{{ tugas.jenjang }}</h2><span class="text-xs text-slate-300">•</span><span class="text-xs font-semibold text-slate-400">Urutan {{ index + 1 }}</span></div><p class="text-xs text-slate-500">{{ tugas.namaSekolah || 'Nama sekolah belum diisi' }}</p></div></div><button v-if="form.penugasan.length > 1" type="button" @click="hapusPenugasan(tugas.id)" class="grid h-9 w-9 place-items-center rounded-xl text-red-500 hover:bg-red-50" title="Hapus sekolah"><AppIcon name="trash" class="h-4 w-4" /></button></div>
          <div class="space-y-6 p-5 sm:p-6">
            <div class="grid gap-4 sm:grid-cols-[180px_1fr]">
              <div><label class="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Jenjang sekolah ini</label><div class="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900/50"><button v-for="jenjang in jenjangOptions" :key="jenjang" type="button" @click="ubahJenjang(tugas, jenjang)" :class="['rounded-lg py-2 text-xs font-bold transition', tugas.jenjang === jenjang ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-700 dark:text-brand-300' : 'text-slate-500']">{{ jenjang }}</button></div><p class="mt-1.5 text-[10px] leading-relaxed text-slate-400">Memilih jenjang lain setelah data diisi akan membuat penugasan baru.</p></div>
              <div><label class="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Nama sekolah</label><input v-model.trim="tugas.namaSekolah" required type="text" :placeholder="`Contoh: ${tugas.jenjang} Negeri 1`" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900/40" /></div>
            </div>
            <div><div class="mb-3"><h3 class="text-sm font-bold">Kelas yang diajar</h3><p class="text-xs text-slate-500">{{ tugas.jenjang === 'SD' ? 'SD memiliki kelas 1 sampai 6.' : `${tugas.jenjang} memiliki 3 tingkat kelas.` }}</p></div><div class="grid grid-cols-3 gap-2 sm:grid-cols-6"><label v-for="kelas in jumlahKelas(tugas.jenjang)" :key="kelas" :class="['relative flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-xl border transition', tugas.kelasAjar.includes(kelas) ? 'border-brand-500 bg-brand-50 font-bold text-brand-600 dark:bg-brand-900/30 dark:text-brand-300' : 'border-slate-200 text-slate-500 hover:border-brand-300 dark:border-slate-700']"><input v-model="tugas.kelasAjar" type="checkbox" :value="kelas" class="hidden" /><span class="text-lg font-bold">{{ kelas }}</span><span class="text-[9px] uppercase">Kelas</span><AppIcon v-if="tugas.kelasAjar.includes(kelas)" name="check" class="absolute right-1.5 top-1.5 h-3 w-3" /></label></div></div>
            <div><div class="mb-3"><h3 class="text-sm font-bold">Mata pelajaran</h3><p class="text-xs text-slate-500">Mapel berlaku untuk sekolah ini.</p></div><div class="flex flex-wrap gap-2"><button v-for="mapel in opsiMapel(tugas.jenjang)" :key="mapel" type="button" @click="toggleMapel(tugas, mapel)" :class="['inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition', tugas.mapelAjar.includes(mapel) ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300']"><AppIcon :name="tugas.mapelAjar.includes(mapel) ? 'check' : 'plus'" class="h-3.5 w-3.5" />{{ mapel }}</button></div><div class="mt-3 flex gap-2"><input v-model="tugas.mapelBaru" @keyup.enter.prevent="tambahMapel(tugas)" type="text" placeholder="Tambah mata pelajaran lainnya..." class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900/40" /><button type="button" @click="tambahMapel(tugas)" class="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-slate-700"><AppIcon name="plus" class="h-4 w-4" />Tambah</button></div></div>
          </div>
        </article>
        <button type="button" @click="tambahPenugasan('SD')" class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 py-4 text-sm font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-900/10 dark:text-brand-300"><AppIcon name="plus" class="h-4 w-4" /> Tambah Sekolah SD</button>
      </div>
      <aside class="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:sticky lg:top-24"><h2 class="font-bold">Ringkasan</h2><p class="mb-5 text-xs text-slate-500">Edit nama atau klik kartu untuk menuju pengaturan.</p><div class="space-y-2"><div v-for="tugas in penugasanTerurut" :key="`summary-${tugas.id}`" role="button" tabindex="0" @click="fokusPenugasan(tugas.id)" @keyup.enter="fokusPenugasan(tugas.id)" :class="['group cursor-pointer rounded-xl border p-3 transition hover:-translate-y-0.5 hover:shadow-sm', warnaJenjang(tugas.jenjang).summary]"><div class="mb-2 flex items-center justify-between gap-2"><span :class="['rounded-md px-1.5 py-0.5 text-[10px] font-bold', warnaJenjang(tugas.jenjang).badge]">{{ tugas.jenjang }}</span><AppIcon name="arrowLeft" class="h-3.5 w-3.5 rotate-180 text-slate-400 transition group-hover:translate-x-0.5" /></div><div class="relative"><AppIcon name="edit" class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input v-model="tugas.namaSekolah" @focus="fokusPenugasan(tugas.id)" @click.stop type="text" placeholder="Nama sekolah" class="w-full rounded-lg border border-white/70 bg-white/80 py-1.5 pl-8 pr-2 text-xs font-bold outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 dark:border-slate-600 dark:bg-slate-800" /></div><p class="mt-2 text-[11px] text-slate-500">{{ tugas.kelasAjar.length }} kelas · {{ tugas.mapelAjar.length }} mapel</p></div></div><button type="submit" :disabled="saving" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow hover:bg-brand-700 disabled:opacity-50"><AppIcon :name="saving ? 'loader' : 'save'" :class="['h-4 w-4', saving && 'animate-spin']" />{{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}</button></aside>
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
const jenjangOptions = ['SD', 'SMP', 'SMA/SMK']
const mapelUmum = ['Agama', 'PJOK', 'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Pancasila/PKn', 'Seni Budaya']
const mapelJenjang = { SD: ['IPAS'], SMP: ['IPA', 'IPS', 'Informatika'], 'SMA/SMK': ['IPA', 'IPS', 'Informatika', 'Projek Kreatif dan Kewirausahaan'] }
const buatPenugasan = (data = {}) => ({ id: data.id || `tugas_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, jenjang: data.jenjang === 'SMK' || data.jenjang === 'SMA' ? 'SMA/SMK' : data.jenjang || 'SD', namaSekolah: data.namaSekolah || '', kelasAjar: data.kelasAjar || [], mapelAjar: data.mapelAjar || [], mapelBaru: '' })
const form = ref({ penugasan: [buatPenugasan()] })
const jumlahKelas = (jenjang) => jenjang === 'SD' ? 6 : 3
const opsiMapel = (jenjang) => [...mapelUmum, ...(mapelJenjang[jenjang] || [])]
const penugasanTerurut = computed(() => [...form.value.penugasan].sort((a, b) => jenjangOptions.indexOf(a.jenjang) - jenjangOptions.indexOf(b.jenjang)))
const warnaJenjang = (jenjang) => {
  if (jenjang === 'SMP') return {
    card: 'border-purple-200 dark:border-purple-900/70', header: 'border-purple-100 bg-purple-50/70 dark:border-purple-900/50 dark:bg-purple-950/20', icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300', text: 'text-purple-700 dark:text-purple-300', summary: 'border-purple-200 bg-purple-50/70 dark:border-purple-900/60 dark:bg-purple-950/20', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  }
  if (jenjang === 'SMA/SMK') return {
    card: 'border-amber-200 dark:border-amber-900/70', header: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20', icon: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', text: 'text-amber-700 dark:text-amber-300', summary: 'border-amber-200 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/20', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  }
  return {
    card: 'border-sky-200 dark:border-sky-900/70', header: 'border-sky-100 bg-sky-50/70 dark:border-sky-900/50 dark:bg-sky-950/20', icon: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300', text: 'text-sky-700 dark:text-sky-300', summary: 'border-sky-200 bg-sky-50/70 dark:border-sky-900/60 dark:bg-sky-950/20', badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  }
}
const fokusPenugasan = (id) => document.getElementById(`penugasan-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const tambahPenugasan = (jenjang = 'SD') => form.value.penugasan.push(buatPenugasan({ jenjang }))
const hapusPenugasan = (id) => { form.value.penugasan = form.value.penugasan.filter(tugas => tugas.id !== id) }
const ubahJenjang = (tugas, jenjang) => {
  if (tugas.jenjang === jenjang) return

  // Jangan menimpa penugasan yang sudah diisi. Buat kartu baru agar kelas
  // dari jenjang sebelumnya tetap tersimpan dan tidak tercampur.
  const sudahDiisi = Boolean(
    tugas.namaSekolah.trim() || tugas.kelasAjar.length || tugas.mapelAjar.length,
  )
  if (sudahDiisi) {
    const index = form.value.penugasan.findIndex(item => item.id === tugas.id)
    form.value.penugasan.splice(index + 1, 0, buatPenugasan({ jenjang }))
    nextTick(() => {
      document.getElementById(`penugasan-${form.value.penugasan[index + 1].id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return
  }

  tugas.jenjang = jenjang
  tugas.kelasAjar = []
}
const toggleMapel = (tugas, mapel) => { tugas.mapelAjar = tugas.mapelAjar.includes(mapel) ? tugas.mapelAjar.filter(m => m !== mapel) : [...tugas.mapelAjar, mapel] }
const tambahMapel = (tugas) => { const nama = tugas.mapelBaru?.trim(); if (nama && !tugas.mapelAjar.includes(nama)) tugas.mapelAjar.push(nama); tugas.mapelBaru = '' }
const loadPengaturan = async () => { if (!user.value) { loading.value = false; return } try { const snap = await getDoc(doc(db, 'pengaturanGuru', user.value.uid)); if (snap.exists()) { const data = snap.data(); if (data.penugasan?.length) form.value.penugasan = data.penugasan.map(buatPenugasan); else if (data.kelasAjar?.length || data.mapelAjar?.length) form.value.penugasan = [buatPenugasan({ id: 'legacy', jenjang: 'SD', namaSekolah: 'Sekolah Saya', kelasAjar: data.kelasAjar || [], mapelAjar: data.mapelAjar || [] })] } } catch (error) { console.error('Gagal memuat pengaturan:', error) } finally { loading.value = false } }
const simpanPengaturan = async () => {
  if (!user.value) return
  const invalid = form.value.penugasan.some(t => !t.namaSekolah.trim() || !t.kelasAjar.length || !t.mapelAjar.length)
  if (invalid) { alert('Lengkapi nama sekolah serta pilih minimal satu kelas dan mata pelajaran pada setiap penugasan.'); return }

  const namaNormal = form.value.penugasan.map(t => t.namaSekolah.trim().replace(/\s+/g, ' ').toLocaleLowerCase('id-ID'))
  const namaDuplikat = namaNormal.find((nama, index) => namaNormal.indexOf(nama) !== index)
  if (namaDuplikat) {
    const sekolah = form.value.penugasan.find(t => t.namaSekolah.trim().replace(/\s+/g, ' ').toLocaleLowerCase('id-ID') === namaDuplikat)
    alert(`Nama sekolah "${sekolah?.namaSekolah.trim()}" digunakan lebih dari sekali. Gunakan satu penugasan untuk setiap nama sekolah.`)
    return
  }

  saving.value = true
  try {
    const penugasan = penugasanTerurut.value.map(({ mapelBaru, ...tugas }) => ({ ...tugas, namaSekolah: tugas.namaSekolah.trim().replace(/\s+/g, ' ') }))
    const kelasAjar = [...new Set(penugasan.flatMap(t => t.kelasAjar))]
    const mapelAjar = [...new Set(penugasan.flatMap(t => t.mapelAjar))]
    await setDoc(doc(db, 'pengaturanGuru', user.value.uid), { penugasan, kelasAjar, mapelAjar })
    alert('Pengaturan berhasil disimpan!')
    navigateTo('/dashboard')
  } catch (error) { console.error(error); alert('Gagal menyimpan pengaturan.') } finally { saving.value = false }
}
onMounted(loadPengaturan)
</script>
