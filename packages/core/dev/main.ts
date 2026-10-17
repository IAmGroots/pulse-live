import blip from "@pulse-live/presets/blip.json";
import mochi from "@pulse-live/presets/mochi.json";
import { overlays } from "@pulse-live/overlays";
import { create } from "../src/index";
import type { Avatar, AvatarProject } from "../src/index";

const projects: Record<string, AvatarProject> = {
  blip: blip as unknown as AvatarProject,
  mochi: mochi as unknown as AvatarProject,
};

const params = new URLSearchParams(window.location.search);
const presetName = params.get("preset") === "mochi" ? "mochi" : "blip";
const initialState = params.get("state") ?? "idle";
const swapState = params.get("swap");
const swapDelay = Number(params.get("delay") ?? 600);
const swapDuration = params.get("dur") ? Number(params.get("dur")) : undefined;
const initialTheme = params.get("theme") === "dark" ? "dark" : "light";

const stage = document.querySelector<HTMLElement>("#stage");
const stateList = document.querySelector<HTMLElement>("#states");
const status = document.querySelector<HTMLElement>("#status");
const presetSelect = document.querySelector<HTMLSelectElement>("#preset");
const intensity = document.querySelector<HTMLInputElement>("#intensity");
const gazeX = document.querySelector<HTMLInputElement>("#gaze-x");
const gazeY = document.querySelector<HTMLInputElement>("#gaze-y");
const blinkButton = document.querySelector<HTMLButtonElement>("#blink");
const pauseButton = document.querySelector<HTMLButtonElement>("#pause");
const themeButton = document.querySelector<HTMLButtonElement>("#theme");

if (
  !stage ||
  !stateList ||
  !status ||
  !presetSelect ||
  !intensity ||
  !gazeX ||
  !gazeY ||
  !blinkButton ||
  !pauseButton ||
  !themeButton
) {
  throw new Error("Markup dev tidak lengkap.");
}

const controls = {
  stage,
  stateList,
  status,
  presetSelect,
  intensity,
  gazeX,
  gazeY,
  blinkButton,
  pauseButton,
  themeButton,
};

document.documentElement.dataset.theme = initialTheme;

let avatar: Avatar | null = null;
let preset = presetName;
let paused = false;

function renderStates(): void {
  const project = projects[preset]!;
  controls.stateList.replaceChildren();

  for (const state of project.states) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = state.id;
    button.dataset.state = state.id;
    button.setAttribute("aria-pressed", String(state.id === avatar?.stateId));
    button.addEventListener("click", () => {
      avatar?.setState(state.id);
      syncPressed();
    });
    controls.stateList.append(button);
  }
}

function syncPressed(): void {
  const active = avatar?.stateId;

  for (const button of controls.stateList.querySelectorAll<HTMLButtonElement>("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.state === active));
  }

  controls.status.textContent = `${preset} / ${active ?? "idle"}`;
}

function mount(name: string, state: string): void {
  avatar?.destroy();
  preset = name;
  controls.presetSelect.value = name;
  avatar = create(controls.stage, {
    project: projects[name]!,
    state,
    pointerTracking: true,
    idle: true,
    blink: true,
  });
  avatar.onFrame(overlays());
  avatar.onFrame(() => {
    const scope = window as unknown as { __pulseFrames?: number };
    scope.__pulseFrames = (scope.__pulseFrames ?? 0) + 1;
  });
  avatar.on("stateChange", () => syncPressed());
  renderStates();
  syncPressed();
}

controls.presetSelect.addEventListener("change", () => {
  mount(controls.presetSelect.value, "idle");
});

controls.intensity.addEventListener("input", () => {
  avatar?.setIntensity(Number(controls.intensity.value));
});

controls.gazeX.addEventListener("input", () => {
  avatar?.setGaze(Number(controls.gazeX.value), Number(controls.gazeY.value));
});

controls.gazeY.addEventListener("input", () => {
  avatar?.setGaze(Number(controls.gazeX.value), Number(controls.gazeY.value));
});

controls.blinkButton.addEventListener("click", () => {
  avatar?.blink();
});

controls.pauseButton.addEventListener("click", () => {
  paused = !paused;
  controls.pauseButton.setAttribute("aria-pressed", String(paused));
  controls.pauseButton.textContent = paused ? "Resume" : "Pause";

  if (paused) avatar?.pause();
  else avatar?.resume();
});

controls.themeButton.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
});

mount(presetName, initialState);

if (swapState) {
  window.setTimeout(() => avatar?.setState(swapState, swapDuration), swapDelay);
}
