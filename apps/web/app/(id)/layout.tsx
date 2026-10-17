import "@fontsource-variable/bricolage-grotesque";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeScript } from "@/components/theme-script";
import { getMessages } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";
import "../globals.css";

const messages = getMessages("id");

export const metadata: Metadata = buildMetadata("id", messages);

export default function IdRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
