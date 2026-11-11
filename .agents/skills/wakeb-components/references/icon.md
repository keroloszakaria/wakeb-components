# WIcon

One icon from the Wakeb icon resolver, decorative or named.

## Usage

```vue
<script setup lang="ts">
import { WIcon } from 'wakeb-components'
</script>

<template>
  <WIcon icon="$close" size="16" label="Close" />
</template>
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `icon` | `SharedIcon` | `required` | An icon name (icons option, Wakeb built-ins, then the provider set), SVG path data or a Vue component. |
| `size` | `number \| string` | `24` | Icon size; numbers are px. |
| `color` | `WakebColor` | `undefined` | Icon color: a Wakeb intent or a CSS color. Unset inherits the text color. |
| `label` | `string` | `undefined` | Accessible name; the icon becomes role=img. Unset marks it aria-hidden. |

## Events

No declared component events.

```ts

```

## Slots

None.

```ts

```

## Attributes

Ordinary attrs and listeners reach the icon root (the VIcon element on Vuetify, a span on the other providers).

## CSS variables

No component-specific CSS variables.

## Accessibility and limits

Vuetify: VIcon; names the Wakeb resolver does not know go to the host Vuetify icon set (for example mdi- names with the MDI font). PrimeVue and shadcn-vue: the Wakeb renderer; PrimeIcons class names also work on PrimeVue, and an unknown name draws the Wakeb fallback box with WAKEB_ICON_UNRESOLVED. An icon is not a button; wrap it in WButton for actions.

## Decorative icon

Omit label for a decorative icon next to visible text.

```vue
<script setup lang="ts">
import { WIcon } from 'wakeb-components'
</script>

<template>
  <span><WIcon icon="$complete" size="16" /> Complete</span>
</template>
```
