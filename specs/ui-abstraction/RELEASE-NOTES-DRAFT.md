# Release notes draft: framework alpha (M2–M6)

> **Status: draft for owner review. Nothing has been published.**
>
> - No npm version, git tag or dist-tag has been created.
> - The documentation has not been published to wakeb-components.surge.sh from this branch.
> - `package.json` is still `0.7.0`.
>
> This draft does not authorize publication (SPEC R20, R22; AGENTS.md).

Source: `feat/m1-selector-packaging` at `92f4657`, covering the commits after M1 (`307d4d4..92f4657`). The user-facing summary is in the `Unreleased (framework alpha)` section of `CHANGELOG.md`; the step-by-step upgrade is in `docs/guide/migration.md` (Arabic: `docs/ar/guide/migration.md`).

## Breaking changes from 0.7

Upgrading needs the migration guide. Root imports alone no longer work.

1. **A plugin file and build integration are required.** Root imports resolve only through `wakebComponents()` from `wakeb-components/vite` and a plugin file that names a literal `framework`. Without the build integration, components throw `WAKEB_BUILD_PLUGIN_MISSING`. See [Plugin file](../../docs/guide/migration.md#plugin-file) and [Vite integration](../../docs/guide/migration.md#vite-integration).
2. **Peer ranges changed.**
   - `vue` is now `^3.5.40`.
   - `vite` is now a required peer.
   - `vuetify`, `primevue` with `@primeuix/themes`, and `reka-ui` are optional peers. Install the one your framework uses.
   - See [Peer dependencies](../../docs/guide/migration.md#peer-dependencies).
3. **Portable variants.** WBadge, WTooltipBtn and WBadgeStack take `soft`, `solid`, `outline` and `ghost`. The 0.7 names still map, with a development-only `WAKEB_DEPRECATED_VALUE`.
4. **Portable colors.** Color props take a Wakeb intent (`primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`) or a CSS color. TypeScript rejects Vuetify color names. At runtime, Vuetify color names still render under Vuetify, with a deprecation warning.
5. **WBadge `type` is painted by Wakeb CSS.** It is no longer forwarded to Vuetify as a chip color.
6. **Skeleton grammar and grid.**
   - WBaseSidebar `skeletonType` and the WPageSkeleton types use the Wakeb grammar: `@N` repetition is capped at 100, and unknown names are skipped with `WAKEB_UNKNOWN_VALUE`.
   - WPageSkeleton rows use a Wakeb 12-column grid with fixed 600, 960 and 1280 px breakpoints, instead of VRow and VCol.
7. **Icons.** Under Vuetify, `$expand`, `$collapse` and the other built-in names render Wakeb SVGs, not the host's Vuetify icon set. To keep custom icons, remap them with `icons.aliases`.
8. **Carousel autoplay is owned by Wakeb on every provider.** It pauses on hover, on focus, while the document is hidden and under reduced motion.
9. **WTabs `customHTML` is deprecated.** It still renders, and logs `WAKEB_DEPRECATED_VALUE` once per app. Use the `tab-label` slot instead; removal is planned for the next major release.

## Features

- **Single-selector providers.** `framework: 'vuetify' | 'primevue' | 'shadcn'` is read statically from the plugin file. Unselected providers are neither installed nor bundled, and tree shaking works per component.
- **PrimeVue 4 adapter for all 21 components.** WTabs, WTree and WCarousel use Wakeb-owned markup; the other components use PrimeVue primitives.
  - PrimeVue WDrawer needs no layout host. It traps focus, closes on Escape and outside click unless `persistent`, and takes `zIndexOverlay`.
  - PrimeVue tooltips open on focus as well as hover.
- **shadcn-vue adapter (alpha) for all 21 components** on the optional `reka-ui` peer (`^2.10.5`). It ships precompiled, namespaced CSS, with no Tailwind setup, no global reset and with third-party notices. The supported components are:
  - WButton, WLoading, WDropdown, WModal
  - WTabs, WTree, WCarousel
  - WSegmentedProgress, WSemiCircleGauge, WVerticalSteps, WPageSkeleton, WAccordion
  - WExportDropdown, WBaseSidebar, WDrawer
  - WTruncatedText, WTooltipBtn, WBadge, WUserBadge, WAvatarStack, WBadgeStack
- **App-scoped plugin options.**
  - `defaults` for each component.
  - Arabic built-in labels.
  - `direction`.
  - `theme` mode and `--wakeb-ui-*` tokens, carried into teleported overlays.
  - `zIndexOverlay`.
  - `icons` (`aliases`, `resolve`).
  - Host provider modes `auto`, `reuse` and `install`.
- **Provider-neutral typed contracts** (`*Emits`, `*Slots`, `WakebComponent`, `WakebFacade`). Every renderer is type-checked against its contract, and packed consumers reject wrong event and slot payloads.
- **`providerProps` escape hatch.** It is nonportable, and Wakeb-owned keys are dropped with `WAKEB_PROVIDER_PROP_IGNORED`.
- **Documentation in English and Arabic:** a migration guide from 0.7, a provider switching guide with the R25 disclosure and checklist, and a provider reference.

## Known limits

- **No real-browser verification has been recorded.**
  - M3–M5 keyboard, focus, positioning and visual parity have no browser evidence.
  - Server-to-client hydration has no browser evidence.
  - All component evidence is jsdom, `renderToString` or packed-consumer builds (ACCEPTANCE.md R18, R19).
- **No Jervis DevOps pipeline run is recorded** for this branch, and the docs are not published from it (ACCEPTANCE.md R22).
- **Vuetify WDrawer** still needs `VApp` or `VLayout` and does not close on Escape. PrimeVue and shadcn-vue do close on Escape.
- **PrimeVue tooltips ignore `zIndexOverlay`**, because PrimeVue sets tooltip z-index globally.
- **WDropdown `colorMap` keys** are open strings.
- **Deprecated Vuetify color names and badge types.** TypeScript rejects them, but the runtime still accepts them under Vuetify.
- **shadcn-vue overlays** write `dir="ltr"` unless Wakeb `direction` is set. The theme bridge assumes Tailwind v4 complete-color variables.
- **`style.css`** still contains every provider's CSS.
- **Error codes.** `WAKEB_CAPABILITY_UNSUPPORTED` is reserved for documented optional features; none is defined in this build.
- **The 0.7.x fixes** (CHANGELOG "Unreleased (0.7.x)") have not been released as a 0.7.x patch, as IMPLEMENTATION.md M0 intended.

## Open owner decisions

Each of these must be decided before a stable release. They can be deferred for an alpha only if this list ships with it.

1. **Vuetify WDrawer.** Either accept the layout-host requirement and the missing Escape close as a documented provider difference, or require parity, which means an internal host and Escape handling.
2. **PrimeVue tooltips and `zIndexOverlay`.** Either document that tooltips ignore it, or set PrimeVue's global tooltip z-index from Wakeb, which affects the whole host app.
3. **WDropdown `colorMap`.** Either keep keys as open strings, or narrow them to `WakebIntent | string` with documented semantics.
4. **Deprecated Vuetify values.** Either keep the type and runtime asymmetry for the deprecation window, or reject the values at runtime too, as a further breaking change.
5. **Release version and dist-tag** (below).
6. **Aware compatibility.** R20 needs external Aware evidence or a recorded blocker.

## Version proposal

Current version: `0.7.0`.

SPEC R20 requires four things:

- a separately versioned prerelease;
- no silent change to the package default while landing an alpha;
- a breaking-change label, never a backwards-compatible patch;
- a stable version that is decided before publication.

**Recommendation: `0.8.0-alpha.0`, published under the `alpha` dist-tag.**

The reasons:

- **The change is breaking.** Under semver 0.x, a minor bump is the conventional breaking release, and a prerelease suffix keeps `^0.7.0` ranges from resolving to it.
- **1.0.0 promises a stable API across providers, and the SPEC definition of done is not met.**
  - No real-browser or hydration suites have run.
  - No Jervis DevOps evidence is recorded.
  - Calling this `1.0.0-alpha.0` would anchor the 1.0 line before the owner decisions above are settled. Any of them could change public types again.
- **The default must stay `0.7.0`.** With the `alpha` dist-tag, `npm install wakeb-components` keeps returning `0.7.0` (R20: do not silently change the package default). `package.json` sets `publishConfig.tag` to `alpha`, so a plain `npm publish` cannot move `latest`; switch it back only for the stable release.
- **Next steps.** Later alphas become `0.8.0-alpha.N`. The stable version, either `0.8.0` or `1.0.0`, is decided once ACCEPTANCE.md has no "not met" rows.

**Alternative: `1.0.0-alpha.0`.** Choose this only if the owner already treats the neutral contracts as the 1.0 API, and accepts that any change from the open decisions means a breaking change inside the 1.0 prerelease line.

The 0.7.x M0 fixes should ship first as `0.7.1` from `main`. Then Vuetify-only users get them without migrating.

## Pre-publication checklist

Every item needs a recorded result (commit, command, exit code, versions, artifact) as ACCEPTANCE.md "Completion evidence format" requires. Nothing below has been done for publication.

- [ ] Parallel shadcn-vue track merged, or explicitly deferred and listed under "Known limits".
- [ ] Owner decisions 1–6 recorded.
- [ ] `package.json` version set to the approved prerelease and the CHANGELOG heading renamed from "Unreleased (framework alpha)". Not done; out of scope for this record.
- [ ] `npm run check` passes from a clean checkout. This covers typecheck, build, Vitest on three projects, `check:package` and the EN/AR `docs:build`.
- [ ] `npm run check:peers` passes all six cells (vuetify, primevue and shadcn × min and current), and `tests/fixtures/peers/results.json` is current.
- [ ] Real-browser matrix (ACCEPTANCE.md section C) on three providers × light/dark × LTR/RTL, with keyboard, focus, Teleport and reduced motion, plus hydration (section D). The browser and version are recorded with the artifacts.
- [ ] A Jervis DevOps pipeline run on the release commit, covering check, check:peers and the browser suite. No GitHub Actions.
- [ ] Documentation published at wakeb-components.surge.sh through Jervis DevOps, and `scripts/verify-deployment.mjs` passes against the local receipt for the same commit.
- [ ] Tarball checksum recorded; contents checked, including `THIRD-PARTY-NOTICES.txt` and no tests or secrets.
- [ ] **Explicit human approval for npm publication**, given separately from documentation publication. The approval names the version and the dist-tag (`npm publish --tag alpha`). Publishing the docs does not authorize an npm release.
