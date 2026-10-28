<!-- Generated from docs/reference-data.mjs -->
# WTree

A controlled recursive tree with connector lines, composable rows and keyboard navigation.

## Usage

```vue
<script setup lang="ts">
import { WTree } from 'wakeb-components'
</script>
<template>
  <WTree :nodes="[{ id: 1, name: 'Team', children: [{ id: 2, name: 'Member' }] }]" :expanded-keys="[1]" aria-label="Teams" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` | `readonly TreeNode[]` | `[]` | Acyclic presentational records with unique primitive keys. |
| `itemKey` | `string` | `"id"` | Key field. |
| `itemLabel` | `string` | `"name"` | Visible/accessibility name field. |
| `itemDescription` | `string` | `"description"` | Optional description field. |
| `childrenKey` | `string` | `"children"` | Child array field. |
| `level` | `number` | `0` | Starting depth, mainly for recursive composition. |
| `isRoot` | `boolean` | `true` | Root tree vs nested group; internal recursion sets false. |
| `expandedKeys` | `readonly NavigationKey[]` | `[]` | Controlled expanded branches; update in the host on toggle. |
| `activeKey` | `NavigationKey \| null` | `null` | Controlled selected node key. |
| `activePath` | `readonly NavigationKey[]` | `[]` | Explicit path for nested/nonroot groups; root resolves from activeKey. |
| `rtl` | `boolean` | `false` | RTL connectors and reversed expand/collapse arrow keys. |
| `editingNodeId` | `NavigationKey \| null` | `null` | Inline-edit class hook; numeric/string IDs compare compatibly. |
| `keyboardNavigation` | `boolean` | `true` | ARIA tree and roving keyboard navigation; false preserves legacy list behavior. |
| `ariaLabel` | `string` | `"Tree"` | Accessible root name. |
| `toggleLabel` | `string` | `"Toggle branch"` | Accessible name for the default branch toggle. |

## Events

`node-click(node: TreeNode)` requests selection; `toggle(node: TreeNode)` requests expansion. Update activeKey/expandedKeys in the host; the tree never mutates records.

## Slots

`node`: `{node,level,expanded}`; `actions`: `{node,level}`; `toggle-leading` and `toggle-trailing`: `{node,level,expanded,hasChildren,toggle}`. Slots propagate to every level. Actions stop click bubbling; custom leading toggles must stop their own click.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-tree-input-border` | `#d0d5dd` |
| `--wakeb-tree-primary` | `#087f8c` |
| `--wakeb-tree-hover-bg` | `#f2f4f7` |
| `--wakeb-tree-active-text` | `#fff` |
| `--wakeb-tree-paragraph-primary` | `#101828` |
| `--wakeb-tree-paragraph-tertiary` | `#667085` |
| `--wakeb-tree-toggle-color` | `#667085` |
| `--wakeb-tree-focus` | `#087f8c` |
| `--wakeb-tree-fallback` | `undefined (legacy adapter switch)` |

## Accessibility and limits

Root attrs target ul. Data must be acyclic with globally unique string/number keys; only loaded children are considered. Field keys are direct properties, not dotted paths. activeKey uses strict identity; editingNodeId also supports string equivalence. Root computes active ancestors; nonroot groups use activePath. Collapsing unmounts descendant DOM through v-if and transition, so keep editable drafts in host state. Arrow Up/Down traverse visible nodes; Home/End move to bounds; expand/collapse arrows reverse in RTL; Enter/Space request selection. Expansion remains controlled. Nested controls keep their own keys. There is one roving tab target per tree; disappearing rows reset it to a visible key. No typeahead, virtualization, drag/drop, checkbox selection or remote loading is built in. Default labels propagate to every level. Empty named slots use Vue fallback content, including branch toggles. Motion respects reduced-motion preferences.

## Try it

<NavigationPlayground initial="tree" />
