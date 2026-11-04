# Changelog

## 0.8.0-alpha.0 (unreleased framework prerelease)

- Breaking: root imports need a plugin file and `wakebComponents()` from `wakeb-components/vite`.
- Add `createWakebComponents`, static provider selection, host provider reuse modes, `WakebError` codes and a PrimeVue 4 alpha adapter for WButton, WDropdown, WModal and WLoading.
- Add plugin `defaults`, Arabic built-in labels, `direction`, and `theme` mode and `--wakeb-ui-*` tokens scoped per app and overlay.
- Breaking: portable WBadge, WTooltipBtn and WBadgeStack variants (`soft`, `solid`, `outline`, `ghost`); baseline names map to them with a `WAKEB_DEPRECATED_VALUE` development warning stripped from production builds.
- Breaking: color props take a Wakeb intent (`primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`) or a CSS color (`WakebColor`); intents resolve through `--wakeb-ui-*` tokens, then the provider theme. On WLoading `color` and WAvatarStack and WUserBadge `avatarColor`, Vuetify color names still render under Vuetify with `WAKEB_DEPRECATED_VALUE` and still type-check through the `@deprecated` type `WakebDeprecatedColor`; the other color props take only `WakebColor`.
- Breaking: WBadge `type` is no longer forwarded to Vuetify as a chip color; Wakeb CSS paints it, and `solid` fills with the type color. Other types still type-check through the `@deprecated` type `WakebDeprecatedBadgeType` and render under Vuetify as the chip color with `WAKEB_DEPRECATED_VALUE`. Add intent theme tokens and `--wakeb-avatar-text`, `--wakeb-badge-solid-bg` and `--wakeb-badge-solid-text`.
- Breaking: WBaseSidebar `skeletonType` and WPageSkeleton types use the Wakeb skeleton grammar with `@N` repetitions capped at 100; unknown names are skipped with `WAKEB_UNKNOWN_VALUE`.
- Breaking: WPageSkeleton rows use a Wakeb 12-column grid (`wakeb-grid-row`, `wakeb-grid-col`) with fixed sm 600px, md 960px and lg 1280px breakpoints instead of Vuetify VRow/VCol.
- Theme scope and `zIndexOverlay` reach every teleported overlay: the WButton, WTooltipBtn, WTruncatedText and WAvatarStack tooltips, the WAvatarStack and WBadgeStack menus and the WExportDropdown menu. `menuStyle` and `tooltipStyle` still win.
- Add Wakeb-owned icons: the `icons` option (`aliases`, `resolve`) per app, built-in SVGs for chevrons, close, loading, complete and toggles, and a fallback box with `WAKEB_ICON_UNRESOLVED` outside Vuetify. Under Vuetify, `$expand` and `$collapse` now render the Wakeb SVG instead of the host's Vuetify icon set.
- Add a nonportable `providerProps` escape hatch to WButton, WDropdown, WModal and WLoading; Wakeb-owned keys are dropped with `WAKEB_PROVIDER_PROP_IGNORED`. Document the attribute target of all 21 components; WLoading keeps its `role="status"` and accessible name.
- Breaking: the `vue` peer range is `^3.5.40` (the emitted declarations need it) and `vite` is a required peer. `npm run check:peers` runs the locked peer version matrix.
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

- Fix progress geometry, dropdown value precedence, null clearing and item refresh, disabled link navigation, menu roles, tab-panel ARIA, tree focus recovery, button loading activation, teleported circle badge styles, secondary button tokens and modal description/width handling.
- The docs build packs a fresh library and checks documented CSS variables; deployment verification compares against the trusted local receipt.
- Update Vite to 6.4.5.

## 0.7.0

- Add WModal and WDrawer with typed models, header/content/action/loading slots and namespaced CSS variables.
- Retain native Vuetify overlay behavior and explicit Aware compatibility adapters; AddEditModal, forms and permissions remain in the application.
- Add standalone and host integration checks and bilingual interactive documentation.

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

- Extract WButton, WBadge and WAccordion with typed props, events and icon slots.
- Preserve Aware layout, icon rendering, loading attributes, click propagation and persistent form content through adapters.
- Add standalone semantic styles, accessible default title triggers and bilingual interactive documentation.

## 0.2.0

- Add typed avatar stacks, loading indicators, responsive page skeletons and vertical steps.
- Keep app colors and icons in compatibility adapters; add keyboard overflow controls and translated status labels.
- Publish npm installation docs, data models and live examples in English and Arabic.

## v0.1.1 - 2026-10-28

- fix: enable Vuetify SSR hydration in documentation and consumer
- feat: extract typed display components with bilingual VitePress docs
- Initial commit


## 0.1.0

- First extraction: text truncation, segmented progress and semicircle gauge.
- Typed Vue APIs, Vuetify tooltip integration, RTL and namespaced style customization.
