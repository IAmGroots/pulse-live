# Pulse

Avatar SVG yang morph antar state dan bereaksi ke suara, teks, dan event chatbot. Statis, tanpa akun, tanpa backend.

## Dokumen acuan

- `PRD.md`: ruang lingkup, arsitektur, dan keputusan produk.
- `DESIGN.md`: arah visual, token warna, tipografi, motion, dan aturan copy.
- `AGENTS.md`: perintah kerja dan konvensi repo (file ini).

## Perintah

```bash
pnpm install
pnpm dev
pnpm dev:core
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
pnpm size
pnpm bench
pnpm lighthouse
pnpm serve
pnpm format
```

## Struktur

```text
apps/web/               Next.js static export, landing, demo, editor, docs
packages/schema/        tipe project, skema Zod, validasi
packages/presets/       Blip dan Mochi, generator pose, build JSON
packages/core/          morph engine, state machine, renderer, blink, gaze, intensity
packages/overlays/      dots, z, tanda seru, loading arc
packages/drivers/       mic, text, llm (Fase 3 dan 6)
packages/geometry/      parser SVG, resample, align (Fase 4)
packages/react/         wrapper React (Fase 5)
packages/embed/         loader v1.js (Fase 5)
gallery/                galeri statis berbasis pull request (Fase 6)
```

## Konvensi

- TypeScript strict. Tidak ada `any` tanpa alasan yang ditulis di review.
- Tidak ada dependency baru di `packages/core` selain nol. Core harus tetap tanpa dependency.
- Semua teks UI ditulis dalam Bahasa Indonesia dan Inggris. ID adalah default.
- Tidak ada em dash di teks UI, dokumentasi, atau komentar.
- Tidak ada angka, testimonial, atau logo pelanggan yang tidak nyata.
- Tidak ada komentar kode yang menjelaskan hal yang sudah jelas dari kodenya.
- Aset visual baru (logo, avatar, ikon, ilustrasi) harus dikonfirmasi dulu, kecuali sudah ditetapkan di `DESIGN.md`.

## Verifikasi sebelum menyerahkan pekerjaan

1. `pnpm lint`
2. `pnpm build`
3. `pnpm typecheck`
4. `pnpm test`

Untuk perubahan UI, tambahkan:

5. Jalankan `pnpm build && pnpm serve`, lalu klik setiap kontrol yang berubah.
6. Uji tema light dan dark.
7. Uji 360 px, 768 px, dan 1440 px.
8. Uji navigasi keyboard dan focus visible.
9. Jalankan `pnpm e2e` dan `pnpm lighthouse`.
10. Laporkan hasilnya sebagai daftar PASS/FAIL, bukan klaim umum.

## Commit

- Satu commit untuk satu perubahan logis.
- Format: `area: ringkasan` dalam bahasa Indonesia, misalnya `schema: tambah validasi jumlah titik`.
- Jangan commit `dist`, `.next`, `node_modules`, atau file environment.

## Lisensi

Kode MIT, aset CC0. Setiap aset baru harus kompatibel dengan CC0 atau CC BY 4.0.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.opencode/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.opencode/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.opencode/skills/antislop-copywriting/SKILL.md`
- People: `antislop-human`: `.opencode/skills/antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.opencode/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.opencode/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->
