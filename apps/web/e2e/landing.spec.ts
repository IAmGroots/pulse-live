import { expect, test } from "@playwright/test";

test.describe("landing", () => {
  test("menampilkan hero, playground, morph, kode, dan lisensi", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Satu avatar SVG");
    await expect(page.locator("#demo")).toBeVisible();
    await expect(page.locator("#morph")).toBeVisible();
    await expect(page.locator("#embed")).toBeVisible();
    await expect(page.locator("#lisensi")).toBeVisible();
    await expect(page.locator("#stage svg")).toHaveCount(1);
  });

  test("setiap tautan navigasi menuju section yang ada", async ({ page }) => {
    await page.goto("/");

    const hrefs = await page
      .locator("header nav a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));

    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      const id = href.replace("#", "");
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("mengganti state lewat tombol playground", async ({ page }) => {
    await page.goto("/");

    const status = page.locator("#demo p.font-mono").first();
    const before = await status.textContent();

    await page.getByRole("button", { name: "thinking", exact: true }).click();
    await expect(status).toContainText("thinking");
    expect(before).not.toContain("thinking");

    const pressed = await page
      .getByRole("button", { name: "thinking", exact: true })
      .getAttribute("aria-pressed");
    expect(pressed).toBe("true");
  });

  test("slider intensitas mengubah path avatar", async ({ page }) => {
    await page.goto("/");

    const path = page.locator("#stage svg path").first();
    const before = await path.getAttribute("d");

    await page.locator('input[type="range"]').first().fill("1");
    await page.waitForTimeout(600);

    expect(await path.getAttribute("d")).not.toBe(before);
  });

  test("pause menghentikan animasi dan resume melanjutkannya", async ({ page }) => {
    await page.goto("/");
    await page.locator("#stage").scrollIntoViewIfNeeded();

    const group = page.locator("#stage svg g").first();
    const clickByName = (name: string) =>
      page.evaluate((label) => {
        const button = [...document.querySelectorAll("button")].find(
          (item) => item.textContent?.trim() === label,
        );
        button?.click();
      }, name);

    await clickByName("Jeda");
    const paused = await group.getAttribute("style");
    await page.waitForTimeout(400);
    expect(await group.getAttribute("style")).toBe(paused);

    await clickByName("Lanjut");
    await page.waitForTimeout(400);
    expect(await group.getAttribute("style")).not.toBe(paused);
  });

  test("slider morph mengubah bentuk", async ({ page }) => {
    await page.goto("/");

    const figure = page.locator("#morph svg path");
    const before = await figure.getAttribute("d");
    await page.locator("#morph input[type='range']").fill("1");
    expect(await figure.getAttribute("d")).not.toBe(before);
  });

  test("tab kode berganti tanpa tautan mati", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "React", exact: true }).click();
    await expect(page.locator("#embed pre code")).toContainText("PulseAvatar");

    await page.getByRole("button", { name: "Embed", exact: true }).click();
    await expect(page.locator("#embed pre code")).toContainText("data-pulse");

    await page.getByRole("button", { name: "API", exact: true }).click();
    await expect(page.locator("#embed pre code")).toContainText("create");
  });

  test("tema gelap dan terang sama-sama berfungsi", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.getByRole("button", { name: "Aktifkan tema gelap" }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(background).toBe("rgb(10, 10, 12)");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: "Aktifkan tema terang" }).click();
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("tombol salin menyalin kode", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    await page.getByRole("button", { name: "Salin" }).click();
    await expect(page.getByRole("button", { name: "Tersalin" })).toBeVisible();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain("@pulse-live/core");
  });

  test("bahasa Inggris punya halaman sendiri", async ({ page }) => {
    await page.goto("/en");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("One SVG avatar");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#demo")).toBeVisible();
  });

  test("navigasi keyboard menjangkau kontrol utama", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();

    const outline = await page
      .locator(".skip-link")
      .evaluate((element) => getComputedStyle(element).outlineWidth);
    expect(parseFloat(outline)).toBeGreaterThanOrEqual(2);
  });

  test("tidak ada overflow horizontal di 360 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - window.innerWidth;
    });

    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("semua kontrol minimal 44 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const undersized = await page
      .locator("button, a, select, input[type='range']")
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && (rect.height < 44 || rect.width < 44);
          })
          .map((element) => element.textContent?.trim().slice(0, 24) ?? element.tagName),
      );

    expect(undersized).toEqual([]);
  });

  test("reduced motion menghentikan animasi idle", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const path = page.locator("#stage svg path").first();
    await page.waitForTimeout(300);
    const first = await path.getAttribute("d");
    await page.waitForTimeout(500);
    const second = await path.getAttribute("d");

    expect(first).toBe(second);
  });
});
