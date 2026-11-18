# UNDERCOVER • Game e Arek-Arek

**UNDERCOVER** adalah game pesta deduksi sosial (*social deduction party game*) modern berbasis *pass-and-play* untuk dimainkan bersama teman dalam satu perangkat smartphone/desktop.

---

## 🌟 Fitur Utama

- **Identitas Visual Premium**: Mengusung tema *Dark Luxury Mystery* (obsidian, royal amethyst, gilded gold) dengan kontras tinggi WCAG AA dan efek partikel cahaya interaktif.
- **Kartu Rahasia 3D Flip**: Pengalaman buka peran interaktif 3D dengan proteksi layar privasi dan tema dinamis untuk *Civilian*, *Undercover*, dan *Mr. White*.
- **Mekanisme Khusus Mr. White**: Jika Mr. White terpilih saat voting eliminasi, diberikan kesempatan terakhir untuk menebak kata rahasia Civilian. Jika tepat, Mr. White langsung memenangkan game!
- **Database Bank Kata Raksasa (1.430+ Pasangan Kata)**:
  - 40 kategori luas (Kuliner Nusantara, Objek Sehari-hari, Alam, Anime, Gaming, Teknologi, Gadget, Profesi, Hubungan/Bucin, Slang Indo, dan Humor Dewasa/18+).
  - Dilengkapi filter kategori, filter kesulitan (*easy, medium, hard*), serta toggle filter khusus *18+ Adult Humor* dan *Slang*.
  - Halaman Administrasi Bank Kata lengkap dengan fitur pencarian, filter, ekspor JSON, dan penambahan kata kustom baru.
- **Audio Synthesizer (Web Audio API)**: Efek suara prosedural tanpa aset audio eksternal: klik taktil, desiran kartu 3D, petikan melodi peran, detak timer, gong eliminasi dramatis, dan keriuhan kemenangan.
- **100% Offline-Ready & PWA**: Dukungan penuh *Web App Manifest*, *standalone display*, dan penyimpanan lokal (*Zustand Persist*) sehingga game dapat dimainkan di mana saja tanpa koneksi internet.

---

## 🚀 Menjalankan Aplikasi

```bash
# Jalankan mode development
npm run dev

# Jalankan production build
npm run build
npm start
```

Akses di browser Anda melalui [http://localhost:3000](http://localhost:3000).

---

## 🎮 Tiga Peran (*Roles*) Permainan

1. **Civilian (Warga Sipil)**: Menerima kata rahasia utama. Beri deskripsi cerdik untuk menemukan penyusup tanpa membantu Mr. White.
2. **Undercover (Penyusup)**: Menerima kata yang serupa namun sedikit berbeda. Cari tahu identitas Anda dan berbaurlah!
3. **Mr. White (Penyusup Buta)**: Tidak mendapatkan kata apa pun. Karang deskripsi Anda dan curi kata Civilian saat tereliminasi untuk meraih kemenangan instan!
