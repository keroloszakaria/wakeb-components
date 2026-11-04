# Acceptance and verification matrix

Status: acceptance plan with recorded status at `92f4657` (`feat/m1-selector-packaging`), updated for the M2–M6 release review. **No row is fully met for a stable release.** Real-browser verification (section C) and a Jervis DevOps pipeline run are not recorded for any milestone. The release is alpha at most (see "Completion evidence format"). Nothing has been published.

Status values:

- **Met:** the evidence required in the second column exists and passes.
- **Partial:** some of the evidence exists (usually jsdom, `renderToString` or packed-consumer evidence), and the column says what is missing.
- **Not met:** no qualifying evidence exists.

Commands at `92f4657`:

- `npx vitest run` was re-run for this record: 55 files passed and 2 were skipped; 1049 tests passed and 115 were skipped, in three projects (vuetify, primevue, shadcn).
- `npm run check` and `npm run check:peers` were reported as passing on this commit but were not re-run for this record. `check:peers` has six cells, vuetify, primevue and shadcn × min and current (`tests/fixtures/peers/results.json`).
- No exit-code logs or archive checksums are attached yet; the "Completion evidence format" below still applies.

## Traceability

| ID | Acceptance evidence required | Status | Evidence / what is missing |
| --- | --- | --- | --- |
| R01 | Same consumer Vue source imports root W* exports under each provider; all baseline exports exist | Partial | Met for all three providers (21/21 each; `SUPPORTED` in `src/adapters/manifest.ts`). Byte-identical fixture sources in `scripts/consumer/*` run under three providers in `npm run check:package`; `tests/types/conformance.ts` and `tests/contracts.test.ts`. |
| R02 | Literal framework union; selection only in plugin file; restart/rebuild switching tested | Partial | `tests/selector.test.ts`; plugin-file-only selection in `src/build/vite`; three consumers differ only in plugin file, manifest and lockfile (`scripts/consumer-harness.mjs`). Missing: a recorded restart/rebuild switch of one running project. |
| R03 | Dependency/import boundary scan; no business/store/router/i18n-instance/application-token coupling | Met (automated scan) | `tests/layers.test.ts` (provider import boundaries). Review against AGENTS.md exclusions; no store, router or i18n imports in `src/`. |
| R04 | Clean installation, dev startup and production build using exactly the documented plugin/main/Vite flow | Partial | Clean temp-dir installs from the packed tarball, with browser and SSR builds (`npm run check:package`, `npm run check:peers`). Missing: recorded dev-server startup per provider following `docs/guide/installation.md` literally. |
| R05 | Published declaration consumers with valid/invalid options, defaults and provider branches; synchronous Plugin install | Met (packed consumers) | `@ts-expect-error` cases in `scripts/consumer/consumer.ts` under `tsc --strict`; `tests/plugin.test.ts`, `tests/defaults.test.ts`. Commit `825f3ba`. |
| R06 | Defaults precedence and mutation isolation tests for absent/undefined/false/zero/empty/null inputs | Met | `tests/defaults.test.ts` on all three projects. Commit `825f3ba`. |
| R07 | Each stable error code triggered intentionally with actionable safe message and no silent fallback | Partial | `tests/plugin.test.ts`, `tests/selector.test.ts`, `tests/defaults.test.ts`, `scripts/consumer/unconfigured.js` (`WAKEB_BUILD_PLUGIN_MISSING`). `WAKEB_CAPABILITY_UNSUPPORTED` is reserved: it applies only to a documented optional feature (R05, R21), the capability manifest defines none, and missing mandatory behavior uses `WAKEB_COMPONENT_UNSUPPORTED` or is an R19 limit (Vuetify WDrawer host). `tests/errors.test.ts` pins it as declared, constructible and raised nowhere in `src/`; the `toEqual` manifest check in `tests/plugin.test.ts` pins no optional entries on all three providers. Nothing open for this code until an optional feature is specified. |
| R08 | Architecture scan; compositions reuse neutral primitives; no duplicate focus/keyboard behavior | Partial | `tests/layers.test.ts`; shared composables (`useButton`, `useDropdown`, `useDisclosure`, `useColor`, `useSkeleton`). Missing: a review that confirms no duplicated focus or keyboard logic across the three adapters' Wakeb-owned markup (WTabs, WTree, WCarousel). |
| R09 | Actual packed consumer build module graph proves absent/unselected provider isolation and tree shaking | Met (packed consumers) | `scripts/consumer-harness.mjs` (`collect-modules`, `PROVIDER_MODULE`, `OVERLAY_MODULE`) in `check:package` and `check:peers`. Module counts are in M1-DECISION.md and M5-DECISION.md; the shadcn counts predate the 15-component graph. |
| R10 | Archive export-target existence, CSS/JS/declaration entry resolution, mandatory/optional peer validation | Met | `packTarball` assertions in `scripts/consumer-harness.mjs`; six locked cells in `tests/fixtures/peers/*` and `scripts/check-peers.mjs`. Commit `3cc4a2d`. |
| R11 | shadcn-only consumer without Tailwind config/source copying; scoped styles and licenses verified | Partial | `assertScopedAdapterCss` in `scripts/consumer-harness.mjs`; `THIRD-PARTY-NOTICES.txt` in the tarball; `tests/shadcn-adapter.test.ts` ("shadcn adapter CSS"). The notices list `popover`, `sheet` and `skeleton` with the other copied shadcn-vue files. |
| R12 | Baseline-to-current API diff, signature snapshots and full component/provider contract coverage | Partial | Neutral contracts in `src/contracts.ts` and `tests/types/conformance.ts` (commits `5ce7116`, `285b979`, `eb56419`). Automated baseline diff: `tests/baseline-diff.test.ts` with `scripts/api-diff.mjs` compares runtime exports, exported type names, prop names/types/optionality, Vuetify renderer defaults, emit payloads and slot payloads with `specs/ui-abstraction/baseline.json` (TypeScript assignability: props as inputs, payloads as outputs) and fails on any breaking difference missing from `specs/ui-abstraction/baseline-changes.json` or on a stale entry; each entry names its migration-guide section. Missing: event order is not part of the diff (covered by R13 suites); every entry now points to a migration-guide section, including `#icon-types`. |
| R13 | Exact event payload/order/count, model synchronization, item changes/clear state, disabled behavior | Partial | `tests/contract.test.ts`, `tests/navigation-contract.test.ts`, `tests/compositions-contract.test.ts`, `tests/stacks-contract.test.ts`, `tests/badge-tooltip-contract.test.ts` (jsdom). All of them run in the vuetify, primevue and shadcn Vitest projects. |
| R14 | Slot inference/runtime payloads, attrs targets, class/style merge and exactly-once native handlers | Partial | `vue-tsc` on `Templates.vue` in the packed consumers; `tests/provider-props.test.ts`; attribute targets documented in `docs/guide/providers.md`. The shared suites run on all three providers. |
| R15 | Built-in icons/resolver/slots on every provider; neutral root declarations without Vuetify types | Met (jsdom) | `tests/icons.test.ts` on all three projects; commit `c250d4b`. |
| R16 | Skeleton grammar/repetition/grid fixtures; customHTML trusted-only documentation and escaped normal text | Met (jsdom) | `tests/colors.test.ts`, `tests/extracted.test.ts` (commits `7ab2025`, `0aacfd6`); customHTML deprecation in `tests/navigation-contract.test.ts` (commit `ed1666b`). Breakpoint behavior has not been checked in a real browser. |
| R17 | Token extraction/docs coverage and computed-state colors; dark/RTL/Teleport/multi-app checks | Partial | `docs:build` token scan; `tests/overlay-scope.test.ts`, `tests/colors.test.ts` (commit `2894dea`). One earlier manual browser check on the packed PrimeVue consumer (M2-PROGRESS.md). Missing: a recorded browser matrix (section C). PrimeVue tooltips take `zIndexOverlay` and keep a global `pt.directives.tooltip.root` style (owner decision; `tests/badge-tooltip-contract.test.ts`). |
| R18 | Automated browser semantics and keyboard/focus suites plus targeted manual accessibility review | **Not met** | jsdom keyboard and focus tests exist (`tests/shadcn-adapter.test.ts`, `tests/primevue-adapter.test.ts`, `tests/navigation.test.ts`), but they are not browser execution. Manual smoke check in Chromium on the packed consumers at `d5904ac` (2026-11-04): all 20 rendered components mount without console errors on PrimeVue and shadcn-vue; keyboard focus opens the WTruncatedText tooltip with `role="tooltip"` and `aria-describedby` on both; WDropdown opens with Enter, focuses the first item, and Escape closes it and returns focus to the activator on both; shadcn-vue tooltips close when the page scrolls (reka-ui behavior, documented). This is not the automated suite. Needed: a versioned browser harness running the section C regressions on three providers × light/dark × LTR/RTL, plus a recorded manual review. |
| R19 | SSR import/render, server-client hydration and concurrent-request/multi-app isolation fixtures | Partial | `renderToString` and concurrent-request isolation: `tests/navigation-ssr.test.ts`, `tests/stacks-ssr.test.ts`, `tests/badge-tooltip-ssr.test.ts`, `tests/accordion-shadcn-ssr.test.ts`, `tests/defaults.test.ts`; packed SSR builds (`scripts/consumer/server.js`). **Not met:** server-to-client hydration in a browser, with warnings captured (section D). |
| R20 | EN/AR breaking migration checklist and external Aware compatibility evidence or explicit blocker | Partial | `docs/guide/migration.md`, `docs/ar/guide/migration.md` (commit `a8e6979`). Missing: external Aware compatibility evidence, or an explicit blocker recorded by the owner. |
| R21 | Capability manifests accurately reflect coverage; unsupported mandatory features block stable adapter status | Met for alpha | `SUPPORTED` in `src/adapters/manifest.ts` matches the renderers in `src/adapters/*`; unsupported rows raise `WAKEB_COMPONENT_UNSUPPORTED`. shadcn stays alpha. |
| R22 | EN/AR VitePress build; Jervis DevOps evidence; archive freshness/trusted deployment receipt verification | Partial | EN/AR `docs:build` inside `npm run check` (reported passing); `scripts/verify-deployment.mjs` compares against the local receipt. **Not met:** no Jervis DevOps pipeline run and no verified publication at wakeb-components.surge.sh for this branch. |
| R23 | Type tests reject provider-native style values; every portable value renders on every provider with expected computed styles; each alias maps correctly and warns once in development only; mapping tables match tested versions | Partial | `tests/vocabulary.test.ts`, `tests/colors.test.ts`; consumer `@ts-expect-error` cases; production bundle check for stripped warnings (commits `d6f7b4f`, `7ab2025`). Missing: browser computed-style checks on every provider. Owner decision (2026-11-04): during the one-major deprecation window, TypeScript accepts the deprecated values the runtime still renders and flags them with `@deprecated` (`WakebDeprecatedColor` on WLoading `color` and WAvatarStack and WUserBadge `avatarColor`; `WakebDeprecatedBadgeType` on badge `type` and WBadgeStack `badgeType`; `WakebDeprecatedVariant` on variants). Strict `WakebColor` and `WakebBadgeType` stay exported unchanged. Consumer cases: the deprecated values compile, and the strict types still reject them with `@ts-expect-error`. |
| R24 | auto/reuse/install on each provider in both install orders; host theme/defaults unchanged after reuse; WAKEB_HOST_PROVIDER_MISSING and WAKEB_INSTALL_CONFLICT triggered; two apps isolated | Met (jsdom) | `tests/plugin.test.ts` on all three projects; shadcn modes in M5-DECISION.md. |
| R25 | EN/AR install, switching and migration pages contain the disclosure and checklist; no "zero changes" claim without it | Met (docs content) | `docs/guide/{installation,switching,migration}.md` and `docs/ar/guide/{installation,switching,migration}.md` (commits `a8e6979`, `ccdf74d`). The published site is not verified (R22). |

Milestone summary at `92f4657`:

| Milestone | Status |
| --- | --- |
| M0 | Fixes landed (`d8c75ad`); the 0.7.x patch release has not been cut (CHANGELOG "Unreleased (0.7.x)"); real-browser regression cases not recorded |
| M1 | Accepted (M1-DECISION.md) |
| M2 | Exit criteria met (M2-PROGRESS.md) |
| M3, M4 | Implemented and passing shared jsdom/SSR suites on Vuetify and PrimeVue; **browser exit evidence missing** |
| M5 | 21/21 in jsdom and SSR; real-browser evidence pending; **not exited** |
| M6 | Docs and migration guides written; release notes drafted (RELEASE-NOTES-DRAFT.md); **Jervis DevOps and publication evidence missing** |

## Provider/component completion grid

A stable release requires every cell to pass shared portable behavior, type/slot/model contracts and applicable browser/SSR checks. Native/shared components still run inside each provider fixture to detect style/integration conflicts.

Cell values at `92f4657`:

- **jsdom+SSR:** the renderer exists, and the shared contract and SSR (`renderToString`) suites pass in jsdom. Real-browser and hydration checks are still pending, so no cell is browser-verified and no cell is stable.
- Every provider now has a renderer for every component; no cell is unsupported.

| Component | Vuetify | PrimeVue | shadcn |
| --- | --- | --- | --- |
| WTruncatedText | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WSegmentedProgress | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WSemiCircleGauge | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WAvatarStack | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WLoading | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WPageSkeleton | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WVerticalSteps | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WButton | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WBadge | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WAccordion | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WBadgeStack | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WUserBadge | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WTooltipBtn | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WTabs | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WTree | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WDropdown | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WCarousel | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WExportDropdown | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WBaseSidebar | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WModal | jsdom+SSR | jsdom+SSR | jsdom+SSR |
| WDrawer | jsdom+SSR (needs `VApp`/`VLayout`; no Escape close; owner decision) | jsdom+SSR | jsdom+SSR |


## Required fixtures

### A. Packed clean-room consumers

Create separate temporary directories/lockfiles for each provider. Install the tarball, Vue, the selected provider peers and fixture build/test tooling only. Do not allow monorepo ancestor node_modules to satisfy absent peer imports. Capture resolved dependencies and resolver paths. Build both WButton-only and all-components consumers; inspect emitted module lists and declarations, not just page text or successful build output.

Assertions:

- No Vue/provider runtime duplicated in Wakeb output.
- No unselected provider in dependency resolution, emitted JS/CSS or portable declarations.
- WButton-only consumer does not import WTree/WCarousel/WModal renderer modules via a registry.
- app.use before mount has no async race; selected styles load through normal documented setup.
- Changing framework literal plus selected dependency and lockfile, restarting/rebuilding, preserves identical template/API fixture source.
- Unsupported static config syntax produces a useful error, not execution of the config or guesses. Cover env expressions, re-exports, imported constants, spreads, duplicates and a missing plugin file.
- A consumer that installs its own themed Vuetify or PrimeVue instance keeps that theme after `app.use(wakeb)`.
- Missing selected peer fails; missing unused peers succeeds; mismatched compiled/runtime selector fails.
- Both minimum and primary tested provider versions satisfy their advertised peer ranges before ranges are published.

### B. Shared contract tests

Run one parameterized contract suite against each adapter, not three unrelated assertions with the same test title. Include:

- Prop/default priority, Vue Boolean prop presence, malformed runtime configuration and no source-object mutation.
- Slots supplied/omitted, reactive payload updates, fallback content and dynamic named tabs.
- Controlled parent updates without change echoes; user updates exactly once; zero/null/empty identifiers.
- Event order for Dropdown and afterLeave timing for overlays.
- Click, disabled/loading, action=submit/reset and native form behavior with/without tooltip.
- Async item replacement, selection clearing, duplicate-key diagnostics and readonly records.
- Icons, overflow menus, custom trigger bindings and native escape-hatch boundaries.
- Every portable style value (R23) and every deprecated alias on every provider, including values a provider lacks natively.
- Every declared baseline prop/slot/event is covered or explicitly linked to a reviewed test group.

### C. Real-browser verification

Use a browser automation harness added and versioned during implementation. Browser bundle compilation is not browser execution. Exercise light/dark × LTR/RTL, keyboard, small/wide viewports, long Arabic/English labels, reduced-motion, focus-visible and Teleport.

Specific regressions:

1. At value=10, WSegmentedProgress fill ratio stays 10% within one CSS pixel of expected content width, accounting for documented gap, with empty/short/long/custom-slot labels.
2. Disabled dropdown anchors are unreachable by normal Tab/arrow navigation and cannot activate with Enter; loading also suppresses actions.
3. Tabs have unique matching tab/panel IDs across multiple instances; arrows/Home/End follow the documented orientation policy.
4. Menu trigger popup type agrees with actual interactive row roles and keyboard behavior.
5. Collapse/remove focused tree descendant restores a surviving treeitem's actual focus; external focus is never stolen.
6. Loading is consistent with tooltip mode, spinner semantics and activation rules; listeners fire once.
7. Secondary button hover/disabled/loading token overrides change computed colors.
8. Circle badge overflow retains geometry/styles outside original ancestor scope.
9. Description-only Modal renders; width and native compatibility precedence follow documentation.
10. Modal/drawer trap focus while open, restore it on close, suppress background interaction and honor persistent without extra duplicate handlers.
11. Carousel pauses and cleans timers/visibility listeners; indicators never submit a host form.
12. Two apps with distinct themes do not contaminate each other's teleported overlays or provider state.

Automated accessibility scans supplement, not replace, keyboard/screen-reader-oriented review. Record browser/version, result and reproducible artifact for failed cases. No numeric accessibility score substitutes for these contracts.

### D. SSR/hydration

Run each selected provider with the same client/server configuration. Render repeated gauge/tabs/accordion/dialog/tree instances and concurrent requests; verify deterministic ID references, no server DOM globals and no cross-request configuration state. Hydrate both initially closed and initially open overlays and assert no hydration warnings/errors. Capture console warnings, focus behavior after hydration and Teleport host cleanup. Test two application roots with independent Wakeb plugins.

### E. Types and public surface

Use actual packed `.d.ts` files with vue-tsc consumer SFCs as well as tsc object assignments. Verify typed component props, emits, dynamic slots and v-model inference, including invalid fixtures marked @ts-expect-error. Omit all unselected provider packages/types. Diff root exports against baseline; ban import('vuetify') in portable declarations. Verify arbitrary misspelled components/default props/framework names are rejected, and source/state objects are readonly where declared.

### F. Docs/release integrity

Retain `npm run check` and extend it with selected-provider checks rather than substituting narrower commands. Future command names must be documented only after implemented.

- Library build/typecheck/unit tests/packed checks/EN+AR docs all pass.
- Standalone docs build from a clean checkout builds a fresh library before packing or fails explicitly; no stale dist download.
- Every tarball export target exists, style paths resolve and archive excludes tests/secrets/app adapters.
- Every documented CSS variable is consumed and every public variable/prop/slot/event is documented in both languages.
- Deployment verification rejects a remote receipt with matching version but wrong commit/assets by comparing an independently expected build manifest.
- Publication remains an explicitly approved operation through the project's specified release process.

## Completion evidence format

For every milestone record commit/archive checksum, provider + exact versions, commands and exit codes, test count, browser/SSR artifacts, bundle module/dependency evidence, documentation build output and remaining limitations. Failed or skipped checks MUST stay visible. Partial provider coverage is alpha, never reported as stable parity.
