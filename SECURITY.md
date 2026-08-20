# Keamanan Soalify

## Aktivasi produksi

1. Aktifkan Email/Password dan verifikasi email di Firebase Authentication.
2. Daftarkan aplikasi web pada Firebase App Check menggunakan reCAPTCHA v3.
3. Salin site key ke `NUXT_PUBLIC_FIREBASE_APP_CHECK_KEY` pada environment deployment.
4. Terbitkan aturan dengan `firebase deploy --only firestore:rules,storage`.
5. Setelah trafik App Check terlihat valid, aktifkan enforcement untuk Firestore dan Storage.

Jangan mengaktifkan enforcement App Check sebelum site key tersedia pada deployment karena semua permintaan aplikasi akan ditolak.

## Model akses data

- `pengaturanGuru/{uid}` hanya dapat diakses UID tersebut.
- Dokumen soal, kop, template, draft, riwayat, dan audit wajib memiliki `userId` yang sama dengan UID login.
- Kepemilikan dokumen tidak dapat dipindahkan melalui update.
- Storage hanya menerima gambar di bawah 2 MB pada folder UID pemilik.
- Semua lokasi lain ditolak secara default.

## Retensi dan pemulihan

Soal yang dihapus masuk ke sampah. Pembersihan permanen berjalan saat pemilik membuka bank soal setelah batas retensi terlewati. Pengguna dapat mengatur retensi antara 7–365 hari dan mengunduh backup JSON dari halaman Akun.

## Catatan dependency

Parser `xlsx` lama telah dihapus karena advisori tingkat tinggi tanpa perbaikan dan diganti dengan ExcelJS. Audit masih melaporkan advisori moderat pada dependency transitif `uuid` milik ExcelJS; jalur rentan memerlukan API UUID dengan argumen buffer yang tidak digunakan aplikasi ini.
