import { buildPath, poseOf } from "@pulse-live/core";
import type { AvatarProject } from "@pulse-live/core";

export function StaticAvatar({
  project,
  state,
  label,
}: {
  project: AvatarProject;
  state: string;
  label: string;
}) {
  const avatarState = project.states.find((item) => item.id === state) ?? project.states[0];
  if (!avatarState) return null;

  const pose = poseOf(avatarState);
  const [x, y, width, height] = project.viewBox;

  const holes = project.parts
    .filter((part) => part.role === "hole")
    .map((part) => {
      const points = pose[part.id];
      return points ? buildPath(points) : "";
    })
    .join("");

  const inks = project.parts
    .filter((part) => part.role === "ink")
    .map((part) => {
      const points = pose[part.id];
      return { id: part.id, d: points ? buildPath(points) : "" };
    });

  const body = pose.body ? buildPath(pose.body) : "";

  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={label}
      style={{ display: "block", overflow: "visible" }}
    >
      <path d={body + holes} fill="currentColor" fillRule="evenodd" />
      {inks.map((ink) => (
        <path key={ink.id} d={ink.d} fill="currentColor" />
      ))}
    </svg>
  );
}
