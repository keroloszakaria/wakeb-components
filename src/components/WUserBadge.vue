<script setup lang="ts">
import { computed } from "vue";
import { VAvatar } from "vuetify/components/VAvatar";
import { VImg } from "vuetify/components/VImg";
import WBadge from "./WBadge.vue";
import type { UserBadgeProps, BadgeUser } from "../types";
const props = withDefaults(defineProps<UserBadgeProps>(), {
  user: () => ({}),
  type: "outline",
  borderRadius: "md",
  icon: "",
  iconSize: "xs",
  iconPosition: "before",
  avatarSize: 16,
  avatarColor: "primary",
});
const avatar = computed(() => {
  const value = props.user.avatar;
  return typeof value === "string" &&
    (value.startsWith("http") ||
      value.startsWith("/") ||
      value.startsWith("data:"))
    ? value
    : "";
});
const initials = computed(() => {
  const name = props.user.name;
  if (!name || name === "—") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.charAt(0) || ""}${parts[1]?.charAt(0) || ""}`.toUpperCase();
});
defineSlots<{
  avatar?(props: {
    user: BadgeUser;
    avatar: string;
    initials: string;
    size: string | number;
  }): unknown;
  default?(props: { user: BadgeUser }): unknown;
  actions?(props: { user: BadgeUser }): unknown;
}>();
</script>
<template>
  <WBadge
    class="wakeb-user-badge"
    :label="user.name"
    :type="type"
    :border-radius="borderRadius"
    :icon="icon"
    :icon-size="iconSize"
    :icon-position="iconPosition"
  >
    <template #icon
      ><slot
        name="avatar"
        :user="user"
        :avatar="avatar"
        :initials="initials"
        :size="avatarSize"
        ><VAvatar v-if="avatar" :size="avatarSize"
          ><VImg :src="avatar" alt="" /></VAvatar
        ><VAvatar
          v-else
          :size="avatarSize"
          :color="avatarColor"
          class="wakeb-user-badge__initials text-[8px]!"
          >{{ initials }}</VAvatar
        ></slot
      ></template
    >
    <template #default
      ><slot :user="user"
        ><span>{{ user.name }}</span></slot
      ><slot name="actions" :user="user"
    /></template>
  </WBadge>
</template>
<style scoped>
:deep(.v-chip) {
  height: auto !important;
}
:deep(.v-chip .v-chip__content) {
  padding: 6px 8px !important;
}
.wakeb-user-badge__initials {
  font-size: var(--wakeb-user-badge-initials-size, 8px) !important;
}
</style>
