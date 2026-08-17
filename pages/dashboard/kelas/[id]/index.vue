<!-- pages/dashboard/kelas/[id]/index.vue -->
<template>
  <div>
    <!-- Header Navigation -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
    >
      <div>
        <NuxtLink
          to="/dashboard"
          class="text-sm text-brand-600 dark:text-brand-400 hover:underline"
          >← Kembali ke Dashboard</NuxtLink
        >
        <h1 class="text-2xl font-bold mt-1">
          Gudang Soal Kelas {{ kelasId }} SD
        </h1>
      </div>

      <ClientOnly>
        <div class="flex flex-wrap gap-2 w-full sm:w-auto">
          <!-- Filter Mapel -->
          <select
            v-if="mapelAjar.length > 0"
            v-model="selectedMapel"
            @change="updateUrlQuery"
            class="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-semibold text-sm outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option v-for="m in mapelAjar" :key="m" :value="m">{{ m }}</option>
          </select>

          <!-- Tombol Cetak Soal -->
          <NuxtLink
            :to="`/dashboard/kelas/${kelasId}/cetak`"
            class="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-xl transition shadow text-sm flex items-center gap-1.5"
          >
            🖨️ Cetak Soal Ujian
          </NuxtLink>

          <!-- Tombol Buat Soal -->
          <button
            @click="bukaModalTambah"
            :disabled="!selectedMapel"
            class="bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-xl transition shadow text-sm disabled:opacity-50"
          >
            + Buat Soal
          </button>
        </div>
      </ClientOnly>
    </div>

    <!-- Ringkasan Statistik Soal -->
    <ClientOnly>
      <div
        v-if="mapelAjar.length > 0 && !loadingData"
        class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
      >
        <div
          class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
        >
          <p class="text-xs text-slate-500">Total Soal</p>
          <p class="text-lg font-bold text-slate-800 dark:text-slate-100">
            {{ stats.total }} Soal
          </p>
        </div>
        <div
          class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
        >
          <p class="text-xs text-slate-500">Pilihan Ganda</p>
          <p class="text-lg font-bold text-brand-600 dark:text-brand-400">
            {{ stats.pg }} Soal
          </p>
        </div>
        <div
          class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
        >
          <p class="text-xs text-slate-500">Essay / Uraian</p>
          <p class="text-lg font-bold text-purple-600 dark:text-purple-400">
            {{ stats.essay }} Soal
          </p>
        </div>
        <div
          class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
        >
          <p class="text-xs text-slate-500">Belum Dipakai</p>
          <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {{ stats.belumDipakai }} Soal
          </p>
        </div>
      </div>
    </ClientOnly>

    <!-- Search & Filter Tipe Soal Bar -->
    <ClientOnly>
      <div
        v-if="mapelAjar.length > 0 && daftarSoal.length > 0"
        class="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pertanyaan atau teks soal..."
            class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
          <span class="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
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
      </div>
    </ClientOnly>

    <!-- State Loading -->
    <div v-if="loadingData" class="text-center py-12 text-slate-500">
      Memuat data soal...
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
        class="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div class="flex justify-between items-start gap-4 mb-3">
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
            >
              Soal #{{ index + 1 }} - {{ item.mapel }} ({{
                item.tipe === "essay" ? "Essay" : "PG"
              }})
            </span>

            <span
              v-if="item.dipakai"
              class="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
            >
              ⚠️ Pernah Dicetak
            </span>
            <span
              v-else
              class="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
            >
              ✨ Belum Dipakai
            </span>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="duplikatSoal(item)"
              class="text-slate-500 hover:text-slate-700 font-medium text-xs flex items-center gap-1"
              title="Gandakan Soal Ini"
            >
              📋 Duplikat
            </button>
            <button
              @click="bukaModalEdit(item)"
              class="text-brand-600 hover:text-brand-700 font-medium text-xs flex items-center gap-1"
            >
              ✏️ Edit
            </button>
            <button
              @click="mintaKonfirmasiHapus(item)"
              class="text-red-500 hover:text-red-700 font-medium text-xs flex items-center gap-1"
            >
              🗑️ Hapus
            </button>
          </div>
        </div>

        <p class="font-bold text-base mb-3 text-slate-800 dark:text-slate-100">
          {{ item.pertanyaan }}
        </p>

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
            {{ item.opsi[kunci] }}
            <span v-if="item.kunciJawaban === kunci" class="ml-2 text-xs"
              >✓ (Kunci)</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form Input / Edit Soal -->
    <ClientOnly>
      <div
        v-if="showModalForm"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      >
        <div
          class="bg-white dark:bg-slate-800 w-full max-w-lg p-6 rounded-2xl shadow-xl space-y-4 my-8"
        >
          <h2 class="text-xl font-bold">
            {{ isEditMode ? "Edit Soal" : "Buat Soal Baru" }} ({{
              selectedMapel
            }})
          </h2>

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
            <div class="flex justify-between items-center">
              <label
                class="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400"
              >
                🖼️ Upload Gambar Soal (Opsional)
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
              Gambar akan otomatis diompres & disimpan langsung ke database
              (Maks 1MB).
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
              class="flex items-center gap-2"
            >
              <span class="font-bold uppercase w-4 text-center text-sm">{{
                kunci
              }}</span>
              <input
                v-model="formSoal.opsi[kunci]"
                type="text"
                :placeholder="`Jawaban ${kunci.toUpperCase()}`"
                class="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-brand-500"
              />
              <label
                class="flex items-center gap-1 text-xs cursor-pointer px-2 py-1 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-700"
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
          </div>

          <div
            class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700"
          >
            <button
              @click="showModalForm = false"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm text-slate-500 rounded-xl"
            >
              Batal
            </button>
            <button
              @click="simpanSoal"
              :disabled="isSubmitting"
              class="px-5 py-2 text-sm bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow disabled:opacity-50"
            >
              <span v-if="isSubmitting">⏳ Menyimpan...</span>
              <span v-else>{{
                isEditMode ? "Simpan Perubahan" : "Tambah Soal"
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Modal Konfirmasi Hapus Soal -->
    <ClientOnly>
      <div
        v-if="showModalHapus"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white dark:bg-slate-800 w-full max-w-sm p-6 rounded-2xl shadow-xl space-y-4 text-center"
        >
          <div
            class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold"
          >
            ⚠️
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
            Hapus Soal Ini?
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Soal <b>"{{ targetHapusSoal?.pertanyaan }}"</b> akan dihapus secara
            permanen dari gudang soal.
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
} from "firebase/firestore";

definePageMeta({
  middleware: "auth",
  key: (route) => route.fullPath,
});

const route = useRoute();
const router = useRouter();
const kelasId = route.params.id;
const { db } = useFirebase();
const { user, initAuth } = useAuth();

const mapelAjar = ref([]);
const selectedMapel = ref("");
const daftarSoal = ref([]);
const loadingData = ref(true);

// State Search & Filter Tipe
const searchQuery = ref("");
const filterTipe = ref("semua");

// State Modal Form (Tambah & Edit)
const showModalForm = ref(false);
const isEditMode = ref(false);
const editSoalId = ref(null);
const isSubmitting = ref(false);
const fileInputRef = ref(null);

const formSoal = ref({
  tipe: "pg",
  pertanyaan: "",
  imageUrl: "",
  opsi: { a: "", b: "", c: "", d: "" },
  kunciJawaban: "a",
});

// State Modal Konfirmasi Hapus
const showModalHapus = ref(false);
const targetHapusSoal = ref(null);

// Computed Statistik Soal
const stats = computed(() => {
  const total = daftarSoal.value.length;
  const pg = daftarSoal.value.filter((s) => s.tipe !== "essay").length;
  const essay = daftarSoal.value.filter((s) => s.tipe === "essay").length;
  const belumDipakai = daftarSoal.value.filter((s) => !s.dipakai).length;
  return { total, pg, essay, belumDipakai };
});

// Computed Filter Soal (Search + Tipe)
const filteredSoal = computed(() => {
  return daftarSoal.value.filter((item) => {
    if (filterTipe.value === "pg" && item.tipe === "essay") return false;
    if (filterTipe.value === "essay" && item.tipe !== "essay") return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      return item.pertanyaan?.toLowerCase().includes(q);
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
      mapelAjar.value = docSnap.data().mapelAjar || [];

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
    daftarSoal.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error("Gagal memuat soal:", e);
  } finally {
    loadingData.value = false;
  }
};

// HANDLER UPLOAD FILE & KONVERSI KE BASE64
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Batas ukuran file (maksimal 1 MB agar ukuran Firestore hemat)
  if (file.size > 1024 * 1024) {
    alert("Ukuran gambar terlalu besar! Maksimal 1 MB.");
    if (fileInputRef.value) fileInputRef.value.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    formSoal.value.imageUrl = event.target.result; // Hasilnya berupa string Base64
  };
  reader.readAsDataURL(file);
};

const hapusGambar = () => {
  formSoal.value.imageUrl = "";
  if (fileInputRef.value) fileInputRef.value.value = "";
};

// Handler Buka Form Modal
const bukaModalTambah = () => {
  isEditMode.value = false;
  editSoalId.value = null;
  formSoal.value = {
    tipe: "pg",
    pertanyaan: "",
    imageUrl: "",
    opsi: { a: "", b: "", c: "", d: "" },
    kunciJawaban: "a",
  };
  if (fileInputRef.value) fileInputRef.value.value = "";
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
    kunciJawaban: soal.kunciJawaban || "a",
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
    kunciJawaban: soal.kunciJawaban || "a",
  };
  if (fileInputRef.value) fileInputRef.value.value = "";
  showModalForm.value = true;
};

// Simpan atau Update Soal ke Firestore Collection
const simpanSoal = async () => {
  const pertanyaanClean = formSoal.value.pertanyaan.trim();

  if (!pertanyaanClean) {
    alert("Harap isi pertanyaan!");
    return;
  }
  if (
    formSoal.value.tipe === "pg" &&
    (!formSoal.value.opsi.a || !formSoal.value.opsi.b)
  ) {
    alert("Harap isi minimal pilihan A dan B untuk soal Pilihan Ganda!");
    return;
  }

  // Cegatan Soal Duplikat
  const isDuplicate = daftarSoal.value.some((s) => {
    if (isEditMode.value && s.id === editSoalId.value) return false;
    return s.pertanyaan.trim().toLowerCase() === pertanyaanClean.toLowerCase();
  });

  if (isDuplicate) {
    alert("⚠️ Pertanyaan soal ini sudah ada di daftar!");
    return;
  }

  isSubmitting.value = true;

  try {
    const dataPayload = {
      userId: user.value.uid,
      kelas: Number(kelasId),
      mapel: selectedMapel.value,
      tipe: formSoal.value.tipe,
      pertanyaan: pertanyaanClean,
      imageUrl: formSoal.value.imageUrl, // Berisi string Base64 gambar
      opsi: formSoal.value.tipe === "pg" ? formSoal.value.opsi : null,
      kunciJawaban:
        formSoal.value.tipe === "pg" ? formSoal.value.kunciJawaban : null,
      updatedAt: new Date(),
    };

    if (isEditMode.value && editSoalId.value) {
      await updateDoc(doc(db, "soal", editSoalId.value), dataPayload);
    } else {
      dataPayload.dipakai = false;
      dataPayload.createdAt = new Date();
      await addDoc(collection(db, "soal"), dataPayload);
    }

    showModalForm.value = false;
    await loadSoal();
  } catch (e) {
    console.error("Gagal menyimpan soal:", e);
    alert("Terjadi kesalahan saat menyimpan soal.");
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
    await deleteDoc(doc(db, "soal", targetHapusSoal.value.id));
    showModalHapus.value = false;
    targetHapusSoal.value = null;
    await loadSoal();
  } catch (e) {
    console.error("Gagal menghapus soal:", e);
  }
};

watch(selectedMapel, () => {
  searchQuery.value = "";
  if (selectedMapel.value) loadSoal();
});

onMounted(async () => {
  if (initAuth) await initAuth();
  await loadPengaturanGuru();
  await loadSoal();
});
</script>
