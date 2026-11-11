# Browser and hydration verification — 2026-11-05

Status: **passed**. `npm run check` completed with exit code 0, including all 480 browser cases
and the bilingual documentation build. This record covers the working-tree changes based on
`0f50c87c45f9ddc8b7a14d5ba9b5406ee0a8e09f`; no release commit or publication is implied.

## Reproduction

```sh
npm ci
npx playwright install chromium
npm run check
```

Linux agents need `npx playwright install --with-deps chromium`. The independent command
`npm run test:browser` builds a fresh package, then runs the browser tests. Use, for example,
`npm run test:browser -- --project=primevue-dark-rtl-small` to select one project.

`playwright.config.ts` defines 24 projects: three providers × light/dark × LTR/RTL ×
390×844 / 1280×900. Each runs the same 20 scenarios in `tests/browser/contracts.spec.ts`.
There are no retries or provider-specific test skips. A fresh, headless Chromium context is used
for every test. Both browser warnings/errors and Vue server/client warnings fail the test.

## What actually executes

`scripts/browser-server.mjs` creates one npm archive and installs it into three temporary
directories outside this repository. Each contains Vue, Vite, the SSR renderer and only the
chosen provider's peers. All browser fixture files are copied unchanged; only the literal
provider selector and package dependencies differ. The browser imports the packed root API,
not repository aliases or renderer source files.

The fixtures run through the packed Vite integration with Vue development diagnostics enabled.
Raw Node SSR has no DOM shims. Client `createSSRApp` hydrates its actual HTML. Manual hydration
tests retain references to server-created DOM nodes and IDs before mounting, so replacing the
whole root cannot pass as successful hydration. The server composes SSR Teleport output into its
matching hosts. Both initially open and initially closed modal/drawer states are exercised.
Independent roots have matching server/client `app.config.idPrefix` values.

## Scenario coverage

| Scenario group | Browser assertions |
| --- | --- |
| All 21 components | Render and hydrate the gallery; preserve server input/heading nodes and tab/accordion references; no duplicate document IDs; capture a full-page screenshot |
| Initially open modal and drawer | Hydrate, take focus, dismiss and unmount; no visible dialogs or retained body scroll lock |
| Progress | At 10%, actual fill width matches the gap-adjusted ratio within one CSS pixel, with empty, short, long English/Arabic and slotted labels |
| Tabs | Two independent instances; real focus with arrows/Home/End, LTR/RTL, matching tab/panel references and panel selection |
| Tree | Collapse/remove a focused child and restore actual ancestor focus; never steal focus from an external control |
| Buttons | Requested built-in/custom SVG size, text margins and button height; native submit/reset counts; loading suppresses Enter/Space activation in ordinary and tooltip modes; loading retains its accessible name |
| Computed colors | Secondary normal/hover/disabled/loading tokens; light/dark tree, tab, accordion, sidebar and export-button colors; component overrides still win |
| Dropdown | Disabled links cannot navigate; arrow navigation uses actual focus or valid aria-activedescendant; Enter emits selectedItem before modelValue exactly once |
| Modal/drawer interaction | Native Tab/Shift+Tab confinement; persistent Escape/outside press; reactive persistent changes; opener focus return; measured width and description-only header |
| Nested overlays | First Escape closes the modal opened inside the drawer; second closes the drawer |
| Two apps | Distinct theme/direction scopes on teleported dialogs, independent IDs and cleanup |
| Carousel | Actual autoplay; pause on hover/focus/reduced motion; indicators never submit the form; no cycling after unmount |
| Informational overlays | Keyboard-opened badge overflow retains circular geometry outside the component root; keyboard tooltip has a matching description and a correctly positioned painted bubble |
| Concurrent SSR | Repeated concurrent requests have identical IDs; two configured roots hydrate without shared configuration |
| Focus/grid | Actual focus-visible outline and skeleton column ratios at the two viewport sizes |

## Fixes found by browser verification

- Loading buttons lost their accessible title when their visual content was hidden.
- Vuetify model-controlled modals did not restore focus to an external opener.
- Explicit Wakeb direction did not reach Vuetify's injected RTL context. The bridge is now local
  and adds no DOM wrapper; it leaves the host locale intact.
- PrimeVue registered its Escape listener only on opening, so changing `persistent` from true to
  false while open did not enable Escape. Modal and drawer now share reactive, topmost-only handling.
- Skeleton columns depended on a host `border-box` reset and overflowed in shadcn-only consumers.
- Several text/surface fallbacks ignored dark-mode tokens. Tree, tabs, accordion, sidebar and
  transparent buttons now use scoped surface tokens while retaining explicit component overrides.
- Export activators missed their plugin theme/direction scope although their menus received it.
- A shared SVG sizing rule assumed Vuetify icon wrappers, stretching direct SVGs on the other providers. Native paragraph margins/font resets also overrode button sizing; both are now measured in the browser.

The geometry assertions measure settled, painted popup content. Vuetify puts `role=tooltip` on
the viewport overlay; reka-ui exposes accessible text inside the bubble. A bounding box of that
role alone does not measure the painted bubble. Badge popups are opened with native Enter to
avoid the documented hover-open/click-toggle sequence closing them before measurement.

## Result and retained artifacts

Tooling: Node 26.12.1, Playwright 1.64.1, Chromium 156.0.8078.4 on Windows.

| Provider | Vue / SSR renderer | Vite | Provider peers |
| --- | --- | --- | --- |
| Vuetify | 3.5.44 | 6.4.5 | vuetify 3.13.7 |
| PrimeVue | 3.5.44 | 6.4.5 | primevue 4.5.5, @primeuix/themes 2.0.3 |
| shadcn-vue | 3.5.44 | 6.4.5 | reka-ui 2.11.0 |

Development runs were intentionally kept red while resolving findings: the first 432-case matrix
had 422 passes and 10 failures; the subsequent 456-case matrix had 441 passes and 15 failures
(export activator theme scope and popup measurement/activation sequencing). Their logs and the
latter JSON result are retained in `.audit/browser/history`. A complete `npm run check` then passed all 456 browser cases and the bilingual docs build; its log/result/consumer receipt are saved as `history/before-icon-sizing-*`. Screenshot review subsequently found direct SVG and paragraph/font sizing problems, so a twentieth scenario was added and the final full check rerun. The final result follows.

Final command: `npm run check` — **passed, exit 0**.

- Unit/SSR suite: 61 files passed, 2 provider-conditional files skipped; 1184 tests passed,
  145 provider-conditional tests skipped.
- Browser suite: **480 passed**, 0 failed, 0 skipped, 0 flaky, no retries (20 × 24); 160 cases per provider. Chromium execution took 8.1 minutes. The run began at 2026-11-05 11:44:05 Africa/Cairo.
- Packed type/browser/SSR/tree-shaking checks: **passed on all three providers**. Bilingual documentation build: **passed**. The documentation download archive has exactly the same SHA-512 integrity as the browser-tested package.

The final `check:package` module collector recorded these rendered module counts (all 21
components versus WButton alone). That check uses Vuetify 3.13.2; the actual Chromium matrix uses
the current versions listed above. Unselected provider modules are absent and dialog/menu
primitives are removed from the WButton-only graphs.

| Provider | Full graph | WButton only |
| --- | --- | --- |
| Vuetify | 194 | 98 |
| PrimeVue | 217 | 144 |
| shadcn-vue | 154 | 66 |

Archive: `wakeb-components-0.8.0-alpha.0.tgz`. Integrity:

```text
sha512-Mo6c0UjtBPl6Ucib2g9rZlOceMls6HqCmtB1/IMijHofptjms3rWGS9vtzDLM+hyNu9sxXozjzHWalgXFzd0eQ==
```

The completed run retains `.audit/browser/summary.json`, `.audit/browser/results.json`, `report/index.html`, gallery screenshots,
failure screenshots/traces when applicable, and `consumers.json` (peer versions, archive integrity,
and isolated directories). Each result attaches the Chromium version and browser/Vue diagnostics.
The final check log is copied to `.audit/browser/check.log`. Earlier failed development runs are
retained under `.audit/browser/history`; their failures are not silently relabeled as passes.

## Limits

This is Chromium/Vue+Vite evidence on the installed current provider versions, not a Firefox,
WebKit, Nuxt or real-device certification. It supplements the existing six-cell minimum/current
peer matrix; `npm run check:peers` is not rerun by this suite. Gallery screenshots are review
artifacts, not pixel-diff baselines or a promise that provider DOM/typography is identical.
The carousel document-hidden policy remains covered by the unit suite; the headless browser tests
exercise hover, focus, reduced motion and unmount directly.

The latest three-provider gallery follow-up passed another complete `npm run check`: 1184 unit passes,
145 provider-conditional skips and 480 browser passes, with no browser retries/failures/skips.
The six-cell peer matrix was also refreshed and passed, verifying JS and TS selector files on
Vite 6.0.0 and current Vite 8.3.6. The archive above matches the rebuilt documentation download
and all three independent galleries. The initial Aware pilot retains its earlier archive;
see [AWARE-INTEGRATION.md](./AWARE-INTEGRATION.md).

The independent 21-component galleries passed 12 additional locale/theme contexts, each at
390px and 1440px with real language/theme/reset controls. This follow-up fixed portable
WButton busy-state accessibility and shadcn-vue dropdown anchor initialization. The shared
dropdown browser case now checks viewport placement after scrolling plus mouse selection,
as well as the existing keyboard/event-order assertions. Reproduction and scope are recorded
in [PROVIDER-GALLERY.md](./PROVIDER-GALLERY.md). Gallery reports live in `.audit/gallery`.

Targeted manual screen-reader review, exhaustive browser checks of every deprecated style alias
and a Jervis DevOps release/publication run remain separate acceptance work. The scoped Aware
pilot supplies external compatibility evidence, with its baseline failures and theme warnings
recorded separately. No npm package or documentation release is authorized by this record.
