# Aware pilot evidence — 2026-11-05

The owner requested discovery of the actual Aware repository and a separate integration branch.
The selected checkout is `D:/Wakeb/Vue/aware-v2-dahsboard`, origin
`https://git.wakeb.tech/WEB-A/aware-v2-dahsboard.git`, base
`ffe09846548351c2e9dc4fd0002b261d9662ecb2`. The branch is
`codex/aware-wakeb-components-alpha`; no commit, push or publication is implied.

## Integration

The pilot route is `/profile/active-sessions`. Existing Aware Button, Badge, Modal and
PageSkeleton adapters consume the packed alpha. Routing, stores, i18n, theme tokens and business
data remain in Aware. The plugin is installed after the host Vuetify plugin with explicit
`{ kind: 'vuetify', mode: 'reuse' }`; the Vite selector reads that same literal config file.

The host uses Vue 3.5.41, Vuetify 3.13.2 and Vite 8.1.4. This required supporting
`^6.0.0 || ^8.1.4` for the Vite peer. The selector uses Vite 8's Oxc transform/parser when
available and Vite 6's APIs otherwise. `npm run check:peers -- --update` passed all six locked
provider × minimum/current consumers, with strict types, JS/TS selector files, browser/SSR
builds and provider tree-shaking. The current cells resolved Vite 8.3.6; the actual Aware pilot
also verifies Vite 8.1.4. Vite 7 is not advertised.

Aware changes found by integration:

- Normalize Badge's legacy `default` variant to `soft` inside its compatibility adapter.
- Keep `router-link` navigation in the Dropdown adapter and prevent nested anchors.
- Supply the production Wakeb runtime after Vuetify in component test mounts.
- Preserve Carousel's public defaults while testing the Wakeb-owned timer instead of asserting
  VCarousel's now-disabled internal timer. Reflect the documented modal transparent Drawer scrim.
- Fix `/logout` passed to an empty-module factory becoming `//logout`, interpreted as another
  hostname. Both session methods now match the auth store's `buildEndpoint('logout')` call.
  Two store tests use the real factory and assert paths/payloads/state updates.
- Fix the malformed device-name separator in ActiveSessions.

## Verification and scope

| Command / evidence | Result |
| --- | --- |
| Library `npm run check` | Exit 0; 1178 unit passes / 145 provider-conditional skips; isolated packed consumers, 480 Chromium browser/hydration passes, EN/AR docs pass |
| Library `npm run check:peers -- --update` | All 6 cells pass on minimum Vite 6 and current Vite 8 |
| Aware `npm run build` | Exit 0 |
| Aware `npm run test:wakeb-browser` | 4/4 pass, no retries, English/Arabic × light/dark, Chromium |
| Aware full `npm run test:integration` baseline | 117 passed / 7 failed in StreamingHandle, before changing dependencies |
| Initial Aware integration after pilot | 119 passed / same 7 StreamingHandle failures, including 2 new session regressions; historical result before the follow-up below |
| Follow-up Aware `npm test` | Exit 0; 126/126 integration passes (all 43 StreamingHandle tests included), 4/4 helper passes and 4/4 browser passes; no exclusions or skips |
| Aware `npm run test:legacy` | Exit 0, but finds zero tests in its configured paths; not counted as additional passing tests |

Playwright opens the actual SPA route with its router, layout and stores. It seeds synthetic
authentication/user data, routes all API calls to local fixtures, blocks external HTTP and
non-test WebSockets, and fails on unexpected writes, JS/console errors and Wakeb diagnostics.
It verifies theme, RTL, badges, device labels, modal initial/return focus, cancel, close,
Aware's persistent Escape default, busy state, duplicate suppression, exact revoke request
and updated session list. This is not evidence of real backend session revocation or Aware SSR.

The successful host browser run retains two Vue warnings from a missing optional Navbar module
in the existing wakeb-themes package. They are recorded, not treated as Wakeb component passes.
The SDK source map warning, Sass deprecations and bundle-size warnings also remain.

The owner subsequently requested fixing all seven StreamingHandle failures and running every
Aware test group. The failures came from positional button selectors that predated the AI stream
switch: tests clicked the switch/fullscreen/zoom-out controls instead of screenshot/rotate/zoom-in.
They now select toolbar actions by translated accessible names. The bilingual accessibility
cases cover all six action buttons plus the switch's label, role, state and model updates;
zoom-out/reset/source-change assertions and screenshot cancellation/cleanup checks remain active.
No runtime component change was needed. `npm test` now aggregates integration, legacy, helper
and browser commands and stops on failure. Its final run passed all 134 discovered tests, with
no retries, skipped tests or excluded StreamingHandle file. The original failing-run logs remain
historical evidence under `.jervis/reports/wakeb-integration/history`.

Host reproduction and EN/AR notes are tracked in `integration/wakeb-components.md` in Aware.
Browser JSON/HTML, screenshots and observations are under the host's ignored
`.jervis/reports/wakeb-browser`; baseline/final logs, focused test JSON and preservation evidence
are under `.jervis/reports/wakeb-integration`.

The original dirty checkout was snapshotted in this repository's ignored
`.audit/aware-integration-baseline`, including a binary diff and copies of all ten changed files.
The eight unrelated files retained identical SHA256 hashes, including the staged SVG and the
modified feature/theme vendor archives. Package manifests were extended without losing existing
dependency changes. The branch uses the same checkout; it is not an isolated clean worktree.

At the initial pilot, the Aware archive, library browser-tested archive and rebuilt documentation
download had the same SHA512 integrity:

```text
sha512-kRqwCEXHnJ41x5872dUqe0CJE8g3mJkthrYae2C5C0EpYKi1eW4I+4/19V5xtLc0e7wkUP5QfSKRzZix70yA5A==
```

This supplies scoped external Aware compatibility evidence for R20. Broader Aware migration,
manual screen-reader acceptance, other browser engines, release CI and deployment remain
separate gates. Neither npm publication nor documentation deployment was requested or performed.

The later independent gallery task fixes shared button busy-state accessibility and shadcn-vue
dropdown positioning in a newer local archive. It does not replace Aware's vendor archive.
See PROVIDER-GALLERY.md and the current BROWSER-VERIFICATION.md for that separate evidence.
