import { inject } from "vue";
import { WAKEB_CONTEXT, warnOnce } from "./runtime";
import type { SkeletonRow } from "../types";

/*
 * Wakeb-owned skeleton grid (SPEC R16). Breakpoints are fixed at sm 600px, md 960px and lg 1280px
 * and rendered by `src/styles/grid.scss`, so a provider's own breakpoint settings never change it.
 */
export const GRID_BREAKPOINTS = { sm: 600, md: 960, lg: 1280 } as const;
type Span = SkeletonRow["cols"];

/** The class suffix for a span: `1`–`12`, `auto` or `grow` (boolean true); undefined when the value is invalid. */
const suffix = (value: Span): string | undefined => {
  if (value === true) return "grow";
  if (value === "auto") return "auto";
  const number = typeof value === "string" && /^\d+$/.test(value.trim()) ? Number(value) : value;
  return typeof number === "number" && Number.isInteger(number) && number >= 1 && number <= 12 ? String(number) : undefined;
};

/**
 * Returns a function that maps a row's `cols`, `sm`, `md` and `lg` to grid classes. `cols` keeps the
 * 0.7 rule that a falsy value means 12. Breakpoint values that are `false`, `undefined` or empty add
 * nothing. Other invalid values are ignored, or use 12 for `cols`, with `WAKEB_UNKNOWN_VALUE`.
 */
export function useSkeletonGrid(component: string) {
  const context = inject(WAKEB_CONTEXT, null);
  const warn = (prop: string, value: unknown, using: string) => {
    if (process.env.NODE_ENV !== "production")
      warnOnce(context, "WAKEB_UNKNOWN_VALUE", `${component}.${prop}.${String(value)}`, `${component} ${prop} ${JSON.stringify(value)} is not a grid span; ${using}. Use 1–12, 'auto' or true.`);
  };
  return (row: SkeletonRow): string[] => {
    const classes = ["wakeb-grid-col"];
    const cols = row.cols || 12;
    const base = suffix(cols);
    if (!base) warn("config[].cols", cols, "using 12");
    classes.push(`wakeb-grid-col--${base ?? "12"}`);
    for (const breakpoint of ["sm", "md", "lg"] as const) {
      const value = row[breakpoint];
      if (value === undefined || value === false || value === "") continue;
      const span = suffix(value);
      if (span) classes.push(`wakeb-grid-col--${breakpoint}-${span}`);
      else warn(`config[].${breakpoint}`, value, "ignoring it");
    }
    return classes;
  };
}
