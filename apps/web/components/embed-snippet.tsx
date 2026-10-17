"use client";

import { useState } from "react";
import type { Messages } from "@/lib/i18n";
import { CopyButton } from "./copy-button";

const samples = {
  api: `import { create } from "@pulse-live/core";
import { overlays } from "@pulse-live/overlays";
import blip from "@pulse-live/presets/blip.json";

const avatar = create(document.querySelector("#pulse"), {
  project: blip,
  state: "idle",
  pointerTracking: true,
});

avatar.onFrame(overlays());
avatar.setState("thinking");
avatar.setIntensity(0.6);`,
  react: `"use client";

import { useEffect, useRef } from "react";
import { create } from "@pulse-live/core";
import blip from "@pulse-live/presets/blip.json";

export function PulseAvatar() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    const avatar = create(host.current, { project: blip });
    return () => avatar.destroy();
  }, []);

  return <div ref={host} />;
}`,
  embed: `<div
  data-pulse="blip"
  data-state="idle"
  data-theme="auto"
  data-driver="mic"
></div>
<script
  src="https://cdn.jsdelivr.net/npm/@pulse-live/embed@1/dist/v1.js"
  async
></script>`,
} as const;

type SampleKey = keyof typeof samples;

const labels: Record<SampleKey, string> = {
  api: "@pulse-live/core",
  react: "@pulse-live/react",
  embed: "@pulse-live/embed",
};

export function EmbedSnippet({ messages }: { messages: Messages }) {
  const [active, setActive] = useState<SampleKey>("api");
  const keys: SampleKey[] = ["api", "react", "embed"];

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap gap-1" role="group" aria-label={messages.a11y.code}>
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={active === key}
            onClick={() => setActive(key)}
            className="inline-flex min-h-11 items-center rounded-[4px] border border-control px-3 text-sm text-ink transition-colors hover:border-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-ink"
          >
            {messages.embed.tabs[key]}
          </button>
        ))}
      </div>

      <div className="min-w-0 rounded-xl border border-line bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted">
            {active === "embed" ? `${labels[active]}, ${messages.embed.planned}` : labels[active]}
          </span>
          <CopyButton text={samples[active]} messages={messages.embed} />
        </div>
        <pre
          tabIndex={0}
          aria-label={messages.a11y.code}
          className="max-w-full overflow-x-auto rounded-[4px] border border-line bg-paper p-4 font-mono text-[13px] leading-relaxed text-ink"
        >
          <code>{samples[active]}</code>
        </pre>
      </div>
    </div>
  );
}
