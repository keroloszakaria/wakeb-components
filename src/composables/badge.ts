import { computed, inject, type CSSProperties } from "vue";
import { BADGE_TYPES, useColor, useVariant } from "../core/vocabulary";
import { WAKEB_CONTEXT, warnOnce } from "../core/runtime";
import type { BadgeProps, WakebBadgeType } from "../types";

/** Defaults shared by every WBadge renderer; providers must not change them. */
export const badgeDefaults = {
  label: "",
  classList: "",
  type: "primary",
  icon: "",
  isDot: false,
  borderRadius: "md",
  customBorderRadius: "",
  customPadding: "",
  variant: "soft",
  iconSize: "xs",
  iconPosition: "before",
  chipAttrs: () => ({}),
} as const;

const ICON_PIXELS: Record<string, number> = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 };

type ResolvedBadgeProps = BadgeProps & Required<Pick<BadgeProps, "type" | "borderRadius" | "customBorderRadius" | "customPadding" | "iconSize">>;

/**
 * Provider-neutral WBadge behavior: portable variant, Wakeb type class, dot color, chip style and icon
 * size. Wakeb types are painted by the shared Wakeb CSS (`styles/badge.scss`). Another type is a
 * provider color name from the 0.7 contract: with `nativeTypes` (Vuetify, during the deprecation
 * window) it stays the type class and is returned as `nativeColor` with WAKEB_DEPRECATED_VALUE;
 * otherwise it falls back to `primary` with WAKEB_UNKNOWN_VALUE (SPEC R23).
 */
export function useBadge(props: ResolvedBadgeProps, options: { nativeTypes: boolean }) {
  const toVariant = useVariant("WBadge");
  const variant = computed(() => toVariant(props.variant, "variant", "soft"));
  const toColor = useColor("WBadge");
  const dot = computed(() => toColor(props.dotColor, "dotColor", "").css);
  const context = inject(WAKEB_CONTEXT, null);
  const known = computed(() => (BADGE_TYPES as readonly string[]).includes(props.type));
  const nativeColor = computed(() => {
    if (known.value || !options.nativeTypes) return undefined;
    if (process.env.NODE_ENV !== "production")
      warnOnce(context, "WAKEB_DEPRECATED_VALUE", `WBadge.type.${props.type}`, `WBadge type '${props.type}' is not a Wakeb badge type; it is passed to Vuetify as a color name, which is not portable. Use one of: ${BADGE_TYPES.join(", ")}. Provider names are removed in the next major release.`);
    return props.type;
  });
  const type = computed<string>(() => {
    if (known.value || options.nativeTypes) return props.type;
    if (process.env.NODE_ENV !== "production")
      warnOnce(context, "WAKEB_UNKNOWN_VALUE", `WBadge.type.${props.type}`, `WBadge type '${props.type}' is not a Wakeb badge type; using 'primary'. Use one of: ${BADGE_TYPES.join(", ")}.`);
    return "primary" satisfies WakebBadgeType;
  });
  const classes = computed(() => [
    "wakeb-badge",
    type.value,
    `wakeb-badge--${variant.value}`,
    props.classList,
    `border-radius-${props.borderRadius}`,
    { "badge--custom-padding": props.customPadding },
  ]);
  const pixelSize = computed(() => ICON_PIXELS[String(props.iconSize)] ?? props.iconSize);
  const chipStyle = computed<CSSProperties>(() => ({
    ...(props.customBorderRadius ? { borderRadius: props.customBorderRadius } : {}),
    ...(props.customPadding ? { padding: props.customPadding, height: "auto" } : {}),
    ...(dot.value ? { "--wakeb-badge-current-dot": dot.value } : {}),
  }));
  const dotStyle = computed(() => (dot.value ? { backgroundColor: dot.value } : undefined));
  return { variant, nativeColor, classes, pixelSize, chipStyle, dotStyle };
}
