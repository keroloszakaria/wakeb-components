import { WakebError } from "./errors";
import type { WakebComponentName, WakebDefaults, WakebTheme, WakebThemeTokens } from "./options";

export const COMPONENTS: readonly WakebComponentName[] = [
  "WTruncatedText",
  "WSegmentedProgress",
  "WSemiCircleGauge",
  "WAvatarStack",
  "WLoading",
  "WPageSkeleton",
  "WVerticalSteps",
  "WButton",
  "WBadge",
  "WAccordion",
  "WBadgeStack",
  "WUserBadge",
  "WTooltipBtn",
  "WTabs",
  "WTree",
  "WDropdown",
  "WCarousel",
  "WExportDropdown",
  "WBaseSidebar",
  "WModal",
  "WDrawer",
];

/** Data and model props never come from plugin defaults (SPEC R06); the type rejects them too. */
export const CONTROLLED_PROPS = [
  "items",
  "nodes",
  "tabs",
  "steps",
  "slides",
  "config",
  "user",
  "menuItems",
  "formats",
  "modelValue",
  "selectedTab",
  "expandedKeys",
  "activeKey",
  "activePath",
  "editingNodeId",
] as const;

const invalid = (message: string) => new WakebError("WAKEB_CONFIG_INVALID", message);
const isPlain = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype;

/** Copies plain objects and arrays so neither the source config nor another instance shares them. */
export function clone<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clone) as T;
  if (isPlain(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)])) as T;
  return value;
}

export function validateDefaults(defaults: unknown): WakebDefaults {
  if (defaults === undefined) return {};
  if (!isPlain(defaults)) throw invalid("defaults must be an object keyed by component name, for example { WButton: { size: 'md' } }.");
  const result: Record<string, Record<string, unknown>> = {};
  for (const [component, props] of Object.entries(defaults)) {
    if (!COMPONENTS.includes(component as WakebComponentName))
      throw invalid(`defaults.${component} is not a Wakeb component. Use one of the 21 public names, such as WButton or WModal.`);
    if (!isPlain(props)) throw invalid(`defaults.${component} must be an object of component props.`);
    for (const [prop, value] of Object.entries(props)) {
      const path = `defaults.${component}.${prop}`;
      if ((CONTROLLED_PROPS as readonly string[]).includes(prop))
        throw invalid(`${path} is data or model state, which belongs to each instance. Pass it on the component instead.`);
      if (/^on[A-Z]/.test(prop)) throw invalid(`${path} is an event listener; defaults hold props only. Bind it on the component.`);
      if (typeof value === "function")
        throw invalid(`${path} is a callback; callbacks such as label formatters stay on the component instance.`);
      if (value === undefined) throw invalid(`${path} is undefined, which means absent. Remove the key.`);
    }
    result[component] = clone(props);
  }
  return result;
}

const TOKEN_KINDS: Record<keyof WakebThemeTokens, "color" | "length" | "font" | "integer"> = {
  primary: "color",
  onPrimary: "color",
  secondary: "color",
  success: "color",
  warning: "color",
  danger: "color",
  info: "color",
  neutral: "color",
  surface: "color",
  onSurface: "color",
  muted: "color",
  border: "color",
  focus: "color",
  radius: "length",
  spacing: "length",
  fontFamily: "font",
  zIndexOverlay: "integer",
};
const COLOR = /^(#[0-9a-f]{3,4}|#[0-9a-f]{6}|#[0-9a-f]{8}|(rgb|rgba|hsl|hsla|oklch|oklab|color-mix)\([^;{}]*\)|var\(--[\w-]+\)|transparent|currentColor|[a-z]+)$/i;
const LENGTH = /^(0|-?\d*\.?\d+(px|rem|em|%)|var\(--[\w-]+\)|calc\([^;{}]*\))$/i;
const FONT = /^[^;{}<>]+$/;
const kebab = (key: string) => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/** Validates theme options and returns the `--wakeb-ui-*` variables they define (SPEC R05, R17). */
export function validateTheme(theme: unknown): { mode?: "light" | "dark"; tokens: WakebThemeTokens; variables: Record<string, string> } {
  if (theme === undefined) return { tokens: {}, variables: {} };
  if (!isPlain(theme)) throw invalid("theme must be an object: { mode?: 'light' | 'dark', tokens?: { ... } }.");
  for (const key of Object.keys(theme))
    if (key !== "mode" && key !== "tokens") throw invalid(`Unknown theme option '${key}'. Supported: 'mode', 'tokens'.`);
  const { mode, tokens = {} } = theme as WakebTheme;
  if (mode !== undefined && mode !== "light" && mode !== "dark")
    throw invalid(`theme.mode must be 'light' or 'dark'; received ${JSON.stringify(mode)}.`);
  if (!isPlain(tokens)) throw invalid("theme.tokens must be an object of Wakeb token values.");
  const variables: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    const kind = TOKEN_KINDS[key as keyof WakebThemeTokens];
    const path = `theme.tokens.${key}`;
    if (!kind) throw invalid(`Unknown token '${key}'. Supported tokens: ${Object.keys(TOKEN_KINDS).join(", ")}.`);
    if (kind === "integer") {
      if (!Number.isInteger(value)) throw invalid(`${path} must be an integer; received ${JSON.stringify(value)}.`);
    } else {
      const pattern = kind === "color" ? COLOR : kind === "length" ? LENGTH : FONT;
      if (typeof value !== "string" || !pattern.test(value.trim()))
        throw invalid(`${path} must be a CSS ${kind === "font" ? "font-family list" : kind} value; received ${JSON.stringify(value)}.`);
    }
    variables[`--wakeb-ui-${kebab(key)}`] = String(value).trim();
  }
  return { mode, tokens: { ...(tokens as WakebThemeTokens) }, variables };
}

/**
 * Built-in UI strings that differ from the English Wakeb defaults (SPEC R05). Explicit props and
 * plugin defaults both win over these.
 */
export const LOCALE_DEFAULTS: Record<"ar", Partial<Record<WakebComponentName, Record<string, unknown>>>> = {
  ar: {
    WLoading: { label: "جارٍ التحميل" },
    WPageSkeleton: { label: "جارٍ تحميل المحتوى" },
    WVerticalSteps: { label: "الخطوات" },
    WAvatarStack: { unknownLabel: "مستخدم غير معروف" },
    WTabs: { ariaLabel: "علامات التبويب" },
    WTree: { ariaLabel: "شجرة", toggleLabel: "توسيع الفرع أو طيه" },
    WCarousel: { ariaLabel: "عرض متتابع", indicatorLabel: (index: number) => `الانتقال إلى الشريحة ${index + 1}` },
    WExportDropdown: {
      formats: [
        { label: "تصدير بصيغة PDF", value: "pdf" },
        { label: "تصدير بصيغة Excel", value: "xlsx" },
      ],
    },
    WBaseSidebar: { filterLabel: "تصفية", cancelLabel: "إلغاء", emptyLabel: "لا توجد بيانات" },
    WModal: { closeLabel: "إغلاق", loadingLabel: "جارٍ التحميل", ariaLabel: "نافذة حوار" },
    WDrawer: { closeLabel: "إغلاق", loadingLabel: "جارٍ التحميل", ariaLabel: "لوحة جانبية" },
  },
};
