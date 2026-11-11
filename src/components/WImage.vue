<script setup lang="ts">
import { computed } from "vue";
import { VImg } from "vuetify/components/VImg";
import { aspectRatio, imageDefaults, safeImageSource } from "../composables/elements";
import { useWakebContext } from "../core/runtime";
import type { ImageProps } from "../types";
defineOptions({ name: "WImage" });
const props = withDefaults(defineProps<ImageProps>(), imageDefaults);
defineSlots<{ placeholder?(): unknown }>();
useWakebContext("WImage");
const source = computed(() => safeImageSource(props.src));
const ratio = computed(() => {
  const value = aspectRatio(props.aspectRatio);
  if (!value) return undefined;
  const [width, height] = value.split("/").map(Number);
  return height ? width / height : width;
});
</script>
<template>
  <!-- VImg names itself with alt (role=img); an empty alt makes it decorative. -->
  <VImg
    class="wakeb-image"
    :src="source"
    :alt="alt || undefined"
    :aria-hidden="alt ? undefined : 'true'"
    :width="width"
    :height="height"
    :aspect-ratio="ratio"
    :cover="cover"
    :eager="!lazy"
  >
    <template v-if="$slots.placeholder" #placeholder><slot name="placeholder" /></template>
    <template v-if="$slots.placeholder" #error><slot name="placeholder" /></template>
  </VImg>
</template>
