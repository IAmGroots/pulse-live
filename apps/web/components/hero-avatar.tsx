"use client";

import { useEffect, useRef, useState } from "react";
import { create } from "@pulse-live/core";
import type { Avatar } from "@pulse-live/core";
import { overlays } from "@pulse-live/overlays";
import type { Messages } from "@/lib/i18n";
import { blip } from "@/lib/projects";
import { StaticAvatar } from "./static-avatar";

const sequence = ["idle", "listening", "thinking", "speaking", "happy", "curious"];

export function HeroAvatar({ messages }: { messages: Messages }) {
  const host = useRef<HTMLDivElement>(null);
  const avatar = useRef<Avatar | null>(null);
  const [state, setState] = useState("idle");
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!host.current) return;

    const instance = create(host.current, {
      project: blip,
      state: "idle",
      pointerTracking: true,
    });

    instance.onFrame(overlays());
    avatar.current = instance;
    setLive(true);

    return () => {
      instance.destroy();
      avatar.current = null;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;

    const timer = window.setInterval(() => {
      if (media.matches || document.hidden) return;

      index = (index + 1) % sequence.length;
      const next = sequence[index]!;
      avatar.current?.setState(next);
      setState(next);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <figure className="m-0">
      <div className="relative flex aspect-square items-center justify-center rounded-xl border border-line bg-surface p-6 sm:p-10">
        <div
          ref={host}
          className="absolute inset-0 p-6 text-ink sm:p-10"
          style={{ visibility: live ? "visible" : "hidden" }}
        />
        {live ? null : (
          <div className="absolute inset-0 p-6 text-ink sm:p-10">
            <StaticAvatar project={blip} state="idle" label={messages.a11y.avatar} />
          </div>
        )}
      </div>
      <figcaption className="mt-3 flex items-center justify-between font-mono text-xs text-muted">
        <span>blip</span>
        <span>{state}</span>
      </figcaption>
    </figure>
  );
}
