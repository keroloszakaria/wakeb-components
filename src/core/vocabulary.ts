import { inject } from "vue";
import { WAKEB_CONTEXT, warnOnce } from "./runtime";
import type { WakebBadgeType, WakebColor, WakebDeprecatedVariant, WakebIntent, WakebSkeletonName, WakebVariant } from "../types";

/** Portable style values (SPEC R23). Adapters translate them; consumers never pass native names. */
export const VARIANTS: readonly WakebVariant[] = ["soft", "solid", "outline", "ghost"];

/** Baseline values accepted for one major release on every provider. */
export const VARIANT_ALIASES: Readonly<Record<WakebDeprecatedVariant, WakebVariant>> = {
  default: "soft",
  tonal: "soft",
  flat: "solid",
  elevated: "solid",
  outlined: "outline",
  text: "ghost",
  plain: "ghost",
};

/**
 * Returns a function that maps a variant prop to its portable value. Deprecated aliases map to
 * their replacement and unknown values fall back to `fallback`; in development both report once
 * per app, component, prop and value.
 */
export function useVariant(component: string) {
  const context = inject(WAKEB_CONTEXT, null);
  return (value: string | undefined, prop: string, fallback: WakebVariant): WakebVariant => {
    if (value === undefined) return fallback;
    if ((VARIANTS as readonly string[]).includes(value)) return value as WakebVariant;
    const alias = VARIANT_ALIASES[value as WakebDeprecatedVariant];
    if (process.env.NODE_ENV !== "production") {
      const key = `${component}.${prop}.${value}`;
      if (alias)
        warnOnce(context, "WAKEB_DEPRECATED_VALUE", key, `${component} ${prop} '${value}' is deprecated; use '${alias}'. The alias is removed in the next major release.`);
      else
        warnOnce(context, "WAKEB_UNKNOWN_VALUE", key, `${component} ${prop} '${value}' is not a Wakeb variant; using '${fallback}'. Use one of: ${VARIANTS.join(", ")}.`);
    }
    return alias ?? fallback;
  };
}

/** Draft Vuetify mapping table for the tested Vuetify 3.13 versions (SPEC R23 visual policy). */
export const VUETIFY_VARIANTS: Readonly<Record<WakebVariant, "tonal" | "flat" | "outlined" | "text">> = {
  soft: "tonal",
  solid: "flat",
  outline: "outlined",
  ghost: "text",
};

/* ------------------------------------------------------------------------------------------------
 * Intents and color props (SPEC R23). A color prop takes a Wakeb intent or a CSS color value.
 * ---------------------------------------------------------------------------------------------- */

export const INTENTS: readonly WakebIntent[] = ["primary", "secondary", "success", "warning", "danger", "info", "neutral"];

/** Light-mode fallbacks used when neither a Wakeb token nor a provider bridge supplies the intent. */
const INTENT_FALLBACKS: Readonly<Record<WakebIntent, string>> = {
  primary: "#087f8c",
  secondary: "#475467",
  success: "#12b76a",
  warning: "#f79009",
  danger: "#f04438",
  info: "#2e90fa",
  neutral: "#667085",
};

/** Provider bridge: how an adapter reads its own theme color for an intent when no token is set. */
export type IntentBridge = Partial<Readonly<Record<WakebIntent, string>>>;

/** Vuetify theme colors behind each intent, so an unconfigured app keeps its Vuetify theme. */
export const VUETIFY_INTENTS: IntentBridge = {
  primary: "rgb(var(--v-theme-primary))",
  secondary: "rgb(var(--v-theme-secondary))",
  success: "rgb(var(--v-theme-success))",
  warning: "rgb(var(--v-theme-warning))",
  danger: "rgb(var(--v-theme-error))",
  info: "rgb(var(--v-theme-info))",
};

/** PrimeVue preset colors behind each intent. */
export const PRIMEVUE_INTENTS: IntentBridge = { primary: "var(--p-primary-color)" };

/**
 * shadcn-vue theme variables behind each intent. shadcn-vue 2 themes (Tailwind CSS 4) store complete
 * colors in `--primary` and `--destructive`; an app without a shadcn-vue theme gets the Wakeb fallback.
 */
export const SHADCN_INTENTS: IntentBridge = { primary: "var(--primary, #087f8c)", danger: "var(--destructive, #f04438)" };

/** The CSS for an intent: its `--wakeb-ui-*` token, then the provider bridge, then the Wakeb fallback. */
export const intentColor = (intent: WakebIntent, bridge: IntentBridge = {}) =>
  `var(--wakeb-ui-${intent}, ${bridge[intent] ?? INTENT_FALLBACKS[intent]})`;

/** CSS color syntax accepted by portable color props. Bare words other than these two are not. */
const CSS_COLOR = /^(#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\([^;{}]*\)|var\(--[\w-]+(?:\s*,[^;{}]*)?\)|transparent|currentColor)$/i;

export const isCssColor = (value: string) => CSS_COLOR.test(value.trim());

/**
 * A resolved color prop. `css` is empty when the prop and its fallback are both empty (no override).
 * `native` is set only for a deprecated provider name the adapter renders itself.
 */
export interface ResolvedColor {
  css: string;
  native?: string;
}

/**
 * Returns a function that resolves a color prop. Intents become token CSS and CSS colors pass
 * through. Any other value is a provider theme or palette name: with `acceptsNativeNames` (the
 * Vuetify adapter during the deprecation window) it is kept as `native` with
 * `WAKEB_DEPRECATED_VALUE`; otherwise it falls back with `WAKEB_UNKNOWN_VALUE`.
 */
export function useColor(component: string, bridge: IntentBridge = {}, acceptsNativeNames = false) {
  const context = inject(WAKEB_CONTEXT, null);
  return (value: string | undefined, prop: string, fallback: WakebColor | ""): ResolvedColor => {
    const resolve = (color: string) => ((INTENTS as readonly string[]).includes(color) ? intentColor(color as WakebIntent, bridge) : color.trim());
    if (value === undefined || value === "") return { css: resolve(fallback) };
    if ((INTENTS as readonly string[]).includes(value) || isCssColor(value)) return { css: resolve(value) };
    if (process.env.NODE_ENV !== "production") {
      const key = `${component}.${prop}.${value}`;
      if (acceptsNativeNames)
        warnOnce(context, "WAKEB_DEPRECATED_VALUE", key, `${component} ${prop} '${value}' is a provider color name and is not portable; use an intent (${INTENTS.join(", ")}) or a CSS color. Provider names are removed in the next major release.`);
      else
        warnOnce(context, "WAKEB_UNKNOWN_VALUE", key, `${component} ${prop} '${value}' is not a Wakeb intent or CSS color; using '${fallback}'. Use one of: ${INTENTS.join(", ")}, #hex, rgb(), hsl() or var(--…).`);
    }
    return acceptsNativeNames ? { css: value, native: value } : { css: resolve(fallback) };
  };
}

/**
 * Props for a Vuetify primitive that paints a background: a deprecated native name stays a Vuetify
 * `color`; anything else becomes inline Wakeb CSS with the given text color.
 */
export const vuetifyFill = (color: ResolvedColor, text: string) =>
  color.native ? { color: color.native } : { style: { backgroundColor: color.css, color: text } };

/** WBadge style keys rendered by Wakeb CSS (frozen in M0). */
export const BADGE_TYPES: readonly WakebBadgeType[] = [
  "success", "success-transparent", "primary", "primarybtn", "danger", "danger-transparent", "warning", "info",
  "transparent", "dark", "tertiary", "outline", "outline-secondary", "check", "uncheck",
];

/* ------------------------------------------------------------------------------------------------
 * Skeleton grammar (SPEC R16): comma-separated portable names, each optionally `@N`.
 * ---------------------------------------------------------------------------------------------- */

export const SKELETON_NAMES: readonly WakebSkeletonName[] = [
  "text", "paragraph", "heading", "avatar", "image", "button", "chip", "list-item", "list-item-avatar",
  "list-item-two-line", "list-item-three-line", "list-item-avatar-two-line", "list-item-avatar-three-line",
  "table", "table-row", "card",
];

/** Vuetify 3.13 skeleton names outside the portable grammar, kept under Vuetify with a warning. */
export const VUETIFY_SKELETON_EXTRAS: readonly string[] = [
  "actions", "article", "card-avatar", "date-picker", "date-picker-options", "date-picker-days", "date-picker-header",
  "divider", "ossein", "sentences", "subtitle", "table-heading", "table-thead", "table-tbody", "table-tfoot",
  "table-row-divider", "table-cell",
];

export const SKELETON_REPEAT_LIMIT = 100;

/**
 * Returns a function that parses a skeleton descriptor into a normalized sequence. Repetitions are
 * capped at 100 per item. Unknown names and malformed repetitions are dropped with
 * `WAKEB_UNKNOWN_VALUE`; an empty result becomes `text`.
 */
export function useSkeleton(component: string, acceptsNativeNames = false) {
  const context = inject(WAKEB_CONTEXT, null);
  return (value: string | undefined, prop: string): string => {
    const parts: string[] = [];
    for (const raw of String(value ?? "").split(",")) {
      const part = raw.trim();
      if (!part) continue;
      const match = /^([a-z-]+)(?:@(\d+))?$/.exec(part);
      const name = match?.[1] ?? "";
      const count = match?.[2] === undefined ? 1 : Number(match[2]);
      const portable = (SKELETON_NAMES as readonly string[]).includes(name);
      const native = acceptsNativeNames && VUETIFY_SKELETON_EXTRAS.includes(name);
      if (!match || count < 1 || (!portable && !native)) {
        if (process.env.NODE_ENV !== "production")
          warnOnce(context, "WAKEB_UNKNOWN_VALUE", `${component}.${prop}.${part}`, `${component} ${prop} '${part}' is not a Wakeb skeleton; it is skipped. Use one of: ${SKELETON_NAMES.join(", ")}, each optionally followed by @N.`);
        continue;
      }
      if (process.env.NODE_ENV !== "production") {
        if (native)
          warnOnce(context, "WAKEB_DEPRECATED_VALUE", `${component}.${prop}.${name}`, `${component} ${prop} '${name}' is a Vuetify skeleton name and is not portable. Provider names are removed in the next major release.`);
        if (count > SKELETON_REPEAT_LIMIT)
          warnOnce(context, "WAKEB_UNKNOWN_VALUE", `${component}.${prop}.${part}`, `${component} ${prop} '${part}' repeats more than ${SKELETON_REPEAT_LIMIT} times; using ${SKELETON_REPEAT_LIMIT}.`);
      }
      const capped = Math.min(count, SKELETON_REPEAT_LIMIT);
      parts.push(capped === 1 ? name : `${name}@${capped}`);
    }
    return parts.length ? parts.join(", ") : "text";
  };
}
