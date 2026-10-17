"use client";

import { useEffect, useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";

type Status = "idle" | "copied" | "error";

export function CopyButton({ text, messages }: { text: string; messages: Messages["embed"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        const ok = document.execCommand("copy");
        field.remove();
        if (!ok) throw new Error("copy failed");
      }

      setStatus("copied");
    } catch {
      setStatus("error");
    }

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 1800);
  }

  const label =
    status === "copied" ? messages.copied : status === "error" ? messages.copyError : messages.copy;

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 items-center rounded-[4px] border border-control px-3 text-sm text-ink transition-colors hover:border-ink"
      >
        {label}
      </button>
      <span aria-live="polite" className="sr-only">
        {status === "copied" ? messages.copied : status === "error" ? messages.copyError : ""}
      </span>
    </>
  );
}
