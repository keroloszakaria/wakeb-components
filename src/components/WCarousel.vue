<script setup lang="ts">
import { useAttrs } from "vue";
import { VCarousel, VCarouselItem } from "vuetify/components/VCarousel";
import { carouselDefaults, useCarousel } from "../composables/carousel";
import type { CarouselProps } from "../types";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CarouselProps>(), carouselDefaults);
const emit = defineEmits<{ "update:modelValue": [index: number] }>();
defineSlots<{
  slide?(props: { slide: unknown; index: number }): unknown;
  prev?(props: { props: Record<string, unknown> }): unknown;
  next?(props: { props: Record<string, unknown> }): unknown;
}>();
const attrs = useAttrs();
/* Index model, indicator keys and the cycle timer with its pause policy are shared (composables/carousel). */
const { currentSlide, indicators, select, onIndicatorKeydown, pauseHandlers } = useCarousel(props, emit);
const rootPause = pauseHandlers("root"),
  indicatorPause = pauseHandlers("indicators");
</script>
<template>
  <!-- Wakeb drives cycling, so VCarousel's own timer stays off; interval is still passed for compatibility. -->
  <VCarousel
    v-bind="attrs"
    :model-value="currentSlide"
    :hide-delimiters="true"
    :show-arrows="showArrows"
    :cycle="false"
    :interval="interval"
    :height="height"
    role="region"
    :aria-label="ariaLabel"
    aria-roledescription="carousel"
    @update:model-value="select($event as number)"
    @mouseenter="rootPause.onMouseenter"
    @mouseleave="rootPause.onMouseleave"
    @focusin="rootPause.onFocusin"
    @focusout="rootPause.onFocusout"
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
  <div v-if="showIndicators" ref="indicators" class="carousel-indicators" v-bind="indicatorPause">
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
@use "../styles/carousel";
</style>
