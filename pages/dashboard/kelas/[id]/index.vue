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

    <!-- Search & Filter Tipe Soal Bar -->
    <ClientOnly>
      <div
        v-if="mapelAjar.length > 0"
        class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-row"
      >
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pertanyaan atau teks soal..."
            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900/50"
          />
          <AppIcon name="search" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        <div
          class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold"
        >
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
        <select v-model="filterKesulitan" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-900/50"><option value="semua">Semua level</option><option value="mudah">Mudah</option><option value="sedang">Sedang</option><option value="sulit">Sulit</option></select>
        <select v-model="filterStatus" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-900/50"><option value="aktif">Soal aktif</option><option value="draft">Draft</option><option value="arsip">Arsip</option><option value="sampah">Sampah</option><option value="semua">Semua status</option></select>
        <div class="flex flex-wrap gap-1"><button @click="downloadTemplateExcel" class="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100" title="Unduh template Excel"><AppIcon name="file" class="h-3.5 w-3.5" />Template</button><button @click="$refs.csvInput.click()" :disabled="importingSpreadsheet" class="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 disabled:opacity-50"><AppIcon :name="importingSpreadsheet ? 'loader' : 'plus'" :class="['h-3.5 w-3.5', { 'animate-spin': importingSpreadsheet }]" />{{ importingSpreadsheet ? 'Mengimpor…' : 'Import' }}</button><button @click="exportExcel" :disabled="!daftarSoal.length" class="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 disabled:opacity-40"><AppIcon name="save" class="h-3.5 w-3.5" />Export</button><button @click="showModalHapusSemua = true" :disabled="!jumlahSoalBisaDihapus || deletingAll" class="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40" title="Pindahkan semua soal mapel ini ke sampah"><AppIcon :name="deletingAll ? 'loader' : 'trash'" :class="['h-3.5 w-3.5', { 'animate-spin': deletingAll }]" />Hapus Semua</button><input ref="csvInput" type="file" accept=".xlsx,.xls,.csv,text/csv" class="hidden" @change="importSpreadsheet" /></div>
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
            <span :class="['rounded-full px-2.5 py-1 text-[10px] font-bold capitalize', difficultyClass(item.tingkatKesulitan)]">{{ item.tingkatKesulitan || 'sedang' }}</span>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold capitalize text-slate-600 dark:bg-slate-700 dark:text-slate-300">{{ item.status || 'aktif' }}</span>

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
          <div><label class="mb-1 block text-sm font-medium">Tingkat Kesulitan</label><div class="grid grid-cols-3 gap-2"><label v-for="level in ['mudah','sedang','sulit']" :key="level" :class="['cursor-pointer rounded-xl border px-3 py-2 text-center text-xs font-bold capitalize transition', formSoal.tingkatKesulitan === level ? difficultyClass(level) : 'border-slate-200 text-slate-500 dark:border-slate-700']"><input v-model="formSoal.tingkatKesulitan" type="radio" :value="level" class="hidden" />{{ level }}</label></div></div>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><div><label class="mb-1 block text-xs font-medium">Status</label><select v-model="formSoal.status" class="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-600"><option value="aktif">Siap digunakan</option><option value="draft">Draft</option><option value="arsip">Arsip</option></select></div><div><label class="mb-1 block text-xs font-medium">Semester</label><select v-model="formSoal.semester" class="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-600"><option value="">Semua</option><option value="ganjil">Ganjil</option><option value="genap">Genap</option></select></div></div>
          <div class="grid gap-3 sm:grid-cols-2"><div><label class="mb-1 block text-xs font-medium">Bab / Materi</label><input v-model.trim="formSoal.materi" class="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-600" placeholder="Contoh: Pecahan" /></div><div><label class="mb-1 block text-xs font-medium">Kurikulum / Fase</label><input v-model.trim="formSoal.kurikulum" class="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-600" placeholder="Merdeka · Fase B" /></div></div>
          <div><label class="mb-1 block text-xs font-medium">Tujuan pembelajaran</label><input v-model.trim="formSoal.tujuanPembelajaran" class="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-600" placeholder="Siswa mampu…" /></div>
          <div><label class="mb-1 block text-xs font-medium">Tag (pisahkan dengan koma)</label><input v-model="formSoal.tagInput" class="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-600" placeholder="pecahan, hitung, numerasi" /></div>

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

          <div v-if="formSoal.tipe === 'pg'" class="space-y-2">
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
  deleteDoc,
  doc,
  getDoc,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
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

// State Search & Filter Tipe
const searchQuery = ref("");
const filterTipe = ref("semua");
const filterKesulitan = ref("semua");
const filterStatus = ref("aktif");
const selectedIds = ref([]);
const bulkDifficulty = ref("");
const retentionDays = ref(30);
const formDraftStatus = ref("Draft otomatis aktif");
let formDraftTimer;
const questionDraftDocId = computed(() => `${user.value?.uid || "guru"}_${assignmentId.value}_${kelasId}_${String(selectedMapel.value || "mapel").replace(/[^a-zA-Z0-9_-]/g, "_")}_soal`);
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
  tingkatKesulitan: "sedang",
  status: "aktif",
  semester: "",
  materi: "",
  kurikulum: "",
  tujuanPembelajaran: "",
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

// Computed Statistik Soal
const stats = computed(() => {
  const aktif = daftarSoal.value.filter(s => (s.status || "aktif") === "aktif");
  const total = aktif.length;
  const pg = aktif.filter((s) => s.tipe !== "essay").length;
  const essay = aktif.filter((s) => s.tipe === "essay").length;
  const belumDipakai = aktif.filter((s) => !s.dipakai).length;
  return { total, pg, essay, belumDipakai };
});

// Computed Filter Soal (Search + Tipe)
const filteredSoal = computed(() => {
  return daftarSoal.value.filter((item) => {
    if (filterTipe.value === "pg" && item.tipe === "essay") return false;
    if (filterTipe.value === "essay" && item.tipe !== "essay") return false;
    if (filterKesulitan.value !== "semua" && (item.tingkatKesulitan || "sedang") !== filterKesulitan.value) return false;
    if (filterStatus.value !== "semua" && (item.status || "aktif") !== filterStatus.value) return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      return [item.pertanyaan, item.materi, item.kurikulum, item.tujuanPembelajaran, ...(item.tags || [])].some(value => String(value || "").toLowerCase().includes(q));
    }
    return true;
  });
});

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

const loadSoal = async () => {
  if (!user.value || !selectedMapel.value) {
    loadingData.value = false;
    return;
  }
  loadingData.value = true;
  try {
    const q = query(
      collection(db, "soal"),
      where("userId", "==", user.value.uid),
      where("kelas", "==", Number(kelasId)),
      where("mapel", "==", selectedMapel.value),
    );
    const snapshot = await getDocs(q);
    const semuaSoal = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    daftarSoal.value = assignmentId.value === "legacy"
      ? semuaSoal.filter((soal) => !soal.assignmentId || soal.assignmentId === "legacy")
      : semuaSoal.filter((soal) => soal.assignmentId === assignmentId.value);
  } catch (e) {
    console.error("Gagal memuat soal:", e);
  } finally {
    loadingData.value = false;
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
    tingkatKesulitan: "sedang",
    status: "aktif", semester: "", materi: "", kurikulum: "", tujuanPembelajaran: "", tagInput: "",
  };
  if (fileInputRef.value) fileInputRef.value.value = "";
  try {
    const draft = await getDoc(doc(db, "draftGuru", questionDraftDocId.value));
    if (draft.exists() && draft.data().formSoal?.pertanyaan && confirm("Lanjutkan draft soal yang belum selesai?")) formSoal.value = { ...formSoal.value, ...draft.data().formSoal };
  } catch (error) { console.warn("Draft soal tidak dapat dimuat:", error); }
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
    tingkatKesulitan: soal.tingkatKesulitan || "sedang",
    status: soal.status || "aktif", semester: soal.semester || "", materi: soal.materi || "", kurikulum: soal.kurikulum || "", tujuanPembelajaran: soal.tujuanPembelajaran || "", tagInput: (soal.tags || []).join(", "),
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
    tingkatKesulitan: soal.tingkatKesulitan || "sedang",
    status: "draft", semester: soal.semester || "", materi: soal.materi || "", kurikulum: soal.kurikulum || "", tujuanPembelajaran: soal.tujuanPembelajaran || "", tagInput: (soal.tags || []).join(", "),
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

  // Cegatan Soal Duplikat
  const isDuplicate = daftarSoal.value.some((s) => {
    if (isEditMode.value && s.id === editSoalId.value) return false;
    return s.pertanyaan.trim().toLowerCase() === pertanyaanClean.toLowerCase();
  });

  if (isDuplicate) {
    warning("Pertanyaan soal ini sudah ada di daftar.");
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
      tags: formSoal.value.tagInput.split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean).slice(0, 12),
      opsi: formSoal.value.tipe === "pg" ? formSoal.value.opsi : null,
      opsiGambar: formSoal.value.tipe === "pg" ? formSoal.value.opsiGambar : null,
      kunciJawaban:
        formSoal.value.tipe === "pg" ? formSoal.value.kunciJawaban : null,
      updatedAt: new Date(),
    };

    if (isEditMode.value && editSoalId.value) {
      await updateDoc(doc(db, "soal", editSoalId.value), dataPayload);
    } else {
      dataPayload.dipakai = false;
      dataPayload.jumlahDicetak = 0;
      dataPayload.createdAt = new Date();
      await addDoc(collection(db, "soal"), dataPayload);
    }

    showModalForm.value = false;
    if (!isEditMode.value) await deleteDoc(doc(db, "draftGuru", questionDraftDocId.value)).catch(() => {});
    await catatAktivitas(isEditMode.value ? "soal_diedit" : "soal_dibuat", { soalId: editSoalId.value, mapel: selectedMapel.value, kelas: Number(kelasId) });
    await loadSoal();
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
}[level || "sedang"]);

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
const csvHeader = ["tipe", "tingkatKesulitan", "status", "semester", "materi", "kurikulum", "tujuanPembelajaran", "tags", "pertanyaan", "opsiA", "opsiB", "opsiC", "opsiD", "kunciJawaban"];
const requiredCsvHeader = ["tipe", "tingkatKesulitan", "pertanyaan", "opsiA", "opsiB", "opsiC", "opsiD", "kunciJawaban"];
const downloadTemplateCsv = () => downloadFile(`${csvHeader.join(",")}\npg,mudah,aktif,ganjil,Perkalian,Kurikulum Merdeka - Fase B,Siswa mampu menghitung perkalian,"numerasi, perkalian",Contoh pertanyaan?,Jawaban A,Jawaban B,Jawaban C,Jawaban D,a\nessay,sedang,draft,genap,Kebugaran,Kurikulum Merdeka - Fase B,Siswa mampu menjelaskan kebugaran,kebugaran,Jelaskan jawaban Anda,,,,,Pedoman jawaban`, "template-soal.csv");
const exportCsv = () => {
  const rows = daftarSoal.value.map(s => [s.tipe || "pg", s.tingkatKesulitan || "sedang", s.status || "aktif", s.semester || "", s.materi || "", s.kurikulum || "", s.tujuanPembelajaran || "", (s.tags || []).join(", "), s.pertanyaan, s.opsi?.a, s.opsi?.b, s.opsi?.c, s.opsi?.d, s.kunciJawaban].map(csvEscape).join(","));
  downloadFile([csvHeader.join(","), ...rows].join("\n"), `soal-${selectedMapel.value}-kelas-${kelasId}.csv`);
};
const parseCsv = (text) => {
  const rows = []; let row = []; let value = ""; let quoted = false;
  for (let i = 0; i < text.length; i++) { const char = text[i]; if (char === '"' && quoted && text[i + 1] === '"') { value += '"'; i++; } else if (char === '"') quoted = !quoted; else if (char === "," && !quoted) { row.push(value); value = ""; } else if ((char === "\n" || char === "\r") && !quoted) { if (char === "\r" && text[i + 1] === "\n") i++; row.push(value); if (row.some(Boolean)) rows.push(row); row = []; value = ""; } else value += char; }
  row.push(value); if (row.some(Boolean)) rows.push(row); return rows;
};
const metadataImport = data => ({
  tingkatKesulitan: ["mudah", "sedang", "sulit"].includes(String(data.tingkatKesulitan).toLowerCase()) ? String(data.tingkatKesulitan).toLowerCase() : "sedang",
  status: ["aktif", "draft", "arsip"].includes(String(data.status).toLowerCase()) ? String(data.status).toLowerCase() : "aktif",
  semester: ["ganjil", "genap"].includes(String(data.semester).toLowerCase()) ? String(data.semester).toLowerCase() : "",
  materi: String(data.materi || "").trim(), kurikulum: String(data.kurikulum || "").trim(), tujuanPembelajaran: String(data.tujuanPembelajaran || "").trim(),
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
  daftarSoal.value.forEach(s => sheet.addRow([s.tipe || "pg", s.tingkatKesulitan || "sedang", s.status || "aktif", s.semester || "", s.materi || "", s.kurikulum || "", s.tujuanPembelajaran || "", (s.tags || []).join(", "), s.pertanyaan, s.opsi?.a || "", s.opsi?.b || "", s.opsi?.c || "", s.opsi?.d || "", s.kunciJawaban || ""]));
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
  if (selectedMapel.value) loadSoal();
});

watch(formSoal, () => {
  if (!showModalForm.value || isEditMode.value || !user.value) return;
  formDraftStatus.value = "Belum tersimpan";
  clearTimeout(formDraftTimer);
  formDraftTimer = setTimeout(async () => {
    formDraftStatus.value = "Menyimpan draft…";
    try { await setDoc(doc(db, "draftGuru", questionDraftDocId.value), { userId: user.value.uid, assignmentId: assignmentId.value, kelas: Number(kelasId), mapel: selectedMapel.value, formSoal: { ...formSoal.value }, updatedAt: new Date() }, { merge: true }); formDraftStatus.value = "Draft tersimpan"; }
    catch { formDraftStatus.value = "Draft gagal disimpan"; }
  }, 1200);
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
