<!-- Generated from docs/reference-data.mjs -->
# WButton

Vuetify buttons with explicit states, icon slots and semantic style variables.

## Usage

```vue
<script setup lang="ts">
import { WButton } from 'wakeb-components'
</script>
<template>
  <WButton title="Save changes" action="submit" type="primary" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isTooltip` | `boolean` | `false` | Icon-only tooltip branch using title as the tooltip text. |
| `location` | `"top" \| "bottom" \| "start" \| "end"` | `"top"` | Tooltip placement. |
| `title` | `string` | `""` | Escaped button text; an empty title uses the content slot. |
| `classList` | `ComponentClass` | `""` | Classes on the actual Vuetify button. |
| `iconPosition` | `"start" \| "end"` | `"start"` | Icon location around a nonempty title. |
| `type` | `string` | `"primary"` | primary/secondary/outline/danger/tertiary/link/icon/table-icon/text; custom strings add classes. |
| `size` | `string` | `"lg"` | xl/lg/md/sm; custom strings need consumer CSS. |
| `isLoading` | `boolean` | `false` | Vuetify loading indicator plus the shared loading style. |
| `isDropdown` | `boolean` | `false` | Append the dropdown slot or Vuetify $expand icon. |
| `action` | `"button" \| "submit" \| "reset"` | `"button"` | Native HTML button type. |
| `disabled` | `boolean` | `false` | Native disabled state. |
| `icon` | `SharedIcon` | `""` | Vuetify icon value, or the value passed to the icon slot. |
| `iconSize` | `string \| number` | `"sm"` | xs/sm/md/lg/xl map to 16/20/24/32/40px; free uses Vuetify default. |
| `maxIconWidth` | `string \| number` | `"100%"` | Maximum icon width; numeric fallback widths use px. |
| `iconColorType` | `"danger" \| "primary" \| "success" \| "warning" \| "currentColor"` | `"currentColor"` | Semantic icon role, resolved through namespaced CSS variables. |
| `customIconColor` | `string` | `""` | Explicit icon color; takes precedence over the role. |
| `wrapperAttrs` | `Record<string, unknown>` | `{}` | Explicit attributes for the outer layout div; normal attrs target the button. |

## Events

`click(event: MouseEvent)` — original native event, once per activation.

## Slots

`icon` and `dropdown`: `{ icon, size, color, maxWidth }`. `content` (or `default` fallback): content when title is empty and isTooltip=false. Tooltip mode renders the icon only. The fallback icon renderer is VIcon; configure the host Vuetify icon set/font or provide slots.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-button-danger-background` | `#d92d20` |
| `--wakeb-button-danger-border` | `transparent` |
| `--wakeb-button-danger-color` | `#fff` |
| `--wakeb-button-danger-disabled-background` | `#eaecf0` |
| `--wakeb-button-danger-disabled-border` | `#eaecf0` |
| `--wakeb-button-danger-disabled-color` | `#98a2b3` |
| `--wakeb-button-danger-disabled-opacity` | `.5` |
| `--wakeb-button-danger-focus-outline` | `#087f8c` |
| `--wakeb-button-danger-hover-background` | `#b42318` |
| `--wakeb-button-danger-hover-border` | `transparent` |
| `--wakeb-button-danger-loading-background` | `#d92d20` |
| `--wakeb-button-danger-svg` | `currentColor` |
| `--wakeb-button-disabled-text` | `#667085` |
| `--wakeb-button-fallback` | `not defined (normal per-token defaults)` |
| `--wakeb-button-icon-background` | `transparent` |
| `--wakeb-button-icon-color` | `#344054` |
| `--wakeb-button-icon-hover-background` | `transparent` |
| `--wakeb-button-icon-hover-color` | `#344054` |
| `--wakeb-button-icon-primary` | `#087f8c` |
| `--wakeb-button-icon-success` | `#12b76a` |
| `--wakeb-button-icon-warning` | `#f79009` |
| `--wakeb-button-link-color` | `#344054` |
| `--wakeb-button-link-disabled-opacity` | `.5` |
| `--wakeb-button-link-focus-outline` | `#087f8c` |
| `--wakeb-button-link-hover-color` | `#344054` |
| `--wakeb-button-link-svg` | `currentColor` |
| `--wakeb-button-outline-background` | `transparent` |
| `--wakeb-button-outline-border` | `transparent` |
| `--wakeb-button-outline-color` | `#344054` |
| `--wakeb-button-outline-danger-text` | `#b42318` |
| `--wakeb-button-outline-disabled-background` | `#eaecf0` |
| `--wakeb-button-outline-disabled-border` | `#eaecf0` |
| `--wakeb-button-outline-disabled-color` | `#98a2b3` |
| `--wakeb-button-outline-focus-outline` | `#087f8c` |
| `--wakeb-button-outline-hover-background` | `transparent` |
| `--wakeb-button-outline-hover-border` | `transparent` |
| `--wakeb-button-outline-loading-background` | `transparent` |
| `--wakeb-button-outline-svg` | `currentColor` |
| `--wakeb-button-primary-background` | `#087f8c` |
| `--wakeb-button-primary-border` | `transparent` |
| `--wakeb-button-primary-color` | `#fff` |
| `--wakeb-button-primary-disabled-background` | `#eaecf0` |
| `--wakeb-button-primary-disabled-border` | `#eaecf0` |
| `--wakeb-button-primary-disabled-color` | `#98a2b3` |
| `--wakeb-button-primary-focus-outline` | `#087f8c` |
| `--wakeb-button-primary-hover-background` | `#066b75` |
| `--wakeb-button-primary-hover-border` | `transparent` |
| `--wakeb-button-primary-loading-background` | `#087f8c` |
| `--wakeb-button-primary-loading-border` | `transparent` |
| `--wakeb-button-primary-svg` | `currentColor` |
| `--wakeb-button-radius` | `12px` |
| `--wakeb-button-secondary-background` | `#f2f4f7` |
| `--wakeb-button-secondary-border` | `transparent` |
| `--wakeb-button-secondary-color` | `#344054` |
| `--wakeb-button-secondary-disabled-background` | `#eaecf0` |
| `--wakeb-button-secondary-disabled-border` | `#eaecf0` |
| `--wakeb-button-secondary-disabled-color` | `#98a2b3` |
| `--wakeb-button-secondary-focus-outline` | `#087f8c` |
| `--wakeb-button-secondary-hover-background` | `#f2f4f7` |
| `--wakeb-button-secondary-hover-border` | `transparent` |
| `--wakeb-button-secondary-loading-background` | `#f2f4f7` |
| `--wakeb-button-secondary-surface` | `#f2f4f7` |
| `--wakeb-button-secondary-svg` | `currentColor` |
| `--wakeb-button-secondary-text` | `#344054` |
| `--wakeb-button-size-lg-font-size` | `1rem` |
| `--wakeb-button-size-lg-gap` | `6px` |
| `--wakeb-button-size-lg-padding` | `10px 16px` |
| `--wakeb-button-size-md-font-size` | `.875rem` |
| `--wakeb-button-size-md-gap` | `4px` |
| `--wakeb-button-size-md-padding` | `10px 14px` |
| `--wakeb-button-size-sm-font-size` | `.75rem` |
| `--wakeb-button-size-sm-gap` | `4px` |
| `--wakeb-button-size-sm-padding` | `8px 12px` |
| `--wakeb-button-size-xl-font-size` | `1.125rem` |
| `--wakeb-button-size-xl-gap` | `6px` |
| `--wakeb-button-size-xl-padding` | `12px 18px` |
| `--wakeb-button-table-icon-background` | `transparent` |
| `--wakeb-button-table-icon-color` | `#344054` |
| `--wakeb-button-table-icon-delete-background` | `transparent` |
| `--wakeb-button-table-icon-delete-border` | `transparent` |
| `--wakeb-button-table-icon-delete-color` | `#344054` |
| `--wakeb-button-table-icon-edit-background` | `transparent` |
| `--wakeb-button-table-icon-edit-border` | `transparent` |
| `--wakeb-button-table-icon-edit-color` | `#344054` |
| `--wakeb-button-table-icon-radius` | `8px` |
| `--wakeb-button-table-icon-restore-background` | `transparent` |
| `--wakeb-button-table-icon-restore-border` | `transparent` |
| `--wakeb-button-table-icon-restore-color` | `#344054` |
| `--wakeb-button-table-icon-unlock-background` | `transparent` |
| `--wakeb-button-table-icon-unlock-border` | `transparent` |
| `--wakeb-button-table-icon-unlock-color` | `#344054` |
| `--wakeb-button-table-icon-view-background` | `transparent` |
| `--wakeb-button-table-icon-view-border` | `transparent` |
| `--wakeb-button-table-icon-view-color` | `#344054` |
| `--wakeb-button-tertiary-background` | `transparent` |
| `--wakeb-button-tertiary-border` | `transparent` |
| `--wakeb-button-tertiary-color` | `#344054` |
| `--wakeb-button-tertiary-disabled-background` | `#eaecf0` |
| `--wakeb-button-tertiary-disabled-border` | `#eaecf0` |
| `--wakeb-button-tertiary-disabled-color` | `#98a2b3` |
| `--wakeb-button-tertiary-focus-outline` | `#087f8c` |
| `--wakeb-button-tertiary-hover-background` | `transparent` |
| `--wakeb-button-tertiary-loading-background` | `transparent` |
| `--wakeb-button-tertiary-svg` | `currentColor` |
| `--wakeb-button-text-color` | `#344054` |
| `--wakeb-button-text-focus-outline` | `#087f8c` |
| `--wakeb-button-text-hover-color` | `#344054` |

## Accessibility and limits

The native element keeps form/type, disabled state and Vuetify aria-busy behavior. Click emits its original MouseEvent once; .stop/.prevent can be used by the host. Native keyboard activation is left to the browser. Icon-only buttons need an aria-label; tooltip buttons use title as a fallback accessible name. Tooltip focus listeners are composed with consumer listeners. Loading blocks ordinary pointer interaction through Vuetify/CSS; direct synthetic event dispatch is not a request-lock mechanism. A native loading attr also reaches VBtn and does not add the isLoading style class. Reduced-motion settings remove shared transitions. The outer div is retained for layout; wrapperAttrs does not redirect native attrs. Unknown variants/sizes are extension classes. The compatibility-only --wakeb-button-fallback switch is reserved for adapters; leave it undefined for normal defaults.

## Try it

<FoundationPlayground initial="button" />
