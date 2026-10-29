# Migration from Aware

The first extraction keeps the existing application paths as thin adapters:

| Existing path | Shared component |
| --- | --- |
| `components/common/TruncatedText.vue` | `WTruncatedText` |
| `components/common/SegmentedProgress.vue` | `WSegmentedProgress` |
| `components/common/SemiCircleGauge.vue` | `WSemiCircleGauge` |
| `components/common/AvatarStack.vue` | `WAvatarStack` |
| `components/common/Loading.vue` | `WLoading` |
| `components/common/PageSkeleton.vue` | `WPageSkeleton` |
| `components/common/VerticalSteps.vue` | `WVerticalSteps` |

Adapters map Aware tokens to namespaced variables and keep the old prop defaults.
Existing screens do not need to change imports. New applications import named
components directly from `wakeb-components` and choose their own colors.

Numeric percentage normalization, text truncation and valid-size geometry stay
the same. The shared gauge also guards invalid sizes/thickness values; the
shared text component composes listener handlers with Vuetify for keyboard access.
These are documented defensive changes, not business-rule changes.

Forms, tables, layouts, permissions, data loading and theme
configuration remain in Aware. The next extraction should be chosen after its
own dependency and public-API review.


The 0.2 extraction adds defensive boundaries: avatar max and skeleton repeats reject negative/nonfinite ranges, and malformed user names use fallback text. Aware keeps SvgIcon step icons through slots. Avatar menu colors are passed through menuStyle because Vuetify teleports the overlay. Status labels and translations belong to the host.


## 0.3.0

Button, Badge and Accordion are now adapters too. Aware keeps SvgIcon through slots; one small stylesheet maps app tokens to shared variables and preserves the original CSS behavior when a token is missing. Existing imports/props remain, including loading/isLoading, form/action, classList and icon ordering. The adapter retains the legacy span header; the keyboard-native default title button belongs to WAccordion for new consumers. Indicator controls gain ARIA names and expanded state without changing pointer behavior or appearance. Action clicks stop propagation and bodies retain their DOM through v-show.

| Existing path | Shared component |
| --- | --- |
| components/common/Button.vue | WButton |
| components/common/Badge.vue | WBadge |
| components/common/Accordion.vue | WAccordion |


## 0.4.0

BadgeStack, UserBadge and TooltipBtn are compatibility adapters. Stack image slots keep Aware's themed DetectionTypeIcon for visible circles and raw images for overflow circles; its original div activator, per-item overrides, truncation, radius and opacity remain. New WBadgeStack consumers get a native overflow button and can pass menuStyle/badgeAttrs for teleported styling. UserBadge retains 16px avatars, charAt initials, action ordering and native bubbling. TooltipBtn resolves path with the host i18n instance and keeps path as the legacy aria-label. Its old attrs are still forwarded to both the wrapper span and VBtn, including the old bubbling/listener behavior. The shared WTooltipBtn instead accepts translated text and targets ordinary attrs/listeners at VBtn once. New applications should use that simpler public contract.

| Existing path | Shared component |
| --- | --- |
| components/common/BadgeStack.vue | WBadgeStack |
| components/common/UserBadge.vue | WUserBadge |
| components/common/TooltipBtn.vue | WTooltipBtn |


## 0.5.0

Tabs, Tree and Dropdown keep their Aware import paths. Tabs forwards named panels and keeps its scoped SvgIcon shadow-color patch in the app adapter. Layout and semantic colors move to namespaced CSS variables; missing-token behavior stays compatible. Tabs mount/parent synchronization does not emit updateTab. Tree retains controlled expandedKeys/activeKey, connector geometry, inline edit matching and node/action/toggle slots. Default labels render at every depth; empty named slots use Vue fallback content. Standalone WTree additionally supplies ARIA/roving keyboard controls. Aware uses keyboardNavigation=false to keep existing focus behavior. Dropdown translates the complete activator label through host i18n and renders router-link/SvgIcon through slots. Semantic app colors stay in its adapter; root attrs and selectedItem then update:modelValue events retain their targets/order.

| Existing path | Shared component |
| --- | --- |
| components/common/Tabs.vue | WTabs |
| components/common/Tree.vue | WTree |
| components/common/Dropdown.vue | WDropdown |


## 0.6.0

Carousel, ExportDropdown and BaseSidebar retain their existing Aware paths. Carousel keeps two root nodes and drops fragment attrs as before; its legacy hideDelimiters=true maps to showIndicators=true, and indicators retain their old missing native type. New projects use showIndicators with normal positive semantics and non-submit indicator buttons. ExportDropdown keeps the permission directive on the actual Aware Button, its download/PDF/Excel SvgIcon names, translations and select string payloads. The public package only picks a format; host code owns permissions and file generation. BaseSidebar keeps GenericForm/searchSchema/emitOnChange/updateSchema inside Aware via the search slot; the public package receives presentation records and callbacks. App-only gradient tokens, legacy global card-gradient rules, filter buttons/icons and translations stay in the adapter. Header/content/item/filter-modal placement and loading/empty behavior stay compatible.

| Existing path | Shared component |
| --- | --- |
| components/common/Carousel.vue | WCarousel |
| components/common/ExportDropdown.vue | WExportDropdown |
| components/common/BaseSidebar.vue | WBaseSidebar |

## Overlays (0.7.0)

Modal and Drawer keep their Aware import paths. isCloseable/isLoading/isDataLoaded map to closable/loading/dataLoaded; customAction maps to !showActions. Modal retains legacy header visibility, raw decoration, SvgIcon and localized close text. Drawer retains drawer-panel hooks and button-only close timing. jervis-form continues using the adapters. AddEditModal, schemas, validation, step submission, permissions and the unused drawerTarget remain unchanged. String Drawer widths still use parseInt.
