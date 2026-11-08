<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, useAttrs, watch } from "vue";
import { useLocale } from "vuetify";
import { VLayout } from "vuetify/components/VLayout";
import { VNavigationDrawer } from "vuetify/components/VNavigationDrawer";
import WButton from "./WButton.vue";
import WLoading from "./WLoading.vue";
import { activeVuetifyOverlays, drawerDefaults, useDrawer, useModalDrawer } from "../composables/drawer";
import { useWakebContext } from "../core/runtime";
import type { DrawerProps } from "../types";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DrawerProps>(), drawerDefaults);
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();
const attrs = useAttrs(),
  { isRtl } = useLocale();
const context = useWakebContext("WDrawer");
const { model: dialog, side, numericWidth, close } = useDrawer(props, emit);
const location = computed(() => side(isRtl.value));
/*
 * Wakeb-owned layout host (SPEC R19). VNavigationDrawer must register with a Vuetify layout, so
 * WDrawer renders its own VLayout around the drawer only and teleports it next to Vuetify's
 * overlays (the shared .v-overlay-container in body). The app needs no VApp or VLayout. With one,
 * the drawer still registers here, never in the app layout, so the app's main content does not
 * move. The host is a fixed, click-through box over the viewport; only the drawer and its scrim
 * take pointer events. Before mount (server render, hydration) the teleport is disabled and the
 * closed, inert host renders in place, so the markup matches; it moves to the container on mount.
 */
const target = shallowRef<HTMLElement>();
const mounted = ref(false);
onMounted(() => {
  const body = document.body;
  let container = [...body.children].find((el) => el.matches(".v-overlay-container")) as HTMLElement | undefined;
  if (!container) {
    container = document.createElement("div");
    container.className = "v-overlay-container";
    body.appendChild(container);
  }
  target.value = container;
  mounted.value = true;
});
/*
 * Stacking, set each time the drawer opens. Vuetify gives its first open overlay the base z-index
 * (zIndexOverlay, else 2000) and each later one more, and it reuses an overlay element once opened,
 * so DOM order cannot decide. The drawer takes one less than the base, so a dialog, menu or tooltip
 * opened from it always stacks above; opened over other Vuetify overlays, it takes one more than
 * the highest of them.
 */
const base = computed(() => context.zIndexOverlay ?? 2000);
const hostZ = ref(base.value);
const hostEl = ref<{ $el?: HTMLElement }>();
const hostStyle = computed(() => ({
  position: "fixed" as const,
  inset: "0",
  zIndex: hostZ.value,
  overflow: "hidden",
  pointerEvents: "none" as const,
}));
const panelStyle = computed(() => (context.zIndexOverlay === undefined ? undefined : { zIndex: context.zIndexOverlay }));
const panel = ref<HTMLElement>();
watch(
  () => dialog.value && mounted.value,
  (visible) => {
    if (!visible) return;
    const below = activeVuetifyOverlays(hostEl.value?.$el).map((overlay) => Number(getComputedStyle(overlay).zIndex) || 0);
    hostZ.value = below.length ? Math.max(...below) + 1 : base.value - 1;
  },
  { flush: "sync", immediate: true },
);
useModalDrawer({
  open: dialog,
  persistent: () => props.persistent,
  panel: () => panel.value?.closest<HTMLElement>(".wakeb-drawer"),
  host: () => hostEl.value?.$el,
  mounted,
});
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
</script>
<template>
  <!-- Wakeb owns Escape, initial and return focus, the scroll lock and the dialog role; VNavigationDrawer owns the scrim, slide and Tab trap. -->
  <Teleport :to="target ?? 'body'" :disabled="!target">
    <VLayout
      ref="hostEl"
      class="wakeb-drawer-host"
      :class="{ 'wakeb-drawer-host--transparent': transparentOverlay }"
      :style="hostStyle"
    >
      <VNavigationDrawer
        :style="panelStyle"
        v-bind="attrs"
        v-model="dialog"
        tag="div"
        :location="location"
        :width="numericWidth"
        temporary
        scrim
        retain-focus
        :persistent="persistent"
        role="dialog"
        aria-modal="true"
        :aria-label="title || ariaLabel"
        class="wakeb-drawer"
      >
        <div ref="panel" class="drawer-panel" :aria-busy="loading || !dataLoaded">
          <div
            v-if="title || $slots.title || $slots['header-actions'] || closable"
            class="drawer-panel__header"
          >
            <slot name="title"
              ><span class="drawer-panel__title">{{ title }}</span></slot
            >
            <div class="wakeb-drawer__header-actions">
              <slot name="header-actions" />
              <slot
                v-if="closable"
                name="close-button"
                :close="close"
                :label="closeLabel"
              >
                <WButton
                  type="outline"
                  class-list="wakeb-drawer__close"
                  :aria-label="closeLabel"
                  @click="close"
                  ><span aria-hidden="true">×</span></WButton
                >
              </slot>
            </div>
          </div>
          <div class="drawer-panel__content">
            <slot v-if="!dataLoaded" name="loading" :label="loadingLabel"
              ><WLoading :label="loadingLabel"
            /></slot>
            <template v-else><slot name="content" /><slot /></template>
          </div>
          <div v-if="$slots.actions" class="drawer-panel__actions">
            <slot name="actions" />
          </div>
          <slot v-if="loading" name="loading-overlay" :label="loadingLabel">
            <div class="wakeb-drawer__loading-overlay">
              <WLoading :label="loadingLabel" />
            </div>
          </slot>
        </div>
      </VNavigationDrawer>
    </VLayout>
  </Teleport>
</template>
<style scoped lang="scss">
/* The host is click-through and the scrim inherits that, so the scrim takes pointer events back to block the page. */
.wakeb-drawer-host :deep(.v-navigation-drawer__scrim) {
  pointer-events: auto;
}
/* transparentOverlay hides the scrim color but keeps the scrim, so the page stays blocked. */
.wakeb-drawer-host--transparent :deep(.v-navigation-drawer__scrim) {
  background: transparent;
}
.wakeb-drawer {
  background: var(
    --wakeb-drawer-bg,
    var(--wakeb-drawer-fallback, rgb(var(--v-theme-surface)))
  );
  border-radius: var(--wakeb-drawer-radius, 20px);
  :deep(.v-navigation-drawer__content) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}
.drawer-panel {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(
    --wakeb-drawer-bg,
    var(--wakeb-drawer-fallback, rgb(var(--v-theme-surface)))
  );
  overflow: hidden;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--wakeb-drawer-padding, 1.25rem);
    flex-shrink: 0;
    border-bottom: 1px solid
      var(--wakeb-drawer-border, var(--wakeb-drawer-fallback, #d0d5dd));
  }
  &__title {
    font-weight: 600;
    font-size: 1.125rem;
    color: var(--wakeb-drawer-title, var(--wakeb-drawer-fallback, inherit));
  }
  &__content {
    flex: 1;
    overflow-y: auto;
    padding: var(--wakeb-drawer-padding, 1.25rem);
  }
  &__actions {
    flex-shrink: 0;
    padding: var(--wakeb-drawer-padding, 1.25rem);
    border-top: 1px solid
      var(--wakeb-drawer-border, var(--wakeb-drawer-fallback, #d0d5dd));
  }
}
.wakeb-drawer__header-actions {
  display: flex;
  gap: 8px;
}
.wakeb-drawer__header-actions :deep(.wakeb-drawer__close) {
  width: 36px;
  height: 36px;
  padding: 8px !important;
  color: var(--wakeb-drawer-close-color, rgb(var(--v-theme-on-surface))) !important;
}
.wakeb-drawer__loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--wakeb-drawer-loading-bg, rgba(var(--v-theme-surface), 0.72));
}
</style>
