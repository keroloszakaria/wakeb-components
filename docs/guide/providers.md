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

Tested peer versions: Vue 3.5, Vite 6.4, Vuetify 3.13 (3.13.2 in the packed consumer),
PrimeVue 4.5.5 with `@primeuix/themes` 2.0.3. PrimeVue 5 is not supported: it moved to a
commercial license that requires a license key.

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
| `onPrimary` | `--wakeb-ui-on-primary` | WButton primary text |
| `surface` | `--wakeb-ui-surface` | WModal background |
| `onSurface` | `--wakeb-ui-on-surface` | WModal title |
| `muted` | `--wakeb-ui-muted` | WModal description |
| `border` | `--wakeb-ui-border` | WModal border |
| `focus` | `--wakeb-ui-focus` | WButton focus outline |
| `radius` | `--wakeb-ui-radius` | WButton and WModal corners |
| `spacing` | `--wakeb-ui-spacing` | WModal padding |
| `fontFamily` | `--wakeb-ui-font-family` | WModal content |
| `zIndexOverlay` (number) | `--wakeb-ui-z-index-overlay` | WModal and WDropdown overlay stacking |

Component variables such as `--wakeb-button-primary-background` still win over these tokens.
Color tokens accept hex, `rgb()`, `hsl()`, `var(--…)` and named colors. `radius` and `spacing`
accept lengths. Values that could break out of a CSS declaration are rejected.

`theme.mode: 'dark'` writes `data-wakeb-theme="dark"` and switches the surface, text, muted and
border tokens to dark values. Wakeb does not follow `prefers-color-scheme` or store the mode.
Options apply when the plugin is installed; later changes need normal CSS overrides.

The `icons` option is not available yet. Passing it fails with
`WAKEB_CAPABILITY_UNSUPPORTED`.

## Errors

| Code | Cause | Fix |
| --- | --- | --- |
| `WAKEB_CONFIG_INVALID` | Unknown framework or option, malformed defaults or theme, malformed plugin file, missing plugin file | Follow the message; it names the field or file |
| `WAKEB_BUILD_PLUGIN_MISSING` | The app was bundled without `wakebComponents()` | Add it to the Vite plugins and restart |
| `WAKEB_FRAMEWORK_MISMATCH` | The runtime `framework` differs from the compiled one | Restart the dev server or rebuild |
| `WAKEB_PROVIDER_MISSING` | Selected peers are not installed | Run the install command in the message |
| `WAKEB_CONTEXT_MISSING` | A component rendered without `app.use(wakeb)` | Install the plugin on that app |
| `WAKEB_INSTALL_CONFLICT` | Two Wakeb plugins on one app, or `install` mode with a host provider | Keep one plugin per app |
| `WAKEB_HOST_PROVIDER_MISSING` | `reuse` mode without a host provider | Install the provider before Wakeb |
| `WAKEB_COMPONENT_UNSUPPORTED` | The selected alpha adapter lacks the component | See the matrix below |
| `WAKEB_CAPABILITY_UNSUPPORTED` | `framework: 'shadcn'` or the `icons` option in this build | Use Vuetify or PrimeVue; pass icons on props |

Errors are `WakebError` instances with a `code` property, exported from `wakeb-components`.

## Capability matrix

`wakeb.capabilities.components` lists what the selected adapter renders.

| Component | Vuetify | PrimeVue (alpha) |
| --- | --- | --- |
| WButton, WDropdown, WModal, WLoading | Yes | Yes |
| The other 17 components | Yes | Not yet: `WAKEB_COMPONENT_UNSUPPORTED` |
| shadcn-vue | — | Planned (milestone M5) |

## Limits of this alpha

- **Same contract, different DOM.** WButton, WDropdown and WModal pass the same contract tests
  on both providers. Their markup differs: PrimeVue renders the menu and dialog with its own
  overlay elements.
- **Vuetify-only attributes.** `max-width` on WModal and other native Vuetify attributes stay a
  Vuetify compatibility surface. On PrimeVue, use the typed `width` prop.
- **PrimeVue tooltip.** The PrimeVue WButton tooltip opens on hover only. The button still
  gets its accessible name from `title`.
- **PrimeVue styling.** WButton renders PrimeVue's Button unstyled and uses Wakeb tokens. The
  menu and dialog need PrimeVue's styled mode. A host that sets `unstyled: true` globally must
  style those overlays itself.
- **PrimeVue across apps.** PrimeVue keeps its theme service in module scope, so two PrimeVue
  apps on one page share theme styles. Wakeb's own context stays isolated per app.
- **Theme scope reach.** Theme and direction attributes reach component roots, and the
  overlays of WModal and WDropdown. Other overlays (tooltips, WAvatarStack and WBadgeStack
  menus, WDrawer) do not receive them yet. The tokens are consumed by WButton, WDropdown and
  WModal; the other components keep their own variables until they migrate.
- **Component wrapper.** Each root import is a thin wrapper around the provider renderer.
  Test utilities that look components up by name, such as `findAllComponents(WTabs)`, match
  both the wrapper and the renderer.
- **Styles.** `style.css` still contains the CSS of every renderer. Splitting it per provider
  is planned.
- **WDrawer** needs Vuetify's application layout. A provider-neutral overlay host is planned
  (milestone M4).

## What switching does not cover

Switching providers changes how Wakeb components render. It does not migrate the rest of your
app. Before switching, search your project for:

- Direct use of provider components, for example `v-data-table` or PrimeVue `DataTable`.
- Native escape hatches such as `chipAttrs`, `wrapperAttrs` with provider attributes, or native props passed as attributes.
- CSS that targets provider classes or DOM: `.v-*`, `.p-*`.
- Your provider's own theme, plugin options, icon sets and global defaults.
- Native attributes that only one provider understands, such as Vuetify's `max-width`.

Suggested search: `rg "v-[a-z-]+|\.v-|\.p-|from 'vuetify|from 'primevue" src`.
