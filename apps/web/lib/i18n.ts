export type Locale = "id" | "en";

export interface LicenseItem {
  title: string;
  body: string;
}

export interface Messages {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  a11y: {
    skip: string;
    nav: string;
    footerNav: string;
    avatar: string;
    code: string;
  };
  nav: {
    demo: string;
    morph: string;
    embed: string;
    license: string;
  };
  lang: {
    switch: string;
    label: string;
  };
  theme: {
    toDark: string;
    toLight: string;
    darkLabel: string;
    lightLabel: string;
  };
  hero: {
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
    note: string;
  };
  demo: {
    title: string;
    subtitle: string;
    preset: string;
    state: string;
    intensity: string;
    blink: string;
    pause: string;
    resume: string;
    hint: string;
    loading: string;
    loadError: string;
    retry: string;
  };
  morph: {
    title: string;
    subtitle: string;
    from: string;
    to: string;
    progress: string;
    play: string;
    points: string;
    note: string;
  };
  embed: {
    title: string;
    subtitle: string;
    status: string;
    tabs: {
      api: string;
      react: string;
      embed: string;
    };
    planned: string;
    copy: string;
    copied: string;
    copyError: string;
  };
  license: {
    title: string;
    subtitle: string;
    items: LicenseItem[];
    status: string;
  };
  footer: {
    license: string;
  };
}

const id: Messages = {
  meta: {
    title: "Pulse, avatar SVG yang berubah bentuk",
    description:
      "Avatar SVG dengan 14 state yang morph dan bereaksi ke suara, teks, dan event chatbot. MIT, tanpa akun, tanpa backend.",
    ogAlt: "Wordmark pulse dan avatar Blip di atas latar terang",
  },
  a11y: {
    skip: "Lewati ke konten",
    nav: "Navigasi utama",
    footerNav: "Navigasi footer",
    avatar: "Avatar Blip",
    code: "Contoh kode",
  },
  nav: {
    demo: "Demo",
    morph: "Morph",
    embed: "Kode",
    license: "Lisensi",
  },
  lang: {
    switch: "EN",
    label: "Baca dalam bahasa Inggris",
  },
  theme: {
    toDark: "Gelap",
    toLight: "Terang",
    darkLabel: "Aktifkan tema gelap",
    lightLabel: "Aktifkan tema terang",
  },
  hero: {
    title: "Satu avatar SVG, empat belas ekspresi.",
    subtitle:
      "Blip dan Mochi morph antar state, berkedip, melihat kursor, dan membuka mulut saat bicara. Semua dari satu file JSON dan satu elemen.",
    primary: "Coba 14 state",
    secondary: "Baca lisensi",
    note: "MIT untuk kode, CC0 untuk aset. Tanpa akun, tanpa backend.",
  },
  demo: {
    title: "Semua state, satu kontrol.",
    subtitle:
      "Pilih state, atur intensitas, dan lihat morph berjalan di browser. Tidak ada video di halaman ini.",
    preset: "Karakter",
    state: "State",
    intensity: "Intensitas",
    blink: "Kedip",
    pause: "Jeda",
    resume: "Lanjut",
    hint: "Gerakkan kursor di atas avatar untuk mengubah arah pandang.",
    loading: "Memuat karakter",
    loadError: "Karakter gagal dimuat. Muat ulang halaman.",
    retry: "Muat ulang",
  },
  morph: {
    title: "Titik yang sama, bentuk yang berbeda.",
    subtitle:
      "Setiap state punya 144 titik: 64 untuk body, 16 per mata, 12 per alis, dan 24 untuk mulut. Transisi menginterpolasi titik itu, bukan menukar gambar.",
    from: "Dari",
    to: "Ke",
    progress: "Progres",
    play: "Putar transisi",
    points: "144 titik per state",
    note: "Titik awal dan arah putaran sudah diselaraskan saat preset dibangun, jadi tidak ada lompatan saat state berganti.",
  },
  embed: {
    title: "Pakai di proyek sendiri.",
    subtitle: "API-nya satu objek. Buat avatar, kirim state, atur intensitas.",
    status:
      "Paket npm dan CDN terbit di Fase 5. Contoh di bawah memakai API yang sudah berjalan di repo ini.",
    tabs: { api: "API", react: "React", embed: "Embed" },
    planned: "Rencana Fase 5",
    copy: "Salin",
    copied: "Tersalin",
    copyError: "Gagal menyalin",
  },
  license: {
    title: "Gratis, terbuka, bisa di-self-host.",
    subtitle: "Tidak ada akun, database, atau telemetri. Build menghasilkan folder statis.",
    items: [
      { title: "Kode MIT", body: "Pakai, ubah, dan jual ulang selama lisensi dibawa." },
      { title: "Aset CC0", body: "Blip dan Mochi boleh dipakai tanpa atribusi." },
      {
        title: "Hosting statis",
        body: "Vercel, Cloudflare Pages, GitHub Pages, atau server sendiri.",
      },
    ],
    status:
      "Repo publik dan paket npm menyusul. Sampai saat itu, jalankan dari repo lokal dengan pnpm build.",
  },
  footer: {
    license: "MIT + CC0",
  },
};

const en: Messages = {
  meta: {
    title: "Pulse, an SVG avatar that changes shape",
    description:
      "An SVG avatar with 14 morphing states that reacts to voice, text, and chatbot events. MIT, no account, no backend.",
    ogAlt: "pulse wordmark and the Blip avatar on a light background",
  },
  a11y: {
    skip: "Skip to content",
    nav: "Main navigation",
    footerNav: "Footer navigation",
    avatar: "Blip avatar",
    code: "Code sample",
  },
  nav: {
    demo: "Demo",
    morph: "Morph",
    embed: "Code",
    license: "License",
  },
  lang: {
    switch: "ID",
    label: "Read in Indonesian",
  },
  theme: {
    toDark: "Dark",
    toLight: "Light",
    darkLabel: "Switch to the dark theme",
    lightLabel: "Switch to the light theme",
  },
  hero: {
    title: "One SVG avatar, fourteen expressions.",
    subtitle:
      "Blip and Mochi morph between states, blink, follow the cursor, and open their mouth when speaking. All from one JSON file and one element.",
    primary: "Try 14 states",
    secondary: "Read the license",
    note: "MIT for code, CC0 for assets. No account, no backend.",
  },
  demo: {
    title: "Every state, one control.",
    subtitle:
      "Pick a state, set intensity, and watch the morph run in your browser. No video on this page.",
    preset: "Character",
    state: "State",
    intensity: "Intensity",
    blink: "Blink",
    pause: "Pause",
    resume: "Resume",
    hint: "Move the cursor over the avatar to change its gaze.",
    loading: "Loading character",
    loadError: "Character failed to load. Reload the page.",
    retry: "Reload",
  },
  morph: {
    title: "Same points, different shape.",
    subtitle:
      "Each state has 144 points: 64 for the body, 16 per eye, 12 per brow, and 24 for the mouth. Transitions interpolate those points instead of swapping images.",
    from: "From",
    to: "To",
    progress: "Progress",
    play: "Play transition",
    points: "144 points per state",
    note: "Start point and winding are aligned when the preset is built, so states never jump.",
  },
  embed: {
    title: "Use it in your own project.",
    subtitle: "The API is one object. Create an avatar, send a state, set intensity.",
    status:
      "The npm package and CDN ship in Phase 5. The examples below use the API that already runs in this repo.",
    tabs: { api: "API", react: "React", embed: "Embed" },
    planned: "Planned for Phase 5",
    copy: "Copy",
    copied: "Copied",
    copyError: "Copy failed",
  },
  license: {
    title: "Free, open, self-hostable.",
    subtitle: "No account, database, or telemetry. The build outputs a static folder.",
    items: [
      { title: "MIT code", body: "Use, change, and resell it as long as the license travels." },
      { title: "CC0 assets", body: "Blip and Mochi can be used without attribution." },
      {
        title: "Static hosting",
        body: "Vercel, Cloudflare Pages, GitHub Pages, or your own server.",
      },
    ],
    status:
      "The public repo and npm packages come next. Until then, run it from the local repo with pnpm build.",
  },
  footer: {
    license: "MIT + CC0",
  },
};

const catalogue: Record<Locale, Messages> = { id, en };

export function getMessages(locale: Locale): Messages {
  return catalogue[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === "id" ? "en" : "id";
}

export function localePath(locale: Locale): string {
  return locale === "id" ? "/" : "/en/";
}
