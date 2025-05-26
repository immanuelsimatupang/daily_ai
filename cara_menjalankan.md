# Panduan Menjalankan Aplikasi AIWave

Dokumen ini berisi panduan lengkap tentang cara menjalankan aplikasi AIWave di lingkungan lokal Anda. Ikuti langkah-langkah di bawah ini untuk menginstal dan menjalankan aplikasi dengan benar.

## Daftar Isi

1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Instalasi MongoDB](#instalasi-mongodb)
3. [Menjalankan Server Backend](#menjalankan-server-backend)
4. [Menjalankan Aplikasi Frontend](#menjalankan-aplikasi-frontend)
5. [Mengakses Aplikasi](#mengakses-aplikasi)
6. [Troubleshooting](#troubleshooting)

## Persyaratan Sistem

Sebelum memulai, pastikan sistem Anda memenuhi persyaratan berikut:

- Node.js (versi 14 atau lebih tinggi)
- MongoDB (lokal atau cloud)
- npm atau yarn
- Web browser modern (Chrome, Firefox, Edge, dll.)

## Instalasi MongoDB

### Instalasi MongoDB Lokal

1. **Unduh MongoDB Community Server**
   - Kunjungi [situs resmi MongoDB](https://www.mongodb.com/try/download/community)
   - Pilih versi yang sesuai dengan sistem operasi Anda
   - Unduh dan instal mengikuti petunjuk instalasi

2. **Verifikasi Instalasi**
   - Buka terminal atau command prompt
   - Jalankan perintah berikut untuk memverifikasi instalasi:
     ```bash
     mongod --version
     ```

3. **Jalankan MongoDB Service**
   - Pada Windows:
     ```bash
     net start MongoDB
     ```
   - Pada macOS/Linux:
     ```bash
     sudo systemctl start mongod
     ```

### Menggunakan MongoDB Atlas (Cloud)

Alternatif, Anda dapat menggunakan MongoDB Atlas (layanan cloud):

1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru (opsi gratis tersedia)
3. Dapatkan string koneksi dari dashboard
4. Gunakan string koneksi tersebut di file konfigurasi backend

## Menjalankan Server Backend

Ikuti langkah-langkah berikut untuk menjalankan server backend:

1. **Buka Terminal atau Command Prompt**

2. **Masuk ke Direktori Server**
   ```bash
   cd server
   ```

3. **Instal Dependensi**
   ```bash
   npm install
   ```

4. **Konfigurasi Environment Variables (Opsional)**
   - Buat file `.env` di direktori server
   - Tambahkan konfigurasi yang diperlukan, seperti:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/aiwave
     # Tambahkan variabel lingkungan lain jika diperlukan
     ```

5. **Jalankan Server dalam Mode Development**
   ```bash
   npm run dev
   ```

   Server akan berjalan pada `http://localhost:5000` (atau port yang Anda tentukan dalam file `.env`)

## Menjalankan Aplikasi Frontend

Setelah server backend berjalan, ikuti langkah-langkah berikut untuk menjalankan aplikasi frontend:

1. **Buka Terminal atau Command Prompt Baru** (biarkan terminal backend tetap berjalan)

2. **Masuk ke Direktori Client**
   ```bash
   cd client
   ```

3. **Instal Dependensi**
   ```bash
   npm install
   ```

4. **Jalankan Aplikasi dalam Mode Development**
   ```bash
   npm run dev
   ```

   Aplikasi frontend akan berjalan pada `http://localhost:3000` (atau port lain yang dikonfigurasi)

## Mengakses Aplikasi

Setelah menjalankan backend dan frontend, Anda dapat mengakses aplikasi AIWave:

1. Buka browser web Anda
2. Kunjungi `http://localhost:3000` (atau port yang ditentukan untuk frontend)
3. Anda sekarang dapat menggunakan aplikasi AIWave

## Troubleshooting

### Masalah Koneksi MongoDB

- Pastikan layanan MongoDB berjalan
- Verifikasi string koneksi di file `.env`
- Periksa apakah port MongoDB (27017) tidak diblokir oleh firewall

### Masalah Server Backend

- Periksa log error di terminal server
- Pastikan semua dependensi terinstal dengan benar
- Verifikasi bahwa port yang digunakan tidak digunakan oleh aplikasi lain

### Masalah Aplikasi Frontend

- Periksa konsol browser untuk error
- Pastikan server backend berjalan dan dapat diakses
- Verifikasi bahwa URL API dikonfigurasi dengan benar

---

Jika Anda mengalami masalah yang tidak tercantum di atas, silakan buka issue di repositori GitHub proyek atau hubungi tim pengembangan untuk bantuan lebih lanjut.