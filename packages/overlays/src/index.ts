const SVG = "http://www.w3.org/2000/svg";

export interface OverlayFrame {
  stateId: string;
  time: number;
  delta: number;
  reduced: boolean;
  viewBox: [number, number, number, number];
  svg: SVGSVGElement;
}

export interface OverlayOptions {
  dots?: boolean;
  z?: boolean;
  mark?: boolean;
  arc?: boolean;
}

interface Dot {
  circle: SVGCircleElement;
}

interface OverlayState {
  group: SVGGElement;
  dots: Dot[];
  z: SVGTextElement[];
  mark: SVGTextElement | null;
  arc: SVGCircleElement | null;
}

export function overlays(options: OverlayOptions = {}) {
  const enabled = {
    dots: options.dots ?? true,
    z: options.z ?? true,
    mark: options.mark ?? true,
    arc: options.arc ?? true,
  };

  const states = new WeakMap<SVGSVGElement, OverlayState>();

  function ensure(svg: SVGSVGElement): OverlayState {
    const existing = states.get(svg);
    if (existing) return existing;

    const document = svg.ownerDocument;
    const group = document.createElementNS(SVG, "g");
    group.setAttribute("fill", "currentColor");
    group.setAttribute("aria-hidden", "true");
    group.style.pointerEvents = "none";

    const dots: Dot[] = [];
    if (enabled.dots) {
      for (let index = 0; index < 3; index += 1) {
        const circle = document.createElementNS(SVG, "circle");
        circle.setAttribute("r", "2.6");
        circle.setAttribute("opacity", "0");
        group.append(circle);
        dots.push({ circle });
      }
    }

    const z: SVGTextElement[] = [];
    if (enabled.z) {
      for (let index = 0; index < 3; index += 1) {
        const text = document.createElementNS(SVG, "text");
        text.textContent = "z";
        text.setAttribute("font-size", "9");
        text.setAttribute("font-weight", "600");
        text.setAttribute("opacity", "0");
        group.append(text);
        z.push(text);
      }
    }

    let mark: SVGTextElement | null = null;
    if (enabled.mark) {
      mark = document.createElementNS(SVG, "text");
      mark.textContent = "!";
      mark.setAttribute("font-size", "16");
      mark.setAttribute("font-weight", "700");
      mark.setAttribute("text-anchor", "middle");
      mark.setAttribute("opacity", "0");
      group.append(mark);
    }

    let arc: SVGCircleElement | null = null;
    if (enabled.arc) {
      arc = document.createElementNS(SVG, "circle");
      arc.setAttribute("fill", "none");
      arc.setAttribute("stroke", "currentColor");
      arc.setAttribute("stroke-width", "2.4");
      arc.setAttribute("stroke-linecap", "round");
      arc.setAttribute("opacity", "0");
      group.append(arc);
    }

    svg.append(group);

    const state: OverlayState = { group, dots, z, mark, arc };
    states.set(svg, state);
    return state;
  }

  function setOpacity(element: SVGElement | null, value: number): void {
    if (!element) return;

    element.setAttribute("opacity", value <= 0.01 ? "0" : value.toFixed(3));
  }

  return function render(frame: OverlayFrame): void {
    const state = ensure(frame.svg);
    const [x, y, width, height] = frame.viewBox;
    const time = frame.time;
    const cx = x + width / 2;
    const cy = y + height / 2;

    const dotsOn = frame.stateId === "thinking";
    for (let index = 0; index < state.dots.length; index += 1) {
      const dot = state.dots[index]!;
      if (!dotsOn || frame.reduced) {
        setOpacity(dot.circle, 0);
        continue;
      }

      const phase = (((time / 900 - index * 0.18) % 1) + 1) % 1;
      const bounce = Math.sin(Math.PI * phase) * 2.2;
      dot.circle.setAttribute("cx", (cx + (index - 1) * 7.5).toFixed(2));
      dot.circle.setAttribute("cy", (cy - height * 0.4 - bounce).toFixed(2));
      setOpacity(dot.circle, 0.35 + 0.65 * Math.sin(Math.PI * phase));
    }

    const zOn = frame.stateId === "sleepy";
    for (let index = 0; index < state.z.length; index += 1) {
      const text = state.z[index]!;
      if (!zOn || frame.reduced) {
        setOpacity(text, 0);
        continue;
      }

      const phase = (((time / 2600 + index * 0.33) % 1) + 1) % 1;
      text.setAttribute("x", (cx + width * 0.22 + phase * width * 0.1).toFixed(2));
      text.setAttribute("y", (cy - height * 0.18 - phase * height * 0.24).toFixed(2));
      setOpacity(text, Math.sin(Math.PI * phase) * 0.9);
    }

    const markOn = frame.stateId === "surprised" || frame.stateId === "error";
    if (state.mark) {
      const bob = frame.reduced ? 0 : Math.sin(time / 260) * 1.2;
      state.mark.setAttribute("x", cx.toFixed(2));
      state.mark.setAttribute("y", (y + height * 0.16 + bob).toFixed(2));
      setOpacity(state.mark, markOn ? 1 : 0);
    }

    if (state.arc) {
      if (frame.stateId !== "loading" || frame.reduced) {
        setOpacity(state.arc, 0);
      } else {
        const radius = width * 0.44;
        const circumference = 2 * Math.PI * radius;
        const dash = circumference * 0.28;
        const spin = (time / 1100) % 1;

        state.arc.setAttribute("cx", cx.toFixed(2));
        state.arc.setAttribute("cy", cy.toFixed(2));
        state.arc.setAttribute("r", radius.toFixed(2));
        state.arc.setAttribute(
          "stroke-dasharray",
          `${dash.toFixed(2)} ${(circumference - dash).toFixed(2)}`,
        );
        state.arc.setAttribute("stroke-dashoffset", (-spin * circumference).toFixed(2));
        state.arc.setAttribute("transform", `rotate(-90 ${cx.toFixed(2)} ${cy.toFixed(2)})`);
        setOpacity(state.arc, 0.7);
      }
    }
  };
}
