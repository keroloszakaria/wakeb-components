<script setup lang="ts">
import { nextTick, ref, useAttrs, watch } from "vue";
import { VCarousel, VCarouselItem } from "vuetify/components/VCarousel";
import type { CarouselProps } from "../types";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CarouselProps>(), {
  slides: () => [],
  interval: 5000,
  cycle: true,
  showArrows: false,
  showIndicators: false,
  keyboardIndicators: true,
  height: "100%",
  ariaLabel: "Carousel",
  indicatorLabel: (index: number) => `Go to slide ${index + 1}`,
});
const emit = defineEmits<{ "update:modelValue": [index: number] }>();
defineSlots<{
  slide?(props: { slide: unknown; index: number }): unknown;
  prev?(props: { props: Record<string, unknown> }): unknown;
  next?(props: { props: Record<string, unknown> }): unknown;
}>();
const attrs = useAttrs(),
  currentSlide = ref(props.modelValue ?? 0),
  indicators = ref<HTMLElement | null>(null);
watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) currentSlide.value = value;
  },
);
function select(index: number) {
  if (!Number.isFinite(index) || index === currentSlide.value) return;
  currentSlide.value = index;
  emit("update:modelValue", index);
}
function onIndicatorKeydown(event: KeyboardEvent, index: number) {
  if (!props.keyboardIndicators) return;
  const rtl =
    indicators.value && getComputedStyle(indicators.value).direction === "rtl";
  let target = index;
  if (event.key === "Home") target = 0;
  else if (event.key === "End") target = props.slides.length - 1;
  else if (event.key === "ArrowRight")
    target =
      (index + (rtl ? -1 : 1) + props.slides.length) % props.slides.length;
  else if (event.key === "ArrowLeft")
    target =
      (index + (rtl ? 1 : -1) + props.slides.length) % props.slides.length;
  else return;
  event.preventDefault();
  select(target);
  nextTick(() => indicators.value?.querySelectorAll("button")[target]?.focus());
}
</script>
<template>
  <VCarousel
    v-bind="attrs"
    :model-value="currentSlide"
    :hide-delimiters="true"
    :show-arrows="showArrows"
    :cycle="cycle"
    :interval="interval"
    :height="height"
    role="region"
    :aria-label="ariaLabel"
    aria-roledescription="carousel"
    @update:model-value="select($event as number)"
  >
    <VCarouselItem v-for="(slide, index) in slides" :key="index"
      ><slot name="slide" :slide="slide" :index="index"
    /></VCarouselItem>
    <template v-if="$slots.prev" #prev="slotProps"
      ><slot name="prev" v-bind="slotProps"
    /></template>
    <template v-if="$slots.next" #next="slotProps"
      ><slot name="next" v-bind="slotProps"
    /></template>
  </VCarousel>
  <div v-if="showIndicators" ref="indicators" class="carousel-indicators">
    <button
      v-for="(_, index) in slides"
      :key="index"
      type="button"
      :data-wakeb-keyboard="keyboardIndicators ? '' : undefined"
      :aria-label="indicatorLabel(index)"
      :aria-current="currentSlide === index ? 'true' : undefined"
      :class="['indicator', { active: currentSlide === index }]"
      v-bind="indicatorAttrs"
      @click="select(index)"
      @keydown="onIndicatorKeydown($event, index)"
    />
  </div>
</template>
<style scoped lang="scss">
.carousel-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
  .indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: var(
      --wakeb-carousel-indicator-bg,
      var(--wakeb-carousel-fallback, #98a2b3)
    );
    transition: all 0.3s ease;
    &.active {
      background: var(
        --wakeb-carousel-indicator-active-bg,
        var(--wakeb-carousel-fallback, #087f8c)
      );
      width: 28px;
      border-radius: 5px;
    }
    &[data-wakeb-keyboard]:focus-visible {
      outline: 2px solid var(--wakeb-carousel-focus, #087f8c);
      outline-offset: 3px;
    }
  }
}
@media (prefers-reduced-motion: reduce) {
  .indicator {
    transition: none !important;
  }
}
</style>
