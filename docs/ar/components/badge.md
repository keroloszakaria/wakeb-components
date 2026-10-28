<!-- Generated from docs/reference-data.mjs -->
# WBadge

شارات بألوان دلالية ونقطة قابلة للتخصيص وترتيب ثابت للأيقونة والـactions.

## الاستخدام

```vue
<script setup lang="ts">
import { WBadge } from 'wakeb-components'
</script>
<template>
  <WBadge label="Approved" type="success" is-dot />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `label` | `string` | `""` | النص الافتراضي الآمن. |
| `classList` | `ComponentClass` | `""` | classes على الشارة. |
| `type` | `string` | `"primary"` | أنواع primary/success/danger/warning/info/outline/outline-secondary/transparent/dark/tertiary/success-transparent/danger-transparent مع دعم classes مخصصة. |
| `icon` | `SharedIcon` | `""` | أيقونة Vuetify أو قيمة icon slot. |
| `isDot` | `boolean` | `false` | عرض النقطة الزخرفية قبل المحتوى. |
| `borderRadius` | `string` | `"md"` | sm يختار 8px؛ md والافتراضي يحتفظان بنصف قطر 24px. |
| `customBorderRadius` | `string` | `""` | قيمة CSS صريحة لنصف القطر. |
| `customPadding` | `string` | `""` | padding صريح وارتفاع تلقائي ومسافة محتوى أصغر. |
| `dotColor` | `string` | `""` | لون CSS صريح للنقطة. |
| `variant` | `"default" \| "flat" \| "text" \| "elevated" \| "tonal" \| "outlined" \| "plain"` | `"default"` | default يتحول إلى tonal في Vuetify. |
| `iconSize` | `string \| number` | `"xs"` | xs/sm/md/lg/xl تعني 16/20/24/32/40px. |
| `iconPosition` | `"before" \| "after"` | `"before"` | موضع الأيقونة والـactions قبل أو بعد المحتوى. |
| `chipAttrs` | `Record<string, unknown>` | `{}` | attributes صريحة لـVChip؛ العادية تصل للحاوية الخارجية. |

## Slots

`default`: يستبدل label. `icon`: يستقبل `{ icon, size }` مع VIcon كافتراضي. `actions`: يلي الأيقونة. الترتيب before: أيقونة/actions/نقطة/محتوى؛ after: نقطة/محتوى/أيقونة/actions.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-badge-check-color` | `#667085` |
| `--wakeb-badge-danger-bg` | `#fef3f2` |
| `--wakeb-badge-danger-bg-rgb` | `254, 243, 242` |
| `--wakeb-badge-danger-dot` | `#f04438` |
| `--wakeb-badge-danger-text` | `#b42318` |
| `--wakeb-badge-dark-bg` | `#fff` |
| `--wakeb-badge-dark-text` | `#667085` |
| `--wakeb-badge-fallback` | `not defined (normal per-token defaults)` |
| `--wakeb-badge-info-bg` | `#f0f9ff` |
| `--wakeb-badge-info-dot` | `#0ba5ec` |
| `--wakeb-badge-info-text` | `#026aa2` |
| `--wakeb-badge-neutral-bg` | `#f2f4f7` |
| `--wakeb-badge-neutral-text` | `#667085` |
| `--wakeb-badge-outline-border` | `#d0d5dd` |
| `--wakeb-badge-outline-secondary-border` | `#d0d5dd` |
| `--wakeb-badge-outline-secondary-text` | `#667085` |
| `--wakeb-badge-primary-bg` | `#eff8ff` |
| `--wakeb-badge-primary-button-bg` | `#087f8c` |
| `--wakeb-badge-primary-dot` | `#2e90fa` |
| `--wakeb-badge-primary-text` | `#175cd3` |
| `--wakeb-badge-success-bg` | `#ecfdf3` |
| `--wakeb-badge-success-bg-rgb` | `236, 253, 243` |
| `--wakeb-badge-success-dot` | `#12b76a` |
| `--wakeb-badge-success-text` | `#027a48` |
| `--wakeb-badge-tertiary-bg-rgb` | `242, 244, 247` |
| `--wakeb-badge-tertiary-text` | `#667085` |
| `--wakeb-badge-warning-bg` | `#fffaeb` |
| `--wakeb-badge-warning-dot` | `#f79009` |
| `--wakeb-badge-warning-text` | `#b54708` |

## الوصول وحدود السلوك

الشارة للعرض ما لم تجعلها chipAttrs تفاعلية. قدم نص حالة واضحًا؛ اللون والنقطة وحدهما لا يمثلان اسمًا لقارئ الشاشة. أحداث الحاوية هي أحداث DOM المتصاعدة ولا توجد emits مخصصة. التنسيق يحتفظ بخلفيات descendants للنوع outline وclasses الخاصة. ضع الأيقونات المخصصة في icon slot. الألوان الدلالية مستقلة عن tokens المشروع. متغيرات اللون الحالي داخلية؛ استخدم dotColor أو tokens الموثقة. اترك --wakeb-badge-fallback غير معرف في الاستخدام العادي.

## جرّب بنفسك

<FoundationPlayground initial="badge" />
