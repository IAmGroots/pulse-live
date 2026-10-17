"use client";

import { useEffect, useRef, useState } from "react";
import { create } from "@pulse-live/core";
import type { Avatar, AvatarProject } from "@pulse-live/core";
import { overlays } from "@pulse-live/overlays";
import type { Messages } from "@/lib/i18n";
import type { PresetName } from "@/lib/projects";
import { blip, loadPreset, PRESET_LABELS } from "@/lib/projects";
import { StaticAvatar } from "./static-avatar";

export function Playground({ messages }: { messages: Messages }) {
  const host = useRef<HTMLDivElement>(null);
  const avatar = useRef<Avatar | null>(null);
  const [preset, setPreset] = useState<PresetName>("blip");
  const [project, setProject] = useState<AvatarProject>(blip);
  const [stateId, setStateId] = useState("idle");
  const [paused, setPaused] = useState(false);
  const [intensity, setIntensity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!host.current) return;

    const instance = create(host.current, {
      project,
      state: "idle",
      pointerTracking: true,
    });

    instance.onFrame(overlays());
    instance.on("stateChange", (change) => setStateId(change.to));
    avatar.current = instance;
    setStateId("idle");
    setPaused(false);
    setIntensity(0);
    setLive(true);

    return () => {
      instance.destroy();
      avatar.current = null;
      setLive(false);
    };
  }, [project]);

  async function changePreset(name: PresetName) {
    if (name === preset) return;

    setLoading(true);
    setError(false);

    try {
      const next = await loadPreset(name);
      setPreset(name);
      setProject(next);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function togglePause() {
    if (!avatar.current) return;

    if (paused) avatar.current.resume();
    else avatar.current.pause();

    setPaused(!paused);
  }

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-3">
        <div
          className="relative flex aspect-square items-center justify-center rounded-xl border border-line bg-surface p-4 sm:p-8"
          aria-busy={loading}
        >
          <div
            id="stage"
            ref={host}
            className="absolute inset-0 p-4 text-ink sm:p-8"
            style={{ visibility: live ? "visible" : "hidden" }}
          />
          {live ? null : (
            <div className="absolute inset-0 p-4 text-ink sm:p-8">
              <StaticAvatar project={project} state="idle" label={PRESET_LABELS[preset]} />
            </div>
          )}
        </div>
        <p className="flex items-center justify-between font-mono text-xs text-muted">
          <span>{PRESET_LABELS[preset].toLowerCase()}</span>
          <span>{paused ? `${stateId} / ${messages.demo.pause.toLowerCase()}` : stateId}</span>
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-5">
        <label className="flex flex-col gap-2 text-sm text-muted">
          {messages.demo.preset}
          <select
            value={preset}
            onChange={(event) => void changePreset(event.target.value as PresetName)}
            className="min-h-11 w-full rounded-[4px] border border-control bg-paper px-3 text-sm text-ink"
          >
            <option value="blip">Blip</option>
            <option value="mochi">Mochi</option>
          </select>
        </label>

        {loading ? (
          <p role="status" className="text-sm text-muted">
            {messages.demo.loading}
          </p>
        ) : null}

        {error ? (
          <div role="alert" className="flex flex-col gap-2 text-sm">
            <p className="text-ink">{messages.demo.loadError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-11 w-fit items-center rounded-[4px] border border-control px-3 text-ink"
            >
              {messages.demo.retry}
            </button>
          </div>
        ) : null}

        <fieldset>
          <legend className="pb-2 text-sm text-muted">{messages.demo.state}</legend>
          <div className="grid grid-cols-2 gap-1.5">
            {project.states.map((state) => (
              <button
                key={state.id}
                type="button"
                aria-pressed={stateId === state.id}
                onClick={() => avatar.current?.setState(state.id)}
                className="inline-flex min-h-11 items-center justify-center rounded-[4px] border border-control px-2 text-[13px] text-ink transition-colors hover:border-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-ink"
              >
                {state.id}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-2 text-sm text-muted">
          <span className="flex items-center justify-between">
            <span>{messages.demo.intensity}</span>
            <span className="font-mono text-xs">{Math.round(intensity * 100)}%</span>
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={intensity}
            onChange={(event) => {
              const next = Number(event.target.value);
              setIntensity(next);
              avatar.current?.setIntensity(next);
            }}
            className="h-11 w-full accent-ink"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => avatar.current?.blink()}
            className="inline-flex min-h-11 items-center rounded-[4px] border border-control px-3 text-sm text-ink transition-colors hover:border-ink"
          >
            {messages.demo.blink}
          </button>
          <button
            type="button"
            onClick={togglePause}
            aria-pressed={paused}
            className="inline-flex min-h-11 items-center rounded-[4px] border border-control px-3 text-sm text-ink transition-colors hover:border-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-ink"
          >
            {paused ? messages.demo.resume : messages.demo.pause}
          </button>
        </div>

        <p className="text-sm leading-relaxed text-muted">{messages.demo.hint}</p>
      </div>
    </div>
  );
}
