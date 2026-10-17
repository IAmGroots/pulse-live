# DESIGN.md: Pulse

Arah visual untuk landing, demo, editor, dan dokumentasi Pulse. Setiap keputusan di bawah punya alasan satu baris. Jika sebuah keputusan tidak bisa dijelaskan dalam satu baris, keputusan itu belum siap dipakai.

## Design Read

> Reading this as: developer tool landing plus creative editor for chatbot builders and motion designers, in a monochrome minimal language with one lime accent, dial ENERGY 2 / RHYTHM 2 / MOTION 2.

| Dial   | Nilai | Alasan                                                                                           |
| ------ | ----- | ------------------------------------------------------------------------------------------------ |
| ENERGY | 2     | Produk kreatif perlu terasa hidup, tetapi avatar harus tetap jadi fokus, bukan halaman           |
| RHYTHM | 2     | Section boleh berbeda komposisi, tetapi perpindahannya tidak boleh terasa seperti roller coaster |
| MOTION | 2     | Motion mengarahkan perhatian ke avatar dan perubahan state, bukan menghias setiap section        |

## Identitas

| Field       | Nilai                                                          | Alasan                                                                               |
| ----------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Nama produk | Pulse                                                          | Satu kata, mudah diucapkan dalam ID dan EN                                           |
| Wordmark    | `pulse` huruf kecil, Bricolage Grotesque 600, tracking -0.03em | Huruf kecil terasa dekat, bukan korporat, dan cocok dengan blob yang tidak kaku      |
| Mark        | Tidak ada di MVP                                               | Aset logo yang dikarang tanpa keputusan desain lebih berisiko daripada wordmark teks |
| Favicon     | Huruf `P`, Bricolage 600, ink di atas paper                    | Sementara dan jelas, diganti setelah identitas stabil                                |
| Motif       | Chip state berbentuk siluet blob mini yang ikut morph          | Navigasi memakai bentuk produk itu sendiri, bukan ikon generik                       |
| Nada        | Tenang, langsung, teknis secukupnya                            | Audiens developer dan kreator tidak butuh bahasa pemasaran                           |

## Palet

| Token       | Light     | Dark      | Pemakaian                               | Alasan                                                         |
| ----------- | --------- | --------- | --------------------------------------- | -------------------------------------------------------------- |
| `--ink`     | `#0A0A0C` | `#F4F4F5` | Teks utama, siluet avatar               | Hampir hitam dan hampir putih, cukup lembut untuk kanvas besar |
| `--paper`   | `#F9F9F9` | `#0A0A0C` | Latar halaman                           | Putih hangat mengurangi kesan steril                           |
| `--surface` | `#FFFFFF` | `#141417` | Kartu, panel, kanvas                    | Satu tingkat di atas paper, tanpa shadow                       |
| `--line`    | `#E3E3E6` | `#26262B` | Border tipis, pemisah                   | Batas terlihat tanpa menarik perhatian                         |
| `--control` | `#767680` | `#6E6E76` | Border tombol, select, input            | Kontrol butuh 3:1 terhadap latar, pemisah tidak                |
| `--muted`   | `#6B6B70` | `#A1A1A6` | Teks sekunder, caption                  | Lolos AA di kedua tema                                         |
| `--accent`  | `#C6F24E` | `#C6F24E` | CTA utama, state aktif, focus ring dark | Satu aksen yang menandai tindakan, bukan dekorasi              |

### Aturan kontras

| Pasangan               | Rasio                         | Boleh dipakai untuk                    |
| ---------------------- | ----------------------------- | -------------------------------------- |
| Ink di Paper           | 18,79:1                       | Semua teks                             |
| Muted di Paper         | 5,03:1                        | Teks normal dan caption                |
| Muted dark di Ink dark | 7,69:1                        | Teks normal dan caption                |
| Accent di Ink          | 15,27:1                       | Teks dan ikon di dark                  |
| Accent di Paper        | 1,23:1                        | Tidak untuk teks atau ikon garis tipis |
| Control di Surface     | 4,49:1 (light), 3,64:1 (dark) | Border kontrol memenuhi 3:1            |

- Accent tidak pernah menjadi warna teks di light mode.
- CTA utama memakai latar accent dengan teks ink di kedua tema.
- Focus ring memakai ink di light dan accent di dark, supaya selalu minimal 3:1 terhadap latar.
- Setiap pasangan baru diuji dengan `contrast-check.py` sebelum dipakai.

## Tipografi

| Peran   | Font                                                       | Ukuran                                                                      | Alasan                                                                          |
| ------- | ---------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Display | Bricolage Grotesque Variable, self-host, subset latin      | `clamp(2.25rem, 5vw, 4rem)` untuk H1, `clamp(1.5rem, 2.5vw, 2rem)` untuk H2 | Ketidakteraturan halusnya cocok dengan blob dan memberi karakter tanpa dekorasi |
| Body    | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | 1rem, line-height 1.6                                                       | Teks UI tidak bersaing dengan avatar dan tidak menambah unduhan font            |
| Caption | Body, 0.875rem                                             | line-height 1.5                                                             | Cukup kecil untuk metadata, tetap lolos AA                                      |
| Code    | `ui-monospace, SFMono-Regular, Menlo, monospace`           | 0.875rem                                                                    | Hanya untuk snippet, bukan gaya terminal                                        |

- Lebar baris body maksimal 68 karakter.
- Tidak ada uppercase dengan tracking lebar sebagai label section.
- Heading tidak memakai gradient, outline, atau bayangan teks.

## Layout

| Aturan           | Nilai                                                         | Alasan                                                    |
| ---------------- | ------------------------------------------------------------- | --------------------------------------------------------- |
| Lebar konten     | 1120 px maksimum                                              | Cukup untuk editor dua panel dan tetap nyaman dibaca      |
| Grid             | 12 kolom di desktop, 1 kolom di bawah 720 px                  | Reflow mengikuti konten, bukan daftar perangkat           |
| Section padding  | 96 px desktop, 56 px mobile                                   | Ritme bernapas tanpa halaman terasa kosong                |
| Radius kontrol   | 4 px                                                          | Kontrol terasa presisi dan berbeda dari kanvas            |
| Radius permukaan | 12 px                                                         | Kanvas dan kartu terasa seperti satu bidang, bukan kapsul |
| Border           | 1 px `--line`                                                 | Batas jelas tanpa bayangan                                |
| Shadow           | Hanya untuk elemen mengambang: menu, dialog, dan panel editor | Elevasi menandai sesuatu yang benar-benar di atas halaman |
| Glass            | Tidak dipakai                                                 | Tidak ada kebutuhan hierarki yang menuntut blur           |
| Grid background  | Tidak dipakai                                                 | Tidak ada hubungannya dengan identitas produk             |

- Satu focal point per layar. Di landing, focal point adalah avatar. Di editor, focal point adalah kanvas.
- Whitespace dipakai untuk memisahkan kelompok informasi, bukan untuk mengisi sisa ruang.
- Angka, label, dan metadata memakai tabular numerals saat tersedia.

## Komponen

| Komponen        | Bentuk                                                            | Alasan                                                  |
| --------------- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| Tombol primer   | Latar accent, teks ink, radius 4 px, tinggi 44 px                 | Satu-satunya elemen yang memakai accent penuh           |
| Tombol sekunder | Latar transparan, border `--line`, teks ink                       | Aksi pendamping tidak boleh bersaing dengan CTA         |
| Chip state      | Siluet blob mini plus label teks                                  | Motif identitas sekaligus kontrol nyata                 |
| Kartu           | `--surface`, border 1 px, radius 12 px, tanpa shadow              | Kartu mengelompokkan konten, bukan mengambang           |
| Input           | Border 1 px, radius 4 px, fokus ring 2 px                         | Presisi dan jelas saat dipakai keyboard                 |
| Dialog          | `--surface`, radius 12 px, shadow satu lapis, tutup dengan Escape | Satu-satunya tempat shadow dipakai di luar panel editor |
| Toast           | Teks plus ikon status, tanpa warna saja                           | Status harus terbaca tanpa membedakan hue               |
| Code block      | Latar `--surface`, border 1 px, scroll horizontal sendiri         | Snippet tidak boleh memaksa halaman melebar             |

- Tidak ada elemen berbentuk pill massal.
- Ikon dibuat sendiri sebagai SVG inline, tebal 1.5 px, hanya dipakai jika ada makna.
- Tidak ada badge kapsul di atas headline.
- Tidak ada dot status yang berdenyut tanpa state nyata.

## Motion

| Gerakan            | Durasi                                     | Easing                         | Alasan                                                |
| ------------------ | ------------------------------------------ | ------------------------------ | ----------------------------------------------------- |
| Morph state avatar | 300 sampai 550 ms sesuai tabel transisi    | `cubic-bezier(0.4, 0, 0.2, 1)` | Perubahan ekspresi harus terbaca, bukan sekadar cepat |
| Blink              | 120 ms                                     | `ease-in-out`                  | Kedipan alami terasa singkat                          |
| Reveal section     | 240 ms, opacity dan translate 8 px, sekali | `cubic-bezier(0, 0, 0.2, 1)`   | Menandai urutan baca tanpa mengulang animasi          |
| Hover kontrol      | 120 ms                                     | `ease-out`                     | Umpan balik cepat                                     |
| Focus ring         | 0 ms                                       | Tidak ada                      | Fokus harus langsung terlihat                         |
| Theme switch       | 0 ms                                       | Tidak ada                      | Transisi warna global memperlambat dan mengganggu     |

- Motion utama adalah avatar. Elemen lain tidak boleh menari.
- Tidak ada loop tanpa henti pada UI. Idle noise hanya pada avatar dan dipause saat tab hidden.
- `prefers-reduced-motion`: idle noise dan blink dimatikan, transisi morph dipersingkat ke 120 ms, reveal section dihapus.

## Suara Copy

| Aturan                                  | Contoh                                             | Alasan                                        |
| --------------------------------------- | -------------------------------------------------- | --------------------------------------------- |
| CTA menyebut aksi nyata                 | "Coba 14 state", "Salin kode embed", "Buka editor" | Pengunjung tahu apa yang terjadi setelah klik |
| Kalimat pendek, satu ide                | "Tempel satu baris. Avatar langsung hidup."        | Audiens teknis memindai, bukan membaca esai   |
| Tanpa buzzword                          | Bukan "seamless", "AI powered", "next generation"  | Klaim tanpa isi melemahkan kepercayaan        |
| Tanpa em dash                           | Pakai titik, koma, atau tanda kurung               | Em dash adalah penanda tulisan mesin          |
| Tanpa angka palsu                       | Tidak ada "10K+ pengguna" sebelum ada sumber nyata | Kejujuran lebih penting daripada kesan ramai  |
| Bahasa Indonesia dulu, Inggris menyusul | Route `/` untuk ID, `/en` untuk EN                 | Pasar awal berbahasa Indonesia                |

## Aksesibilitas

| Aturan           | Nilai                                                      | Alasan                                           |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| Kontras teks     | AA, 4,5:1 normal, 3:1 besar                                | Standar minimum yang bisa diverifikasi           |
| Kontras non-teks | 3:1 untuk border kontrol dan focus ring                    | Kontrol harus terlihat, bukan hanya bisa diklik  |
| Target sentuh    | 44 x 44 px minimum, jarak minimal 8 px                     | Jempol tidak sepresisi kursor                    |
| Fokus            | `:focus-visible` 2 px, offset 2 px, terlihat di kedua tema | Keyboard harus selalu tahu posisinya             |
| Avatar           | `role="img"`, `<title>`, label state                       | Screen reader perlu tahu ini gambar yang berubah |
| Status           | Teks plus ikon, bukan warna saja                           | Buta warna tidak boleh kehilangan informasi      |
| Zoom             | Layout bertahan di 200 persen                              | Teks harus bisa diperbesar tanpa terpotong       |

## Struktur Halaman

| Section     | Komposisi                                                                 | Alasan                                                |
| ----------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| Hero        | Avatar besar di kanan, teks di kiri, satu CTA primer dan satu tautan repo | Menunjukkan produk bekerja sebelum membaca penjelasan |
| Playground  | Kanvas penuh dengan panel kontrol di samping                              | Kontrol nyata membuktikan produk, bukan video         |
| Morph       | Dua state berdampingan dengan slider dan penjelasan titik                 | Menjawab pertanyaan teknis utama pengunjung           |
| Embed       | Snippet dengan tab HTML, React, npm dan tombol salin                      | Jalur adopsi harus terlihat dalam satu layar          |
| Open source | Lisensi, repo, cara kontribusi                                            | Proyek gratis butuh bukti keterbukaan                 |
| Footer      | Satu baris tautan yang benar-benar ada                                    | Footer tidak perlu empat kolom kosong                 |

## Yang Tidak Dipakai

| Pola                        | Alasan                                                                            |
| --------------------------- | --------------------------------------------------------------------------------- |
| Gradient biru ke ungu       | Tidak ada hubungannya dengan identitas Pulse                                      |
| Glassmorphism               | Tidak ada kebutuhan hierarki yang menuntutnya                                     |
| Bento grid                  | Konten tidak punya ukuran kartu yang berbeda-beda                                 |
| Logo bar "Trusted by"       | Belum ada pengguna nyata untuk ditampilkan                                        |
| Testimonial                 | Belum ada testimonial nyata                                                       |
| Pricing                     | Produk gratis dan open source                                                     |
| "How It Works" tiga langkah | Proses nyata punya lebih dari tiga langkah dan tidak berbentuk lingkaran bernomor |
| Fake terminal               | Produk bukan CLI                                                                  |
| Dot berdenyut               | Tidak menandai state nyata                                                        |
| Emoji dekoratif             | Mengganggu dan tidak menambah makna                                               |
| Statistik tanpa sumber      | Melanggar kejujuran produk                                                        |
