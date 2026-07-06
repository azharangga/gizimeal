<div align="center">

# GiziMeal

[![Next.js](https://img.shields.io/badge/Next.js-v15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-v19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-007ACC?style=flat-square&logo=typescript&logoColor=white)](#)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](#)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-v12-black?style=flat-square&logo=framer&logoColor=ff0055)](#)

---

</div>

## Deskripsi Singkat Proyek

GiziMeal adalah aplikasi web (web application) interaktif sekaligus capstone project dari tim **CC26-PSU393** bertema *Healthy Lives & Well-Being*. Proyek ini bertujuan untuk mengatasi minimnya literasi gizi di masyarakat dengan menyatukan teknologi klasifikasi citra bahan makanan otomatis menggunakan Deep Learning (multi-task model) dengan basis pedoman gizi resmi Indonesia (Permenkes RI No. 28/2019 tentang Angka Kecukupan Gizi / AKG). Aplikasi ini dapat mengenali 15 jenis bahan makanan utama dari foto yang diunggah pengguna, menghitung estimasi kalori harian (BMR & TDEE menggunakan rumus Mifflin–St Jeor), serta memberikan rekomendasi menu makanan seimbang yang dilengkapi skor AKG.

---

## Fitur Utama

- **Deteksi & Klasifikasi Bahan Makanan berbasis AI**: Mengunggah gambar bahan makanan (single/multi-image) untuk diidentifikasi jenis bahan dan estimasi kalorinya menggunakan model Deep Learning.
- **Rekomendasi Menu Gizi Seimbang**: Menyediakan rekomendasi menu berdasarkan bahan yang dideteksi dan dihitung dengan Skor AKG acuan resmi Permenkes RI.
- **Kalkulator BMR & TDEE**: Mengestimasi kebutuhan kalori harian secara personal menggunakan metode Mifflin–St Jeor.
- **Database Nutrisi Terintegrasi**: Pencarian info nutrisi bahan makanan secara langsung dan transparan.
- **Riwayat Prediksi**: Menyimpan riwayat deteksi pengguna yang terautentikasi dan tersinkronisasi ke database.
- **Antarmuka Modern & Responsif**: Dibangun dengan Next.js 15, TailwindCSS 4, Radix UI, dan animasi interaktif dari Framer Motion.

---

## Struktur Folder Proyek

Struktur direktori utama dari aplikasi GiziMeal dirancang sebagai berikut:

```text
gizimeal/
├── src/
│   ├── app/                         # Next.js App Router (Halaman & Rute API)
│   │   ├── (auth)/                  # Rute autentikasi (login, register, reset-password)
│   │   ├── (pages)/                 # Halaman utama aplikasi
│   │   │   ├── about/               # Halaman tentang proyek & tim
│   │   │   ├── calculator/          # Halaman kalkulator BMR/TDEE
│   │   │   ├── chatbot/             # Asisten virtual GiziMeal
│   │   │   ├── docs/                # Halaman dokumentasi teknis
│   │   │   ├── faq/                 # Halaman pertanyaan umum
│   │   │   ├── foods/               # Database pencarian bahan makanan
│   │   │   ├── history/             # Riwayat prediksi/deteksi pengguna
│   │   │   ├── predict/             # Alur utama upload & prediksi gambar
│   │   │   └── referensi/           # Halaman acuan AKG & Permenkes
│   │   ├── api/                     # Rute API internal (Next.js API Routes)
│   │   │   ├── auth/                # API Auth & manajemen sesi
│   │   │   ├── calculator/          # Perhitungan BMR & TDEE
│   │   │   ├── chatbot/             # Integrasi asisten pintar
│   │   │   ├── classes/             # Daftar kelas bahan makanan terdaftar
│   │   │   ├── foods/               # API pencarian dataset gizi bahan makanan
│   │   │   ├── health/              # Cek status kesehatan server backend
│   │   │   ├── history/             # Sinkronisasi riwayat ke database
│   │   │   ├── predict/             # Penghubung ke engine ML untuk deteksi gambar
│   │   │   └── recipe-details/      # Detail nutrisi dan resep rekomendasi
│   │   ├── globals.css              # Styling CSS global menggunakan TailwindCSS 4
│   │   ├── layout.tsx               # Root layout komponen
│   │   └── providers.tsx            # Context provider (theme, toast, auth)
│   ├── components/                  # Komponen UI reusable & modular
│   │   ├── auth/                    # Komponen formulir & proteksi autentikasi
│   │   ├── calculator/              # Komponen form input & visualisasi kalori BMR/TDEE
│   │   ├── chatbot/                 # UI antarmuka chat
│   │   ├── common/                  # Komponen standar (Header, Footer, Disclaimer)
│   │   ├── foods/                   # Komponen tabel & pencarian nutrisi
│   │   ├── layout/                  # Struktur layout navigasi & dashboard
│   │   ├── pages/                   # Modul spesifik per halaman
│   │   ├── prediction/              # Komponen dropzone, preview, & rekomendasi menu
│   │   └── ui/                      # Komponen basis Shadcn UI (button, dialog, tooltip, dll)
│   ├── assets/                      # Media internal & ikon statis
│   ├── data/                        # Dataset referensi & file JSON lokal
│   ├── hooks/                       # Custom React Hooks
│   ├── lib/                         # Konfigurasi pihak ketiga (Supabase Client, Utilities)
│   ├── middleware.ts                # Middleware keamanan & proteksi rute halaman
│   └── types/                       # Definisi tipe data TypeScript (.d.ts)
├── public/                          # Direktori aset statis publik (Gambar Tim, Logo)
├── package.json                     # Konfigurasi dependensi dan skrip proyek
└── tsconfig.json                    # Konfigurasi TypeScript
```

---

## API Endpoints

Aplikasi ini menggunakan API Backend yang di-host di Hugging Face Space (`https://cc26-psu393-gizimeal-api.hf.space` atau `http://localhost:8000` di lingkungan pengembangan lokal). Berikut adalah daftar endpoint eksternal yang tersedia:

### 1. Deteksi & Prediksi
* **`POST /predict`**
  Mengunggah gambar bahan makanan (maksimal 15 file, format JPG/PNG, ukuran maks 1 MB per file) untuk diklasifikasikan jenisnya dan memperoleh estimasi kalorinya serta rekomendasi menu makanan berdasarkan kecocokan bahan.

### 2. Informasi Gizi & Database Makanan
* **`GET /foods`**
  Mengembalikan seluruh koleksi database makanan yang terdaftar beserta rincian kandungan nutrisinya.
* **`GET /foods/search?query={keyword}`**
  Melakukan pencarian nama makanan berdasarkan kata kunci secara parsial.
* **`GET /classes`**
  Menampilkan 15 kelas bahan makanan utama yang didukung oleh model klasifikasi AI.

### 3. Asisten Virtual (Chatbot)
* **`POST /chatbot/ask`**
  Mengirim pesan teks ke chatbot asisten pintar GiziMeal beserta riwayat chat (`history`) sebelumnya untuk mendapatkan respons interaktif tentang nutrisi dan kesehatan.

### 4. Kalkulator BMR & TDEE
* **`POST /calculator/bmr`**
  Menerima parameter tubuh pengguna (usia, berat badan, tinggi badan, jenis kelamin, tingkat aktivitas fisik) untuk menghitung Basal Metabolic Rate (BMR) dan Total Daily Energy Expenditure (TDEE) dengan rumus Mifflin-St Jeor.

### 5. Manajemen Model & Sistem
* **`GET /model/list`**
  Mendapatkan daftar file model kecerdasan buatan (`.keras`) yang tersedia di server.
* **`POST /model/switch`**
  Melakukan pergantian model AI aktif secara dinamis (*hot-swap*) di sisi server backend.
* **`GET /health`**
  Melakukan pengecekan status server backend serta memverifikasi model deep learning termuat dengan benar.

---

## Kebutuhan Sistem

- Node.js versi 18.x atau yang terbaru
- NPM atau Yarn package manager

---

## Petunjuk Setup Environment

1. Clone repositori ini ke komputer lokal Anda.
2. Buat file `.env` di direktori utama proyek dan konfigurasi variabel berikut:

```env
# Backend API URL (Digunakan oleh route handlers server-side)
API_BASE_URL=https://cc26-psu393-gizimeal-api.hf.space

# Supabase Credentials (Client-side & Server-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Cloudflare Turnstile Verification Keys
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
```

3. Instal seluruh dependensi proyek:
```bash
npm install
```

---

## Cara Menjalankan Aplikasi

### Mode Development
Jalankan server lokal dengan perintah:
```bash
npm run dev
```
Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

### Build Produksi
Untuk melakukan build aplikasi siap produksi:
```bash
npm run build
```

### Menjalankan Mode Production
Setelah proses build selesai, jalankan aplikasi dengan perintah:
```bash
npm run start
```
---

## Kontribusi & Tim Pengembang

Proyek ini dibangun oleh tim **CC26-PSU393** pada program Coding Camp 2026 by DBS Foundation:

- **Azharangga Kusuma** (Cohort ID: CACC370D6Y0721) - AI Engineer
- **Putri Nabilla** (Cohort ID: CACC370D6X1171) - AI Engineer
- **Farina Setya Rahesti** (Cohort ID: CDCC796D6X0089) - Data Scientist
- **Mahaputri Buana Devwitasari** (Cohort ID: CDCC796D6X0088) - Data Scientist
- **M. Dava Arya Nada Putra** (Cohort ID: CFCC258D6Y1955) - Frontend Developer
- **Muhammad Ihsanul Dzaky** (Cohort ID: CFCC308D6Y1451) - Backend Developer
