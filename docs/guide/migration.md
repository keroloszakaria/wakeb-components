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
