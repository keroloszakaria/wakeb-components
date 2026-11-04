import { computed, useId, type ObjectDirective, type StyleValue } from "vue";
import Tooltip from "primevue/tooltip";
import { usePrimeVue } from "primevue/config";
import type { WakebContext } from "../../core/runtime";

/*
 * Shared PrimeVue tooltip wiring for WButton, WTooltipBtn and WTruncatedText (SPEC R17, R18).
 * Verified against primevue 4.5.5 `primevue/tooltip`.
 */

type TooltipInstance = {
  tooltipActions(target: HTMLElement, options: unknown): void;
  remove(target: HTMLElement): void;
  getTooltipElement(target: HTMLElement): HTMLElement | null;
  $_wakebZIndex?: true;
};
type ZIndexTarget = HTMLElement & { $_wakebTooltipZIndex?: number | string; _$instances?: Record<string, TooltipInstance | undefined> };
type TooltipElement = HTMLElement & { $_wakebPrimeZIndex?: string };

/*
 * PrimeVue writes its own tooltip z-index (ZIndex.set) after it builds the element, so a pt style
 * cannot carry zIndexOverlay. When the value names a Wakeb `zIndex`, the directive instance on this
 * element is wrapped once: after PrimeVue shows the tooltip, the configured z-index replaces PrimeVue's,
 * and PrimeVue's value is restored just before PrimeVue removes the element, so its z-index stack
 * releases the entry it registered. Without `zIndex` nothing changes.
 */
function keepZIndex(el: ZIndexTarget, value: unknown) {
  el.$_wakebTooltipZIndex = value && typeof value === "object" ? (value as { zIndex?: number | string }).zIndex : undefined;
  const instance = el._$instances?.tooltip;
  if (!instance || instance.$_wakebZIndex) return;
  instance.$_wakebZIndex = true;
  const { tooltipActions, remove } = instance;
  instance.tooltipActions = function (this: TooltipInstance, target, options) {
    tooltipActions.call(this, target, options);
    const zIndex = el.$_wakebTooltipZIndex;
    const tooltip = this.getTooltipElement(target) as TooltipElement | null;
    if (zIndex === undefined || zIndex === null || !tooltip) return;
    if (tooltip.$_wakebPrimeZIndex === undefined) tooltip.$_wakebPrimeZIndex = tooltip.style.zIndex;
    tooltip.style.zIndex = String(zIndex);
  };
  instance.remove = function (this: TooltipInstance, target) {
    const tooltip = (target ? this.getTooltipElement(target) : null) as TooltipElement | null;
    if (tooltip?.$_wakebPrimeZIndex !== undefined) tooltip.style.zIndex = tooltip.$_wakebPrimeZIndex;
    remove.call(this, target);
  };
}

/**
 * The PrimeVue directive under a local name, so it never collides with a global Vuetify v-tooltip.
 * It is PrimeVue's own directive; the only addition is the configured overlay z-index (SPEC R19).
 */
export const vPvTooltip: ObjectDirective<HTMLElement> = {
  ...Tooltip,
  beforeMount(el, binding, vnode, prevVNode) {
    Tooltip.beforeMount?.(el, binding, vnode, prevVNode);
    keepZIndex(el, binding.value);
  },
  updated(el, binding, vnode, prevVNode) {
    Tooltip.updated?.(el, binding, vnode, prevVNode);
    keepZIndex(el, binding.value);
  },
};

type PtRootParams = { global?: { style?: StyleValue } };

/**
 * pt.root for the tooltip element. PrimeVue spreads a global `pt.directives.tooltip.root` under the
 * binding's own section, so a Wakeb style would replace the caller's global style. The section is a
 * function that receives the resolved global section and keeps its style first.
 */
export function tooltipRoot(attrs: Record<string, unknown>, styles: unknown[]) {
  return ({ global }: PtRootParams = {}) => ({ ...attrs, style: [global?.style, ...styles] });
}

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
 * aria-describedby like the Vuetify tooltip. A configured zIndexOverlay replaces PrimeVue's tooltip
 * z-index; a global pt.directives.tooltip.root style is kept under the Wakeb style.
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
      zIndex: context.zIndexOverlay,
      pt: { root: tooltipRoot(scope, [base, style]), ...(contentStyle ? { text: { style: contentStyle } } : {}) },
    } as unknown as string;
  });
  const describedBy = computed(() => (options().text ? id : undefined));
  return { arg, value, describedBy };
}
