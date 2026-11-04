import { computed, inject, provide, ref, watch, type Ref } from "vue";
import type { NavigationKey, TreeNode, TreeProps, TreeToggleSlotProps } from "../types";

/** Defaults shared by every WTree renderer; providers must not change them. */
export const treeDefaults = {
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
} as const;

type ResolvedTreeProps = Required<Omit<TreeProps, "activeKey" | "editingNodeId">> & TreeProps;
type TreeEmit = {
  (event: "node-click", node: TreeNode): void;
  (event: "toggle", node: TreeNode): void;
};

/** Injection key that shares one roving focus target across the nested groups of one tree. */
const FOCUS_KEY = "wakeb-tree-focus";

/**
 * Provider-neutral WTree behavior (SPEC R13, R18): controlled expansion and active path, one roving
 * tab stop per tree, keyboard navigation and focus recovery. Every renderer calls it once per level.
 * The tree never mutates node records or its controlled inputs; it only emits requests.
 */
export function useTree(props: ResolvedTreeProps, emit: TreeEmit) {
  const keyOf = (node: TreeNode) => node[props.itemKey] as NavigationKey;
  const childrenOf = (node: TreeNode) =>
    Array.isArray(node[props.childrenKey]) ? (node[props.childrenKey] as readonly TreeNode[]) : [];
  const treeRoot = ref<HTMLElement | null>(null);
  const inherited = inject<Ref<NavigationKey | undefined> | null>(FOCUS_KEY, null);
  const focusKey =
    props.isRoot || !inherited ? ref<NavigationKey | undefined>(props.nodes[0] ? keyOf(props.nodes[0]) : undefined) : inherited;
  provide(FOCUS_KEY, focusKey);
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
  const hasChildren = (node: TreeNode) => childrenOf(node) && childrenOf(node).length > 0;
  const isExpanded = (node: TreeNode) => props.expandedKeys.includes(keyOf(node));
  const isActive = (node: TreeNode) => props.activeKey != null && keyOf(node) === props.activeKey;
  const isFocusTarget = (node: TreeNode) => focusKey.value === node[props.itemKey];
  const setFocusTarget = (node: TreeNode) => {
    focusKey.value = keyOf(node);
  };

  function clickNode(event: MouseEvent, node: TreeNode) {
    if (props.keyboardNavigation) (event.currentTarget as HTMLElement).closest<HTMLElement>("[role=treeitem]")?.focus();
    emit("node-click", node);
  }

  function onNodeKeydown(event: KeyboardEvent, node: TreeNode) {
    if (!props.keyboardNavigation || event.altKey || event.ctrlKey || event.metaKey) return;
    const el = event.currentTarget as HTMLElement,
      root = el.closest("[role=tree]") ?? treeRoot.value;
    const items = Array.from(root?.querySelectorAll<HTMLElement>("[role=treeitem]") ?? []).filter(
      (e) => !e.closest(".tree-expand-leave-active"),
    );
    const index = items.indexOf(el);
    let target: HTMLElement | undefined;
    const expand = props.rtl ? "ArrowLeft" : "ArrowRight",
      collapse = props.rtl ? "ArrowRight" : "ArrowLeft";
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      emit("node-click", node);
      return;
    }
    if (event.key === "ArrowDown") target = items[Math.min(items.length - 1, index + 1)];
    else if (event.key === "ArrowUp") target = items[Math.max(0, index - 1)];
    else if (event.key === "Home") target = items[0];
    else if (event.key === "End") target = items.at(-1);
    else if (event.key === expand) {
      if (hasChildren(node) && !isExpanded(node)) {
        event.preventDefault();
        emit("toggle", node);
        return;
      }
      if (isExpanded(node)) target = el.querySelector<HTMLElement>("[role=treeitem]") ?? undefined;
    } else if (event.key === collapse) {
      if (hasChildren(node) && isExpanded(node)) {
        event.preventDefault();
        emit("toggle", node);
        return;
      }
      target = el.parentElement?.closest<HTMLElement>("[role=treeitem]") ?? undefined;
    } else return;
    event.preventDefault();
    target?.focus();
  }

  const findPathToNode = (nodes: readonly TreeNode[], targetKey: NavigationKey): NavigationKey[] | null => {
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
    if (props.isRoot && props.activeKey != null) return findPathToNode(props.nodes, props.activeKey) || [];
    return props.activePath;
  });
  const isInActivePath = (node: TreeNode) => resolvedActivePath.value.includes(keyOf(node));
  const activePathIndex = computed(() => props.nodes.findIndex((n) => isInActivePath(n)));
  const isTrunkTopActive = (index: number) => activePathIndex.value >= 0 && index <= activePathIndex.value;
  const isTrunkBottomActive = (index: number) => activePathIndex.value >= 0 && index < activePathIndex.value;

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
    return key === props.editingNodeId || String(key) === String(props.editingNodeId);
  };

  const ownsFocus = props.isRoot || !inherited;
  let previousKeys: NavigationKey[] = [];
  /** Prefer the nearest visible ancestor, then the previous visible row, so a hidden or removed row hands focus to a neighbour. */
  function nextFocusKey(keys: NavigationKey[], lost: NavigationKey | undefined) {
    if (lost !== undefined) {
      const path = findPathToNode(props.nodes, lost) ?? [];
      for (let i = path.length - 2; i >= 0; i--) if (keys.includes(path[i])) return path[i];
      const old = previousKeys.indexOf(lost);
      for (let i = old - 1; i >= 0; i--) if (keys.includes(previousKeys[i])) return previousKeys[i];
    }
    return keys.includes(props.activeKey as NavigationKey) ? (props.activeKey as NavigationKey) : keys[0];
  }
  if (ownsFocus)
    watch(
      visibleKeys,
      (keys) => {
        if (focusKey.value === undefined || !keys.includes(focusKey.value)) focusKey.value = nextFocusKey(keys, focusKey.value);
        previousKeys = keys;
      },
      { immediate: true },
    );

  // Restores DOM focus only when it was inside this tree and its row disappeared; focus elsewhere is never taken.
  let focusWithin = false;
  function onFocusIn() {
    if (ownsFocus && props.keyboardNavigation) focusWithin = true;
  }
  function onFocusOut(event: FocusEvent) {
    if (!ownsFocus || !props.keyboardNavigation) return;
    const next = event.relatedTarget as Node | null;
    if (next) {
      focusWithin = Boolean(treeRoot.value?.contains(next));
      return;
    }
    const target = event.target as Node;
    queueMicrotask(() => {
      if (target.isConnected) focusWithin = false;
    });
  }
  const rowIsVisible = (row: Element | null) =>
    !row || visibleKeys.value.some((key) => String(key) === row.getAttribute("data-tree-key"));
  if (ownsFocus)
    watch(
      visibleKeys,
      () => {
        const root = treeRoot.value;
        if (!root || typeof document === "undefined") return;
        const active = document.activeElement;
        // A leaving row still holds focus during its transition; a removed row leaves focus on body.
        const lost =
          (active && root.contains(active) && !rowIsVisible(active.closest("[data-tree-key]"))) ||
          (focusWithin && (!active || active === document.body));
        if (!lost) return;
        Array.from(root.querySelectorAll<HTMLElement>("[data-tree-key]"))
          .find((row) => row.dataset.treeKey === String(focusKey.value))
          ?.focus();
      },
      { flush: "post" },
    );

  return {
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
  };
}
