Baik, mari kita susun ulang panduan proyek AIWave menjadi sebuah **Panduan Proyek Lengkap** yang menyatukan semua aspek yang telah kita diskusikan, termasuk detail mengenai gaya desain dan implementasinya.

-----

**Panduan Proyek Lengkap: AIWave - Daily AI Update (MERN Stack)**

**1. Pendahuluan**

  * **Nama Proyek:** AIWave
  * **Deskripsi:** AIWave adalah platform berbasis web yang bertujuan untuk menyajikan informasi dan pembaruan harian seputar perkembangan dunia kecerdasan buatan (AI). Platform ini dirancang untuk menjadi sumber informasi yang cepat, ringkas, dan akurat mengenai AI, dengan antarmuka yang modern dan pengalaman pengguna yang optimal.
  * **Target Pengguna:** Penggemar teknologi, peneliti, profesional di bidang IT, pelajar, dan masyarakat umum yang memiliki minat atau ingin mengetahui perkembangan terbaru di bidang AI.

**2. Gaya Desain dan Tampilan Visual**

Untuk AIWave, kita akan mengadopsi gaya desain yang modern, bersih, minimalis, dengan fokus kuat pada tipografi, keterbacaan, dan pengalaman pengguna yang intuitif, terinspirasi oleh standar desain web kontemporer seperti yang terlihat pada portofolio desainer terkemuka (misalnya, `rickwaalders.com`).

**2.1. Prinsip Desain Utama:**

1.  **Minimalisme & Ruang Kosong (Whitespace):**
      * Desain akan menghindari elemen yang tidak perlu dan memaksimalkan penggunaan ruang kosong untuk memberikan kesan bersih, elegan, dan membantu konten lebih menonjol serta mudah dicerna.
2.  **Tipografi yang Kuat & Berhierarki:**
      * **Judul (Headlines):** Menggunakan font sans-serif modern yang besar dan jelas (misalnya, Inter, Manrope) untuk menarik perhatian dan memberikan dampak visual.
      * **Teks Isi (Body Text):** Memilih font sans-serif yang sangat mudah dibaca dengan ukuran dan jarak baris yang optimal untuk kenyamanan membaca artikel panjang.
      * **Hierarki Visual:** Skala tipografi yang konsisten dan jelas untuk membedakan judul utama, sub-judul, kutipan, teks isi, dan metadata (seperti tanggal, tag).
3.  **Palet Warna Terbatas & Kontras Tinggi:**
      * **Dominan Warna Netral:** Penggunaan warna putih, hitam, dan berbagai gradasi abu-abu untuk menciptakan fondasi yang tenang dan profesional.
      * **Warna Aksen:** Satu atau dua warna aksen yang dipilih dengan cermat (misalnya, biru teknologi, hijau segar, atau ungu inovatif) akan digunakan secara strategis untuk elemen interaktif (tombol, tautan aktif), sorotan, dan branding.
      * **Mode Gelap (Dark Mode):** Implementasi mode gelap yang elegan dan nyaman di mata, konsisten dengan tema teknologi.
4.  **Tata Letak Terstruktur & Responsif:**
      * **Berbasis Grid:** Menggunakan sistem grid yang kuat untuk menyusun elemen secara harmonis dan konsisten.
      * **Tata Letak Kartu (Card Layout):** Efektif untuk menampilkan daftar artikel di beranda atau halaman kategori, memungkinkan presentasi informasi yang ringkas dan visual.
      * **Desain Responsif Penuh:** Tampilan akan beradaptasi dengan mulus di berbagai ukuran layar (desktop, tablet, mobile).
5.  **Visual & Grafis (Jika Digunakan):**
      * **Fokus pada Kualitas:** Jika gambar atau ilustrasi digunakan, harus berkualitas tinggi, relevan, dan mendukung konten.
      * **Abstrak atau Ikonografi:** Pertimbangkan penggunaan elemen grafis abstrak yang halus, pola geometris, atau ikonografi minimalis yang konsisten untuk memperkuat tema AI dan teknologi.
6.  **Animasi & Interaksi Halus:**
      * **Subtil & Fungsional:** Animasi akan digunakan untuk meningkatkan pengalaman pengguna, bukan sebagai distraksi (misalnya, efek hover pada tombol atau kartu, transisi halaman yang lembut, pemuatan konten yang elegan).

**2.2. Penerapan pada AIWave:**

  * **Beranda:** Tampilan bersih dengan sorotan pada artikel terbaru atau paling penting. Daftar artikel dapat menggunakan tata letak kartu dengan visual minimalis atau tanpa visual sama sekali (fokus pada judul dan ringkasan).
  * **Halaman Artikel:** Desain yang memaksimalkan keterbacaan. Kolom tunggal atau utama yang lebar untuk teks, dengan ruang kosong yang cukup. Tipografi menjadi elemen sentral.
  * **Navigasi:** Header minimalis dengan navigasi yang jelas dan intuitif.

**2.3. Peran Tailwind CSS:**

Tailwind CSS akan menjadi alat utama untuk mencapai gaya desain ini karena sifatnya yang utility-first:

  * **Kustomisasi Penuh:** `tailwind.config.js` akan dikonfigurasi secara ekstensif untuk palet warna kustom, keluarga font, skala spacing, dan breakpoint responsif yang sesuai dengan visi desain.
  * **Kontrol Granular:** Utility classes memungkinkan penerapan gaya yang presisi hingga ke detail terkecil, penting untuk minimalisme dan tipografi yang cermat.
  * **Pengembangan Cepat & Konsisten:** Membangun komponen UI kustom dengan cepat dan menjaga konsistensi visual di seluruh platform.
  * **Mode Gelap Terintegrasi:** Kemampuan `dark:` variant pada Tailwind akan mempermudah implementasi mode gelap.

**3. Fitur Utama dan Tambahan**

*(Daftar fitur sama seperti pada panduan gabungan sebelumnya, di sini akan diringkas kategorinya)*

**3.1. Fitur Inti & Konten:**
\* Beranda Dinamis, Blog Posting (Artikel CRUD), Tag Filtering, Admin Dashboard.

**3.2. Fitur Tambahan & Peningkatan Pengalaman Pengguna:**
\* Editor Konten Visual (WYSIWYG), Sistem Komentar, Pencarian Artikel, AI Summary (Opsional), Newsletter (Opsional), Dark Mode (Implementasi desain), Optimasi SEO Dasar & Lanjutan, Perpustakaan Media Sederhana, Penjadwalan Publikasi (Opsional), Analitik Dasar (Opsional), Fitur Berbagi Sosial, Halaman Statis.

**3.3. Fitur Potensial untuk Pengembangan Lebih Lanjut (Opsional):**
\* Manajemen Pengguna dengan Peran Lebih Beragam, Monetisasi, Keamanan Tambahan dan Backup.

**4. Teknologi yang Digunakan (MERN Stack)**

  * **Frontend (Folder: `client/`):**
      * **React.js:** Library JavaScript untuk membangun antarmuka pengguna.
      * **Tailwind CSS:** Framework CSS utility-first untuk styling kustom yang presisi, menjadi tulang punggung implementasi gaya desain yang diinginkan.
      * **Axios:** HTTP client untuk permintaan ke backend.
      * (State management opsional: Redux Toolkit atau Zustand).
  * **Backend (Folder: `server/`):**
      * **Node.js & Express.js:** Lingkungan runtime dan framework aplikasi web.
      * **MongoDB & Mongoose:** Database NoSQL dan ODM.
      * **Dotenv, CORS, Body-parser (terintegrasi di Express).**
      * **JSON Web Tokens (JWT) (Opsional, untuk Autentikasi).**
  * **Database:**
      * **MongoDB:** Lokal atau cloud (MongoDB Atlas).

**5. Struktur Folder Proyek**

Struktur folder akan mengikuti standar proyek MERN, dengan penekanan pada organisasi komponen UI dan styling di sisi frontend untuk mendukung implementasi desain.

```
aiwave/
├── client/              # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── assets/      # Gambar, font, ikon SVG kustom
│   │   ├── components/  # Komponen UI global & spesifik (misal: Button, Card, Navbar)
│   │   ├── features/    # (Opsional) Modul berdasarkan fitur (misal: articles, comments)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── layouts/     # Komponen tata letak utama (misal: MainLayout, ArticleLayout)
│   │   ├── pages/       # Komponen untuk setiap halaman/rute
│   │   ├── services/    # Fungsi untuk interaksi API
│   │   ├── store/       # (Jika menggunakan state management)
│   │   ├── styles/      # File CSS global, konfigurasi utama Tailwind (jika dipisah), font-face
│   │   ├── utils/       # Fungsi utilitas frontend
│   │   ├── App.jsx
│   │   └── index.js
│   ├── tailwind.config.js # Konfigurasi utama Tailwind CSS
│   ├── postcss.config.js  # Konfigurasi PostCSS (biasanya untuk Autoprefixer dengan Tailwind)
│   └── package.json
├── server/              # Backend (Node.js + Express)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── .env
├── .gitignore
└── README.md
```

**6. Alur Pengembangan (Disarankan)**

1.  **Perencanaan & Desain Awal:**
      * Finalisasi daftar fitur prioritas.
      * Buat wireframe atau mockup digital sederhana berdasarkan prinsip desain yang telah ditetapkan (minimalis, tipografi kuat, dll.).
      * Tentukan palet warna, pilihan font, dan susun *design system* mini (bagaimana tombol terlihat, kartu, input, dll.) yang akan diimplementasikan dengan Tailwind.
2.  **Setup Proyek & Konfigurasi Tailwind:**
      * Inisialisasi proyek (Git, Node.js, React).
      * Install dan konfigurasi Tailwind CSS secara menyeluruh di `tailwind.config.js` (warna, font, spacing, dll.) sesuai dengan panduan desain.
3.  **Pengembangan Backend Awal:** (Sama seperti panduan sebelumnya: koneksi DB, model Post & User, API CRUD artikel dasar, autentikasi admin).
4.  **Pengembangan Frontend Awal & Komponen Dasar:**
      * Buat komponen UI dasar (Reusable Components) menggunakan React dan Tailwind CSS sesuai *design system* yang dirancang (misalnya, `<Button>`, `<Card>`, `<Typography>`, `<Layout>`).
      * Implementasikan tata letak utama (header, footer, navigasi).
      * Hubungkan frontend dengan backend untuk menampilkan data artikel awal.
5.  **Implementasi Fitur Inti & Styling Lanjutan:**
      * **Admin Dashboard:** Bangun antarmuka admin dengan fokus pada fungsionalitas dan konsistensi desain.
      * **Editor Konten Visual (WYSIWYG):** Integrasikan dan pastikan outputnya dapat di-render dengan baik sesuai gaya situs.
      * **Tagging & Filtering:** Desain UI yang intuitif untuk manajemen dan pemilihan tag.
      * **Styling Iteratif:** Terapkan styling secara konsisten menggunakan utility Tailwind, selalu mengacu pada prinsip desain yang telah ditetapkan.
6.  **Implementasi Fitur Tambahan & UX:** (Sama seperti panduan sebelumnya, dengan perhatian pada integrasi desain yang mulus).
7.  **Responsivitas & Pengujian Lintas Perangkat:** Pastikan semua halaman dan fitur berfungsi dan terlihat baik di berbagai ukuran layar. Manfaatkan breakpoint Tailwind.
8.  **Pengujian Fungsional & Pengalaman Pengguna.**
9.  **Refinement, Optimasi & Persiapan Deploy.**

**7. Contoh Konfigurasi `.env`**

(Sama seperti panduan sebelumnya)
Lokasi: `/server/.env`

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/aiwave_db
JWT_SECRET=GantiDenganSecretKuatAnda
# OPENAI_API_KEY=...
```

**8. Menjalankan Proyek**

(Sama seperti panduan sebelumnya)

  * **Backend (`server/`):** `cd server && npm install && npm start`
  * **Frontend (`client/`):** `cd client && npm install && npm start` (atau `npm run dev`)

**9. Diagram Arsitektur (Sederhana)**

(Sama seperti panduan sebelumnya, dengan penekanan bahwa UI yang dihasilkan React akan di-style secara ekstensif oleh Tailwind CSS untuk mencapai desain yang diinginkan)

**10. Peran Pengguna**

(Sama seperti panduan sebelumnya: Pengunjung Umum, Admin, dan peran tambahan opsional)

**11. Catatan Implementasi Fitur Tambahan (Tingkat Tinggi)**

(Sama seperti panduan sebelumnya, dengan catatan tambahan bahwa UI untuk fitur-fitur ini harus konsisten dengan gaya desain utama yang diimplementasikan menggunakan Tailwind CSS)

**12. Alur CI/CD (Opsional untuk Pengembangan Lanjutan)**

(Sama seperti panduan sebelumnya)

-----

Panduan ini kini lebih lengkap dengan menyertakan arahan spesifik mengenai gaya desain visual dan bagaimana Tailwind CSS akan digunakan untuk mencapainya, memastikan bahwa aspek estetika dan fungsionalitas berjalan seiring dalam pengembangan AIWave.