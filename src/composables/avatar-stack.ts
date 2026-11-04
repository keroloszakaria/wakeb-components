import { computed } from "vue";
import type { AvatarStackProps } from "../types";

/** Defaults shared by every WAvatarStack renderer; providers must not change them. */
export const avatarStackDefaults = {
  items: () => [],
  max: 3,
  size: 32,
  avatarColor: "primary",
  showOverflowMenu: false,
  showTooltip: true,
  itemKey: "id",
  nameKey: "name",
  avatarKey: "avatar",
  unknownLabel: "Unknown user",
  overflowLabel: "",
  menuStyle: () => ({}),
  tooltipStyle: () => ({}),
} as const;

/** Reads an own-property dot path; inherited and missing keys give undefined (SPEC R12 baseline). */
export function field(item: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value != null && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, key)
          ? (value as Record<string, unknown>)[key]
          : undefined,
      item,
    );
}

/** Pixel heights of the baseline Vuetify avatar size names, so the names render the same everywhere. */
const NAMED_SIZES: Record<string, number> = { "x-small": 24, small: 32, default: 40, large: 48, "x-large": 56 };

/** CSS length for an avatar `size`: numbers and numeric strings are pixels, size names map, other strings pass through. */
export function avatarLength(size: string | number | undefined): string {
  if (typeof size === "number") return `${size}px`;
  const value = String(size ?? "").trim();
  if (!value) return "32px";
  if (value in NAMED_SIZES) return `${NAMED_SIZES[value]}px`;
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

type Props = Required<Pick<AvatarStackProps, "max" | "nameKey" | "avatarKey" | "itemKey" | "unknownLabel" | "overflowLabel">> & AvatarStackProps;

/** Provider-neutral WAvatarStack behavior: max normalization, overflow, field paths, names and initials. */
export function useAvatarStack(props: Props) {
  const count = computed(() => (Number.isFinite(props.max) ? Math.max(0, Math.floor(props.max)) : 3));
  const items = computed(() => (Array.isArray(props.items) ? props.items : []));
  const visibleItems = computed(() => items.value.slice(0, count.value));
  const overflowItems = computed(() => items.value.slice(count.value));
  const overflowCount = computed(() => overflowItems.value.length);
  const overflowName = computed(() => props.overflowLabel || `+${overflowCount.value}`);
  const getName = (item: unknown) => {
    const value = field(item, props.nameKey);
    return typeof value === "string" && value.trim() ? value : props.unknownLabel;
  };
  const getAvatar = (item: unknown) => {
    const value = field(item, props.avatarKey);
    return typeof value === "string" && (value.startsWith("http") || value.startsWith("/") || value.startsWith("data:")) ? value : "";
  };
  const getKey = (item: unknown, index: number) => {
    const value = field(item, props.itemKey);
    return typeof value === "string" || typeof value === "number" ? value : index;
  };
  /** First Unicode code point of the first two words; missing names render `?`. */
  const initials = (item: unknown) => {
    const value = field(item, props.nameKey);
    if (typeof value !== "string" || !value.trim() || value === "—") return "?";
    return value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => Array.from(word)[0])
      .join("")
      .toUpperCase();
  };
  return { visibleItems, overflowItems, overflowCount, overflowName, getName, getAvatar, getKey, initials };
}
