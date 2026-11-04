<!-- Generated from docs/reference-data.mjs -->
# WModal

A Vuetify dialog shell with independent data/loading states, header composition and explicit action slots.

## Usage

```vue
<script setup lang="ts">
import { WModal } from 'wakeb-components'
import { ref } from 'vue'
const open = ref(false)
</script>
<template>
  <button type="button" @click="open = true">Open</button>
  <WModal v-model="open" title="Report" width="640"><template #content>Report content</template></WModal>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Open state; local changes emit once. |
| `title` | `string` | `""` | Already translated heading. |
| `persistent` | `boolean` | `true` | Prevent native outside/Escape dismissal. |
| `closable` | `boolean` | `true` | Show the close button. |
| `loading` | `boolean` | `false` | Show an independent overlay; never initiates a request. |
| `dataLoaded` | `boolean` | `true` | Replace the content with the loading slot until data is ready. |
| `closeLabel` | `string` | `"Close"` | Localized accessible close-button name. |
| `loadingLabel` | `string` | `"Loading"` | Localized name for loading indicators. |
| `width` | `string \| number` | `undefined` | Maximum dialog width; native attrs remain available. |
| `description` | `string` | `""` | Optional description in the default header. |
| `showActions` | `boolean` | `true` | Render the VCard action slot, including its empty footer. |
| `titleClass` | `ComponentClass` | `""` | Classes on the default title. |
| `headerIcon` | `SharedIcon` | `""` | Optional icon name, SVG path data or component (Providers > Icons); header-icon can replace it. |
| `ariaLabel` | `string` | `"Dialog"` | Fallback dialog name when title is empty. |
| `providerProps` | `WakebProviderProps` | `undefined` | Nonportable. Native props and listeners for the dialog primitive (Vuetify `VDialog`, PrimeVue `Dialog`). The model, dismissal policy, width, stacking, focus containment, scroll lock, `afterLeave` callbacks, `contentProps` and `pt` stay Wakeb-owned. Other native callbacks run alongside Wakeb's own. Ignored keys produce a development warning. |

## Events

`update:modelValue(value: boolean)` for local changes; parent synchronization is silent. `afterLeave()` when the native dialog transition ends.

## Slots

`activator {props,isActive}`: bind props to the launch button to retain native focus return. `header {close}` replaces the entire header. `title`, `header-icon`, `header-decoration`, `header-actions` compose the default header. `close-button {close,label}` replaces its button. `content` falls back to `default`; `actions` supplies the footer. `loading {label}` replaces content; `loading-overlay {label}` replaces the independent overlay.

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-modal-bg` | `rgb(var(--v-theme-surface))` |
| `--wakeb-modal-border` | `#d0d5dd` |
| `--wakeb-modal-title` | `inherit` |
| `--wakeb-modal-margin` | `1rem` |
| `--wakeb-modal-padding` | `1.25rem` |
| `--wakeb-modal-radius` | `4px` |
| `--wakeb-modal-icon-bg` | `#e6f4f5` |
| `--wakeb-modal-description` | `rgb(var(--v-theme-on-surface))` |
| `--wakeb-modal-loading-bg` | `rgba(var(--v-theme-surface), 0.72)` |
| `--wakeb-modal-fallback` | `undefined (legacy adapter switch)` |
| `--wakeb-modal-close-color` | `rgb(var(--v-theme-on-surface))` |
| `--wakeb-modal-icon-color` | `#087f8c` |

## Attribute target

The element with `role="dialog"`, which also carries `.wakeb-modal`, on every provider. It is teleported, so it exists only while the dialog is rendered. Wakeb's accessible name (`title`, then `ariaLabel`) wins over a caller `aria-label`. `providerProps` goes to the dialog primitive. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Accessibility and limits

Attrs target VDialog; its native transition, scrim, scrollStrategy and focus behavior remain available. Persistent defaults true, so Escape/outside clicks do not close it. Native focus capture/trap, scroll blocking and overlay stacking are delegated to Vuetify. Use the activator slot for focus return; programmatic launchers own restoration if no activator exists. Mount within your Vuetify application. Header slots are trusted Vue content: no raw SVG injection is built into the package. Aware retains its raw header decoration, SvgIcon, translated close button and legacy title/header visibility through header replacement; customAction maps to !showActions. Data-not-ready content is unmounted, not merely hidden. loading is presentation only; the host decides whether close/save is allowed and owns submission/permissions. The shared default loading overlay covers the card; Aware retains its existing loader markup through a slot. A description alone renders the default header. width wins over a native max-width attr, which applies only when width is absent. Modal radius is 4px, matching Vuetify dialog cards.

## Try it

<OverlayPlayground initial="modal" />
