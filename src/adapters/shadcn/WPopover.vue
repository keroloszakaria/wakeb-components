<script setup lang="ts">
import { computed } from "vue";
import { PopoverAnchor, PopoverRoot } from "reka-ui";
import PopoverContent from "./ui/PopoverContent.vue";
import { popoverDefaults, popoverPlacement, usePopover } from "../../composables/popover";
import { useWakebContext } from "../../core/runtime";
import { overlayBindings } from "./tooltip";
import type { PopoverProps } from "../../types";
defineOptions({ name: "WPopover", inheritAttrs: false });
const props = withDefaults(defineProps<PopoverProps>(), popoverDefaults);
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
defineSlots<{
  activator?(props: { props: Record<string, unknown>; isActive: boolean }): unknown;
  default?(props: { close: () => void }): unknown;
}>();
const context = useWakebContext("WPopover");
const { isActive, id, close, toggle, activatorAria } = usePopover(props, emit);
const placement = computed(() => popoverPlacement(props.location));
let triggerElement: HTMLElement | undefined;
let interactedOutside = false;
const activate = (event: MouseEvent) => {
  interactedOutside = false;
  triggerElement = event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined;
  toggle();
};
const activatorProps = computed(() => ({ ...activatorAria.value, onClick: activate }));
const contentBindings = computed(() => overlayBindings(context, { class: props.contentClass, style: props.contentStyle }));
/* The activator toggles on its own click, so that click is not an outside interaction. */
const onInteractOutside = (event: Event) => {
  const target = (event as CustomEvent<{ originalEvent?: Event }>).detail?.originalEvent?.target ?? event.target;
  if (target instanceof Node && anchorElement()?.contains(target)) event.preventDefault();
  else interactedOutside = true;
};
let anchorNode: HTMLElement | undefined;
const anchorElement = () => anchorNode;
const setAnchor = (element: unknown) => {
  anchorNode = (element as { $el?: HTMLElement } | null)?.$el ?? (element as HTMLElement | undefined);
};
/* PopoverAnchor supplies positioning, not Reka's trigger ref used by FocusScope. */
const restoreFocus = (event: Event) => {
  if (interactedOutside) { interactedOutside = false; return; }
  event.preventDefault();
  const target = triggerElement ?? anchorElement()?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]');
  target?.focus({ preventScroll: true });
};
const onContentClick = () => {
  if (props.closeOnContentClick) close();
};
</script>
<template>
  <PopoverRoot v-model:open="isActive" :modal="false">
    <PopoverAnchor :ref="setAnchor" v-bind="$attrs" as="span" class="wakeb-popover__anchor">
      <slot name="activator" :props="activatorProps" :is-active="isActive" />
    </PopoverAnchor>
    <PopoverContent
      :id="id"
      v-bind="contentBindings"
      class="wakeb-popover"
      :side="placement.side"
      :align="placement.align"
      :side-offset="offset"
      :aria-label="ariaLabel"
      aria-modal="false"
      :dir="context.direction === 'rtl' ? 'rtl' : undefined"
      @interact-outside="onInteractOutside"
      @close-auto-focus="restoreFocus"
      @click="onContentClick"
    >
      <slot :close="close" />
    </PopoverContent>
  </PopoverRoot>
</template>
<style lang="scss">
@use "../../styles/popover";
.wakeb-popover__anchor {
  display: inline-block;
}
</style>
