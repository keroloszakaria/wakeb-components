import { inject } from "vue";
import { WAKEB_CONTEXT, warnOnce } from "./runtime";
import type { WakebDeprecatedVariant, WakebVariant } from "../types";

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
