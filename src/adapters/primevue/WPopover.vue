<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import Popover from "primevue/popover";
import { popoverDefaults, usePopover } from "../../composables/popover";
import { useWakebContext } from "../../core/runtime";
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
const popover = ref<InstanceType<typeof Popover>>();
const anchor = ref<HTMLElement>();
const panel = ref<HTMLElement>();
/* PrimeVue aligns the panel to its target: the first element the activator slot renders. */
const target = () => (anchor.value?.firstElementChild as HTMLElement | null) ?? anchor.value;
const activatorProps = computed(() => ({ ...activatorAria.value, onClick: toggle }));
/* Theme scope and stacking on the teleported root; caller styles come last and win. */
const overlay = computed(() => {
  const { style, ...attrs } = context.scope;
  return { ...attrs, style: [style, context.zIndexOverlay === undefined ? undefined : { zIndex: context.zIndexOverlay }, props.contentStyle] };
});
const pt = { content: { class: "wakeb-popover__body" } };
watch(
  isActive,
  async (open) => {
    if (typeof document === "undefined") return;
    await nextTick();
    const element = target();
    if (open && element) popover.value?.show({ currentTarget: element } as unknown as Event, element);
    else if (!open) {
      /* Focus inside the panel returns to the activator, like Vuetify and reka-ui. */
      if (panel.value?.contains(document.activeElement)) element?.focus();
      popover.value?.hide();
    }
  },
  { immediate: true, flush: "post" },
);
const onShow = () => {
  if (panel.value && !panel.value.contains(document.activeElement)) panel.value.focus({ preventScroll: true });
};
/* Popover closes itself on Escape and outside clicks. */
const onHide = () => {
  isActive.value = false;
};
const onContentClick = () => {
  if (props.closeOnContentClick) close();
};
</script>
<template>
  <span ref="anchor" v-bind="$attrs" class="wakeb-popover__anchor">
    <slot name="activator" :props="activatorProps" :is-active="isActive" />
  </span>
  <Popover
    :id="id"
    ref="popover"
    v-bind="overlay"
    :aria-label="ariaLabel"
    aria-modal="false"
    class="wakeb-popover"
    :class="contentClass"
    :pt="pt"
    :auto-z-index="context.zIndexOverlay === undefined"
    @show="onShow"
    @hide="onHide"
  >
    <!-- Popover's root is the role=dialog element; this panel only takes focus and content clicks. -->
    <div ref="panel" tabindex="-1" class="wakeb-popover__panel" @click="onContentClick">
      <slot :close="close" />
    </div>
  </Popover>
</template>
<style lang="scss">
@use "../../styles/popover";
.wakeb-popover__anchor {
  display: inline-block;
}
.wakeb-popover__panel {
  outline: none;
}
</style>
