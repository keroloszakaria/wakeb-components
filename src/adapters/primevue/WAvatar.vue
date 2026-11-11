<script setup lang="ts">
import { computed } from "vue";
import Avatar from "primevue/avatar";
import { avatarDefaults, initials, safeImageSource } from "../../composables/elements";
import { avatarLength } from "../../composables/avatar-stack";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import type { AvatarProps } from "../../types";
defineOptions({ name: "WAvatar" });
const props = withDefaults(defineProps<AvatarProps>(), avatarDefaults);
defineSlots<{ default?(): unknown }>();
useWakebContext("WAvatar");
const toColor = useColor("WAvatar", PRIMEVUE_INTENTS);
const source = computed(() => safeImageSource(props.image));
const style = computed(() => {
  const length = avatarLength(props.size);
  return {
    width: length,
    height: length,
    fontSize: `calc(${length} * 0.4)`,
    ...(source.value ? {} : { background: toColor(props.color, "color", "primary").css, color: "var(--wakeb-ui-on-primary, #fff)" }),
  };
});
/* Avatar labels itself from aria-label; Wakeb names it from `name` and marks a nameless one decorative. */
const a11y = computed(() => (props.name ? { role: "img", "aria-label": props.name } : { "aria-hidden": "true" }));
</script>
<template>
  <Avatar v-bind="a11y" class="wakeb-avatar wakeb-pv-avatar" :image="source" :shape="rounded ? 'circle' : 'square'" :style="style" :pt="{ image: { alt: '' } }">
    <template v-if="!source">
      <slot><span class="wakeb-avatar__initials" aria-hidden="true">{{ initials(name) }}</span></slot>
    </template>
  </Avatar>
</template>
<style>
.wakeb-pv-avatar.p-avatar {
  flex: none;
  overflow: hidden;
}
.wakeb-pv-avatar:not(.p-avatar-circle) {
  border-radius: 8px;
}
.wakeb-pv-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
