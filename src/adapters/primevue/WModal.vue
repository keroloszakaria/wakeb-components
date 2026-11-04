<script setup lang="ts">
import { computed, mergeProps, nextTick, ref } from "vue";
import Dialog from "primevue/dialog";
import WButton from "./WButton.vue";
import WLoading from "./WLoading.vue";
import WakebIcon from "../../icons/WakebIcon";
import { modalDefaults, useDisclosure } from "../../composables/disclosure";
import { useWakebContext } from "../../core/runtime";
import { useProviderProps } from "../../core/provider-props";
import type { ModalProps } from "../../types";
defineOptions({ name: "WModal", inheritAttrs: false });
const props = withDefaults(defineProps<ModalProps>(), modalDefaults);
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  afterLeave: [];
}>();
defineSlots<{
  activator(props: { props: Record<string, unknown>; isActive: boolean }): unknown;
  header(props: { close: () => void }): unknown;
  title(): unknown;
  "header-icon"(): unknown;
  "header-decoration"(): unknown;
  "header-actions"(): unknown;
  "close-button"(props: { close: () => void; label: string }): unknown;
  content(): unknown;
  default(): unknown;
  actions(): unknown;
  loading(props: { label: string }): unknown;
  "loading-overlay"(props: { label: string }): unknown;
}>();
const context = useWakebContext("WModal");
const { model: dialog, close } = useDisclosure(props, emit);
/*
 * The model, modality, dismissal policy, scroll lock, stacking and afterLeave stay Wakeb-owned
 * (SPEC R12, R18). pt could carry roles and ARIA past the attribute policy.
 */
const native = useProviderProps(context, () => props.providerProps, {
  component: "WModal",
  primitive: Dialog,
  label: "Dialog",
  owned: ["visible", "modal", "blockScroll", "draggable", "closeOnEscape", "dismissableMask", "autoZIndex", "baseZIndex", "pt", "ptOptions", "onAfterHide"],
});
const activatorProps = computed(() => ({
  "aria-haspopup": "dialog",
  "aria-expanded": String(dialog.value),
  onClick: () => {
    dialog.value = true;
  },
}));
const size = (value: string | number | undefined) => (typeof value === "number" ? `${value}px` : value);
const card = ref<HTMLElement>();
/*
 * PrimeVue focuses [autofocus] or its own close button, and the container slot has neither.
 * Like VDialog, move focus to the dialog itself unless content already took it; PrimeVue's
 * focus trap then cycles Tab inside, and PrimeVue restores focus to the opener on close.
 */
const focusDialog = () =>
  nextTick(() => {
    const root = card.value?.closest<HTMLElement>('[role="dialog"]');
    if (!root || root.contains(document.activeElement)) return;
    root.tabIndex = -1;
    root.focus({ preventScroll: true });
  });
</script>
<template>
  <slot name="activator" :props="activatorProps" :is-active="dialog" />
  <!-- PrimeVue owns the mask, focus trap, Escape key and scroll lock; persistent maps to both dismissal paths. -->
  <Dialog
    v-model:visible="dialog"
    modal
    block-scroll
    :draggable="false"
    :close-on-escape="!persistent"
    :dismissable-mask="!persistent"
    :auto-z-index="context.zIndexOverlay === undefined"
    :pt="context.zIndexOverlay === undefined ? undefined : { mask: { style: { zIndex: context.zIndexOverlay } } }"
    :style="{ width: '100%', maxWidth: size(width) }"
    v-bind="mergeProps(native, $attrs)"
    class="wakeb-modal wakeb-pv-modal"
    :dir="context.direction"
    :aria-label="title || ariaLabel"
    :aria-labelledby="undefined"
    @show="focusDialog"
    @after-hide="emit('afterLeave')"
  >
    <template #container>
      <div ref="card" class="wakeb-modal__card" :aria-busy="loading || !dataLoaded">
        <slot name="header" :close="close">
          <div
            v-if="title || description || $slots.title || $slots['header-actions'] || closable || headerIcon || $slots['header-icon']"
            class="wakeb-modal__header"
            :class="{ 'wakeb-modal__header--icon': headerIcon || $slots['header-icon'] }"
          >
            <div v-if="headerIcon || $slots['header-icon']" class="wakeb-modal__icon">
              <slot name="header-decoration" />
              <slot name="header-icon"><WakebIcon :icon="headerIcon" :size="28" /></slot>
            </div>
            <slot name="title"
              ><h2 v-if="title" class="wakeb-modal__title" :class="titleClass">{{ title }}</h2></slot
            >
            <p v-if="description" class="wakeb-modal__description">{{ description }}</p>
            <div class="wakeb-modal__header-actions">
              <slot name="header-actions" />
              <slot v-if="closable" name="close-button" :close="close" :label="closeLabel">
                <WButton type="outline" class-list="wakeb-modal__close" :aria-label="closeLabel" @click="close"
                  ><span aria-hidden="true">×</span></WButton
                >
              </slot>
            </div>
          </div>
        </slot>
        <div class="wakeb-modal__content content">
          <slot v-if="!dataLoaded" name="loading" :label="loadingLabel"><WLoading :label="loadingLabel" /></slot>
          <slot v-else name="content"><slot /></slot>
        </div>
        <div v-if="showActions && $slots.actions" class="wakeb-modal__actions"><slot name="actions" /></div>
        <slot v-if="loading" name="loading-overlay" :label="loadingLabel">
          <div class="wakeb-modal__loading-overlay"><WLoading :label="loadingLabel" /></div>
        </slot>
      </div>
    </template>
  </Dialog>
</template>
<style lang="scss">
/* Teleported dialog: namespaced global rules; .p-dialog is doubled to win over runtime-injected theme CSS. */
.wakeb-pv-modal.p-dialog {
  margin: var(--wakeb-modal-margin, 1rem);
  background: var(--wakeb-modal-bg, var(--wakeb-modal-fallback, var(--wakeb-ui-surface, var(--p-dialog-background))));
  font-family: var(--wakeb-ui-font-family, inherit);
  border: 1px solid var(--wakeb-modal-border, var(--wakeb-modal-fallback, var(--wakeb-ui-border, #d0d5dd)));
  border-radius: var(--wakeb-modal-radius, var(--wakeb-ui-radius, 4px));
  color: var(--wakeb-ui-on-surface, var(--p-dialog-color));
  overflow: hidden;
}
.wakeb-pv-modal .wakeb-modal__card {
  position: relative;
}
.wakeb-pv-modal .wakeb-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--wakeb-modal-padding, var(--wakeb-ui-spacing, 1.25rem));
  color: var(--wakeb-modal-title, var(--wakeb-modal-fallback, var(--wakeb-ui-on-surface, inherit)));
}
.wakeb-pv-modal .wakeb-modal__title {
  margin: 0;
  font-weight: 600;
  font-size: 1.125rem;
}
.wakeb-pv-modal .wakeb-modal__header-actions {
  display: flex;
  gap: 8px;
}
.wakeb-pv-modal .wakeb-modal__header--icon {
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  padding: 2rem 1.5rem 0;
  position: relative;
  margin-bottom: 12px;
  .wakeb-modal__title {
    font-size: 1rem;
    text-align: center;
    width: 100%;
  }
  .wakeb-modal__header-actions {
    position: absolute;
    inset-block-start: 1.25rem;
    inset-inline-end: 1.25rem;
    z-index: 1;
  }
}
.wakeb-pv-modal .wakeb-modal__icon {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--wakeb-modal-icon-bg, #e6f4f5);
  color: var(--wakeb-modal-icon-color, #087f8c);
}
.wakeb-pv-modal .wakeb-modal__description {
  max-width: 32rem;
  margin: -0.5rem auto 0;
  color: var(--wakeb-modal-description, var(--wakeb-ui-muted, var(--p-text-muted-color)));
  font-size: 0.875rem;
  line-height: 1.65;
  text-align: center;
}
.wakeb-pv-modal .wakeb-modal__content {
  padding: var(--wakeb-modal-padding, var(--wakeb-ui-spacing, 1.25rem));
  position: relative;
  height: 100%;
}
.wakeb-pv-modal .wakeb-modal__actions {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  padding: var(--wakeb-modal-padding, var(--wakeb-ui-spacing, 1.25rem));
}
.wakeb-pv-modal .wakeb-modal__close.btn {
  width: 36px;
  height: 36px;
  padding: 8px;
  color: var(--wakeb-modal-close-color, var(--p-text-color));
}
.wakeb-pv-modal .wakeb-modal__loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--wakeb-modal-loading-bg, color-mix(in srgb, var(--p-dialog-background) 72%, transparent));
}
</style>
