<script setup lang="ts">
import { computed } from "vue";
import { VAvatar } from "vuetify/components/VAvatar";
import { VImg } from "vuetify/components/VImg";
import WBadge from "./WBadge.vue";
import type { UserBadgeProps, BadgeUser } from "../types";
import { VUETIFY_INTENTS, useColor, vuetifyFill } from "../core/vocabulary";
import { AVATAR_TEXT, useUserBadge, userBadgeDefaults } from "../composables/user-badge";
const props = withDefaults(defineProps<UserBadgeProps>(), userBadgeDefaults);
const toColor = useColor("WUserBadge", VUETIFY_INTENTS, true);
const fill = computed(() => vuetifyFill(toColor(props.avatarColor, "avatarColor", "primary"), AVATAR_TEXT));
const { avatar, initials } = useUserBadge(props);
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
          v-bind="fill"
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
