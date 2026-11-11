<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WModal

حاوية Dialog من Vuetify مع تحميل البيانات والعمليات بشكل منفصل وslots للرأس والإجراءات.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<OverlayPlayground initial="modal" />

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

## أمثلة

### حوار بسيط

يزيل bare تنسيق السطح؛ حافظ على الاسم وإجراء الإغلاق.

```vue
<script setup lang="ts">
import { WButton, WModal } from 'wakeb-components'
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <WButton title="Open confirmation" @click="open = true" />
  <WModal v-model="open" bare aria-label="Confirm action"><p>Continue?</p><WButton title="Cancel" @click="open = false" /></WModal>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
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
| `headerIcon` | `SharedIcon` | `""` | اسم أيقونة أو بيانات مسار SVG أو مكوّن اختياري (المزودات > الأيقونات)؛ ويمكن استبداله بـheader-icon. |
| `ariaLabel` | `string` | `"Dialog"` | اسم بديل للنافذة عند غياب العنوان. |
| `bare` | `boolean` | `false` | يرسم الـslot الافتراضي وحده داخل النافذة على سطح شفاف بلا حدود أو هامش أو رأس أو زر إغلاق أو حشو للمحتوى أو عروض تحميل أو أزرار. يملك المستخدم التخطيط كله ويضيف زر إغلاق خاصًا به عند الحاجة؛ ويبقى الربط بـv-model والاسم المتاح وحصر التركيز وEscape وسلوك persistent كما هي. |
| `providerProps` | `WakebProviderProps` | `undefined` | غير قابل للنقل. خصائص وأحداث أصلية لـprimitive النافذة (`VDialog` في Vuetify و`Dialog` في PrimeVue). الـmodel وسياسة الإغلاق والعرض وترتيب الطبقات وحصر التركيز وقفل التمرير وأحداث `afterLeave` و`contentProps` و`pt` يملكها Wakeb. الأحداث الأصلية الأخرى تعمل بجانب معالجات Wakeb. المفاتيح المتجاهلة تُنتج تحذيرًا في وضع التطوير. |

## الأحداث

`update:modelValue(value: boolean)` للتغييرات المحلية؛ مزامنة الأب صامتة. `afterLeave()` بعد انتهاء انتقال إغلاق Vuetify.

```ts
"update:modelValue": [value: boolean];
afterLeave: [];
```

## Slots

`activator {props,isActive}`: اربط props بزر الفتح لإعادة التركيز أصليًا. `header {close}` يستبدل الرأس بالكامل. `title` و`header-icon` و`header-decoration` و`header-actions` لتركيب الرأس الافتراضي. `close-button {close,label}` يستبدل زر الإغلاق. `content` وبديله `default` للمحتوى؛ `actions` للقدم. `loading {label}` بديل المحتوى؛ `loading-overlay {label}` لطبقة تحميل مستقلة.

```ts
activator(props: { props: Record<string, unknown>; isActive: boolean }): unknown;
header(props: { close: () => void }): unknown;
title(): unknown;
"header-icon"(): unknown;
"header-decoration"(): unknown;
"header-actions"(): unknown;
"close-button"(props: { close: () => void; label: string }): unknown;
content(): unknown;
default(): unknown;
actions(): unknown;
loading(props: { label: string }): unknown;
"loading-overlay"(props: { label: string }): unknown;
```

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
| `--wakeb-modal-description` | `rgb(var(--v-theme-on-surface))` |
| `--wakeb-modal-loading-bg` | `rgba(var(--v-theme-surface), 0.72)` |
| `--wakeb-modal-fallback` | `undefined (legacy adapter switch)` |
| `--wakeb-modal-close-color` | `rgb(var(--v-theme-on-surface))` |
| `--wakeb-modal-icon-color` | `#087f8c` |

## وجهة السمات

العنصر الذي يحمل `role="dialog"`، ويحمل أيضًا `.wakeb-modal`، على كل المزودين. هذا العنصر منقول خارج المكوّن، فلا يوجد إلا أثناء رسم النافذة. الاسم الذي يضعه Wakeb (`title` ثم `ariaLabel`) يغلب `aria-label` من المستخدم. أما `providerProps` فيذهب إلى primitive النافذة. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر. كل المزودين يرسمون داخله أصناف التنسيق نفسها: `.wakeb-modal__card` و`.wakeb-modal__header` و`.wakeb-modal__title` (العنوان الافتراضي فقط) و`.wakeb-modal__content` و`.wakeb-modal__actions` (منطقة الأزرار السفلية عندما تكون `showActions` بقيمة true). نسّق عبر هذه الأصناف، لا عبر أصناف المزود مثل `.v-card` أو `.p-dialog`، حتى يعمل الـCSS نفسه على Vuetify وPrimeVue وshadcn-vue.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab / Shift+Tab` | نقل التركيز داخل الحوار المفتوح. |
| `Escape` | الإغلاق إلا مع persistent ثم إرجاع التركيز للزر. |

## الوصول وحدود السلوك

الخصائص تستهدف VDialog؛ خصائص الانتقال وscrim وscrollStrategy والتركيز الأصلية متاحة. persistent افتراضيًا true فيمنع Escape والنقر خارج النافذة من إغلاقها. Vuetify يدير التركيز وحصره وحجب التمرير وتراص النوافذ. يعود التركيز إلى زر الفتح بعد الإغلاق، بما فيه زر خارجي يغيّر modelValue، ولا يُسحب التركيز إذا نقله المستخدم عمدًا إلى عنصر آخر. استخدمها داخل تطبيق Vuetify. slots محتوى Vue موثوق؛ الحزمة لا تحقن SVG خامًا. Aware يحتفظ بزخرفة الرأس وSvgIcon وترجمة الإغلاق وقواعد ظهور الرأس القديمة؛ customAction يقابل عكس showActions. المحتوى يزال أثناء عدم جاهزية البيانات. loading للعرض فقط؛ المشروع يقرر الإغلاق والحفظ ويملك الصلاحيات والإرسال. الطبقة العامة تغطي البطاقة؛ Aware يحتفظ بعناصر التحميل القديمة عبر slot. الوصف وحده يكفي لإظهار الرأس الافتراضي. width يكسب على max-width الأصلية التي تُستخدم فقط عند غياب width. حافة البطاقة 4px مثل Dialog في Vuetify.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
