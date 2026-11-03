# Implementation work packages

All paths below are proposed unless already present in the repository. This plan does not authorize dependency updates, code changes, commits or publication as part of writing the specification.

## M0 — Freeze contracts and clear known defects

Dependencies: none.

Deliver:

1. Baseline inventories for props/defaults/types, declared emits/slot signatures, models and attribute targets. `baseline.json` records current types/exports/reference descriptions; expand tests from source declarations before migration.
2. Regression tests and scoped fixes for prior audit findings: inaccurate progress geometry; disabled links; dropdown value-vs-label precedence; tab-panel ARIA; menu roles; tree focus loss; tooltip/native loading discrepancy; teleported circular badge styles; secondary-button cascade and unused documented tokens; modal max-width and description-only handling; docs archive build prerequisite; intended-release deployment verification.
3. Review development advisories separately from production dependencies. Update through tested compatible versions; no blind audit-fix.
4. Compatibility exceptions documented and intentional, including what remains Vuetify-native.
5. R23 style-value inventory frozen from source: every accepted WButton `type`/`size`, WBadge `type`, WTabs `styleType` and color-prop value, with the portable value or deprecated alias for each.

M0 defect fixes ship as 0.7.x patch releases on the current Vuetify-only package. They do not wait for M1 and do not introduce framework APIs.

Exit: current `npm run check` passes, real-browser regression cases pass, Git diff contains no unrelated changes. Existing successful tests are not replaced with tests that merely assert a bug.

## M1 — Prove single-selector packaging before broad migration

Dependencies: frozen public contract; defect fixes may proceed independently where non-overlapping.

Highest-risk deliverables:

- `wakeb-components/vite` integration parses a direct literal framework in the consumer plugin file without evaluating its imports or option expressions.
- Published resolver stub + selected per-component renderer entry mapping work from an npm tarball, not just workspace source.
- PrimeVue-only fixture contains no Vuetify install; Vuetify-only fixture contains no PrimeVue install; unused providers neither resolve nor appear in emitted JS/CSS/declarations.
- Services do not import an eager renderer map. Compare a WButton-only consumer with an all-components consumer through bundle module metadata, not only compressed-size guesses.
- Synchronous `createWakebComponents`/app.use works on both SSR and client graphs; no async startup race.
- Missing plugin/peer/mismatched framework diagnostics are deliberate and actionable.
- Static selector parsing covers JS and TS plugin files, `configFile` in a monorepo package, and each rejected pattern (env expression, re-export, imported constant, spread, duplicate) with its documented error.
- Host-instance detection (R24): `auto`/`reuse`/`install` on Vuetify and PrimeVue, both install orders, two apps on one page, and proof that reusing a host instance leaves its theme and defaults unchanged.
- Draft R23 mapping tables for WButton and WDropdown activator on both providers, verified against the locked provider versions.
- WButton, WDropdown and WModal run the same Vue usage and the same behavior/slot/model contract tests under Vuetify and PrimeVue.

Deliver an architecture decision with exact exported paths, tested peer versions, byte/module evidence, startup/SSR behavior and any deviation from SPEC.md. Do not proceed with all adapters if optional-peer resolution or tree shaking is unresolved.

Exit: two packed isolated consumers pass; root typecheck succeeds without the other provider; same fixture source hashes except plugin/dependency/lockfile selection. This is technical feasibility, not full framework completion.

## M2 — Core, defaults and neutral design contracts

Dependencies: M1.

Deliver:

- App-scoped injection keys/context, error codes, typed options/default filtering, conflict detection and capabilities.
- R23 portable vocabulary types, alias normalization shared by all adapters, and `WAKEB_DEPRECATED_VALUE` development warnings removed from production output.
- Provider-neutral public props/emits/slots/models/icons. Compile-time rejection tests for unknown framework, wrong defaults, event/slot payloads and foreign provider options.
- Explicit attrs/listener routing and providerProps precedence for each adapter-backed facade.
- Localized built-in UI strings; theme/direction context; stable semantic tokens and overlay scope propagation.
- Layer-boundary checks prohibiting provider imports from contracts/core/native components.
- Optional peer metadata and supported version matrix from working locked fixtures.

Exit: independent app/SSR-request isolation tests, precedence tests including undefined/false/zero/null, no provider types in portable declarations, no unintended default global registration.

## M3 — Migrate native components and shared compositions

Dependencies: M2.

Batch A: WSegmentedProgress, WSemiCircleGauge, WVerticalSteps, WLoading, WPageSkeleton.

Batch B: WTruncatedText, WAvatarStack, WBadge, WAccordion, WBadgeStack, WUserBadge, WTooltipBtn.

Deliver:

- One shared implementation for neutral normalization/behavior; provider primitive interfaces where needed.
- Preserve existing slot payloads/default contracts and documented compatibility exceptions.
- Wakeb-owned responsive skeleton grid/grammar and built-in indicator/icon implementations.
- Real-browser visual/geometry/teleport tests with Arabic, long labels, empty data and reduced-motion.

Exit: migrated components pass shared contract tests on both proven providers; no duplicated business logic or provider-specific source imports in shared compositions.

## M4 — Navigation, overlays and remaining compositions

Dependencies: M2, composition prerequisites from M3; WButton/WDropdown/WModal build on M1 rather than fork it.

Components: WButton, WTabs, WTree, WDropdown, WCarousel, WExportDropdown, WBaseSidebar, WModal, WDrawer.

Deliver:

- Exact declared event/slot/model signatures and event-order assertions.
- Controlled state synchronization, item updates, null/zero keys, readonly data safety and no duplicate emissions.
- Complete keyboard/focus/menu/tab/tree contracts, dialog/drawer focus management and internal provider host feasibility.
- Carousel lifecycle/visibility/reduced-motion policy.
- Configurable native escape hatch with explicit nonportable documentation; no accidental native-event leakage.

Exit: all baseline exports supported by Vuetify and PrimeVue; shared browser/SSR suites pass on both. External Aware compatibility is separately evidenced, not assumed.

## M5 — shadcn-vue adapter and styles

Dependencies: M1 packaging mechanism, M2 contracts; may implement primitives alongside M3/M4 once interfaces stabilize.

Deliver:

- Owned adapter source with upstream licenses and tested primitive dependency/version selections.
- Precompiled scoped CSS, no host Tailwind pipeline or copied consumer files, no global Preflight leakage.
- Full implementation/explicit conforming native composition for every public component.
- Same contract, accessibility, SSR/hydration and isolation suites. Test dynamic classes survive compilation.

Exit: shadcn-only packed fixture succeeds with Vuetify/PrimeVue absent; all required component rows supported. Until then advertise shadcn as alpha/incomplete, not stable interchangeable support.

## M6 — Documentation, migration and release validation

Dependencies: M3–M5 and audit/release integrity fixes.

Deliver:

- EN/AR installation and examples with the agreed literal-selector API and required one-time build integration.
- Per-component contracts/tokens/ARIA/limits, provider matrix, SSR instructions, native escape-hatch warnings and old-to-new migration guide.
- Final R23 mapping tables per adapter, deprecated-alias table, R24 host-instance guide and the R25 switching guide with its checklist.
- npm pack artifact checks and selected-provider isolated consumer suites from the actual archive.
- Jervis DevOps quality gate extension, trusted local build receipt comparison and documentation downloadable archive freshness.
- Breaking-release/prerelease version proposal and release notes. No automatic publication.

Exit: ACCEPTANCE.md matrix complete with links to logs/artifacts. Explicit human approval remains required for npm publication.

## Work-item template

Each component/adapter implementation card must specify:

- Requirement IDs and baseline contract entries affected.
- Target files and provider primitives (verified against installed library/version, not guessed imports).
- Tests written first for shared behavior and provider-specific mapping.
- Type/slot/model/attrs examples and compatibility exceptions.
- Browser/a11y/SSR evidence and selected-provider bundle results.
- EN/AR reference updates.
- Rollback/prerelease impact and no-publication constraint.

Avoid parallel workers editing the same public contracts, package manifest, shared renderer resolver or generated references without an owner coordinating their changes.

## Principal risks / resolution gates

| Risk | Resolution gate |
| --- | --- |
| String selector still resolves missing optional providers | M1 packed clean-room installs; fail architecture before expansion |
| Renderer registry defeats tree shaking | Per-component graph inspection, WButton-only vs full fixture |
| Vue Boolean/default coercion masks plugin defaults | Explicit-prop-presence tests before provider render |
| Native types/props leak into neutral contract | Declaration fixture without unselected peers; native mapping inventory |
| Provider requires app-wide layout host | Prove internal host with WDrawer; explicit spec amendment if impossible |
| Copied shadcn/Tailwind CSS changes host application | Scoped CSS/no-reset tests and license/dependency review |
| Slots/ARIA/focus differ despite matching prop names | Shared browser interaction suite, manual accessibility review |
| SSR singleton state or IDs cross requests | Concurrent render/hydration and multi-app isolation fixtures |
| Scope expands into forms/business framework | First release remains existing exports; new components need separate specs |
| AST selector breaks in real consumer setups | Documented syntax, fixtures per rejected pattern, actionable errors; revisit the owner decision only with fixture evidence |
| Host provider cannot be detected reliably | Prove per provider in M1; documented install order or `mode: 'install'` fallback |
| Provider lacks a Wakeb style value | Compose with Wakeb token CSS; computed-style tests per provider (R23) |
| Users expect switching to migrate the whole app | R25 disclosure in install, switching and migration guides |
