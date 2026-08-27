<!-- pages/dashboard/kelas/[id]/index.vue -->
<template>
  <div class="mx-auto max-w-6xl space-y-6 pb-16 text-slate-800 dark:text-slate-100">
    <AppLoadingOverlay
      :show="overlayLoading.show"
      :title="overlayLoading.title"
      :description="overlayLoading.description"
    />
    <!-- Header Navigation -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-800 to-brand-600 p-6 text-white shadow-xl shadow-brand-900/10 sm:p-8">
      <div class="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10"></div>
      <div class="absolute -bottom-20 right-48 h-44 w-44 rounded-full bg-brand-300/10"></div>
      <div class="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div class="max-w-2xl">
        <NuxtLink
          to="/dashboard"
          class="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white"
          ><AppIcon name="arrowLeft" class="h-4 w-4" /> Kembali ke Dashboard</NuxtLink
        >
        <div class="flex items-start gap-4"><span class="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 sm:grid"><AppIcon name="book" class="h-6 w-6" /></span><div><p class="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-100">{{ schoolName }}</p><h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Gudang Soal Kelas {{ kelasId }} {{ jenjang }}</h1><p class="mt-2 text-sm text-brand-100">Kelola, susun, dan siapkan soal ujian dalam satu tempat.</p></div></div>
      </div>

      <ClientOnly>
        <div class="flex w-full flex-col gap-2 rounded-2xl bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur-sm sm:w-auto sm:flex-row">
          <!-- Filter Mapel -->
          <select
            v-if="mapelAjar.length > 0"
            v-model="selectedMapel"
            @change="updateUrlQuery"
            class="min-w-40 flex-1 rounded-xl border-0 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none sm:flex-none"
          >
            <option v-for="m in mapelAjar" :key="m" :value="m">{{ m }}</option>
          </select>

          <!-- Tombol Cetak Soal -->
          <NuxtLink
            :to="{ path: `/dashboard/kelas/${kelasId}/cetak`, query: route.query }"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-950 shadow transition hover:bg-amber-300"
          >
            <AppIcon name="printer" class="h-4 w-4" /> Cetak Ujian
          </NuxtLink>

          <!-- Tombol Buat Soal -->
          <button
            @click="bukaModalTambah"
            :disabled="!selectedMapel"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow transition hover:bg-brand-50 disabled:opacity-50"
          >
            <AppIcon name="plus" class="h-4 w-4" /> Buat Soal
          </button>
        </div>
      </ClientOnly></div>
    </div>

    <!-- Ringkasan Statistik Soal -->
    <ClientOnly>
      <div
        v-if="mapelAjar.length > 0 && !loadingData"
        class="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <div
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="mb-3 flex items-center justify-between"><span class="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"><AppIcon name="layers" class="h-4 w-4" /></span><span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Semua</span></div><p class="text-2xl font-bold">{{ stats.total }}</p><p class="text-xs text-slate-500">Total soal</p>
        </div>
        <div
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="mb-3 flex items-center justify-between"><span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300"><AppIcon name="list" class="h-4 w-4" /></span><span class="text-[10px] font-bold uppercase tracking-wider text-brand-500">PG</span></div><p class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ stats.pg }}</p><p class="text-xs text-slate-500">Pilihan ganda</p>
        </div>
        <div
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="mb-3 flex items-center justify-between"><span class="grid h-9 w-9 place-items-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"><AppIcon name="edit" class="h-4 w-4" /></span><span class="text-[10px] font-bold uppercase tracking-wider text-purple-500">Uraian</span></div><p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.essay }}</p><p class="text-xs text-slate-500">Essay / uraian</p>
        </div>
        <div
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="mb-3 flex items-center justify-between"><span class="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"><AppIcon name="sparkle" class="h-4 w-4" /></span><span class="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Segar</span></div><p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats.belumDipakai }}</p><p class="text-xs text-slate-500">Belum dipakai</p>
        </div>
      </div>
    </ClientOnly>

    <!-- Pencarian dan alat bank soal -->
    <ClientOnly>
      <div
        v-if="mapelAjar.length > 0"
        class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex flex-col gap-2 lg:flex-row">
        <div class="relative min-w-0 flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pertanyaan atau teks soal..."
            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900/50"
          />
          <AppIcon name="search" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        <div class="flex shrink-0 rounded-xl bg-slate-100 p-1 text-xs font-semibold dark:bg-slate-900">
          <button
            v-for="filter in ['semua', 'pg', 'essay']"
            :key="filter"
            @click="filterTipe = filter"
            :class="[
              'px-3 py-1.5 rounded-lg capitalize transition',
              filterTipe === filter
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500',
            ]"
          >
            {{ filter }}
          </button>
        </div>
        <button @click="showAdvancedFilters = !showAdvancedFilters" class="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"><AppIcon name="settings" class="h-4 w-4" />{{ showAdvancedFilters ? 'Tutup filter' : 'Filter lanjutan' }}<span v-if="activeFilterCount" class="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] text-white">{{ activeFilterCount }}</span></button>
        <details class="relative shrink-0"><summary class="flex min-h-10 cursor-pointer list-none items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"><AppIcon name="file" class="h-4 w-4" />Impor & ekspor</summary><div class="absolute right-0 top-12 z-40 grid min-w-48 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800"><button @click="downloadTemplateExcel" class="rounded-lg px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700">Unduh template</button><button @click="$refs.csvInput.click()" :disabled="importingSpreadsheet" class="rounded-lg px-3 py-2 text-left text-xs font-semibold text-brand-600 hover:bg-brand-50">Import soal</button><button @click="exportExcel" :disabled="!daftarSoal.length" class="rounded-lg px-3 py-2 text-left text-xs font-semibold text-emerald-600 hover:bg-emerald-50">Export Excel</button><button @click="showModalHapusSemua = true" :disabled="!jumlahSoalBisaDihapus || deletingAll" class="rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50">Pindahkan semua ke sampah</button></div></details>
        <input ref="csvInput" type="file" accept=".xlsx,.xls,.csv,text/csv" class="hidden" @change="importSpreadsheet" />
        </div>
        <div v-if="showAdvancedFilters" class="mt-3 grid gap-2 border-t border-slate-100 pt-3 dark:border-slate-700 sm:grid-cols-2 lg:grid-cols-5">
        <select v-model="filterKesulitan" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-900/50"><option value="semua">Semua level</option><option value="belum">Belum dinilai</option><option value="mudah">Mudah</option><option value="sedang">Sedang</option><option value="sulit">Sulit</option></select>
        <select v-model="filterKognitif" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-900/50"><option value="semua">Semua kognitif</option><option v-for="level in levelKognitifOptions" :key="level" :value="level">{{ level }}</option></select>
        <div class="relative min-w-0">
          <input v-model.trim="filterMateri" list="daftar-materi-filter" type="search" autocomplete="off" class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs font-semibold outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900/50" placeholder="Semua materi" aria-label="Cari atau pilih materi" />
          <datalist id="daftar-materi-filter"><option v-for="materi in daftarMateri" :key="materi" :value="materi" /></datalist>
          <button v-if="filterMateri" type="button" @click="filterMateri = ''" class="absolute right-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700" aria-label="Hapus filter materi"><AppIcon name="x" class="h-3 w-3" /></button>
        </div>
        <select v-model="filterKualitas" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-900/50"><option value="semua">Semua kualitas</option><option value="siap">Siap pakai</option><option value="perlu-perbaikan">Perlu perbaikan</option></select>
        <select v-model="filterStatus" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-900/50"><option value="aktif">Soal aktif</option><option value="draft">Draft</option><option value="arsip">Arsip</option><option value="sampah">Sampah</option><option value="semua">Semua status</option></select>
        </div>
      </div>
    </ClientOnly>

    <div v-if="selectedIds.length" class="sticky top-20 z-30 flex flex-wrap items-center gap-2 rounded-2xl border border-brand-200 bg-white p-3 shadow-lg dark:border-brand-800 dark:bg-slate-800"><span class="mr-auto text-xs font-bold">{{ selectedIds.length }} soal dipilih</span><select v-model="bulkDifficulty" class="rounded-lg border px-2 py-1.5 text-xs dark:bg-slate-900"><option value="">Ubah kesulitan</option><option value="mudah">Mudah</option><option value="sedang">Sedang</option><option value="sulit">Sulit</option></select><button @click="terapkanKesulitanMassal" :disabled="!bulkDifficulty" class="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">Terapkan</button><button @click="ubahStatusMassal('arsip')" class="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">Arsipkan</button><button @click="selectedIds = []" class="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500">Batal</button></div>

    <!-- State Loading -->
    <div v-if="loadingData" class="rounded-2xl border border-slate-200 bg-white py-14 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800">
      <AppIcon name="loader" class="mx-auto mb-3 h-6 w-6 animate-spin text-brand-500" /><p class="text-sm font-medium">Memuat data soal...</p>
    </div>

    <!-- State Belum Ada Mapel -->
    <div
      v-else-if="mapelAjar.length === 0"
      class="text-center py-12 text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border p-6"
    >
      <p class="mb-4">Anda belum menambahkan Mata Pelajaran di Pengaturan.</p>
      <NuxtLink
        to="/pengaturan"
        class="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl"
        >Atur Mapel Sekarang</NuxtLink
      >
    </div>

    <!-- State Kosong Soal -->
    <div
      v-else-if="daftarSoal.length === 0"
      class="text-center py-12 text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border"
    >
      Belum ada soal untuk mata pelajaran <b>{{ selectedMapel }}</b> di Kelas
      {{ kelasId }}.
    </div>

    <!-- State Hasil Pencarian Tidak Ditemukan -->
    <div
      v-else-if="filteredSoal.length === 0"
      class="text-center py-12 text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border"
    >
      Tidak ditemukan soal yang cocok.
    </div>

    <!-- Daftar Soal -->
    <div v-else class="space-y-4">
      <div
        v-for="(item, index) in filteredSoal"
        :key="item.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex justify-between items-start gap-4 mb-3">
          <div class="flex flex-wrap items-center gap-2">
            <input v-model="selectedIds" type="checkbox" :value="item.id" :aria-label="`Pilih soal ${index + 1}`" class="h-4 w-4 rounded border-slate-300 text-brand-600" />
            <span
              class="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
            >
              Soal #{{ index + 1 }} - {{ item.mapel }} ({{
                item.tipe === "essay" ? "Essay" : "PG"
              }})
            </span>
            <span :class="['rounded-full px-2.5 py-1 text-[10px] font-bold capitalize', difficultyClass(item.tingkatKesulitan)]">{{ item.tingkatKesulitan || 'belum dinilai' }}</span>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold capitalize text-slate-600 dark:bg-slate-700 dark:text-slate-300">{{ item.status || 'aktif' }}</span>
            <span v-if="item.levelKognitif" class="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">{{ item.levelKognitif }}</span>
            <span :class="['rounded-full px-2.5 py-1 text-[10px] font-bold', qualityIssues(item).length ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300']" :title="qualityIssues(item).join(' · ')">{{ qualityIssues(item).length ? `${qualityIssues(item).length} perlu diperbaiki` : 'Siap pakai' }}</span>

            <span
              v-if="item.dipakai"
              class="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
            >
              <span class="inline-flex items-center gap-1"><AppIcon name="alert" class="h-3 w-3" /> Pernah Dicetak</span>
            </span>
            <span
              v-else
              class="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
            >
              <span class="inline-flex items-center gap-1"><AppIcon name="sparkle" class="h-3 w-3" /> Belum Dipakai</span>
            </span>
          </div>

          <div class="flex items-center gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-900/40">
            <button v-if="(item.status || 'aktif') !== 'sampah'"
              @click="duplikatSoal(item)"
              class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-slate-700 hover:shadow-sm dark:hover:bg-slate-700"
              title="Gandakan Soal Ini"
            >
              <AppIcon name="copy" class="h-3.5 w-3.5" /> <span class="hidden sm:inline">Duplikat</span>
            </button>
            <button v-else @click="pulihkanSoal(item)" class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-white dark:hover:bg-slate-700"><AppIcon name="refresh" class="h-3.5 w-3.5" /> Pulihkan</button>
            <button
              @click="bukaModalEdit(item)"
              class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-white hover:shadow-sm dark:hover:bg-slate-700"
            >
              <AppIcon name="edit" class="h-3.5 w-3.5" /> <span class="hidden sm:inline">Edit</span>
            </button>
            <button
              @click="mintaKonfirmasiHapus(item)"
              class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-white hover:text-red-700 hover:shadow-sm dark:hover:bg-slate-700"
            >
              <AppIcon name="trash" class="h-3.5 w-3.5" /> <span class="hidden sm:inline">Hapus</span>
            </button>
          </div>
        </div>

        <MathText :text="item.pertanyaan" tag="p" class="font-bold text-base mb-3 text-slate-800 dark:text-slate-100" />
        <p class="mb-3 text-[11px] text-slate-400">Dicetak {{ penggunaanSetahun(item) }} kali dalam 1 tahun terakhir · {{ item.jumlahDicetak || 0 }} kali total<span v-if="item.terakhirDipakai"> · terakhir {{ formatTanggal(item.terakhirDipakai) }}</span></p>
        <div v-if="item.materi || item.tujuanPembelajaran" class="mb-3 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900/40"><p v-if="item.materi"><b>Materi:</b> {{ item.materi }}</p><p v-if="item.tujuanPembelajaran" class="mt-1"><b>Indikator/TP:</b> {{ item.tujuanPembelajaran }}</p></div>

        <!-- Tampilan Gambar dari Base64 Firestore -->
        <div v-if="item.imageUrl" class="mb-3">
          <img
            :src="item.imageUrl"
            alt="Gambar Soal"
            class="max-h-48 rounded-xl border border-slate-200 dark:border-slate-700 object-contain bg-slate-50 dark:bg-slate-900 p-1"
          />
        </div>

        <!-- Pilihan Ganda -->
        <div
          v-if="item.tipe !== 'essay'"
          class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm"
        >
          <div
            v-for="kunci in ['a', 'b', 'c', 'd']"
            :key="kunci"
            v-show="item.opsi && item.opsi[kunci]"
            :class="[
              'p-2.5 rounded-xl border transition',
              item.kunciJawaban === kunci
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 font-semibold text-green-700 dark:text-green-300'
                : 'border-slate-200 dark:border-slate-700',
            ]"
          >
            <span class="uppercase font-bold mr-1">{{ kunci }}.</span>
            <MathText :text="item.opsi[kunci]" />
            <span v-if="item.kunciJawaban === kunci" class="ml-2 inline-flex items-center gap-1 text-xs"
              ><AppIcon name="check" class="h-3 w-3" /> Kunci</span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="filteredAllSoal.length" class="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-800 sm:flex-row">
      <p class="text-slate-500"><b class="text-slate-700 dark:text-slate-200">Halaman {{ currentPage }}</b> · {{ filteredAllSoal.length }} soal sesuai filter sudah dimuat<span v-if="filterStatus === 'aktif' && hasMoreQuestions"> dari {{ stats.total }} soal aktif di {{ selectedMapel }} kelas {{ kelasId }}</span></p>
      <div class="flex w-full gap-2 sm:w-auto">
        <button @click="previousPage" :disabled="currentPage === 1 || loadingMore" class="flex-1 rounded-xl border border-slate-200 px-4 py-2 font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-700 sm:flex-none">Sebelumnya</button>
        <button @click="nextPage" :disabled="(!hasMoreQuestions && currentPage >= totalPages) || loadingMore" class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"><AppIcon v-if="loadingMore" name="loader" class="h-3.5 w-3.5 animate-spin" />{{ loadingMore ? 'Menyiapkan…' : 'Berikutnya' }}</button>
      </div>
    </div>

    <!-- Dialog Pemulihan Draft -->
    <ClientOnly>
      <Teleport to="body">
        <div
          v-if="showDraftRecovery"
          class="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-pemulihan-draft"
        >
          <div class="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl dark:bg-slate-800">
            <div class="relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-500 px-6 pb-8 pt-6 text-white">
              <div class="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10"></div>
              <div class="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <AppIcon name="file" class="h-6 w-6" />
              </div>
              <h2 id="judul-pemulihan-draft" class="relative mt-4 text-xl font-bold">Draft soal ditemukan</h2>
              <p class="relative mt-1 text-sm leading-relaxed text-brand-50">Tulisan Anda sebelumnya masih tersimpan. Ingin melanjutkan dari terakhir kali?</p>
            </div>
            <div class="space-y-4 p-6">
              <div class="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                <AppIcon name="sparkle" class="mt-0.5 h-5 w-5 shrink-0" />
                <p class="text-xs leading-relaxed">Pilih <b>Lanjutkan draft</b> agar isian lama kembali. Pilih <b>Buang draft</b> untuk memulai soal baru.</p>
              </div>
              <div class="flex flex-col-reverse gap-2 sm:flex-row">
                <button type="button" @click="buangDraft" class="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-red-950/20">
                  Buang draft
                </button>
                <button type="button" @click="lanjutkanDraft" class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700">
                  <AppIcon name="refresh" class="h-4 w-4" /> Lanjutkan draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>

    <!-- Modal Form Input / Edit Soal -->
    <ClientOnly>
      <Teleport to="body">
      <div
        v-if="showModalForm"
        class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/70 p-2 backdrop-blur-sm sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-form-soal"
        @click.self="showModalForm = false"
      >
        <div
          class="my-1 max-h-[calc(100dvh-1rem)] w-full max-w-2xl space-y-4 overflow-x-hidden overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl dark:bg-slate-800 sm:my-4 sm:max-h-[calc(100dvh-2rem)] sm:space-y-5 sm:rounded-3xl sm:p-6"
        >
          <div class="sticky -top-4 z-20 -mx-4 -mt-4 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-4 pb-3 pt-4 dark:border-slate-700 dark:bg-slate-800 sm:-top-6 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-6"><div class="min-w-0"><h2 id="judul-form-soal" class="truncate text-lg font-bold sm:text-xl">
            {{ isEditMode ? "Edit Soal" : "Buat Soal Baru" }} ({{
              selectedMapel
            }})
          </h2><p v-if="!isEditMode" class="mt-1 text-[10px] text-slate-400">{{ formDraftStatus }}</p></div><button @click="showModalForm = false" class="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"><AppIcon name="x" class="h-4 w-4" /></button></div>

          <div class="rounded-xl bg-brand-50 p-3 dark:bg-brand-950/20"><p class="text-xs font-bold text-brand-700 dark:text-brand-300">Buat soal cepat</p><p class="mt-0.5 text-[11px] text-slate-500">Cukup isi tipe, pertanyaan, dan jawaban. Informasi lainnya bersifat opsional.</p></div>
          <div>
            <label class="block text-sm font-medium mb-1">Tipe Soal</label>
            <select
              v-model="formSoal.tipe"
              class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-sm"
            >
              <option value="pg">Pilihan Ganda (A-D)</option>
              <option value="essay">Essay / Uraian</option>
            </select>
          </div>
          <div class="rounded-xl bg-brand-50 p-3 dark:bg-brand-950/20"><p class="text-xs font-bold text-brand-700 dark:text-brand-300">1. Isi soal</p><p class="mt-0.5 text-[11px] text-slate-500">Tuliskan pertanyaan dengan jelas dan tambahkan gambar bila diperlukan.</p></div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Pertanyaan Soal</label
            >
            <textarea
              v-model="formSoal.pertanyaan"
              rows="3"
              placeholder="Tuliskan pertanyaan di sini..."
              class="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            ></textarea>
          </div>

          <div v-if="formSoal.tipe === 'essay'" class="rounded-2xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-800 dark:bg-brand-950/20">
            <div class="mb-2 flex items-center justify-between gap-3">
              <label for="pedoman-jawaban-essay" class="text-sm font-bold text-slate-800 dark:text-slate-100">Pedoman jawaban <span class="text-red-500">*</span></label>
              <span class="rounded-full bg-brand-100 px-2 py-1 text-[10px] font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">Wajib untuk essay</span>
            </div>
            <textarea id="pedoman-jawaban-essay" v-model="formSoal.pembahasan" rows="3" class="ui-input" placeholder="Tuliskan jawaban benar atau poin-poin yang harus disebutkan siswa…" required />
            <p class="mt-2 text-[11px] leading-relaxed text-slate-500">Pedoman ini menjadi patokan saat memeriksa jawaban siswa dan tidak ikut tercetak sebagai pertanyaan.</p>
          </div>

          <!-- UPLOAD FILE GAMBAR UNTUK KONVERSI KE BASE64 (TANPA FIREBASE STORAGE) -->
          <div
            class="space-y-2 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <label
                class="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400"
              >
                <span class="inline-flex items-center gap-1.5"><AppIcon name="image" class="h-4 w-4" /> Upload Gambar Soal (Opsional)</span>
              </label>
              <button
                v-if="formSoal.imageUrl"
                @click="hapusGambar"
                type="button"
                class="text-[11px] text-red-500 hover:underline font-semibold"
              >
                Hapus Gambar
              </button>
            </div>

            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
            />
            <p class="text-[11px] text-slate-400">
              Gambar disimpan ke Firebase Storage (maksimal 2 MB).
            </p>

            <!-- Pratinjau Gambar -->
            <div
              v-if="formSoal.imageUrl"
              class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700"
            >
              <p class="text-[10px] text-slate-400 mb-1">Pratinjau:</p>
              <img
                :src="formSoal.imageUrl"
                alt="Preview Gambar Soal"
                class="max-h-36 rounded-lg border border-slate-300 dark:border-slate-600 object-contain bg-white p-1"
              />
            </div>
          </div>

          <div v-if="formSoal.tipe === 'pg'" class="space-y-2"><div class="mb-3 rounded-xl bg-brand-50 p-3 dark:bg-brand-950/20"><p class="text-xs font-bold text-brand-700 dark:text-brand-300">3. Pilihan & kunci jawaban</p><p class="mt-0.5 text-[11px] text-slate-500">Isi minimal dua pilihan lalu tandai jawaban yang benar.</p></div>
            <label class="block text-sm font-medium"
              >Pilihan Jawaban A, B, C, D:</label
            >
            <div
              v-for="kunci in ['a', 'b', 'c', 'd']"
              :key="kunci"
              class="grid grid-cols-[1.25rem_minmax(0,1fr)_2.25rem] items-center gap-2 sm:grid-cols-[1.25rem_minmax(0,1fr)_2.25rem_auto]"
            >
              <span class="font-bold uppercase w-4 text-center text-sm">{{
                kunci
              }}</span>
              <input
                v-model="formSoal.opsi[kunci]"
                type="text"
                :placeholder="`Jawaban ${kunci.toUpperCase()}`"
                class="min-w-0 w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-brand-500"
              />
              <label class="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-600 dark:border-slate-700" :title="`Upload gambar opsi ${kunci.toUpperCase()}`"><AppIcon name="image" class="h-4 w-4" /><input type="file" accept="image/*" class="hidden" @change="handleOpsiImage($event, kunci)" /></label>
              <label
                class="col-start-2 col-end-4 row-start-2 flex w-fit items-center gap-1 rounded-lg border px-2 py-1 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 sm:col-start-4 sm:col-end-5 sm:row-start-1"
              >
                <input
                  type="radio"
                  name="kunciJawaban"
                  :value="kunci"
                  v-model="formSoal.kunciJawaban"
                />
                <span>Kunci</span>
              </label>
            </div>
            <div v-if="Object.values(formSoal.opsiGambar || {}).some(Boolean)" class="grid grid-cols-2 gap-2 pt-2"><div v-for="kunci in ['a','b','c','d']" :key="`preview-${kunci}`" v-show="formSoal.opsiGambar?.[kunci]" class="relative rounded-lg border border-slate-200 p-2 dark:border-slate-700"><button type="button" @click="formSoal.opsiGambar[kunci] = ''" class="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-red-500 shadow"><AppIcon name="x" class="h-3 w-3" /></button><p class="mb-1 text-[10px] font-bold uppercase">Opsi {{ kunci }}</p><img :src="formSoal.opsiGambar[kunci]" class="h-20 w-full object-contain" /></div></div>
          </div>

          <div v-if="formQualityIssues.length" class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"><b>Periksa sebelum menyimpan:</b><ul class="mt-1 list-disc pl-4"><li v-for="issue in formQualityIssues" :key="issue">{{ issue }}</li></ul></div>

          <details class="rounded-xl border border-slate-200 dark:border-slate-700"><summary class="cursor-pointer list-none p-4"><div class="flex items-center justify-between gap-3"><div><p class="text-sm font-bold">2. Materi & pembahasan <span class="font-normal text-slate-400">(opsional)</span></p><p class="mt-1 text-[11px] text-slate-500">Isi bila ingin mengelompokkan soal atau memberikan pembahasan.</p></div><AppIcon name="plus" class="h-4 w-4 text-slate-400" /></div></summary><div class="space-y-3 border-t border-slate-100 p-4 dark:border-slate-700"><div><label class="mb-1 block text-xs font-medium">Tingkat kesulitan awal</label><div class="grid grid-cols-2 gap-2 sm:grid-cols-4"><label v-for="level in difficultyOptions" :key="level.value" :class="['cursor-pointer rounded-xl border px-2 py-2 text-center text-xs font-bold transition', formSoal.tingkatKesulitan === level.value ? difficultyClass(level.value) : 'border-slate-200 text-slate-500 dark:border-slate-700']"><input v-model="formSoal.tingkatKesulitan" type="radio" :value="level.value" class="hidden" />{{ level.label }}</label></div><p class="mt-1.5 text-[10px] text-slate-400">Nantinya dapat diperbarui berdasarkan persentase jawaban benar siswa.</p></div><div class="grid gap-3 sm:grid-cols-2"><div><label class="mb-1 block text-xs font-medium">Bab / materi</label><input v-model.trim="formSoal.materi" class="ui-input" placeholder="Contoh: Pecahan" /></div><div><label class="mb-1 block text-xs font-medium">Semester</label><select v-model="formSoal.semester" class="ui-input"><option value="">Tidak ditentukan</option><option value="ganjil">Ganjil</option><option value="genap">Genap</option></select></div></div><div v-if="formSoal.tipe === 'pg'"><label class="mb-1 block text-xs font-medium">Pembahasan <span class="font-normal text-slate-400">(opsional)</span></label><textarea v-model="formSoal.pembahasan" rows="3" class="ui-input" placeholder="Jelaskan alasan jawaban yang benar…" /></div><div><label class="mb-1 block text-xs font-medium">Status</label><select v-model="formSoal.status" class="ui-input"><option value="aktif">Siap digunakan</option><option value="draft">Simpan sebagai draft</option><option value="arsip">Arsip</option></select></div></div></details>

          <details class="rounded-xl border border-slate-200 dark:border-slate-700"><summary class="cursor-pointer list-none p-4"><div class="flex items-center justify-between gap-3"><div><p class="text-sm font-bold">3. Kisi-kisi pembelajaran <span class="font-normal text-slate-400">(lanjutan)</span></p><p class="mt-1 text-[11px] text-slate-500">Untuk kebutuhan administrasi, kisi-kisi, atau pemetaan kurikulum.</p></div><AppIcon name="plus" class="h-4 w-4 text-slate-400" /></div></summary><div class="space-y-3 border-t border-slate-100 p-4 dark:border-slate-700"><div class="grid gap-3 sm:grid-cols-2"><div><label class="mb-1 block text-xs font-medium">Kurikulum / fase</label><input v-model.trim="formSoal.kurikulum" class="ui-input" placeholder="Contoh: Fase B" /></div><div><label class="mb-1 block text-xs font-medium">Level kognitif</label><select v-model="formSoal.levelKognitif" class="ui-input"><option value="">Tidak ditentukan</option><option v-for="level in levelKognitifOptions" :key="level" :value="level">{{ level }}</option></select></div></div><div><label class="mb-1 block text-xs font-medium">Kode CP/TP</label><input v-model.trim="formSoal.kodeCapaian" class="ui-input" placeholder="Contoh: B.2.1" /></div><div><label class="mb-1 block text-xs font-medium">Tujuan pembelajaran</label><input v-model.trim="formSoal.tujuanPembelajaran" class="ui-input" placeholder="Siswa mampu…" /></div><div><label class="mb-1 block text-xs font-medium">Tag</label><input v-model="formSoal.tagInput" class="ui-input" placeholder="Pisahkan dengan koma, misalnya: pecahan, numerasi" /></div></div></details>

          <div
            class="sticky -bottom-4 z-20 -mx-4 -mb-4 flex flex-col-reverse gap-2 border-t border-slate-200 bg-white px-4 pb-4 pt-3 dark:border-slate-700 dark:bg-slate-800 sm:-bottom-6 sm:-mx-6 sm:-mb-6 sm:flex-row sm:justify-end sm:px-6 sm:pb-6"
          >
            <button
              @click="showModalForm = false"
              :disabled="isSubmitting"
              class="w-full px-4 py-2.5 text-sm text-slate-500 rounded-xl sm:w-auto"
            >
              Batal
            </button>
            <button
              @click="simpanSoal"
              :disabled="isSubmitting"
              class="w-full px-5 py-2.5 text-sm bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow disabled:opacity-50 sm:w-auto"
            >
              <span v-if="isSubmitting" class="inline-flex items-center gap-2"><AppIcon name="loader" class="h-4 w-4 animate-spin" /> Menyimpan...</span>
              <span v-else>{{
                isEditMode ? "Simpan Perubahan" : "Tambah Soal"
              }}</span>
            </button>
          </div>
        </div>
      </div>
      </Teleport>
    </ClientOnly>

    <!-- Modal Konfirmasi Hapus Soal -->
    <ClientOnly>
      <Teleport to="body">
      <div
        v-if="showModalHapus"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      >
        <div
          class="bg-white dark:bg-slate-800 w-full max-w-sm p-6 rounded-2xl shadow-xl space-y-4 text-center"
        >
          <div
            class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold"
          >
            <AppIcon name="alert" class="h-6 w-6" />
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
            Hapus Soal Ini?
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Soal <b>"{{ targetHapusSoal?.pertanyaan }}"</b> akan dipindahkan ke
            sampah dan masih dapat dipulihkan selama 30 hari.
          </p>

          <div class="flex justify-center gap-2 pt-2">
            <button
              @click="showModalHapus = false"
              class="flex-1 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              @click="eksekusiHapusSoal"
              class="flex-1 px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
      </Teleport>
    </ClientOnly>

    <!-- Modal Konfirmasi Hapus Semua Soal -->
    <ClientOnly>
      <Teleport to="body">
      <div v-if="showModalHapusSemua" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div class="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-slate-800">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30"><AppIcon name="alert" class="h-6 w-6" /></div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Hapus Semua Soal?</h3>
          <p class="text-xs leading-relaxed text-slate-500"><b>{{ jumlahSoalBisaDihapus }} soal {{ selectedMapel }}</b> di kelas {{ kelasId }} akan dipindahkan ke sampah dan masih dapat dipulihkan selama {{ retentionDays }} hari.</p>
          <div class="flex justify-center gap-2 pt-2">
            <button @click="showModalHapusSemua = false" :disabled="deletingAll" class="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300">Batal</button>
            <button @click="hapusSemuaSoal" :disabled="deletingAll" class="flex-1 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-700 disabled:opacity-50"><span v-if="deletingAll" class="inline-flex items-center gap-2"><AppIcon name="loader" class="h-3.5 w-3.5 animate-spin" /> Menghapus…</span><span v-else>Ya, Hapus Semua</span></button>
          </div>
        </div>
      </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup>
import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  getCountFromServer,
  deleteDoc,
  doc,
  getDoc,
  writeBatch,
  setDoc,
  limit,
  orderBy,
  documentId,
  startAfter,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { findPossibleDuplicate, validateQuestion } from "../../../../utils/question-quality.mjs";
import contohSoalCampuran from "../../../../examples/contoh-soal-campuran-kelas-4.csv?raw";

definePageMeta({
  middleware: "auth",
  key: (route) => route.fullPath,
});

const route = useRoute();
const router = useRouter();
const kelasId = route.params.id;
const assignmentId = computed(() => String(route.query.assignment || "legacy"));
const jenjang = computed(() => String(route.query.jenjang || "SD"));
const schoolName = computed(() => String(route.query.sekolah || "Sekolah Saya"));
const { db, storage } = useFirebase();
const { user, initAuth } = useAuth();
const { catatAktivitas } = useAuditLog();
const { success, error: toastError, warning } = useToast();

const mapelAjar = ref([]);
const selectedMapel = ref("");
const daftarSoal = ref([]);
const loadingData = ref(true);
const loadingMore = ref(false);
const lastQuestionDoc = ref(null);
const hasMoreQuestions = ref(false);

// State Search & Filter Tipe
const searchQuery = ref("");
const filterTipe = ref("semua");
const filterKesulitan = ref("semua");
const filterKognitif = ref("semua");
const filterMateri = ref("");
const filterKualitas = ref("semua");
const filterStatus = ref("aktif");
const showAdvancedFilters = ref(false);
const currentPage = ref(1);
const pageSize = 25;
const levelKognitifOptions = ["C1 · Mengingat", "C2 · Memahami", "C3 · Menerapkan", "C4 · Menganalisis", "C5 · Mengevaluasi", "C6 · Mencipta"];
const difficultyOptions = [{ value: "", label: "Belum dinilai" }, { value: "mudah", label: "Mudah" }, { value: "sedang", label: "Sedang" }, { value: "sulit", label: "Sulit" }];
const selectedIds = ref([]);
const bulkDifficulty = ref("");
const retentionDays = ref(30);
const formDraftStatus = ref("Draft otomatis aktif");
let formDraftTimer;
const questionDraftDocId = computed(() => `${user.value?.uid || "guru"}_${assignmentId.value}_${kelasId}_${String(selectedMapel.value || "mapel").replace(/[^a-zA-Z0-9_-]/g, "_")}_soal`);
const showDraftRecovery = ref(false);
const pendingQuestionDraft = ref(null);
const csvInput = ref(null);

// State Modal Form (Tambah & Edit)
const showModalForm = ref(false);
const isEditMode = ref(false);
const editSoalId = ref(null);
const isSubmitting = ref(false);
const importingSpreadsheet = ref(false);
const fileInputRef = ref(null);

const formSoal = ref({
  tipe: "pg",
  pertanyaan: "",
  imageUrl: "",
  opsi: { a: "", b: "", c: "", d: "" },
  opsiGambar: { a: "", b: "", c: "", d: "" },
  kunciJawaban: "a",
  tingkatKesulitan: "",
  status: "aktif",
  semester: "",
  materi: "",
  kurikulum: "",
  tujuanPembelajaran: "",
  kodeCapaian: "",
  levelKognitif: "",
  pembahasan: "",
  tagInput: "",
});

// State Modal Konfirmasi Hapus
const showModalHapus = ref(false);
const targetHapusSoal = ref(null);
const showModalHapusSemua = ref(false);
const deletingAll = ref(false);
const jumlahSoalBisaDihapus = computed(() => daftarSoal.value.filter(soal => soal.status !== "sampah").length);
const overlayLoading = computed(() => {
  if (importingSpreadsheet.value) return { show: true, title: "Mengimpor bank soal", description: "Membaca file dan menyusun soal ke dalam kelas Anda." };
  if (deletingAll.value) return { show: true, title: "Memindahkan soal", description: "Soal sedang dipindahkan dengan aman ke tempat sampah." };
  if (isSubmitting.value) return { show: true, title: isEditMode.value ? "Memperbarui soal" : "Menyimpan soal baru", description: "Sedikit lagi, perubahan sedang disimpan ke bank soal." };
  if (loadingData.value) return { show: true, title: "Membuka bank soal", description: `Menyiapkan soal ${selectedMapel.value || "kelas"} untuk Anda.` };
  return { show: false, title: "", description: "" };
});

// Statistik hanya untuk soal aktif pada kelas, mapel, dan penugasan yang sedang dibuka.
const stats = ref({ total: 0, pg: 0, essay: 0, belumDipakai: 0 });
const loadStats = async () => {
  if (!user.value || !selectedMapel.value) return;
  const baseConstraints = [
    where("userId", "==", user.value.uid),
    where("kelas", "==", Number(kelasId)),
    where("mapel", "==", selectedMapel.value),
    ...(assignmentId.value !== "legacy" ? [where("assignmentId", "==", assignmentId.value)] : []),
    where("status", "==", "aktif"),
  ];
  try {
    const [totalSnapshot, essaySnapshot, usedSnapshot] = await Promise.all([
      getCountFromServer(query(collection(db, "soal"), ...baseConstraints)),
      getCountFromServer(query(collection(db, "soal"), ...baseConstraints, where("tipe", "==", "essay"))),
      getCountFromServer(query(collection(db, "soal"), ...baseConstraints, where("dipakai", "==", true))),
    ]);
    const total = totalSnapshot.data().count;
    const essay = essaySnapshot.data().count;
    const used = usedSnapshot.data().count;
    stats.value = { total, essay, pg: total - essay, belumDipakai: total - used };
  } catch (error) {
    console.warn("Statistik seluruh soal tidak dapat dimuat:", error);
  }
};

// Computed Filter Soal (Search + Tipe)
const qualityIssues = item => validateQuestion(item);
const formQualityIssues = computed(() => validateQuestion({ ...formSoal.value, tags: formSoal.value.tagInput?.split(",") }));
const daftarMateri = computed(() => [...new Set(daftarSoal.value.map(item => item.materi).filter(Boolean))].sort((a, b) => a.localeCompare(b, "id")));
const activeFilterCount = computed(() => [
  filterKesulitan.value !== "semua",
  filterKognitif.value !== "semua",
  Boolean(filterMateri.value),
  filterKualitas.value !== "semua",
  filterStatus.value !== "aktif",
].filter(Boolean).length);
const filteredAllSoal = computed(() => {
  return daftarSoal.value.filter((item) => {
    if (filterTipe.value === "pg" && item.tipe === "essay") return false;
    if (filterTipe.value === "essay" && item.tipe !== "essay") return false;
    if (filterKesulitan.value === "belum" && item.tingkatKesulitan) return false;
    if (!["semua", "belum"].includes(filterKesulitan.value) && item.tingkatKesulitan !== filterKesulitan.value) return false;
    if (filterKognitif.value !== "semua" && item.levelKognitif !== filterKognitif.value) return false;
    if (filterMateri.value && !String(item.materi || "").toLowerCase().includes(filterMateri.value.toLowerCase())) return false;
    if (filterKualitas.value === "siap" && qualityIssues(item).length) return false;
    if (filterKualitas.value === "perlu-perbaikan" && !qualityIssues(item).length) return false;
    if (filterStatus.value !== "semua" && (item.status || "aktif") !== filterStatus.value) return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      return [item.pertanyaan, item.materi, item.kurikulum, item.tujuanPembelajaran, ...(item.tags || [])].some(value => String(value || "").toLowerCase().includes(q));
    }
    return true;
  });
});
const totalPages = computed(() => Math.max(1, Math.ceil(filteredAllSoal.value.length / pageSize)));
const filteredSoal = computed(() => filteredAllSoal.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize));
const previousPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    return;
  }
  if (!hasMoreQuestions.value || loadingMore.value) return;
  const previousTotalPages = totalPages.value;
  do {
    await loadSoal(true);
  } while (hasMoreQuestions.value && totalPages.value === previousTotalPages);
  if (totalPages.value > previousTotalPages) currentPage.value++;
};

const updateUrlQuery = () => {
  router.replace({
    query: { ...route.query, mapel: selectedMapel.value },
  });
};

const loadPengaturanGuru = async () => {
  if (!user.value) return;
  try {
    const docRef = doc(db, "pengaturanGuru", user.value.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      retentionDays.value = data.privasi?.retentionDays || 30;
      const tugas = data.penugasan?.find((item) => item.id === assignmentId.value);
      mapelAjar.value = tugas?.mapelPerKelas?.[kelasId] || tugas?.mapelAjar || data.mapelAjar || [];

      const queryMapel = route.query.mapel;
      if (queryMapel && mapelAjar.value.includes(queryMapel)) {
        selectedMapel.value = queryMapel;
      } else if (mapelAjar.value.length > 0) {
        selectedMapel.value = mapelAjar.value[0];
        updateUrlQuery();
      }
    }
  } catch (e) {
    console.error("Gagal memuat pengaturan guru:", e);
  }
};

const loadSoal = async (append = false) => {
  if (!user.value || !selectedMapel.value) {
    loadingData.value = false;
    return;
  }
  if (append) loadingMore.value = true;
  else { loadingData.value = true; lastQuestionDoc.value = null; }
  try {
    if (!append) await loadStats();
    const constraints = [
      collection(db, "soal"),
      where("userId", "==", user.value.uid),
      where("kelas", "==", Number(kelasId)),
      where("mapel", "==", selectedMapel.value),
      ...(assignmentId.value !== "legacy" ? [where("assignmentId", "==", assignmentId.value)] : []),
      orderBy(documentId()),
      ...(append && lastQuestionDoc.value ? [startAfter(lastQuestionDoc.value)] : []),
      limit(100),
    ];
    const q = query(...constraints);
    const snapshot = await getDocs(q);
    const semuaSoal = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const sesuaiPenugasan = assignmentId.value === "legacy"
      ? semuaSoal.filter((soal) => !soal.assignmentId || soal.assignmentId === "legacy")
      : semuaSoal.filter((soal) => soal.assignmentId === assignmentId.value);
    const timestampValue = (value) => value?.toMillis?.() || (value?.seconds ? value.seconds * 1000 : new Date(value || 0).getTime()) || 0;
    const hasilTerurut = [...sesuaiPenugasan].sort((a, b) => timestampValue(b.createdAt || b.updatedAt) - timestampValue(a.createdAt || a.updatedAt));
    const hasilGabungan = append
      ? [...daftarSoal.value, ...hasilTerurut.filter(item => !daftarSoal.value.some(existing => existing.id === item.id))]
      : hasilTerurut;
    daftarSoal.value = hasilGabungan.sort((a, b) => timestampValue(b.createdAt || b.updatedAt) - timestampValue(a.createdAt || a.updatedAt));
    lastQuestionDoc.value = snapshot.docs.at(-1) || null;
    hasMoreQuestions.value = snapshot.size === 100;
  } catch (e) {
    console.error("Gagal memuat soal:", e);
  } finally {
    loadingData.value = false;
    loadingMore.value = false;
  }
};

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    warning("Ukuran gambar terlalu besar. Maksimal 2 MB.");
    if (fileInputRef.value) fileInputRef.value.value = "";
    return;
  }
  try {
    const path = `soal/${user.value.uid}/${assignmentId.value}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const target = storageRef(storage, path);
    await uploadBytes(target, file, { contentType: file.type });
    formSoal.value.imageUrl = await getDownloadURL(target);
  } catch (error) {
    console.error("Gagal upload gambar:", error);
    toastError("Upload gambar gagal. Pastikan Firebase Storage dan rules sudah aktif.");
  }
};

const hapusGambar = () => {
  formSoal.value.imageUrl = "";
  if (fileInputRef.value) fileInputRef.value.value = "";
};
const handleOpsiImage = async (event, kunci) => {
  const file = event.target.files?.[0]; if (!file) return;
  if (file.size > 2 * 1024 * 1024) { warning("Ukuran gambar maksimal 2 MB."); return; }
  try { const target = storageRef(storage, `soal/${user.value.uid}/${assignmentId.value}/opsi-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`); await uploadBytes(target, file, { contentType: file.type }); formSoal.value.opsiGambar[kunci] = await getDownloadURL(target); } catch (err) { console.error(err); toastError("Upload gambar opsi gagal."); }
};

// Handler Buka Form Modal
const bukaModalTambah = async () => {
  isEditMode.value = false;
  editSoalId.value = null;
  formSoal.value = {
    tipe: "pg",
    pertanyaan: "",
    imageUrl: "",
    opsi: { a: "", b: "", c: "", d: "" },
    opsiGambar: { a: "", b: "", c: "", d: "" },
    kunciJawaban: "a",
    tingkatKesulitan: "",
    status: "aktif", semester: "", materi: "", kurikulum: "", tujuanPembelajaran: "", kodeCapaian: "", levelKognitif: "", pembahasan: "", tagInput: "",
  };
  if (fileInputRef.value) fileInputRef.value.value = "";
  try {
    const draft = await getDoc(doc(db, "draftGuru", questionDraftDocId.value));
    if (draft.exists() && draft.data().formSoal?.pertanyaan?.trim()) {
      pendingQuestionDraft.value = draft.data().formSoal;
      showDraftRecovery.value = true;
      return;
    }
  } catch (error) { console.warn("Draft soal tidak dapat dimuat:", error); }
  showModalForm.value = true;
};

const lanjutkanDraft = () => {
  formSoal.value = { ...formSoal.value, ...pendingQuestionDraft.value };
  pendingQuestionDraft.value = null;
  showDraftRecovery.value = false;
  formDraftStatus.value = "Draft dipulihkan";
  showModalForm.value = true;
};

const buangDraft = async () => {
  pendingQuestionDraft.value = null;
  showDraftRecovery.value = false;
  await deleteDoc(doc(db, "draftGuru", questionDraftDocId.value)).catch((error) => {
    console.warn("Draft soal tidak dapat dihapus:", error);
  });
  formDraftStatus.value = "Draft otomatis aktif";
  showModalForm.value = true;
};

const bukaModalEdit = (soal) => {
  isEditMode.value = true;
  editSoalId.value = soal.id;
  formSoal.value = {
    tipe: soal.tipe || "pg",
    pertanyaan: soal.pertanyaan || "",
    imageUrl: soal.imageUrl || "",
    opsi: soal.opsi ? { ...soal.opsi } : { a: "", b: "", c: "", d: "" },
    opsiGambar: soal.opsiGambar ? { ...soal.opsiGambar } : { a: "", b: "", c: "", d: "" },
    kunciJawaban: soal.kunciJawaban || "a",
    tingkatKesulitan: soal.tingkatKesulitan || "",
    status: soal.status || "aktif", semester: soal.semester || "", materi: soal.materi || "", kurikulum: soal.kurikulum || "", tujuanPembelajaran: soal.tujuanPembelajaran || "", kodeCapaian: soal.kodeCapaian || "", levelKognitif: soal.levelKognitif || "", pembahasan: soal.pembahasan || "", tagInput: (soal.tags || []).join(", "),
  };
  if (fileInputRef.value) fileInputRef.value.value = "";
  showModalForm.value = true;
};

// Fitur Duplikat Soal
const duplikatSoal = (soal) => {
  isEditMode.value = false;
  editSoalId.value = null;
  formSoal.value = {
    tipe: soal.tipe || "pg",
    pertanyaan: `${soal.pertanyaan} (Salinan)`,
    imageUrl: soal.imageUrl || "",
    opsi: soal.opsi ? { ...soal.opsi } : { a: "", b: "", c: "", d: "" },
    opsiGambar: soal.opsiGambar ? { ...soal.opsiGambar } : { a: "", b: "", c: "", d: "" },
    kunciJawaban: soal.kunciJawaban || "a",
    tingkatKesulitan: soal.tingkatKesulitan || "",
    status: "aktif", semester: soal.semester || "", materi: soal.materi || "", kurikulum: soal.kurikulum || "", tujuanPembelajaran: soal.tujuanPembelajaran || "", kodeCapaian: soal.kodeCapaian || "", levelKognitif: soal.levelKognitif || "", pembahasan: soal.pembahasan || "", tagInput: (soal.tags || []).join(", "),
  };
  if (fileInputRef.value) fileInputRef.value.value = "";
  showModalForm.value = true;
};

// Simpan atau Update Soal ke Firestore Collection
const simpanSoal = async () => {
  const pertanyaanClean = formSoal.value.pertanyaan.trim();

  if (!pertanyaanClean) {
    warning("Harap isi pertanyaan.");
    return;
  }
  if (
    formSoal.value.tipe === "pg" &&
    (!formSoal.value.opsi.a || !formSoal.value.opsi.b)
  ) {
    warning("Harap isi minimal pilihan A dan B untuk soal pilihan ganda.");
    return;
  }
  if (formSoal.value.tipe === "pg") {
    const filledOptions = Object.entries(formSoal.value.opsi)
      .filter(([, value]) => String(value || "").trim())
      .map(([key, value]) => [key, String(value).trim().toLowerCase().replace(/\s+/g, " ")]);
    const duplicateOptions = filledOptions.find(([key, value], index) =>
      filledOptions.some(([otherKey, otherValue], otherIndex) => otherIndex < index && otherKey !== key && otherValue === value)
    );
    if (duplicateOptions) {
      const [duplicateKey, duplicateValue] = duplicateOptions;
      const firstKey = filledOptions.find(([key, value]) => key !== duplicateKey && value === duplicateValue)?.[0];
      warning(`Pilihan ${firstKey?.toUpperCase()} dan ${duplicateKey.toUpperCase()} tidak boleh memiliki jawaban yang sama.`);
      return;
    }
  }
  if (formSoal.value.tipe === "essay" && !formSoal.value.pembahasan.trim()) {
    warning("Pedoman jawaban wajib diisi untuk soal essay.");
    return;
  }

  // Cegatan Soal Duplikat
  const possibleDuplicate = findPossibleDuplicate(pertanyaanClean, daftarSoal.value, isEditMode.value ? editSoalId.value : null);
  if (possibleDuplicate) {
    warning("Pertanyaan ini sangat mirip dengan soal yang sudah ada.");
    return;
  }

  isSubmitting.value = true;

  try {
    const dataPayload = {
      userId: user.value.uid,
      kelas: Number(kelasId),
      mapel: selectedMapel.value,
      assignmentId: assignmentId.value,
      jenjang: jenjang.value,
      namaSekolah: schoolName.value,
      tipe: formSoal.value.tipe,
      pertanyaan: pertanyaanClean,
      imageUrl: formSoal.value.imageUrl, // Berisi string Base64 gambar
      tingkatKesulitan: formSoal.value.tingkatKesulitan,
      status: formSoal.value.status || "aktif",
      semester: formSoal.value.semester || "",
      materi: formSoal.value.materi || "",
      kurikulum: formSoal.value.kurikulum || "",
      tujuanPembelajaran: formSoal.value.tujuanPembelajaran || "",
      kodeCapaian: formSoal.value.kodeCapaian || "",
      levelKognitif: formSoal.value.levelKognitif || "",
      pembahasan: formSoal.value.pembahasan || "",
      tags: formSoal.value.tagInput.split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean).slice(0, 12),
      opsi: formSoal.value.tipe === "pg" ? formSoal.value.opsi : null,
      opsiGambar: formSoal.value.tipe === "pg" ? formSoal.value.opsiGambar : null,
      kunciJawaban:
        formSoal.value.tipe === "pg" ? formSoal.value.kunciJawaban : null,
      updatedAt: new Date(),
    };

    let savedQuestion;
    if (isEditMode.value && editSoalId.value) {
      await updateDoc(doc(db, "soal", editSoalId.value), dataPayload);
      const existingQuestion = daftarSoal.value.find((item) => item.id === editSoalId.value);
      savedQuestion = { ...existingQuestion, ...dataPayload, id: editSoalId.value };
      daftarSoal.value = daftarSoal.value.map((item) => item.id === editSoalId.value ? savedQuestion : item);
    } else {
      dataPayload.dipakai = false;
      dataPayload.jumlahDicetak = 0;
      dataPayload.createdAt = new Date();
      const savedDocument = await addDoc(collection(db, "soal"), dataPayload);
      savedQuestion = { id: savedDocument.id, ...dataPayload };
      daftarSoal.value = [savedQuestion, ...daftarSoal.value.filter((item) => item.id !== savedDocument.id)];
    }

    showModalForm.value = false;
    currentPage.value = 1;
    searchQuery.value = "";
    filterStatus.value = savedQuestion.status || "aktif";
    if (!isEditMode.value) await deleteDoc(doc(db, "draftGuru", questionDraftDocId.value)).catch(() => {});
    await catatAktivitas(isEditMode.value ? "soal_diedit" : "soal_dibuat", { soalId: editSoalId.value, mapel: selectedMapel.value, kelas: Number(kelasId) });
    await loadStats();
    success(isEditMode.value ? "Perubahan soal berhasil disimpan." : "Soal baru berhasil ditambahkan dan ditampilkan paling atas.");
  } catch (e) {
    console.error("Gagal menyimpan soal:", e);
    toastError("Terjadi kesalahan saat menyimpan soal.");
  } finally {
    isSubmitting.value = false;
  }
};

// Handler Konfirmasi Hapus
const mintaKonfirmasiHapus = (soal) => {
  targetHapusSoal.value = soal;
  showModalHapus.value = true;
};

const eksekusiHapusSoal = async () => {
  if (!targetHapusSoal.value) return;
  try {
    await updateDoc(doc(db, "soal", targetHapusSoal.value.id), { status: "sampah", deletedAt: new Date(), updatedAt: new Date() });
    await catatAktivitas("soal_dipindah_ke_sampah", { soalId: targetHapusSoal.value.id });
    showModalHapus.value = false;
    targetHapusSoal.value = null;
    await loadSoal();
  } catch (e) {
    console.error("Gagal menghapus soal:", e);
  }
};

const hapusSemuaSoal = async () => {
  const soalYangDihapus = daftarSoal.value.filter(soal => soal.status !== "sampah");
  if (!soalYangDihapus.length || deletingAll.value) return;
  deletingAll.value = true;
  try {
    const waktuHapus = new Date();
    for (let awal = 0; awal < soalYangDihapus.length; awal += 500) {
      const batch = writeBatch(db);
      soalYangDihapus.slice(awal, awal + 500).forEach(soal => batch.update(doc(db, "soal", soal.id), { status: "sampah", deletedAt: waktuHapus, updatedAt: waktuHapus }));
      await batch.commit();
    }
    await catatAktivitas("semua_soal_dipindah_ke_sampah", { jumlah: soalYangDihapus.length, mapel: selectedMapel.value, kelas: Number(kelasId) });
    showModalHapusSemua.value = false;
    selectedIds.value = [];
    await loadSoal();
    success(`${soalYangDihapus.length} soal berhasil dipindahkan ke sampah.`);
  } catch (error) {
    console.error("Gagal menghapus semua soal:", error);
    toastError("Gagal menghapus semua soal. Silakan coba lagi.");
  } finally { deletingAll.value = false; }
};

const pulihkanSoal = async soal => {
  await updateDoc(doc(db, "soal", soal.id), { status: "aktif", deletedAt: null, updatedAt: new Date() });
  await catatAktivitas("soal_dipulihkan", { soalId: soal.id });
  await loadSoal();
};
const updateMassal = async perubahan => {
  if (!selectedIds.value.length) return;
  const batch = writeBatch(db);
  selectedIds.value.forEach(id => batch.update(doc(db, "soal", id), { ...perubahan, updatedAt: new Date() }));
  await batch.commit();
  await catatAktivitas("soal_diubah_massal", { jumlah: selectedIds.value.length, perubahan });
  selectedIds.value = [];
  await loadSoal();
};
const terapkanKesulitanMassal = async () => { if (bulkDifficulty.value) { await updateMassal({ tingkatKesulitan: bulkDifficulty.value }); bulkDifficulty.value = ""; } };
const ubahStatusMassal = status => updateMassal({ status });

const difficultyClass = (level) => ({
  mudah: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  sedang: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  sulit: "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
}[level] || "border-slate-200 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300");

const formatTanggal = (value) => {
  const date = value?.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(date);
};
const penggunaanSetahun = (soal) => { const batas = Date.now() - 365 * 24 * 60 * 60 * 1000; return (soal.riwayatPenggunaan || []).filter(value => { const date = value?.toDate ? value.toDate() : new Date(value); return date.getTime() >= batas; }).length; };

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const downloadFile = (content, name, type = "text/csv;charset=utf-8") => {
  const url = URL.createObjectURL(new Blob(["\ufeff", content], { type }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
};
const csvHeader = ["tipe", "tingkatKesulitan", "status", "semester", "materi", "kurikulum", "tujuanPembelajaran", "kodeCapaian", "levelKognitif", "tags", "pertanyaan", "opsiA", "opsiB", "opsiC", "opsiD", "kunciJawaban", "pembahasan"];
const requiredCsvHeader = ["tipe", "tingkatKesulitan", "pertanyaan", "opsiA", "opsiB", "opsiC", "opsiD", "kunciJawaban"];
const downloadTemplateCsv = () => downloadFile(`${csvHeader.join(",")}\npg,mudah,aktif,ganjil,Perkalian,Kurikulum Merdeka - Fase B,Siswa mampu menghitung perkalian,"numerasi, perkalian",Contoh pertanyaan?,Jawaban A,Jawaban B,Jawaban C,Jawaban D,a\nessay,sedang,draft,genap,Kebugaran,Kurikulum Merdeka - Fase B,Siswa mampu menjelaskan kebugaran,kebugaran,Jelaskan jawaban Anda,,,,,Pedoman jawaban`, "template-soal.csv");
const exportCsv = () => {
  const rows = daftarSoal.value.map(s => [s.tipe || "pg", s.tingkatKesulitan || "", s.status || "aktif", s.semester || "", s.materi || "", s.kurikulum || "", s.tujuanPembelajaran || "", s.kodeCapaian || "", s.levelKognitif || "", (s.tags || []).join(", "), s.pertanyaan, s.opsi?.a, s.opsi?.b, s.opsi?.c, s.opsi?.d, s.kunciJawaban, s.pembahasan || ""].map(csvEscape).join(","));
  downloadFile([csvHeader.join(","), ...rows].join("\n"), `soal-${selectedMapel.value}-kelas-${kelasId}.csv`);
};
const parseCsv = (text) => {
  const rows = []; let row = []; let value = ""; let quoted = false;
  for (let i = 0; i < text.length; i++) { const char = text[i]; if (char === '"' && quoted && text[i + 1] === '"') { value += '"'; i++; } else if (char === '"') quoted = !quoted; else if (char === "," && !quoted) { row.push(value); value = ""; } else if ((char === "\n" || char === "\r") && !quoted) { if (char === "\r" && text[i + 1] === "\n") i++; row.push(value); if (row.some(Boolean)) rows.push(row); row = []; value = ""; } else value += char; }
  row.push(value); if (row.some(Boolean)) rows.push(row); return rows;
};
const metadataImport = data => ({
  tingkatKesulitan: ["mudah", "sedang", "sulit"].includes(String(data.tingkatKesulitan).toLowerCase()) ? String(data.tingkatKesulitan).toLowerCase() : "",
  status: ["aktif", "draft", "arsip"].includes(String(data.status).toLowerCase()) ? String(data.status).toLowerCase() : "aktif",
  semester: ["ganjil", "genap"].includes(String(data.semester).toLowerCase()) ? String(data.semester).toLowerCase() : "",
  materi: String(data.materi || "").trim(), kurikulum: String(data.kurikulum || "").trim(), tujuanPembelajaran: String(data.tujuanPembelajaran || "").trim(), kodeCapaian: String(data.kodeCapaian || "").trim(), levelKognitif: String(data.levelKognitif || "").trim(), pembahasan: String(data.pembahasan || "").trim(),
  tags: String(data.tags || "").split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean).slice(0, 12),
});
const importCsvText = async (text) => {
  const rows = parseCsv(text); const headers = rows.shift()?.map(h => h.trim().replace(/^\ufeff/, ""));
  if (!headers || !requiredCsvHeader.every(h => headers.includes(h))) throw new Error("Format kolom tidak sesuai template");
  let imported = 0;
  for (const row of rows) { const data = Object.fromEntries(headers.map((h, i) => [h, row[i]?.trim() || ""])); if (!data.pertanyaan) continue; const tipe = data.tipe.toLowerCase() === "essay" ? "essay" : "pg"; await addDoc(collection(db, "soal"), { userId: user.value.uid, kelas: Number(kelasId), mapel: selectedMapel.value, assignmentId: assignmentId.value, jenjang: jenjang.value, namaSekolah: schoolName.value, tipe, ...metadataImport(data), pertanyaan: data.pertanyaan, imageUrl: "", opsi: tipe === "pg" ? { a: data.opsiA, b: data.opsiB, c: data.opsiC, d: data.opsiD } : null, opsiGambar: null, kunciJawaban: tipe === "pg" ? data.kunciJawaban.toLowerCase() : data.kunciJawaban, dipakai: false, jumlahDicetak: 0, createdAt: new Date(), updatedAt: new Date() }); imported++; }
  return imported;
};
const importCsv = async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  importingSpreadsheet.value = true;
  try {
    const imported = await importCsvText(await file.text());
    await loadSoal(); success(`${imported} soal berhasil diimpor.`);
  } catch (error) { console.error(error); toastError(`Import gagal: ${error.message}`); } finally { event.target.value = ""; importingSpreadsheet.value = false; }
};
const excelModule = async () => { const module = await import("exceljs"); return module.default || module; };
const unduhExcelBuffer = async (workbook, nama) => { const buffer = await workbook.xlsx.writeBuffer(); const url = URL.createObjectURL(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })); const link = document.createElement("a"); link.href = url; link.download = nama; link.click(); URL.revokeObjectURL(url); };
const downloadTemplateExcel = async () => {
  const ExcelJS = await excelModule(); const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet("Template Soal");
  sheet.addRows(parseCsv(contohSoalCampuran));
  [12, 18, 12, 12, 24, 30, 42, 28, 50, 25, 25, 25, 25, 24].forEach((width, index) => { sheet.getColumn(index + 1).width = width; });
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
  sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 24;
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: csvHeader.length } };
  sheet.eachRow((row, number) => { if (number > 1) row.alignment = { vertical: "top", wrapText: true }; });
  await unduhExcelBuffer(workbook, "contoh-soal-campuran-kelas-4.xlsx");
};
const exportExcel = async () => {
  const ExcelJS = await excelModule(); const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet("Bank Soal"); sheet.addRow(csvHeader); sheet.getRow(1).font = { bold: true };
  daftarSoal.value.forEach(s => sheet.addRow([s.tipe || "pg", s.tingkatKesulitan || "", s.status || "aktif", s.semester || "", s.materi || "", s.kurikulum || "", s.tujuanPembelajaran || "", s.kodeCapaian || "", s.levelKognitif || "", (s.tags || []).join(", "), s.pertanyaan, s.opsi?.a || "", s.opsi?.b || "", s.opsi?.c || "", s.opsi?.d || "", s.kunciJawaban || "", s.pembahasan || ""]));
  [12, 18, 12, 12, 24, 30, 42, 28, 50, 25, 25, 25, 25, 24].forEach((width, index) => { sheet.getColumn(index + 1).width = width; }); await unduhExcelBuffer(workbook, `soal-${selectedMapel.value}-kelas-${kelasId}.xlsx`);
};
const importSpreadsheet = async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  if (file.name.toLowerCase().endsWith('.csv')) return importCsv(event);
  importingSpreadsheet.value = true;
  try {
    const ExcelJS = await excelModule(); const workbook = new ExcelJS.Workbook(); await workbook.xlsx.load(await file.arrayBuffer()); const sheet = workbook.worksheets[0]; if (!sheet) throw new Error('Worksheet tidak ditemukan');
    const headers = sheet.getRow(1).values.slice(1).map(value => String(value || '').trim()); if (!requiredCsvHeader.every(key => headers.includes(key))) throw new Error('Format kolom tidak sesuai template');
    const dataRows = []; sheet.eachRow((row, number) => { if (number === 1) return; const data = {}; headers.forEach((header, index) => { data[header] = row.getCell(index + 1).text || ''; }); if (String(data.pertanyaan || '').trim()) dataRows.push(data); });
    let imported = 0;
    for (const data of dataRows) { if (!String(data.pertanyaan).trim()) continue; const tipe = String(data.tipe).toLowerCase() === 'essay' ? 'essay' : 'pg'; await addDoc(collection(db, 'soal'), { userId: user.value.uid, kelas: Number(kelasId), mapel: selectedMapel.value, assignmentId: assignmentId.value, jenjang: jenjang.value, namaSekolah: schoolName.value, tipe, ...metadataImport(data), pertanyaan: String(data.pertanyaan).trim(), imageUrl: '', opsi: tipe === 'pg' ? { a: String(data.opsiA), b: String(data.opsiB), c: String(data.opsiC), d: String(data.opsiD) } : null, opsiGambar: null, kunciJawaban: tipe === 'pg' ? String(data.kunciJawaban).toLowerCase() : String(data.kunciJawaban || ''), dipakai: false, jumlahDicetak: 0, createdAt: new Date(), updatedAt: new Date() }); imported++; }
    await loadSoal(); success(`${imported} soal berhasil diimpor dari Excel.`);
  } catch (error) { console.error(error); toastError(`Import Excel gagal: ${error.message}`); } finally { event.target.value = ''; importingSpreadsheet.value = false; }
};

watch(selectedMapel, () => {
  searchQuery.value = "";
  currentPage.value = 1;
  if (selectedMapel.value) loadSoal();
});
watch([searchQuery, filterTipe, filterKesulitan, filterStatus, filterKognitif, filterMateri, filterKualitas], () => { currentPage.value = 1; });

watch(formSoal, () => {
  if (!showModalForm.value || isEditMode.value || !user.value) return;
  formDraftStatus.value = "Belum tersimpan";
  clearTimeout(formDraftTimer);
  formDraftTimer = setTimeout(async () => {
    formDraftStatus.value = "Menyimpan draft…";
    try { await setDoc(doc(db, "draftGuru", questionDraftDocId.value), { userId: user.value.uid, assignmentId: assignmentId.value, kelas: Number(kelasId), mapel: selectedMapel.value, formSoal: { ...formSoal.value }, updatedAt: new Date() }, { merge: true }); formDraftStatus.value = "Draft tersimpan"; }
    catch { formDraftStatus.value = "Draft gagal disimpan"; }
  }, 2500);
}, { deep: true });

const tutupDialogDenganEscape = event => { if (event.key === "Escape" && showModalForm.value && !isSubmitting.value) showModalForm.value = false; };
watch(showModalForm, terbuka => {
  if (!process.client) return;
  document.body.style.overflow = terbuka ? "hidden" : "";
  if (terbuka) window.addEventListener("keydown", tutupDialogDenganEscape);
  else window.removeEventListener("keydown", tutupDialogDenganEscape);
});
onBeforeUnmount(() => {
  if (!process.client) return;
  document.body.style.overflow = "";
  window.removeEventListener("keydown", tutupDialogDenganEscape);
});

onMounted(async () => {
  if (initAuth) await initAuth();
  await loadPengaturanGuru();
  await loadSoal();
});
</script>
