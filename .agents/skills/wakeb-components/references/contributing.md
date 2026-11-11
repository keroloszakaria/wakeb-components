# Verification and contribution

Use Node 22.14+ and `npm ci`, install the test browser with `npx playwright install chromium`,
then run `npm run check`. On Linux build agents, use `npx playwright install --with-deps chromium`.

- Strict SFC type checking and library/declaration builds.
- Actual Vuetify tooltip focus, composed events, reactive props, slots, boundaries and SSR IDs.
- An isolated packed consumer with type checks, a browser build and a Vite server render.
- Playwright Chromium execution against three isolated packed consumers: all 39 components,
  light/dark × LTR/RTL × 390px/1280px, keyboard and real focus, geometry and computed colors,
  Teleport, reduced motion and SSR hydration (closed/open overlays and concurrent requests).
- Bilingual VitePress build; every public prop must have a reference row.

Run `npm run test:browser` for the browser suite alone; it builds a fresh library and installs a
tarball in temporary consumers outside the repository with only the selected provider's peers.
The fixture source is identical on all providers. Tests run with Vue development diagnostics enabled
and fail on browser errors, console warnings, server warnings or hydration warnings. They never
silence mismatches. `playwright.config.ts` defines the 24 projects; `-- --project=shadcn-dark-rtl-small`
selects one when passed to `npm run test:browser`.

Artifacts are under `.audit/browser`: `results.json`, the HTML `report/index.html`, screenshots and
failure traces in `artifacts`, and `consumers.json` with the exact peer versions, tarball integrity
and temporary paths. Every test attaches Chromium's version and Vue/browser diagnostics. Keep these
artifacts with the Jervis DevOps run. Chromium coverage does not establish Firefox/WebKit or manual
screen-reader coverage. `npm run check` includes this suite; it does not publish anything.

`npm run check:peers` runs the locked peer version matrix in `tests/fixtures/peers`
(minimum and newest in-range Vue, Vite and provider versions, installed with `npm ci`).
It takes about three minutes and needs the npm registry or a warm npm cache, so
`npm run check` does not run it. Instead the docs build fails when the fixtures,
`results.json` and the supported-versions tables disagree. The Jervis DevOps pipeline
MUST run `npm run check:peers` before a release. After changing a peer range, run
`npm run check:peers -- --update` and commit the refreshed fixtures, results and docs.

Keep Vue/Vuetify external and application aliases/stores out of library code.
New APIs need both-language documentation and behavior tests. Test meaningful
interactions rather than snapshots of the implementation.

Jervis DevOps builds and publishes documentation. Local checks alone do not prove
a live release. Verify the public deployment receipt and its file hashes.
Publishing docs does not automatically publish the npm package.
