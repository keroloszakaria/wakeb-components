# Changelog

## 0.8.0-alpha.0 (unreleased framework prerelease)

Breaking: root imports now need a plugin file and `wakebComponents()` from `wakeb-components/vite`. Stay on 0.7.x for Vuetify-only use without build integration.

- Add `createWakebComponents({ framework })`, the `wakeb-components/vite` build integration, typed `WakebError` codes and `capabilities` metadata.
- The build integration reads the framework statically from the plugin file and bundles only the selected provider's renderers. Unsupported syntax fails with an actionable error.
- Host provider modes `auto`, `reuse` and `install` reuse the app's Vuetify or PrimeVue instance without changing its theme or defaults.
- PrimeVue 4 alpha adapter, first for WButton, WDropdown, WModal and WLoading (now all 21 components; see below).
- `SharedIcon` no longer references Vuetify types.
- Plugin `defaults` per component, with explicit props winning and data, model and callback props rejected.
- `locale: 'ar'` built-in labels, `direction`, and `theme` with `mode` and `--wakeb-ui-*` tokens scoped to each app and its overlays.
- Breaking: WBadge, WTooltipBtn and WBadgeStack variants use the portable `soft`, `solid`, `outline` and `ghost` values. Baseline names keep working with a `WAKEB_DEPRECATED_VALUE` development warning; `elevated` loses its elevation and `plain` its faded look.
- Breaking: color props take a Wakeb intent or a CSS color (`WakebColor`). Intents resolve through `--wakeb-ui-*` tokens and then the provider theme, so an unconfigured Vuetify app keeps its colors. On WLoading `color` and WAvatarStack and WUserBadge `avatarColor`, Vuetify color names still render under Vuetify with a `WAKEB_DEPRECATED_VALUE` warning, and TypeScript still accepts them through the `@deprecated` type `WakebDeprecatedColor`. The other color props take only `WakebColor`.
- Breaking: WBadge `type` is painted by Wakeb CSS only and no longer sent to Vuetify as a chip color; `solid` fills with the type color. Types outside the Wakeb list still type-check through the `@deprecated` type `WakebDeprecatedBadgeType`, and Vuetify still receives them as the chip color with `WAKEB_DEPRECATED_VALUE`. New intent theme tokens and the `--wakeb-avatar-text`, `--wakeb-badge-solid-bg` and `--wakeb-badge-solid-text` variables.
- Breaking: WBaseSidebar `skeletonType` and WPageSkeleton types follow the Wakeb skeleton grammar. Repetitions are capped at 100 and unknown names are skipped with `WAKEB_UNKNOWN_VALUE`.
- Breaking: WPageSkeleton rows use a Wakeb 12-column grid with fixed breakpoints (sm 600px, md 960px, lg 1280px) instead of Vuetify VRow and VCol, so provider breakpoint settings no longer change the layout.
- The theme scope and `zIndexOverlay` now reach every teleported overlay: the WButton, WTooltipBtn, WTruncatedText and WAvatarStack tooltips, the WAvatarStack and WBadgeStack overflow menus, and the WExportDropdown menu. `menuStyle` and `tooltipStyle` still win.
- Wakeb-owned icons: the `icons` plugin option (`aliases` and `resolve`) per app, built-in SVGs for chevrons, close, loading, complete and checkbox and radio toggles, and a fallback box with the `WAKEB_ICON_UNRESOLVED` development warning outside Vuetify. Under Vuetify, other names still render through `VIcon`, but `$expand` and `$collapse` now use the Wakeb SVG.
- A nonportable `providerProps` escape hatch on WButton, WDropdown, WModal and WLoading passes native props to the selected provider's primitive. Wakeb-owned keys are dropped with the `WAKEB_PROVIDER_PROP_IGNORED` development warning. Every component page documents its attribute target, and WLoading now keeps its `role="status"` and accessible name.
- Breaking: the `vue` peer range is now `^3.5.40`, because the generated declarations need it, and `vite` is a required peer. `npm run check:peers` runs the locked peer version matrix; see Supported versions in the installation guide.
- Public component types come from provider-neutral contracts (`*Emits`, `*Slots`, `WakebComponent`, `WakebFacade`). Every renderer is type-checked against its contract, and packed consumers reject wrong event and slot payloads under `tsc --strict` and `vue-tsc`.
- PrimeVue renderers for all 21 components. WTabs, WTree and WCarousel use Wakeb-owned markup; the others use PrimeVue primitives. Shared behavior lives in provider-neutral composables, and one contract and SSR suite runs on every provider.
- PrimeVue WDrawer needs no layout host: it traps focus, closes on Escape and outside click unless `persistent`, locks scrolling, returns focus to its opener and takes `zIndexOverlay`.
- Fix: on every provider, Escape inside a dialog or menu opened from WDrawer closes only that overlay; the next Escape closes the drawer. PrimeVue's Drawer closed both on one key press, and the Vuetify drawer did too when focus had fallen back to the body.
- Breaking: Vuetify WDrawer needs no `VApp` or `VLayout`; it renders a Wakeb-owned `VLayout` host teleported to Vuetify's overlay container and never shifts the app layout. It is now a modal `<div role="dialog" aria-modal="true">` (was `<nav>`) that closes on Escape unless `persistent`, locks body scrolling, moves focus in and back to its opener, keeps a transparent scrim for `transparentOverlay` and stacks at `zIndexOverlay` (default 2000).
- PrimeVue tooltips, including WButton's, open on keyboard focus as well as hover and are linked through `aria-describedby`.
- The PrimeVue tooltips of WButton, WTooltipBtn, WTruncatedText and WAvatarStack take `zIndexOverlay` in place of PrimeVue's tooltip z-index, and keep a global `pt.directives.tooltip.root` style instead of replacing it. `tooltipStyle` still wins; without `zIndexOverlay` nothing is added.
- Alpha shadcn-vue provider (`framework: 'shadcn'`) for all 21 components on the optional `reka-ui` peer (`^2.10.5`): shadcn-vue primitives where they keep the contract, and Wakeb-owned markup for tabs, tree, carousel, progress, gauge, steps and badges. It ships precompiled, namespaced CSS with no Tailwind setup or global reset, plus third-party notices. The peer matrix gains shadcn-vue cells.
- Breaking: WCarousel autoplay is owned by Wakeb on every provider. It pauses on hover, on focus, while the document is hidden and under reduced motion, and cleans up on unmount.
- A titled WAccordion panel is a named `region`.
- WTabs item `customHTML` is deprecated: it still renders and logs `WAKEB_DEPRECATED_VALUE` once per app. Use the `tab-label` slot.
- Docs: a migration guide from 0.7 with a checklist, a provider switching guide (including what switching does not cover and the host provider modes), and the switching disclosure on the installation page.

## Unreleased (0.7.x)

- Fix WSegmentedProgress so the fill ratio ignores label width.
- WDropdown: exact values win over label fallbacks, replaced records refresh the label, `null` clears the selection, rows use menu roles and disabled link rows lose their `href`.
- Add menu roles to WExportDropdown. Informational overflow lists in WAvatarStack and WBadgeStack are no longer announced as menus, and circle icon styles reach the teleported list.
- Link WTabs tabs and panels with unique IDs; WTree restores focus to a visible row when the focused row disappears.
- WButton loading suppresses clicks and native submit in both modes; secondary state tokens and the documented secondary background/color variables now apply.
- WModal renders description-only headers and honors a native `max-width` when `width` is absent.
- The docs build packs a freshly built library and checks that documented CSS variables are consumed; deployment verification compares against the local build receipt and commit.
- Update Vite to 6.4.5.

## 0.7.0

WModal and WDrawer add reusable dialog/drawer shells with explicit loading, close controls, slots and CSS variables. Aware keeps AddEditModal, GenericForm, schemas, validation, permissions, header SVG and theme aliases. Native Dialog Escape/focus/scroll behavior and native Drawer semantics are preserved.

## 0.6.0

- Add typed WCarousel, WExportDropdown and WBaseSidebar with playback/indicator controls, configurable export records and form-independent sidebar slots.
- Keep Aware permissions, GenericForm schemas, translations, SvgIcon names, gradient tokens and inverted carousel indicator semantics in adapters.
- Verify actual Vuetify cycling/menu/skeleton behavior, compatibility adapters and bilingual interactive documentation.

## 0.5.0

- Add typed WTabs, WTree and WDropdown with named panels, recursive slots and host-owned translation/router integration.
- Preserve Aware selection synchronization, tree connector/edit state, SvgIcon rendering and dropdown event ordering through compatibility adapters.
- Add controlled-tree keyboard navigation, Vuetify interaction tests, packed SSR/browser consumers and bilingual live examples.

## 0.4.0

- Add typed WBadgeStack, WUserBadge and WTooltipBtn with image/avatar/icon slots and explicit host translation.
- Preserve Aware badge item overrides, overflow styling, themed detection icons, user initials/actions and legacy tooltip attrs through adapters.
- Add real Vuetify overflow, tooltip, avatar and compatibility checks plus bilingual interactive reference pages.

## 0.3.0

Added WButton, WBadge and WAccordion with Aware compatibility adapters, native attributes, icon slots, button loading aliases, persistent disclosure content and keyboard-ready default headers.

## 0.2.0

Added WAvatarStack, WLoading, WPageSkeleton and WVerticalSteps. Typed data models, local overlay styles and icon slots keep applications independent. Existing 0.1 APIs are preserved.

## 0.1.1

Published the first three components to npm. Install `wakeb-components@0.1.1`.

## 0.1.0

Three display primitives, typed props and slots, independent style variables, Vue/Vuetify peers and packed browser/SSR verification.
