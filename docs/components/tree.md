<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WTree

A controlled recursive tree with connector lines, composable rows and keyboard navigation.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<NavigationPlayground initial="tree" />

## Usage

```vue
<script setup lang="ts">
import { WTree } from 'wakeb-components'
</script>

<template>
  <WTree :nodes="[{ id: 1, name: 'Team', children: [{ id: 2, name: 'Member' }] }]" :expanded-keys="[1]" aria-label="Teams" />
</template>
```

## Examples

### Application-owned expansion

Handle toggle and replace the expanded key list.

```vue
<script setup lang="ts">
import { WTree } from 'wakeb-components'
import { ref } from 'vue'
import type { NavigationKey } from 'wakeb-components'
const expanded = ref<NavigationKey[]>([])
</script>

<template>
  <WTree :nodes="[{ id: 'team', name: 'Team', children: [{ id: 'ada', name: 'Ada' }] }]" :expanded-keys="expanded" aria-label="People" @toggle="node => { if (node.id !== undefined) expanded = expanded.includes(node.id) ? [] : [node.id] }" />
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

```ts
"node-click": [node: TreeNode];
toggle: [node: TreeNode];
```

## Slots

`node`: `{node,level,expanded}`; `actions`: `{node,level}`; `toggle-leading` and `toggle-trailing`: `{node,level,expanded,hasChildren,toggle}`. Slots propagate to every level. Actions stop click bubbling; custom leading toggles must stop their own click.

```ts
node?(props: { node: TreeNode; level: number; expanded: boolean }): unknown;
actions?(props: { node: TreeNode; level: number }): unknown;
"toggle-leading"?(props: TreeToggleSlotProps): unknown;
"toggle-trailing"?(props: TreeToggleSlotProps): unknown;
```

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

## Attribute target

The root `ul` with `role="tree"`. Nested groups do not receive them. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Keyboard interaction

| Key | Behavior |
| --- | --- |
| `Up / Down` | Move between visible nodes. |
| `Left / Right` | Collapse, expand or move to parent/child according to direction. |
| `Home / End` | Focus the first or last visible node. |
| `Enter / Space` | Activate the focused node. |

## Accessibility and limits

Root attrs target ul. Data must be acyclic with globally unique string/number keys; only loaded children are considered. Field keys are direct properties, not dotted paths. activeKey uses strict identity; editingNodeId also supports string equivalence. Root computes active ancestors; nonroot groups use activePath. Collapsing unmounts descendant DOM through v-if and transition, so keep editable drafts in host state. Arrow Up/Down traverse visible nodes; Home/End move to bounds; expand/collapse arrows reverse in RTL; Enter/Space request selection. Expansion remains controlled. Nested controls keep their own keys. There is one roving tab target per tree; when a row disappears the target moves to its nearest visible ancestor, otherwise the previous visible row, and DOM focus follows only when focus was inside the tree. No typeahead, virtualization, drag/drop, checkbox selection or remote loading is built in. Default labels propagate to every level. Empty named slots use Vue fallback content, including branch toggles. Motion respects reduced-motion preferences. PrimeVue: the same Wakeb markup, CSS and shared tree code render on both providers, because PrimeVue Tree uses key maps for expansion and selection; the default branch toggle is the PrimeVue WButton. shadcn-vue: the same Wakeb markup and shared tree code, because shadcn-vue has no Tree and reka-ui Tree uses a flattened item model with its own selection; the default branch toggle is the shadcn-vue WButton (data-slot=button). Default label/description colors and the hover surface use scoped Wakeb theme tokens when present, including dark mode; component CSS variables still win.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).
