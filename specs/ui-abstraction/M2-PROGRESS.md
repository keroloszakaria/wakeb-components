# M2 progress: core, defaults and design contracts

Status: in progress on `feat/m1-selector-packaging`, after M1 (`307d4d4`). This record lists what has landed against the IMPLEMENTATION.md M2 deliverables, how it was verified, and what remains. It does not authorize publication.

## Landed

| Deliverable | Implementation | Evidence |
| --- | --- | --- |
| Typed defaults (R05, R06) | `WakebDefaults` maps each public component to `Partial` props, excluding data/model props (the R06 list plus `menuItems` and `formats`) and callback props. `validateDefaults` rejects them at runtime with `WAKEB_CONFIG_INVALID`, as well as listeners, unknown components and `undefined` values. | `tests/defaults.test.ts`; `@ts-expect-error` cases in `scripts/consumer/consumer.ts`, checked by `tsc --strict` in both packed consumers |
| Precedence including undefined, false, zero, empty and null | `defineWakebFacade` wraps each selected renderer. The wrapper redeclares the renderer's props with `default: undefined`. Vue then reports exactly what the caller passed and does not invent `false` through Boolean casting. Resolution order: explicit value, plugin default, localized string, renderer default. Per-instance copies of object defaults; the source config is detached at creation. | Precedence, casting, undefined-as-absent and copy tests on both providers |
| Localized built-in strings (R05) | `LOCALE_DEFAULTS.ar` covers every built-in English label prop on the 21 components. | Arabic WLoading and WModal names on both providers |
| Theme and direction context; overlay scope (R05, R17, R19) | `theme.mode`, validated `theme.tokens` mapped to `--wakeb-ui-*`, and `direction`. Together they form a frozen per-app scope (`style`, `data-wakeb-theme`, `dir`). The scope is merged before caller attrs on every facade root, and bound on WDropdown menu content. WModal content already receives it through its attrs. `zIndexOverlay` maps to provider overlay stacking. Nothing is added when nothing is configured. | Root, teleported-menu, caller-precedence, two-app isolation and malformed-token tests; browser check on the packed PrimeVue consumer (dark, `rtl`, Arabic, z-index 3000) |
| Stable semantic tokens (R17) | WButton, WDropdown and WModal consume the tokens through existing component-variable fallback chains. Component variables still win. Dark-mode values live in `src/styles/tokens.css`. | `npm run check` docs token scan; browser computed styles |
| Development warnings (R07) | `warnOnce` reports once per app and key. The call sites must sit behind `process.env.NODE_ENV !== "production"`. | Unit test |
| R23 variant vocabulary | `WakebVariant` (`soft`, `solid`, `outline`, `ghost`) and `WakebDeprecatedVariant` are public types. `useVariant` is the one shared normalizer: it maps baseline aliases, reports `WAKEB_DEPRECATED_VALUE` and falls back to the component default with `WAKEB_UNKNOWN_VALUE`. It is wired into WBadge `variant`, WTooltipBtn `variant`, and WBadgeStack `badgeVariant` and item `variant`. Vuetify rendering goes through the draft `VUETIFY_VARIANTS` table. | `tests/vocabulary.test.ts`. `npm run check` asserts the Vuetify production bundle contains WBadge but no warning text. A browser check on the Vuetify dev server showed each warning once. |
| R23 intents and color props | `WakebIntent` and `WakebColor` (intent or CSS color syntax) are public types. `useColor` resolves an intent to `var(--wakeb-ui-<intent>, <provider bridge or Wakeb fallback>)`; the Vuetify bridge reads `--v-theme-*`, so unconfigured Vuetify apps keep their colors. Vuetify names stay renderable under Vuetify with `WAKEB_DEPRECATED_VALUE`; other providers fall back with `WAKEB_UNKNOWN_VALUE`. Applied to WLoading `color` (both providers), WAvatarStack and WUserBadge `avatarColor`, WSegmentedProgress `color`, WBadge and WBadgeStack `dotColor`, WBadgeStack item `color`, and WAccordion `iconColor`. WBadge `type` is `WakebBadgeType`, painted by Wakeb CSS only. It is no longer sent to Vuetify as a color, except for non-Wakeb values during the deprecation window. Intent theme tokens are added. | `tests/colors.test.ts` (WLoading on both providers). `@ts-expect-error` cases for `error`, `red-darken-2` and badge type `teal` in both packed consumers. |
| R16 skeleton grammar | `useSkeleton` accepts the 16 portable names, comma sequences and `@N` capped at 100, with `text` as the default. Unknown or malformed parts are skipped with `WAKEB_UNKNOWN_VALUE`. Other Vuetify 3.13 names render under Vuetify with `WAKEB_DEPRECATED_VALUE`. Applied to WBaseSidebar `skeletonType` and WPageSkeleton item and header `type`. Grid breakpoints are not part of this step. | `tests/colors.test.ts` |
| SSR request isolation (R19) | No new code; contexts were already per app. | Concurrent `renderToString` requests with different defaults, locale and theme on both providers |
| Layer boundaries (R08, R10) | `tests/layers.test.ts` scans imports. Core, composables, icons, styles, build, types and the root never import a provider, and each adapter imports only its own provider. | Test |

Suite: 355 tests in two Vitest projects, with 7 skipped where a case applies to one provider only. `npm run check` passes, including both packed consumers. Full bundles have 171 modules on Vuetify and 179 on PrimeVue; PrimeVue WLoading now uses the vocabulary module. WButton-only bundles have 95 and 139 and still contain no dialog or menu modules.

## Decisions taken during M2

- **Wrapper rather than per-renderer resolution.** One wrapper gives all 21 components plugin defaults and localized strings without rewriting their templates. It re-emits declared events, so `emitted()`, devtools and caller listeners see one emission. It is named after the component. As a result, name-based lookups in test utilities match both the wrapper and the renderer; this is documented.
- **`direction` writes `dir` only when configured.** The default stays `ltr` in the context, but no `dir` attribute is written. An Arabic host page that sets `<html dir="rtl">` would otherwise be forced back to LTR.
- **`icons` fails with `WAKEB_CAPABILITY_UNSUPPORTED`** until the resolver lands, rather than being silently ignored.
- **Internal compositions do not pick up plugin defaults.** The close button inside WModal is one example. They pass explicit props.

## Remaining for M2 exit

1. **R23 and R16 follow-ups.**
   - The variant and intent mapping tables become final once the visual contract tests exist (M3).
   - R16 grid breakpoints (sm 600, md 960, lg 1280) still follow Vuetify.
   - WDropdown `colorMap` keys remain open strings.
2. **Neutral contract declarations.** Facade types still come from the Vuetify renderer declarations, though those declarations no longer reference Vuetify types. Separate contract files and compile-time tests for event and slot payloads are still to do.
3. **`providerProps` and attribute routing.** Add the escape hatch with selected-provider validation. Document the attribute target of each facade.
4. **Icons resolver (R15).** Add the name resolver, a deterministic fallback and a development diagnostic.
5. **Overlay scope everywhere.** Extend scope to tooltips, the WAvatarStack and WBadgeStack menus, and WDrawer as those components migrate (M3/M4).
6. **Peer version matrix.** Test the minimum versions of each advertised peer range in locked fixtures.
