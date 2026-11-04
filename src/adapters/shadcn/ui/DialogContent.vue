<!--
  Adapted from shadcn-vue 2.9.0, apps/v4/registry/new-york-v4/ui/dialog/DialogContent.vue and
  DialogOverlay.vue (MIT License, Copyright (c) 2023 unovue). See THIRD-PARTY-NOTICES.txt.
  Wakeb changes: Tailwind and tw-animate-css classes are replaced by the precompiled `wakeb-sc-dialog-*`
  rules below; cn() and reactiveOmit are not needed; the built-in close button is removed because
  WModal renders its own named close control; `overlayAttrs` lets the overlay share the content's
  theme scope and stacking.
-->
<script setup lang="ts">
import { computed } from "vue";
import type { DialogContentEmits, DialogContentProps } from "reka-ui";
import { DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits } from "reka-ui";

defineOptions({ inheritAttrs: false });
const props = defineProps<DialogContentProps & { overlayAttrs?: Record<string, unknown> }>();
const emits = defineEmits<DialogContentEmits>();
const delegated = computed(() => {
  const { overlayAttrs: _overlay, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay data-slot="dialog-overlay" class="wakeb-sc-dialog-overlay" v-bind="overlayAttrs" />
    <DialogContent data-slot="dialog-content" v-bind="{ ...$attrs, ...forwarded }" class="wakeb-sc-dialog-content">
      <slot />
    </DialogContent>
  </DialogPortal>
</template>

<style>
/* Teleported to the body: namespaced global rules, no reset (SPEC R11, R17). */
.wakeb-sc-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgb(0 0 0 / 0.5);
  animation: wakeb-sc-fade-in 200ms ease-out;
}
.wakeb-sc-dialog-overlay[data-state="closed"] {
  animation: wakeb-sc-fade-out 200ms ease-in forwards;
}
.wakeb-sc-dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 50;
  display: grid;
  gap: 1rem;
  box-sizing: border-box;
  width: 100%;
  max-width: calc(100% - 2rem);
  max-height: calc(100% - 2rem);
  overflow: auto;
  transform: translate(-50%, -50%);
  border: 1px solid var(--wakeb-ui-border, var(--border, #e5e5e5));
  border-radius: var(--wakeb-ui-radius, var(--radius, 0.625rem));
  padding: 1.5rem;
  background: var(--wakeb-ui-surface, var(--background, #fff));
  color: var(--wakeb-ui-on-surface, var(--foreground, #0a0a0a));
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  animation: wakeb-sc-dialog-in 200ms ease-out;
}
.wakeb-sc-dialog-content:focus {
  outline: none;
}
.wakeb-sc-dialog-content[data-state="closed"] {
  animation: wakeb-sc-dialog-out 200ms ease-in forwards;
}
@keyframes wakeb-sc-fade-in {
  from {
    opacity: 0;
  }
}
@keyframes wakeb-sc-fade-out {
  to {
    opacity: 0;
  }
}
@keyframes wakeb-sc-dialog-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
}
@keyframes wakeb-sc-dialog-out {
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-sc-dialog-overlay,
  .wakeb-sc-dialog-overlay[data-state="closed"],
  .wakeb-sc-dialog-content,
  .wakeb-sc-dialog-content[data-state="closed"] {
    animation: none;
  }
}
</style>
