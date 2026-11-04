<script setup lang="ts">
import { computed } from "vue";
import WBadge from "./WBadge.vue";
import type { UserBadgeProps, BadgeUser } from "../../types";
import { SHADCN_INTENTS, useColor } from "../../core/vocabulary";
import { avatarLength } from "../../composables/avatar-stack";
import { AVATAR_TEXT, useUserBadge, userBadgeDefaults } from "../../composables/user-badge";
defineOptions({ name: "WUserBadge" });
const props = withDefaults(defineProps<UserBadgeProps>(), userBadgeDefaults);
/* Provider color names are not portable here: they fall back to primary with WAKEB_UNKNOWN_VALUE (SPEC R23). */
const toColor = useColor("WUserBadge", SHADCN_INTENTS);
const { avatar, initials } = useUserBadge(props);
const box = computed(() => {
  const length = avatarLength(props.avatarSize);
  return { width: length, height: length };
});
/*
 * Wakeb avatar markup with shadcn-vue's Avatar data-slot names. reka-ui's AvatarImage renders the
 * image only after it loads (and never on the server), so a plain decorative image is used instead.
 */
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
        ><span
          v-if="avatar"
          data-slot="avatar"
          class="wakeb-sc-avatar wakeb-user-badge__avatar"
          :style="box"
          ><img data-slot="avatar-image" :src="avatar" alt="" /></span
        ><span
          v-else
          data-slot="avatar-fallback"
          class="wakeb-sc-avatar wakeb-user-badge__avatar wakeb-user-badge__initials"
          :style="fill"
          >{{ initials }}</span
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
.wakeb-user-badge :deep(.wakeb-badge) {
  height: auto !important;
}
.wakeb-user-badge :deep(.wakeb-badge .wakeb-badge__content) {
  padding: 6px 8px !important;
}
/* The avatar box (shadcn-vue Avatar: a clipped circle), sized by avatarSize. */
.wakeb-sc-avatar {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 50%;
  line-height: normal;
}
.wakeb-sc-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.wakeb-user-badge__initials {
  font-size: var(--wakeb-user-badge-initials-size, 8px) !important;
}
</style>
