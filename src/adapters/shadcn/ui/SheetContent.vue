<!--
  Adapted from shadcn-vue 2.9.0, apps/v4/registry/new-york-v4/ui/sheet/SheetContent.vue and
  SheetOverlay.vue (MIT License, Copyright (c) 2023 unovue). See THIRD-PARTY-NOTICES.txt.
  Wakeb changes: Tailwind and tw-animate-css classes are replaced by the precompiled `wakeb-sc-sheet-*`
  rules below; cn() and reactiveOmit are not needed; only the `left` and `right` sides are kept,
  because Wakeb drawers open from a logical inline side; the built-in close button is removed because
  WDrawer renders its own named close control; `overlayAttrs` lets the overlay share the content's
  theme scope and stacking.
-->
<script setup lang="ts">
import { computed } from "vue";
import type { DialogContentEmits, DialogContentProps } from "reka-ui";
import { DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits } from "reka-ui";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DialogContentProps & { side?: "left" | "right"; overlayAttrs?: Record<string, unknown> }>(), {
  side: "right",
});
const emits = defineEmits<DialogContentEmits>();
const delegated = computed(() => {
  const { side: _side, overlayAttrs: _overlay, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay data-slot="sheet-overlay" class="wakeb-sc-sheet-overlay" v-bind="overlayAttrs" />
    <DialogContent
      data-slot="sheet-content"
      :data-side="side"
      v-bind="{ ...$attrs, ...forwarded }"
      class="wakeb-sc-sheet-content"
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>

<style>
/* Teleported to the body: namespaced global rules, no reset (SPEC R11, R17). */
.wakeb-sc-sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgb(0 0 0 / 0.5);
  animation: wakeb-sc-sheet-fade-in 500ms ease-in-out;
}
.wakeb-sc-sheet-overlay[data-state="closed"] {
  animation: wakeb-sc-sheet-fade-out 300ms ease-in-out forwards;
}
.wakeb-sc-sheet-content {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
  height: 100%;
  width: 75%;
  background: var(--wakeb-ui-surface, var(--background, #fff));
  color: var(--wakeb-ui-on-surface, var(--foreground, #0a0a0a));
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}
.wakeb-sc-sheet-content:focus {
  outline: none;
}
.wakeb-sc-sheet-content[data-state="closed"] {
  animation-duration: 300ms;
  animation-fill-mode: forwards;
}
.wakeb-sc-sheet-content[data-side="right"] {
  right: 0;
  border-left: 1px solid var(--wakeb-ui-border, var(--border, #e5e5e5));
  animation-name: wakeb-sc-sheet-in-right;
}
.wakeb-sc-sheet-content[data-side="right"][data-state="closed"] {
  animation-name: wakeb-sc-sheet-out-right;
}
.wakeb-sc-sheet-content[data-side="left"] {
  left: 0;
  border-right: 1px solid var(--wakeb-ui-border, var(--border, #e5e5e5));
  animation-name: wakeb-sc-sheet-in-left;
}
.wakeb-sc-sheet-content[data-side="left"][data-state="closed"] {
  animation-name: wakeb-sc-sheet-out-left;
}
@keyframes wakeb-sc-sheet-fade-in {
  from {
    opacity: 0;
  }
}
@keyframes wakeb-sc-sheet-fade-out {
  to {
    opacity: 0;
  }
}
@keyframes wakeb-sc-sheet-in-right {
  from {
    transform: translateX(100%);
  }
}
@keyframes wakeb-sc-sheet-out-right {
  to {
    transform: translateX(100%);
  }
}
@keyframes wakeb-sc-sheet-in-left {
  from {
    transform: translateX(-100%);
  }
}
@keyframes wakeb-sc-sheet-out-left {
  to {
    transform: translateX(-100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .wakeb-sc-sheet-overlay,
  .wakeb-sc-sheet-overlay[data-state="closed"],
  .wakeb-sc-sheet-content,
  .wakeb-sc-sheet-content[data-state="closed"] {
    animation: none;
  }
}
</style>
