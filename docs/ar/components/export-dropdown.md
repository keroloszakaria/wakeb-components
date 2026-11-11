<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WExportDropdown

قائمة صيغ تصدير ترسل الاختيار؛ المشروع يملك الصلاحيات وتوليد الملفات.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<CompositionPlayground initial="export-dropdown" />

## الاستخدام

```vue
<script setup lang="ts">
import { WExportDropdown } from 'wakeb-components'
</script>

<template>
  <WExportDropdown title="Download report" @select="format => console.log(format)" />
</template>
```

## أمثلة

### صيغ مخصصة

يرسل الاختيار قيمة، وينفذ التطبيق عملية التنزيل.

```vue
<script setup lang="ts">
import { WExportDropdown } from 'wakeb-components'
import { ref } from 'vue'
const format = ref('')
</script>

<template>
  <WExportDropdown :formats="[{ label: 'CSV', value: 'csv' }]" @select="format = $event" />
  <p>Requested: {{ format }}</p>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `isLoading` | `boolean` | `false` | تعطيل القائمة والزر أثناء التصدير في المشروع. |
| `disabled` | `boolean` | `false` | تعطيل القائمة والزر. |
| `title` | `string` | `"Download"` | نص الزر مترجم مسبقًا. |
| `formats` | `readonly ExportFormat[]` | `PDF / XLSX` | الأسماء والقيم النصية وأيقونات وحالات التعطيل الاختيارية. |
| `menuStyle` | `CSSProperties` | `undefined` | أنماط على القائمة المنقولة خارج الحاوية. |
| `location` | `WakebPopoverLocation` | `undefined` | جانب القائمة ومحاذاتها المنطقية بالنسبة لزر الفتح؛ start وend يتبعان الاتجاه. بدون قيمة يبقى موضع المزود. |
| `offset` | `number` | `undefined` | المسافة بالبكسل بين زر الفتح والقائمة. بدون قيمة تبقى مسافة المزود. |

## الأحداث

`select(value: string)` مرة لاختيار صيغة متاحة. المكوّن لا يولد ملفًا ولا ينزله.

```ts
select: [value: string];
```

## Slots

`activator`: يستقبل `{props,buttonProps}`؛ اربط خصائص القائمة والزر وضع directive صلاحيات المشروع هنا. `format-icon` و`format-label`: يستقبلان `{format,index}`.

```ts
activator?(props: { props: Record<string, unknown>; buttonProps: ButtonProps }): unknown;
"format-icon"?(props: { format: ExportFormat; index: number }): unknown;
"format-label"?(props: { format: ExportFormat; index: number }): unknown;
```

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-export-button-height` | `44px` |

## وجهة السمات

للتوافق مع الإصدار الأساسي: تصل السمات العادية إلى طبقة القائمة المنقولة (VMenu على Vuetify وجذر Menu على PrimeVue)، وهي موجودة فقط أثناء فتح القائمة. لا تصل إلى زر الفتح؛ استخدم slot الـactivator لذلك. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر. وعلى shadcn-vue هي عنصر يغلّف عنصر reka-ui الذي يحمل `role="menu"`.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Enter / Space` | الفتح من الزر أو اختيار عنصر مفعل عليه التركيز. |
| `Up / Down` | نقل التركيز بين عناصر القائمة. |
| `Escape` | إغلاق القائمة. |

## الوصول وحدود السلوك

الجذر VMenu ويحتفظ بعقد الخصائص وteleport. الافتراضي PDF/pdf وExcel/xlsx بأسماء إنجليزية؛ مرر بيانات مترجمة. أيقونات SVG الافتراضية لا تحتاج خط أيقونات؛ format.icon الاختيارية تُحل عبر الخيار icons والأيقونات المدمجة ثم إعداد Vuetify للمشروع. التحميل يعطل الزر العام والقائمة؛ الـactivator المخصص يمكنه الحفاظ على سلوكه القديم. الصلاحيات وحالة التصدير والشبكة وتوليد الملف والتنزيل في المشروع. استخدم activator للصلاحيات؛ الحزمة لا تستقبل permission ولا تعتمد على auth. menuStyle يستهدف القائمة المنقولة ويتقدم على نطاق theme الخاص بالـplugin وzIndexOverlay اللذين تحملهما القائمة. Vuetify يدير النقر الخارجي وEscape والكيبورد؛ الصفوف بدور menuitem داخل menu والصيغ المعطلة معها aria-disabled. نوع الزر button وارتفاعه الافتراضي 44px. يصل location وoffset إلى VMenu؛ وبدون قيمة تبقى إعدادات VMenu الافتراضية. على PrimeVue: تُرسم الصيغ في Menu المنبثقة من PrimeVue، وهي المسؤولة عن الموضع والأسهم وEnter/Space وEscape والنقر الخارجي وإعادة التركيز؛ ويحمل زر الفتح aria-haspopup وaria-expanded وaria-controls. تصل الخصائص ونطاق theme وzIndexOverlay إلى جذر Menu المنقول، ويصل menuStyle إلى القائمة التي تحمل role=menu. أيقونات الصيغ تُحل عبر الخيار icons والأيقونات المدمجة في Wakeb (وتعمل أسماء PrimeIcons أيضًا)، لا عبر أيقونات Vuetify. تضع Menu القائمة أسفل زر الفتح وتقلبها للأعلى عند ضيق المساحة، فلا ينطبق location وoffset. على shadcn-vue: تُرسم الصيغ في DropdownMenu من reka-ui (غير modal)، وهي المسؤولة عن الموضع ومفاتيح الأسهم التي تتخطى الصيغ المعطلة وEnter/Space وEscape والنقر الخارجي؛ ويعيد Wakeb التركيز إلى زر الفتح إلا إذا أُغلقت القائمة بنقر خارجها. يضبط location قيمتي side وalign في reka-ui، ويضبط offset المسافة الجانبية (4px بدون قيمة). تأخذ القائمة aria-label من title وتأخذ zIndexOverlay وmenuStyle؛ وتصل الخصائص ونطاق theme إلى العنصر المغلّف الذي يُزال بعد إغلاق القائمة. يحمل زر الفتح الافتراضي وprops الخاصة بـslot activator نطاق ثيم واتجاه Wakeb إلى جانب القائمة المنقولة، وتبقى سمات المستخدم موجهة إلى طبقة القائمة وحدها.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
