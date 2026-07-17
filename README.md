# 📊 Sistem Keputusan Berbasis Model — Net Present Value (NPV)

Aplikasi web interaktif untuk analisis kelayakan investasi menggunakan metode **Net Present Value (NPV)**. Dibangun sebagai proyek tugas akhir mata kuliah **Sistem Keputusan Berbasis Model (SKBM)** di Universitas Ahmad Dahlan.

> **Live Demo:** [https://fhikafezya2300016122.github.io/skbm_project/](https://fhikafezya2300016122.github.io/skbm_project/)

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Perhitungan NPV** | Menghitung Net Present Value secara real-time berdasarkan investasi awal, arus kas, dan tingkat diskonto |
| **Multi-Proyek** | Membandingkan beberapa proyek investasi sekaligus dengan sistem ranking otomatis |
| **Profitability Index** | Menampilkan PI (Total PV / Investasi) sebagai metrik pelengkap |
| **Faktor Diskonto** | Menampilkan faktor diskonto `1/(1+r)^t` di setiap tahun untuk transparansi perhitungan |
| **NPV Kumulatif** | Melacak akumulasi NPV per tahun untuk analisis payback |
| **Rekomendasi Otomatis** | Sistem otomatis menilai kelayakan (NPV ≥ 0 = Layak) dan meranking proyek |
| **UI Glassmorphism** | Desain modern dengan efek frosted glass, animasi, dan dark mode |

---

## 🧮 Rumus NPV

```
NPV = -I₀ + Σ (CFₜ / (1 + r)ᵗ)
```

| Simbol | Keterangan |
|---|---|
| `I₀` | Investasi awal |
| `CFₜ` | Arus kas bersih pada tahun ke-t |
| `r` | Tingkat diskonto (dalam desimal) |
| `t` | Periode tahun (1, 2, 3, ...) |

**Kriteria keputusan:**
- **NPV ≥ 0** → Proyek **layak** dijalankan
- **NPV < 0** → Proyek **tidak layak** dijalankan

**Profitability Index (PI):**
```
PI = Total PV Arus Masuk / Investasi Awal
```
- **PI > 1** → Investasi menghasilkan lebih dari biaya modal
- **PI < 1** → Investasi tidak menutupi biaya modal

---

## 🛠️ Tech Stack

- **React 18** — UI library
- **Vite 5** — Build tool & dev server
- **Tailwind CSS 3** — Utility-first CSS framework
- **Vanilla CSS** — Custom glassmorphism design system
- **Inter** — Google Fonts typography

---

## 🚀 Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) versi 16 atau lebih baru
- npm (sudah termasuk dalam Node.js)

### Instalasi

```bash
# Clone repositori
git clone https://github.com/FhikaFezya2300016122/skbm_project.git

# Masuk ke direktori proyek
cd skbm_project

# Instal dependensi
npm install
```

### Development

```bash
# Jalankan server pengembangan
npm run dev
```

Buka [http://localhost:5173/reactjs-website-sederhana/](http://localhost:5173/reactjs-website-sederhana/) di browser.

### Build Production

```bash
# Build untuk produksi
npm run build

# Preview hasil build
npm run preview
```

### Deploy ke GitHub Pages

```bash
npm run deploy
```

---

## 📁 Struktur Proyek

```
skbm_project/
├── public/                     # Aset statis
├── src/
│   ├── components/
│   │   ├── NpvDecisionSystem.jsx   # Komponen utama kalkulator NPV
│   │   ├── Navbar.jsx              # Navigasi
│   │   ├── Footer.jsx              # Footer
│   │   ├── Contact.jsx             # Kontak
│   │   ├── Partners.jsx            # Partner/Tools
│   │   └── Tutors.jsx              # Konsep/Tutors
│   ├── data/                       # Section data components
│   ├── pages/
│   │   └── Home.jsx                # Halaman utama
│   ├── styles/
│   │   ├── NpvDecisionSystem.css   # Glassmorphism design system
│   │   ├── Home.css                # Styles halaman utama
│   │   ├── Navbar.css              # Styles navigasi
│   │   └── ...                     # Styles lainnya
│   ├── App.jsx                     # Root component
│   ├── App.css                     # Global app styles
│   ├── index.css                   # Tailwind + base styles
│   └── main.jsx                    # Entry point
├── index.html                  # HTML template
├── tailwind.config.js          # Konfigurasi Tailwind
├── vite.config.js              # Konfigurasi Vite
├── package.json                # Dependencies & scripts
└── README.md
```

---

## 📖 Cara Penggunaan

1. **Atur Tingkat Diskonto** — Masukkan persentase tingkat diskonto pada bagian Parameter Umum (default: 10%)
2. **Input Data Proyek** — Isi nama proyek, investasi awal, dan arus kas bersih per tahun
3. **Tambah Proyek** — Klik "Tambah Proyek" untuk membandingkan beberapa proyek sekaligus
4. **Tambah Tahun** — Klik "Tambah Tahun" untuk menambah periode arus kas
5. **Lihat Hasil** — Klik "Hitung & Beri Rekomendasi" untuk scroll ke hasil analisis
6. **Baca Rincian** — Buka "Rincian perhitungan tiap proyek" untuk melihat detail faktor diskonto, PV, dan NPV kumulatif per tahun

---

## 👤 Pembuat

**Fhika Fezya** — 2300016122  
Program Studi Informatika  
Universitas Ahmad Dahlan  
Semester 6 — Mata Kuliah SKBM

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik mata kuliah Sistem Keputusan Berbasis Model (SKBM).