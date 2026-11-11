<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { aspectRatio, imageDefaults, safeImageSource, toUnit } from "../../composables/elements";
import { useWakebContext } from "../../core/runtime";
import type { ImageProps } from "../../types";
defineOptions({ name: "WImage" });
const props = withDefaults(defineProps<ImageProps>(), imageDefaults);
defineSlots<{ placeholder?(): unknown }>();
useWakebContext("WImage");
const source = computed(() => safeImageSource(props.src));
/* The placeholder shows until the image loads, and again when it fails, like VImg. */
const state = ref<"loading" | "loaded" | "error">("loading");
watch(source, () => (state.value = "loading"));
const style = computed(() => ({ width: toUnit(props.width), height: toUnit(props.height), aspectRatio: aspectRatio(props.aspectRatio) }));
</script>
<template>
  <div class="wakeb-image wakeb-image-native" :class="{ 'wakeb-image--cover': cover }" :style="style">
    <img
      v-if="source"
      class="wakeb-image__img"
      :src="source"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      decoding="async"
      @load="state = 'loaded'"
      @error="state = 'error'"
    />
    <div v-if="$slots.placeholder && state !== 'loaded'" class="wakeb-image__placeholder"><slot name="placeholder" /></div>
  </div>
</template>
<style lang="scss">
@use "../../styles/image";
</style>
