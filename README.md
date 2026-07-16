# NPV Decision — Sistem Pendukung Keputusan Kelayakan Investasi

Aplikasi web untuk menganalisis kelayakan investasi menggunakan metode Net Present Value (NPV).

Fitur utama
- Kalkulator NPV (input modal, discount rate, arus kas per tahun)
- Penyimpanan hasil ke LocalStorage
- Halaman Dashboard: statistik, grafik perbandingan, pie chart
- Comparison: urut berdasarkan NPV, badge `BEST INVESTMENT`
- History: tabel, filter (Semua/Layak/Tidak Layak), cari, export PDF, hapus
- Export laporan proyek ke PDF (jsPDF)
- UI modern responsive menggunakan Tailwind CSS

Stack
- React + Vite
- React Router DOM
- Tailwind CSS
- Recharts (grafik)
- jsPDF (export PDF)
- Lucide React (ikon)

Quick start
1. Install dependencies

```bash
npm install
```

2. Jalankan development server

```bash
npm run dev
```

3. Build produksi

```bash
npm run build
```

Catatan penting
- Tidak ada backend; semua data disimpan di `localStorage` dengan key `npv_projects`.
- Jika ingin mengosongkan data, hapus `localStorage` di DevTools atau panggil `localStorage.removeItem('npv_projects')`.
- Untuk presentasi, jalankan `npm run build` dan sajikan folder `dist`.

File penting
- `src/services/npv.js` — logika perhitungan NPV dan helper LocalStorage
- `src/components` — komponen UI (Sidebar, Navbar, ProjectForm, ResultCard, dsb.)
- `src/pages` — halaman: `Dashboard.jsx`, `Calculator.jsx`, `Comparison.jsx`, `History.jsx`, `About.jsx`

Pengembangan selanjutnya (opsional)
- Optimasi bundle (code-splitting untuk modul berat seperti Recharts)
- Validasi form yang lebih kuat dan input masking untuk mata uang
- Menambahkan tema gelap/terang

Jika mau, saya bisa:
- Tambahkan code-splitting untuk mengurangi ukuran bundle, atau
- Perhalus animasi, atau
- Buat README versi presentasi (slide ringkas dan screenshot).

--
Implementasi oleh tim pengembangan: template tugas SKBM