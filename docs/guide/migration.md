# Migration from Aware

The first extraction keeps the existing application paths as thin adapters:

| Existing path | Shared component |
| --- | --- |
| `components/common/TruncatedText.vue` | `WTruncatedText` |
| `components/common/SegmentedProgress.vue` | `WSegmentedProgress` |
| `components/common/SemiCircleGauge.vue` | `WSemiCircleGauge` |

Adapters map Aware tokens to namespaced variables and keep the old prop defaults.
Existing screens do not need to change imports. New applications import named
components directly from `wakeb-components` and choose their own colors.

Numeric percentage normalization, text truncation and valid-size geometry stay
the same. The shared gauge also guards invalid sizes/thickness values; the
shared text component composes listener handlers with Vuetify for keyboard access.
These are documented defensive changes, not business-rule changes.

Buttons, badges, forms, tables, layouts, permissions, data loading and theme
configuration remain in Aware. The next extraction should be chosen after its
own dependency and public-API review.
