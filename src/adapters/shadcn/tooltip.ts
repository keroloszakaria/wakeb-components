import { computed, mergeProps, onBeforeUnmount, ref, watch } from "vue";
import type { WakebContext } from "../../core/runtime";

/*
 * Tooltip and overflow-popover wiring shared by the shadcn-vue renderers (WTruncatedText,
 * WTooltipBtn, WAvatarStack, WBadgeStack). reka-ui owns focus opening, Escape, dismissal, the
 * hoverable-content grace area and aria-describedby; these helpers add the Wakeb rules on top
 * (SPEC R17, R18): logical sides, the theme scope and stacking on teleported content, and opening on
 * mouse hover as well as on reka-ui's pointer events.
 */

type Location = "top" | "bottom" | "start" | "end";

/** reka-ui sides are physical; Wakeb locations are logical and follow the configured direction. */
export function physicalSide(context: WakebContext, location: Location) {
  const rtl = context.direction === "rtl";
  return ({ top: "top", bottom: "bottom", start: rtl ? "right" : "left", end: rtl ? "left" : "right" } as const)[location] ?? "top";
}

/** Theme scope and configured stacking for teleported content; extra bindings (caller styles) come last and win. */
export function overlayBindings(context: WakebContext, ...extra: Record<string, unknown>[]) {
  return mergeProps(context.scope, context.zIndexOverlay === undefined ? {} : { style: { zIndex: context.zIndexOverlay } }, ...extra);
}

/**
 * Controlled open state for one reka-ui TooltipRoot. reka-ui opens on keyboard focus and on pointer
 * movement; `onMouseenter` here opens the same tooltip after `delay` for mouse-only hover, so the
 * behavior does not depend on pointer events. Leaving only cancels a pending open: reka-ui closes
 * the tooltip once the pointer leaves both the trigger and the hoverable content.
 */
export function useHoverTooltip(enabled: () => boolean, delay: () => number = () => 0) {
  const open = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  const hover = {
    onMouseenter: () => {
      cancel();
      if (!enabled() || open.value) return;
      const wait = delay();
      if (wait > 0) timer = setTimeout(() => (open.value = enabled()), wait);
      else open.value = true;
    },
    onMouseleave: cancel,
  };
  watch(enabled, (value) => {
    if (!value) {
      cancel();
      open.value = false;
    }
  });
  onBeforeUnmount(cancel);
  return { open, hover };
}

export interface OverflowPopoverOptions {
  /** `show` keeps an open popover open on click; `toggle` closes it; `false` ignores clicks. */
  click: () => "show" | "toggle" | false;
  /** Keyboard focus on the activator opens the popover, and blur closes it. */
  focus: () => boolean;
}

/** Delay before a hover-opened popover closes, so the pointer can travel from activator to content. */
const CLOSE_DELAY = 150;

/**
 * Open state and listeners for an informational reka-ui Popover that opens on hover, like the
 * Vuetify `open-on-hover` menu, and on focus or click as configured. reka-ui handles Escape and
 * outside presses; a press on the activator is not an outside press, so its click decides. The
 * popover never takes focus, so the activator keeps it. Timers are cleared on unmount.
 */
export function useOverflowPopover(options: OverflowPopoverOptions) {
  const open = ref(false);
  const activatorElement = ref<HTMLElement>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  const show = (event: Event) => {
    cancel();
    activatorElement.value = event.currentTarget as HTMLElement;
    open.value = true;
  };
  const hide = () => {
    cancel();
    open.value = false;
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
  const content = {
    onMouseenter: cancel,
    onMouseleave: hideSoon,
    /* A press on the activator is handled by its own click, not as an outside dismissal. */
    onInteractOutside: (event: Event) => {
      const target = (event as CustomEvent<{ originalEvent?: Event }>).detail?.originalEvent?.target ?? event.target;
      if (activatorElement.value && target instanceof Node && activatorElement.value.contains(target)) event.preventDefault();
    },
    /* Focus leaving is handled by the activator's blur rule, not as a dismissal. */
    onFocusOutside: (event: Event) => event.preventDefault(),
    /* Informational content: focus stays on the activator when it opens and closes. */
    onOpenAutoFocus: (event: Event) => event.preventDefault(),
    onCloseAutoFocus: (event: Event) => event.preventDefault(),
  };
  /* reka-ui reports its own closing (Escape, outside press). */
  const onOpenChange = (value: boolean) => {
    cancel();
    open.value = value;
  };
  onBeforeUnmount(cancel);
  return { open, onOpenChange, activator, content };
}
