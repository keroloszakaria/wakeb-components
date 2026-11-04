import { computed } from "vue";
import { truncateText } from "wakeb-utils";
import { useColor, useVariant } from "../core/vocabulary";
import type { BadgeProps, BadgeStackItem, BadgeStackProps, WakebColor } from "../types";

/** Defaults shared by every WBadgeStack renderer; providers must not change them. */
export const badgeStackDefaults = {
  items: () => [],
  max: 1,
  truncateLength: 12,
  showOverflowMenu: false,
  badgeType: "transparent",
  badgeVariant: "soft",
  badgeBorderRadius: "md",
  customBorderRadius: "sm",
  badgePadding: "",
  badgeClassList: "",
  isDot: false,
  iconSize: "xs",
  iconPosition: "before",
  iconVariant: "default",
  iconBackgroundOpacity: 1,
  customOverflowBorderRadius: "999px",
  overflowLabel: "",
  overflowTag: "button",
} as const;

const ICON_PIXELS: Record<string, number> = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 };

type Props = Required<Pick<BadgeStackProps, "max" | "truncateLength" | "badgeType" | "badgeBorderRadius" | "customBorderRadius" | "badgePadding" | "badgeClassList" | "isDot" | "iconSize" | "iconPosition" | "iconBackgroundOpacity" | "overflowLabel">> &
  BadgeStackProps;

/**
 * Provider-neutral WBadgeStack behavior: slicing, overflow count, per-item badge props (item values,
 * including false and empty, win over stack values), icon backgrounds and label truncation.
 */
export function useBadgeStack(props: Props) {
  // Normalized here so deprecation warnings name the stack prop the caller used.
  const toVariant = useVariant("WBadgeStack");
  const toColor = useColor("WBadgeStack");
  const stackVariant = computed(() => toVariant(props.badgeVariant, "badgeVariant", "soft"));
  const stackDot = computed(() => toColor(props.dotColor, "dotColor", "").css);
  const items = computed(() => (Array.isArray(props.items) ? props.items : []));
  const visibleItems = computed(() => items.value.slice(0, props.max));
  const overflowItems = computed(() => items.value.slice(props.max));
  const overflowCount = computed(() => Math.max(items.value.length - props.max, 0));
  const overflowName = computed(() => props.overflowLabel || `+${overflowCount.value}`);
  const iconWrapStyle = (item: BadgeStackItem) => {
    const color = toColor(item.color, "items[].color", "var(--wakeb-badge-stack-icon-background, #087f8c)").css;
    const percent = Math.round(Math.min(Math.max(Number(props.iconBackgroundOpacity) || 0, 0), 1) * 100);
    return { backgroundColor: percent >= 100 ? color : `color-mix(in srgb, ${color} ${percent}%, transparent)` };
  };
  const resolveBadgeProps = (item: BadgeStackItem): BadgeProps => ({
    type: item.type ?? props.badgeType,
    variant: item.variant === undefined ? stackVariant.value : toVariant(item.variant, "items[].variant", stackVariant.value),
    borderRadius: item.borderRadius ?? props.badgeBorderRadius,
    customBorderRadius: item.customBorderRadius ?? props.customBorderRadius,
    customPadding: item.customPadding ?? props.badgePadding,
    dotColor: (item.dotColor === undefined ? stackDot.value : toColor(item.dotColor, "items[].dotColor", stackDot.value as WakebColor | "").css) as WakebColor,
    isDot: item.isDot ?? props.isDot,
    classList: item.classList ?? props.badgeClassList,
    icon: item.badgeIcon,
    iconSize: item.iconSize ?? props.iconSize,
    iconPosition: item.iconPosition ?? props.iconPosition,
  });
  const truncate = (text: string | undefined) => truncateText(text || "", props.truncateLength);
  /** Pixel size for an item's badge glyph: size names map to pixels, anything else passes through. */
  const glyphSize = (item: BadgeStackItem) => ICON_PIXELS[String(item.iconSize ?? props.iconSize)] ?? item.iconSize ?? props.iconSize;
  return { stackVariant, visibleItems, overflowItems, overflowCount, overflowName, iconWrapStyle, resolveBadgeProps, truncate, glyphSize };
}
