# SMK Diponegoro 1 Jakarta - Situs Web Resmi

[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.89.0-3ECF8E.svg)](https://supabase.com/)

Aplikasi web modern dan responsif untuk SMK Diponegoro 1 Jakarta, dibangun dengan React dan Vite. Platform ini berfungsi sebagai situs web resmi untuk sekolah kejuruan, menyediakan informasi tentang program, fasilitas, guru, dan kegiatan sekolah, bersama dengan panel administrasi untuk pengelolaan konten.

## 🌟 Fitur

### Fitur Publik

- **Beranda**: Bagian hero dengan branding sekolah, pesan sambutan kepala sekolah, statistik, dan program unggulan
- **Bagian Tentang**: Informasi komprehensif termasuk profil, visi & misi, sejarah, seragam, fasilitas, struktur organisasi, dan guru
- **Program Akademik**: Informasi detail tentang jurusan TKJ (Teknik Komputer & Jaringan) dan DKV (Desain Komunikasi Visual)
- **Artikel & Berita**: Berita sekolah terbaru, prestasi siswa, dan konten edukasi dengan halaman detail
- **Program**: Informasi tentang program unggulan dan kegiatan ekstrakurikuler dengan manfaat dinamis
- **Modal Promosi**: Popup promosi yang muncul sekali per sesi dengan navigasi gambar, tautan, dan kontrol keyboard
- **Desain Responsif**: Dioptimalkan untuk desktop, tablet, dan perangkat mobile
- **Performa Dioptimalkan**: Lazy loading, code splitting, dan aset yang dioptimalkan
- **Animasi Halus**: GSAP dan Framer Motion untuk pengalaman pengguna yang ditingkatkan

### Fitur Administratif

- **Pengelolaan Konten**: Panel admin untuk mengelola artikel, guru, seragam, fasilitas, program, dan popup promosi
- **Autentikasi**: Sistem login aman untuk administrator menggunakan Supabase Auth
- **Operasi CRUD**: Fungsi create, read, update, dan delete untuk semua jenis konten
- **Upload File**: Kemampuan upload gambar untuk artikel dan konten dengan konversi WebP otomatis
- **Rute Terlindungi**: Akses aman ke bagian khusus admin
- **Dashboard**: Ikhtisar statistik situs web dan tindakan cepat
- **Pengelolaan Teks Kaya**: Dukungan untuk daftar manfaat dinamis dalam program
- **Manajemen Popup Promosi**: Kontrol popup promosi dengan prioritas, tanggal aktif, tautan CTA, dan pengaturan tab baru

## 🛠️ Tech Stack

### Frontend

- **React 19.2.3** - Library JavaScript modern untuk membangun antarmuka pengguna
- **Vite 7.2.4** - Alat build cepat dan server pengembangan
- **Tailwind CSS 4.1.18** - Framework CSS utility-first
- **React Router DOM 7.11.0** - Routing deklaratif untuk React

### Animasi & Interaksi

- **GSAP 3.14.2** - Library animasi JavaScript berperforma tinggi
- **Framer Motion 12.24.10** - Library motion siap produksi untuk React
- **AOS 2.3.4** - Library animasi saat scroll

### Backend & Database

- **Supabase 2.89.0** - Alternatif Firebase open source untuk layanan backend
- **Supabase Storage** - Penyimpanan file untuk gambar (bucket article-images, facility-images, uniform-images, teacher-images, program-images, popup-images)

### Alat Pengembangan

- **ESLint 9.39.1** - Utilitas linting JavaScript
- **Lucide React 0.562.0** - Toolkit ikon yang indah & konsisten
- **Recharts 3.6.0** - Library charting yang dapat dikomposisi dibangun pada komponen React
- **HTML2PDF.js 0.12.1** - Konversi HTML-ke-PDF sisi klien

### Build & Deployment

- **Vercel Analytics 1.6.1** - Analytics real-time untuk aplikasi web
- **Vite Compression Plugin 0.5.1** - Plugin kompresi untuk Vite
- **JavaScript Obfuscator 5.1.0** - Obfuscator JavaScript untuk build produksi

## 📋 Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal yang berikut:

- **Node.js** (versi 16 atau lebih tinggi)
- **npm** atau **yarn** package manager
- **Supabase** akun untuk layanan backend

## 🚀 Instalasi

1. **Kloning repositori**

   ```bash
   git clone <repository-url>
   cd web-dipo
   ```

2. **Instal dependensi**

   ```bash
   npm install
   ```

3. **Pengaturan Lingkungan**
   - Buat file `.env` di direktori root
   - Tambahkan konfigurasi Supabase Anda:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Jalankan server pengembangan**

   ```bash
   npm run dev
   ```

5. **Build untuk produksi**

   ```bash
   npm run build
   ```

6. **Pratinjau build produksi**
   ```bash
   npm run preview
   ```

## 📁 Struktur Proyek

```
web-dipo/
├── public/                    # Aset statis
│   ├── logo yayasan al-hidayah-02.png
│   └── vite.png
├── src/
│   ├── assets/               # Gambar dan file media
│   │   ├── logo yayasan al-hidayah-02.webp
│   │   ├── Bu Ipeh.webp
│   │   ├── icon-tkj2.webp
│   │   ├── icon-dkv2.webp
│   │   └── ... (gambar guru dan fasilitas)
│   ├── components/           # Komponen React yang dapat digunakan ulang
│   │   ├── Layout.jsx        # Wrapper layout utama
│   │   ├── Navbar.jsx        # Komponen navigasi dengan animasi GSAP
│   │   ├── Footer.jsx        # Komponen footer
│   │   ├── Mobilemenu.jsx    # Navigasi mobile
│   │   ├── Dropdown.jsx      # Komponen menu dropdown
│   │   ├── AdminLayout.jsx   # Layout panel admin
│   │   ├── ProtectedRoute.jsx # Komponen perlindungan rute
│   │   ├── PromotionalModal.jsx # Komponen modal popup untuk menampilkan promosi dengan navigasi gambar, kontrol keyboard, dan logika muncul sekali per sesi
│   │   └── ...
│   ├── data/                 # Data statis dan konfigurasi
│   │   └── navigation.js     # Konfigurasi menu navigasi
│   ├── lib/                  # Library utilitas
│   │   └── supabase.js       # Konfigurasi klien Supabase
│   ├── pages/                # Komponen halaman
│   │   ├── Home.jsx          # Beranda dengan hero, statistik, dan program
│   │   ├── Login.jsx         # Halaman login admin
│   │   ├── Artikel.jsx       # Halaman daftar artikel
│   │   ├── DetailArtikel.jsx # Halaman detail artikel
│   │   ├── DetailProgram.jsx # Halaman detail program
│   │   ├── ppdb.jsx          # Halaman placeholder PPDB
│   │   ├── admin/            # Halaman panel admin
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageArtikel.jsx
│   │   │   ├── FormArtikel.jsx
│   │   │   ├── ManageGuru.jsx
│   │   │   ├── FormGuru.jsx
│   │   │   ├── ManageSeragam.jsx
│   │   │   ├── FormSeragam.jsx
│   │   │   ├── ManageFasilitas.jsx
│   │   │   ├── FormFasilitas.jsx
│   │   │   ├── ManageProgram.jsx
│   │   │   ├── FormProgram.jsx
│   │   │   ├── ManagePopup.jsx
│   │   │   ├── PopupForm.jsx
│   │   ├── tentang/          # Halaman bagian tentang
│   │   │   ├── Overview.jsx
│   │   │   ├── Profil.jsx
│   │   │   ├── VisiMisi.jsx
│   │   │   ├── Sejarah.jsx
│   │   │   ├── ProgramUnggulan.jsx
│   │   │   ├── Seragam.jsx
│   │   │   ├── Fasilitas.jsx
│   │   │   ├── Struktur.jsx
│   │   │   └── Guru.jsx
│   │   └── Jurusan/          # Halaman program jurusan
│   │       ├── Jurusan.jsx
│   │       ├── TKJ.jsx
│   │       └── DKV.jsx
│   ├── App.jsx               # Komponen aplikasi utama dengan routing
│   ├── main.jsx              # Titik masuk aplikasi
│   ├── App.css               # Gaya global
│   └── index.css             # Gaya global tambahan
├── index.html                # Template HTML
├── package.json              # Dependensi proyek dan skrip
├── vite.config.js            # Konfigurasi Vite dengan kompresi dan obfuscation
├── tailwind.config.js        # Konfigurasi Tailwind CSS
├── eslint.config.js          # Konfigurasi ESLint
├── vercel.json               # Konfigurasi deployment Vercel
└── README.md                 # Dokumentasi proyek
```

## 🎯 Penggunaan

### Untuk Pengunjung

- Jelajahi informasi sekolah, program, dan berita terbaru
- Pelajari tentang jurusan TKJ dan DKV
- Akses informasi kontak dan detail pendaftaran
- Lihat fasilitas sekolah dan profil guru
- Baca artikel dan detail program

### Untuk Administrator

1. Akses panel admin di `/admin` (memerlukan login)
2. Login dengan kredensial administrator
3. Kelola konten melalui dashboard:
   - **Artikel**: Tambah/edit/hapus berita dan pengumuman
   - **Guru**: Kelola profil guru dan staf
   - **Fasilitas**: Perbarui informasi fasilitas sekolah
   - **Seragam**: Konfigurasi jadwal dan detail seragam
   - **Program**: Kelola program unggulan dengan manfaat
   - Upload dan kelola gambar dengan konversi WebP otomatis

## 🔧 Skrip Tersedia

- `npm run dev` - Jalankan server pengembangan
- `npm run build` - Build untuk produksi
- `npm run preview` - Pratinjau build produksi
- `npm run lint` - Jalankan ESLint

## 🌐 Deployment

Aplikasi ini dikonfigurasi untuk deployment di Vercel dengan optimasi berikut:

- **Kompresi**: Aset statis dikompresi untuk pemuatan lebih cepat
- **Analytics**: Terintegrasi dengan Vercel Analytics untuk pemantauan performa
- **Obfuscation**: Kode JavaScript di-obfuscate dalam build produksi
- **Variabel Lingkungan**: Konfigurasi aman melalui variabel lingkungan

## 🤝 Kontribusi

1. Fork repositori
2. Buat branch fitur (`git checkout -b feature/fitur-hebat`)
3. Commit perubahan Anda (`git commit -m 'Tambah fitur hebat'`)
4. Push ke branch (`git push origin feature/fitur-hebat`)
5. Buka Pull Request

## 📄 Lisensi

Proyek ini adalah perangkat lunak proprietary untuk SMK Diponegoro 1 Jakarta.

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi administrasi sekolah.

---

**SMK Diponegoro 1 Jakarta** - Membangun Pemimpin Masa Depan Melalui Keunggulan Vokasi
