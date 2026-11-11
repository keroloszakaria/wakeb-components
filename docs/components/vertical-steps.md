<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WVerticalSteps

Presentational steps with replaceable icons, title slots and a plain data contract.

::: info 0.8.0-alpha.0 candidate
This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.
:::

## Preview

Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).

<ComponentPlayground initial="vertical-steps" />

## Usage

```vue
<script setup lang="ts">
import { WVerticalSteps } from 'wakeb-components'
</script>

<template>
  <WVerticalSteps :steps="[{ title: 'Review', is_active: true, time: '09:00', date: '2026-10-28' }, { title: 'Ship' }]" label="Release steps" />
</template>
```

## Examples

### Completed and pending

Mark the active step through data owned by your app.

```vue
<script setup lang="ts">
import { WVerticalSteps } from 'wakeb-components'
</script>

<template>
  <WVerticalSteps :steps="[{ title: 'Review', is_active: true }, { title: 'Publish', is_active: false }]" label="Approval process" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `readonly VerticalStep[]` | `[]` | title/time/date/is_active descriptors. See Data models. |
| `label` | `string` | `"Steps"` | Accessible list name; localize in the host. |

## Events

No declared component events. DOM listeners follow the attribute target below.



## Slots

`indicator` replaces the complete marker; `icon` replaces the default marker content. `title`, `timeIcon`, `dateIcon`: each receives `{ step, index }`. Fallback icons are simple text symbols; no icon font is required.

```ts
indicator(props: { step: VerticalStep; index: number }): unknown;
icon(props: { step: VerticalStep; index: number }): unknown;
title(props: { step: VerticalStep; index: number }): unknown;
timeIcon(props: { step: VerticalStep; index: number }): unknown;
dateIcon(props: { step: VerticalStep; index: number }): unknown;
```

## CSS variables

| Variable | Default |
| --- | --- |
| `--wakeb-steps-accent` | `#087f8c` |
| `--wakeb-steps-surface` | `#f9fafb` |
| `--wakeb-steps-text` | `currentColor` |
| `--wakeb-steps-active-text` | `#fff` |
| `--wakeb-steps-muted` | `#667085` |

## Attribute target

The root `div.steps` with `role="list"` on every provider. `role` is Wakeb-owned and wins over caller attributes; name the list with `label`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.

## Keyboard interaction

This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.

## Accessibility and limits

Uses list/listitem roles. is_active is a visual completion flag, not interactive navigation or aria-current. The host supplies formatted date/time strings and translations. Text is escaped. Steps use positional keys and do not own selection state. Layout uses logical directions and needs no utility framework. This preserves the horizontal row layout; long content should be tested in the host’s available width. PrimeVue renders the same Wakeb list markup and CSS as Vuetify (PrimeVue Stepper is an interactive wizard, so it is not used); the DOM and slot payloads are identical on both providers. Under shadcn-vue the same Wakeb list markup renders; the shadcn-vue Stepper is an interactive wizard and is not used.

---

Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).
