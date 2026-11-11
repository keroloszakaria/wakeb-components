<script setup lang="ts">
import { computed, mergeProps, onBeforeUnmount, watch } from "vue";
import { DialogRoot, DialogTitle } from "reka-ui";
import DialogContent from "./ui/DialogContent.vue";
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
 * The primitive is Wakeb's copy of the shadcn-vue DialogContent (reka-ui). Mounting, modality, the
 * dismissal policy, focus return and afterLeave stay Wakeb-owned (SPEC R12, R18); reka-ui's other
 * callbacks, such as onOpenAutoFocus, run alongside Wakeb's.
 */
const native = useProviderProps(context, () => props.providerProps, {
  component: "WModal",
  primitive: DialogContent,
  label: "DialogContent",
  owned: [
    "forceMount", "disableOutsidePointerEvents", "as", "asChild", "overlayAttrs",
    "onEscapeKeyDown", "onPointerDownOutside", "onInteractOutside", "onCloseAutoFocus", "onAfterLeave",
  ],
});
const activatorProps = computed(() => ({
  "aria-haspopup": "dialog",
  "aria-expanded": String(dialog.value),
  onClick: () => {
    dialog.value = true;
  },
}));
const size = (value: string | number | undefined) => (typeof value === "number" ? `${value}px` : value);
const stacking = computed(() => (context.zIndexOverlay === undefined ? {} : { style: { zIndex: context.zIndexOverlay } }));
/* The overlay is teleported beside the dialog, so it takes the same theme scope and stacking. */
const overlayAttrs = computed(() => mergeProps(context.scope, stacking.value));

/*
 * Focus return (SPEC R18). Without reka-ui's DialogTrigger, reka-ui has no element to refocus, so
 * Wakeb remembers what had focus when the dialog opened and returns focus there on close.
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
 * event is cancelled, and a non-cancelable Escape cannot be, so a persistent dialog also ignores
 * reka-ui's close request; the model and the Wakeb close button still close it.
 */
const keepOpen = (event: Event) => {
  if (props.persistent) event.preventDefault();
};
const onOpenChange = (open: boolean) => {
  if (open || !props.persistent) dialog.value = open;
};
/* afterLeave fires when the closed content unmounts, after reka-ui's exit animation, not on teardown. */
let tearingDown = false;
onBeforeUnmount(() => {
  tearingDown = true;
});
const onContentUnmounted = () => {
  if (!tearingDown) emit("afterLeave");
};
</script>
<template>
  <slot name="activator" :props="activatorProps" :is-active="dialog" />
  <!-- reka-ui owns the overlay, focus trap, Escape key, outside inertness and scroll lock. -->
  <DialogRoot :open="dialog" modal @update:open="onOpenChange">
    <DialogContent
      v-bind="mergeProps(native, stacking, $attrs)"
      :overlay-attrs="overlayAttrs"
      :class="{ 'wakeb-modal--bare': bare }"
    class="wakeb-modal wakeb-sc-modal"
      :style="width === undefined ? undefined : { maxWidth: `min(calc(100% - 2rem), ${size(width)})` }"
      :aria-label="title || ariaLabel"
      :aria-labelledby="undefined"
      :aria-describedby="$attrs['aria-describedby']"
      @escape-key-down="keepOpen"
      @interact-outside="keepOpen"
      @close-auto-focus="onCloseAutoFocus"
    >
      <!-- reka-ui's development check expects its title element; the name itself is aria-label above. -->
      <DialogTitle as="span" hidden />
      <div class="wakeb-modal__card" :aria-busy="loading || !dataLoaded" @vue:unmounted="onContentUnmounted">
        <slot v-if="bare" />
        <template v-else>
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
        </template>
      </div>
    </DialogContent>
  </DialogRoot>
</template>
<style lang="scss">
/* Teleported dialog: namespaced global rules over the adapted shadcn-vue DialogContent. */
.wakeb-sc-modal.wakeb-sc-dialog-content {
  display: block;
  padding: 0;
  margin: 0;
  max-width: min(calc(100% - 2rem), 32rem);
  background: var(--wakeb-modal-bg, var(--wakeb-modal-fallback, var(--wakeb-ui-surface, var(--background, #fff))));
  font-family: var(--wakeb-ui-font-family, inherit);
  border: 1px solid var(--wakeb-modal-border, var(--wakeb-modal-fallback, var(--wakeb-ui-border, var(--border, #d0d5dd))));
  border-radius: var(--wakeb-modal-radius, var(--wakeb-ui-radius, var(--radius, 4px)));
  color: var(--wakeb-ui-on-surface, var(--foreground, inherit));
}
.wakeb-sc-modal .wakeb-modal__card {
  position: relative;
}
.wakeb-sc-modal .wakeb-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--wakeb-modal-padding, var(--wakeb-ui-spacing, 1.25rem));
  color: var(--wakeb-modal-title, var(--wakeb-modal-fallback, var(--wakeb-ui-on-surface, inherit)));
}
.wakeb-sc-modal .wakeb-modal__title {
  margin: 0;
  font-weight: 600;
  font-size: 1.125rem;
}
.wakeb-sc-modal .wakeb-modal__header-actions {
  display: flex;
  gap: 8px;
}
.wakeb-sc-modal .wakeb-modal__header--icon {
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
.wakeb-sc-modal .wakeb-modal__icon {
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
.wakeb-sc-modal .wakeb-modal__description {
  max-width: 32rem;
  margin: -0.5rem auto 0;
  color: var(--wakeb-modal-description, var(--wakeb-ui-muted, var(--muted-foreground, #737373)));
  font-size: 0.875rem;
  line-height: 1.65;
  text-align: center;
}
.wakeb-sc-modal .wakeb-modal__content {
  padding: var(--wakeb-modal-padding, var(--wakeb-ui-spacing, 1.25rem));
  position: relative;
  height: 100%;
}
.wakeb-sc-modal .wakeb-modal__actions {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  padding: var(--wakeb-modal-padding, var(--wakeb-ui-spacing, 1.25rem));
}
.wakeb-sc-modal .wakeb-modal__close.btn {
  width: 36px;
  height: 36px;
  padding: 8px;
  color: var(--wakeb-modal-close-color, var(--foreground, inherit));
}
.wakeb-sc-modal .wakeb-modal__loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--wakeb-modal-loading-bg, color-mix(in srgb, var(--wakeb-ui-surface, var(--background, #fff)) 72%, transparent));
}

.wakeb-sc-modal.wakeb-modal--bare.wakeb-sc-dialog-content {
  margin: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  overflow: visible;
}
</style>
