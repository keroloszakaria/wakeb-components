import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import type { CarouselProps } from "../types";

/** Defaults shared by every WCarousel renderer; providers must not change them. */
export const carouselDefaults = {
  slides: () => [],
  interval: 5000,
  cycle: true,
  showArrows: false,
  showIndicators: false,
  keyboardIndicators: true,
  height: "100%",
  ariaLabel: "Carousel",
  indicatorLabel: (index: number) => `Go to slide ${index + 1}`,
} as const;

type ResolvedCarouselProps = Required<Omit<CarouselProps, "modelValue" | "indicatorAttrs">> & CarouselProps;
type CarouselEmit = (event: "update:modelValue", index: number) => void;
/** Elements whose hover or focus pauses cycling: the carousel root and the indicator row. */
export type CarouselPart = "root" | "indicators";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Provider-neutral WCarousel behavior (SPEC R13, R18): the numeric index model, one emission per
 * local change, indicator keys, and the automatic cycle. Wakeb owns the cycle timer on every
 * provider. It pauses while the pointer is over the carousel or its indicators, while focus is
 * inside either, while the document is hidden, and whenever the user prefers reduced motion.
 * Browser globals are read only after mount, and every timer and listener is removed on unmount.
 */
export function useCarousel(props: ResolvedCarouselProps, emit: CarouselEmit) {
  const currentSlide = ref(props.modelValue ?? 0);
  const indicators = ref<HTMLElement | null>(null);
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
  /** Continuous previous/next, as the Vuetify window wraps at both ends. */
  const step = (delta: number) => {
    const count = props.slides.length;
    if (!count) return;
    select((((currentSlide.value + delta) % count) + count) % count);
  };
  const prev = () => step(-1);
  const next = () => step(1);

  function onIndicatorKeydown(event: KeyboardEvent, index: number) {
    if (!props.keyboardIndicators) return;
    const rtl = indicators.value && getComputedStyle(indicators.value).direction === "rtl";
    let target = index;
    if (event.key === "Home") target = 0;
    else if (event.key === "End") target = props.slides.length - 1;
    else if (event.key === "ArrowRight") target = (index + (rtl ? -1 : 1) + props.slides.length) % props.slides.length;
    else if (event.key === "ArrowLeft") target = (index + (rtl ? 1 : -1) + props.slides.length) % props.slides.length;
    else return;
    event.preventDefault();
    select(target);
    nextTick(() => indicators.value?.querySelectorAll("button")[target]?.focus());
  }

  /* Pause sources. Each part tracks its own hover and focus so moving between them never resumes early. */
  const hovered = reactive<Record<CarouselPart, boolean>>({ root: false, indicators: false });
  const focused = reactive<Record<CarouselPart, boolean>>({ root: false, indicators: false });
  const mounted = ref(false);
  const hidden = ref(false);
  const reducedMotion = ref(false);
  const running = computed(
    () =>
      mounted.value &&
      props.cycle &&
      props.slides.length > 1 &&
      !hidden.value &&
      !reducedMotion.value &&
      !hovered.root &&
      !hovered.indicators &&
      !focused.root &&
      !focused.indicators,
  );
  let timer: ReturnType<typeof setTimeout> | undefined;
  const clear = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  /* Every index change restarts the full interval, so a manual choice is never skipped immediately. */
  function schedule() {
    clear();
    if (!running.value) return;
    const delay = Number(props.interval) > 0 ? Number(props.interval) : 6000;
    timer = setTimeout(() => {
      timer = undefined;
      next();
    }, delay);
  }
  watch([running, currentSlide, () => props.interval], schedule);

  /** Listeners for one part; bind them to the element that represents it. */
  const pauseHandlers = (part: CarouselPart) => ({
    onMouseenter: () => {
      hovered[part] = true;
    },
    onMouseleave: () => {
      hovered[part] = false;
    },
    onFocusin: () => {
      focused[part] = true;
    },
    onFocusout: (event: FocusEvent) => {
      const to = event.relatedTarget as Node | null;
      const within = event.currentTarget instanceof Node && to !== null && event.currentTarget.contains(to);
      focused[part] = within;
    },
  });

  let media: MediaQueryList | undefined;
  const onVisibility = () => {
    hidden.value = document.visibilityState === "hidden";
  };
  const onMotion = () => {
    reducedMotion.value = Boolean(media?.matches);
  };
  onMounted(() => {
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    media = typeof window.matchMedia === "function" ? window.matchMedia(REDUCED_MOTION) : undefined;
    onMotion();
    media?.addEventListener?.("change", onMotion);
    // The running watcher starts the first interval.
    mounted.value = true;
  });
  onBeforeUnmount(() => {
    mounted.value = false;
    clear();
    document.removeEventListener("visibilitychange", onVisibility);
    media?.removeEventListener?.("change", onMotion);
    media = undefined;
  });

  return { currentSlide, indicators, select, prev, next, onIndicatorKeydown, pauseHandlers, running };
}
