import { h, type VNode } from "vue";
import type { WakebSkeletonName } from "../types";

/* Provider-neutral WPageSkeleton behavior shared by every renderer (SPEC R03, R16, M3). */

export const pageSkeletonDefaults = { direction: "column", label: "Loading content" } as const;

/** Row repetitions: floored; missing, nonfinite, zero or negative values render one column. */
export const repeatCount = (value?: number) => (value != null && Number.isFinite(value) && value > 0 ? Math.floor(value) || 1 : 1);

/** A CSS length for `width`/`height`: numbers and numeric strings become px, other strings pass through. */
export const toUnit = (value: string | number | undefined): string | undefined => {
  if (value == null || value === "") return undefined;
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return Number.isFinite(number) ? `${number}px` : undefined;
};

/** One placeholder bone. Width and height are CSS lengths; `circle` makes it round. */
export interface SkeletonBone {
  width: string;
  height: string;
  circle?: boolean;
  radius?: string;
}

/** What a portable name draws: an optional leading avatar, then rows of bones laid out inline. */
export interface SkeletonShape {
  avatar?: SkeletonBone;
  rows: readonly (readonly SkeletonBone[])[];
}

const line = (width = "100%"): SkeletonBone => ({ width, height: "0.75rem" });
const heading: SkeletonBone = { width: "50%", height: "1.5rem" };
const cells = (count: number) => Array.from({ length: count }, () => line());

/**
 * Bones for each portable skeleton name, for renderers without a native skeleton grammar. They
 * approximate the Vuetify 3 loader layouts: sizes are close, not pixel-identical.
 */
export const SKELETON_SHAPES: Readonly<Record<WakebSkeletonName, SkeletonShape>> = {
  text: { rows: [[line()]] },
  paragraph: { rows: [[line()], [line()], [line("60%")]] },
  heading: { rows: [[heading]] },
  avatar: { rows: [[{ width: "48px", height: "48px", circle: true }]] },
  image: { rows: [[{ width: "100%", height: "200px", radius: "0" }]] },
  button: { rows: [[{ width: "64px", height: "36px", radius: "4px" }]] },
  chip: { rows: [[{ width: "96px", height: "32px", radius: "16px" }]] },
  "list-item": { rows: [[line()]] },
  "list-item-avatar": { avatar: { width: "40px", height: "40px", circle: true }, rows: [[line()]] },
  "list-item-two-line": { rows: [[line()], [line("60%")]] },
  "list-item-three-line": { rows: [[line()], [line()], [line("60%")]] },
  "list-item-avatar-two-line": { avatar: { width: "40px", height: "40px", circle: true }, rows: [[line()], [line("60%")]] },
  "list-item-avatar-three-line": { avatar: { width: "40px", height: "40px", circle: true }, rows: [[line()], [line()], [line("60%")]] },
  table: { rows: [[{ width: "30%", height: "1.5rem" }], cells(6), cells(6), cells(6), cells(6), cells(6), [line("40%")]] },
  "table-row": { rows: [cells(6)] },
  card: { rows: [[{ width: "100%", height: "150px", radius: "0" }], [heading]] },
};

/**
 * Expands a normalized skeleton sequence (the output of `useSkeleton`) into one entry per drawn
 * name, in order. Names without a shape are skipped; `useSkeleton` already reported them.
 */
export const skeletonParts = (sequence: string): WakebSkeletonName[] =>
  sequence.split(",").flatMap((raw) => {
    const [name, count] = raw.trim().split("@") as [WakebSkeletonName, string | undefined];
    return Object.prototype.hasOwnProperty.call(SKELETON_SHAPES, name) ?Array.from({ length: count === undefined ? 1 : Number(count) }, () => name) : [];
  });

/**
 * Draws a normalized skeleton sequence as Wakeb bones: a box sized by width and height (numbers are
 * px, as with VSkeletonLoader) holding one part per name, each an optional avatar and rows of bones.
 * `bone` is the provider's bone renderer.
 */
export const renderSkeleton = (bone: (shape: SkeletonBone) => VNode, sequence: string, width?: string | number, height?: string | number, attrs: Record<string, unknown> = {}) =>
  h(
    "div",
    { ...attrs, class: ["wakeb-skeleton", attrs.class], style: [attrs.style as never, { width: toUnit(width), height: toUnit(height) }] },
    skeletonParts(sequence).map((name) => {
      const shape = SKELETON_SHAPES[name];
      return h("div", { class: ["wakeb-skeleton__part", `wakeb-skeleton__part--${name}`] }, [
        shape.avatar && bone(shape.avatar),
        h("div", { class: "wakeb-skeleton__lines" }, shape.rows.map((bones) => h("div", { class: "wakeb-skeleton__row" }, bones.map(bone)))),
      ]);
    }),
  );

/** WSkeleton defaults shared by every renderer. */
export const skeletonDefaults = { type: "text", loading: true, label: undefined } as const;
/** The accessible name of a loading WSkeleton: the caller label, else the localized default. */
export const skeletonLabel = (label: string | undefined, locale: "en" | "ar") => label ?? (locale === "ar" ? "جارٍ التحميل..." : "Loading...");
