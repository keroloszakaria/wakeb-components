# Changelog

## Unreleased (framework alpha)

Breaking: root imports now need a plugin file and `wakebComponents()` from `wakeb-components/vite`. Stay on 0.7.x for Vuetify-only use without build integration.

- Add `createWakebComponents({ framework })`, the `wakeb-components/vite` build integration, typed `WakebError` codes and `capabilities` metadata.
- The build integration reads the framework statically from the plugin file and bundles only the selected provider's renderers. Unsupported syntax fails with an actionable error.
- Host provider modes `auto`, `reuse` and `install` reuse the app's Vuetify or PrimeVue instance without changing its theme or defaults.
- PrimeVue 4 alpha adapter for WButton, WDropdown, WModal and WLoading; the other components report `WAKEB_COMPONENT_UNSUPPORTED`.
- `SharedIcon` no longer references Vuetify types.

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
