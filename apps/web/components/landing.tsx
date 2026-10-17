import type { Locale, Messages } from "@/lib/i18n";
import { EmbedSnippet } from "./embed-snippet";
import { HeroAvatar } from "./hero-avatar";
import { MorphLab } from "./morph-lab";
import { Playground } from "./playground";
import { SiteHeader } from "./site-header";

const primaryButton =
  "inline-flex min-h-11 items-center justify-center rounded-[4px] bg-accent px-5 text-sm font-semibold text-accent-ink transition-[filter] hover:brightness-95";

const secondaryButton =
  "inline-flex min-h-11 items-center justify-center rounded-[4px] border border-line px-5 text-sm text-ink transition-colors hover:border-ink";

const heading =
  "font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.1] tracking-[-0.02em]";

const body = "mt-4 max-w-[58ch] text-base leading-relaxed text-muted sm:text-lg";

const inner = "mx-auto max-w-[1120px] px-6 py-16 md:py-24";

export function Landing({ locale, messages }: { locale: Locale; messages: Messages }) {
  const navLinks = [
    { id: "demo", label: messages.nav.demo },
    { id: "morph", label: messages.nav.morph },
    { id: "embed", label: messages.nav.embed },
    { id: "lisensi", label: messages.nav.license },
  ];

  return (
    <>
      <a href="#main" className="skip-link">
        {messages.a11y.skip}
      </a>

      <SiteHeader locale={locale} messages={messages} />

      <main id="main">
        <section className="mx-auto grid max-w-[1120px] items-center gap-10 px-6 pb-16 pt-12 md:grid-cols-12 md:gap-8 md:pb-24 md:pt-20">
          <div className="md:col-span-6 lg:col-span-5">
            <h1 className="font-display text-[clamp(2.5rem,6vw,4.3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {messages.hero.title}
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted">
              {messages.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#demo" className={primaryButton}>
                {messages.hero.primary}
              </a>
              <a href="#lisensi" className={secondaryButton}>
                {messages.hero.secondary}
              </a>
            </div>
            <p className="mt-6 text-sm text-muted">{messages.hero.note}</p>
          </div>

          <div className="md:col-span-6 lg:col-span-7">
            <HeroAvatar messages={messages} />
          </div>
        </section>

        <section
          id="demo"
          aria-labelledby="demo-title"
          className="scroll-mt-4 border-t border-line"
        >
          <div className={inner}>
            <div className="max-w-[56ch]">
              <h2 id="demo-title" className={heading}>
                {messages.demo.title}
              </h2>
              <p className={body}>{messages.demo.subtitle}</p>
            </div>
            <Playground messages={messages} />
          </div>
        </section>

        <section
          id="morph"
          aria-labelledby="morph-title"
          className="scroll-mt-4 border-t border-line"
        >
          <div className={inner}>
            <div className="max-w-[60ch]">
              <h2 id="morph-title" className={heading}>
                {messages.morph.title}
              </h2>
              <p className={body}>{messages.morph.subtitle}</p>
            </div>
            <MorphLab messages={messages} />
          </div>
        </section>

        <section
          id="embed"
          aria-labelledby="embed-title"
          className="scroll-mt-4 border-t border-line"
        >
          <div className={inner}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
              <div className="min-w-0">
                <h2 id="embed-title" className={heading}>
                  {messages.embed.title}
                </h2>
                <p className={body}>{messages.embed.subtitle}</p>
                <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-muted">
                  {messages.embed.status}
                </p>
              </div>
              <EmbedSnippet messages={messages} />
            </div>
          </div>
        </section>

        <section
          id="lisensi"
          aria-labelledby="license-title"
          className="scroll-mt-4 border-t border-line"
        >
          <div className={inner}>
            <div className="max-w-[58ch]">
              <h2 id="license-title" className={heading}>
                {messages.license.title}
              </h2>
              <p className={body}>{messages.license.subtitle}</p>
            </div>

            <dl className="mt-10 border-t border-line">
              {messages.license.items.map((item) => (
                <div
                  key={item.title}
                  className="grid gap-1 border-b border-line py-5 sm:grid-cols-[220px_1fr] sm:gap-8"
                >
                  <dt className="font-medium text-ink">{item.title}</dt>
                  <dd className="text-muted">{item.body}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 max-w-[58ch] text-sm leading-relaxed text-muted">
              {messages.license.status}
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-6 py-4 text-sm text-muted">
          <p className="font-display text-base font-semibold tracking-[-0.03em] text-ink">pulse</p>

          <nav aria-label={messages.a11y.footerNav} className="flex flex-wrap items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="inline-flex min-h-11 items-center rounded-[4px] px-2 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <span className="px-2 font-mono text-xs">{messages.footer.license}</span>
          </nav>
        </div>
      </footer>
    </>
  );
}
