<!-- Generated from docs/reference-data.mjs -->
# WTabs

Styled tab rails and lazily mounted panels with explicit selection events.

## Usage

```vue
<script setup lang="ts">
import { WTabs } from 'wakeb-components'
</script>
<template>
  <WTabs :tabs="[{ slot: 'overview', label: 'Overview' }, { slot: 'details', label: 'Details' }]"><template #overview>Overview panel</template><template #details>Details panel</template></WTabs>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `styleType` | `"outlined" \| "filled" \| "none" \| "minimal"` | `"outlined"` | Visual rail preset. |
| `isVertical` | `boolean` | `false` | Vertical rail layout. |
| `tabs` | `readonly TabItem[]` | `[] (required)` | Tab records with labels, slot keys and optional content. |
| `selectedTab` | `NavigationKey \| null` | `""` | External selected value; empty switcher means no highlight. |
| `isSwitcherOnly` | `boolean` | `false` | Render only the rail, without panels. |
| `valueKey` | `string` | `"slot"` | Record property used for values and named content slots. |
| `iconOnly` | `boolean` | `false` | Hide default labels while retaining icon and notification; the label becomes its aria-label. |
| `tabHeight` | `string \| number \| null` | `null` | Numeric pixel height; numeric strings are accepted. |
| `iconSize` | `string \| number` | `"sm"` | Icon size token or pixels. |
| `classList` | `ComponentClass` | `""` | Extra classes on the outer layout. |
| `contentGap` | `string \| number \| null` | `null` | Numeric pixel gap; default 32px. |
| `ariaLabel` | `string` | `"Tabs"` | Accessible tablist name. |

## Events

`updateTab(value: NavigationKey | undefined)` for accepted local changes only; no mount or parent-sync echo.

## Slots

`header`, `actions`; `tab-label`: `{ tabItem, index }` replaces the default label/HTML; `tab-icon`: `{ tabItem, index, size }`; content slots use each record valueKey. Header/actions/tab-label/tab-icon are reserved names.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-tabs-item-height` | `44px` |
| `--wakeb-tabs-filled-tab-radius` | `10px` |
| `--wakeb-tabs-filled-item-active-bg` | `#e6f2f3` |
| `--wakeb-tabs-filled-item-active-color` | `#087f8c` |
| `--wakeb-tabs-item-active-color` | `#087f8c` |
| `--wakeb-tabs-item-active-border` | `#d0d5dd` |
| `--wakeb-tabs-item-color` | `#344054` |
| `--wakeb-tabs-input-bg` | `#fff` |
| `--wakeb-tabs-input-border` | `#d0d5dd` |
| `--wakeb-tabs-input-label` | `#344054` |
| `--wakeb-tabs-minimal-tab-gap` | `4px` |
| `--wakeb-tabs-minimal-tab-padding` | `4px` |
| `--wakeb-tabs-minimal-tab-bg` | `#f2f4f7` |
| `--wakeb-tabs-minimal-tab-border` | `#d0d5dd` |
| `--wakeb-tabs-minimal-tab-radius` | `12px` |
| `--wakeb-tabs-minimal-item-radius` | `8px` |
| `--wakeb-tabs-minimal-item-color` | `#667085` |
| `--wakeb-tabs-minimal-item-active-color` | `#101828` |
| `--wakeb-tabs-minimal-item-active-radius` | `8px` |
| `--wakeb-tabs-section-color` | `#667085` |
| `--wakeb-tabs-section-border` | `#d0d5dd` |
| `--wakeb-tabs-content-gap` | `32px` |
| `--wakeb-tabs-fallback` | `undefined (legacy adapter switch)` |

## Attribute target

The root layout `div.wakeb-tabs`. Tabs and panels keep Wakeb's ids, roles and aria-controls/labelledby links. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Accessibility and limits

Ordinary attrs target the layout root. Vue/Vuetify are peers; no Tailwind is needed. Numeric height/gap props append px; do not pass CSS units. Section labels and headers remain inside the rail. VTabs provides tablist roles, focus and arrow navigation. Each tab has an id unique within the app; the selected tab references its rendered role=tabpanel wrapper (div.wakeb-tabs__panel) through aria-controls, and the panel is labelled by its tab; panels are lazily mounted by VTabsWindow, retaining mounted Vue state. Empty selectedTab in switcher mode deliberately clears highlight. selectedTab/isSwitcherOnly are synchronized; the items array itself does not reset selection in application code, leaving group changes to Vuetify. Zero notification/content uses the original truthy check. customHTML is inserted verbatim with v-html and must be trusted or sanitized by the host; function context is {value,isSelected}. Prefer tab-label for untrusted data. Icons use VIcon or tab-icon slots and currentColor; no shadow DOM icon patch runs in the package. Icon-only tabs use the record label as aria-label. Supply a meaningful label, including when replacing label content. A vertical rail sets aria-orientation=vertical on the tablist. PrimeVue: Wakeb renders the tablist itself (a div with role=tablist and button role=tab items) because PrimeVue Tabs generates its own ids and mounts all panels or unmounts hidden ones. Selection, ids and events come from the same shared code as Vuetify. Keys follow the Vuetify slide group: manual activation with click, Enter or Space; arrows move focus along the orientation, wrap, and reverse horizontally when the tablist is RTL; Home/End jump to the ends; the selected tab, or the first tab when none is selected, is the single tab stop. Panels mount on first selection and stay mounted, switching without a transition. Icons render through the Wakeb icon resolver. The tab look comes from the same --wakeb-tabs-* variables on Wakeb markup, not from PrimeVue styles.

## Try it

<NavigationPlayground initial="tabs" />
