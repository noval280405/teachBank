<!-- pages/dashboard/kelas/[id]/cetak.vue -->
<template>
  <ClientOnly>
    <div class="max-w-5xl mx-auto space-y-6 pb-12">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <NuxtLink
            :to="`/dashboard/kelas/${kelasId}`"
            class="text-sm text-brand-600 dark:text-brand-400 hover:underline"
            >← Kembali ke Bank Soal</NuxtLink
          >
          <h1 class="text-2xl font-bold mt-1">
            🖨️ Generator Cetak Ujian - Kelas {{ kelasId }} SD
          </h1>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <select
            v-model="selectedMapel"
            class="px-3 py-2 border rounded-xl bg-white dark:bg-slate-800 text-sm font-semibold flex-1 md:flex-none"
          >
            <option v-for="m in mapelAjar" :key="m" :value="m">{{ m }}</option>
          </select>
          <button
            @click="bukaKertasCetak"
            :disabled="terpilihPG.length === 0 && terpilihEssay.length === 0"
            class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow disabled:opacity-50 transition whitespace-nowrap"
          >
            🖨️ Pratinjau & Cetak ({{ terpilihPG.length + terpilihEssay.length }}
            Soal)
          </button>
        </div>
      </div>

      <!-- Pengaturan Identitas Ujian (KOP Surat) -->
      <div
        class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
      >
        <h3 class="text-xs font-bold uppercase text-slate-500 tracking-wider">
          Pengaturan Header & KOP Ujian
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <label
              class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
              >Nama Sekolah</label
            >
            <input
              v-model="infoUjian.namaSekolah"
              type="text"
              class="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-sm"
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
              class="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-sm"
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
              class="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-sm"
              placeholder="2025/2026"
            />
          </div>
        </div>
      </div>

      <!-- Panel Kontrol Pengaturan Jumlah Soal -->
      <div
        class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <!-- Pengaturan PG -->
        <div
          class="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700"
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
                ✅ Urut (Maks {{ targetJumlahPG }})
              </button>
              <button
                @click="pilihAcak('pg')"
                class="flex-1 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-semibold hover:bg-purple-100"
              >
                🎲 Acak ({{ targetJumlahPG }} Soal)
              </button>
            </div>
            <button
              @click="pilihHanyaBelumDipakai('pg')"
              class="w-full py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-100"
            >
              ✨ Prioritaskan Soal Belum Pernah Dipakai
            </button>
          </div>
        </div>

        <!-- Pengaturan Essay -->
        <div
          class="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700"
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
                ✅ Urut (Maks {{ targetJumlahEssay }})
              </button>
              <button
                @click="pilihAcak('essay')"
                class="flex-1 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-semibold hover:bg-purple-100"
              >
                🎲 Acak ({{ targetJumlahEssay }} Soal)
              </button>
            </div>
            <button
              @click="pilihHanyaBelumDipakai('essay')"
              class="w-full py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-100"
            >
              ✨ Prioritaskan Soal Belum Pernah Dipakai
            </button>
          </div>
        </div>
      </div>

      <!-- Baris Pencarian & Clear All -->
      <div
        class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3"
      >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Cari teks soal..."
          class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs w-full sm:w-64 outline-none focus:ring-2 focus:ring-brand-500"
        />
        <div
          class="flex items-center justify-between sm:justify-end gap-4 text-xs"
        >
          <span class="text-slate-500"
            >Total terpilih: <b>{{ terpilihPG.length }} PG</b> &
            <b>{{ terpilihEssay.length }} Essay</b></span
          >
          <button
            @click="resetPilihan"
            class="text-red-500 hover:underline font-semibold"
          >
            Clear Semua Pilihan
          </button>
        </div>
      </div>

      <!-- Tab Jenis Soal -->
      <div class="flex border-b border-slate-200 dark:border-slate-700">
        <button
          @click="activeTab = 'pg'"
          :class="[
            'px-5 py-2.5 font-bold text-sm border-b-2 transition',
            activeTab === 'pg'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-400',
          ]"
        >
          Pilihan Ganda (Terpilih {{ terpilihPG.length }}/{{ targetJumlahPG }})
        </button>
        <button
          @click="activeTab = 'essay'"
          :class="[
            'px-5 py-2.5 font-bold text-sm border-b-2 transition',
            activeTab === 'essay'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-400',
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
            'p-4 rounded-xl border transition flex items-start gap-4 cursor-pointer',
            terpilihPG.includes(soal.id)
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
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
                class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                >⚠️ Sudah Pernah Dicetak</span
              >
              <span
                v-else
                class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                >✨ Belum Pernah Dipakai</span
              >
            </div>
            <p class="font-medium text-sm text-slate-800 dark:text-slate-100">
              {{ soal.pertanyaan }}
            </p>
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
            'p-4 rounded-xl border transition flex items-start gap-4 cursor-pointer',
            terpilihEssay.includes(soal.id)
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
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
                class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                >⚠️ Sudah Pernah Dicetak</span
              >
              <span
                v-else
                class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                >✨ Belum Pernah Dipakai</span
              >
            </div>
            <p class="font-medium text-sm text-slate-800 dark:text-slate-100">
              {{ soal.pertanyaan }}
            </p>
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
const { db } = useFirebase();
const { user } = useAuth();

const activeTab = ref("pg");
const mapelAjar = ref([]);
// Inisialisasi awal mengambil dari query URL jika ada
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
      mapelAjar.value = docSnap.data().mapelAjar || [];

      // PERBAIKAN DI SINI:
      // Prioritaskan mapel yang ada di URL Query. Jika tidak ada, baru gunakan mapel pertama.
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

// PERBAIKAN PADA WATCH: Update URL Query saat guru mengganti dropdown mapel
watch(selectedMapel, (newMapel) => {
  if (newMapel) {
    // Sinkronkan ke URL tanpa mereload halaman
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

// Filtered List berdasarkan kata kunci pencarian
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
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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

// Fitur Baru: Prioritaskan Soal Belum Pernah Dipakai
const pilihHanyaBelumDipakai = (tipe) => {
  const list = tipe === "pg" ? listSoalPG.value : listSoalEssay.value;
  const limit = tipe === "pg" ? targetJumlahPG.value : targetJumlahEssay.value;

  // Prioritaskan yang belum dipakai (dipakai == false/undefined)
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
  // 1. Langsung buka window baru (Mencegah Popup Blocker)
  const printWindow = window.open("", "_blank");

  // 2. Simpan payload data pilihan + Info KOP ke LocalStorage
  const printData = {
    infoUjian: infoUjian.value,
    kelas: kelasId,
    mapel: selectedMapel.value,
    pg: listSoalPG.value.filter((s) => terpilihPG.value.includes(s.id)),
    essay: listSoalEssay.value.filter((s) =>
      terpilihEssay.value.includes(s.id),
    ),
  };
  localStorage.setItem("teachbank_print_payload", JSON.stringify(printData));

  // 3. Arahkan window baru ke halaman cetak
  if (printWindow) {
    printWindow.location.href = `/dashboard/kelas/${kelasId}/print`;
  }

  // 4. Update status dokumen di Firestore secara aman dengan Promise.all
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
