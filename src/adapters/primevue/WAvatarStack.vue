<script setup lang="ts">
import { computed, useId } from "vue";
import Avatar from "primevue/avatar";
import Popover from "primevue/popover";
import type { AvatarStackProps } from "../../types";
import { PRIMEVUE_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import { avatarLength, avatarStackDefaults, useAvatarStack } from "../../composables/avatar-stack";
import { focusOpensTooltip, useOverflowPopup, useTooltipValue } from "./overlay";
/* The PrimeVue directive under a local name (no clash with Vuetify's v-tooltip), with zIndexOverlay. */
import { vPvTooltip } from "./tooltip";
defineOptions({ name: "WAvatarStack" });
const props = withDefaults(defineProps<AvatarStackProps>(), avatarStackDefaults);
defineSlots<{ avatar(props: { item: unknown; index: number; label: string; avatar: string; initials: string }): unknown; overflow(props: { count: number }): unknown }>();
const context = useWakebContext("WAvatarStack");
/* Provider color names are not portable here: they fall back to primary with WAKEB_UNKNOWN_VALUE (SPEC R23). */
const toColor = useColor("WAvatarStack", PRIMEVUE_INTENTS);
const { visibleItems, overflowItems, overflowCount, overflowName, getName, getAvatar, getKey, initials } = useAvatarStack(props);
const fill = computed(() => ({
  backgroundColor: toColor(props.avatarColor, "avatarColor", "primary").css,
  color: "var(--wakeb-avatar-text, var(--wakeb-ui-on-primary, #fff))",
}));
const box = computed(() => {
  const length = avatarLength(props.size);
  return { width: length, height: length };
});
const tooltip = useTooltipValue(context, () => props.tooltipStyle);
/* The image is decorative: its name is on the wrapper, so PrimeVue's default alt (the aria-label) is replaced. */
const decorativeImage = { image: { alt: "" } };
/* Vuetify's open-on-hover menu also opens on focus; clicks never close it. */
const { popover, open, activator, content } = useOverflowPopup({ click: () => "show", focus: () => true });
const menuId = `wakeb-avatar-overflow-${useId()}`;
/* The theme scope sits on the teleported root; menuStyle sits on the list inside it and wins. */
const overlay = computed(() => {
  const { style, ...attrs } = context.scope;
  return { ...attrs, style: [style, context.zIndexOverlay === undefined ? undefined : { zIndex: context.zIndexOverlay }] };
});
</script>
<template>
  <div class="avatars-stack">
    <div
      v-for="(item, index) in visibleItems"
      :key="getKey(item, index)"
      v-pv-tooltip.top="tooltip(getName(item), showTooltip)"
      :tabindex="showTooltip ? 0 : undefined"
      role="img"
      :aria-label="getName(item)"
      v-bind="showTooltip ? focusOpensTooltip : {}"
    >
      <slot name="avatar" :item="item" :index="index" :label="getName(item)" :avatar="getAvatar(item)" :initials="initials(item)">
        <Avatar v-if="getAvatar(item)" :image="getAvatar(item)" shape="circle" :pt="decorativeImage" class="actor-avatar wakeb-pv-avatar" :style="[box, fill]" aria-hidden="true" />
        <Avatar v-else shape="circle" class="actor-avatar wakeb-pv-avatar" :style="[box, fill]" aria-hidden="true">{{ initials(item) }}</Avatar>
      </slot>
    </div>
    <template v-if="overflowCount > 0 && showOverflowMenu">
      <button
        type="button"
        class="actor-avatar actor-overflow wakeb-pv-avatar"
        :style="[box, fill]"
        :aria-label="overflowName"
        :aria-expanded="open"
        :aria-controls="open ? menuId : undefined"
        v-bind="activator"
      >
        <span class="actor-initials"><slot name="overflow" :count="overflowCount">+{{ overflowCount }}</slot></span>
      </button>
      <Popover
        :id="menuId"
        ref="popover"
        class="wakeb-pv-overflow"
        v-bind="overlay"
        :aria-label="overflowName"
        aria-modal="false"
        :auto-z-index="context.zIndexOverlay === undefined"
        @mouseenter="content.onMouseenter"
        @mouseleave="content.onMouseleave"
        @hide="content.onHide"
      >
        <ul class="overflow-menu-list wakeb-pv-overflow__list" role="list" :style="menuStyle">
          <li v-for="(item, index) in overflowItems" :key="getKey(item, index)" class="overflow-menu-item wakeb-pv-overflow__item">
            <Avatar v-if="getAvatar(item)" :image="getAvatar(item)" shape="circle" :pt="decorativeImage" class="overflow-menu-avatar wakeb-pv-avatar wakeb-pv-avatar--small" aria-hidden="true" />
            <Avatar v-else shape="circle" class="overflow-menu-avatar wakeb-pv-avatar wakeb-pv-avatar--small" :style="fill" aria-hidden="true"><span class="overflow-menu-initials">{{ initials(item) }}</span></Avatar>
            <span class="overflow-menu-name">{{ getName(item) }}</span>
          </li>
        </ul>
      </Popover>
    </template>
    <Avatar v-else-if="overflowCount > 0" shape="circle" class="actor-avatar actor-overflow wakeb-pv-avatar" :style="[box, fill]" role="img" :aria-label="overflowName"
      ><span class="actor-initials"><slot name="overflow" :count="overflowCount">+{{ overflowCount }}</slot></span></Avatar
    >
  </div>
</template>
<style scoped lang="scss">
@use "../../styles/avatar-stack";

/* Wakeb owns the avatar box on PrimeVue: size, circle and centered content, also for the native overflow button. */
.wakeb-pv-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  box-sizing: border-box;
  border-radius: 50%;
  overflow: hidden;
  line-height: 1;
  :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.wakeb-pv-avatar--small {
  width: 24px;
  height: 24px;
}
button.wakeb-pv-avatar {
  padding: 0;
  font: inherit;
  cursor: pointer;
  appearance: none;
}
.wakeb-pv-overflow__list {
  margin: 0;
  padding: 4px 0;
  list-style: none;
}
.wakeb-pv-overflow__item {
  display: flex;
  align-items: center;
  min-height: 36px;
}
</style>
