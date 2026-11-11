# Server rendering

The package uses Vue useId for distinct SVG references. It does not read window,
document, storage or application services in its own setup functions.
Vuetify contains CSS imports and must be processed by your SSR bundler.

The isolated consumer verifies this Vite configuration:

```ts
export default {
  ssr: { noExternal: ['wakeb-components', 'vuetify'] }
}
```

Install the same Vuetify plugin in server and browser applications. Import CSS
in the browser entry, retain Vue-generated IDs during hydration and use the same
initial props on both sides. This is an ESM Vue library, not a plain Node require
module. Framework-specific SSR adapters beyond the tested Vite consumer are not
claimed as verified integrations.

In an SSR application, enable Vuetify SSR mode in both server and browser plugin
setup. This defers overlay mounting until hydration and keeps initial HTML aligned:

```ts
import { createVuetify } from 'vuetify'
const vuetify = createVuetify({ ssr: true })
```

## Provider alpha: browser hydration verification

For `0.8.0-alpha.0`, use the same `createWakebComponents` options on server and client and the
`wakebComponents()` Vite integration described in [Providers and setup](./providers). It adds the
selected provider's SSR bundling configuration. When Wakeb installs Vuetify it enables `ssr: true`;
when reusing your own Vuetify plugin, enable that option yourself on both sides.

Create a fresh Vue application and Wakeb plugin per SSR request. Keep the initial props, locale,
direction and theme identical during hydration. When rendering more than one Vue root in the same
document, give each application a distinct `app.config.idPrefix`, using the same prefix on its server
and client instances. For example, use `'dashboard-'` for the first root and `'settings-'` for the second.
Preserve the SSR context's Teleport output in the matching overlay hosts when composing the HTML.

`npm run test:browser` executes Chromium hydration against the actual tarball with Vuetify, PrimeVue
and shadcn-vue independently. It checks repeated component ID references, concurrent requests, two
roots with independent settings, initially open/closed modal and drawer states, focus after hydration
and cleanup on unmount. Vue development warnings and browser errors fail the suite; mismatches are
not suppressed. See [Verification and contribution](./contributing) for commands and artifact paths.
This verifies the provided Vue + Vite consumers in Chromium; it does not claim Nuxt or other browser integrations.
