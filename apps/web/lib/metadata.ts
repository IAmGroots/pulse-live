import type { Metadata } from "next";
import type { Locale, Messages } from "./i18n";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const isLocalhost = rawSiteUrl
  ? /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?\/?$/i.test(rawSiteUrl)
  : false;
const siteUrl =
  rawSiteUrl && !(isLocalhost && process.env.NODE_ENV === "production") ? rawSiteUrl : undefined;

export function buildMetadata(locale: Locale, messages: Messages): Metadata {
  const path = locale === "id" ? "/" : "/en/";

  const base: Metadata = {
    title: messages.meta.title,
    description: messages.meta.description,
    applicationName: "Pulse",
    openGraph: {
      type: "website",
      siteName: "Pulse",
      title: messages.meta.title,
      description: messages.meta.description,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
    },
    twitter: {
      card: "summary",
      title: messages.meta.title,
      description: messages.meta.description,
    },
    robots: { index: true, follow: true },
  };

  if (!siteUrl) return base;

  const absolute = new URL(path, siteUrl).toString();

  return {
    ...base,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: path,
      languages: { id: "/", en: "/en/", "x-default": "/" },
    },
    openGraph: {
      ...base.openGraph,
      url: absolute,
    },
  };
}
