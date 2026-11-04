<!-- Generated from docs/reference-data.mjs -->
# WPageSkeleton

صفوف Skeleton متجاوبة على شبكة Wakeb بوصف بيانات typed.

## الاستخدام

```vue
<script setup lang="ts">
import { WPageSkeleton } from 'wakeb-components'
</script>
<template>
  <WPageSkeleton :config="[{ repeat: 2, cols: 12, md: 6, variant: 'card', items: [{ type: 'text' }, { type: 'paragraph' }] }]" label="Loading report" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `config` | `readonly SkeletonRow[]` | `required` | وصف الصفوف؛ المصفوفة الفارغة تعرض حالة فارغة. راجع نماذج البيانات. |
| `direction` | `"row" \| "column"` | `"column"` | اتجاه flex للحاوية دون الاعتماد على Tailwind. |
| `label` | `string` | `"Loading content"` | اسم الحالة لقارئ الشاشة؛ ترجمه داخل المشروع. |

## Slots

لا توجد slots؛ التكوين عبر config وheader/items وclasses ونقاط توقف Vuetify.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-skeleton-surface` | `#fff` |
| `--wakeb-skeleton-border` | `#eaecf0` |

## الوصول وحدود السلوك

يستخدم حالة واحدة باسم role=status وaria-busy=true مع إخفاء الصفوف الزخرفية عن ARIA لمنع تكرار القراءة؛ اعرضه أثناء التحميل فقط. repeat يُقرب لأسفل؛ القيم المفقودة وغير المحدودة والصفر والسالب تنتج عمودًا واحدًا. cols الافتراضي 12 للقيم الفارغة وفق العقد السابق. تقبل cols وsm وmd وlg القيم من 1 إلى 12 أو 'auto' أو true (تمدد) على شبكة Wakeb ذات الأعمدة الاثني عشر، ونقاط توقفها ثابتة: sm عند 600px وmd عند 960px وlg عند 1280px، ولا تغيّرها إعدادات المزوّد. القيم الأخرى تُتجاهل (وتأخذ cols القيمة 12) مع WAKEB_UNKNOWN_VALUE. الصفوف والأعمدة عناصر wakeb-grid-row وwakeb-grid-col، وليست VRow/VCol من Vuetify. type يتبع صيغة Skeleton في Wakeb: أسماء قابلة للنقل وتسلسلات بالفواصل وتكرار @N بحد أقصى 100. تُتجاهل الأسماء غير المعروفة مع WAKEB_UNKNOWN_VALUE، وتبقى أسماء Vuetify الخاصة تعمل تحت Vuetify مع WAKEB_DEPRECATED_VALUE. لا يحتاج CSS خاص بالمشروع. تخصيص عظام card يستهدف بنية Vuetify 3.

## جرّب بنفسك

<ComponentPlayground initial="page-skeleton" />
