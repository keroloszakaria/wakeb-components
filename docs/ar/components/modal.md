<!-- Generated from docs/reference-data.mjs -->
# WModal

حاوية Dialog من Vuetify مع تحميل البيانات والعمليات بشكل منفصل وslots للرأس والإجراءات.

## الاستخدام

```vue
<script setup lang="ts">
import { WModal } from 'wakeb-components'
import { ref } from 'vue'
const open = ref(false)
</script>
<template>
  <button type="button" @click="open = true">Open</button>
  <WModal v-model="open" title="Report" width="640"><template #content>Report content</template></WModal>
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | حالة الفتح؛ التغيير المحلي يرسل حدثًا واحدًا. |
| `title` | `string` | `""` | عنوان مترجم من المشروع. |
| `persistent` | `boolean` | `true` | منع الإغلاق الأصلي من الخارج أو Escape. |
| `closable` | `boolean` | `true` | إظهار زر الإغلاق. |
| `loading` | `boolean` | `false` | طبقة تحميل مستقلة دون تنفيذ طلب. |
| `dataLoaded` | `boolean` | `true` | استبدال المحتوى بالتحميل حتى تجهز البيانات. |
| `closeLabel` | `string` | `"Close"` | اسم زر الإغلاق المقروء بعد ترجمته. |
| `loadingLabel` | `string` | `"Loading"` | اسم مقروء ومترجم للتحميل. |
| `width` | `string \| number` | `undefined` | أقصى عرض للنافذة؛ خصائص Vuetify متاحة. |
| `description` | `string` | `""` | وصف اختياري في الرأس الافتراضي. |
| `showActions` | `boolean` | `true` | إظهار منطقة إجراءات VCard بما فيها القدم الفارغة. |
| `titleClass` | `ComponentClass` | `""` | كلاسات العنوان الافتراضي. |
| `headerIcon` | `SharedIcon` | `""` | أيقونة Vuetify من المشروع؛ استخدم header-icon لـSVG. |
| `ariaLabel` | `string` | `"Dialog"` | اسم بديل للنافذة عند غياب العنوان. |

## الأحداث

`update:modelValue(value: boolean)` للتغييرات المحلية؛ مزامنة الأب صامتة. `afterLeave()` بعد انتهاء انتقال إغلاق Vuetify.

## Slots

`activator {props,isActive}`: اربط props بزر الفتح لإعادة التركيز أصليًا. `header {close}` يستبدل الرأس بالكامل. `title` و`header-icon` و`header-decoration` و`header-actions` لتركيب الرأس الافتراضي. `close-button {close,label}` يستبدل زر الإغلاق. `content` وبديله `default` للمحتوى؛ `actions` للقدم. `loading {label}` بديل المحتوى؛ `loading-overlay {label}` لطبقة تحميل مستقلة.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-modal-bg` | `rgb(var(--v-theme-surface))` |
| `--wakeb-modal-border` | `#d0d5dd` |
| `--wakeb-modal-title` | `inherit` |
| `--wakeb-modal-margin` | `1rem` |
| `--wakeb-modal-padding` | `1.25rem` |
| `--wakeb-modal-radius` | `4px` |
| `--wakeb-modal-icon-bg` | `#e6f4f5` |
| `--wakeb-modal-description` | `#667085` |
| `--wakeb-modal-loading-bg` | `#ffffffaa` |
| `--wakeb-modal-fallback` | `undefined (legacy adapter switch)` |

## الوصول وحدود السلوك

الخصائص تستهدف VDialog؛ خصائص الانتقال وscrim وscrollStrategy والتركيز الأصلية متاحة. persistent افتراضيًا true فيمنع Escape والنقر خارج النافذة من إغلاقها. Vuetify يدير التركيز وحصره وحجب التمرير وتراص النوافذ. استخدم activator لإعادة التركيز؛ زر الفتح البرمجي دون activator مسؤول عن استعادته. استخدمها داخل تطبيق Vuetify. slots محتوى Vue موثوق؛ الحزمة لا تحقن SVG خامًا. Aware يحتفظ بزخرفة الرأس وSvgIcon وترجمة الإغلاق وقواعد ظهور الرأس القديمة؛ customAction يقابل عكس showActions. المحتوى يزال أثناء عدم جاهزية البيانات. loading للعرض فقط؛ المشروع يقرر الإغلاق والحفظ ويملك الصلاحيات والإرسال. الطبقة العامة تغطي البطاقة؛ Aware يحتفظ بعناصر التحميل القديمة عبر slot. حافة البطاقة 4px مثل Dialog في Vuetify.

## جرّب بنفسك

<OverlayPlayground initial="modal" />
