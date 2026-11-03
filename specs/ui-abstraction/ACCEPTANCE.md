# Acceptance and verification matrix

Status: specification acceptance plan, **not completed implementation tests**. Every unchecked requirement below is future work. The current repository quality gate is only a baseline.

## Traceability

| ID | Acceptance evidence required |
| --- | --- |
| R01 | Same consumer Vue source imports root W* exports under each provider; all baseline exports exist |
| R02 | Literal framework union; selection only in plugin file; restart/rebuild switching tested |
| R03 | Dependency/import boundary scan; no business/store/router/i18n-instance/application-token coupling |
| R04 | Clean installation, dev startup and production build using exactly the documented plugin/main/Vite flow |
| R05 | Published declaration consumers with valid/invalid options, defaults and provider branches; synchronous Plugin install |
| R06 | Defaults precedence and mutation isolation tests for absent/undefined/false/zero/empty/null inputs |
| R07 | Each stable error code triggered intentionally with actionable safe message and no silent fallback |
| R08 | Architecture scan; compositions reuse neutral primitives; no duplicate focus/keyboard behavior |
| R09 | Actual packed consumer build module graph proves absent/unselected provider isolation and tree shaking |
| R10 | Archive export-target existence, CSS/JS/declaration entry resolution, mandatory/optional peer validation |
| R11 | shadcn-only consumer without Tailwind config/source copying; scoped styles and licenses verified |
| R12 | Baseline-to-current API diff, signature snapshots and full component/provider contract coverage |
| R13 | Exact event payload/order/count, model synchronization, item changes/clear state, disabled behavior |
| R14 | Slot inference/runtime payloads, attrs targets, class/style merge and exactly-once native handlers |
| R15 | Built-in icons/resolver/slots on every provider; neutral root declarations without Vuetify types |
| R16 | Skeleton grammar/repetition/grid fixtures; customHTML trusted-only documentation and escaped normal text |
| R17 | Token extraction/docs coverage and computed-state colors; dark/RTL/Teleport/multi-app checks |
| R18 | Automated browser semantics and keyboard/focus suites plus targeted manual accessibility review |
| R19 | SSR import/render, server-client hydration and concurrent-request/multi-app isolation fixtures |
| R20 | EN/AR breaking migration checklist and external Aware compatibility evidence or explicit blocker |
| R21 | Capability manifests accurately reflect coverage; unsupported mandatory features block stable adapter status |
| R22 | EN/AR VitePress build; Jervis DevOps evidence; archive freshness/trusted deployment receipt verification |
| R23 | Type tests reject provider-native style values; every portable value renders on every provider with expected computed styles; each alias maps correctly and warns once in development only; mapping tables match tested versions |
| R24 | auto/reuse/install on each provider in both install orders; host theme/defaults unchanged after reuse; WAKEB_HOST_PROVIDER_MISSING and WAKEB_INSTALL_CONFLICT triggered; two apps isolated |
| R25 | EN/AR install, switching and migration pages contain the disclosure and checklist; no "zero changes" claim without it |

## Provider/component completion grid

`Pending` means not implemented/verified by this specification. A stable release requires every cell to pass shared portable behavior, type/slot/model contracts and applicable browser/SSR checks. Native/shared components still run inside each provider fixture to detect style/integration conflicts.

| Component | Vuetify | PrimeVue | shadcn |
| --- | --- | --- | --- |
| WTruncatedText | Pending | Pending | Pending |
| WSegmentedProgress | Pending | Pending | Pending |
| WSemiCircleGauge | Pending | Pending | Pending |
| WAvatarStack | Pending | Pending | Pending |
| WLoading | Pending | Pending | Pending |
| WPageSkeleton | Pending | Pending | Pending |
| WVerticalSteps | Pending | Pending | Pending |
| WButton | Pending | Pending | Pending |
| WBadge | Pending | Pending | Pending |
| WAccordion | Pending | Pending | Pending |
| WBadgeStack | Pending | Pending | Pending |
| WUserBadge | Pending | Pending | Pending |
| WTooltipBtn | Pending | Pending | Pending |
| WTabs | Pending | Pending | Pending |
| WTree | Pending | Pending | Pending |
| WDropdown | Pending | Pending | Pending |
| WCarousel | Pending | Pending | Pending |
| WExportDropdown | Pending | Pending | Pending |
| WBaseSidebar | Pending | Pending | Pending |
| WModal | Pending | Pending | Pending |
| WDrawer | Pending | Pending | Pending |

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
