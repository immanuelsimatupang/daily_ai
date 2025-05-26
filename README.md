# AIWave

Platform konten AI untuk kebutuhan harian Anda. Proyek ini menggunakan React dengan Tailwind CSS untuk frontend dan Express dengan MongoDB untuk backend.

## Struktur Proyek

Proyek ini terdiri dari dua bagian utama:

- `client`: Frontend React dengan Tailwind CSS
- `server`: Backend Express dengan MongoDB

## Persyaratan

- Node.js (versi 14 atau lebih tinggi)
- MongoDB (lokal atau cloud)
- npm atau yarn

## Instalasi

### Backend

```bash
# Masuk ke direktori server
cd server

# Instal dependensi
npm install

# Jalankan server dalam mode development
npm run dev
```

### Frontend

```bash
# Masuk ke direktori client
cd client

# Instal dependensi
npm install

# Jalankan aplikasi dalam mode development
npm run dev
```

## Konfigurasi

Buat file `.env` di folder server dengan konten berikut:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/aiwave_db
JWT_SECRET=GantiDenganSecretKuatAnda
```

## Fitur

- Tampilan modern dengan Tailwind CSS
- API RESTful dengan Express
- Database MongoDB
- Autentikasi dengan JWT

## Pengembangan

Proyek ini mengikuti struktur folder standar untuk aplikasi MERN stack dengan penekanan pada desain UI yang modern menggunakan Tailwind CSS.