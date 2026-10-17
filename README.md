# Pulse

Avatar SVG yang morph antar state dan bereaksi ke suara, teks, dan event chatbot. Statis, tanpa akun, tanpa backend.

Status: Fase 2, landing dan demo publik.

## Menjalankan

```bash
pnpm install
pnpm dev
```

Web app berjalan di `http://localhost:3000`. Demo internal core berjalan di `http://localhost:5180` dengan `pnpm dev:core`.

## Perintah

```bash
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

`pnpm serve` menyajikan hasil build statis di `http://127.0.0.1:4321`. `pnpm e2e` dan `pnpm lighthouse` memakai server itu.

## Environment

Satu variabel opsional, dibaca dari `apps/web`:

| Variabel               | Wajib | Isi                                                                        |
| ---------------------- | ----- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Tidak | URL absolut tanpa trailing slash, misalnya `https://pulse-live.vercel.app` |

Perilaku:

- Kosong: canonical, `og:url`, dan hreflang absolut tidak ditulis. Build tetap valid.
- Berisi localhost pada build produksi: nilainya diabaikan, supaya HTML hasil build tidak pernah membawa alamat lokal.
- Berisi domain nyata: canonical, `og:url`, dan hreflang absolut ditulis.

Variabel ini di-inline saat build. Setelah mengubah nilainya, jalankan `pnpm build` lagi.

Untuk pengembangan lokal, salin `apps/web/.env.example` menjadi `apps/web/.env.local` hanya jika ingin menguji canonical dengan localhost. Berkas `.env.local` tidak di-commit.

## Checklist deploy

1. Set `NEXT_PUBLIC_SITE_URL=https://domain-final.tld` di environment hosting atau CI.
2. Jalankan `pnpm build`.
3. Pastikan `apps/web/out/index.html` memuat `rel="canonical"` dan `og:url` dengan domain final, dan tidak memuat localhost.
4. Jalankan `pnpm e2e` dan `pnpm lighthouse`.

## Struktur

```text
apps/web/               Next.js static export, landing ID/EN, demo
apps/web/e2e/           Playwright: kontrol, tema, keyboard, 360 px, reduced motion
packages/schema/        tipe dan skema Zod untuk project avatar
packages/presets/       Blip dan Mochi, generator pose, build JSON
packages/core/          morph engine, state machine, renderer, blink, gaze, intensity
packages/overlays/      dots, z, tanda seru, loading arc
```

## API core

```ts
import { create } from "@pulse-live/core";
import { overlays } from "@pulse-live/overlays";

const avatar = create(element, { project, state: "idle", pointerTracking: true });
avatar.onFrame(overlays());
avatar.setState("thinking");
avatar.setIntensity(0.6);
avatar.setGaze(0.3, -0.2);
avatar.destroy();
```

## Dokumen

- `PRD.md`: ruang lingkup dan keputusan produk.
- `DESIGN.md`: arah visual dan aturan UI.
- `AGENTS.md`: konvensi kerja repo.

## Lisensi

Kode MIT. Aset CC0.
