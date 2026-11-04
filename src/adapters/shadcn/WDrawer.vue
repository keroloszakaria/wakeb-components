<script setup lang="ts">
import { computed, mergeProps, watch } from "vue";
import { DialogRoot, DialogTitle } from "reka-ui";
import SheetContent from "./ui/SheetContent.vue";
import WButton from "./WButton.vue";
import WLoading from "./WLoading.vue";
import { drawerDefaults, useDrawer } from "../../composables/drawer";
import { useWakebContext } from "../../core/runtime";
import type { DrawerProps } from "../../types";
defineOptions({ name: "WDrawer", inheritAttrs: false });
const props = withDefaults(defineProps<DrawerProps>(), drawerDefaults);
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();
defineSlots<{
  title(): unknown;
  "header-actions"(): unknown;
  "close-button"(props: { close: () => void; label: string }): unknown;
  content(): unknown;
  default(): unknown;
  actions(): unknown;
  loading(props: { label: string }): unknown;
  "loading-overlay"(props: { label: string }): unknown;
}>();
const context = useWakebContext("WDrawer");
const { model: dialog, side, numericWidth, close } = useDrawer(props, emit);
/* reka-ui sides are physical; the logical side follows the Wakeb `direction` option. */
const position = computed(() => side(context.direction === "rtl"));
/*
 * The overlay and content are reka-ui's own teleported Dialog parts: no application layout or root
 * wrapper is needed (SPEC R19). Both take zIndexOverlay when configured. A transparent overlay keeps
 * the overlay element, so the scroll lock and the outside dismissal still apply.
 */
const stacking = computed(() => (context.zIndexOverlay === undefined ? {} : { style: { zIndex: context.zIndexOverlay } }));
const overlayAttrs = computed(() =>
  mergeProps(context.scope, stacking.value, props.transparentOverlay ? { class: "wakeb-sc-sheet-overlay--transparent" } : {}),
);
const size = (value: number) => `${value}px`;

/*
 * Focus return (SPEC R18). Without reka-ui's DialogTrigger, reka-ui has no element to refocus, so
 * Wakeb remembers what had focus when the drawer opened and returns focus there on close.
 */
let opener: Element | null = null;
watch(
  dialog,
  (open) => {
    if (open && typeof document !== "undefined") opener = document.activeElement;
  },
  { immediate: true, flush: "sync" },
);
const onCloseAutoFocus = (event: Event) => {
  event.preventDefault();
  const target = opener;
  opener = null;
  if (target instanceof HTMLElement && target.isConnected) target.focus({ preventScroll: true });
};
/*
 * persistent maps to both dismissal paths, like the other providers. reka-ui dismisses unless the
 * event is cancelled, and a synthetic non-cancelable Escape cannot be, so a persistent drawer also
 * ignores reka-ui's close request; the Wakeb close button and the model still close it.
 */
const keepOpen = (event: Event) => {
  if (props.persistent) event.preventDefault();
};
const onOpenChange = (open: boolean) => {
  if (open || !props.persistent) dialog.value = open;
};
</script>
<template>
  <!-- reka-ui owns the overlay, focus trap, Escape key, outside inertness and scroll lock. -->
  <DialogRoot :open="dialog" modal @update:open="onOpenChange">
    <SheetContent
      v-bind="mergeProps(stacking, { style: { width: size(numericWidth), maxWidth: '100vw' } }, $attrs)"
      :side="position"
      :overlay-attrs="overlayAttrs"
      class="wakeb-drawer wakeb-sc-drawer"
      aria-modal="true"
      :aria-label="title || ariaLabel"
      :aria-labelledby="undefined"
      :aria-describedby="$attrs['aria-describedby']"
      @escape-key-down="keepOpen"
      @interact-outside="keepOpen"
      @close-auto-focus="onCloseAutoFocus"
    >
      <!-- reka-ui's development check expects its title element; the name itself is aria-label above. -->
      <DialogTitle as="span" hidden />
      <div class="drawer-panel" :aria-busy="loading || !dataLoaded">
        <div v-if="title || $slots.title || $slots['header-actions'] || closable" class="drawer-panel__header">
          <slot name="title"
            ><span class="drawer-panel__title">{{ title }}</span></slot
          >
          <div class="wakeb-drawer__header-actions">
            <slot name="header-actions" />
            <slot v-if="closable" name="close-button" :close="close" :label="closeLabel">
              <WButton type="outline" class-list="wakeb-drawer__close" :aria-label="closeLabel" @click="close"
                ><span aria-hidden="true">×</span></WButton
              >
            </slot>
          </div>
        </div>
        <div class="drawer-panel__content">
          <slot v-if="!dataLoaded" name="loading" :label="loadingLabel"><WLoading :label="loadingLabel" /></slot>
          <template v-else><slot name="content" /><slot /></template>
        </div>
        <div v-if="$slots.actions" class="drawer-panel__actions">
          <slot name="actions" />
        </div>
        <slot v-if="loading" name="loading-overlay" :label="loadingLabel">
          <div class="wakeb-drawer__loading-overlay"><WLoading :label="loadingLabel" /></div>
        </slot>
      </div>
    </SheetContent>
  </DialogRoot>
</template>
<style lang="scss">
/* Teleported drawer: namespaced global rules over the adapted shadcn-vue SheetContent. */
.wakeb-sc-drawer.wakeb-sc-sheet-content {
  gap: 0;
  padding: 0;
  background: var(--wakeb-drawer-bg, var(--wakeb-drawer-fallback, var(--wakeb-ui-surface, var(--background, #fff))));
  border-radius: var(--wakeb-drawer-radius, 20px);
  font-family: var(--wakeb-ui-font-family, inherit);
  overflow: hidden;
}
.wakeb-sc-drawer .drawer-panel {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--wakeb-drawer-bg, var(--wakeb-drawer-fallback, var(--wakeb-ui-surface, var(--background, #fff))));
  overflow: hidden;
}
.wakeb-sc-drawer .drawer-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--wakeb-drawer-padding, 1.25rem);
  flex-shrink: 0;
  border-bottom: 1px solid var(--wakeb-drawer-border, var(--wakeb-drawer-fallback, var(--wakeb-ui-border, var(--border, #d0d5dd))));
}
.wakeb-sc-drawer .drawer-panel__title {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--wakeb-drawer-title, var(--wakeb-drawer-fallback, inherit));
}
.wakeb-sc-drawer .drawer-panel__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--wakeb-drawer-padding, 1.25rem);
}
.wakeb-sc-drawer .drawer-panel__actions {
  flex-shrink: 0;
  padding: var(--wakeb-drawer-padding, 1.25rem);
  border-top: 1px solid var(--wakeb-drawer-border, var(--wakeb-drawer-fallback, var(--wakeb-ui-border, var(--border, #d0d5dd))));
}
.wakeb-sc-drawer .wakeb-drawer__header-actions {
  display: flex;
  gap: 8px;
}
.wakeb-sc-drawer .wakeb-drawer__close.btn {
  width: 36px;
  height: 36px;
  padding: 8px;
  color: var(--wakeb-drawer-close-color, var(--foreground, inherit));
}
.wakeb-sc-drawer .wakeb-drawer__loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--wakeb-drawer-loading-bg, color-mix(in srgb, var(--wakeb-ui-surface, var(--background, #fff)) 72%, transparent));
}
.wakeb-sc-sheet-overlay.wakeb-sc-sheet-overlay--transparent {
  background: transparent;
}
</style>
