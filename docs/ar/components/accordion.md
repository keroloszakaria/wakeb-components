<!-- Generated from docs/reference-data.mjs -->
# WAccordion

لوحات فتح وإغلاق تحتفظ بالمحتوى، مع header slots وزر افتراضي يدعم الكيبورد.

## الاستخدام

```vue
<script setup lang="ts">
import { WAccordion } from 'wakeb-components'
</script>
<template>
  <WAccordion title="Details" after-icon :model-value="true"><p>Persistent panel content</p></WAccordion>
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `title` | `string` | `""` | العنوان الافتراضي واسم زر الفتح. |
| `modelValue` | `boolean` | `false` | حالة الفتح الابتدائية والخارجية؛ النقر الداخلي يعمل دون تحديث الوالد. |
| `classList` | `ComponentClass` | `""` | classes على الحاوية. |
| `icon` | `SharedIcon` | `"$expand"` | أيقونة المؤشر لـWButton أو toggleIcon. |
| `noBorder` | `boolean` | `false` | إزالة الحد الخارجي ونصف القطر. |
| `beforeIcon` | `boolean` | `false` | عرض زر فتح قبل العنوان. |
| `afterIcon` | `boolean` | `false` | عرض زر فتح بعد العنوان. |
| `iconColor` | `string` | `""` | لون صريح للمؤشر. |
| `iconSize` | `string \| number` | `"sm"` | حجم أيقونة المؤشر. |
| `maxIconWidth` | `string \| number` | `"100%"` | أقصى عرض للمؤشر. |
| `headerTitleClassList` | `ComponentClass` | `""` | classes على زر العنوان الافتراضي. |
| `headerClassList` | `ComponentClass` | `""` | classes على الـheader القابل للنقر. |
| `bodyClassList` | `ComponentClass` | `""` | classes على المحتوى المحتفظ به. |
| `transparent` | `boolean` | `false` | خلفية خارجية شفافة. |
| `toggleLabel` | `string` | `""` | اسم مترجم لزر الفتح؛ البديل title ثم Toggle section. |
| `contentId` | `string` | `""` | معرف صريح للمحتوى؛ وإلا معرف ثابت من Vue useId. |

## الأحداث

`update:modelValue(value: boolean)` — يُرسل عند التفعيل المحلي فقط.

## Slots

`header`: يستقبل `{ open, toggle, triggerProps }`؛ اربط triggerProps بزر HTML لدعم الكيبورد وARIA. `actions`: يستقبل `{ open, toggle }` مع عزله عن نقر الـheader. `default`: يستقبل `{ open }` ويحتفظ بالمحتوى عبر v-show. `toggleIcon`: يستقبل `{ icon, size, color, maxWidth }`. المؤشرات ترث متغيرات CSS الموثقة لـWButton.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-accordion-background` | `#fff` |
| `--wakeb-accordion-body-background` | `#fff` |
| `--wakeb-accordion-border` | `#d0d5dd` |
| `--wakeb-accordion-fallback` | `not defined (normal per-token defaults)` |
| `--wakeb-accordion-focus` | `#087f8c` |
| `--wakeb-accordion-hover-rgb` | `249, 250, 251` |
| `--wakeb-accordion-radius` | `12px` |
| `--wakeb-accordion-title` | `#101828` |

## الوصول وحدود السلوك

العنوان الافتراضي زر HTML يحمل aria-expanded/aria-controls؛ النقر على باقي الـheader يفتح ويغلق أيضًا. أزرار المؤشرات توقف تصاعد الحدث فكل تفعيل يرسل تحديثًا واحدًا. actions لا يفتح اللوحة. الـheader المخصص يحتاج زرًا قابلًا للوصول عبر triggerProps مع إيقاف تصاعد أحداث التحكم غير المرتبطة. المحتوى يستخدم v-show للاحتفاظ بحالة الفورم. تحديث modelValue الخارجي يزامن الحالة دون إعادة إرسال الحدث، والنقر يعمل حتى مع قيمة ثابتة من الوالد. Vue useId ثابت لكل تطبيق/طلب SSR؛ استخدم app.config.idPrefix مختلفًا للتطبيقات المستقلة المتعددة. الحركة تحترم reduced-motion. دوران المؤشر 180deg عند الإغلاق و0deg عند الفتح كما في العقد المستخرج. --wakeb-accordion-fallback مخصص للتوافق.

## جرّب بنفسك

<FoundationPlayground initial="accordion" />
