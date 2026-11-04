# Switching providers

::: warning Framework alpha
This guide describes the unreleased provider release (milestones M1 to M4, in progress). Version
0.7.x is Vuetify-only and has nothing to switch.
:::

Wakeb components keep one Vue API on every provider. Switching from Vuetify to PrimeVue, or back,
changes how **Wakeb components** render. It does **not** migrate the rest of your app. This page
lists what a switch covers, what it does not cover, and a checklist that finds the work left in
your project.

## What switching covers

When you change `framework` in the plugin file and install the new provider's peers:

- Component imports stay the same: `import { WButton } from 'wakeb-components'`.
- Props, events and their payloads, slots and their payloads, `v-model` bindings and the public
  types stay the same within the portable contract. They come from provider-neutral contracts;
  see [Typed contracts](./providers#typed-contracts).
- Portable values stay valid: variants (`soft`, `solid`, `outline`, `ghost`), intents, CSS
  colors, Wakeb badge types and the portable skeleton names. See
  [Style vocabulary](./providers#style-vocabulary).
- Plugin `defaults`, `locale`, `direction`, `theme` tokens and `icons` aliases apply on every
  provider.
- `class`, `style`, `id`, `aria-*`, `data-*` and DOM listeners reach the same documented
  attribute target on every provider; see [Attribute targets](./providers#attribute-targets).
- Your bundle contains only the selected provider's renderers. Changing `framework` restarts the
  dev server; providers are never swapped while the app runs.

Coverage is not yet complete. In this alpha, PrimeVue does not render WTruncatedText, WBadge,
WUserBadge and WTooltipBtn; they fail with `WAKEB_COMPONENT_UNSUPPORTED`. `framework: 'shadcn'`
fails the build with `WAKEB_CAPABILITY_UNSUPPORTED`. Check the
[capability matrix](./providers#capability-matrix), or read `wakeb.capabilities.components` at
runtime, before you switch.

Visual parity is not promised. Markup, class names, animations and transitions differ between
providers; the [limits of this alpha](./providers#limits-of-this-alpha) list the known
differences.

## What switching does not cover

Switching providers does **not** cover:

- **Direct use of provider components in your app**, for example `v-data-table`, PrimeVue
  `DataTable`, or shadcn-vue source copied into the app. Rewrite or keep these yourself; they
  still need their own provider installed.
- **`providerProps` values and other nonportable escape hatches.** `providerProps` keys belong to
  one provider. Under another provider they are ignored with `WAKEB_PROVIDER_PROP_IGNORED`. The
  same applies to native attributes such as Vuetify `max-width` on WModal, and to native props
  passed through `chipAttrs` or `wrapperAttrs`.
- **CSS that targets provider classes or DOM**: `.v-*`, `.p-*`, or Tailwind utilities inside
  Wakeb output. Use the `--wakeb-*` and `--wakeb-ui-*` variables instead; they are the stable
  customization API.
- **Your provider's own theme, plugin options, icon sets and global defaults.** Wakeb never
  copies a Vuetify theme into PrimeVue or the other way round. MDI and Vuetify `$alias` icon
  names render only under Vuetify; under PrimeVue they render the fallback box with
  `WAKEB_ICON_UNRESOLVED`.
- **Deprecated aliases accepted by one provider only.** Vuetify color names (`error`,
  `red-darken-2`), Vuetify-only skeleton names (`article`, `sentences` and others) and badge
  types outside `WakebBadgeType` render under Vuetify with `WAKEB_DEPRECATED_VALUE`. Under
  PrimeVue they fall back or are skipped with `WAKEB_UNKNOWN_VALUE`. The variant aliases
  (`tonal`, `outlined` and others) are different: they work on every provider.

Switching is therefore not a "zero changes" operation unless the checklist below finds nothing.

## Checklist {#checklist}

Run these searches from your project root before you switch. Each match is work to review. The
patterns use [ripgrep](https://github.com/BurntSushi/ripgrep); adjust `src` to your source
folders.

```sh
# 1. Provider components and imports
rg -n "<v-[a-z]|<V[A-Z][A-Za-z]+|from ['\"](vuetify|primevue)" src
# 2. providerProps
rg -n -i "provider-?props" src
# 3. Native attribute bags and Vuetify-only attributes on Wakeb components
rg -n -i "chip-?attrs|wrapper-?attrs|max-width" src
# 4. CSS that targets provider classes
rg -n "\.(v|p)-[a-z]" -g "*.{css,scss,vue}" src
# 5. Color props with bare names (review each match; intents are fine)
rg -n "(color|avatar-?color|dot-?color|icon-?color)=\"[a-z]+(-[a-z]+-[0-9])?\"" src
# 6. Vuetify-only skeleton names
rg -n "(actions|article|card-avatar|date-picker|divider|ossein|sentences|subtitle|table-(heading|thead|tbody|tfoot|cell|row-divider))" src
# 7. Provider icon names
rg -n "mdi-|pi-[a-z]" src
# 8. Deprecated variants (they work on every provider, but are removed in the next major)
rg -n "variant=\"(default|tonal|flat|elevated|outlined|text|plain)\"" src
# 9. Host provider setup
rg -n "createVuetify|app\.use\(PrimeVue" src
```

Searches 5 and 6 also match ordinary words; review each match by hand.

Then switch and verify:

1. Install the new provider's peers, for example
   `npm install primevue @primeuix/themes`. The minimum and newest tested versions are in
   [Supported versions](./installation#supported-versions).
2. Change the string literal in the plugin file:
   `createWakebComponents({ framework: 'primevue' })`.
3. If the plugin file sets `providerOptions`, change `kind` to the new framework, and remove or
   rewrite `options`: they are native options of the old provider. A `kind` that does not match
   `framework` fails with `WAKEB_CONFIG_INVALID`.
4. Replace the host provider setup in your app entry (search 9), or remove it and let
   Wakeb install the provider. See [Host provider modes](#host-provider-modes).
5. Restart the dev server. Wakeb restarts it by itself when the plugin file changes.
6. Open every screen in development and read the console. `WAKEB_PROVIDER_PROP_IGNORED`,
   `WAKEB_UNKNOWN_VALUE` and `WAKEB_ICON_UNRESOLVED` name each value that did not carry over.
   `WAKEB_COMPONENT_UNSUPPORTED` names a component the new adapter lacks.
7. Run `vue-tsc` or `tsc --strict`, then your tests. Check keyboard focus in overlays (WModal,
   WDrawer, menus) in a real browser: focus handling is provider-owned.
8. Uninstall the old provider when nothing in the app uses it any more (search 1).

**Development report.** The specification suggests a single development report of the
nonportable values an app used. It is **not implemented yet**: use the console warnings above,
which are logged once per app and value, together with the searches.

## Host provider modes {#host-provider-modes}

Most apps already install and theme their provider. `providerOptions.mode` tells Wakeb whether
to reuse that instance or install its own:

| Mode | Behavior |
| --- | --- |
| `auto` (default) | Reuse a provider instance installed on the same app; otherwise install one |
| `reuse` | Require the host instance; fail with `WAKEB_HOST_PROVIDER_MISSING` if there is none |
| `install` | Wakeb installs the provider; fail with `WAKEB_INSTALL_CONFLICT` if the host already did |

```js
// plugins/wakeb-components.js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'primevue',
  providerOptions: { kind: 'primevue', mode: 'reuse' },
})
```

- **Install order.** Install your provider before `app.use(wakeb)`. Detection runs when Wakeb is
  installed; a provider installed later is not seen.
- **Detection** is per app. Vuetify is detected through its injected theme, defaults, icons and
  locale services; PrimeVue through `app.config.globalProperties.$primevue`. Two apps on one page
  get separate results.
- **Reuse leaves the host alone.** Wakeb does not change the reused instance's theme, defaults,
  icons or locale. Wakeb's own `theme`, `locale` and `direction` apply to Wakeb components only.
- **Native `options`.** `providerOptions.options` is used only when Wakeb installs the provider.
  It is rejected with `WAKEB_CONFIG_INVALID` under `mode: 'reuse'`, and also under `auto` when a
  host instance is found, because it would be ignored. These options are nonportable: rewrite them
  when you switch.
- **Defaults when Wakeb installs.** Vuetify is installed with `ssr: true`; PrimeVue with the Aura
  preset.
- **shadcn-vue** is not implemented yet, so it has no host modes in this build.

::: warning Nonportable: `providerProps`
`providerProps` on WButton, WDropdown, WModal and WLoading passes native props to the selected
provider's primitive. The keys of one provider mean nothing under another. Every
`providerProps` example is nonportable and must be reviewed when you switch:

```vue
<!-- Nonportable: Vuetify only. Under PrimeVue the key is ignored with a warning. -->
<WModal v-model="open" title="Edit" :provider-props="{ scrollable: true }" />

<!-- Nonportable: PrimeVue only. Under Vuetify the key is ignored with a warning. -->
<WModal v-model="open" title="Edit" :provider-props="{ position: 'top' }" />
```

See [Native props](./providers#native-props) for the keys Wakeb always ignores.
:::
