# WExportDropdown

An export-format picker that emits intent while the host owns permissions and file generation.

## Usage

```vue
<script setup lang="ts">
import { WExportDropdown } from 'wakeb-components'
</script>

<template>
  <WExportDropdown title="Download report" @select="format => console.log(format)" />
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `isLoading` | `boolean` | `false` | Disable menu/activator while a host export is in progress. |
| `disabled` | `boolean` | `false` | Disable the menu and button. |
| `title` | `string` | `"Download"` | Already translated button text. |
| `formats` | `readonly ExportFormat[]` | `PDF / XLSX` | Configurable labels, string values and optional icons/disabled flags. |
| `menuStyle` | `CSSProperties` | `undefined` | Direct styles on the teleported list. |
| `location` | `WakebPopoverLocation` | `undefined` | Menu side and logical alignment relative to the activator; start and end follow the direction. Unset keeps the provider placement. |
| `offset` | `number` | `undefined` | Gap in pixels between the activator and the menu. Unset keeps the provider gap. |

## Events

`select(value: string)` once for an enabled format. No file is generated or downloaded by the component.

```ts
select: [value: string];
```

## Slots

`activator`: `{props,buttonProps}`. Bind menu props and button props, and attach your host permission directive there. `format-icon` / `format-label`: `{format,index}`.

```ts
activator?(props: { props: Record<string, unknown>; buttonProps: ButtonProps }): unknown;
"format-icon"?(props: { format: ExportFormat; index: number }): unknown;
"format-label"?(props: { format: ExportFormat; index: number }): unknown;
```

## Attributes

Baseline compatibility: ordinary attrs reach the teleported menu overlay (VMenu on Vuetify, the Menu root on PrimeVue), which exists only while the menu is open. They do not reach the activator button; use the activator slot for that. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element. On shadcn-vue the overlay is a wrapper around the reka-ui `role="menu"` element.

## CSS variables

- `--wakeb-export-button-height`: 44px

## Accessibility and limits

The root is VMenu, preserving its attrs/teleport contract. Default formats are PDF/pdf and Excel/xlsx with English labels; supply localized records. Inline SVG fallbacks need no icon font; optional format.icon resolves through the icons plugin option and the Wakeb built-ins, then the host Vuetify icon configuration. Loading disables the public default activator and menu; custom activators receive buttonProps and may preserve their existing loading contract. Permission checks, export state, network requests, MIME handling and download services stay in the host. Use the activator slot for directives; the package has no permission prop or auth dependency. menuStyle targets the actual teleported list and wins over the plugin theme scope and zIndexOverlay that the menu carries. VMenu/VList provide outside-click, Escape and keyboard behavior; rows use role=menuitem in a role=menu list and disabled formats set aria-disabled. The default native action is button, and its default height is 44px. location and offset reach VMenu; unset keeps the VMenu defaults. PrimeVue: the formats render in PrimeVue Menu (popup), which owns positioning, arrow keys, Enter/Space, Escape, outside clicks and focus return; the activator carries aria-haspopup, aria-expanded and aria-controls. Attrs, the theme scope and zIndexOverlay reach the teleported Menu root; menuStyle reaches the role=menu list. Format icons resolve through the icons option and the Wakeb built-ins (PrimeIcons class names also work), not a Vuetify icon set. Menu positions the list below the activator and flips it above when there is no room, so location and offset do not apply. shadcn-vue: the formats render in reka-ui DropdownMenu (non-modal), which owns positioning, arrow keys that skip disabled formats, Enter/Space, Escape and outside clicks; Wakeb returns focus to the activator unless the menu closed from an outside click. location sets the reka-ui side and align, and offset its side offset (4px when unset). The menu takes aria-label from title, zIndexOverlay and menuStyle; attrs and the theme scope reach the wrapper, which is removed after the menu closes. The default activator and the activator slot props carry the Wakeb plugin theme/direction scope as well as the teleported menu; caller attributes still target only the menu overlay.

## Custom formats

Selection emits a value; your app implements the download.

```vue
<script setup lang="ts">
import { WExportDropdown } from 'wakeb-components'
import { ref } from 'vue'
const format = ref('')
</script>

<template>
  <WExportDropdown :formats="[{ label: 'CSV', value: 'csv' }]" @select="format = $event" />
  <p>Requested: {{ format }}</p>
</template>
```
