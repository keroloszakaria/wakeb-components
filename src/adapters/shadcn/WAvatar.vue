<script setup lang="ts">
import { computed } from "vue";
import { AvatarFallback, AvatarImage, AvatarRoot } from "reka-ui";
import { avatarDefaults, initials, safeImageSource } from "../../composables/elements";
import { avatarLength } from "../../composables/avatar-stack";
import { SHADCN_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { AvatarProps } from "../../types";
defineOptions({ name: "WAvatar" });
const props = withDefaults(defineProps<AvatarProps>(), avatarDefaults);
defineSlots<{ default?(): unknown }>();
useWakebContext("WAvatar");
const toColor = useColor("WAvatar", SHADCN_INTENTS);
const source = computed(() => safeImageSource(props.image));
const style = computed(() => {
  const length = avatarLength(props.size);
  return { width: length, height: length, fontSize: `calc(${length} * 0.4)`, "--wakeb-avatar-color": toColor(props.color, "color", "primary").css };
});
const a11y = computed(() => (props.name ? { role: "img", "aria-label": props.name } : { "aria-hidden": "true" }));
</script>
<template>
  <!-- reka-ui shows the image once it loads and the fallback (initials or the slot) until then. -->
  <AvatarRoot v-bind="a11y" data-slot="avatar" class="wakeb-avatar wakeb-sc-avatar" :class="{ 'wakeb-sc-avatar--square': !rounded }" :style="style">
    <AvatarImage v-if="source" data-slot="avatar-image" class="wakeb-sc-avatar__image" :src="source" alt="" />
    <AvatarFallback data-slot="avatar-fallback" class="wakeb-sc-avatar__fallback">
      <slot><span class="wakeb-avatar__initials" aria-hidden="true">{{ initials(name) }}</span></slot>
    </AvatarFallback>
  </AvatarRoot>
</template>
<style>
/* Adapted from the shadcn-vue 2.9.0 Avatar (new-york-v4 registry, MIT License); see THIRD-PARTY-NOTICES.txt. */
.wakeb-sc-avatar {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 9999px;
  font-family: var(--wakeb-ui-font-family, inherit);
}
.wakeb-sc-avatar.wakeb-sc-avatar--square {
  border-radius: 8px;
}
.wakeb-sc-avatar .wakeb-sc-avatar__image {
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}
.wakeb-sc-avatar .wakeb-sc-avatar__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--wakeb-avatar-color);
  color: var(--primary-foreground, #fff);
}
</style>
