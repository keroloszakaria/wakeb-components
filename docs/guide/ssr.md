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
