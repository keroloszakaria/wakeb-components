<script setup lang="ts">
import { computed, ref, useAttrs, watch } from "vue";
import { VDialog } from "vuetify/components/VDialog";
import { VCard, VCardTitle } from "vuetify/components/VCard";
import { VIcon } from "vuetify/components/VIcon";
import WButton from "./WButton.vue";
import WLoading from "./WLoading.vue";
import type { ModalProps } from "../types";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  title: "",
  description: "",
  persistent: true,
  closable: true,
  loading: false,
  dataLoaded: true,
  showActions: true,
  titleClass: "",
  headerIcon: "",
  closeLabel: "Close",
  loadingLabel: "Loading",
  ariaLabel: "Dialog",
});
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  afterLeave: [];
}>();
const attrs = useAttrs(),
  open = ref(props.modelValue);
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
const close = () => {
  dialog.value = false;
};
defineSlots<{
  activator(props: {
    props: Record<string, unknown>;
    isActive: boolean;
  }): unknown;
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
</script>
<template>
  <VDialog
    v-bind="attrs"
    v-model="dialog"
    :persistent="persistent"
    :max-width="width"
    :aria-label="title || ariaLabel"
    class="wakeb-modal"
    @after-leave="emit('afterLeave')"
  >
    <template v-if="$slots.activator" #activator="slotProps"
      ><slot name="activator" v-bind="slotProps"
    /></template>
    <VCard class="wakeb-modal__card" :aria-busy="loading || !dataLoaded">
      <slot name="header" :close="close">
        <div
          v-if="
            title ||
            $slots.title ||
            $slots['header-actions'] ||
            closable ||
            headerIcon ||
            $slots['header-icon']
          "
          class="wakeb-modal__header"
          :class="{
            'wakeb-modal__header--icon': headerIcon || $slots['header-icon'],
          }"
        >
          <div
            v-if="headerIcon || $slots['header-icon']"
            class="wakeb-modal__icon"
          >
            <slot name="header-decoration" />
            <slot name="header-icon"
              ><VIcon :icon="headerIcon" size="28"
            /></slot>
          </div>
          <slot name="title"
            ><VCardTitle v-if="title" :class="titleClass">{{
              title
            }}</VCardTitle></slot
          >
          <p v-if="description" class="wakeb-modal__description">
            {{ description }}
          </p>
          <div class="wakeb-modal__header-actions">
            <slot name="header-actions" />
            <slot
              v-if="closable"
              name="close-button"
              :close="close"
              :label="closeLabel"
            >
              <WButton
                type="outline"
                class-list="wakeb-modal__close"
                :aria-label="closeLabel"
                @click="close"
                ><span aria-hidden="true">×</span></WButton
              >
            </slot>
          </div>
        </div>
      </slot>
      <div class="wakeb-modal__content content">
        <slot v-if="!dataLoaded" name="loading" :label="loadingLabel"
          ><WLoading :label="loadingLabel"
        /></slot>
        <slot v-else name="content"><slot /></slot>
      </div>
      <template v-if="showActions" #actions><slot name="actions" /></template>
      <slot v-if="loading" name="loading-overlay" :label="loadingLabel">
        <div class="wakeb-modal__loading-overlay">
          <WLoading :label="loadingLabel" />
        </div>
      </slot>
    </VCard>
  </VDialog>
</template>
<style scoped lang="scss">
.wakeb-modal__card {
  margin: var(--wakeb-modal-margin, 1rem);
  background: var(
    --wakeb-modal-bg,
    var(--wakeb-modal-fallback, rgb(var(--v-theme-surface)))
  ) !important;
  border: 1px solid
    var(--wakeb-modal-border, var(--wakeb-modal-fallback, #d0d5dd)) !important;
}
.wakeb-modal :deep(.wakeb-modal__card) {
  border-radius: var(--wakeb-modal-radius, 4px);
}
.wakeb-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--wakeb-modal-padding, 1.25rem);
  border-radius: 24px;
  color: var(--wakeb-modal-title, var(--wakeb-modal-fallback, inherit));
  :deep(.v-card-title) {
    font-weight: 600 !important;
    font-size: 1.125rem;
    padding: 0;
  }
}
.wakeb-modal__header-actions {
  display: flex;
  gap: 8px;
}
.wakeb-modal__header--icon {
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  padding: 2rem 1.5rem 0;
  position: relative;
  margin-bottom: 12px;
  :deep(.v-card-title) {
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
.wakeb-modal__icon {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--wakeb-modal-icon-bg, #e6f4f5);
}
.wakeb-modal__description {
  max-width: 32rem;
  margin: -0.5rem auto 0;
  color: var(--wakeb-modal-description, #667085);
  font-size: 0.875rem;
  line-height: 1.65;
  text-align: center;
}
.wakeb-modal__content {
  padding: var(--wakeb-modal-padding, 1.25rem);
  position: relative;
  height: 100%;
}
.wakeb-modal :deep(.v-card-actions) {
  justify-content: flex-start !important;
  gap: 1rem;
  padding: var(--wakeb-modal-padding, 1.25rem);
}
.wakeb-modal :deep(.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn)) {
  margin-inline-start: 0 !important;
}
.wakeb-modal__header-actions :deep(.wakeb-modal__close) {
  width: 36px;
  height: 36px;
  padding: 8px !important;
}
.wakeb-modal__loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--wakeb-modal-loading-bg, #ffffffaa);
}
</style>
