import { computed, useId, type ObjectDirective, type StyleValue } from "vue";
import Tooltip from "primevue/tooltip";
import { usePrimeVue } from "primevue/config";
import type { WakebContext } from "../../core/runtime";

/*
 * Shared PrimeVue tooltip wiring for WButton, WTooltipBtn and WTruncatedText (SPEC R17, R18).
 * Verified against primevue 4.5.5 `primevue/tooltip`.
 */

/** The PrimeVue directive under a local name, so it never collides with a global Vuetify v-tooltip. */
export const vPvTooltip = Tooltip;

type TooltipTarget = HTMLElement & {
  $_ptooltipMouseEnterEvent?: ((event: { currentTarget: HTMLElement }) => void) | null;
  $_ptooltipMouseLeaveEvent?: ((event: { currentTarget: HTMLElement; target: HTMLElement }) => void) | null;
  $_wakebTooltipFocus?: () => void;
};

/**
 * PrimeVue binds its tooltip either to hover or, with the `focus` modifier, to focus; never to both.
 * Wakeb tooltips open on keyboard focus and on hover (R18), so this directive, placed after
 * v-pv-tooltip on the same element, runs the directive's own hover handlers on focus and blur. It
 * calls the handlers instead of dispatching synthetic mouse events, so caller mouse listeners do not
 * fire on focus. Escape and click keep PrimeVue's behavior.
 */
export const vTooltipFocus: ObjectDirective<TooltipTarget> = {
  mounted(el) {
    const show = () => el.$_ptooltipMouseEnterEvent?.({ currentTarget: el });
    const hide = () => el.$_ptooltipMouseLeaveEvent?.({ currentTarget: el, target: el });
    el.addEventListener("focus", show);
    el.addEventListener("blur", hide);
    el.$_wakebTooltipFocus = () => {
      el.removeEventListener("focus", show);
      el.removeEventListener("blur", hide);
    };
  },
  unmounted(el) {
    el.$_wakebTooltipFocus?.();
    delete el.$_wakebTooltipFocus;
  },
};

export interface PrimeTooltipOptions {
  /** Tooltip text; empty or undefined disables the tooltip. */
  text: string | undefined;
  location: "top" | "bottom" | "start" | "end";
  /** Opening delay in milliseconds. */
  showDelay?: string | number;
  /** Class on the teleported tooltip root. */
  contentClass?: string;
  maxWidth?: string | number;
  /** Caller styles for the tooltip bubble; they win over the theme scope. */
  contentStyle?: StyleValue;
}

/**
 * Builds the v-pv-tooltip argument and value. Logical start/end become PrimeVue's physical sides from
 * the configured direction. The tooltip element is created on document.body, so the theme scope
 * travels through `pt.root`; a pt style replaces the directive's inline defaults, so they are restated
 * first. The id comes from Vue's useId, so it is deterministic, and the target references it through
 * aria-describedby like the Vuetify tooltip. PrimeVue keeps its own tooltip z-index stack.
 */
export function usePrimeTooltip(context: WakebContext, options: () => PrimeTooltipOptions) {
  const primevue = usePrimeVue();
  const id = `wakeb-tooltip-${useId()}`;
  /* PrimeVue reads the side from an object argument: v-pv-tooltip:[{ position }]. */
  const arg = computed(() => {
    const rtl = context.direction === "rtl";
    const location = options().location;
    const position = { top: "top", bottom: "bottom", start: rtl ? "right" : "left", end: rtl ? "left" : "right" }[location] ?? "top";
    return { position } as unknown as string;
  });
  const value = computed(() => {
    const { text, showDelay, contentClass, maxWidth, contentStyle } = options();
    if (!text) return undefined;
    const { style, ...scope } = context.scope;
    const base = {
      display: "inline-block",
      width: "fit-content",
      pointerEvents: primevue.config.unstyled ? undefined : "none",
      maxWidth: maxWidth === undefined || maxWidth === "" ? undefined : typeof maxWidth === "number" || /^\d+(\.\d+)?$/.test(maxWidth) ? `${maxWidth}px` : maxWidth,
    };
    return {
      value: text,
      id,
      showDelay: Number(showDelay) || 0,
      class: contentClass,
      pt: { root: { ...scope, style: style === undefined ? base : [base, style] }, ...(contentStyle ? { text: { style: contentStyle } } : {}) },
    } as unknown as string;
  });
  const describedBy = computed(() => (options().text ? id : undefined));
  return { arg, value, describedBy };
}
