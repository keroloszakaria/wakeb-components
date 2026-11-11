import { inject } from "vue";
import { WAKEB_CONTEXT, warnOnce } from "./runtime";
import type { ColProps, RowProps, SkeletonRow } from "../types";

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

/** WRow classes: gutters and alignment. Unknown align and justify values are ignored with WAKEB_UNKNOWN_VALUE. */
const ALIGN = ["start", "center", "end", "baseline", "stretch"];
const JUSTIFY = ["start", "center", "end", "space-between", "space-around", "space-evenly"];
export function useGridRow(component: string) {
  const context = inject(WAKEB_CONTEXT, null);
  const check = (prop: string, value: string | undefined, allowed: string[]) => {
    if (value === undefined || allowed.includes(value)) return value;
    if (process.env.NODE_ENV !== "production")
      warnOnce(context, "WAKEB_UNKNOWN_VALUE", `${component}.${prop}.${value}`, `${component} ${prop} ${JSON.stringify(value)} is not supported; it is ignored. Use one of: ${allowed.join(", ")}.`);
    return undefined;
  };
  return (props: RowProps): string[] => {
    const align = check("align", props.align, ALIGN);
    const justify = check("justify", props.justify, JUSTIFY);
    return [
      "wakeb-grid-row",
      props.noGutters ? "wakeb-grid-row--no-gutters" : props.dense ? "wakeb-grid-row--dense" : "",
      align ? `wakeb-grid-row--align-${align}` : "",
      justify ? `wakeb-grid-row--justify-${justify}` : "",
    ].filter(Boolean);
  };
}

/**
 * WCol classes. Like VCol, an unset `cols` grows to share the row; `sm`, `md` and `lg` apply from
 * 600px, 960px and 1280px. Invalid spans are ignored with WAKEB_UNKNOWN_VALUE.
 */
export function useGridColumn(component: string) {
  const context = inject(WAKEB_CONTEXT, null);
  return (props: ColProps): string[] => {
    const classes = ["wakeb-grid-col"];
    for (const breakpoint of ["cols", "sm", "md", "lg"] as const) {
      const value = props[breakpoint];
      if (value === undefined || value === false || value === "") {
        if (breakpoint === "cols") classes.push("wakeb-grid-col--grow");
        continue;
      }
      const span = suffix(value);
      const prefix = breakpoint === "cols" ? "wakeb-grid-col--" : `wakeb-grid-col--${breakpoint}-`;
      if (span) classes.push(prefix + span);
      else {
        if (breakpoint === "cols") classes.push("wakeb-grid-col--grow");
        if (process.env.NODE_ENV !== "production")
          warnOnce(context, "WAKEB_UNKNOWN_VALUE", `${component}.${breakpoint}.${String(value)}`, `${component} ${breakpoint} ${JSON.stringify(value)} is not a grid span; it is ignored. Use 1–12, 'auto' or true.`);
      }
    }
    return classes;
  };
}
