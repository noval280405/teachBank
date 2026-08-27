# Soalify / TeachBank

Aplikasi Nuxt 3 untuk mengelola bank soal guru, menyusun paket ujian, mencetak lembar siswa dan kunci, serta menganalisis hasil ujian. Data pengguna disimpan di Firebase dan dipisahkan berdasarkan akun guru.

## Fitur utama

- Bank soal PG dan uraian dengan gambar, rumus KaTeX, pembahasan, CP/TP, materi, tag, serta level kognitif C1–C6.
- Pemeriksaan kualitas dan kemiripan soal, filter lanjutan, perubahan massal, sampah, dan pagination.
- Impor/ekspor CSV dan Excel, draft otomatis, backup JSON tervalidasi, serta pencegahan duplikat saat pemulihan.
- Penyusun ujian dengan kisi-kisi tingkat kesulitan, paket A/B, pengacakan opsi, template tata letak, Word/PDF, kunci guru, dan lembar jawaban siswa.
- Analisis nilai dan tingkat kesukaran butir dari hasil siswa.
- Ruang kolaborasi berbasis UID dengan izin lihat/salin atau edit.
- Audit aktivitas, App Check, aturan kepemilikan Firestore, dan log error lokal terbatas.

## Menjalankan proyek

Salin `.env.example` menjadi `.env`, isi konfigurasi Firebase, lalu jalankan:

```bash
npm install
npm run dev
```

Aplikasi tersedia di `http://localhost:3000`.

## Pemeriksaan kualitas

```bash
npm test
npm run build
# atau keduanya
npm run check
```

## Firebase

Deploy aturan setelah perubahan model data:

```bash
firebase deploy --only firestore:rules,storage
```

Koleksi utama: `soal`, `pengaturanGuru`, `riwayatUjian`, `analisisUjian`, `ruangKolaborasi`, `templateUjian`, `kopUjian`, `draftGuru`, dan `auditAktivitas`. Jangan menggunakan rules permisif pada produksi.

## Format impor hasil ujian

CSV menggunakan kolom `nama,nomor,jawaban`; jawaban dipisahkan `|`, misalnya `Budi,01,a|c|b|d`. Gunakan riwayat cetak yang sesuai agar urutan kunci sama.

## Catatan kolaborasi

Guru membagikan UID dari halaman Akun kepada pemilik ruang. Pemilik memasukkan UID ketika membuat ruang. Salinan soal disimpan di dokumen ruang sehingga perubahan sumber tidak diam-diam mengubah paket bersama.
