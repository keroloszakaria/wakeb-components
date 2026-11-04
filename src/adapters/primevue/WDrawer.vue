<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import Drawer from "primevue/drawer";
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
/* PrimeVue has no locale direction; the logical side follows the Wakeb `direction` option. */
const position = computed(() => side(context.direction === "rtl"));
/*
 * The mask is PrimeVue's own teleported overlay host: no application layout or root wrapper is
 * needed (SPEC R19). Stacking uses zIndexOverlay when configured, else PrimeVue's modal z-index
 * stack shared with WModal. A transparent overlay keeps the mask, so the background stays inert.
 */
const pt = computed(() => {
  const transparent = props.transparentOverlay ? "wakeb-pv-drawer-mask--transparent" : undefined;
  const zIndex = context.zIndexOverlay;
  if (!transparent && zIndex === undefined) return undefined;
  return { mask: { class: transparent, style: zIndex === undefined ? undefined : { zIndex } } };
});
const panel = ref<HTMLElement>();
let opener: HTMLElement | null = null;
/*
 * PrimeVue focuses [autofocus] or its own close button, and the container slot has neither. Like
 * WModal, move focus to the drawer unless content already took it; PrimeVue's focus trap then
 * keeps Tab inside. The drawer does not restore focus itself, so Wakeb returns it to the opener.
 */
const onShow = () => {
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  nextTick(() => {
    const root = panel.value?.closest<HTMLElement>('[role="dialog"]');
    if (!root || root.contains(document.activeElement)) return;
    root.tabIndex = -1;
    root.focus({ preventScroll: true });
  });
};
const onAfterHide = () => {
  const target = opener;
  opener = null;
  const active = document.activeElement;
  // Only reclaim focus that the closed drawer dropped; never steal focus the user moved elsewhere.
  if (target?.isConnected && (!active || active === document.body)) target.focus({ preventScroll: true });
};
const size = (value: number) => `${value}px`;
</script>
<template>
  <!-- PrimeVue owns the mask, focus trap, Escape key and scroll lock; persistent maps to both dismissal paths. -->
  <Drawer
    v-model:visible="dialog"
    modal
    block-scroll
    :position="position"
    :close-on-escape="!persistent"
    :dismissable="!persistent"
    :auto-z-index="context.zIndexOverlay === undefined"
    :pt="pt"
    v-bind="$attrs"
    :style="{ width: size(numericWidth), maxWidth: '100vw' }"
    class="wakeb-drawer wakeb-pv-drawer"
    :aria-label="title || ariaLabel"
    :aria-labelledby="undefined"
    @show="onShow"
    @after-hide="onAfterHide"
  >
    <template #container>
      <div ref="panel" class="drawer-panel" :aria-busy="loading || !dataLoaded">
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
    </template>
  </Drawer>
</template>
<style lang="scss">
/* Teleported drawer: namespaced global rules; .p-drawer is doubled to win over runtime-injected theme CSS. */
.wakeb-pv-drawer.p-drawer {
  background: var(--wakeb-drawer-bg, var(--wakeb-drawer-fallback, var(--wakeb-ui-surface, var(--p-drawer-background))));
  border-radius: var(--wakeb-drawer-radius, 20px);
  color: var(--wakeb-ui-on-surface, var(--p-drawer-color));
  font-family: var(--wakeb-ui-font-family, inherit);
  overflow: hidden;
}
.wakeb-pv-drawer .drawer-panel {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--wakeb-drawer-bg, var(--wakeb-drawer-fallback, var(--wakeb-ui-surface, var(--p-drawer-background))));
  overflow: hidden;
}
.wakeb-pv-drawer .drawer-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--wakeb-drawer-padding, 1.25rem);
  flex-shrink: 0;
  border-bottom: 1px solid var(--wakeb-drawer-border, var(--wakeb-drawer-fallback, var(--wakeb-ui-border, #d0d5dd)));
}
.wakeb-pv-drawer .drawer-panel__title {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--wakeb-drawer-title, var(--wakeb-drawer-fallback, inherit));
}
.wakeb-pv-drawer .drawer-panel__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--wakeb-drawer-padding, 1.25rem);
}
.wakeb-pv-drawer .drawer-panel__actions {
  flex-shrink: 0;
  padding: var(--wakeb-drawer-padding, 1.25rem);
  border-top: 1px solid var(--wakeb-drawer-border, var(--wakeb-drawer-fallback, var(--wakeb-ui-border, #d0d5dd)));
}
.wakeb-pv-drawer .wakeb-drawer__header-actions {
  display: flex;
  gap: 8px;
}
.wakeb-pv-drawer .wakeb-drawer__close.btn {
  width: 36px;
  height: 36px;
  padding: 8px;
  color: var(--wakeb-drawer-close-color, var(--p-text-color));
}
.wakeb-pv-drawer .wakeb-drawer__loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--wakeb-drawer-loading-bg, color-mix(in srgb, var(--p-drawer-background) 72%, transparent));
}
.wakeb-pv-drawer-mask--transparent.p-overlay-mask,
.wakeb-pv-drawer-mask--transparent {
  background: transparent !important;
}
</style>
