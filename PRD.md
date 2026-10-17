# PRD: Pulse, Platform Avatar SVG Morph yang Hidup

|                  |                                                                            |
| ---------------- | -------------------------------------------------------------------------- |
| **Versi**        | 1.1                                                                        |
| **Tanggal**      | 18 Oktober 2026                                                            |
| **Status**       | Keputusan terkunci, siap eksekusi                                          |
| **Nama brand**   | Pulse                                                                      |
| **Inspirasi**    | bloub.vercel.app (avatar SVG animasi, banyak state, tanpa library animasi) |
| **Lisensi**      | MIT untuk kode, CC0 untuk aset                                             |
| **Model produk** | Gratis, open source, tanpa akun, tanpa backend                             |

---

## 1. Ringkasan Eksekutif

Pulse adalah platform web statis untuk membuat, menganimasikan, dan menyematkan **avatar SVG yang bisa berubah bentuk (morph) antar state** dan **bereaksi secara real-time** terhadap suara, teks, dan event chatbot AI.

Situs referensi (bloub) hanya menampilkan satu avatar sebagai demo. Pulse mengubah konsep itu menjadi **alat yang bisa dipakai**: editor morph, driver real-time, dan embed satu baris. Semua berjalan di browser, tanpa server, tanpa akun, dan bisa di-self-host.

**Satu kalimat:** _"Bikin avatar AI yang hidup dalam 10 menit, pasang di mana saja."_

### 1.1 Perubahan pada v1.1

| Area         | v1.0                                           | v1.1                                                             |
| ------------ | ---------------------------------------------- | ---------------------------------------------------------------- |
| Backend      | Supabase untuk auth, project, galeri, analitik | Tidak ada backend, semua statis                                  |
| Akun         | Ada di V2                                      | Dihapus dari semua fase                                          |
| Penyimpanan  | Cloud project                                  | IndexedDB, JSON, share link                                      |
| Avatar       | Satu path                                      | Enam part: body, dua mata, dua alis, mulut                       |
| Karakter MVP | 2-3 preset                                     | 2 preset: Blip dan Mochi                                         |
| Render       | Morph path tunggal                             | Hybrid: morph titik plus animasi aditif (blink, gaze, intensity) |
| Warna        | Belum ditentukan                               | Monokrom plus satu aksen `#C6F24E`                               |
| Kualitas UI  | Tidak diatur                                   | Aturan antislop dan Delivery Gate per fase                       |

---

## 2. Latar Belakang & Masalah

### 2.1 Masalah

1. Membuat morph SVG yang mulus itu sulit. Jumlah titik path tiap bentuk harus sama dan urutannya selaras, kalau tidak hasilnya patah atau berputar aneh.
2. Tool yang ada (Lottie, Rive, After Effects) berat, butuh runtime dan alur kerja desainer, serta tidak punya konsep "emosi" atau "state bicara" yang siap pakai.
3. Developer chatbot dan aplikasi AI belum punya komponen avatar ringan yang tahu kapan AI sedang _mendengar_, _berpikir_, atau _bicara_.
4. Demo seperti bloub membuktikan estetikanya menarik, tetapi tidak bisa dipakai ulang.
5. Solusi yang ada umumnya menuntut akun, langganan, atau backend, padahal kebutuhan awalnya hanya komponen visual.

### 2.2 Peluang

- Maraknya aplikasi chatbot dan voice AI membutuhkan identitas visual yang hidup.
- Pendekatan SVG murni tanpa library animasi berarti ringan, bisa di-style dengan CSS, dan tajam di semua resolusi.
- Proyek open source tanpa backend lebih mudah dipercaya, di-self-host, dan diadopsi developer.
- Avatar berpart wajah (mata, alis, mulut) memberi ekspresi yang jauh lebih kaya daripada satu blob tunggal, dengan biaya runtime yang tetap kecil.

---

## 3. Tujuan & Non-Tujuan

### 3.1 Tujuan

| #   | Tujuan                                                                   | Ukuran                                               |
| --- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| G1  | User membuat avatar custom dan memasangnya di situs sendiri dengan cepat | Median < 10 menit dari buka situs sampai embed aktif |
| G2  | Morph terlihat mulus dan natural                                         | 60fps di HP kelas menengah                           |
| G3  | Player sangat ringan                                                     | < 10 KB gzip, tanpa dependency                       |
| G4  | Avatar bisa dihubungkan ke suara, teks, dan chatbot                      | 3 jenis driver tersedia di V1 dan V2                 |
| G5  | Proyek bisa dipakai, diaudit, dan di-self-host siapa saja                | Lisensi MIT, build statis, tanpa kunci backend       |

### 3.2 Non-Tujuan (di luar cakupan)

- Bukan tool animasi general-purpose seperti After Effects atau Rive.
- Bukan generator avatar 3D atau foto-realistis.
- Bukan platform chatbot. Pulse hanya menyediakan lapisan visual.
- Bukan layanan berlangganan. Tidak ada akun, database, atau pembayaran.
- Tidak menyalin karakter atau IP milik pihak lain (termasuk avatar x.ai).
- Tidak menyediakan hosting project pengguna. Project dibagikan sebagai file atau URL.

---

## 4. Target Pengguna & Persona

### Persona A: "Dev AI App" (primer)

- Membangun chatbot atau voice assistant.
- Butuh komponen avatar siap pakai dengan state `idle`, `listening`, `thinking`, dan `speaking`.
- Menghargai bundle kecil, API sederhana, dan tidak mau menambah dependensi.
- Tidak ingin membuat akun hanya untuk memasang komponen.

### Persona B: "Kreator Konten" (sekunder)

- Membuat video atau live dengan maskot ekspresif.
- Butuh avatar yang bereaksi ke suara mereka tanpa setup rumit.
- Mengutamakan tampilan dan kemudahan, bukan kode.

### Persona C: "Desainer Motion" (sekunder)

- Ingin eksplorasi morph SVG tanpa menulis kode.
- Butuh ekspor ke SVG, CSS, atau komponen React untuk dipakai di proyek lain.

---

## 5. User Stories

| ID    | Sebagai       | Saya ingin                                                       | Agar                                    |
| ----- | ------------- | ---------------------------------------------------------------- | --------------------------------------- |
| US-01 | Pengunjung    | melihat demo avatar yang morph antar state                       | paham nilai produk dalam hitungan detik |
| US-02 | Dev           | memasang avatar dengan satu `<script>` atau komponen React       | tidak perlu membangun animasi sendiri   |
| US-03 | Dev           | mengirim event `thinking` atau `speaking` dari chatbot ke avatar | avatar mencerminkan status AI           |
| US-04 | Kreator       | avatar bergerak mengikuti suara mikrofon saya                    | tampil hidup saat live atau rekaman     |
| US-05 | Desainer      | meng-upload SVG sebagai state baru                               | tidak menggambar ulang dari awal        |
| US-06 | Desainer      | sistem otomatis menyelaraskan titik antar bentuk                 | morph tidak patah                       |
| US-07 | Kreator       | memilih preset karakter dan mengubah warnanya                    | cepat mulai tanpa menggambar            |
| US-08 | Dev           | mengekspor SVG, CSS keyframes, atau komponen React               | bisa dipakai di luar Pulse              |
| US-09 | Pengguna umum | mengaktifkan `prefers-reduced-motion`                            | animasi tidak mengganggu                |
| US-10 | User          | menyimpan project di browser dan mengekspornya sebagai file      | tidak kehilangan pekerjaan tanpa akun   |
| US-11 | User          | membagikan project lewat URL atau file JSON                      | orang lain bisa membuka dan meremix     |
| US-12 | Kontributor   | menjalankan proyek secara lokal dan mengirim pull request        | ikut memperbaiki atau menambah preset   |

---

## 6. Ruang Lingkup Fitur

### 6.1 MVP (P0): "Player & Demo"

| ID   | Fitur               | Deskripsi                                                                                     | Kriteria Penerimaan                                                          |
| ---- | ------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| F-01 | **Morph Player**    | Merender SVG multi-part dan menginterpolasi titik antar state memakai `requestAnimationFrame` | Transisi mulus 60fps; tanpa library animasi                                  |
| F-02 | **State Machine**   | Definisi state, tabel transisi, durasi, easing per pasangan                                   | Perpindahan state via `avatar.setState('thinking')`; retarget tanpa lompatan |
| F-03 | **Preset Avatar**   | Dua karakter orisinal, Blip dan Mochi, masing-masing 14 state dan 6 part                      | Semua state saling bisa bertransisi tanpa glitch; jumlah titik konsisten     |
| F-04 | **Demo Interaktif** | Tombol state, slider intensitas, slider gaze, dan tombol blink di landing page                | Bisa dicoba tanpa login dan tanpa instalasi                                  |
| F-05 | **Idle Motion**     | Breathing dan noise halus saat diam                                                           | Tidak menambah CPU > 5% di desktop; pause saat tab hidden                    |
| F-06 | **Aksesibilitas**   | Dukung `prefers-reduced-motion`, label ARIA, focus visible                                    | Lolos audit Lighthouse a11y >= 95                                            |
| F-07 | **Landing Page**    | Pitch, demo, cuplikan embed, tautan repo, CTA                                                 | Skor Lighthouse performa >= 90                                               |

### 6.2 V1 (P1): "Editor & Live Driver"

| ID   | Fitur                | Deskripsi                                                                          | Kriteria Penerimaan                                           |
| ---- | -------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| F-10 | **Import SVG**       | Upload SVG per state dengan layer bernama, atau auto-detect part                   | Mendukung satu kontur tertutup per part; file maksimal 1 MB   |
| F-11 | **Auto-Normalisasi** | Resample kontur ke N titik per part, samakan titik awal dan arah putaran           | Morph antar dua bentuk bebas tanpa self-intersection mencolok |
| F-12 | **State Composer**   | Susun state, atur transisi dan durasi secara visual                                | Preview real-time; undo/redo; autosave                        |
| F-13 | **Mic Driver**       | Amplitudo suara (Web Audio API) menggerakkan state `speaking` dan intensitas       | Latensi < 100 ms; audio tidak pernah dikirim ke server        |
| F-14 | **Text Driver**      | Teks diklasifikasikan ke emosi (senang, sedih, bingung, netral) lalu memilih state | Akurasi cukup untuk 4 emosi dasar; mapping bisa diatur manual |
| F-15 | **Embed Script**     | `<script src>` plus atribut data, dan paket npm                                    | Berjalan di situs statis dan framework umum tanpa backend     |
| F-16 | **Ekspor**           | SVG statis per state, CSS keyframes, SMIL fallback, komponen React, project JSON   | File valid dan bisa langsung dipakai                          |

### 6.3 V2 (P2): "Ekosistem Tanpa Server"

| ID   | Fitur                 | Deskripsi                                                                                       |
| ---- | --------------------- | ----------------------------------------------------------------------------------------------- |
| F-20 | **LLM Driver**        | Adaptor event streaming (SSE, WebSocket, `ReadableStream`) dengan API key milik user (BYOK)     |
| F-21 | **Galeri Statis**     | `gallery/index.json` plus project JSON, ditambah lewat pull request dan dibangun ulang otomatis |
| F-22 | **Remix**             | Buka project dari galeri atau URL, ubah, lalu simpan sebagai project baru                       |
| F-23 | **Ekspor Lottie**     | Konversi state dan transisi ke Lottie JSON                                                      |
| F-24 | **Analitik Opsional** | Statistik pemuatan dan state terpopuler, hanya jika user memasang analytics sendiri (opt-in)    |
| F-25 | **Tema & Aksesori**   | Warna, bentuk mata, bentuk mulut, dan elemen overlay yang bisa dikustomisasi                    |
| F-26 | **Preset Ketiga**     | Karakter orisinal tambahan setelah dua preset MVP stabil                                        |

---

## 7. Pembeda (Diferensiasi)

| Aspek                         | bloub (referensi) | Lottie / Rive | **Pulse**                |
| ----------------------------- | ----------------- | ------------- | ------------------------ |
| Bisa dipakai ulang            | Tidak (demo)      | Ya            | **Ya**                   |
| Editor bentuk dan morph       | Tidak             | Ya (kompleks) | **Ya, fokus morph blob** |
| Normalisasi titik otomatis    | Tidak             | Manual        | **Otomatis**             |
| Konsep state emosi dan bicara | Tidak             | Tidak bawaan  | **Bawaan**               |
| Driver suara, teks, LLM       | Tidak             | Tidak         | **Ya, dengan BYOK**      |
| Ukuran runtime                | Kecil             | Besar         | **< 10 KB**              |
| Embed satu baris              | Tidak             | Perlu runtime | **Ya**                   |
| Akun atau backend             | Tidak             | Biasanya ya   | **Tidak perlu**          |
| Bisa di-self-host             | Tidak             | Sebagian      | **Ya, statis penuh**     |

**Inti pembeda:** _Morph Studio + Live Driver_, yaitu editor yang menyelaraskan bentuk otomatis dan penggerak real-time yang membuat avatar terasa hidup, tanpa akun dan tanpa server.

---

## 8. Alur Pengguna (User Flow)

### 8.1 Alur Pengunjung ke Embed (V1)

1. Buka landing page, coba demo.
2. Klik **"Coba 14 state"** atau **"Buka editor"**.
3. Pilih preset, atau upload SVG per part.
4. Susun dan sesuaikan state di State Composer.
5. Pilih driver (mikrofon, teks, atau manual).
6. Salin kode embed atau unduh project JSON.
7. Tempel di situs sendiri, avatar aktif tanpa server.

### 8.2 Alur Dev AI App (V1 dan V2)

1. Instal `@pulse-live/core` dan `@pulse-live/drivers`, atau tambahkan script embed.
2. Inisialisasi avatar dengan project JSON atau nama preset.
3. Sambungkan stream respons AI ke `avatar.attachStream(stream)`.
4. Avatar otomatis berpindah state sesuai event.
5. API key LLM disimpan dan dipakai di browser milik user, tidak melewati server Pulse.

### 8.3 Alur Desainer

1. Buka editor, pilih **"Import SVG"**.
2. Upload SVG per state dengan layer bernama, atau biarkan auto-detect.
3. Perbaiki pemetaan part jika perlu.
4. Normalizer menyelaraskan titik, editor menampilkan peringatan self-intersection.
5. Atur transisi dan durasi.
6. Ekspor SVG, CSS, React, atau JSON.

---

## 9. Spesifikasi Teknis

### 9.1 Arsitektur

```text
Static web app (Next.js, output: export)
  |-- Landing, demo, editor, docs
  |-- IndexedDB, JSON export/import, share link
  |
  +-- @pulse-live/core        morph engine, state machine, renderer
  +-- @pulse-live/overlays    dots, z, tanda seru, loading arc
  +-- @pulse-live/drivers     mic, text, llm (BYOK)
  +-- @pulse-live/react       wrapper React
  +-- @pulse-live/embed       loader v1.js untuk <script>
  +-- @pulse-live/geometry    parser SVG, resample, align (editor-only)
  +-- @pulse-live/presets     Blip dan Mochi, plus generator
  +-- @pulse-live/schema      tipe, Zod, migrasi
  |
  +-- gallery/index.json      galeri statis berbasis pull request
```

Tidak ada API route, database, auth, atau environment variable wajib. Deploy bisa Vercel, Cloudflare Pages, GitHub Pages, Netlify, atau server statis sendiri.

### 9.2 Part Avatar

Setiap karakter terdiri dari enam part. Jumlah titik per part konsisten di semua state.

| Part    | Titik | Peran                            | Render                     |
| ------- | ----- | -------------------------------- | -------------------------- |
| `body`  | 64    | Blob utama, morph antar ekspresi | Fill tinta                 |
| `eyeL`  | 16    | Mata kiri                        | Lubang (cutout) atau tinta |
| `eyeR`  | 16    | Mata kanan                       | Lubang (cutout) atau tinta |
| `browL` | 12    | Alis kiri                        | Tinta                      |
| `browR` | 12    | Alis kanan                       | Tinta                      |
| `mouth` | 24    | Mulut, membuka saat bicara       | Lubang (cutout) atau tinta |

Total 144 titik per state. Part yang tidak terlihat di suatu state tetap memiliki jumlah titik yang sama, memakai bentuk degenerate di sekitar posisinya, sehingga transisi tidak pernah kehilangan titik.

### 9.3 Model Data (inti)

```ts
type Point = [number, number];

interface PartDef {
  id: "body" | "eyeL" | "eyeR" | "browL" | "browR" | "mouth" | string;
  role: "body" | "hole" | "ink" | "overlay";
  pointCount: number;
  z: number;
}

interface PartPose {
  points: Point[];
  opacity?: number;
}

interface AvatarState {
  id: string; // "idle", "thinking", "speaking", ...
  parts: Record<string, PartPose>;
  loop?: "breathe" | "pulse" | "dots" | "arc" | "none";
  duration: number; // durasi loop, ms
  morph: number; // durasi transisi default, ms
}

interface Transition {
  from: string;
  to: string;
  duration: number; // ms
  easing: string; // "easeInOut" | "spring" | cubic-bezier(...)
}

interface AvatarProject {
  schemaVersion: 1;
  id: string;
  name: string;
  viewBox: [number, number, number, number];
  renderMode: "cutout" | "layered";
  parts: PartDef[];
  states: AvatarState[];
  transitions: Transition[];
  defaults: { duration: number; easing: string };
  blink: {
    parts: string[];
    interval: [number, number];
    duration: number;
    amount: number;
  };
  intensity: { mouth: string; scaleY: number };
}
```

Aturan validasi:

- Setiap state memiliki semua part yang didefinisikan.
- Jumlah titik setiap part sama dengan `pointCount`.
- Semua koordinat berada di dalam `viewBox` dengan toleransi 1%.
- Tidak ada `NaN`, `Infinity`, atau titik duplikat berurutan.

### 9.4 Algoritma Morph

1. **Resample kontur** ke N titik berjarak sama sepanjang keliling. N default 64 untuk body, 16 untuk mata, 12 untuk alis, 24 untuk mulut.
2. **Selaraskan titik awal:** geser indeks agar jumlah kuadrat jarak antar titik kedua bentuk minimum.
3. **Samakan arah putaran** dengan memeriksa tanda luas poligon (shoelace).
4. **Interpolasi:** `p(t) = p0 + (p1 - p0) * ease(t)` per titik, lalu bangun `d` path memakai Catmull-Rom ke cubic Bezier.
5. **Render cutout:** body sebagai fill, mata dan mulut sebagai subpath dengan `fill-rule="evenodd"`, alis sebagai path tinta terpisah.
6. **Animasi aditif:** blink, gaze, dan intensitas diterapkan sebagai transform pada grup part, bukan sebagai data state.
7. **Idle noise:** perturbasi kecil memakai noise berbasis waktu, di-throttle dan dipause saat tab hidden atau elemen off-screen.
8. **Retarget:** jika state baru diminta saat transisi berjalan, interpolasi dimulai dari posisi saat ini, bukan dari state sebelumnya.

### 9.5 Animasi Aditif

| Animasi   | Cara kerja                                                                                         | Batasan                                              |
| --------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Blink     | `scaleY` mata ke sekitar 0.08 di sekitar garis kelopak, interval acak                              | Dimatikan saat `prefers-reduced-motion`              |
| Gaze      | Translasi mata dan alis, opsional mengikuti kursor                                                 | Maksimal 6% dari lebar viewBox                       |
| Intensity | Bukaan mulut dan pulse body, nilai 0 sampai 1                                                      | Hanya aktif di state `speaking` atau saat driver mic |
| Breathing | Skala body 1 sampai 1.015                                                                          | Pause saat tab hidden                                |
| Overlay   | Titik untuk `thinking`, `z` untuk `sleepy`, `!` untuk `error` dan `surprised`, arc untuk `loading` | Dipisah ke paket overlays                            |

### 9.6 State Machine

- Lookup transisi `from->to`, wildcard `*->to`, lalu default transition.
- Setiap state punya `morph` sebagai durasi default.
- Transisi bisa diinterupsi kapan saja tanpa lompatan visual.
- Event `stateChange` membawa state lama, state baru, dan sumber perubahan (manual, driver, atau stream).
- State `error` dan `loading` tidak pernah dipilih otomatis oleh text driver, hanya oleh driver LLM atau API manual.

### 9.7 API Publik (rancangan)

```ts
const avatar = Pulse.create(element, {
  project, // atau preset: "blip"
  state: "idle",
  pointerTracking: true,
  reducedMotion: "auto",
});

avatar.setState("thinking");
avatar.setIntensity(0.7); // 0..1, misalnya dari amplitudo suara
avatar.setGaze(0.3, -0.2); // x, y dalam rentang -1..1
avatar.blink();
avatar.use(Pulse.drivers.mic()); // aktifkan driver
avatar.use(Pulse.drivers.text({ mapping }));
avatar.attachStream(stream); // LLM driver, BYOK
avatar.on("stateChange", (s) => {});
avatar.pause();
avatar.resume();
avatar.destroy();
```

### 9.8 Embed HTML

```html
<div data-pulse="blip" data-state="idle" data-theme="auto" data-size="md" data-driver="mic"></div>
<script src="https://cdn.jsdelivr.net/npm/@pulse-live/embed@1/dist/v1.js" async></script>
```

Sumber project yang didukung:

| Atribut                                       | Arti                              |
| --------------------------------------------- | --------------------------------- |
| `data-pulse="blip"`                           | Preset bawaan                     |
| `data-pulse="https://contoh.com/avatar.json"` | Project JSON yang di-host sendiri |
| `data-project='{"schemaVersion":1,...}'`      | JSON inline, untuk kasus kecil    |
| `data-theme="auto"`                           | Mengikuti `prefers-color-scheme`  |
| `data-size="sm"`                              | Ukuran tampilan                   |
| `data-driver="mic"`                           | Driver yang langsung aktif        |
| `data-state="thinking"`                       | State awal                        |

Loader memakai Shadow DOM agar CSS situs inang tidak bocor ke avatar, dan sebaliknya.

### 9.9 Penyimpanan & Berbagi

| Kebutuhan                   | Solusi                                               |
| --------------------------- | ---------------------------------------------------- |
| Simpan project              | IndexedDB lewat `idb-keyval`                         |
| Backup dan pindah perangkat | Export dan import file JSON                          |
| Bagikan project             | URL hash terkompresi (`lz-string`), batas 12 KB      |
| Project besar               | File JSON, bukan URL                                 |
| Galeri V2                   | `gallery/index.json` plus pull request               |
| Versioning                  | Riwayat undo di memori, snapshot manual di IndexedDB |

Tidak ada sinkronisasi cloud. Tidak ada data yang meninggalkan browser tanpa tindakan user.

### 9.10 Driver

Interface seragam:

```ts
interface Driver {
  attach(avatar: Avatar): void;
  detach(): void;
}
```

| Driver | Sumber                                 | Pemetaan                                                                                                          |
| ------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Mic    | `getUserMedia` dan `AnalyserNode`, RMS | Senyap ke `listening`, melewati ambang ke `speaking`, intensitas sama dengan amplitudo                            |
| Text   | Kamus ID/EN, tanda baca, emoji         | Positif ke `happy` atau `excited`, negatif ke `sad` atau `angry`, banyak tanda tanya ke `confused` atau `curious` |
| LLM    | `ReadableStream`, SSE, atau WebSocket  | Menunggu token ke `thinking`, token mengalir ke `speaking`, selesai ke `idle`, gagal ke `error`                   |

Aturan mic:

- Kalibrasi noise floor saat driver aktif.
- Hysteresis agar state tidak berkedip di sekitar ambang.
- Attack dan release smoothing.
- Track mikrofon dihentikan saat `detach` atau `destroy`.
- Audio tidak direkam, tidak disimpan, dan tidak dikirim.

### 9.11 Keamanan

- Import SVG hanya mengambil geometri path. Markup tidak pernah dirender sebagai HTML mentah.
- Tolak `script`, atribut `on*`, `foreignObject`, dan referensi eksternal.
- Batas ukuran file 1 MB, jumlah path, dan jumlah titik.
- DOMPurify dipakai sebagai lapisan tambahan di client.
- CSP ketat di web app.
- Tidak ada upload ke server, sehingga tidak ada penyimpanan file user di infrastruktur Pulse.
- LLM driver memakai API key milik user dan tidak melewati proxy Pulse.

### 9.12 Stack

| Lapisan          | Pilihan                                                                      |
| ---------------- | ---------------------------------------------------------------------------- |
| Web app          | Next.js App Router, static export, TypeScript strict                         |
| Styling          | Tailwind CSS v4, Radix primitives                                            |
| Ikon             | SVG inline buatan sendiri, bukan library ikon default                        |
| Font             | Bricolage Grotesque Variable (heading), system UI (body), system mono (kode) |
| i18n             | next-intl, ID default, EN di `/en`                                           |
| Editor state     | Zustand, zundo, idb-keyval                                                   |
| Validasi         | Zod di paket schema                                                          |
| Core player      | TypeScript murni, tsup, tanpa dependency                                     |
| Geometry         | `svg-pathdata`, hanya di paket geometry                                      |
| Audio            | Web Audio API (`AnalyserNode`)                                               |
| Klasifikasi teks | Kamus lokal ID/EN, tanpa panggilan API                                       |
| Docs             | MDX di app yang sama                                                         |
| Testing          | Vitest, fast-check, Playwright, axe, Lighthouse CI, size-limit               |
| Monorepo         | pnpm workspace, Turborepo                                                    |
| Rilis            | Changesets, GitHub Actions                                                   |
| Hosting          | Static export di Vercel, Cloudflare Pages, GitHub Pages, atau self-host      |
| Embed            | npm dan jsDelivr                                                             |

### 9.13 Budget Performa

| Komponen                | Budget                     |
| ----------------------- | -------------------------- |
| `@pulse-live/core`      | < 10 KB gzip               |
| `@pulse-live/overlays`  | < 1,5 KB gzip              |
| Mic driver              | < 2 KB gzip                |
| Text driver             | < 3 KB gzip                |
| Embed loader            | < 1,5 KB gzip              |
| JavaScript awal landing | < 150 KB gzip              |
| TTI landing di 4G       | < 2,5 detik                |
| Frame rate              | 60fps di HP kelas menengah |

---

## 10. Persyaratan Non-Fungsional

| Kategori       | Persyaratan                                                                               |
| -------------- | ----------------------------------------------------------------------------------------- |
| Performa       | 60fps di HP kelas menengah; TTI landing < 2,5 detik di 4G; pause saat tab hidden          |
| Ukuran         | Core player < 10 KB gzip; overlays dan driver dipisah                                     |
| Kompatibilitas | Chrome, Safari, Firefox, Edge terbaru; iOS Safari dan Android Chrome                      |
| Aksesibilitas  | `prefers-reduced-motion`, kontras AA, kontrol keyboard, focus visible, label ARIA         |
| Privasi        | Audio mikrofon diproses lokal; tidak ada telemetri default; tidak ada data keluar browser |
| Keamanan       | Sanitasi SVG, CSP, batas ukuran file, tanpa render HTML mentah                            |
| i18n           | Antarmuka Bahasa Indonesia dan Inggris, ID sebagai default                                |
| SEO            | Meta, Open Graph, canonical, sitemap, robots untuk landing dan docs                       |
| Offline        | Landing dan editor bisa dimuat ulang dari cache setelah kunjungan pertama                 |
| Self-host      | Build statis tanpa environment variable wajib                                             |
| Lisensi        | Kode MIT, aset CC0, tanpa watermark                                                       |

---

## 11. Desain & Pengalaman

### 11.1 Arah Desain

**Design Read:** landing dan editor untuk developer chatbot serta kreator, gaya monokrom minimal dengan satu aksen lime, dial **ENERGY 2 / RHYTHM 2 / MOTION 2**.

| Dial   | Nilai | Alasan                                                           |
| ------ | ----- | ---------------------------------------------------------------- |
| ENERGY | 2     | Cukup tegas untuk produk kreatif, tidak sampai ramai             |
| RHYTHM | 2     | Section punya variasi komposisi, tetapi tetap tenang             |
| MOTION | 2     | Motion mengarahkan perhatian ke avatar, bukan ke seluruh halaman |

### 11.2 Token Warna & Kontras

| Token  | Light     | Dark      | Pemakaian                               |
| ------ | --------- | --------- | --------------------------------------- |
| Ink    | `#0A0A0C` | `#F4F4F5` | Teks utama, siluet avatar               |
| Paper  | `#F9F9F9` | `#0A0A0C` | Latar halaman                           |
| Muted  | `#6B6B70` | `#A1A1A6` | Teks sekunder                           |
| Accent | `#C6F24E` | `#C6F24E` | CTA utama, state aktif, focus ring dark |

Pasangan yang sudah dihitung:

| Pasangan               | Rasio   | Keputusan                         |
| ---------------------- | ------- | --------------------------------- |
| Ink di Paper           | 18,79:1 | Lolos untuk semua teks            |
| Muted di Paper         | 5,03:1  | Lolos AA untuk teks normal        |
| Muted dark di Ink dark | 7,69:1  | Lolos AA untuk teks normal        |
| Accent di Ink          | 15,27:1 | Boleh untuk teks dan ikon di dark |
| Accent di Paper        | 1,23:1  | Tidak boleh untuk teks di light   |

Aturan pakai aksen:

- CTA utama memakai latar accent dengan teks ink di kedua tema.
- Accent tidak dipakai sebagai warna teks di light mode.
- Focus ring memakai ink di light dan accent di dark.
- Aksen dibatasi ke CTA utama, state aktif, dan focus ring dark.

### 11.3 Tipografi

| Peran   | Font                                                       | Alasan                                                                          |
| ------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Display | Bricolage Grotesque Variable, self-host, subset latin      | Ketidakteraturan halusnya cocok dengan blob dan memberi karakter tanpa dekorasi |
| Body    | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | Teks UI tidak bersaing dengan avatar dan tidak menambah unduhan font            |
| Code    | `ui-monospace, SFMono-Regular, Menlo, monospace`           | Hanya untuk snippet, bukan gaya terminal                                        |

Aturan:

- Heading memakai `clamp()` agar tidak pecah di layar sempit.
- Line length body maksimal 68 karakter.
- Tidak ada uppercase dengan tracking lebar sebagai label section.

### 11.4 Logo & Favicon

- Wordmark: teks `pulse` huruf kecil, Bricolage Grotesque 600, tracking -0.03em, warna ink.
- Tidak ada mark atau simbol terpisah di MVP.
- Favicon sementara: huruf `P` dari Bricolage 600, ink di atas paper.
- Favicon final diputuskan setelah identitas visual stabil.

### 11.5 Motif & Motion

- **Motif identitas:** chip state berbentuk siluet blob mini yang ikut morph saat state berubah. Motif ini menghubungkan navigasi dengan produk, bukan dekorasi.
- Motion utama adalah avatar itu sendiri. Reveal section minimal dan tidak berulang.
- Tidak ada pulse tanpa henti pada elemen UI. Titik status hanya muncul jika menandai state nyata.
- `prefers-reduced-motion` mematikan idle noise dan blink, serta mempersingkat transisi.

### 11.6 Struktur Landing

| Urutan | Section                                             | Alasan isi                                      |
| ------ | --------------------------------------------------- | ----------------------------------------------- |
| 1      | Hero dengan avatar hidup dan CTA                    | Menunjukkan produk bekerja dalam hitungan detik |
| 2      | Playground state, intensity, gaze, blink            | Membuktikan kontrol nyata, bukan video          |
| 3      | Penjelasan morph dan normalisasi titik              | Menjawab masalah teknis utama pengguna          |
| 4      | Embed HTML, React, dan npm                          | Menunjukkan jalur adopsi nyata                  |
| 5      | Open source: lisensi, repo, cara kontribusi         | Kepercayaan untuk proyek gratis                 |
| 6      | Footer satu baris: Docs, GitHub, License, Changelog | Navigasi sesuai isi yang benar-benar ada        |

Tidak ada testimonial, pricing, logo bar, bento grid, fake terminal, atau "How It Works" tiga langkah.

### 11.7 Aturan Copy

- CTA spesifik: "Coba 14 state", "Salin kode embed", "Buka editor", "Lihat kode sumber".
- Tanpa em dash, tanpa buzzword, tanpa klaim keamanan atau performa yang belum terbukti.
- Tanpa statistik, testimonial, atau logo pelanggan yang tidak nyata.
- Copy ditulis dalam ID dan EN, dengan ID sebagai default.
- Setiap section harus punya alasan isi, bukan karena template.

### 11.8 Aksesibilitas & Mobile

- Avatar punya `role="img"`, `<title>`, dan label state yang bisa dibaca screen reader.
- Semua pasangan warna diuji dengan alat kontras, bukan dikira-kira.
- Focus ring terlihat di kedua tema dengan kontras minimal 3:1.
- Target sentuh minimal 44 x 44 px dengan jarak antar target.
- Tidak ada overflow horizontal di 360 px, 768 px, 1024 px, dan 1440 px.
- Code block memakai scroll container sendiri.
- Editor penuh diprioritaskan desktop, tetapi demo dan embed nyaman di layar kecil.
- Tema light dan dark sama-sama berfungsi penuh, termasuk focus dan state aktif.

---

## 12. Metrik Keberhasilan

| Metrik                           | Target 3 bulan pasca-launch | Cara ukur                                                     |
| -------------------------------- | --------------------------- | ------------------------------------------------------------- |
| Waktu ke embed pertama (median)  | < 10 menit                  | Uji moderat dengan 5 developer                                |
| Avatar dibuat per minggu         | 200+                        | Tidak diukur tanpa analytics; dipakai sebagai target internal |
| Embed aktif                      | 100+ situs                  | Tidak diukur secara default; hanya dari laporan pengguna      |
| Retensi minggu ke-4 (pembuat)    | >= 20%                      | Tidak diukur tanpa analytics                                  |
| Skor Lighthouse performa landing | >= 90                       | Lighthouse CI                                                 |
| Bounce rate landing              | < 55%                       | Hanya jika analytics opt-in dipasang                          |
| Bintang GitHub                   | 100+                        | API GitHub publik                                             |

Catatan: proyek ini tidak memasang telemetri default. Metrik yang membutuhkan data pengguna ditandai sebagai target internal atau hanya diukur lewat analytics opt-in. Angka tidak dilaporkan sebagai fakta jika tidak ada sumber nyata.

---

## 13. Rencana Rilis (Roadmap)

| Fase                    | Durasi       | Deliverable                                                                  | Exit criteria                                       |
| ----------------------- | ------------ | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| 0. Fondasi & desain     | 1-1,5 minggu | Monorepo, CI, `DESIGN.md`, schema, generator preset, Blip dan Mochi 14 state | Build hijau, 28 state valid, jumlah titik konsisten |
| 1. Core engine          | 1,5-2 minggu | Morph multi-part, state machine, blink, gaze, intensity, overlay             | 14 state mulus, 60fps, core < 10 KB                 |
| 2. Landing & demo       | 4-5 hari     | Landing ID/EN, playground, embed snippet                                     | **MVP publik**, Lighthouse 90/95                    |
| 3. Live driver          | 1-2 minggu   | Mic driver, text driver, playground driver                                   | Latensi < 100 ms, 4 emosi, audio lokal              |
| 4. Editor & normalisasi | 2,5-3 minggu | Import SVG, normalizer, face layout, composer, undo/redo, autosave           | 5 SVG uji berhasil, morph bersih                    |
| 5. Embed & ekspor       | 1 minggu     | `v1.js`, paket npm, ekspor SVG/CSS/SMIL/React, docs                          | **V1**, embed satu baris berjalan                   |
| 6. V2                   | 4-6 minggu   | LLM driver, galeri statis, Lottie, tema, analytics opt-in                    | Publish, embed, galeri tanpa server                 |

**Total estimasi:** MVP sekitar 3,5-4,5 minggu, V1 sekitar 9-11 minggu untuk kerja solo penuh waktu. Kerja paruh waktu bisa 1,5-2x lebih lama.

---

## 14. Risiko & Mitigasi

| Risiko                                      | Dampak | Mitigasi                                                                                    |
| ------------------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| Morph patah karena kontur tidak selaras     | Tinggi | Algoritma align dan arah putaran; batasi ke kontur tertutup sederhana; peringatan di editor |
| Bentuk kompleks (berlubang, banyak kontur)  | Sedang | V1 hanya satu kontur luar per part; dukungan lubang masuk V2                                |
| Wajah terlihat bergeser saat body morph     | Sedang | Batasi deformasi body; uji visual per state; posisi wajah disimpan absolut                  |
| Blink dan intensity bentrok dengan transisi | Sedang | Jadikan animasi aditif di layer transform, bukan bagian data state                          |
| Core membengkak karena enam part            | Sedang | Overlay dan driver dipisah; size-limit sebagai gate                                         |
| Masalah IP (meniru avatar yang sudah ada)   | Tinggi | Karakter orisinal; kebijakan konten untuk upload user                                       |
| Performa buruk di HP lama                   | Sedang | Batasi jumlah titik; throttle idle noise; mode hemat daya                                   |
| Upload SVG berbahaya (XSS)                  | Tinggi | Parsing geometry-only, whitelist, sanitasi, CSP                                             |
| Akurasi emosi dari teks rendah              | Sedang | Mapping manual; tampilkan sebagai opsi, bukan kewajiban                                     |
| Share URL terlalu panjang                   | Rendah | Batas 12 KB, fallback file JSON                                                             |
| Galeri statis kurang dinamis                | Rendah | Build ulang otomatis saat pull request merge                                                |
| Aksen lime tersebar terlalu banyak          | Rendah | Batasi ke CTA, state aktif, dan focus ring dark; audit di Delivery Gate                     |
| Pasar kecil di awal                         | Sedang | Mulai dari komunitas dev dan kreator; embed gratis tanpa watermark                          |

---

## 15. Lisensi, Open Source, dan Keberlanjutan

- **Kode:** MIT.
- **Aset preset:** CC0 agar aman untuk remix dan penggunaan komersial.
- **Tanpa watermark.** Badge "Powered by Pulse" opsional dan default mati.
- **Repo publik** dengan `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, issue template, dan GitHub Discussions.
- **Self-host guide:** Vercel, Cloudflare Pages, GitHub Pages, Netlify, Docker.
- **Rilis npm** lewat Changesets, dengan CI lint, typecheck, test, build, size, dan Lighthouse.
- **Keberlanjutan:** tidak ada paket berbayar pada MVP dan V1. Jika proyek tumbuh, dana bisa datang dari sponsor, donasi, atau jasa kustomisasi, tanpa mengunci fitur inti.
- **Analitik:** tidak ada secara default. Jika dipasang, harus opt-in dan privacy-friendly.

---

## 16. Pertanyaan Terbuka

1. Nama scope npm final. Sementara memakai `@pulse-live/*`; perlu dicek ketersediaannya sebelum publish di Fase 5.
2. Karakter ketiga (F-26): blob minimalis lain, atau maskot dengan tema lokal?
3. Prioritas ekspor Lottie: setelah galeri, atau lebih awal jika ada permintaan pengguna?
4. Moderasi galeri statis: cukup review pull request manual, atau perlu panduan konten tertulis?

---

## 17. Lampiran

### 17.1 Daftar State Awal

Empat belas state untuk setiap karakter:

`idle`, `listening`, `thinking`, `speaking`, `happy`, `sad`, `confused`, `surprised`, `sleepy`, `excited`, `angry`, `curious`, `error`, `loading`

### 17.2 Pemetaan Driver ke State

| Sumber     | Kondisi                   | State                                        |
| ---------- | ------------------------- | -------------------------------------------- |
| Mic        | Amplitudo di bawah ambang | `idle` atau `listening`                      |
| Mic        | Amplitudo di atas ambang  | `speaking`, intensitas sama dengan amplitudo |
| Text       | Sentimen positif          | `happy` atau `excited`                       |
| Text       | Sentimen negatif          | `sad` atau `angry`                           |
| Text       | Banyak tanda tanya        | `confused` atau `curious`                    |
| LLM stream | Menunggu token pertama    | `thinking`                                   |
| LLM stream | Token mengalir            | `speaking`                                   |
| LLM stream | Error                     | `error`                                      |

### 17.3 Tabel Kontras

| Pasangan                                   | Rasio   | Normal (4,5:1) | Besar (3:1) |
| ------------------------------------------ | ------- | -------------- | ----------- |
| Ink `#0A0A0C` di Paper `#F9F9F9`           | 18,79:1 | Lolos          | Lolos       |
| Muted `#6B6B70` di Paper `#F9F9F9`         | 5,03:1  | Lolos          | Lolos       |
| Muted dark `#A1A1A6` di Ink dark `#0A0A0C` | 7,69:1  | Lolos          | Lolos       |
| Accent `#C6F24E` di Ink `#0A0A0C`          | 15,27:1 | Lolos          | Lolos       |
| Accent `#C6F24E` di Paper `#F9F9F9`        | 1,23:1  | Gagal          | Gagal       |

### 17.4 Keputusan v1.1

| #   | Keputusan                                      | Alasan                                                                  |
| --- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | Tanpa Supabase dan tanpa auth                  | Kebutuhan inti hanya komponen visual; backend menambah biaya dan friksi |
| 2   | Dua karakter: Blip dan Mochi                   | Cukup untuk menunjukkan variasi tanpa memperlambat MVP                  |
| 3   | Enam part termasuk alis                        | Ekspresi lebih kaya dengan biaya runtime kecil                          |
| 4   | Hybrid engine: morph titik plus animasi aditif | Blink dan bicara tidak perlu mengubah data state                        |
| 5   | Render cutout sebagai default                  | Satu path tiap part, ukuran kecil, tetap mendukung mode layered         |
| 6   | Monokrom plus aksen `#C6F24E`                  | Identitas tegas dengan risiko slop rendah                               |
| 7   | Bricolage Grotesque untuk heading              | Karakter visual cocok dengan blob, bukan font default AI                |
| 8   | Wordmark teks, favicon `P` sementara           | Menghindari aset logo yang dikarang tanpa keputusan desain              |
| 9   | MIT dan CC0                                    | Adopsi maksimal untuk proyek gratis dan open source                     |
| 10  | Static export                                  | Tanpa server, murah, dan bisa di-self-host                              |

### 17.5 Quality Gate (antislop)

Setiap fase yang menghasilkan UI harus lulus gate berikut sebelum diserahkan:

| Blok          | Isi                                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Hard Gate     | Tanpa em dash, tanpa statistik atau testimonial palsu, tanpa link mati, kontras AA, keyboard, state kosong/loading/error, tema light dan dark |
| Purpose Gate  | Setiap gradient, shadow, glow, ikon, dan animasi punya alasan tertulis                                                                        |
| Liveliness    | Dial dinyatakan, satu focal point per layar, aksen di momen kunci, motif blob konsisten                                                       |
| Craftsmanship | Setiap section punya alasan isi, CTA spesifik, tanpa pola template AI                                                                         |
| Verifikasi    | Build dijalankan, setiap kontrol diklik, hasilnya dicatat sebagai bukti                                                                       |

Perintah verifikasi:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm size
pnpm lighthouse
pnpm playwright
```

### 17.6 Referensi

- Situs inspirasi: https://bloub.vercel.app/
- Web Animations API, SVG path, Web Audio API (MDN)
- WCAG 2.2, kontras dan target sentuh
- antislop core dan skill UI, copywriting, human, layout mobile
