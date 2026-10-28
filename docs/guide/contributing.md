# Verification and contribution

Use Node 22.14+ and `npm ci`, then run `npm run check`.

- Strict SFC type checking and library/declaration builds.
- Actual Vuetify tooltip focus, composed events, reactive props, slots, boundaries and SSR IDs.
- An isolated packed consumer with type checks, a browser build and a Vite server render.
- Bilingual VitePress build; every public prop must have a reference row.

Keep Vue/Vuetify external and application aliases/stores out of library code.
New APIs need both-language documentation and behavior tests. Test meaningful
interactions rather than snapshots of the implementation.

Jervis DevOps builds and publishes documentation. Local checks alone do not prove
a live release. Verify the public deployment receipt and its file hashes.
Publishing docs does not automatically publish the npm package.
