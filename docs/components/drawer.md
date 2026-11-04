<!-- Generated from docs/reference-data.mjs -->
# WDrawer

A temporary modal side drawer with logical RTL positions, scrolling content and composable actions. It needs no layout host on any provider.

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
| `--wakeb-drawer-loading-bg` | `rgba(var(--v-theme-surface), 0.72)` |
| `--wakeb-drawer-fallback` | `undefined (legacy adapter switch)` |
| `--wakeb-drawer-close-color` | `rgb(var(--v-theme-on-surface))` |

## Attribute target

The element that carries `.wakeb-drawer`: on Vuetify the VNavigationDrawer root, a teleported `<div role="dialog">` that stays in the DOM under `inert` while closed; on PrimeVue the teleported `role="dialog"` element, present only while open. `title`, then `ariaLabel`, names it on every provider. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element. On shadcn-vue it is the teleported reka-ui `role="dialog"` element, present only while open, also named by `title`, then `ariaLabel`.

## Accessibility and limits

Vuetify: rendered with VNavigationDrawer inside a Wakeb-owned VLayout that is teleported to Vuetify's overlay container in the body, so it needs no VApp or VLayout. Inside a VApp the drawer registers with that internal layout only, so the app layout and VMain do not shift. It is a modal role=dialog with aria-modal=true: focus moves into the drawer and Vuetify's focus trap keeps Tab inside, Escape and scrim clicks close it unless persistent, body scrolling is locked while open, and focus returns to the opener after it closes. Escape is ignored while focus is in another overlay, such as a dialog opened from the drawer. Closed content stays in the DOM under an inert root. transparentOverlay hides the scrim color but keeps the scrim, so the background stays blocked. The host takes zIndexOverlay (default 2000, the Vuetify overlay default); Vuetify menus, tooltips and dialogs opened from the drawer stack above it. Attrs target VNavigationDrawer; its native touch swipe and route watcher also close the drawer and emit only update:modelValue. end maps to right in LTR/left in RTL, following the Vuetify locale. Width "50%" parses to 50px, preserving Aware behavior; use numeric/pixel widths. Content scrolls, header/footer stay outside its scroll area. Data-not-ready unmounts content; loading overlays are independent and contain no form or save logic. Aware keeps its icon button, translated slot content, theme-token aliases and per-screen drawer-panel hooks. AddEditModal, schemas, validation and permissions remain in Aware. PrimeVue: rendered with PrimeVue Drawer, which teleports to the body under its own mask, so it needs no layout host and no wrapper around the app root. It is a modal role=dialog: focus moves into the drawer and Tab stays inside, Escape and outside clicks close it unless persistent, body scrolling is locked while open, and focus returns to the opener after it closes. Closed content is not rendered. transparentOverlay hides the mask color but keeps the mask, so the background stays inert and an outside click still closes a non-persistent drawer. The logical side follows the Wakeb direction option, not the page dir. The mask takes zIndexOverlay; without it, the drawer shares PrimeVue's modal z-index stack with WModal. Vuetify-native drawer attrs (rail, touch, route watcher) do not apply. shadcn-vue: rendered with the shadcn-vue Sheet on reka-ui Dialog, teleported to the body with its own overlay, so it needs no layout host. It is a modal role=dialog with aria-modal=true: reka-ui moves focus inside and keeps Tab there, hides the rest of the page from assistive technology and locks body scroll; Escape and outside presses close it unless persistent, and Wakeb returns focus to the element focused before it opened. Closed content is not rendered. transparentOverlay keeps a transparent overlay, so the background stays blocked. The side follows the Wakeb direction option; only left and right sides exist. Both the overlay and the panel take zIndexOverlay; without it they use the Sheet default z-index 50, and later overlays stack above earlier ones.

## Try it

<OverlayPlayground initial="drawer" />
