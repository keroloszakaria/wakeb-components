<!-- Generated from docs/reference-data.mjs -->
# WExportDropdown

قائمة صيغ تصدير ترسل الاختيار؛ المشروع يملك الصلاحيات وتوليد الملفات.

## الاستخدام

```vue
<script setup lang="ts">
import { WExportDropdown } from 'wakeb-components'
</script>
<template>
  <WExportDropdown title="Download report" @select="format => console.log(format)" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `isLoading` | `boolean` | `false` | تعطيل القائمة والزر أثناء التصدير في المشروع. |
| `disabled` | `boolean` | `false` | تعطيل القائمة والزر. |
| `title` | `string` | `"Download"` | نص الزر مترجم مسبقًا. |
| `formats` | `readonly ExportFormat[]` | `PDF / XLSX` | الأسماء والقيم النصية وأيقونات وحالات التعطيل الاختيارية. |
| `menuStyle` | `CSSProperties` | `undefined` | أنماط على القائمة المنقولة خارج الحاوية. |

## الأحداث

`select(value: string)` مرة لاختيار صيغة متاحة. المكوّن لا يولد ملفًا ولا ينزله.

## Slots

`activator`: يستقبل `{props,buttonProps}`؛ اربط خصائص القائمة والزر وضع directive صلاحيات المشروع هنا. `format-icon` و`format-label`: يستقبلان `{format,index}`.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-export-button-height` | `44px` |

## الوصول وحدود السلوك

الجذر VMenu ويحتفظ بعقد الخصائص وteleport. الافتراضي PDF/pdf وExcel/xlsx بأسماء إنجليزية؛ مرر بيانات مترجمة. أيقونات SVG الافتراضية لا تحتاج خط أيقونات؛ format.icon الاختيارية تستخدم إعداد Vuetify للمشروع. التحميل يعطل الزر العام والقائمة؛ الـactivator المخصص يمكنه الحفاظ على سلوكه القديم. الصلاحيات وحالة التصدير والشبكة وتوليد الملف والتنزيل في المشروع. استخدم activator للصلاحيات؛ الحزمة لا تستقبل permission ولا تعتمد على auth. menuStyle يستهدف القائمة المنقولة. Vuetify يدير النقر الخارجي وEscape والكيبورد. نوع الزر button وارتفاعه الافتراضي 44px.

## جرّب بنفسك

<CompositionPlayground initial="export-dropdown" />
