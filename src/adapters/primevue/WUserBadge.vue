<script setup lang="ts">
import { computed } from "vue";
import Avatar from "primevue/avatar";
import WBadge from "./WBadge.vue";
import type { UserBadgeProps, BadgeUser } from "../../types";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { AVATAR_TEXT, useUserBadge, userBadgeDefaults } from "../../composables/user-badge";
defineOptions({ name: "WUserBadge" });
const props = withDefaults(defineProps<UserBadgeProps>(), userBadgeDefaults);
const toColor = useColor("WUserBadge", PRIMEVUE_INTENTS);
const { avatar, initials } = useUserBadge(props);
const dimension = computed(() => (typeof props.avatarSize === "number" || /^\d+(\.\d+)?$/.test(props.avatarSize) ? `${props.avatarSize}px` : props.avatarSize));
const box = computed(() => ({ width: dimension.value, height: dimension.value }));
const fill = computed(() => ({ ...box.value, backgroundColor: toColor(props.avatarColor, "avatarColor", "primary").css, color: AVATAR_TEXT }));
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
        ><Avatar v-if="avatar" shape="circle" class="wakeb-avatar wakeb-user-badge__avatar" :style="box"
          ><img :src="avatar" alt="" /></Avatar
        ><Avatar
          v-else
          shape="circle"
          class="wakeb-avatar wakeb-user-badge__avatar wakeb-user-badge__initials"
          :style="fill"
          >{{ initials }}</Avatar
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
:deep(.wakeb-badge) {
  height: auto !important;
}
:deep(.wakeb-badge .wakeb-badge__content) {
  padding: 6px 8px !important;
}
/* The VAvatar box, so the avatar looks the same with or without PrimeVue's styled mode. */
.wakeb-user-badge__avatar {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  line-height: normal;
}
.wakeb-user-badge__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.wakeb-user-badge__initials {
  font-size: var(--wakeb-user-badge-initials-size, 8px) !important;
}
</style>
