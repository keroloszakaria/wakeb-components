<script setup lang="ts">
import { computed, mergeProps, nextTick, ref, useAttrs, watch } from "vue";
import WakebIcon from "../../icons/WakebIcon";
import { carouselDefaults, useCarousel } from "../../composables/carousel";
import { useWakebContext } from "../../core/runtime";
import type { CarouselProps } from "../../types";
/*
 * Native Wakeb carousel on PrimeVue. PrimeVue Carousel pages through several visible items with its own
 * autoplay and indicators, so the portable index model, lazy slides and pause policy are Wakeb-owned here.
 */
defineOptions({ name: "WCarousel", inheritAttrs: false });
const props = withDefaults(defineProps<CarouselProps>(), carouselDefaults);
const emit = defineEmits<{ "update:modelValue": [index: number] }>();
defineSlots<{
  slide?(props: { slide: unknown; index: number }): unknown;
  prev?(props: { props: Record<string, unknown> }): unknown;
  next?(props: { props: Record<string, unknown> }): unknown;
}>();
const attrs = useAttrs();
const context = useWakebContext("WCarousel");
const { currentSlide, indicators, select, prev, next, onIndicatorKeydown, pauseHandlers } = useCarousel(props, emit);
const indicatorPause = pauseHandlers("indicators");
/* Caller attrs first; the pause listeners merge with caller listeners instead of replacing them. */
const rootBindings = computed(() => mergeProps(attrs, pauseHandlers("root")));
const cssHeight = computed(() => (typeof props.height === "number" ? `${props.height}px` : props.height));

/* Slides mount on first visit and keep their state afterwards, like the Vuetify window items. */
const visited = ref<number[]>([currentSlide.value]);
watch(currentSlide, (index) => {
  if (!visited.value.includes(index)) visited.value = [...visited.value, index];
});

/* Same arrow payload keys as the Vuetify provider: icon, class, onClick and aria-label. */
const ARROW_LABELS = {
  en: { prev: "Previous visual", next: "Next visual" },
  ar: { prev: "المعروض السابق", next: "المعروض التالي" },
} as const;
const rtl = computed(() => context.direction === "rtl");
const prevProps = computed(() => ({
  icon: rtl.value ? "$next" : "$prev",
  class: `wakeb-carousel__arrow wakeb-carousel__arrow--${rtl.value ? "right" : "left"}`,
  onClick: prev,
  "aria-label": ARROW_LABELS[context.locale].prev,
}));
const nextProps = computed(() => ({
  icon: rtl.value ? "$prev" : "$next",
  class: `wakeb-carousel__arrow wakeb-carousel__arrow--${rtl.value ? "left" : "right"}`,
  onClick: next,
  "aria-label": ARROW_LABELS[context.locale].next,
}));
const controls = ref<HTMLElement | null>(null);
/* Arrow keys inside the arrow controls move and keep focus on the matching arrow (Vuetify window behavior). */
function onArrowKeydown(event: KeyboardEvent) {
  const position = event.key === "ArrowLeft" ? 0 : event.key === "ArrowRight" ? 1 : -1;
  if (position < 0) return;
  event.preventDefault();
  if (position === 0) prev();
  else next();
  nextTick(() => (controls.value?.children[position] as HTMLElement | undefined)?.focus());
}
</script>
<template>
  <div
    v-bind="rootBindings"
    class="wakeb-carousel"
    :class="{ 'wakeb-carousel--arrows-hover': showArrows === 'hover' }"
    :style="{ height: cssHeight }"
    role="region"
    :aria-label="ariaLabel"
    aria-roledescription="carousel"
  >
    <div class="wakeb-carousel__container">
      <template v-for="(slide, index) in slides" :key="index">
        <div v-if="visited.includes(index)" v-show="index === currentSlide" class="wakeb-carousel__item">
          <slot name="slide" :slide="slide" :index="index" />
        </div>
      </template>
      <div v-if="showArrows !== false" ref="controls" class="wakeb-carousel__controls" @keydown="onArrowKeydown">
        <slot v-if="$slots.prev" name="prev" :props="prevProps" />
        <button v-else type="button" :class="prevProps.class" :aria-label="prevProps['aria-label']" @click="prev">
          <WakebIcon :icon="prevProps.icon" size="24" />
        </button>
        <slot v-if="$slots.next" name="next" :props="nextProps" />
        <button v-else type="button" :class="nextProps.class" :aria-label="nextProps['aria-label']" @click="next">
          <WakebIcon :icon="nextProps.icon" size="24" />
        </button>
      </div>
    </div>
  </div>
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
@use "../../styles/carousel";
@use "../../styles/carousel-native";
</style>
