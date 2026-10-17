import { z } from "zod";

export const STATE_IDS = [
  "idle",
  "listening",
  "thinking",
  "speaking",
  "happy",
  "sad",
  "confused",
  "surprised",
  "sleepy",
  "excited",
  "angry",
  "curious",
  "error",
  "loading",
] as const;

export type StateId = (typeof STATE_IDS)[number];

export const PART_IDS = ["body", "eyeL", "eyeR", "browL", "browR", "mouth"] as const;

export type PartId = (typeof PART_IDS)[number];

export const PART_POINT_COUNTS: Record<PartId, number> = {
  body: 64,
  eyeL: 16,
  eyeR: 16,
  browL: 12,
  browR: 12,
  mouth: 24,
};

export const PART_ROLES = ["body", "hole", "ink", "overlay"] as const;

export type PartRole = (typeof PART_ROLES)[number];

export const LOOP_KINDS = ["breathe", "pulse", "dots", "arc", "none"] as const;

export const pointSchema = z.tuple([z.number().finite(), z.number().finite()]);

export type Point = z.infer<typeof pointSchema>;

export const partDefSchema = z.object({
  id: z.string().min(1),
  role: z.enum(PART_ROLES),
  pointCount: z.number().int().min(8).max(256),
  z: z.number().int().min(0),
});

export type PartDef = z.infer<typeof partDefSchema>;

export const partPoseSchema = z.object({
  points: z.array(pointSchema),
  opacity: z.number().min(0).max(1).optional(),
});

export type PartPose = z.infer<typeof partPoseSchema>;

export const avatarStateSchema = z.object({
  id: z.string().min(1),
  parts: z.record(z.string(), partPoseSchema),
  loop: z.enum(LOOP_KINDS).optional(),
  duration: z.number().int().min(0).max(20000),
  morph: z.number().int().min(0).max(5000),
});

export type AvatarState = z.infer<typeof avatarStateSchema>;

export const transitionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  duration: z.number().int().min(0).max(5000),
  easing: z.string().min(1),
});

export type Transition = z.infer<typeof transitionSchema>;

export const viewBoxSchema = z.tuple([
  z.number().finite(),
  z.number().finite(),
  z.number().positive(),
  z.number().positive(),
]);

export type ViewBox = z.infer<typeof viewBoxSchema>;

export const avatarProjectSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.string().min(1),
    name: z.string().min(1),
    viewBox: viewBoxSchema,
    renderMode: z.enum(["cutout", "layered"]),
    parts: z.array(partDefSchema).min(1),
    states: z.array(avatarStateSchema).min(1),
    transitions: z.array(transitionSchema),
    defaults: z.object({
      duration: z.number().int().min(0).max(5000),
      easing: z.string().min(1),
    }),
    blink: z.object({
      parts: z.array(z.string()),
      interval: z.tuple([z.number().min(0), z.number().min(0)]),
      duration: z.number().int().min(0).max(2000),
      amount: z.number().min(0).max(1),
    }),
    intensity: z.object({
      mouth: z.string().min(1),
      scaleY: z.number().min(0).max(10),
    }),
  })
  .superRefine((project, ctx) => {
    const [minX, minY, width, height] = project.viewBox;
    const maxX = minX + width;
    const maxY = minY + height;
    const tolerance = Math.max(width, height) * 0.01;

    const definedParts = new Set<string>();
    for (const [index, part] of project.parts.entries()) {
      if (definedParts.has(part.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["parts", index, "id"],
          message: `Part "${part.id}" didefinisikan lebih dari sekali.`,
        });
      }
      definedParts.add(part.id);
    }

    const definedStates = new Set<string>();
    for (const [stateIndex, state] of project.states.entries()) {
      if (definedStates.has(state.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["states", stateIndex, "id"],
          message: `State "${state.id}" didefinisikan lebih dari sekali.`,
        });
      }
      definedStates.add(state.id);

      for (const part of project.parts) {
        const pose = state.parts[part.id];
        if (!pose) {
          ctx.addIssue({
            code: "custom",
            path: ["states", stateIndex, "parts", part.id],
            message: `State "${state.id}" tidak punya part "${part.id}".`,
          });
          continue;
        }

        if (pose.points.length !== part.pointCount) {
          ctx.addIssue({
            code: "custom",
            path: ["states", stateIndex, "parts", part.id, "points"],
            message: `Part "${part.id}" di state "${state.id}" punya ${pose.points.length} titik, harus ${part.pointCount}.`,
          });
        }

        for (const [pointIndex, point] of pose.points.entries()) {
          const [x, y] = point;
          const outside =
            x < minX - tolerance ||
            x > maxX + tolerance ||
            y < minY - tolerance ||
            y > maxY + tolerance;
          if (outside) {
            ctx.addIssue({
              code: "custom",
              path: ["states", stateIndex, "parts", part.id, "points", pointIndex],
              message: `Titik (${x}, ${y}) di luar viewBox.`,
            });
          }
        }
      }

      for (const partId of Object.keys(state.parts)) {
        if (!definedParts.has(partId)) {
          ctx.addIssue({
            code: "custom",
            path: ["states", stateIndex, "parts", partId],
            message: `State "${state.id}" memakai part "${partId}" yang tidak didefinisikan.`,
          });
        }
      }
    }

    for (const [index, transition] of project.transitions.entries()) {
      if (transition.from !== "*" && !definedStates.has(transition.from)) {
        ctx.addIssue({
          code: "custom",
          path: ["transitions", index, "from"],
          message: `Transisi memakai state "${transition.from}" yang tidak ada.`,
        });
      }
      if (!definedStates.has(transition.to)) {
        ctx.addIssue({
          code: "custom",
          path: ["transitions", index, "to"],
          message: `Transisi memakai state "${transition.to}" yang tidak ada.`,
        });
      }
    }

    for (const partId of project.blink.parts) {
      if (!definedParts.has(partId)) {
        ctx.addIssue({
          code: "custom",
          path: ["blink", "parts"],
          message: `Blink memakai part "${partId}" yang tidak didefinisikan.`,
        });
      }
    }

    if (!definedParts.has(project.intensity.mouth)) {
      ctx.addIssue({
        code: "custom",
        path: ["intensity", "mouth"],
        message: `Intensity memakai part "${project.intensity.mouth}" yang tidak didefinisikan.`,
      });
    }
  });

export type AvatarProject = z.infer<typeof avatarProjectSchema>;

export function parseProject(input: unknown): AvatarProject {
  return avatarProjectSchema.parse(input);
}

export function safeParseProject(input: unknown) {
  return avatarProjectSchema.safeParse(input);
}
