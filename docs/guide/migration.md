# Migrating from 0.7

::: warning Framework alpha
This guide describes the unreleased provider release (milestones M1 to M4, in progress). It is not
part of 0.7.x. Version 0.7.x stays Vuetify-only and needs no plugin file or build integration.
:::

The provider release is a **breaking** release. Component names, imports and most props stay the
same, but your app needs a plugin file and a one-time Vite integration, a few values change, and
some behavior is now owned by Wakeb. The API is stable *across providers*; it is not unchanged
*from 0.7*.

::: warning What this migration does not cover
Moving to the provider release, and switching providers later, changes how Wakeb components
render. It does not migrate the rest of your app. These stay your responsibility:

- Direct use of provider components in your app, for example `v-data-table`, PrimeVue
  `DataTable`, or shadcn-vue source copied into the app.
- `providerProps` values and other nonportable escape hatches.
- CSS that targets provider classes or DOM (`.v-*`, `.p-*`, Tailwind utilities inside Wakeb
  output).
- Your provider's own theme, plugin options, icon sets and global defaults.
- Deprecated aliases that are accepted under one provider only (Vuetify color names, Vuetify-only
  skeleton names and badge types outside the Wakeb list).

See [Switching providers](./switching) for the checklist that finds these usages.
:::

## Checklist

Work through these steps in order. Each step links to the section that explains it.

1. Raise `vue` to `^3.5.40` and install `vite` `^6.0.0` as a dependency of your app
   ([Peer dependencies](#peer-dependencies)).
2. Create `plugins/wakeb-components.js` with a string literal `framework`
   ([Plugin file](#plugin-file)).
3. Add `wakebComponents()` from `wakeb-components/vite` to `vite.config` once
   ([Vite integration](#vite-integration)).
4. Install your provider first, then `app.use(wakeb)`, and import `wakeb-components/style.css`
   ([Install the plugin](#install-the-plugin)).
5. Run the dev server and open the console. Fix every `WAKEB_*` warning, starting with
   `WAKEB_DEPRECATED_VALUE` ([Development warnings](#development-warnings)).
6. Replace deprecated values with portable ones: variants, colors, badge types and skeleton
   names ([Deprecated values](#deprecated-values)).
7. Run `vue-tsc` or `tsc --strict`. Fix the type errors for provider color names, badge types
   and wrong event or slot payloads ([Typed contracts](./providers#typed-contracts)).
8. Review the [behavior changes](#behavior-changes) for WLoading, icons, WCarousel, WAccordion
   and the Vuetify WDrawer, and update tests that relied on the old behavior.
9. Build for production and run your test suite. Development warnings are removed from the
   production bundle; errors are not.
10. If you plan to switch providers later, run the [switching checklist](./switching#checklist).

## Peer dependencies {#peer-dependencies}

| Package | 0.7 | Provider release |
| --- | --- | --- |
| `vue` | `^3.5.0`, required | `^3.5.40`, required |
| `vite` | not a peer | `^6.0.0`, required |
| `vuetify` | `^3.13.2`, required | `^3.13.2`, optional: install it when you select Vuetify |
| `primevue`, `@primeuix/themes` | not supported | `^4.5.5` and `^2.0.3`, optional: install them when you select PrimeVue |

- **Vue 3.5.40.** The type declarations use the element type parameter that Vue 3.5.40 added to
  `DefineComponent`. With Vue 3.5.0 to 3.5.39 the components still build and render, but
  `tsc --strict` rejects the declarations.
- **Vite.** The provider is selected only by the `wakebComponents()` Vite plugin, so Vite is
  now a required peer. Other bundlers are not supported in this release.
- **Provider peers.** Install the peers of the provider you select. npm reports no peer warning
  for the other provider. The tested versions are listed in
  [Supported versions](./installation#supported-versions).

```sh
# Vuetify app
npm install wakeb-components vuetify vue@^3.5.40 vite@^6
# PrimeVue app
npm install wakeb-components primevue @primeuix/themes vue@^3.5.40 vite@^6
```

## Plugin file {#plugin-file}

Root imports from `wakeb-components` now need a plugin. Create `plugins/wakeb-components.js` next
to `vite.config.js`:

```js
// plugins/wakeb-components.js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'vuetify', // a string literal: 'vuetify' or 'primevue'
})
```

`framework` is required and has no default. It must be a string literal, because the build
integration reads it with a parser and never runs the file. Environment values, variables,
spreads and re-exports fail with `WAKEB_CONFIG_INVALID`. The accepted forms and every rejected
form are listed in [How the provider is selected](./providers#how-the-provider-is-selected).

The other options (`defaults`, `locale`, `direction`, `theme`, `icons`, `providerOptions`) are
optional and described in [Providers and setup](./providers#plugin-options).

## Vite integration {#vite-integration}

Add the build integration once. It reads the plugin file and bundles only the selected
provider's renderers:

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { wakebComponents } from 'wakeb-components/vite'

export default defineConfig({
  plugins: [vue(), wakebComponents()],
})
```

For another location, a monorepo package or a TypeScript plugin file, pass `configFile`
relative to the Vite root: `wakebComponents({ configFile: 'src/plugins/wakeb.ts' })`. Without the
integration, the first Wakeb component fails with `WAKEB_BUILD_PLUGIN_MISSING`.

## Install the plugin {#install-the-plugin}

```js
// main.js
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import App from './App.vue'
import wakeb from './plugins/wakeb-components.js'
import 'wakeb-components/style.css'

createApp(App)
  .use(createVuetify()) // your existing provider setup, installed first
  .use(wakeb)
  .mount('#app')
```

- Keep your existing provider setup and install it **before** `app.use(wakeb)`. With the default
  `providerOptions.mode: 'auto'`, Wakeb reuses that instance and does not change its theme,
  defaults, icons or locale. A provider installed after Wakeb is not detected.
- If your app has no provider instance, Wakeb installs one. See
  [Host provider instance](./providers#host-provider-instance) for the `auto`, `reuse` and
  `install` modes.
- `app.use(wakeb)` does not register components globally. Keep importing them by name:
  `import { WButton } from 'wakeb-components'`.
- A component rendered in an app without the plugin fails with `WAKEB_CONTEXT_MISSING`.

## Development warnings {#development-warnings}

In development, Wakeb logs a console warning with a stable code. Each warning is logged once per
app and value. Production builds remove the warnings, because the code sits behind
`process.env.NODE_ENV`, which Vite replaces.

| Code | When | What to do |
| --- | --- | --- |
| `WAKEB_DEPRECATED_VALUE` | A 0.7 value that still works for one more major release: a variant alias, a Vuetify color name, a Vuetify-only skeleton name or a badge type outside the Wakeb list | Replace it with the value in the message ([Deprecated values](#deprecated-values)) |
| `WAKEB_UNKNOWN_VALUE` | A value Wakeb does not know: an unknown variant, a color that is neither an intent nor a CSS color under PrimeVue, an unknown or malformed skeleton part, a repetition above 100, an invalid grid span | Use a value from the lists below; the component falls back to its default meanwhile |
| `WAKEB_ICON_UNRESOLVED` | An icon name that no alias, resolver, built-in or provider icon set resolves | Register the name in `icons.aliases`, or pass SVG path data or a component |
| `WAKEB_PROVIDER_PROP_IGNORED` | A `providerProps` key that Wakeb owns, that is a portable attribute, or that the selected primitive does not declare; or `providerProps` on a component that does not accept it yet | Use the portable prop, event or attribute instead |

These codes are **errors**, not warnings. They are thrown as `WakebError` with a `code` property,
in development and production:

| Code | When |
| --- | --- |
| `WAKEB_CONFIG_INVALID` | Invalid plugin options, `defaults`, theme or icons; a malformed or missing plugin file |
| `WAKEB_COMPONENT_UNSUPPORTED` | The selected alpha adapter does not render this component yet (see the [capability matrix](./providers#capability-matrix)) |

The full list of error codes is in [Errors](./providers#errors).

## Deprecated values {#deprecated-values}

0.7 accepted some values that only Vuetify understands. The provider release replaces them with
Wakeb values that work on every provider. The old values keep working for **one major release**
and log `WAKEB_DEPRECATED_VALUE` in development. The release after that removes them.
WTabs item `customHTML` follows the same rule: it still renders on every provider, logs
`WAKEB_DEPRECATED_VALUE` once per app, and should be replaced with the `tab-label` slot.

### Variants

Applies to WBadge `variant`, WTooltipBtn `variant`, and WBadgeStack `badgeVariant` and item
`variant`. These aliases work on **every** provider.

| 0.7 value | Use instead | Note |
| --- | --- | --- |
| `default`, `tonal` | `soft` | `default` already rendered as `tonal`. WBadge default is now `soft`. |
| `flat` | `solid` | |
| `elevated` | `solid` | Elevation is not portable; add a CSS shadow |
| `outlined` | `outline` | |
| `text`, `plain` | `ghost` | The faded `plain` look is not kept. WTooltipBtn default is now `ghost`. |

```vue
<!-- 0.7 -->
<WBadge label="Draft" variant="outlined" />
<!-- Provider release -->
<WBadge label="Draft" variant="outline" />
```

### Colors

Applies to WLoading `color`, WAvatarStack and WUserBadge `avatarColor`, WSegmentedProgress
`color`, WBadge `dotColor`, WBadgeStack `dotColor`, item `color` and item `dotColor`, and
WAccordion `iconColor`.

A color prop now takes a Wakeb intent or a CSS color:

| 0.7 value (examples) | Use instead |
| --- | --- |
| Vuetify theme names: `primary`, `secondary`, `success`, `warning`, `info` | The intent with the same name |
| Vuetify theme name `error` | The intent `danger` |
| Vuetify palette names: `red`, `red-darken-2`, `grey-lighten-1` | A CSS color (`#d32f2f`, `rgb()`, `hsl()`, `var(--my-color)`) or an intent |
| A CSS color | Unchanged |

- Intents: `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`. Each
  resolves to its `--wakeb-ui-<intent>` token, then the provider theme color, then a Wakeb
  fallback. See [Intents and colors](./providers#intents-and-colors).
- WLoading `color`, and WAvatarStack and WUserBadge `avatarColor`, keep accepting Vuetify color
  names during the deprecation window. Under **Vuetify** the name still renders as before, with
  `WAKEB_DEPRECATED_VALUE`. Under **PrimeVue** and **shadcn-vue** it is not understood: the prop
  falls back to its default, with `WAKEB_UNKNOWN_VALUE`.
- TypeScript still accepts these names on those three props: the prop type is
  `WakebColor | WakebDeprecatedColor`, so 0.7 code compiles. `WakebDeprecatedColor` is a closed
  list of Vuetify's built-in theme and palette names, so a misspelled name is still a type error. A
  custom Vuetify theme color is not in the list: write it as `rgb(var(--v-theme-brand))`. The type is
  marked `@deprecated`, but editors cannot mark a string value written in a template; development
  builds log `WAKEB_DEPRECATED_VALUE` instead. To reject provider names today, type your own values
  as `WakebColor`.
- The other color props (WSegmentedProgress `color`, WBadge `dotColor`, WBadgeStack `dotColor`,
  item `color` and item `dotColor`, WAccordion `iconColor`) do not render provider names on any
  provider: a name falls back to the default with `WAKEB_UNKNOWN_VALUE`, and their type,
  `WakebColor`, rejects it.

WDropdown `iconColor` and item `color` are not covered; they keep their own `colorMap` keys.

The declared default of WAccordion `iconColor`, WBadge `dotColor` and WBadgeStack `dotColor` is
now `undefined` instead of `""`, because `""` is not a `WakebColor`. Nothing renders differently;
only code that reads the default from the component definition sees the change.

### Badge `type`

WBadge `type` (also WBadgeStack item `type` and WUserBadge `type`) is a Wakeb style key,
`WakebBadgeType`, painted by Wakeb CSS:

`success`, `success-transparent`, `primary`, `primarybtn`, `danger`, `danger-transparent`,
`warning`, `info`, `transparent`, `dark`, `tertiary`, `outline`, `outline-secondary`, `check`,
`uncheck`.

- In 0.7, `type` was also forwarded to Vuetify as the chip `color`. It no longer is, so the chip
  text and icon follow the badge's text color.
- A type outside this list is treated as a Vuetify color name: under Vuetify it is still passed
  as the chip color, with `WAKEB_DEPRECATED_VALUE`. Under PrimeVue and shadcn-vue the badge uses
  `primary`, with `WAKEB_UNKNOWN_VALUE`.
- TypeScript still accepts such a type during the deprecation window: the prop type is
  `WakebBadgeType | WakebDeprecatedBadgeType` (also on WBadgeStack `badgeType`). The deprecated
  part accepts only Vuetify's built-in color names, so a misspelled type is a type error; type your
  own values as `WakebBadgeType` to reject other names.
- `variant="solid"` fills the badge with the type's strong color. Override it with
  `--wakeb-badge-solid-bg` and `--wakeb-badge-solid-text`.

### Skeleton names

Applies to WBaseSidebar `skeletonType` and WPageSkeleton item and header `type`.

| 0.7 value | Provider release |
| --- | --- |
| A portable name: `text`, `paragraph`, `heading`, `avatar`, `image`, `button`, `chip`, `list-item`, `list-item-avatar`, `list-item-two-line`, `list-item-three-line`, `list-item-avatar-two-line`, `list-item-avatar-three-line`, `table`, `table-row`, `card` | Unchanged |
| Comma lists and `@N` repetitions | Unchanged; repetitions above 100 are capped at 100 |
| Other Vuetify 3.13 names: `actions`, `article`, `card-avatar`, `date-picker`, `date-picker-options`, `date-picker-days`, `date-picker-header`, `divider`, `ossein`, `sentences`, `subtitle`, `table-heading`, `table-thead`, `table-tbody`, `table-tfoot`, `table-row-divider`, `table-cell` | Vuetify only: still rendered with `WAKEB_DEPRECATED_VALUE`. Under PrimeVue they are skipped with `WAKEB_UNKNOWN_VALUE`. Replace them with the closest portable name. |
| Unknown names, `@0`, malformed parts | Skipped with `WAKEB_UNKNOWN_VALUE`; an empty result renders `text` |

WPageSkeleton rows also moved from Vuetify `VRow`/`VCol` to a Wakeb 12-column grid
(`wakeb-grid-row`, `wakeb-grid-col`) with fixed breakpoints: `sm` 600px, `md` 960px, `lg` 1280px.
The Vuetify breakpoint settings no longer affect it. CSS that targeted `.v-row` or `.v-col`
inside WPageSkeleton must move to the Wakeb classes.

## Behavior changes {#behavior-changes}

These changes apply immediately; there is no alias.

- **WLoading owns its status semantics.** The root keeps `role="status"` and an accessible name
  from the `label` prop. Caller attributes are bound first, so a `role` or `aria-label` attribute
  no longer replaces them. Rename the status with `label` (or a plugin default or `locale: 'ar'`).
  The same rule applies to the Wakeb-owned bindings of WButton, WDropdown and WModal; see
  [Attribute targets](./providers#attribute-targets).
- **Built-in icons win under Vuetify.** `$expand` and `$collapse` now render Wakeb's own SVG
  chevrons on every provider, including Vuetify, instead of the glyph from your Vuetify icon set.
  They are used by the WButton `isDropdown` indicator, WAccordion `icon` and WDropdown
  `expandIcon`/`collapseIcon`. To keep your own glyph, register the name in the plugin:
  `icons: { aliases: { $expand: MyChevron } }` (a component or SVG path data), or pass a provider
  name such as `mdi-chevron-down` to the prop under Vuetify. Other names still render through
  Vuetify `VIcon`. See [Icons](./providers#icons).
- **WCarousel autoplay is owned by Wakeb.** Wakeb runs the cycle timer on every provider; on
  Vuetify, `VCarousel`'s own `cycle` is turned off. Cycling now pauses while the pointer is over
  the carousel or its indicators, while focus is inside either, while the document is hidden,
  and whenever the user prefers reduced motion. Every slide change restarts the full `interval`.
  Tests that advanced fake timers while hovering or focusing the carousel must expect it to stay
  on the same slide.
- **WAccordion panel is a named region.** When `title` is set, the panel has `role="region"` and
  `aria-label` set to the title. Without a title it has no role, as before. The header toggle
  keeps `aria-expanded` and `aria-controls`.
- **Vuetify WDrawer is a modal dialog with no layout host.** WDrawer no longer needs `VApp` or
  `VLayout`: it renders its own `VLayout` around the drawer and teleports it to Vuetify's overlay
  container. Inside a `VApp` it does not register with your layout, so `VMain` does not move. It
  now closes on Escape unless `persistent`, emitting `update:modelValue` only, locks body
  scrolling while open, moves focus into the drawer and returns it to the opener. Remove your own
  Escape, focus or scroll-lock workarounds. The root is now a `<div role="dialog"
  aria-modal="true">` instead of a `<nav>`, outside your app's DOM tree, so update CSS or test
  selectors that relied on `nav.wakeb-drawer` or on the drawer being a descendant of your app.
  `transparentOverlay` now keeps a transparent scrim, so the page behind stays blocked and an
  outside click closes a non-persistent drawer. The drawer stacks just below `zIndexOverlay` (or 2000), so dialogs and menus opened from it stack above; opened over other Vuetify overlays, it stacks just above them.
- **Typed neutral contracts.** Every root component's type comes from a provider-neutral
  contract. `vue-tsc` now rejects handlers and slot destructuring that do not match the declared
  payloads, provider color names and badge types outside `WakebBadgeType`. Contract types such as
  `ButtonEmits`, `ModalSlots` and `WakebComponentEmits` are exported. See
  [Typed contracts](./providers#typed-contracts).
- **Native attributes are not portable.** Attributes that only Vuetify understands, such as
  `max-width` on WModal, still reach Vuetify, but they do nothing under PrimeVue. Use typed props
  (`width`) or, when there is no portable prop, `providerProps`.

::: warning Nonportable: `providerProps`
WButton, WDropdown, WModal and WLoading accept `providerProps`, native props of the selected
provider's primitive. They are **nonportable**: under another provider the keys are ignored with
`WAKEB_PROVIDER_PROP_IGNORED`. Use them only when no portable prop exists.

```vue
<!-- Nonportable: Vuetify only. -->
<WModal v-model="open" title="Edit" :provider-props="{ scrollable: true }" />
```
:::

## Icon types {#icon-types}

`SharedIcon` no longer references Vuetify. An icon is a name string, SVG path data
(`WakebSvgIcon`, now `readonly`), or a Vue component (`WakebIconComponent`); the Vuetify
`JSXComponent` member is gone.

- **Icon props** accept every 0.7 value, so passing icons needs no change.
- **Icon slot and event payloads** (`IconSlotProps.icon`, WDropdown `selectedItem`, the icon and
  label slots of WButton, WBadge, WBadgeStack, WTooltipBtn, WDropdown, WExportDropdown, WTabs and
  WAccordion) now carry the neutral type. Code that treats such an icon as a Vuetify
  `JSXComponent`, or mutates its SVG path array, no longer type-checks. Copy the array before
  changing it, and render the icon through the slot's own props instead of Vuetify internals.

## Not changed yet

- **Development report of nonportable values.** There is no single report yet. Use the console
  warnings and the search patterns in [Switching providers](./switching#checklist).

## Aware adapter history (0.1–0.7)

The sections below record how Aware kept its own import paths through compatibility adapters
while components moved into this package. They describe 0.7.x and earlier.

### 0.1–0.2

The first extraction keeps the existing application paths as thin adapters:

| Existing path | Shared component |
| --- | --- |
| `components/common/TruncatedText.vue` | `WTruncatedText` |
| `components/common/SegmentedProgress.vue` | `WSegmentedProgress` |
| `components/common/SemiCircleGauge.vue` | `WSemiCircleGauge` |
| `components/common/AvatarStack.vue` | `WAvatarStack` |
| `components/common/Loading.vue` | `WLoading` |
| `components/common/PageSkeleton.vue` | `WPageSkeleton` |
| `components/common/VerticalSteps.vue` | `WVerticalSteps` |

Adapters map Aware tokens to namespaced variables and keep the old prop defaults.
Existing screens do not need to change imports. New applications import named
components directly from `wakeb-components` and choose their own colors.

Numeric percentage normalization, text truncation and valid-size geometry stay
the same. The shared gauge also guards invalid sizes/thickness values; the
shared text component composes listener handlers with Vuetify for keyboard access.
These are documented defensive changes, not business-rule changes.

Forms, tables, layouts, permissions, data loading and theme
configuration remain in Aware. The next extraction should be chosen after its
own dependency and public-API review.


The 0.2 extraction adds defensive boundaries: avatar max and skeleton repeats reject negative/nonfinite ranges, and malformed user names use fallback text. Aware keeps SvgIcon step icons through slots. Avatar menu colors are passed through menuStyle because Vuetify teleports the overlay. Status labels and translations belong to the host.


### 0.3.0

Button, Badge and Accordion are now adapters too. Aware keeps SvgIcon through slots; one small stylesheet maps app tokens to shared variables and preserves the original CSS behavior when a token is missing. Existing imports/props remain, including loading/isLoading, form/action, classList and icon ordering. The adapter retains the legacy span header; the keyboard-native default title button belongs to WAccordion for new consumers. Indicator controls gain ARIA names and expanded state without changing pointer behavior or appearance. Action clicks stop propagation and bodies retain their DOM through v-show.

| Existing path | Shared component |
| --- | --- |
| components/common/Button.vue | WButton |
| components/common/Badge.vue | WBadge |
| components/common/Accordion.vue | WAccordion |


### 0.4.0

BadgeStack, UserBadge and TooltipBtn are compatibility adapters. Stack image slots keep Aware's themed DetectionTypeIcon for visible circles and raw images for overflow circles; its original div activator, per-item overrides, truncation, radius and opacity remain. New WBadgeStack consumers get a native overflow button and can pass menuStyle/badgeAttrs for teleported styling. UserBadge retains 16px avatars, charAt initials, action ordering and native bubbling. TooltipBtn resolves path with the host i18n instance and keeps path as the legacy aria-label. Its old attrs are still forwarded to both the wrapper span and VBtn, including the old bubbling/listener behavior. The shared WTooltipBtn instead accepts translated text and targets ordinary attrs/listeners at VBtn once. New applications should use that simpler public contract.

| Existing path | Shared component |
| --- | --- |
| components/common/BadgeStack.vue | WBadgeStack |
| components/common/UserBadge.vue | WUserBadge |
| components/common/TooltipBtn.vue | WTooltipBtn |


### 0.5.0

Tabs, Tree and Dropdown keep their Aware import paths. Tabs forwards named panels and keeps its scoped SvgIcon shadow-color patch in the app adapter. Layout and semantic colors move to namespaced CSS variables; missing-token behavior stays compatible. Tabs mount/parent synchronization does not emit updateTab. Tree retains controlled expandedKeys/activeKey, connector geometry, inline edit matching and node/action/toggle slots. Default labels render at every depth; empty named slots use Vue fallback content. Standalone WTree additionally supplies ARIA/roving keyboard controls. Aware uses keyboardNavigation=false to keep existing focus behavior. Dropdown translates the complete activator label through host i18n and renders router-link/SvgIcon through slots. Semantic app colors stay in its adapter; root attrs and selectedItem then update:modelValue events retain their targets/order.

| Existing path | Shared component |
| --- | --- |
| components/common/Tabs.vue | WTabs |
| components/common/Tree.vue | WTree |
| components/common/Dropdown.vue | WDropdown |


### 0.6.0

Carousel, ExportDropdown and BaseSidebar retain their existing Aware paths. Carousel keeps two root nodes and drops fragment attrs as before; its legacy hideDelimiters=true maps to showIndicators=true, and indicators retain their old missing native type. New projects use showIndicators with normal positive semantics and non-submit indicator buttons. ExportDropdown keeps the permission directive on the actual Aware Button, its download/PDF/Excel SvgIcon names, translations and select string payloads. The public package only picks a format; host code owns permissions and file generation. BaseSidebar keeps GenericForm/searchSchema/emitOnChange/updateSchema inside Aware via the search slot; the public package receives presentation records and callbacks. App-only gradient tokens, legacy global card-gradient rules, filter buttons/icons and translations stay in the adapter. Header/content/item/filter-modal placement and loading/empty behavior stay compatible.

| Existing path | Shared component |
| --- | --- |
| components/common/Carousel.vue | WCarousel |
| components/common/ExportDropdown.vue | WExportDropdown |
| components/common/BaseSidebar.vue | WBaseSidebar |

### Overlays (0.7.0)

Modal and Drawer keep their Aware import paths. isCloseable/isLoading/isDataLoaded map to closable/loading/dataLoaded; customAction maps to !showActions. Modal retains legacy header visibility, raw decoration, SvgIcon and localized close text. Drawer retains drawer-panel hooks and button-only close timing. jervis-form continues using the adapters. AddEditModal, schemas, validation, step submission, permissions and the unused drawerTarget remain unchanged. String Drawer widths still use parseInt.
