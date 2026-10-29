<!-- Generated from docs/reference-data.mjs -->
# WDrawer

A temporary Vuetify navigation drawer with logical RTL positions, scrolling content and composable actions.

## Usage

```vue
<script setup lang="ts">
import { WDrawer } from 'wakeb-components'
import { ref } from 'vue'
const open = ref(false)
</script>
<template>
  <button type="button" @click="open = true">Open</button>
  <WDrawer v-model="open" title="Details"><template #content>Details content</template></WDrawer>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Open state; local changes emit once. |
| `title` | `string` | `""` | Already translated heading. |
| `persistent` | `boolean` | `false` | Prevent scrim dismissal. |
| `closable` | `boolean` | `true` | Show the close button. |
| `loading` | `boolean` | `false` | Show an independent overlay; never initiates a request. |
| `dataLoaded` | `boolean` | `true` | Replace the content with the loading slot until data is ready. |
| `closeLabel` | `string` | `"Close"` | Localized accessible close-button name. |
| `loadingLabel` | `string` | `"Loading"` | Localized name for loading indicators. |
| `width` | `string \| number` | `420` | Numbers pass through; strings use parseInt with 420 fallback. |
| `position` | `"start" \| "end"` | `"end"` | Logical side resolved from Vuetify RTL. |
| `transparentOverlay` | `boolean` | `false` | Remove the scrim, retaining temporary drawer semantics. |
| `ariaLabel` | `string` | `"Drawer"` | Fallback accessible name when title is empty. |

## Events

`update:modelValue(value: boolean)` for local changes. `close()` only from the supplied/default close callback, after the model update; scrim/parent updates do not emit close.

## Slots

`title`, `header-actions`, `close-button {close,label}`, `content`, `default`, `actions`, `loading {label}` and `loading-overlay {label}`. content and default render in sequence; footer exists only when actions is supplied.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-drawer-bg` | `rgb(var(--v-theme-surface))` |
| `--wakeb-drawer-border` | `#d0d5dd` |
| `--wakeb-drawer-title` | `inherit` |
| `--wakeb-drawer-radius` | `20px` |
| `--wakeb-drawer-padding` | `1.25rem` |
| `--wakeb-drawer-loading-bg` | `#ffffffaa` |
| `--wakeb-drawer-fallback` | `undefined (legacy adapter switch)` |

## Accessibility and limits

Requires a Vuetify layout provider (normally VApp); do not instantiate it outside a layout. Attrs target VNavigationDrawer, including native focus/resize/route-watcher options. It remains temporary, keeps its native scrim and touch behavior and maps end to right in LTR/left in RTL. Unlike VDialog, VNavigationDrawer does not provide Escape dismissal or dialog scroll blocking; this component preserves those native semantics. Do not infer dialog-style stacked-overlay guarantees when nesting drawers and dialogs; test your composition. Manage launch/return focus in the host. Width "50%" parses to 50px, preserving Aware behavior; use numeric/pixel widths. Content scrolls, header/footer stay outside its scroll area. Data-not-ready unmounts content; loading overlays are independent and contain no form or save logic. Aware keeps its icon button, translated slot content, theme-token aliases and per-screen drawer-panel hooks. AddEditModal, schemas, validation and permissions remain in Aware.

## Try it

<OverlayPlayground initial="drawer" />
