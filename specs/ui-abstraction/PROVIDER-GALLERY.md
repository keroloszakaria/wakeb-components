# Independent provider gallery — 2026-11-05

The owner requested a standalone comparison of the components on Vuetify, PrimeVue and
shadcn-vue, separate from the Aware integration. `examples/provider-gallery` renders all 21
public components with one shared set of examples and local synthetic data.

`scripts/gallery-server.mjs` prepares three temporary Vite projects outside the checkout. Each
installs the same packed archive, Vue/Vite and only its own provider's optional peers. It serves
the galleries on loopback ports 41801, 41802 and 41803. Provider links preserve locale/theme;
header controls change language, change theme and reset the examples. Configuration changes
remount the demo app, as disclosed in the UI. No real account or business API is used.

Reproduction commands and English/Arabic usage notes are in
`examples/provider-gallery/README.md`. The default command builds and packs a fresh library;
`--tested-package` verifies and reuses the archive in `.audit/browser/consumers.json`.

## Findings fixed

- WButton exposed its loading label but did not consistently expose `aria-busy` on PrimeVue
  and shadcn-vue. The shared button behavior now supplies `aria-busy="true"` while `isLoading`,
  even if a caller provides a contradictory value. Six provider/tooltip contract cases cover
  state changes, accessible names and caller precedence. The existing form/keyboard browser
  scenario also asserts busy state on every provider.
- shadcn-vue WDropdown mounted its content before the custom activator reference existed.
  Nested reka-ui prop forwarding did not propagate that initially absent anchor, so the popup
  remained at its unpositioned offscreen transform. Content now mounts with the first concrete
  reference and stays mounted thereafter to preserve closing/focus behavior. Native prop policy
  validation remains eager for closed menus. The primitive-prop test opens the menu before
  inspecting its content. The shared browser test now scrolls a long page, checks popup viewport
  geometry and verifies both keyboard and mouse selection/event ordering.
- Gallery examples explicitly opt the nested modal out of the library's persistent default.
  The gallery test uses the actual named tab panel during Vuetify's transition and checks its
  retained drawer's inert/offscreen closing semantics. The gallery stylesheet fits the sidebar
  inside a narrow card without changing the component's public minimum-width default.

## Gallery verification

`playwright.gallery.config.ts` runs one interaction scenario in 12 contexts: three providers ×
Arabic/English × light/dark. Each checks all 21 cards, actual 390px/1440px layout, loading state,
progress input, accordion, tabs, dropdown, modal, drawer with nested Escape handling, and the
language/theme/reset controls. Browser warnings/errors and Vue component warnings fail the run.
It has no retries or skips. The final gallery run passed all 12 contexts.

HTML/JSON results, screenshots at both widths, the archive/peer receipt and failed development
history are retained under `.audit/gallery`. These are comparison and debugging artifacts,
not pixel-diff baselines. The gallery is a client-rendered playground; SSR/hydration evidence
belongs to the separate 480-case suite in BROWSER-VERIFICATION.md.

This is alpha component verification on Chromium. It does not certify Firefox/WebKit, promise
identical provider DOM/typography, or authorize package/documentation publication. The Aware
pilot retains its own archive and historical evidence in AWARE-INTEGRATION.md; it is not silently
upgraded by this separate gallery task.
