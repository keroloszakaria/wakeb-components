<script setup lang="ts">
import { computed } from "vue";
import { VAvatar } from "vuetify/components/VAvatar";
import { VImg } from "vuetify/components/VImg";
import { avatarDefaults, initials, safeImageSource } from "../composables/elements";
import { avatarLength } from "../composables/avatar-stack";
import { VUETIFY_INTENTS, useColor } from "../core/vocabulary";
import { useWakebContext } from "../core/runtime";
import type { AvatarProps } from "../types";
defineOptions({ name: "WAvatar" });
const props = withDefaults(defineProps<AvatarProps>(), avatarDefaults);
defineSlots<{ default?(): unknown }>();
useWakebContext("WAvatar");
const toColor = useColor("WAvatar", VUETIFY_INTENTS);
const source = computed(() => safeImageSource(props.image));
const a11y = computed(() => (props.name ? { role: "img", "aria-label": props.name } : { "aria-hidden": "true" }));
</script>
<template>
  <VAvatar
    v-bind="a11y"
    class="wakeb-avatar"
    :size="avatarLength(size)"
    :color="source ? undefined : toColor(color, 'color', 'primary').css"
    :rounded="rounded ? 'circle' : 'lg'"
  >
    <VImg v-if="source" :src="source" alt="" cover aria-hidden="true" />
    <slot v-else><span class="wakeb-avatar__initials" aria-hidden="true">{{ initials(name) }}</span></slot>
  </VAvatar>
</template>
