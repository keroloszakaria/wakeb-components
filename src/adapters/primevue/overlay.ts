import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from "vue";
import { usePrimeVue } from "primevue/config";
import type Popover from "primevue/popover";
import type { WakebContext } from "../../core/runtime";
import { tooltipRoot } from "./tooltip";
import { hasOverlayAbove, useDrawerEscape } from "../../composables/drawer";

/*
 * Menus and popovers close on Escape only while focus is inside them, so they keep the key only then.
 * A mask whose dialog is leaving belongs to an overlay that already closed: PrimeVue marks the mask
 * only in styled mode, while Vue's `-leave-active` transition class on its dialog is set in both modes.
 */
const MENU = ".p-menu-overlay, .p-popover, .p-tieredmenu-overlay";
const leaving = (mask: Element) =>
  mask.classList.contains("p-overlay-mask-leave-active") || [...mask.children].some((child) => /-leave-active\b/.test(child.getAttribute("class") ?? ""));

/**
 * PrimeVue only binds Escape on entry. Wakeb keeps persistence reactive and dismisses the top overlay
 * only: PrimeVue appends a mask each time a dialog opens, so an open mask after this one belongs to a
 * dialog opened from it and keeps Escape.
 */
export function usePrimeOverlayEscape(open: { value: boolean }, persistent: () => boolean, panel: () => HTMLElement | undefined) {
  const escape = useDrawerEscape(open, persistent, (event) => {
    if (event.target instanceof Element && event.target.closest(MENU)) return true;
    const root = panel()?.closest<HTMLElement>(".p-overlay-mask") ?? panel()?.closest<HTMLElement>('[role="dialog"]');
    if (!root) return false;
    return hasOverlayAbove(root, ".p-overlay-mask", (mask) => !leaving(mask));
  });
  watch(() => open.value, (visible) => {
    if (typeof document === "undefined") return;
    if (visible) escape.listen();
    else escape.stop();
  }, { immediate: true });
  onBeforeUnmount(() => {
    if (typeof document !== "undefined") escape.stop();
  });
}

/*
 * Overlay helpers shared by the PrimeVue renderers that open informational overlays (WAvatarStack,
 * WBadgeStack). They keep three Wakeb rules PrimeVue does not provide out of the box: the theme
 * scope on teleported content with caller styles last, tooltips on both hover and keyboard focus,
 * and hover, focus or click opening for a Popover.
 */

/**
 * Value for PrimeVue's `v-tooltip` directive. The directive builds its element on document.body, so
 * the theme scope and the caller style travel through `pt.root`. A pt style replaces the directive's
 * inline defaults, so they are restated first; a global pt.directives.tooltip.root style stays under
 * them and the caller style comes last and wins. A configured zIndexOverlay replaces PrimeVue's tooltip
 * z-index unless the caller style names its own zIndex; bind the value through `vPvTooltip` (./tooltip).
 */
export function useTooltipValue(context: WakebContext, callerStyle: () => CSSProperties | undefined) {
  const primevue = usePrimeVue();
  return (text: string, enabled = true) => {
    if (!enabled || !text) return undefined;
    const { style, ...attrs } = context.scope;
    const caller = callerStyle();
    const hasCaller = caller !== undefined && Object.keys(caller).length > 0;
    const zIndex = context.zIndexOverlay === undefined ? undefined : (caller?.zIndex ?? context.zIndexOverlay);
    if (style === undefined && !hasCaller && Object.keys(attrs).length === 0 && zIndex === undefined) return text;
    const base = { display: "inline-block", width: "fit-content", pointerEvents: primevue.config.unstyled ? undefined : "none" };
    return { value: text, zIndex, pt: { root: tooltipRoot(attrs, [base, style, hasCaller ? caller : undefined]) } } as unknown as string;
  };
}

/*
 * PrimeVue's tooltip directive listens to hover or to focus, never both. The directive is bound in
 * hover mode and keyboard focus replays the same pointer events, so the tooltip opens on focus,
 * closes on blur and still closes on Escape (SPEC R18).
 */
export const focusOpensTooltip = {
  onFocus: (event: FocusEvent) => (event.currentTarget as HTMLElement).dispatchEvent(new MouseEvent("mouseenter")),
  onBlur: (event: FocusEvent) => (event.currentTarget as HTMLElement).dispatchEvent(new MouseEvent("mouseleave")),
};

export interface OverflowPopupOptions {
  /** `show` keeps an open popup open on click; `toggle` closes it; `false` ignores clicks. */
  click: () => "show" | "toggle" | false;
  /** Keyboard focus on the activator opens the popup, and blur closes it. */
  focus: () => boolean;
}

/** Delay before a hover-opened popup closes, so the pointer can travel from activator to content. */
const CLOSE_DELAY = 150;

/**
 * Open state and listeners for an informational PrimeVue Popover that opens on hover, like the
 * Vuetify `open-on-hover` menu, and on focus or click as configured. Escape and outside clicks are
 * handled by Popover. Timers are cleared on unmount; nothing runs during server rendering.
 */
export function useOverflowPopup(options: OverflowPopupOptions) {
  const popover = ref<InstanceType<typeof Popover>>();
  const open = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  const show = (event: Event) => {
    cancel();
    if (open.value) return;
    open.value = true;
    popover.value?.show(event, event.currentTarget as HTMLElement);
  };
  const hide = () => {
    cancel();
    if (!open.value) return;
    open.value = false;
    popover.value?.hide();
  };
  const hideSoon = () => {
    cancel();
    timer = setTimeout(hide, CLOSE_DELAY);
  };
  const activator = computed(() => ({
    onMouseenter: show,
    onMouseleave: hideSoon,
    onFocus: options.focus() ? show : undefined,
    onBlur: options.focus() ? hideSoon : undefined,
    onClick: (event: MouseEvent) => {
      const mode = options.click();
      if (!mode) return;
      if (mode === "toggle" && open.value) hide();
      else show(event);
    },
  }));
  /** Bound on the Popover: the pointer over the content keeps it open; Popover reports its own closing. */
  const content = {
    onMouseenter: cancel,
    onMouseleave: hideSoon,
    onHide: () => {
      cancel();
      open.value = false;
    },
  };
  onBeforeUnmount(cancel);
  return { popover, open, activator, content };
}
