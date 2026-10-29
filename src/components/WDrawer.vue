<script setup lang="ts">
import { computed, ref, useAttrs, watch } from "vue";
import { useLocale } from "vuetify";
import { VNavigationDrawer } from "vuetify/components/VNavigationDrawer";
import WButton from "./WButton.vue";
import WLoading from "./WLoading.vue";
import type { DrawerProps } from "../types";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DrawerProps>(), {
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
});
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();
const attrs = useAttrs(),
  open = ref(props.modelValue),
  { isRtl } = useLocale();
watch(
  () => props.modelValue,
  (value) => {
    open.value = value;
  },
);
const dialog = computed({
  get: () => open.value,
  set: (value) => {
    if (open.value === value) return;
    open.value = value;
    emit("update:modelValue", value);
  },
});
const location = computed(() =>
  props.position === "start"
    ? isRtl.value
      ? "right"
      : "left"
    : isRtl.value
      ? "left"
      : "right",
);
const numericWidth = computed(() => {
  if (typeof props.width === "number") return props.width;
  const value = parseInt(props.width, 10);
  return Number.isNaN(value) ? 420 : value;
});
const close = () => {
  dialog.value = false;
  emit("close");
};
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
  <VNavigationDrawer
    v-bind="attrs"
    v-model="dialog"
    :location="location"
    :width="numericWidth"
    temporary
    :scrim="!transparentOverlay"
    :persistent="persistent"
    :aria-label="title || ariaLabel"
    class="wakeb-drawer"
  >
    <div class="drawer-panel" :aria-busy="loading || !dataLoaded">
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
</template>
<style scoped lang="scss">
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
}
.wakeb-drawer__loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--wakeb-drawer-loading-bg, #ffffffaa);
}
</style>
