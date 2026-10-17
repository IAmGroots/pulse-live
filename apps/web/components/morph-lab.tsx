"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildPath, lerpPose, poseOf } from "@pulse-live/core";
import type { Pose } from "@pulse-live/core";
import type { Messages } from "@/lib/i18n";
import { blip } from "@/lib/projects";

const holeIds = ["eyeL", "eyeR", "mouth", "browL", "browR"] as const;

export function MorphLab({ messages }: { messages: Messages }) {
  const poses = useMemo(() => {
    const map = new Map<string, Pose>();

    for (const state of blip.states) {
      map.set(state.id, poseOf(state));
    }

    return map;
  }, []);

  const [from, setFrom] = useState("idle");
  const [to, setTo] = useState("thinking");
  const [progress, setProgress] = useState(0.5);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const path = useMemo(() => {
    const start = poses.get(from);
    const end = poses.get(to);
    if (!start || !end) return "";

    const pose = lerpPose(start, end, progress);
    const body = pose.body ? buildPath(pose.body) : "";
    const holes = holeIds.map((id) => (pose[id] ? buildPath(pose[id]) : "")).join("");

    return body + holes;
  }, [from, to, progress, poses]);

  function stop() {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
  }

  function play() {
    stop();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    const started = performance.now();
    const duration = 620;

    const tick = (now: number) => {
      const value = Math.min(1, (now - started) / duration);
      setProgress(value);

      if (value < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        frame.current = null;
      }
    };

    frame.current = requestAnimationFrame(tick);
  }

  const percent = Math.round(progress * 100);

  return (
    <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-3">
        <div className="flex aspect-square items-center justify-center rounded-xl border border-line bg-surface p-6 sm:p-10">
          <svg
            viewBox="0 0 100 100"
            role="img"
            aria-label={`${from} ke ${to}, ${percent}%`}
            className="h-full w-full text-ink"
          >
            <path d={path} fill="currentColor" fillRule="evenodd" />
          </svg>
        </div>
        <p className="flex items-center justify-between font-mono text-xs text-muted">
          <span>
            {from} / {to}
          </span>
          <span>{percent}%</span>
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-2 text-sm text-muted">
            {messages.morph.from}
            <select
              value={from}
              onChange={(event) => {
                stop();
                setFrom(event.target.value);
              }}
              className="min-h-11 w-full rounded-[4px] border border-control bg-paper px-3 text-sm text-ink"
            >
              {blip.states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.id}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-muted">
            {messages.morph.to}
            <select
              value={to}
              onChange={(event) => {
                stop();
                setTo(event.target.value);
              }}
              className="min-h-11 w-full rounded-[4px] border border-control bg-paper px-3 text-sm text-ink"
            >
              {blip.states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.id}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm text-muted">
          <span className="flex items-center justify-between">
            <span>{messages.morph.progress}</span>
            <span className="font-mono text-xs">{percent}%</span>
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={(event) => {
              stop();
              setProgress(Number(event.target.value));
            }}
            className="h-11 w-full accent-ink"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={play}
            className="inline-flex min-h-11 items-center rounded-[4px] border border-control px-3 text-sm text-ink transition-colors hover:border-ink"
          >
            {messages.morph.play}
          </button>
          <span className="font-mono text-xs text-muted">{messages.morph.points}</span>
        </div>

        <p className="text-sm leading-relaxed text-muted">{messages.morph.note}</p>
      </div>
    </div>
  );
}
