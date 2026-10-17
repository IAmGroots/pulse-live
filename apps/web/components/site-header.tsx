import type { Locale, Messages } from "@/lib/i18n";
import { localePath, otherLocale } from "@/lib/i18n";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { id: "demo", key: "demo" },
  { id: "morph", key: "morph" },
  { id: "embed", key: "embed" },
  { id: "lisensi", key: "license" },
] as const;

export function SiteHeader({ locale, messages }: { locale: Locale; messages: Messages }) {
  const other = otherLocale(locale);

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-0 px-6 py-1">
        <a
          href={localePath(locale)}
          className="inline-flex min-h-11 items-center font-display text-xl font-semibold tracking-[-0.03em] text-ink"
        >
          pulse
        </a>

        <nav
          aria-label={messages.a11y.nav}
          className="order-3 flex w-full gap-1 sm:order-none sm:w-auto"
        >
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="inline-flex min-h-11 items-center rounded-[4px] px-3 text-sm text-muted transition-colors hover:text-ink"
            >
              {messages.nav[link.key]}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <a
            href={localePath(other)}
            hrefLang={other}
            aria-label={messages.lang.label}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[4px] px-3 text-sm text-muted transition-colors hover:text-ink"
          >
            {messages.lang.switch}
          </a>
          <ThemeToggle messages={messages} />
        </div>
      </div>
    </header>
  );
}
