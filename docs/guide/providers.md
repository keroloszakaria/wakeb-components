# Providers and setup

::: warning Framework alpha
This page describes the unreleased provider abstraction (milestones M1 and M2, in progress). It is not part of
0.7.x. Version 0.7.x stays Vuetify-only and needs no build integration.
:::

Wakeb components keep one Vue API: the same imports, props, events, slots and `v-model`
bindings. A provider (Vuetify or PrimeVue) renders them. You select the provider once, in
one file, and your bundle then contains only that provider's renderers.

## Setup

1. Install the package and the peers for **one** provider:

| Provider | Install |
| --- | --- |
| Vuetify | `npm install wakeb-components vuetify` |
| PrimeVue | `npm install wakeb-components primevue @primeuix/themes` |

The minimum and newest tested peer versions are listed in
[Supported versions](./installation#supported-versions). PrimeVue 5 is not supported: it moved to
a commercial license that requires a license key.

2. Create `plugins/wakeb-components.js` next to `vite.config.js`:

```js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'primevue', // 'vuetify' or 'primevue'
})
```

3. Add the build integration once:

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { wakebComponents } from 'wakeb-components/vite'

export default defineConfig({
  plugins: [vue(), wakebComponents()],
})
```

4. Install the plugin and the styles:

```js
import { createApp } from 'vue'
import App from './App.vue'
import wakeb from './plugins/wakeb-components.js'
import 'wakeb-components/style.css'

createApp(App).use(wakeb).mount('#app')
```

Components are imported the same way on every provider:

```vue
<script setup>
import { WButton, WModal } from 'wakeb-components'
</script>
```

## How the provider is selected

`wakebComponents()` reads the plugin file with a parser. It never runs the file. Only this
form is accepted:

```js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'vuetify', // a string literal
  // other options may be any expression
})
```

The import may be renamed (`import { createWakebComponents as make }`), and TypeScript syntax
such as `satisfies` is allowed. These forms fail with `WAKEB_CONFIG_INVALID`, and the message
shows the accepted pattern:

| Rejected | Example |
| --- | --- |
| Environment value | `framework: import.meta.env.VITE_UI` or `process.env.UI ?? 'vuetify'` |
| Variable or imported constant | `framework: UI` |
| Spread | `createWakebComponents({ ...base })` |
| Duplicate or computed key | `{ framework: 'a', framework: 'b' }`, `{ ['framework']: 'a' }` |
| Re-export | `export { default } from './real-plugin.js'` |
| Indirect default | `const plugin = createWakebComponents(...); export default plugin` |
| Options variable | `createWakebComponents(options)` |

For another location, a monorepo package or TypeScript, pass `configFile`, relative to the
Vite root: `wakebComponents({ configFile: 'src/plugins/wakeb.ts' })`. When the file is
missing, the error lists every searched path. Changing `framework` restarts the dev server;
providers are never swapped live.

## Host provider instance

Most apps already install and theme their provider. By default (`mode: 'auto'`) Wakeb reuses
that instance and never changes its theme, defaults, icons or locale.

```js
export default createWakebComponents({
  framework: 'vuetify',
  providerOptions: { kind: 'vuetify', mode: 'reuse' },
})
```

| Mode | Behavior |
| --- | --- |
| `auto` (default) | Reuse a provider installed on the same app; otherwise install one |
| `reuse` | Require the host provider; fail with `WAKEB_HOST_PROVIDER_MISSING` |
| `install` | Wakeb installs the provider; fail with `WAKEB_INSTALL_CONFLICT` if the host already did |

Install your provider **before** `app.use(wakeb)`. Detection runs when Wakeb is installed. A
provider installed afterwards is not seen, and two instances would compete. Detection is per
app: Vuetify through its injected services, PrimeVue through `app.config.globalProperties.$primevue`.

`providerOptions.options` holds native options used only when Wakeb installs the provider.
These options are not portable. They are rejected with `mode: 'reuse'`, and also when `auto`
finds a host instance, because they would be ignored. When Wakeb installs Vuetify it uses
`ssr: true`. When it installs PrimeVue it uses the Aura preset.

## Plugin options

All options except `framework` are optional. Invalid values fail with
`WAKEB_CONFIG_INVALID` and a message that names the field.

```js
export default createWakebComponents({
  framework: 'vuetify',
  defaults: { WButton: { size: 'md' }, WModal: { persistent: false } },
  locale: 'ar',
  direction: 'rtl',
  theme: { mode: 'dark', tokens: { primary: '#087f8c', radius: '8px' } },
})
```

### Component defaults

`defaults` sets props for every instance of a component in this app. Each prop resolves in this
order:

1. A value passed on the component. `false`, `0`, `''` and `null` count as passed values.
2. The plugin default.
3. The built-in string for the configured `locale`.
4. The component's own default.

`undefined` means the prop was not passed. Boolean attributes keep their HTML meaning:
`<WButton disabled>` is `true` even when the plugin default is `false`.

Defaults are shallow: an object default replaces the component default and is not merged into
it. Each instance gets its own copy, and changing the source object after
`createWakebComponents()` has no effect. These are rejected, both in TypeScript and at runtime:

- Data and model props: `items`, `nodes`, `tabs`, `steps`, `slides`, `config`, `user`,
  `menuItems`, `formats`, `modelValue`, `selectedTab`, `expandedKeys`, `activeKey`,
  `activePath` and `editingNodeId`.
- Event listeners such as `onClick`.
- Callbacks such as `labelFormatter`.
- `providerProps`, which is nonportable and set per instance (see [Native props](#native-props)).
- Unknown component names. TypeScript also rejects unknown props and wrong value types.

Defaults apply to components imported from `wakeb-components`. Components that Wakeb renders
inside another component, such as the close button in WModal, take their props from that
component.

### Locale and direction

`locale` (`'en'` by default) selects the built-in labels, for example the WModal close label
and the WLoading status name. With `'ar'` they come in Arabic. A label prop or a plugin default
always wins. Wakeb does not read the host app's i18n instance.

`direction` is independent of `locale`. When you set it, Wakeb writes `dir` on its component
roots and on teleported overlay content. When you leave it unset, components inherit the page
direction.

### Theme tokens

`theme.tokens` sets semantic variables on Wakeb roots and overlay content, scoped to this app:

| Token | Variable | Used by |
| --- | --- | --- |
| `primary` | `--wakeb-ui-primary` | WButton primary background, WDropdown `primary` color |
| `onPrimary` | `--wakeb-ui-on-primary` | WButton primary text, avatar initials, solid WBadge text |
| `secondary`, `success`, `warning`, `danger`, `info`, `neutral` | `--wakeb-ui-<intent>` | Color props set to that intent |
| `surface` | `--wakeb-ui-surface` | WModal background |
| `onSurface` | `--wakeb-ui-on-surface` | WModal title |
| `muted` | `--wakeb-ui-muted` | WModal description |
| `border` | `--wakeb-ui-border` | WModal border |
| `focus` | `--wakeb-ui-focus` | WButton focus outline |
| `radius` | `--wakeb-ui-radius` | WButton and WModal corners |
| `spacing` | `--wakeb-ui-spacing` | WModal padding |
| `fontFamily` | `--wakeb-ui-font-family` | WModal content |
| `zIndexOverlay` (number) | `--wakeb-ui-z-index-overlay` | Stacking of teleported overlays: WModal, WDropdown, WExportDropdown, the WAvatarStack and WBadgeStack menus, the Vuetify tooltips and the PrimeVue WDrawer |

Component variables such as `--wakeb-button-primary-background` still win over these tokens.
Color tokens accept hex, `rgb()`, `hsl()`, `var(--…)` and named colors. `radius` and `spacing`
accept lengths. Values that could break out of a CSS declaration are rejected.

`theme.mode: 'dark'` writes `data-wakeb-theme="dark"` and switches the surface, text, muted and
border tokens to dark values. Wakeb does not follow `prefers-color-scheme` or store the mode.
Options apply when the plugin is installed; later changes need normal CSS overrides.

### Icons

Icon props (`icon`, `badgeIcon`, `headerIcon`, `expandIcon`, `collapseIcon`, and item and format
`icon`) take a `SharedIcon`, which is one of:

- **A name**, such as `'$close'` or `'brand-logo'`, resolved as described below.
- **SVG path data** (`WakebSvgIcon`): an array of path strings or `[path, opacity]` pairs on a
  24×24 viewBox, for example `['M7 10l5 5 5-5z']`. A string that starts with `svg:` is read as
  one path, for example `'svg:M7 10l5 5 5-5z'`. This keeps existing Vuetify SVG inputs working.
- **A Vue component**, rendered as is.

The `icons` option registers names for this app:

```js
import { h } from 'vue'
import BrandLogo from './BrandLogo.vue'

export default createWakebComponents({
  framework: 'primevue',
  icons: {
    aliases: {
      'brand-logo': BrandLogo,
      $close: ['M6 6l12 12M18 6L6 18'],
    },
    resolve: (name) => (name.startsWith('app-') ? appIcons[name.slice(4)] : undefined),
  },
})
```

| Field | Type | Meaning |
| --- | --- | --- |
| `aliases` | `Record<string, WakebIconDefinition>` | Names mapped to SVG path data or a component |
| `resolve` | `(name: string) => WakebIconDefinition \| undefined` | Called for names that are not in `aliases`; return `undefined` to continue |

`WakebIconDefinition` is SVG path data or a Vue component. A string is never accepted as a
resolved value, so a name cannot point to another name or to HTML. Wakeb never renders icons
from HTML strings. Path data may contain only SVG path commands and numbers. Aliases are copied
when the plugin is created, so later changes to the source object have no effect.

A name resolves in this order. The first match wins:

1. `svg:` prefix: the rest of the string is one SVG path.
2. `icons.aliases[name]`.
3. `icons.resolve(name)`.
4. A Wakeb built-in (table below).
5. The selected provider's own icon set:
   - **Vuetify:** the name goes to Vuetify `VIcon`, so `mdi-*` names and `$alias` names keep
     working with your Vuetify icon configuration and icon font.
   - **PrimeVue:** PrimeIcons class names (`pi pi-check` or `pi-check`) render as an `<i>`
     element. Load the `primeicons` CSS yourself.
6. Anything else: the Wakeb fallback box (below).

Built-in icons are simple SVG paths from Material Design Icons (Apache-2.0). They need no icon
font and render the same way on every provider:

| Name | Shape | Used by default in |
| --- | --- | --- |
| `$expand` | Chevron down | WButton `isDropdown` indicator, WAccordion `icon`, WDropdown `expandIcon` |
| `$collapse` | Chevron up | WDropdown `collapseIcon` |
| `$prev`, `$next` | Chevron left, chevron right | PrimeVue WCarousel arrows |
| `$close` | Cross | Available for consumers |
| `$loading` | Quarter arc (static; animate it with CSS) | Available for consumers |
| `$complete` | Check mark | Available for consumers |
| `$checkboxOn`, `$checkboxOff` | Checked and empty box | Available for consumers |
| `$radioOn`, `$radioOff` | Filled and empty circle | Available for consumers |

Because built-ins come before the provider, `$expand` and `$collapse` now render the Wakeb SVG
under Vuetify too, at the same size. To use your own glyph, register the name in
`icons.aliases`, or pass a provider name such as `mdi-chevron-down` under Vuetify.

**Fallback.** When a name is not resolved and the provider has no matching icon set, Wakeb
renders a box outline (`svg.wakeb-icon--fallback`) at the requested size and color. The control
keeps its size and stays usable. In development Wakeb also logs `WAKEB_ICON_UNRESOLVED` once per
app and name. A `resolve` result that is neither SVG path data nor a component is ignored, with
the same code, and resolution continues with the built-ins. Production builds drop the warning.

**Limits.**

- MDI and Vuetify alias names are not portable. They render only under Vuetify, and under
  PrimeVue they render the fallback box. Use path data, a component or an `icons` alias when an
  icon must work on every provider.
- Icon slots (`icon`, `dropdown`, `item-icon`, `header-icon` and others) receive the value you
  passed, not the resolved icon.
- Icons are decorative (`aria-hidden`). Give icon-only controls an `ariaLabel` or a `title`.
- `resolve` runs on each render and must be synchronous. Return the same value for the same
  name, for example from a map, so that components are not re-created. A component definition
  needs a `render` or `setup` function; runtime-compiled `template` objects are rejected.
- The `icons` option is read once at install. It is scoped to the app, so two apps or two SSR
  requests can use different resolvers.

## Style vocabulary

Props that choose a visual style accept Wakeb values only, so the same value works on every
provider. The first portable set is `variant` on WBadge and WTooltipBtn, and `badgeVariant` and
item `variant` on WBadgeStack:

| Value | Meaning | Vuetify rendering |
| --- | --- | --- |
| `soft` | Tinted background (WBadge default) | `tonal` |
| `solid` | Filled background | `flat` |
| `outline` | Border, no fill | `outlined` |
| `ghost` | Text only (WTooltipBtn default) | `text` |

The Vuetify column is a draft mapping for Vuetify 3.13. It may change once the visual contract
tests exist, while the Wakeb values stay the same.

The baseline names still work until the next major release. In development, each one logs
`WAKEB_DEPRECATED_VALUE` once per app, component, prop and value:

| Old value | Use instead | Note |
| --- | --- | --- |
| `default`, `tonal` | `soft` | `default` already rendered as `tonal` |
| `flat` | `solid` | |
| `elevated` | `solid` | Elevation is not portable; add a CSS shadow |
| `outlined` | `outline` | |
| `text`, `plain` | `ghost` | The faded `plain` look is not kept |

An unknown value falls back to the component default and logs `WAKEB_UNKNOWN_VALUE` in
development. Production builds drop both warnings: the code sits behind
`process.env.NODE_ENV`, which Vite replaces.

### Intents and colors

Color props take a Wakeb intent or a CSS color. The type `WakebColor` rejects anything else at
compile time:

- Intents: `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`.
- CSS colors: `#hex`, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()`, `lab()`, `lch()`, `oklab()`,
  `oklch()`, `color()`, `color-mix()`, `var(--…)` (with or without a fallback), `transparent` and
  `currentColor`.

Bare names such as `red` or `error` are not portable, because Vuetify reads them as its own
theme or palette names.

The rule covers these props:

- WLoading `color`
- WAvatarStack and WUserBadge `avatarColor`
- WSegmentedProgress `color`
- WBadge `dotColor`
- WBadgeStack `dotColor`, item `color` and item `dotColor`
- WAccordion `iconColor`

WDropdown `iconColor` and item `color` keep their own `colorMap` keys.

An intent resolves in this order: its token (`--wakeb-ui-danger`, for example), then the
selected provider's theme color, then a Wakeb fallback:

| Intent | Vuetify bridge | PrimeVue bridge | Fallback |
| --- | --- | --- | --- |
| `primary` | `--v-theme-primary` | `--p-primary-color` | `#087f8c` |
| `secondary` | `--v-theme-secondary` | none | `#475467` |
| `success` | `--v-theme-success` | none | `#12b76a` |
| `warning` | `--v-theme-warning` | none | `#f79009` |
| `danger` | `--v-theme-error` | none | `#f04438` |
| `info` | `--v-theme-info` | none | `#2e90fa` |
| `neutral` | none | none | `#667085` |

Without tokens, a Vuetify app keeps its theme colors. Avatar initials use `--wakeb-avatar-text`,
then `--wakeb-ui-on-primary`, then white.

Provider color names follow the deprecation policy. Under Vuetify they still render as before
and log `WAKEB_DEPRECATED_VALUE` in development. Under other providers they fall back to the
prop default and log `WAKEB_UNKNOWN_VALUE`.

WBadge `type` is a Wakeb style key (`WakebBadgeType`) painted by Wakeb CSS. It is no longer
sent to Vuetify as a chip `color`, so the chip text and icon follow the badge's text color. A
type outside the list is treated as a Vuetify color name and gets the same deprecation
handling. `variant="solid"` fills the badge with the type's strong color, which you can
override with `--wakeb-badge-solid-bg` and `--wakeb-badge-solid-text`.

### Skeleton names

WBaseSidebar `skeletonType`, and WPageSkeleton item and header `type`, use the Wakeb skeleton
grammar.

**Names:** `text`, `paragraph`, `heading`, `avatar`, `image`, `button`, `chip`, `list-item`,
`list-item-avatar`, `list-item-two-line`, `list-item-three-line`, `list-item-avatar-two-line`,
`list-item-avatar-three-line`, `table`, `table-row` and `card`.

**Syntax:**
- Separate names with commas.
- Any name can take a positive `@N` repetition, for example `list-item@3`.
- Repetitions are capped at 100 per item.
- An empty value renders `text`.

**Invalid values:**
- Unknown names, `@0` and malformed parts are skipped, with `WAKEB_UNKNOWN_VALUE` in development.
- The other Vuetify 3.13 names (`article`, `actions`, `sentences` and others) still render
  under Vuetify, with `WAKEB_DEPRECATED_VALUE`.

**Grid:** WPageSkeleton rows use a Wakeb 12-column grid. Its breakpoints are fixed: `sm` at
600px, `md` at 960px and `lg` at 1280px. The provider's breakpoint settings do not change it.
- `cols`, `sm`, `md` and `lg` take `1`–`12`, `'auto'` or `true`, which makes the column grow.
- A falsy `cols` means 12.
- Other spans are ignored, with `WAKEB_UNKNOWN_VALUE`; for `cols` this means 12.

## Attribute targets {#attribute-targets}

Each component sends `class`, `style`, `id`, `aria-*`, `data-*` and DOM listeners such as
`@mouseenter` to exactly one element, its attribute target. Listeners for events a component
declares, such as WButton `@click` or WModal `@update:modelValue`, are Vue events: they fire
once and never also bind to the DOM. `class` and `style` merge with Wakeb's own; other
attributes with the same name follow the rules below.

| Component | Attribute target |
| --- | --- |
| WButton | The native `<button>` on every provider. `wrapperAttrs` targets the outer layout div. |
| WDropdown | The root `div` on every provider, not the activator and not the teleported menu. |
| WModal | The `role="dialog"` element (also `.wakeb-modal`) on every provider. It is teleported. |
| WLoading | The `role="status"` root on every provider. |
| WTruncatedText | The text `<span>` that opens the tooltip. |
| WTooltipBtn | The native `<button>`. `wrapperAttrs` targets the outer span. |
| WCarousel | The carousel root (`role="region"`). Each indicator takes `indicatorAttrs`. |
| WDrawer | The element that carries `.wakeb-drawer`: on Vuetify the `<nav>` drawer root; on PrimeVue the teleported `role="dialog"` element, present only while open. |
| WExportDropdown | The teleported menu overlay on every provider, present only while open (baseline compatibility). |
| WTree | The root `ul` (`role="tree"`). |
| The other components | Their root element. WBadge sends `chipAttrs` to the chip; WBadgeStack sends `badgeAttrs` to each badge. |

Wakeb-owned bindings win over attributes on WButton, WDropdown, WModal and WLoading: the
button `type`, disabled and loading handling, the dialog's accessible name, and the status
`role` and `aria-label`. To rename these, use the typed props (`title`, `ariaLabel`, `label`).
WButton is the exception: a caller `aria-label` names the button. Components that only
Vuetify renders still use Vue's default attribute merge, so a caller attribute with the same
name replaces the component's; do not pass a `role` or `aria-*` value that the component
already sets. They move to the same rules when they migrate.

WSegmentedProgress, WVerticalSteps and WPageSkeleton follow these rules on both providers: their
`role`, `aria-value*` and `aria-busy` stay Wakeb-owned. A caller `aria-label` is the typed
`ariaLabel` prop on WSegmentedProgress; on WVerticalSteps and WPageSkeleton use `label`.

Each component page lists its attribute target under **Attribute target**.

## Native props: `providerProps` {#native-props}

::: warning Nonportable
`providerProps` takes native props of the selected provider. The same keys mean nothing, or
something else, under another provider. Switching providers does not translate them. Prefer
portable props, slots, attributes and tokens, and keep each use easy to find.
:::

WButton, WDropdown, WModal and WLoading accept `providerProps`, a plain object of native props
and listeners that Wakeb passes to one provider primitive:

| Component | Vuetify primitive | PrimeVue primitive |
| --- | --- | --- |
| WButton | `VBtn` | `Button` |
| WDropdown | `VMenu` | `Menu` |
| WModal | `VDialog` | `Dialog` |
| WLoading | `VProgressCircular` | `ProgressSpinner` |

```vue
<!-- Nonportable: Vuetify only. Under PrimeVue these keys are ignored with a warning. -->
<WModal v-model="open" title="Edit" :provider-props="{ scrollable: true, onAfterEnter: track }" />

<!-- Nonportable: PrimeVue only. -->
<WModal v-model="open" title="Edit" :provider-props="{ position: 'top', onShow: track }" />
```

**What is ignored.** Wakeb drops these keys in every build. In development it also reports
each one once per app with the `WAKEB_PROVIDER_PROP_IGNORED` warning:

- Portable attributes: `class`, `style`, `id`, `role`, `tabindex`, `aria-*`, `data-*`, and
  `key` and `ref`. Pass them on the component itself; they reach its attribute target.
- Wakeb-owned bindings: models and every `onUpdate:*` handler, loading and disabled safety,
  the element type, focus containment and stacking, and native callbacks that duplicate a
  portable event. Per component:
  - WButton: `disabled`, `loading`, `type`, `onClick`, and link or element keys (`href`, `to`,
    `tag` on Vuetify; `as`, `asChild`, plus `label`, `badge`, `unstyled` and `pt` on PrimeVue).
  - WDropdown: `modelValue`, `disabled`, `zIndex` and `activator` on Vuetify; `model`,
    `popup`, `autoZIndex`, `baseZIndex` and `pt` on PrimeVue.
  - WModal: `modelValue`, `persistent`, `maxWidth`, `zIndex`, `activator`, `onAfterLeave`,
    `retainFocus`, `captureFocus` and `contentProps` on Vuetify; `visible`, `modal`, `blockScroll`,
    `draggable`, `closeOnEscape`, `dismissableMask`, `autoZIndex`, `baseZIndex`, `pt` and
    `onAfterHide` on PrimeVue.
  - WLoading: `indeterminate`, `modelValue`, `color` and `size` on Vuetify; `strokeWidth` and
    `pt` on PrimeVue.
- Keys that the selected primitive does not declare as a prop or event, including plain DOM
  listeners such as `onMouseenter`. Bind those on the component instead.

**Precedence.** On the primitive, Wakeb's own bindings win, then attributes passed on the
component, then `providerProps`. Native listeners that Wakeb also uses, such as the dialog's
`onShow`, run alongside Wakeb's handler; they never replace it.

**Scope.** `providerProps` is per instance. Plugin `defaults` reject it, in TypeScript and at
runtime (`WAKEB_CONFIG_INVALID`). It is typed as `WakebProviderProps`
(`Record<string, unknown>`), so root declarations stay provider-neutral and TypeScript does not
check native keys; the runtime check against the selected primitive does. Internal
compositions, such as the activator inside WDropdown or the close button inside WModal, do
not receive it. The other 17 components do not accept it yet: TypeScript rejects it, and at
runtime it is dropped with the same warning.

## Typed contracts {#typed-contracts}

The TypeScript type of every root component comes from a provider-neutral contract, not from a
renderer. Props, event payloads, slot payloads and `v-model` bindings are therefore the same
whichever provider you select, and no Vuetify or PrimeVue type appears in the declarations.

| Type | What it describes |
| --- | --- |
| `ButtonProps`, `ModalProps` and the other `*Props` | Props, listed on [Data models](/guide/data-models) |
| `ButtonEmits`, `ModalEmits` and the other `*Emits` | Each event name mapped to its payload tuple, for the ten components that emit events |
| `ButtonSlots`, `ModalSlots` and the other `*Slots` | Each slot and its payload, for every component; `PageSkeletonSlots` is empty |
| `WakebComponentEmits`, `WakebComponentSlots` | The same maps keyed by component name, like `WakebComponentProps` |
| `WakebComponent<'WButton'>` | The public component type of one facade |
| `WakebFacade<Props, Emits, Slots>` | The helper that builds a component type from the three contracts |
| `AccordionTriggerProps` | The attributes and click handler the WAccordion `header` slot gives your toggle |

```ts
import type { ModalEmits, TreeSlots, WakebComponentEmits } from 'wakeb-components'

type NodeLevel = Parameters<NonNullable<TreeSlots['node']>>[0]['level'] // number
const onModel = (...[open]: ModalEmits['update:modelValue']) => console.log(open) // boolean
type Selected = WakebComponentEmits['WDropdown']['selectedItem'] // [item: DropdownItem]
```

Templates checked with `vue-tsc` infer slot payloads and handler types from these contracts, so
`#close-button="{ label }"` on WModal gives a `string`, and `@node-click` on WTree expects a
handler that takes a `TreeNode`.

Each provider renderer is type-checked against its contract, and the build fails if a
renderer declares a prop, event payload or slot payload that differs. The packed package is
checked the same way under `tsc --strict` and `vue-tsc`, with only one provider installed.

**Limit.** WTabs panel slots are named after each tab key, so they are typed with an index
signature whose payload is `any`. They receive no payload; `tab-label` and `tab-icon` are
typed exactly.

## Errors

| Code | Cause | Fix |
| --- | --- | --- |
| `WAKEB_CONFIG_INVALID` | Unknown framework or option, malformed defaults, theme or icons, malformed plugin file, missing plugin file | Follow the message; it names the field or file |
| `WAKEB_BUILD_PLUGIN_MISSING` | The app was bundled without `wakebComponents()` | Add it to the Vite plugins and restart |
| `WAKEB_FRAMEWORK_MISMATCH` | The runtime `framework` differs from the compiled one | Restart the dev server or rebuild |
| `WAKEB_PROVIDER_MISSING` | Selected peers are not installed | Run the install command in the message |
| `WAKEB_CONTEXT_MISSING` | A component rendered without `app.use(wakeb)` | Install the plugin on that app |
| `WAKEB_INSTALL_CONFLICT` | Two Wakeb plugins on one app, or `install` mode with a host provider | Keep one plugin per app |
| `WAKEB_HOST_PROVIDER_MISSING` | `reuse` mode without a host provider | Install the provider before Wakeb |
| `WAKEB_COMPONENT_UNSUPPORTED` | The selected alpha adapter lacks the component | See the matrix below |
| `WAKEB_CAPABILITY_UNSUPPORTED` | `framework: 'shadcn'` in this build | Use Vuetify or PrimeVue |

Errors are `WakebError` instances with a `code` property, exported from `wakeb-components`.
Development warnings (`WAKEB_DEPRECATED_VALUE`, `WAKEB_UNKNOWN_VALUE`,
`WAKEB_ICON_UNRESOLVED`, `WAKEB_PROVIDER_PROP_IGNORED`) are console warnings, not
errors, and production builds drop them.

## Capability matrix

`wakeb.capabilities.components` lists what the selected adapter renders.

| Component | Vuetify | PrimeVue (alpha) |
| --- | --- | --- |
| WButton, WDropdown, WModal, WLoading | Yes | Yes |
| WSegmentedProgress, WSemiCircleGauge, WVerticalSteps, WPageSkeleton | Yes | Yes |
| WTabs, WTree, WCarousel | Yes | Yes (native Wakeb markup) |
| WExportDropdown, WBaseSidebar, WDrawer | Yes | Yes |
| The other components | Yes | Not yet: `WAKEB_COMPONENT_UNSUPPORTED` |
| shadcn-vue | — | Planned (milestone M5) |

## Limits of this alpha

- **Same contract, different DOM.** WButton, WDropdown and WModal pass the same contract tests
  on both providers. Their markup differs: PrimeVue renders the menu and dialog with its own
  overlay elements.
- **Tabs, tree and carousel on PrimeVue.** PrimeVue's Tabs, Tree and Carousel use other models
  (generated ids, eager or unmounting panels, key maps for expansion, pages of several items), so
  WTabs, WTree and WCarousel render Wakeb-owned markup and Wakeb CSS under PrimeVue. Selection,
  ids, keyboard handling, focus recovery and the carousel timer come from the same shared code as
  the Vuetify renderers, and one contract suite runs on both providers. The DOM differs: no
  `.v-*` classes, a plain `role="tablist"` with `<button role="tab">` items, and slides that
  switch without a transition or swipe gestures. The PrimeVue WTree branch toggle is the
  PrimeVue WButton.
- **Vuetify-only attributes.** `max-width` on WModal and other native Vuetify attributes stay a
  Vuetify compatibility surface. On PrimeVue, use the typed `width` prop.
- **PrimeVue tooltip.** The PrimeVue WButton tooltip opens on hover only. The button still
  gets its accessible name from `title`.
- **PrimeVue styling.** WButton renders PrimeVue's Button unstyled and uses Wakeb tokens. The
  menu and dialog need PrimeVue's styled mode. A host that sets `unstyled: true` globally must
  style those overlays itself.
- **PrimeVue across apps.** PrimeVue keeps its theme service in module scope, so two PrimeVue
  apps on one page share theme styles. Wakeb's own context stays isolated per app.
- **Theme scope reach.** The theme and direction attributes (`data-wakeb-theme`, `dir` and the
  `--wakeb-ui-*` variables) reach component roots and every teleported overlay: the WModal
  dialog, the WDropdown and WExportDropdown menus, the PrimeVue WDrawer, the WAvatarStack and
  WBadgeStack overflow menus, and the tooltips of WButton, WTooltipBtn, WTruncatedText and
  WAvatarStack. Overlay
  styling props such as `menuStyle` and `tooltipStyle` sit on the overlay content inside that
  scope, so they win. Two apps on one page keep their own overlay scope.
- **Overlay stacking limits.** `zIndexOverlay` applies to every Vuetify overlay above and to
  the PrimeVue menus, dialog and drawer. The PrimeVue WButton tooltip receives the theme
  attributes but keeps PrimeVue's own tooltip z-index stack. On Vuetify, WDrawer is not
  teleported: it is a Vuetify layout item rendered in place, so its panel takes the scope
  attributes as a root, and its z-index stays with the Vuetify layout, which also places the
  scrim. On PrimeVue, WDrawer is teleported under its own mask, which takes `zIndexOverlay`;
  without it, the drawer and WModal share PrimeVue's modal z-index stack, so a dialog opened
  from a drawer stacks above it.
- **Token consumers.** The tokens are consumed by WButton, WDropdown and WModal; the other
  components keep their own variables until they migrate. The variables on an overlay are
  available to your own CSS for that overlay content.
- **Progress, gauge, steps and page skeleton on PrimeVue.** WSegmentedProgress,
  WSemiCircleGauge and WVerticalSteps render the same Wakeb markup and CSS on both providers.
  WPageSkeleton keeps the same grid and grammar, but draws each skeleton name with Wakeb bone
  shapes on PrimeVue `Skeleton` (unstyled) instead of Vuetify `VSkeletonLoader`, so bone sizes
  are close, not identical. Vuetify-only skeleton names are skipped under PrimeVue.
- **Component wrapper.** Each root import is a thin wrapper around the provider renderer.
  Test utilities that look components up by name, such as `findAllComponents(WTabs)`, match
  both the wrapper and the renderer.
- **Styles.** `style.css` still contains the CSS of every renderer. Splitting it per provider
  is planned.
- **WDrawer host.** On Vuetify, WDrawer needs Vuetify's application layout (`VApp` or
  `VLayout`). On PrimeVue it needs no host markup and no wrapper around your app root: PrimeVue's
  own teleported mask hosts it.
- **WDrawer behavior.** The PrimeVue drawer meets the temporary-drawer rules: it is a modal
  `role="dialog"`, moves focus inside and traps Tab there, closes on Escape and on an outside
  click unless `persistent`, locks body scrolling, and returns focus to the element that opened
  it. `transparentOverlay` hides the mask color but keeps the mask, so the background stays
  inert. The logical side follows the Wakeb `direction` option. The Vuetify drawer keeps its
  native behavior: no Escape dismissal, no scroll lock, and the host manages launch and return
  focus.
- **WBaseSidebar skeleton.** On PrimeVue the loading skeleton accepts the portable skeleton
  names only (SPEC R16) and renders them with PrimeVue `Skeleton` bones. Vuetify-only names are
  skipped with `WAKEB_UNKNOWN_VALUE`.
- **WExportDropdown menu.** On PrimeVue the formats render in PrimeVue's `Menu`, which owns
  positioning, arrow keys, Escape and outside clicks. `menuStyle` styles the `role="menu"` list.

## What switching does not cover

Switching providers changes how Wakeb components render. It does not migrate the rest of your
app. Before switching, search your project for:

- Direct use of provider components, for example `v-data-table` or PrimeVue `DataTable`.
- `providerProps` values. Their keys belong to one provider; under another provider they are
  ignored with `WAKEB_PROVIDER_PROP_IGNORED`.
- Native escape hatches such as `chipAttrs`, `wrapperAttrs` with provider attributes, or native props passed as attributes.
- CSS that targets provider classes or DOM: `.v-*`, `.p-*`.
- Your provider's own theme, plugin options, icon sets and global defaults.
- Native attributes that only one provider understands, such as Vuetify's `max-width`.

Suggested search: `rg "v-[a-z-]+|\.v-|\.p-|from 'vuetify|from 'primevue|provider-?props" src`.
In development, run the app on the new provider and look for `WAKEB_PROVIDER_PROP_IGNORED`
in the console: it lists each native key that the new provider does not accept.
