<!-- Generated from docs/reference-data.mjs -->
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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isLoading` | `boolean` | `false` | Disable menu/activator while a host export is in progress. |
| `disabled` | `boolean` | `false` | Disable the menu and button. |
| `title` | `string` | `"Download"` | Already translated button text. |
| `formats` | `readonly ExportFormat[]` | `PDF / XLSX` | Configurable labels, string values and optional icons/disabled flags. |
| `menuStyle` | `CSSProperties` | `undefined` | Direct styles on the teleported list. |

## Events

`select(value: string)` once for an enabled format. No file is generated or downloaded by the component.

## Slots

`activator`: `{props,buttonProps}`. Bind menu props and button props, and attach your host permission directive there. `format-icon` / `format-label`: `{format,index}`.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-export-button-height` | `44px` |

## Accessibility and limits

The root is VMenu, preserving its attrs/teleport contract. Default formats are PDF/pdf and Excel/xlsx with English labels; supply localized records. Inline SVG fallbacks need no icon font; optional format.icon uses the host Vuetify icon configuration. Loading disables the public default activator and menu; custom activators receive buttonProps and may preserve their existing loading contract. Permission checks, export state, network requests, MIME handling and download services stay in the host. Use the activator slot for directives; the package has no permission prop or auth dependency. menuStyle targets the actual teleported list. VMenu/VList provide outside-click, Escape and keyboard behavior. The default native action is button, and its default height is 44px.

## Try it

<CompositionPlayground initial="export-dropdown" />
