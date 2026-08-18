<!-- pages/dashboard/kelas/[id]/cetak.vue -->
<template>
  <ClientOnly>
    <div class="max-w-6xl mx-auto space-y-6 pb-16 text-slate-800 dark:text-slate-100">
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
            @click="bukaKertasCetak"
            :disabled="terpilihPG.length === 0 && terpilihEssay.length === 0"
            class="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow disabled:cursor-not-allowed disabled:opacity-50 transition whitespace-nowrap"
          >
            <AppIcon name="printer" class="h-4 w-4" /> Pratinjau & Cetak <span class="rounded-md bg-white/15 px-1.5 py-0.5 text-xs">{{ terpilihPG.length + terpilihEssay.length }}</span>
          </button>
        </div>
        </div>
      </div>

      <!-- Pengaturan Identitas Ujian (KOP Surat) -->
      <div
        class="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5"
      >
        <div class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300"><AppIcon name="school" class="h-5 w-5" /></span><div><h2 class="font-bold">Identitas ujian</h2><p class="text-xs text-slate-500 dark:text-slate-400">Informasi ini akan tampil pada kop lembar ujian.</p></div></div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
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
        </div>
      </div>

      <!-- Panel Kontrol Pengaturan Jumlah Soal -->
      <div
        class="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
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
  updateDoc,
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

const activeTab = ref("pg");
const mapelAjar = ref([]);
const selectedMapel = ref(route.query.mapel || "");
const listSoalPG = ref([]);
const listSoalEssay = ref([]);

const terpilihPG = ref([]);
const terpilihEssay = ref([]);

const targetJumlahPG = ref(15);
const targetJumlahEssay = ref(5);
const searchQuery = ref("");

const loadPengaturan = async () => {
  if (!user.value) return;
  try {
    const docSnap = await getDoc(doc(db, "pengaturanGuru", user.value.uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      const tugas = data.penugasan?.find((item) => item.id === assignmentId.value);
      mapelAjar.value = tugas?.mapelAjar || data.mapelAjar || [];
      infoUjian.value.namaSekolah = tugas?.namaSekolah || schoolName.value;

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
});

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
    const q = query(
      collection(db, "soal"),
      where("userId", "==", user.value.uid),
      where("kelas", "==", kelasId),
      where("mapel", "==", selectedMapel.value),
    );
    const snap = await getDocs(q);
    const fetched = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const all = assignmentId.value === "legacy"
      ? fetched.filter((soal) => !soal.assignmentId || soal.assignmentId === "legacy")
      : fetched.filter((soal) => soal.assignmentId === assignmentId.value);
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
      alert(
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

const resetPilihan = () => {
  terpilihPG.value = [];
  terpilihEssay.value = [];
};

const bukaKertasCetak = async () => {
  const printWindow = window.open("", "_blank");

  // Memastikan seluruh objek data soal (termasuk imageUrl) terkirim ke halaman print
  const printData = {
    infoUjian: infoUjian.value,
    kelas: kelasId,
    jenjang: jenjang.value,
    namaSekolah: schoolName.value,
    mapel: selectedMapel.value,
    pg: listSoalPG.value.filter((s) => terpilihPG.value.includes(s.id)),
    essay: listSoalEssay.value.filter((s) =>
      terpilihEssay.value.includes(s.id),
    ),
  };
  localStorage.setItem("teachbank_print_payload", JSON.stringify(printData));

  if (printWindow) {
    printWindow.location.href = `/dashboard/kelas/${kelasId}/print`;
  }

  try {
    const ids = [...terpilihPG.value, ...terpilihEssay.value];
    const updatePromises = ids.map((id) =>
      updateDoc(doc(db, "soal", id), {
        dipakai: true,
        terakhirDipakai: new Date(),
      }),
    );
    await Promise.all(updatePromises);
  } catch (e) {
    console.error("Gagal memperbarui status soal di Firestore:", e);
  }
};

onMounted(async () => {
  await loadPengaturan();
  await loadSoal();
});
</script>
