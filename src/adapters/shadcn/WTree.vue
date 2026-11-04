<script setup lang="ts">
import WButton from "./WButton.vue";
import { treeDefaults, useTree } from "../../composables/tree";
import type { TreeProps, TreeNode, TreeToggleSlotProps } from "../../types";
/*
 * Native Wakeb tree markup on shadcn-vue: shadcn-vue has no Tree component, and reka-ui's Tree uses a
 * flattened, virtualizable item model with its own selection, so the shared composable and markup keep
 * the portable contract. Branch toggles are the shadcn-vue WButton.
 */
defineOptions({ name: "WTree" });
const props = withDefaults(defineProps<TreeProps>(), treeDefaults);
const emit = defineEmits<{
  "node-click": [node: TreeNode];
  toggle: [node: TreeNode];
}>();
defineSlots<{
  node?(props: { node: TreeNode; level: number; expanded: boolean }): unknown;
  actions?(props: { node: TreeNode; level: number }): unknown;
  "toggle-leading"?(props: TreeToggleSlotProps): unknown;
  "toggle-trailing"?(props: TreeToggleSlotProps): unknown;
}>();
/* Expansion, active path, roving focus and keys are shared with every provider (composables/tree). */
const {
  treeRoot,
  keyOf,
  childrenOf,
  hasChildren,
  isExpanded,
  isActive,
  isFocusTarget,
  setFocusTarget,
  clickNode,
  onNodeKeydown,
  resolvedActivePath,
  isInActivePath,
  isTrunkTopActive,
  isTrunkBottomActive,
  toggleNode,
  toggleSlotProps,
  isInlineEditingNode,
  onFocusIn,
  onFocusOut,
} = useTree(props, emit);
</script>
<template>
  <ul
    ref="treeRoot"
    :role="keyboardNavigation ? (isRoot ? 'tree' : 'group') : undefined"
    :aria-label="keyboardNavigation && isRoot ? ariaLabel : undefined"
    class="tree"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    :class="{ 'tree--root': isRoot, 'tree--rtl': rtl }"
  >
    <li
      v-for="(node, index) in nodes"
      :key="keyOf(node) ?? index"
      class="tree__node"
      :data-tree-key="keyboardNavigation ? String(keyOf(node)) : undefined"
      :role="keyboardNavigation ? 'treeitem' : undefined"
      :aria-label="
        keyboardNavigation ? String(node[itemLabel] ?? '') : undefined
      "
      :aria-expanded="
        keyboardNavigation && hasChildren(node) ? isExpanded(node) : undefined
      "
      :aria-selected="keyboardNavigation ? isActive(node) : undefined"
      :aria-level="keyboardNavigation ? level + 1 : undefined"
      :aria-posinset="keyboardNavigation ? index + 1 : undefined"
      :aria-setsize="keyboardNavigation ? nodes.length : undefined"
      :tabindex="
        keyboardNavigation ? (isFocusTarget(node) ? 0 : -1) : undefined
      "
      @focus="keyboardNavigation && setFocusTarget(node)"
      @keydown.self="onNodeKeydown($event, node)"
      :class="{
        'tree__node--expanded': isExpanded(node),
        'tree__node--has-children': hasChildren(node),
        'tree__node--last': index === nodes.length - 1,
        'tree__node--trunk': !isRoot && index !== nodes.length - 1,
        'tree__node--trunk-active': isTrunkBottomActive(index),
        'tree__node--inline-editing': isInlineEditingNode(node),
      }"
    >
      <div
        class="tree__node-content"
        :class="{ 'tree__node-content--active': isActive(node) }"
        @click="clickNode($event, node)"
      >
        <template v-if="!isRoot">
          <span
            class="tree__node-line-curve"
            :class="{
              'tree__node-line-curve--trunk-active': isTrunkTopActive(index),
              'tree__node-line-curve--active': isInActivePath(node),
            }"
          ></span>
          <span
            v-if="index !== nodes.length - 1"
            class="tree__node-line-trunk-bottom"
            :class="{
              'tree__node-line-trunk-bottom--active':
                isTrunkBottomActive(index),
            }"
          ></span>
        </template>
        <div class="tree__node-header">
          <div class="tree__node-start">
            <div class="tree__node-toggle-leading">
              <slot name="toggle-leading" v-bind="toggleSlotProps(node)" />
            </div>

            <div class="tree__node-info">
              <slot
                name="node"
                :node="node"
                :level="level"
                :expanded="isExpanded(node)"
              >
                <span class="tree__node-label">{{ node[itemLabel] }}</span>
                <span
                  v-if="node[itemDescription]"
                  class="tree__node-description"
                >
                  {{ node[itemDescription] }}
                </span>
              </slot>
            </div>
          </div>

          <div class="tree__node-actions" @click.stop>
            <slot name="actions" :node="node" :level="level"></slot>

            <slot name="toggle-trailing" v-bind="toggleSlotProps(node)">
              <WButton
                v-if="hasChildren(node)"
                type="icon"
                size="sm"
                :aria-label="toggleLabel"
                :aria-expanded="isExpanded(node)"
                :class-list="[
                  'tree__toggle',
                  { 'tree__toggle--open': isExpanded(node) },
                ]"
                @click="toggleNode(node)"
                ><template #content
                  ><svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    /></svg></template
              ></WButton>
            </slot>
          </div>
        </div>
      </div>

      <Transition name="tree-expand">
        <div
          v-if="hasChildren(node) && isExpanded(node)"
          class="tree__children"
        >
          <WTree
            :nodes="childrenOf(node)"
            :keyboard-navigation="keyboardNavigation"
            :aria-label="ariaLabel"
            :toggle-label="toggleLabel"
            :item-key="itemKey"
            :item-label="itemLabel"
            :item-description="itemDescription"
            :children-key="childrenKey"
            :level="level + 1"
            :is-root="false"
            :rtl="rtl"
            :editing-node-id="editingNodeId"
            :expanded-keys="expandedKeys"
            :active-key="activeKey"
            :active-path="resolvedActivePath"
            @node-click="$emit('node-click', $event)"
            @toggle="$emit('toggle', $event)"
          >
            <template v-if="$slots.node" #node="slotProps">
              <slot name="node" v-bind="slotProps"></slot>
            </template>
            <template #actions="slotProps">
              <slot name="actions" v-bind="slotProps"></slot>
            </template>
            <template #toggle-leading="slotProps">
              <slot name="toggle-leading" v-bind="slotProps"></slot>
            </template>
            <template #toggle-trailing="slotProps">
              <slot name="toggle-trailing" v-bind="slotProps">
                <WButton
                  v-if="slotProps.hasChildren"
                  type="icon"
                  size="sm"
                  :aria-label="toggleLabel"
                  :aria-expanded="slotProps.expanded"
                  :class-list="[
                    'tree__toggle',
                    { 'tree__toggle--open': slotProps.expanded },
                  ]"
                  @click="slotProps.toggle"
                  ><template #content
                    ><svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="m6 9 6 6 6-6"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      /></svg></template
                ></WButton>
              </slot>
            </template>
          </WTree>
        </div>
      </Transition>
    </li>
  </ul>
</template>


<style lang="scss" scoped>
@use "../../styles/tree";
</style>
