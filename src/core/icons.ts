import { inject } from "vue";
import { WakebError } from "./errors";
import { WAKEB_CONTEXT, warnOnce, type WakebContext } from "./runtime";
import type { WakebIconsOptions } from "./options";
import type { SharedIcon, WakebIconComponent, WakebIconDefinition, WakebSvgIcon } from "../types";

/*
 * Wakeb-owned icons (SPEC R15). A string icon is a name; it resolves in this order:
 *   1. `svg:<path>` compatibility strings become one SVG path.
 *   2. `icons.aliases[name]` from the plugin options.
 *   3. `icons.resolve(name)` from the plugin options.
 *   4. The Wakeb built-in SVGs below.
 *   5. The selected provider's own icon set, where it has one (Vuetify VIcon names; PrimeIcons
 *      classes under PrimeVue). Anything else renders FALLBACK_ICON with WAKEB_ICON_UNRESOLVED.
 * Arrays (SVG paths) and Vue components render as they are. Nothing is rendered from HTML strings.
 */

/** Built-in 24×24 SVG paths (Material Design Icons, Apache-2.0) for the names Wakeb uses by default. */
export const BUILTIN_ICONS: Readonly<Record<string, WakebSvgIcon>> = Object.freeze({
  $expand: ["M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"],
  $collapse: ["M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"],
  $prev: ["M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"],
  $next: ["M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"],
  $close: ["M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"],
  $loading: ["M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"],
  $complete: ["M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"],
  $checkboxOn: ["M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"],
  $checkboxOff: ["M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"],
  $radioOn: ["M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"],
  $radioOff: ["M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"],
});

/** Deterministic placeholder for an unresolved name: a box outline with a faint fill. */
export const FALLBACK_ICON: WakebSvgIcon = Object.freeze([["M4,4H20V20H4Z", 0.2], "M3,3H21V21H3V3M5,5V19H19V5H5Z"] as const);

/** The configured part of icon resolution, frozen per plugin and read from the app context. */
export interface WakebIconRegistry {
  readonly aliases: Readonly<Record<string, WakebIconDefinition>>;
  readonly resolve?: (name: string) => WakebIconDefinition | undefined;
}

export type ResolvedIcon =
  | { readonly kind: "svg"; readonly paths: WakebSvgIcon }
  | { readonly kind: "component"; readonly component: WakebIconComponent }
  | { readonly kind: "name"; readonly name: string };

export const NO_ICONS: WakebIconRegistry = Object.freeze({ aliases: Object.freeze(Object.create(null)) });
/** Path data only: commands, numbers and separators. Markup such as `<svg>` is rejected. */
const PATH_DATA = /^[MmZzLlHhVvCcSsQqTtAa0-9eE.,+\-\s]+$/;
const invalid = (message: string) => new WakebError("WAKEB_CONFIG_INVALID", message);
const isPlain = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype;

const isPath = (value: unknown): value is string => typeof value === "string" && PATH_DATA.test(value) && /[Mm]/.test(value);
const isPathEntry = (entry: unknown) =>
  isPath(entry) ||
  (Array.isArray(entry) && entry.length === 2 && isPath(entry[0]) && typeof entry[1] === "number" && entry[1] >= 0 && entry[1] <= 1);
const isSvgIcon = (value: unknown): value is WakebSvgIcon => Array.isArray(value) && value.length > 0 && value.every(isPathEntry);
/** Functions are functional components; objects must look like a component definition. */
const isComponent = (value: unknown): value is WakebIconComponent =>
  typeof value === "function" ||
  (typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    ["render", "setup"].some((key) => typeof (value as Record<string, unknown>)[key] === "function"));
export const isIconDefinition = (value: unknown): value is WakebIconDefinition => isSvgIcon(value) || isComponent(value);

/** Validates the `icons` plugin option and detaches it from the caller's objects. */
export function validateIcons(icons: unknown): WakebIconRegistry {
  if (icons === undefined) return NO_ICONS;
  if (!isPlain(icons))
    throw invalid("icons must be an object such as { aliases: { check: [svgPath] }, resolve: (name) => component }.");
  for (const key of Object.keys(icons))
    if (key !== "aliases" && key !== "resolve") throw invalid(`Unknown icons option '${key}'. Supported: 'aliases', 'resolve'.`);
  const { aliases, resolve } = icons;
  if (resolve !== undefined && typeof resolve !== "function")
    throw invalid("icons.resolve must be a function (name) => SVG paths | component | undefined.");
  if (aliases !== undefined && !isPlain(aliases)) throw invalid("icons.aliases must be an object keyed by icon name.");
  const copy: Record<string, WakebIconDefinition> = Object.create(null);
  for (const [name, value] of Object.entries(aliases ?? {})) {
    if (!name.trim()) throw invalid("icons.aliases keys must be non-empty icon names.");
    if (!isIconDefinition(value))
      throw invalid(
        `icons.aliases.${name} must be SVG path data (a non-empty array of path strings or [path, opacity] pairs) or a Vue component. Strings, HTML and other names are not accepted.`,
      );
    copy[name] = Array.isArray(value) ? Object.freeze(value.map((entry) => (Array.isArray(entry) ? Object.freeze([...entry]) : entry))) as WakebSvgIcon : value;
  }
  return Object.freeze({ aliases: Object.freeze(copy), resolve: resolve as WakebIconRegistry["resolve"] });
}

/** Resolves an icon value; names that nothing Wakeb-owned resolves come back as `kind: "name"`. */
export function resolveIcon(registry: WakebIconRegistry, icon: SharedIcon | null | undefined, context: WakebContext | null = null): ResolvedIcon | undefined {
  if (!icon) return undefined;
  if (Array.isArray(icon)) return { kind: "svg", paths: icon };
  if (typeof icon !== "string") return { kind: "component", component: icon as WakebIconComponent };
  if (icon.startsWith("svg:")) return { kind: "svg", paths: [icon.slice(4)] };
  const fromAlias = Object.prototype.hasOwnProperty.call(registry.aliases, icon) ? registry.aliases[icon] : undefined;
  const found = fromAlias ?? registry.resolve?.(icon);
  if (found !== undefined && found !== null) {
    if (isSvgIcon(found)) return { kind: "svg", paths: found };
    if (isComponent(found)) return { kind: "component", component: found };
    if (process.env.NODE_ENV !== "production")
      warnOnce(context, "WAKEB_ICON_UNRESOLVED", `resolve.${icon}`, `icons.resolve('${icon}') returned a value that is neither SVG path data nor a Vue component; it is ignored.`);
  }
  const builtin = Object.prototype.hasOwnProperty.call(BUILTIN_ICONS, icon) ? BUILTIN_ICONS[icon] : undefined;
  return builtin ? { kind: "svg", paths: builtin } : { kind: "name", name: icon };
}

/** Value for Vuetify VIcon: resolved SVG paths and components, or the name for Vuetify's own icon set. */
export type VuetifyIconValue = string | (string | [string, number])[] | WakebIconComponent;

/**
 * Vuetify renderers: Wakeb resolution first, then VIcon keeps rendering unresolved names through the
 * host Vuetify icon configuration, which is the matching resolver for MDI and `$alias` names.
 */
export function useVuetifyIcon() {
  const context = inject(WAKEB_CONTEXT, null);
  const registry = context?.icons ?? NO_ICONS;
  return (icon: SharedIcon | null | undefined): VuetifyIconValue | undefined => {
    const resolved = resolveIcon(registry, icon, context);
    if (!resolved) return undefined;
    if (resolved.kind === "svg") return resolved.paths as VuetifyIconValue;
    return resolved.kind === "component" ? resolved.component : resolved.name;
  };
}
