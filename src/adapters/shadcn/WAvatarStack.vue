<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { PopoverAnchor, PopoverRoot, TooltipProvider, TooltipRoot, TooltipTrigger } from "reka-ui";
import TooltipContent from "./ui/TooltipContent.vue";
import PopoverContent from "./ui/PopoverContent.vue";
import type { AvatarStackProps } from "../../types";
import { SHADCN_INTENTS, useColor } from "../../core/vocabulary";
import { useWakebContext } from "../../core/runtime";
import { avatarLength, avatarStackDefaults, useAvatarStack } from "../../composables/avatar-stack";
import { overlayBindings, useOverflowPopover } from "./tooltip";
defineOptions({ name: "WAvatarStack" });
const props = withDefaults(defineProps<AvatarStackProps>(), avatarStackDefaults);
defineSlots<{ avatar(props: { item: unknown; index: number; label: string; avatar: string; initials: string }): unknown; overflow(props: { count: number }): unknown }>();
const context = useWakebContext("WAvatarStack");
/* Provider color names are not portable here: they fall back to primary with WAKEB_UNKNOWN_VALUE (SPEC R23). */
const toColor = useColor("WAvatarStack", SHADCN_INTENTS);
const { visibleItems, overflowItems, overflowCount, overflowName, getName, getAvatar, getKey, initials } = useAvatarStack(props);
const fill = computed(() => ({
  backgroundColor: toColor(props.avatarColor, "avatarColor", "primary").css,
  color: "var(--wakeb-avatar-text, var(--wakeb-ui-on-primary, #fff))",
}));
const box = computed(() => {
  const length = avatarLength(props.size);
  return { width: length, height: length };
});
/*
 * One reka-ui Tooltip per visible avatar. reka-ui opens it on keyboard focus and pointer hover and
 * closes the others; mouseenter opens it as well, so hover does not depend on pointer events.
 */
const openTooltip = ref<number | null>(null);
const setTooltip = (index: number, value: boolean) => {
  if (value) openTooltip.value = index;
  else if (openTooltip.value === index) openTooltip.value = null;
};
watch(
  () => props.showTooltip,
  (value) => {
    if (!value) openTooltip.value = null;
  },
);
const tooltipBindings = computed(() => overlayBindings(context));
/* Vuetify's open-on-hover menu also opens on focus; clicks never close it. */
const { open, onOpenChange, activator, content } = useOverflowPopover({ click: () => "show", focus: () => true });
const menuId = `wakeb-avatar-overflow-${useId()}`;
/* The theme scope and stacking sit on the teleported root; menuStyle sits on the list inside it and wins. */
const menuBindings = computed(() => overlayBindings(context));
</script>
<template>
  <div class="avatars-stack">
    <TooltipProvider :delay-duration="0">
      <TooltipRoot
        v-for="(item, index) in visibleItems"
        :key="getKey(item, index)"
        :open="openTooltip === index"
        :disabled="!showTooltip"
        @update:open="(value: boolean) => setTooltip(index, value)"
      >
        <TooltipTrigger as-child>
          <div
            :tabindex="showTooltip ? 0 : undefined"
            role="img"
            :aria-label="getName(item)"
            @mouseenter="showTooltip && setTooltip(index, true)"
          >
            <slot name="avatar" :item="item" :index="index" :label="getName(item)" :avatar="getAvatar(item)" :initials="initials(item)">
              <span v-if="getAvatar(item)" data-slot="avatar" class="actor-avatar wakeb-sc-avatar" :style="[box, fill]" aria-hidden="true"
                ><img data-slot="avatar-image" :src="getAvatar(item)" alt=""
              /></span>
              <span v-else data-slot="avatar-fallback" class="actor-avatar wakeb-sc-avatar" :style="[box, fill]" aria-hidden="true">{{ initials(item) }}</span>
            </slot>
          </div>
        </TooltipTrigger>
        <TooltipContent v-if="showTooltip" side="top" v-bind="tooltipBindings">
          <span class="wakeb-sc-tooltip-text" :style="tooltipStyle">{{ getName(item) }}</span>
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
    <PopoverRoot v-if="overflowCount > 0 && showOverflowMenu" :open="open" @update:open="onOpenChange">
      <PopoverAnchor as-child>
        <button
          type="button"
          class="actor-avatar actor-overflow wakeb-sc-avatar"
          :style="[box, fill]"
          :aria-label="overflowName"
          :aria-expanded="open"
          :aria-controls="open ? menuId : undefined"
          v-bind="activator"
        >
          <span class="actor-initials"><slot name="overflow" :count="overflowCount">+{{ overflowCount }}</slot></span>
        </button>
      </PopoverAnchor>
      <PopoverContent
        side="top"
        :side-offset="8"
        class="wakeb-sc-overflow"
        v-bind="menuBindings"
        :aria-label="overflowName"
        aria-modal="false"
        @mouseenter="content.onMouseenter"
        @mouseleave="content.onMouseleave"
        @interact-outside="content.onInteractOutside"
        @focus-outside="content.onFocusOutside"
        @open-auto-focus="content.onOpenAutoFocus"
        @close-auto-focus="content.onCloseAutoFocus"
      >
        <ul :id="menuId" class="overflow-menu-list wakeb-sc-overflow__list" role="list" :style="menuStyle">
          <li v-for="(item, index) in overflowItems" :key="getKey(item, index)" class="overflow-menu-item wakeb-sc-overflow__item">
            <span v-if="getAvatar(item)" data-slot="avatar" class="overflow-menu-avatar wakeb-sc-avatar wakeb-sc-avatar--small" aria-hidden="true"
              ><img data-slot="avatar-image" :src="getAvatar(item)" alt=""
            /></span>
            <span v-else data-slot="avatar-fallback" class="overflow-menu-avatar wakeb-sc-avatar wakeb-sc-avatar--small" :style="fill" aria-hidden="true"
              ><span class="overflow-menu-initials">{{ initials(item) }}</span></span
            >
            <span class="overflow-menu-name">{{ getName(item) }}</span>
          </li>
        </ul>
      </PopoverContent>
    </PopoverRoot>
    <span v-else-if="overflowCount > 0" class="actor-avatar actor-overflow wakeb-sc-avatar" :style="[box, fill]" role="img" :aria-label="overflowName"
      ><span class="actor-initials"><slot name="overflow" :count="overflowCount">+{{ overflowCount }}</slot></span></span
    >
  </div>
</template>
<style scoped lang="scss">
@use "../../styles/avatar-stack";

/* Wakeb owns the avatar box on shadcn-vue (an Avatar is a clipped circle): size and centered content, also for the native overflow button. */
.wakeb-sc-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  box-sizing: border-box;
  border-radius: 50%;
  overflow: hidden;
  line-height: 1;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.wakeb-sc-avatar--small {
  width: 24px;
  height: 24px;
}
.wakeb-sc-avatar:is(button) {
  padding: 0;
  font: inherit;
  cursor: pointer;
  appearance: none;
}
.wakeb-sc-overflow__list {
  margin: 0;
  padding: 4px 0;
  list-style: none;
}
.wakeb-sc-overflow__item {
  display: flex;
  align-items: center;
  min-height: 36px;
}
.wakeb-sc-tooltip-text {
  overflow-wrap: anywhere;
}
</style>
<style>
/* The popover root is teleported by a child component, so this rule is global and namespaced. */
.wakeb-sc-overflow.wakeb-sc-popover {
  width: auto;
  padding: 0;
  overflow: hidden;
}
</style>
