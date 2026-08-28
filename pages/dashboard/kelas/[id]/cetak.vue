<!-- pages/dashboard/kelas/[id]/cetak.vue -->
<template>
  <ClientOnly>
    <div class="max-w-6xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-100">
      <AppLoadingOverlay
        :show="overlayLoading.show"
        :title="overlayLoading.title"
        :description="overlayLoading.description"
      />
      <!-- Header -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-brand-900/10">
        <div class="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10"></div>
        <div class="absolute -bottom-20 right-40 h-40 w-40 rounded-full bg-indigo-300/10"></div>
        <div class="relative flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div class="max-w-2xl">
          <NuxtLink
            :to="{ path: `/dashboard/kelas/${kelasId}`, query: route.query }"
            class="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
            ><AppIcon name="arrowLeft" class="h-4 w-4" /> Kembali ke Bank Soal</NuxtLink
          >
          <div class="flex items-start gap-4">
            <span class="hidden sm:grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20"><AppIcon name="printer" class="h-6 w-6" /></span>
            <div><p class="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-100">{{ schoolName }}</p><h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Siapkan lembar ujian Kelas {{ kelasId }} {{ jenjang }}</h1><p class="mt-2 text-sm leading-relaxed text-brand-100">Pilih soal, atur identitas ujian, lalu cetak dalam satu langkah.</p></div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch gap-2 w-full lg:w-auto rounded-2xl bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur-sm">
          <select
            v-model="selectedMapel"
            class="min-w-44 px-4 py-2.5 rounded-xl border-0 bg-white text-slate-700 text-sm font-semibold outline-none ring-0"
          >
            <option v-for="m in mapelAjar" :key="m" :value="m">{{ m }}</option>
          </select>
          <button
            @click="bukaKertasCetak('A')"
            :disabled="terpilihPG.length === 0 && terpilihEssay.length === 0"
            class="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow disabled:cursor-not-allowed disabled:opacity-50 transition whitespace-nowrap"
          >
            <AppIcon name="printer" class="h-4 w-4" /> Pratinjau & Cetak <span class="rounded-md bg-white/15 px-1.5 py-0.5 text-xs">{{ terpilihPG.length + terpilihEssay.length }}</span>
          </button>
          <button @click="bukaKertasCetak('AB')" :disabled="terpilihPG.length === 0 && terpilihEssay.length === 0" class="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-950 shadow transition hover:bg-amber-300 disabled:opacity-50"><AppIcon name="copy" class="h-4 w-4" /> Paket A & B</button>
        </div>
        </div>
      </div>

      <nav class="sticky top-20 z-30 grid grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95" aria-label="Tahapan membuat ujian"><a v-for="item in printSteps" :key="item.step" :href="item.href" class="flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-center text-xs font-semibold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300"><span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600 text-[10px] text-white">{{ item.step }}</span><span class="hidden sm:inline">{{ item.label }}</span></a></nav>

      <div id="step-identitas" class="scroll-mt-36 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:grid-cols-[1fr_220px]">
        <div><div class="mb-3 flex items-center gap-3"><span class="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30"><AppIcon name="pie" class="h-4 w-4" /></span><div><h2 class="text-sm font-bold">Komposisi tingkat kesulitan</h2><p class="text-xs text-slate-500">Digunakan saat memilih soal otomatis.</p></div></div><div class="grid grid-cols-3 gap-2"><label v-for="level in ['mudah','sedang','sulit']" :key="level" class="rounded-xl border border-slate-200 p-2 dark:border-slate-700"><span class="text-[10px] font-bold capitalize text-slate-500">{{ level }}</span><div class="mt-1 flex items-center"><input v-model.number="komposisi[level]" type="number" min="0" max="100" class="w-full bg-transparent text-lg font-bold outline-none" /><span class="text-xs text-slate-400">%</span></div></label></div></div>
        <div class="flex flex-col justify-end gap-2"><button @click="pilihBerdasarkanKomposisi" class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white dark:bg-slate-700"><AppIcon name="pie" class="h-4 w-4" />Pilih sesuai komposisi</button><label class="flex items-center gap-2 text-xs font-medium text-slate-500"><input v-model="acakOpsiPaketB" type="checkbox" class="rounded text-brand-600" />Acak opsi jawaban Paket B</label><select v-model="watermark" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900/40"><option value="">Tanpa watermark</option><option value="DRAFT">DRAFT</option><option value="RAHASIA">RAHASIA</option><option value="DOKUMEN NEGERI">DOKUMEN NEGERI</option></select></div>
      </div>

      <!-- Pengaturan Identitas Ujian (KOP Surat) -->
      <div
        class="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5"
      >
        <div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300"><AppIcon name="school" class="h-5 w-5" /></span><div><h2 class="font-bold">Identitas ujian</h2><p class="text-xs text-slate-500 dark:text-slate-400">Informasi ini akan tampil pada kop lembar ujian.</p></div></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div>
            <label
              class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
              >Nama Sekolah</label
            >
            <input
              v-model="infoUjian.namaSekolah"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-900/40 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              placeholder="SD NEGERI UTAMA"
            />
          </div>
          <div>
            <label
              class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
              >Nama Ujian</label
            >
            <input
              v-model="infoUjian.namaUjian"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-900/40 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              placeholder="Penilaian Tengah Semester (PTS)"
            />
          </div>
          <div>
            <label
              class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
              >Tahun Ajaran</label
            >
            <input
              v-model="infoUjian.tahunAjaran"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-900/40 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              placeholder="2025/2026"
            />
          </div>
          <div><label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Semester</label><select v-model="infoUjian.semester" class="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-slate-600 dark:bg-slate-900/40"><option value="">Tidak dicantumkan</option><option value="Ganjil">Ganjil</option><option value="Genap">Genap</option></select></div>
          <div><label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Alamat sekolah</label><input v-model="infoUjian.alamat" type="text" class="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-slate-600 dark:bg-slate-900/40" placeholder="Jl. Pendidikan No. 1" /></div>
          <div><label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Kota / Kabupaten</label><input v-model="infoUjian.wilayah" type="text" class="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-slate-600 dark:bg-slate-900/40" placeholder="Kota Tangerang" /></div>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div v-for="posisi in ['kiri', 'kanan']" :key="posisi" class="rounded-xl border border-dashed border-slate-300 p-3 dark:border-slate-600"><p class="mb-2 text-xs font-bold capitalize text-slate-600 dark:text-slate-300">Logo {{ posisi }}</p><div class="flex items-center gap-3"><img v-if="infoUjian[`logo${posisi[0].toUpperCase()}${posisi.slice(1)}Url`]" :src="infoUjian[`logo${posisi[0].toUpperCase()}${posisi.slice(1)}Url`]" class="h-14 w-14 rounded-lg border bg-white object-contain p-1" /><span v-else class="grid h-14 w-14 place-items-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-700"><AppIcon name="image" class="h-5 w-5" /></span><div class="flex flex-wrap gap-2"><label class="cursor-pointer rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"><input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" @change="unggahLogo($event, posisi)" />{{ uploadingLogo === posisi ? 'Mengunggah...' : 'Pilih logo' }}</label><button v-if="infoUjian[`logo${posisi[0].toUpperCase()}${posisi.slice(1)}Url`]" type="button" class="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50" @click="hapusLogo(posisi)">Hapus</button></div></div></div>
        </div>
        <div class="flex items-center justify-between gap-3"><p class="text-xs text-slate-500">Kop tersimpan khusus untuk sekolah ini dan otomatis digunakan pada cetak berikutnya.</p><button type="button" :disabled="savingKop || uploadingLogo" @click="simpanKop" class="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"><AppIcon name="save" class="h-4 w-4" />{{ savingKop ? 'Menyimpan...' : 'Simpan kop' }}</button></div>
      </div>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><div class="flex items-center gap-2"><h2 class="font-bold">Template & tata letak ujian</h2><span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-700">{{ draftStatus }}</span></div><p class="text-xs text-slate-500">Simpan format yang sering digunakan dan atur ruang lembar ujian.</p></div><div class="flex gap-2"><select v-model="templateTerpilih" @change="pakaiTemplate" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"><option value="">Pilih template…</option><option v-for="item in templateUjian" :key="item.id" :value="item.id">{{ item.nama }}</option></select><button @click="simpanTemplate" class="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white">Simpan template</button></div></div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label class="text-xs font-medium">Tanggal ujian<input v-model="layoutUjian.tanggal" type="date" class="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700" /></label><label class="text-xs font-medium">Durasi (menit)<input v-model.number="layoutUjian.durasi" type="number" min="10" max="480" class="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700" /></label><label class="text-xs font-medium">Kolom soal<select v-model.number="layoutUjian.kolom" class="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700"><option :value="1">Satu kolom</option><option :value="2">Dua kolom</option></select></label><label class="text-xs font-medium">Orientasi<select v-model="layoutUjian.orientasi" class="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700"><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label><label class="text-xs font-medium">Ukuran teks<select v-model.number="layoutUjian.fontSize" class="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700"><option :value="10">Kecil</option><option :value="11">Normal</option><option :value="12">Besar</option></select></label><label class="text-xs font-medium">Jarak soal<select v-model="layoutUjian.spacing" class="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700"><option value="rapat">Rapat</option><option value="normal">Normal</option><option value="lega">Lega</option></select></label><label class="text-xs font-medium">Garis jawaban esai<input v-model.number="layoutUjian.essayLines" type="number" min="2" max="12" class="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700" /></label><label class="text-xs font-medium">Footer<input v-model="layoutUjian.footer" class="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Selamat mengerjakan" /></label></div>
        <div class="mt-3 grid gap-3 sm:grid-cols-2"><label class="text-xs font-medium">Petunjuk pilihan ganda<textarea v-model="layoutUjian.instruksiPG" rows="2" class="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700" /></label><label class="text-xs font-medium">Petunjuk esai<textarea v-model="layoutUjian.instruksiEssay" rows="2" class="mt-1 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700" /></label></div>
      </section>

      <section v-if="pemeriksaan.length" class="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20"><h2 class="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300"><AppIcon name="alert" class="h-4 w-4" /> Pemeriksaan sebelum cetak</h2><ul class="mt-2 space-y-1 text-xs text-amber-700 dark:text-amber-300"><li v-for="item in pemeriksaan" :key="item">• {{ item }}</li></ul></section>

      <!-- Panel Kontrol Pengaturan Jumlah Soal -->
      <div
        id="step-pilih-soal" class="scroll-mt-36 bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div class="mb-5 flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"><AppIcon name="settings" class="h-5 w-5" /></span><div><h2 class="font-bold">Atur jumlah soal</h2><p class="text-xs text-slate-500 dark:text-slate-400">Tentukan target, lalu gunakan pilihan cepat sesuai kebutuhan.</p></div></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Pengaturan PG -->
        <div
          class="space-y-4 p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-700"
        >
          <div class="flex justify-between items-center">
            <label
              class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase"
              >Input Target PG</label
            >
            <span class="text-xs text-slate-500"
              >Tersedia: {{ listSoalPG.length }} soal</span
            >
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
          <div class="flex flex-col gap-1.5 pt-1">
            <div class="flex gap-2">
              <button
                @click="pilihSemuaDenganLimit('pg')"
                class="flex-1 py-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-lg text-xs font-semibold hover:bg-brand-100"
              >
                <span class="inline-flex items-center justify-center gap-1.5"><AppIcon name="list" class="h-3.5 w-3.5" /> Urut (Maks {{ targetJumlahPG }})</span>
              </button>
              <button
                @click="pilihAcak('pg')"
                class="flex-1 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-semibold hover:bg-purple-100"
              >
                <span class="inline-flex items-center justify-center gap-1.5"><AppIcon name="shuffle" class="h-3.5 w-3.5" /> Acak ({{ targetJumlahPG }} Soal)</span>
              </button>
            </div>
            <button
              @click="pilihHanyaBelumDipakai('pg')"
              class="w-full py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-100"
            >
              <span class="inline-flex items-center justify-center gap-1.5"><AppIcon name="sparkle" class="h-3.5 w-3.5" /> Prioritaskan Soal Belum Pernah Dipakai</span>
            </button>
          </div>
        </div>

        <!-- Pengaturan Essay -->
        <div
          class="space-y-4 p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-700"
        >
          <div class="flex justify-between items-center">
            <label
              class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase"
              >Input Target Essay</label
            >
            <span class="text-xs text-slate-500"
              >Tersedia: {{ listSoalEssay.length }} soal</span
            >
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
          <div class="flex flex-col gap-1.5 pt-1">
            <div class="flex gap-2">
              <button
                @click="pilihSemuaDenganLimit('essay')"
                class="flex-1 py-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-lg text-xs font-semibold hover:bg-brand-100"
              >
                <span class="inline-flex items-center justify-center gap-1.5"><AppIcon name="list" class="h-3.5 w-3.5" /> Urut (Maks {{ targetJumlahEssay }})</span>
              </button>
              <button
                @click="pilihAcak('essay')"
                class="flex-1 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-semibold hover:bg-purple-100"
              >
                <span class="inline-flex items-center justify-center gap-1.5"><AppIcon name="shuffle" class="h-3.5 w-3.5" /> Acak ({{ targetJumlahEssay }} Soal)</span>
              </button>
            </div>
            <button
              @click="pilihHanyaBelumDipakai('essay')"
              class="w-full py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-100"
            >
              <span class="inline-flex items-center justify-center gap-1.5"><AppIcon name="sparkle" class="h-3.5 w-3.5" /> Prioritaskan Soal Belum Pernah Dipakai</span>
            </button>
          </div>
        </div>
        </div>
      </div>

      <!-- Baris Pencarian & Clear All -->
      <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="relative w-full sm:w-72"><AppIcon name="search" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input
          v-model="searchQuery"
          type="text"
          placeholder="Cari teks soal..."
          class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900/50"
        /></div>
        <div
          class="flex items-center justify-between sm:justify-end gap-4 text-xs"
        >
          <span class="text-slate-500"
            >Total terpilih: <b>{{ terpilihPG.length }} PG</b> &
            <b>{{ terpilihEssay.length }} Essay</b></span
          >
          <button
            @click="resetPilihan"
            class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <AppIcon name="trash" class="h-3.5 w-3.5" /> Hapus pilihan
          </button>
        </div>
      </div>

      <!-- Tab Jenis Soal -->
      <div class="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
        <button
          @click="activeTab = 'pg'"
          :class="[
            'rounded-xl px-3 py-3 font-bold text-sm transition',
            activeTab === 'pg'
              ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-700 dark:text-brand-300'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400',
          ]"
        >
          Pilihan Ganda (Terpilih {{ terpilihPG.length }}/{{ targetJumlahPG }})
        </button>
        <button
          @click="activeTab = 'essay'"
          :class="[
            'rounded-xl px-3 py-3 font-bold text-sm transition',
            activeTab === 'essay'
              ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-700 dark:text-brand-300'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400',
          ]"
        >
          Essay / Uraian (Terpilih {{ terpilihEssay.length }}/{{
            targetJumlahEssay
          }})
        </button>
      </div>

      <!-- Daftar Soal PG -->
      <div v-if="activeTab === 'pg'" class="space-y-3">
        <div
          v-if="filteredListPG.length === 0"
          class="text-center py-8 text-slate-400 text-xs bg-white dark:bg-slate-800 rounded-xl border"
        >
          Tidak ada soal PG yang sesuai.
        </div>
        <div
          v-for="soal in filteredListPG"
          :key="soal.id"
          :class="[
            'group p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
            terpilihPG.includes(soal.id)
              ? 'border-brand-500 bg-brand-50/70 shadow-sm ring-1 ring-brand-500/10 dark:bg-brand-900/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-300',
          ]"
          @click="togglePilih(soal.id, 'pg')"
        >
          <input
            type="checkbox"
            :checked="terpilihPG.includes(soal.id)"
            class="mt-1 rounded text-brand-600"
          />
          <div class="flex-1 space-y-1">
            <div class="flex items-center gap-2">
              <span v-if="soal.mapel" class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">{{ soal.mapel }}</span>
              <span
                v-if="soal.dipakai"
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                ><AppIcon name="alert" class="h-3 w-3" /> Sudah Pernah Dicetak</span
              >
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                ><AppIcon name="sparkle" class="h-3 w-3" /> Belum Pernah Dipakai</span
              >
            </div>
            <p class="font-medium text-sm text-slate-800 dark:text-slate-100">
              {{ soal.pertanyaan }}
            </p>

            <!-- Menampilkan Gambar Soal PG (Jika Ada) -->
            <div v-if="soal.imageUrl" class="mt-2">
              <img
                :src="soal.imageUrl"
                alt="Gambar Soal"
                class="max-h-40 object-contain rounded-lg border border-slate-200 dark:border-slate-700 p-1 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Daftar Soal Essay -->
      <div v-if="activeTab === 'essay'" class="space-y-3">
        <div
          v-if="filteredListEssay.length === 0"
          class="text-center py-8 text-slate-400 text-xs bg-white dark:bg-slate-800 rounded-xl border"
        >
          Tidak ada soal Essay yang sesuai.
        </div>
        <div
          v-for="soal in filteredListEssay"
          :key="soal.id"
          :class="[
            'group p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
            terpilihEssay.includes(soal.id)
              ? 'border-brand-500 bg-brand-50/70 shadow-sm ring-1 ring-brand-500/10 dark:bg-brand-900/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-300',
          ]"
          @click="togglePilih(soal.id, 'essay')"
        >
          <input
            type="checkbox"
            :checked="terpilihEssay.includes(soal.id)"
            class="mt-1 rounded text-brand-600"
          />
          <div class="flex-1 space-y-1">
            <div class="flex items-center gap-2">
              <span v-if="soal.mapel" class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">{{ soal.mapel }}</span>
              <span
                v-if="soal.dipakai"
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                ><AppIcon name="alert" class="h-3 w-3" /> Sudah Pernah Dicetak</span
              >
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                ><AppIcon name="sparkle" class="h-3 w-3" /> Belum Pernah Dipakai</span
              >
            </div>
            <p class="font-medium text-sm text-slate-800 dark:text-slate-100">
              {{ soal.pertanyaan }}
            </p>

            <!-- Menampilkan Gambar Soal Essay (Jika Ada) -->
            <div v-if="soal.imageUrl" class="mt-2">
              <img
                :src="soal.imageUrl"
                alt="Gambar Soal"
                class="max-h-40 object-contain rounded-lg border border-slate-200 dark:border-slate-700 p-1 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <section id="step-cetak" class="scroll-mt-36 rounded-2xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-900 dark:bg-brand-950/20"><div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p class="text-xs font-bold uppercase tracking-wider text-brand-600">Langkah terakhir</p><h2 class="mt-1 text-lg font-bold">Ujian siap diperiksa</h2><p class="mt-1 text-xs text-slate-500">{{ terpilihPG.length }} PG + {{ terpilihEssay.length }} esai dipilih. Buka pratinjau sebelum menyimpan PDF.</p></div><div class="flex flex-col gap-2 sm:flex-row"><button @click="bukaKertasCetak('A')" :disabled="!soalTerpilih.length" class="ui-button-primary"><AppIcon name="printer" class="h-4 w-4" />Pratinjau Paket A</button><button @click="bukaKertasCetak('AB')" :disabled="!soalTerpilih.length" class="ui-button-secondary border-amber-300 bg-amber-50 text-amber-800"><AppIcon name="copy" class="h-4 w-4" />Paket A & B</button></div></div></section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"><div class="mb-4 flex items-center gap-3"><span class="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"><AppIcon name="printer" class="h-4 w-4" /></span><div><h2 class="text-sm font-bold">Riwayat ujian</h2><p class="text-xs text-slate-500">Cetak ulang atau hapus riwayat ujian.</p></div></div><div v-if="riwayatUjian.length" class="space-y-2"><div v-for="item in riwayatUjian" :key="item.id" class="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700 sm:flex-row sm:items-center"><div><p class="text-sm font-bold">{{ item.namaUjian }} · {{ item.mapel }}</p><p class="text-[11px] text-slate-500">{{ formatTanggal(item.createdAt) }} · {{ item.jumlahSoal }} soal · Paket {{ item.modePaket }}</p></div><div class="flex gap-2"><button @click="cetakUlang(item)" class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"><AppIcon name="printer" class="h-3.5 w-3.5" />Cetak ulang</button><button @click="hapusRiwayat(item)" class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-300"><AppIcon name="trash" class="h-3.5 w-3.5" />Hapus</button></div></div></div><p v-else class="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-700">Belum ada riwayat cetak untuk kelas ini.</p></section>
    </div>
  </ClientOnly>
</template>

<script setup>
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  increment,
  arrayUnion,
  limit,
} from "firebase/firestore";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const router = useRouter();
const kelasId = Number(route.params.id);
const assignmentId = computed(() => String(route.query.assignment || "legacy"));
const jenjang = computed(() => String(route.query.jenjang || "SD"));
const schoolName = computed(() => String(route.query.sekolah || "Sekolah Saya"));
const { db } = useFirebase();
const { user } = useAuth();
const { success, error, warning } = useToast();
const { catatAktivitas } = useAuditLog();

const activeTab = ref("pg");
const printSteps = [
  { step: 1, label: "Atur identitas", href: "#step-identitas" },
  { step: 2, label: "Pilih soal", href: "#step-pilih-soal" },
  { step: 3, label: "Pratinjau", href: "#step-cetak" },
];
const mapelAjar = ref([]);
const selectedMapel = ref(route.query.mapel || "");
const { bankIdFor, questionsRefFor, questionRefFor, migrateLegacyQuestions } = useQuestionBanks();
const bankContext = computed(() => ({ teacherId: user.value?.uid, assignmentId: assignmentId.value, classLevel: kelasId, subject: selectedMapel.value, schoolName: schoolName.value, educationLevel: jenjang.value }));
const listSoalPG = ref([]);
const listSoalEssay = ref([]);

const terpilihPG = ref([]);
const terpilihEssay = ref([]);

const targetJumlahPG = ref(15);
const targetJumlahEssay = ref(5);
const searchQuery = ref("");
const komposisi = reactive({ mudah: 20, sedang: 60, sulit: 20 });
const acakOpsiPaketB = ref(true);
const watermark = ref("");
const riwayatUjian = ref([]);
const deletingHistoryId = ref("");
const savingKop = ref(false);
const uploadingLogo = ref("");
const templateUjian = ref([]);
const templateTerpilih = ref("");
const draftStatus = ref("Tersimpan");
const loadingPage = ref(true);
const layoutUjian = ref({ tanggal: "", durasi: 90, kolom: 2, orientasi: "portrait", fontSize: 11, spacing: "normal", essayLines: 4, footer: "Selamat mengerjakan", instruksiPG: "Berilah tanda silang (X) pada huruf a, b, c, atau d di depan jawaban yang paling benar!", instruksiEssay: "Jawablah pertanyaan-pertanyaan di bawah ini dengan singkat dan tepat!" });

const kopDocId = computed(() => `${user.value?.uid || "guru"}_${assignmentId.value}`.replace(/[^a-zA-Z0-9_-]/g, "_"));
const draftDocId = computed(() => `${kopDocId.value}_${kelasId}_${String(selectedMapel.value || "mapel").replace(/[^a-zA-Z0-9_-]/g, "_")}`);
const overlayLoading = computed(() => {
  if (uploadingLogo.value) return { show: true, title: "Menyiapkan logo sekolah", description: "Logo sedang dioptimalkan dan disimpan ke kop ujian." };
  if (savingKop.value) return { show: true, title: "Menyimpan identitas ujian", description: "Kop ujian akan siap digunakan untuk cetakan berikutnya." };
  if (deletingHistoryId.value) return { show: true, title: "Menghapus riwayat", description: "Riwayat ujian sedang diperbarui dengan aman." };
  if (loadingPage.value) return { show: true, title: "Menyiapkan ruang cetak", description: "Memuat soal, template, dan identitas ujian Anda." };
  return { show: false, title: "", description: "" };
});
let draftTimer;

const loadPengaturan = async () => {
  if (!user.value) return;
  try {
    const docSnap = await getDoc(doc(db, "pengaturanGuru", user.value.uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      const tugas = data.penugasan?.find((item) => item.id === assignmentId.value);
      mapelAjar.value = tugas?.mapelPerKelas?.[kelasId] || tugas?.mapelAjar || data.mapelAjar || [];
      infoUjian.value.namaSekolah = tugas?.namaSekolah || schoolName.value;
      const kopSnap = await getDoc(doc(db, "kopUjian", kopDocId.value));
      if (kopSnap.exists()) infoUjian.value = { ...infoUjian.value, ...kopSnap.data() };

      const mapelDariUrl = route.query.mapel;
      if (mapelDariUrl && mapelAjar.value.includes(mapelDariUrl)) {
        selectedMapel.value = mapelDariUrl;
      } else if (mapelAjar.value.length > 0 && !selectedMapel.value) {
        selectedMapel.value = mapelAjar.value[0];
      }
    }
  } catch (e) {
    console.error("Gagal memuat pengaturan:", e);
  }
};

watch(selectedMapel, (newMapel) => {
  if (newMapel) {
    router.replace({
      query: { ...route.query, mapel: newMapel },
    });

    resetPilihan();
    searchQuery.value = "";
    loadSoal();
  }
});

const infoUjian = ref({
  namaSekolah: "SD NEGERI UTAMA",
  namaUjian: "Penilaian Tengah Semester (PTS)",
  tahunAjaran: "2025/2026",
  semester: "Ganjil",
  alamat: "",
  wilayah: "",
  logoKiriUrl: "",
  logoKananUrl: "",
});

const soalTerpilih = computed(() => [...listSoalPG.value.filter(s => terpilihPG.value.includes(s.id)), ...listSoalEssay.value.filter(s => terpilihEssay.value.includes(s.id))]);
const pemeriksaan = computed(() => {
  const hasil = [];
  if (!soalTerpilih.value.length) hasil.push("Belum ada soal yang dipilih.");
  const pgTidakLengkap = soalTerpilih.value.filter(s => s.tipe !== "essay" && (!s.opsi?.a || !s.opsi?.b || !s.kunciJawaban));
  if (pgTidakLengkap.length) hasil.push(`${pgTidakLengkap.length} soal pilihan ganda belum memiliki opsi atau kunci yang lengkap.`);
  const teks = new Map(); let duplikat = 0;
  soalTerpilih.value.forEach(s => { const key = String(s.pertanyaan || "").trim().toLowerCase(); if (teks.has(key)) duplikat++; else teks.set(key, true); });
  if (duplikat) hasil.push(`${duplikat} soal terdeteksi duplikat dalam paket.`);
  if (!infoUjian.value.namaSekolah.trim()) hasil.push("Nama sekolah belum diisi.");
  if (!infoUjian.value.namaUjian.trim()) hasil.push("Nama ujian belum diisi.");
  return hasil;
});

const loadTemplate = async () => {
  if (!user.value) return;
  const snap = await getDocs(query(collection(db, "templateUjian"), where("userId", "==", user.value.uid), limit(30)));
  templateUjian.value = snap.docs.map(item => ({ id: item.id, ...item.data() })).filter(item => item.assignmentId === assignmentId.value);
};
const simpanTemplate = async () => {
  const nama = prompt("Nama template ujian:", `${infoUjian.value.namaUjian} ${infoUjian.value.semester}`);
  if (!nama?.trim()) return;
  await addDoc(collection(db, "templateUjian"), { userId: user.value.uid, assignmentId: assignmentId.value, nama: nama.trim(), infoUjian: { ...infoUjian.value }, layoutUjian: { ...layoutUjian.value }, komposisi: { ...komposisi }, watermark: watermark.value, createdAt: new Date(), updatedAt: new Date() });
  await catatAktivitas("template_ujian_dibuat", { nama: nama.trim() });
  await loadTemplate(); success("Template ujian berhasil disimpan.");
};
const pakaiTemplate = () => { const item = templateUjian.value.find(template => template.id === templateTerpilih.value); if (!item) return; infoUjian.value = { ...infoUjian.value, ...item.infoUjian }; layoutUjian.value = { ...layoutUjian.value, ...item.layoutUjian }; Object.assign(komposisi, item.komposisi || {}); watermark.value = item.watermark || ""; success(`Template ${item.nama} diterapkan.`); };

const simpanKop = async () => {
  if (!user.value) return;
  savingKop.value = true;
  try {
    await setDoc(doc(db, "kopUjian", kopDocId.value), { ...infoUjian.value, userId: user.value.uid, assignmentId: assignmentId.value, updatedAt: new Date() }, { merge: true });
    success("Pengaturan kop berhasil disimpan.");
  } catch (err) {
    console.error("Gagal menyimpan kop:", err);
    error("Pengaturan kop belum berhasil disimpan.");
  } finally { savingKop.value = false; }
};

const logoKey = posisi => `logo${posisi[0].toUpperCase()}${posisi.slice(1)}Url`;
const kompresLogo = file => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    const batas = 240;
    const scale = Math.min(1, batas / image.naturalWidth, batas / image.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(objectUrl);
    resolve(canvas.toDataURL("image/jpeg", 0.9));
  };
  image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("File gambar tidak dapat dibaca")); };
  image.src = objectUrl;
});
const unggahLogo = async (event, posisi) => {
  const file = event.target.files?.[0];
  if (!file || !user.value) return;
  if (!file.type.startsWith("image/")) { warning("Pilih file gambar PNG, JPG, atau WEBP."); event.target.value = ""; return; }
  if (file.size > 5 * 1024 * 1024) { warning("Ukuran logo maksimal 5 MB."); event.target.value = ""; return; }
  uploadingLogo.value = posisi;
  try {
    infoUjian.value[logoKey(posisi)] = await kompresLogo(file);
    await setDoc(doc(db, "kopUjian", kopDocId.value), { ...infoUjian.value, userId: user.value.uid, assignmentId: assignmentId.value, updatedAt: new Date() }, { merge: true });
  } catch (err) { console.error("Gagal memproses logo:", err); error(`Logo gagal diproses: ${err?.message || "format file tidak didukung"}.`); }
  finally { uploadingLogo.value = ""; event.target.value = ""; }
};
const hapusLogo = posisi => { infoUjian.value[logoKey(posisi)] = ""; };

const filteredListPG = computed(() => {
  if (!searchQuery.value.trim()) return listSoalPG.value;
  return listSoalPG.value.filter((s) =>
    s.pertanyaan.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const filteredListEssay = computed(() => {
  if (!searchQuery.value.trim()) return listSoalEssay.value;
  return listSoalEssay.value.filter((s) =>
    s.pertanyaan.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const loadSoal = async () => {
  if (!user.value || !selectedMapel.value) return;
  try {
    await migrateLegacyQuestions(bankContext.value);
    const q = query(
      questionsRefFor(bankContext.value),
      limit(300),
    );
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => ({ id: d.id, bankId: bankIdFor(bankContext.value), ...d.data() })).filter(soal => (soal.status || "aktif") === "aktif");
    listSoalPG.value = all.filter((s) => s.tipe !== "essay");
    listSoalEssay.value = all.filter((s) => s.tipe === "essay");
  } catch (e) {
    console.error("Gagal memuat soal:", e);
  }
};

const togglePilih = (id, tipe) => {
  const target = tipe === "pg" ? terpilihPG : terpilihEssay;
  const limit = tipe === "pg" ? targetJumlahPG.value : targetJumlahEssay.value;

  if (target.value.includes(id)) {
    target.value = target.value.filter((item) => item !== id);
  } else {
    if (target.value.length >= limit) {
      warning(
        `Batas maksimum pemilihan untuk tipe ini adalah ${limit} soal. Silakan naikkan input target jika ingin memilih lebih banyak.`,
      );
      return;
    }
    target.value.push(id);
  }
};

const pilihSemuaDenganLimit = (tipe) => {
  const list = tipe === "pg" ? listSoalPG.value : listSoalEssay.value;
  const limit = tipe === "pg" ? targetJumlahPG.value : targetJumlahEssay.value;
  const selectedIds = list.slice(0, limit).map((s) => s.id);

  if (tipe === "pg") terpilihPG.value = selectedIds;
  else terpilihEssay.value = selectedIds;
};

const pilihAcak = (tipe) => {
  const list = tipe === "pg" ? listSoalPG.value : listSoalEssay.value;
  const limit = tipe === "pg" ? targetJumlahPG.value : targetJumlahEssay.value;

  const shuffled = [...list].sort(() => 0.5 - Math.random());
  const selectedIds = shuffled.slice(0, limit).map((s) => s.id);

  if (tipe === "pg") terpilihPG.value = selectedIds;
  else terpilihEssay.value = selectedIds;
};

const pilihHanyaBelumDipakai = (tipe) => {
  const list = tipe === "pg" ? listSoalPG.value : listSoalEssay.value;
  const limit = tipe === "pg" ? targetJumlahPG.value : targetJumlahEssay.value;

  const sortedByUnused = [...list].sort((a, b) =>
    a.dipakai === b.dipakai ? 0 : a.dipakai ? 1 : -1,
  );
  const selectedIds = sortedByUnused.slice(0, limit).map((s) => s.id);

  if (tipe === "pg") terpilihPG.value = selectedIds;
  else terpilihEssay.value = selectedIds;
};

const ambilSesuaiKomposisi = (list, total) => {
  const levels = ["mudah", "sedang", "sulit"];
  const shuffled = (items) => [...items].sort(() => Math.random() - 0.5);
  const hasil = [];
  levels.forEach((level, index) => {
    const jumlah = index === levels.length - 1
      ? total - hasil.length
      : Math.round(total * (komposisi[level] || 0) / 100);
    hasil.push(...shuffled(list.filter(s => (s.tingkatKesulitan || "sedang") === level && !hasil.includes(s))).slice(0, Math.max(0, jumlah)));
  });
  if (hasil.length < total) hasil.push(...shuffled(list.filter(s => !hasil.includes(s))).slice(0, total - hasil.length));
  return hasil.slice(0, total).map(s => s.id);
};

const pilihBerdasarkanKomposisi = () => {
  const totalPersen = komposisi.mudah + komposisi.sedang + komposisi.sulit;
  if (totalPersen !== 100) { warning("Total komposisi tingkat kesulitan harus 100%."); return; }
  terpilihPG.value = ambilSesuaiKomposisi(listSoalPG.value, Math.min(targetJumlahPG.value, listSoalPG.value.length));
  terpilihEssay.value = ambilSesuaiKomposisi(listSoalEssay.value, Math.min(targetJumlahEssay.value, listSoalEssay.value.length));
};

const acakArray = (items) => [...items].sort(() => Math.random() - 0.5);
const acakOpsi = (soal) => {
  if (!soal.opsi || soal.tipe === "essay") return { ...soal };
  const keys = ["a", "b", "c", "d"].filter(key => soal.opsi[key]);
  const jawabanBenar = soal.opsi[soal.kunciJawaban];
  const values = acakArray(keys.map(key => ({ teks: soal.opsi[key], gambar: soal.opsiGambar?.[key] || "" })));
  const opsi = Object.fromEntries(keys.map((key, index) => [key, values[index].teks]));
  const opsiGambar = Object.fromEntries(keys.map((key, index) => [key, values[index].gambar]));
  return { ...soal, opsi, opsiGambar, kunciJawaban: keys.find(key => opsi[key] === jawabanBenar) || soal.kunciJawaban };
};

const resetPilihan = () => {
  terpilihPG.value = [];
  terpilihEssay.value = [];
};

const bukaKertasCetak = async (mode = "A") => {
  if (pemeriksaan.value.some(item => item.includes("belum memiliki") || item.includes("Nama sekolah") || item.includes("Nama ujian") || item.includes("Belum ada"))) { warning("Perbaiki hasil pemeriksaan sebelum mencetak."); return; }
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    warning("Jendela cetak diblokir browser. Izinkan pop-up untuk TeachBank, lalu coba lagi.");
    return;
  }

  // Memastikan seluruh objek data soal (termasuk imageUrl) terkirim ke halaman print
  const pgA = listSoalPG.value.filter((s) => terpilihPG.value.includes(s.id));
  const essayA = listSoalEssay.value.filter((s) => terpilihEssay.value.includes(s.id));
  const paketA = { label: "A", pg: pgA, essay: essayA };
  const paketB = { label: "B", pg: acakArray(pgA).map(s => acakOpsiPaketB.value ? acakOpsi(s) : { ...s }), essay: acakArray(essayA) };
  const printData = {
    infoUjian: infoUjian.value,
    kelas: kelasId,
    jenjang: jenjang.value,
    namaSekolah: schoolName.value,
    mapel: selectedMapel.value,
    pg: paketA.pg,
    essay: paketA.essay,
    pakets: mode === "AB" ? [paketA, paketB] : [paketA],
    watermark: watermark.value,
    layoutUjian: { ...layoutUjian.value },
    dibuatPada: new Date().toISOString(),
  };
  localStorage.setItem("teachbank_print_payload", JSON.stringify(printData));

  printWindow.location.href = `/dashboard/kelas/${kelasId}/print`;

  try {
    const ids = [...terpilihPG.value, ...terpilihEssay.value];
    const updatePromises = ids.map((id) =>
      updateDoc(questionRefFor(bankContext.value, id), {
        dipakai: true,
        jumlahDicetak: increment(1),
        riwayatPenggunaan: arrayUnion(new Date()),
        terakhirDipakai: new Date(),
      }),
    );
    await Promise.all(updatePromises);
    await addDoc(collection(db, "riwayatUjian"), {
      userId: user.value.uid, assignmentId: assignmentId.value, kelas: kelasId,
      jenjang: jenjang.value, namaSekolah: schoolName.value, mapel: selectedMapel.value,
      namaUjian: infoUjian.value.namaUjian, jumlahSoal: ids.length, modePaket: mode,
      payload: printData, createdAt: new Date(),
    });
    await catatAktivitas("ujian_dicetak", { mapel: selectedMapel.value, kelas: kelasId, jumlahSoal: ids.length, modePaket: mode });
  } catch (e) {
    console.error("Gagal memperbarui status soal di Firestore:", e);
  }
};

const loadRiwayat = async () => {
  if (!user.value) return;
  try {
    const snap = await getDocs(query(collection(db, "riwayatUjian"), where("userId", "==", user.value.uid), where("assignmentId", "==", assignmentId.value), limit(20)));
    riwayatUjian.value = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(item => Number(item.kelas) === kelasId).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)).slice(0, 10);
  } catch (error) { console.error("Gagal memuat riwayat:", error); }
};
const formatTanggal = value => { const date = value?.toDate ? value.toDate() : new Date(value); return Number.isNaN(date.getTime()) ? "-" : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date); };
const cetakUlang = (item) => { localStorage.setItem("teachbank_print_payload", JSON.stringify(item.payload)); window.open(`/dashboard/kelas/${kelasId}/print`, "_blank"); };
const hapusRiwayat = async item => { if (!confirm(`Hapus riwayat "${item.namaUjian}"?`)) return; deletingHistoryId.value = item.id; try { await deleteDoc(doc(db, "riwayatUjian", item.id)); await catatAktivitas("riwayat_ujian_dihapus", { riwayatId: item.id, namaUjian: item.namaUjian }); riwayatUjian.value = riwayatUjian.value.filter(riwayat => riwayat.id !== item.id); success("Riwayat ujian berhasil dihapus."); } catch (err) { console.error("Gagal menghapus riwayat ujian:", err); error("Riwayat ujian gagal dihapus."); } finally { deletingHistoryId.value = ""; } };

onMounted(async () => {
  try {
    await loadPengaturan();
    const [, , , draft] = await Promise.all([
      loadSoal(),
      loadRiwayat(),
      loadTemplate(),
      getDoc(doc(db, "draftGuru", draftDocId.value)),
    ]);
    if (draft.exists()) { layoutUjian.value = { ...layoutUjian.value, ...draft.data().layoutUjian }; infoUjian.value = { ...infoUjian.value, ...draft.data().infoUjian }; }
  } finally {
    loadingPage.value = false;
  }
});
watch([infoUjian, layoutUjian, watermark], () => {
  if (!user.value) return;
  draftStatus.value = "Belum tersimpan";
  clearTimeout(draftTimer);
  draftTimer = setTimeout(async () => {
    draftStatus.value = "Menyimpan…";
    try { await setDoc(doc(db, "draftGuru", draftDocId.value), { userId: user.value.uid, assignmentId: assignmentId.value, kelas: kelasId, mapel: selectedMapel.value, infoUjian: { ...infoUjian.value }, layoutUjian: { ...layoutUjian.value }, watermark: watermark.value, updatedAt: new Date() }, { merge: true }); draftStatus.value = "Tersimpan"; }
    catch { draftStatus.value = "Gagal menyimpan"; }
  }, 2500);
}, { deep: true });
</script>
