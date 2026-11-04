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

/** Open drawers that hold the body scroll lock; the first one saves the body styles, the last one restores them. */
let scrollLocks = 0;
let savedBody: { overflow: string; paddingRight: string } | null = null;
const lockScroll = () => {
  if (scrollLocks++ > 0) return;
  const { body, documentElement } = document;
  savedBody = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
  // Keep the layout from shifting when the page scrollbar disappears.
  const scrollbar = window.innerWidth - documentElement.clientWidth;
  if (scrollbar > 0) body.style.paddingRight = `${(parseFloat(getComputedStyle(body).paddingRight) || 0) + scrollbar}px`;
  body.style.overflow = "hidden";
};
const unlockScroll = () => {
  if (scrollLocks === 0 || --scrollLocks > 0) return;
  if (savedBody) Object.assign(document.body.style, savedBody);
  savedBody = null;
};

/**
 * True while another open overlay matching `selector` (a dialog or menu opened from the drawer)
 * was mounted after the drawer's host. Providers close their topmost overlay on Escape even when
 * focus has fallen back to the body, so the drawer must leave that key press to it.
 */
export const hasOverlayAbove = (host: Element, selector: string) =>
  [...document.querySelectorAll(selector)].some(
    (overlay) => !host.contains(overlay) && !overlay.contains(host) && Boolean(host.compareDocumentPosition(overlay) & Node.DOCUMENT_POSITION_FOLLOWING),
  );

/**
 * Modal behavior for a renderer whose provider drawer is not a dialog (Vuetify VNavigationDrawer),
 * matching what PrimeVue Drawer and reka-ui Dialog own on the other providers (SPEC R18): Escape
 * closes unless persistent, the body scroll is locked while open, focus moves into the panel on
 * open and returns to the opener on close. Escape only updates the model; `close` stays the close
 * button's event. Escape is ignored while focus sits in another overlay (for example a dialog
 * opened from the drawer), so that overlay closes first. Browser work runs only after mount.
 */
export function useModalDrawer(options: {
  open: { value: boolean };
  persistent: () => boolean;
  panel: () => HTMLElement | null | undefined;
  mounted: { value: boolean };
}) {
  const { open, persistent, panel, mounted } = options;
  let opener: HTMLElement | null = null;
  let locked = false;
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.defaultPrevented || !open.value || persistent()) return;
    const root = panel();
    const active = document.activeElement;
    if (active && active !== document.body && root && !root.contains(active)) return;
    if (root && hasOverlayAbove(root.closest(".wakeb-drawer-host") ?? root, ".v-overlay--active")) return;
    open.value = false;
  };
  const activate = () => {
    if (locked) return;
    locked = true;
    lockScroll();
    document.addEventListener("keydown", onKeydown);
  };
  const release = () => {
    if (!locked) return;
    locked = false;
    unlockScroll();
    document.removeEventListener("keydown", onKeydown);
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
