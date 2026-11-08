import { computed, onBeforeUnmount, watch } from "vue";
import { useDisclosure } from "./disclosure";
import type { DrawerProps } from "../types";

/** Defaults shared by every WDrawer renderer; providers must not change them. */
export const drawerDefaults = {
  modelValue: false,
  title: "",
  width: 420,
  position: "end",
  persistent: false,
  transparentOverlay: false,
  closable: true,
  loading: false,
  dataLoaded: true,
  closeLabel: "Close",
  loadingLabel: "Loading",
  ariaLabel: "Drawer",
} as const;

type Emit = {
  (event: "update:modelValue", value: boolean): void;
  (event: "close"): void;
};

/**
 * Provider-neutral WDrawer behavior: the mirrored boolean model (SPEC R13), the close callback that
 * updates the model before emitting `close`, the physical side for a logical position, and the
 * baseline width parsing (numbers pass, strings use parseInt with a 420 fallback).
 */
export function useDrawer(props: Required<Pick<DrawerProps, "modelValue" | "position" | "width">>, emit: Emit) {
  const { model } = useDisclosure(props, emit);
  const side = (rtl: boolean): "left" | "right" =>
    props.position === "start" ? (rtl ? "right" : "left") : rtl ? "left" : "right";
  const numericWidth = computed(() => {
    if (typeof props.width === "number") return props.width;
    const value = parseInt(props.width, 10);
    return Number.isNaN(value) ? 420 : value;
  });
  const close = () => {
    model.value = false;
    emit("close");
  };
  return { model, side, numericWidth, close };
}

/**
 * Open drawers that hold the page scroll lock; the first one saves the styles, the last one restores
 * them. Both html and body are locked, because Vuetify's reset makes html the scrolling element.
 */
let scrollLocks = 0;
let saved: { html: string; body: string; paddingRight: string } | null = null;
const lockScroll = () => {
  if (scrollLocks++ > 0) return;
  const { body, documentElement: html } = document;
  saved = { html: html.style.overflow, body: body.style.overflow, paddingRight: body.style.paddingRight };
  // Measured before the lock, so the padding replaces exactly the scrollbar that disappears.
  const scrollbar = window.innerWidth - html.clientWidth;
  if (scrollbar > 0) body.style.paddingRight = `${(parseFloat(getComputedStyle(body).paddingRight) || 0) + scrollbar}px`;
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
};
const unlockScroll = () => {
  if (scrollLocks === 0 || --scrollLocks > 0) return;
  if (saved) {
    document.documentElement.style.overflow = saved.html;
    Object.assign(document.body.style, { overflow: saved.body, paddingRight: saved.paddingRight });
  }
  saved = null;
};

/**
 * True while another overlay matching `selector` (and `accept`) was mounted after `host`. Use it for
 * providers that append an overlay to the document each time it opens (PrimeVue masks), so DOM order
 * is open order.
 */
export const hasOverlayAbove = (host: Element, selector: string, accept: (overlay: Element) => boolean = () => true) =>
  [...document.querySelectorAll(selector)].some(
    (overlay) =>
      !host.contains(overlay) && !overlay.contains(host) && Boolean(host.compareDocumentPosition(overlay) & Node.DOCUMENT_POSITION_FOLLOWING) && accept(overlay),
  );

/**
 * Escape closes a drawer unless it is persistent or `yields(event)` hands the key to an overlay opened
 * from the drawer, which closes first (SPEC R18). Escape only updates the model; `close` stays the
 * close button's event. `listen` and `stop` add and remove the document listener.
 */
export function useDrawerEscape(open: { value: boolean }, persistent: () => boolean, yields: (event: KeyboardEvent) => boolean) {
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.isComposing || event.defaultPrevented || !open.value || persistent()) return;
    if (yields(event)) return;
    open.value = false;
  };
  return {
    listen: () => document.addEventListener("keydown", onKeydown),
    stop: () => document.removeEventListener("keydown", onKeydown),
  };
}

/* Vuetify overlays that take Escape while they are the top overlay. Snackbars and tooltips never block the drawer. */
const VUETIFY_MODAL = ".v-overlay--active.v-dialog, .v-overlay--active.v-menu";
/** Active Vuetify overlays outside `host`. */
export const activeVuetifyOverlays = (host: Element | null | undefined, selector = ".v-overlay--active") =>
  [...document.querySelectorAll<HTMLElement>(selector)].filter((overlay) => !host?.contains(overlay));

/**
 * Modal behavior for a renderer whose provider drawer is not a dialog (Vuetify VNavigationDrawer),
 * matching what PrimeVue Drawer and reka-ui Dialog own on the other providers (SPEC R18): Escape
 * closes unless persistent, the page scroll is locked while open, focus moves into the panel on
 * open and returns to the opener on close. Vuetify reuses an overlay element once it has opened, so
 * DOM order is not open order: the overlays already open when the drawer opens are recorded, and
 * Escape is left to a dialog or menu opened after it, even when focus fell back to the body.
 * Browser work runs only after mount.
 */
export function useModalDrawer(options: {
  open: { value: boolean };
  persistent: () => boolean;
  panel: () => HTMLElement | null | undefined;
  host: () => HTMLElement | null | undefined;
  mounted: { value: boolean };
}) {
  const { open, persistent, panel, host, mounted } = options;
  let opener: HTMLElement | null = null;
  let locked = false;
  let before = new Set<HTMLElement>();
  const escape = useDrawerEscape(open, persistent, () => {
    const root = panel();
    const active = document.activeElement;
    if (active && active !== document.body && root && !root.contains(active)) return true;
    return activeVuetifyOverlays(host(), VUETIFY_MODAL).some((overlay) => !before.has(overlay));
  });
  const activate = () => {
    if (locked) return;
    locked = true;
    before = new Set(activeVuetifyOverlays(host(), VUETIFY_MODAL));
    lockScroll();
    escape.listen();
  };
  const release = () => {
    if (!locked) return;
    locked = false;
    before = new Set();
    unlockScroll();
    escape.stop();
  };
  /* The opener is read synchronously, before anything in the drawer can take focus. */
  watch(
    () => open.value && mounted.value,
    (visible) => {
      if (visible && document.activeElement instanceof HTMLElement && !panel()?.contains(document.activeElement))
        opener = document.activeElement;
    },
    { flush: "sync", immediate: true },
  );
  watch(
    () => open.value && mounted.value,
    (visible, was) => {
      if (visible) {
        activate();
        const root = panel();
        if (!root || root.contains(document.activeElement)) return;
        root.tabIndex = -1;
        root.focus({ preventScroll: true });
        return;
      }
      release();
      if (!was) return;
      const target = opener;
      opener = null;
      const active = document.activeElement;
      // Only reclaim focus that the closed drawer dropped; never steal focus the user moved elsewhere.
      if (target?.isConnected && (!active || active === document.body || panel()?.contains(active)))
        target.focus({ preventScroll: true });
    },
    { flush: "post", immediate: true },
  );
  onBeforeUnmount(release);
}
