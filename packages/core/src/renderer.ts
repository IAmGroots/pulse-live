import type { Pose } from "./morph";
import { buildPath } from "./path";
import type { AvatarProject } from "./types";

const SVG = "http://www.w3.org/2000/svg";

let maskCounter = 0;

export class Renderer {
  readonly svg: SVGSVGElement;

  private readonly root: SVGGElement;
  private readonly bodyId: string | undefined;
  private readonly holeIds: string[];
  private readonly inkIds: string[];
  private readonly cutout: SVGPathElement | null = null;
  private readonly bodyPath: SVGPathElement | null = null;
  private readonly holePath: SVGPathElement | null = null;
  private readonly inkPaths = new Map<string, SVGPathElement>();
  private readonly label: SVGTitleElement;

  constructor(host: HTMLElement, project: AvatarProject, document: Document) {
    const [x, y, width, height] = project.viewBox;

    this.bodyId = project.parts.find((part) => part.role === "body")?.id;
    this.holeIds = project.parts.filter((part) => part.role === "hole").map((part) => part.id);
    this.inkIds = project.parts.filter((part) => part.role === "ink").map((part) => part.id);

    this.svg = document.createElementNS(SVG, "svg");
    this.svg.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute("height", "100%");
    this.svg.setAttribute("role", "img");
    this.svg.setAttribute("focusable", "false");
    this.svg.style.display = "block";
    this.svg.style.overflow = "visible";

    this.label = document.createElementNS(SVG, "title");
    this.label.textContent = project.name;
    this.svg.append(this.label);

    this.root = document.createElementNS(SVG, "g");
    this.root.setAttribute("fill", "currentColor");
    this.root.style.transformBox = "view-box";
    this.root.style.transformOrigin = "50% 50%";
    this.svg.append(this.root);

    if (project.renderMode === "layered") {
      const maskId = `pulse-mask-${(maskCounter += 1)}`;
      const defs = document.createElementNS(SVG, "defs");
      const mask = document.createElementNS(SVG, "mask");
      mask.setAttribute("id", maskId);
      mask.setAttribute("maskUnits", "userSpaceOnUse");
      mask.setAttribute("x", String(x));
      mask.setAttribute("y", String(y));
      mask.setAttribute("width", String(width));
      mask.setAttribute("height", String(height));

      const backdrop = document.createElementNS(SVG, "rect");
      backdrop.setAttribute("x", String(x));
      backdrop.setAttribute("y", String(y));
      backdrop.setAttribute("width", String(width));
      backdrop.setAttribute("height", String(height));
      backdrop.setAttribute("fill", "white");

      this.holePath = document.createElementNS(SVG, "path");
      this.holePath.setAttribute("fill", "black");
      this.holePath.setAttribute("fill-rule", "evenodd");

      mask.append(backdrop, this.holePath);
      defs.append(mask);
      this.svg.append(defs);

      this.bodyPath = document.createElementNS(SVG, "path");
      this.bodyPath.setAttribute("mask", `url(#${maskId})`);
      this.root.append(this.bodyPath);
    } else {
      this.cutout = document.createElementNS(SVG, "path");
      this.cutout.setAttribute("fill-rule", "evenodd");
      this.root.append(this.cutout);
    }

    for (const id of this.inkIds) {
      const path = document.createElementNS(SVG, "path");
      this.inkPaths.set(id, path);
      this.root.append(path);
    }

    host.append(this.svg);
  }

  render(pose: Pose, scale: number): void {
    const body = this.bodyId ? pose[this.bodyId] : undefined;
    if (!body) return;

    const bodyData = buildPath(body);
    const holes = this.holeIds
      .map((id) => pose[id])
      .filter((points): points is NonNullable<typeof points> => Boolean(points))
      .map((points) => buildPath(points))
      .join("");

    if (this.cutout) {
      this.cutout.setAttribute("d", bodyData + holes);
    }

    if (this.bodyPath) {
      this.bodyPath.setAttribute("d", bodyData);
    }

    if (this.holePath) {
      this.holePath.setAttribute("d", holes);
    }

    for (const [id, path] of this.inkPaths) {
      const points = pose[id];
      if (points) path.setAttribute("d", buildPath(points));
    }

    this.root.style.transform = scale === 1 ? "" : `scale(${scale.toFixed(4)})`;
  }

  setLabel(text: string): void {
    this.label.textContent = text;
  }

  destroy(): void {
    this.svg.remove();
  }
}
