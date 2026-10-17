import { afterEach, describe, expect, it, vi } from "vitest";
import { getMessages } from "./i18n";

async function loadMetadata() {
  vi.resetModules();
  return import("./metadata");
}

const messages = getMessages("id");

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("buildMetadata", () => {
  it("tidak menulis canonical saat env kosong", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NODE_ENV", "production");

    const { buildMetadata } = await loadMetadata();
    const metadata = buildMetadata("id", messages);

    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph?.url).toBeUndefined();
  });

  it("mengabaikan localhost pada build produksi", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    vi.stubEnv("NODE_ENV", "production");

    const { buildMetadata } = await loadMetadata();
    const metadata = buildMetadata("id", messages);

    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph?.url).toBeUndefined();
  });

  it("menulis canonical absolut untuk domain nyata", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://pulse.example");
    vi.stubEnv("NODE_ENV", "production");

    const { buildMetadata } = await loadMetadata();
    const metadata = buildMetadata("en", messages);

    expect(metadata.alternates?.canonical).toBe("/en/");
    expect(metadata.openGraph?.url).toBe("https://pulse.example/en/");
    expect(metadata.metadataBase?.toString()).toBe("https://pulse.example/");
  });

  it("tetap memakai localhost saat development", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    vi.stubEnv("NODE_ENV", "development");

    const { buildMetadata } = await loadMetadata();
    const metadata = buildMetadata("id", messages);

    expect(metadata.alternates?.canonical).toBe("/");
    expect(metadata.openGraph?.url).toBe("http://localhost:3000/");
  });

  it("membuang spasi di sekitar nilai env", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "  https://pulse.example  ");
    vi.stubEnv("NODE_ENV", "production");

    const { buildMetadata } = await loadMetadata();
    const metadata = buildMetadata("id", messages);

    expect(metadata.openGraph?.url).toBe("https://pulse.example/");
  });
});
