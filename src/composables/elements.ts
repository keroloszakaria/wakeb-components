import { toUnit } from "./skeleton";
import type { CountBadgeProps, ListItem } from "../types";

/*
 * Provider-neutral defaults and rules for the small display elements: WCard, WDivider, WList, WIcon,
 * WImage and WAvatar. Renderers only paint the result.
 */

export const cardDefaults = { variant: "elevated", padded: true } as const;
export const dividerDefaults = { vertical: false, thickness: 1 } as const;
export const listDefaults = { items: () => [], interactive: false } as const;
export const iconDefaults = { size: 24 } as const;
export const imageDefaults = { alt: "", cover: false, lazy: true } as const;
export const avatarDefaults = { size: 40, color: "primary", rounded: true } as const;
export const countBadgeDefaults = { max: 99, dot: false, color: "danger", visible: true, location: "top end" } as const;
const COUNT_BADGE_LOCATIONS = ["top end", "top start", "bottom end", "bottom start"] as const;

/** Shared WCountBadge state: the shown text (capped at `max`), visibility and a location class. */
export function countBadgeState(props: CountBadgeProps) {
  const location = (COUNT_BADGE_LOCATIONS as readonly string[]).includes(props.location ?? "") ? props.location! : "top end";
  const numeric = typeof props.content === "number" ? props.content : /^\d+$/.test(String(props.content ?? "")) ? Number(props.content) : undefined;
  const max = props.max ?? countBadgeDefaults.max;
  const text = props.dot ? "" : numeric !== undefined && numeric > max ? `${max}+` : String(props.content ?? "");
  const shown = props.visible !== false && (props.dot || text !== "");
  return { text, shown, location, locationClass: `wakeb-count-badge--${location.replace(" ", "-")}` };
}

export { toUnit };

/** WList row key: the item value when present, else its index. */
export const listKey = (item: ListItem, index: number) => item.value ?? index;

/** A CSS aspect ratio from a number or a `16/9`-style string; invalid values give undefined. */
export function aspectRatio(value: number | string | undefined): string | undefined {
  if (value === undefined || value === "") return undefined;
  const text = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(text)) return Number(text) > 0 ? text : undefined;
  return /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(text) ? text.replace(/\s+/g, "") : undefined;
}

/** Image sources Wakeb renders: http(s), root-relative, relative paths, blob and data:image URLs. */
export function safeImageSource(src: string | undefined): string | undefined {
  const value = src?.trim();
  if (!value) return undefined;
  if (/^(https?:|blob:|data:image\/)/i.test(value)) return value;
  return /^[a-z][a-z\d+.-]*:/i.test(value) ? undefined : value;
}

/** Avatar initials: the first Unicode code point of the first two words; an empty name gives "". */
export function initials(name: string | undefined): string {
  const value = name?.trim();
  if (!value) return "";
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join("")
    .toUpperCase();
}
