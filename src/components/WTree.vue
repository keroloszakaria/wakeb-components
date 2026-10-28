<script setup lang="ts">
import { computed, inject, provide, ref, watch, type Ref } from "vue";
import WButton from "./WButton.vue";
import type {
  TreeProps,
  TreeNode,
  TreeToggleSlotProps,
  NavigationKey,
} from "../types";
const props = withDefaults(defineProps<TreeProps>(), {
  nodes: () => [],
  itemKey: "id",
  itemLabel: "name",
  itemDescription: "description",
  childrenKey: "children",
  level: 0,
  isRoot: true,
  expandedKeys: () => [],
  activeKey: null,
  activePath: () => [],
  rtl: false,
  editingNodeId: null,
  keyboardNavigation: true,
  ariaLabel: "Tree",
  toggleLabel: "Toggle branch",
});
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
const keyOf = (node: TreeNode) => node[props.itemKey] as NavigationKey;
const childrenOf = (node: TreeNode) =>
  Array.isArray(node[props.childrenKey])
    ? (node[props.childrenKey] as readonly TreeNode[])
    : [];
const treeRoot = ref<HTMLElement | null>(null);
const inherited = inject<Ref<NavigationKey | undefined> | null>(
  "wakeb-tree-focus",
  null,
);
const focusKey =
  props.isRoot || !inherited
    ? ref<NavigationKey | undefined>(
        props.nodes[0] ? keyOf(props.nodes[0]) : undefined,
      )
    : inherited;
provide("wakeb-tree-focus", focusKey);
const visibleKeys = computed(() => {
  const keys: NavigationKey[] = [];
  const walk = (nodes: readonly TreeNode[]) => {
    for (const node of nodes) {
      keys.push(keyOf(node));
      if (props.expandedKeys.includes(keyOf(node))) walk(childrenOf(node));
    }
  };
  walk(props.nodes);
  return keys;
});
if (props.isRoot || !inherited)
  watch(
    visibleKeys,
    (keys) => {
      if (focusKey.value === undefined || !keys.includes(focusKey.value))
        focusKey.value = keys.includes(props.activeKey as NavigationKey)
          ? (props.activeKey as NavigationKey)
          : keys[0];
    },
    { immediate: true },
  );
function clickNode(event: MouseEvent, node: TreeNode) {
  if (props.keyboardNavigation)
    (event.currentTarget as HTMLElement)
      .closest<HTMLElement>("[role=treeitem]")
      ?.focus();
  emit("node-click", node);
}

function onNodeKeydown(event: KeyboardEvent, node: TreeNode) {
  if (
    !props.keyboardNavigation ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return;
  const el = event.currentTarget as HTMLElement,
    root = el.closest("[role=tree]") ?? treeRoot.value;
  const items = Array.from(
    root?.querySelectorAll<HTMLElement>("[role=treeitem]") ?? [],
  ).filter((e) => !e.closest(".tree-expand-leave-active"));
  const index = items.indexOf(el);
  let target: HTMLElement | undefined;
  const expand = props.rtl ? "ArrowLeft" : "ArrowRight",
    collapse = props.rtl ? "ArrowRight" : "ArrowLeft";
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    emit("node-click", node);
    return;
  }
  if (event.key === "ArrowDown")
    target = items[Math.min(items.length - 1, index + 1)];
  else if (event.key === "ArrowUp") target = items[Math.max(0, index - 1)];
  else if (event.key === "Home") target = items[0];
  else if (event.key === "End") target = items.at(-1);
  else if (event.key === expand) {
    if (hasChildren(node) && !isExpanded(node)) {
      event.preventDefault();
      emit("toggle", node);
      return;
    }
    if (isExpanded(node))
      target = el.querySelector<HTMLElement>("[role=treeitem]") ?? undefined;
  } else if (event.key === collapse) {
    if (hasChildren(node) && isExpanded(node)) {
      event.preventDefault();
      emit("toggle", node);
      return;
    }
    target =
      el.parentElement?.closest<HTMLElement>("[role=treeitem]") ?? undefined;
  } else return;
  event.preventDefault();
  target?.focus();
}
const findPathToNode = (
  nodes: readonly TreeNode[],
  targetKey: NavigationKey,
): NavigationKey[] | null => {
  for (const node of nodes) {
    if (keyOf(node) === targetKey) return [targetKey];
    const children = childrenOf(node);
    if (children?.length) {
      const path = findPathToNode(children, targetKey);
      if (path) return [keyOf(node), ...path];
    }
  }
  return null;
};

const resolvedActivePath = computed(() => {
  if (props.isRoot && props.activeKey != null) {
    return findPathToNode(props.nodes, props.activeKey) || [];
  }
  return props.activePath;
});

const hasChildren = (node: TreeNode) => {
  return childrenOf(node) && childrenOf(node).length > 0;
};

const isExpanded = (node: TreeNode) => {
  return props.expandedKeys.includes(keyOf(node));
};

const isActive = (node: TreeNode) => {
  return props.activeKey != null && keyOf(node) === props.activeKey;
};

const isInActivePath = (node: TreeNode) => {
  return resolvedActivePath.value.includes(keyOf(node));
};

const activePathIndex = computed(() => {
  return props.nodes.findIndex((n) => isInActivePath(n));
});

const isTrunkTopActive = (index: number) => {
  return activePathIndex.value >= 0 && index <= activePathIndex.value;
};

const isTrunkBottomActive = (index: number) => {
  return activePathIndex.value >= 0 && index < activePathIndex.value;
};

const toggleNode = (node: TreeNode) => {
  emit("toggle", node);
};

const toggleSlotProps = (node: TreeNode): TreeToggleSlotProps => ({
  node,
  level: props.level,
  expanded: isExpanded(node),
  hasChildren: hasChildren(node),
  toggle: () => toggleNode(node),
});

const isInlineEditingNode = (node: TreeNode) => {
  if (props.editingNodeId == null) return false;
  const key = keyOf(node);
  return (
    key === props.editingNodeId || String(key) === String(props.editingNodeId)
  );
};
</script>
<template>
  <ul
    ref="treeRoot"
    :role="keyboardNavigation ? (isRoot ? 'tree' : 'group') : undefined"
    :aria-label="keyboardNavigation && isRoot ? ariaLabel : undefined"
    class="tree"
    :class="{ 'tree--root': isRoot, 'tree--rtl': rtl }"
  >
    <li
      v-for="(node, index) in nodes"
      :key="keyOf(node) ?? index"
      class="tree__node"
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
        keyboardNavigation ? (focusKey === node[itemKey] ? 0 : -1) : undefined
      "
      @focus="keyboardNavigation && (focusKey = keyOf(node))"
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
.tree {
  list-style: none;
  padding: 0;
  margin: 0;

  &--rtl {
    direction: rtl;
    text-align: start;
  }

  &--root {
    > .tree__node {
      > .tree__node-content {
        border-radius: 12px;
      }
    }
  }

  &__node {
    position: relative;
    &-line {
      &-curve {
        position: absolute;
        inset-inline-start: -12px;
        top: 0;
        height: 50%;
        width: 20px;
        z-index: 1;
        pointer-events: none;
        border-inline-start: 1.5px solid
          var(--wakeb-tree-input-border, var(--wakeb-tree-fallback, #d0d5dd));
        border-bottom: 1.5px solid
          var(--wakeb-tree-input-border, var(--wakeb-tree-fallback, #d0d5dd));
        border-end-start-radius: 10px;
        transition: border-color 0.3s ease;

        &--trunk-active {
          border-inline-start-color: var(
            --wakeb-tree-primary,
            var(--wakeb-tree-fallback, #087f8c)
          );
        }

        &--active {
          border-color: var(
            --wakeb-tree-primary,
            var(--wakeb-tree-fallback, #087f8c)
          );
        }
      }

      &-trunk-bottom {
        position: absolute;
        inset-inline-start: -12px;
        top: 50%;
        bottom: 0;
        width: 1.5px;
        z-index: 1;
        pointer-events: none;
        background-color: var(
          --wakeb-tree-input-border,
          var(--wakeb-tree-fallback, #d0d5dd)
        );
        transition: background-color 0.3s ease;

        &--active {
          background-color: var(
            --wakeb-tree-primary,
            var(--wakeb-tree-fallback, #087f8c)
          );
        }
      }
    }

    &--trunk > .tree__children::before {
      content: "";
      position: absolute;
      inset-inline-start: 12px;
      top: 0;
      bottom: 0;
      width: 1.5px;
      z-index: 1;
      pointer-events: none;
      background-color: var(
        --wakeb-tree-input-border,
        var(--wakeb-tree-fallback, #d0d5dd)
      );
      transition: background-color 0.3s ease;
    }

    &--trunk-active > .tree__children::before {
      background-color: var(
        --wakeb-tree-primary,
        var(--wakeb-tree-fallback, #087f8c)
      );
    }

    &-content {
      position: relative;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
      min-height: 48px;

      &:hover:not(.tree__node-content--active) {
        background: var(
          --wakeb-tree-hover-bg,
          var(--wakeb-tree-fallback, #f2f4f7)
        );
      }

      &--active {
        background: var(
          --wakeb-tree-primary,
          var(--wakeb-tree-fallback, #087f8c)
        );

        .tree__node-label {
          color: var(
            --wakeb-tree-active-text,
            var(--wakeb-tree-fallback, #fff)
          );
        }

        .tree__node-description {
          color: var(
            --wakeb-tree-active-text,
            var(--wakeb-tree-fallback, #fff)
          );
          opacity: 0.82;
        }
      }
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 12px;
    }

    &-start {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 8px;
      min-width: 0;
    }

    &-toggle-leading {
      display: flex;
      align-items: center;
      flex-shrink: 0;

      &:empty {
        display: none;
      }
    }

    &-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      z-index: 2;
      min-width: 0;
    }

    &-label {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(
        --wakeb-tree-paragraph-primary,
        var(--wakeb-tree-fallback, #101828)
      );
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-description {
      font-size: 0.75rem;
      color: var(
        --wakeb-tree-paragraph-tertiary,
        var(--wakeb-tree-fallback, #667085)
      );
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
  }

  &__toggle {
    transition: transform 0.3s ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__children {
    position: relative;
    padding-inline-start: 24px;
  }
}

/* Transition */
.tree-expand-enter-active,
.tree-expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.tree-expand-enter-from,
.tree-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.tree-expand-enter-to,
.tree-expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}

:deep(.tree__toggle) {
  color: var(--wakeb-tree-toggle-color, var(--wakeb-tree-fallback, #667085));

  svg,
  .svg-icon-wrapper {
    color: var(--wakeb-tree-toggle-color, var(--wakeb-tree-fallback, #667085));
  }
}

.tree__node-content--active :deep(.tree__toggle) {
  color: var(--wakeb-tree-active-text, var(--wakeb-tree-fallback, #fff));

  svg,
  .svg-icon-wrapper {
    color: var(--wakeb-tree-active-text, var(--wakeb-tree-fallback, #fff));
  }
}
:deep(.tree__toggle--open) {
  transform: rotate(180deg);
}
@media (prefers-reduced-motion: reduce) {
  .tree-expand-enter-active,
  .tree-expand-leave-active,
  .tree__node-content,
  .tree__toggle {
    transition: none !important;
  }
}
.tree__node[role="treeitem"]:focus-visible {
  outline: 2px solid var(--wakeb-tree-focus, #087f8c);
  outline-offset: 2px;
  border-radius: 8px;
}
</style>
