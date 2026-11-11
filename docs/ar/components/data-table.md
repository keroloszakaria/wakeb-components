<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WDataTable

جدول بيانات يقوده الخادم: رؤوس أعمدة وصفوف كما تُمرَّر وفرز بعمود واحد وتحديد صفوف ونقر على الصف وعرض للتحميل وللحالة الفارغة. ترقيم الصفحات وفرز البيانات من مسؤولية المستخدم.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="data-table" />

## الاستخدام

```vue
<script setup lang="ts">
import { WDataTable } from 'wakeb-components'
import { ref } from 'vue'
import type { DataTableOptions } from 'wakeb-components'
const selected = ref<(string | number)[]>([])
const rows = ref([{ id: 1, name: 'Gate 3' }])
const load = (options: DataTableOptions) => console.log(options)
</script>

<template>
  <WDataTable v-model="selected" :headers="[{ key: 'id', title: 'ID' }, { key: 'name', title: 'Name' }]" :items="rows" selectable aria-label="Cameras" @update:options="load" />
</template>
```

## أمثلة

### خلايا وحالة فارغة مخصصة

تستقبل slots الخلايا العنصر الأصلي وقيمة الحقل.

```vue
<script setup lang="ts">
import { WDataTable, WBadge } from 'wakeb-components'
</script>

<template>
  <WDataTable :headers="[{ key: 'name', title: 'Name' }, { key: 'status', title: 'Status', sortable: false }]" :items="[{ id: 1, name: 'Gate 3', status: 'Online' }]" aria-label="Cameras"><template #item.status="{ value }"><WBadge :label="String(value)" type="success" /></template><template #no-data>No cameras found.</template></WDataTable>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `headers` | `readonly DataTableHeader[]` | `[]` | الأعمدة: key (حقل العنصر، والمسارات بالنقاط مثل owner.name تقرأ القيم المتداخلة) وtitle وalign (‏start أو center أو end) وsortable (‏true ما لم تكن false) وwidth (رقم بالبكسل أو طول CSS). |
| `items` | `readonly DataTableItem[]` | `[]` | صفوف الصفحة الحالية، تظهر بالترتيب المُمرَّر. لا يفرزها الجدول ولا يقتطع منها. |
| `itemValue` | `string` | `"id"` | حقل العنصر (أو مسار بالنقاط) الذي يميز الصف عند التحديد. |
| `modelValue` | `readonly (string \| number)[]` | `[]` | قيم الصفوف المحددة (v-model). ويحتفظ الجدول بتحديده الخاص إذا لم يُربط v-model. |
| `selectable` | `boolean` | `false` | يضيف عمود مربعات اختيار مع مربع لتحديد كل الصفوف الحالية. |
| `loading` | `boolean` | `false` | يستبدل الصفوف بعرض التحميل ويضبط aria-busy=true. |
| `sortBy` | `readonly DataTableSortItem[]` | `[]` | الفرز الحالي بالشكل [{ key, order }] (‏v-model:sort-by). يُفرز عمود واحد فقط في كل مرة. |
| `page` | `number` | `1` | الصفحة الحالية، وتُعاد في update:options. لا يحتوي الجدول على تذييل؛ أضف ترقيم الصفحات الخاص بك. |
| `itemsPerPage` | `number` | `10` | حجم الصفحة، ويُعاد في update:options. |
| `noDataText` | `string` | `undefined` | نص العرض الفارغ؛ والافتراضي "No data available" أو "لا توجد بيانات" حسب اللغة. |
| `selectAllLabel` | `string` | `undefined` | الاسم المساعد لمربع تحديد الكل؛ والافتراضي "Select all rows" أو "تحديد كل الصفوف". |
| `selectRowLabel` | `string` | `undefined` | الاسم المساعد لمربع اختيار كل صف؛ والافتراضي "Select row" أو "تحديد الصف". |
| `ariaLabel` | `string` | `undefined` | الاسم المساعد لعنصر الجدول. |

## الأحداث

يرسل `update:modelValue` قيم الصفوف المحددة. ويرسل `update:sortBy` الفرز الجديد. ويرسل `update:options` القيم { page, itemsPerPage, sortBy } مرة عند التركيب وبعد كل تغيير، فيمكن تحميل الصفحة الأولى منه؛ وتغيير الفرز يعيد page إلى 1. ويرسل `click:row` القيمتين (item, event) عند النقر على صف؛ ولا يرسله النقر على مربعات التحديد.

```ts
"update:modelValue": [value: (string | number)[]];
"update:sortBy": [value: DataTableSortItem[]];
"update:options": [value: DataTableOptions];
"click:row": [item: DataTableItem, event: MouseEvent];
```

## Slots

`item.<key>` (‏{ item, value, index }) يستبدل خلية عمود واحد، مثل `#item.status="{ value }"`. و`loading` (بدون بيانات) يستبدل صفوف الهيكل الافتراضية (‏WSkeleton table-row@5). و`no-data` (بدون بيانات) يستبدل النص الفارغ.

```ts
[key: `item.${string}`]: ((props: { item: DataTableItem; value: unknown; index: number }) => unknown) | undefined;
loading?(): unknown;
"no-data"?(): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى جذر الجدول: ‏VDataTableServer على Vuetify و DataTable على PrimeVue وعنصر div المغلف على shadcn-vue.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab / Enter` | التركيز على عنوان عمود مفعل وفرزه. |
| `Space` | تغيير اختيار الصف من خانة الاختيار الحالية. |

## الوصول وحدود السلوك

رؤوس الأعمدة القابلة للفرز تعمل بلوحة المفاتيح وتعرض aria-sort (‏ascending أو descending) على العمود المفروز. الصفوف لا تأخذ التركيز، لذا يحتاج النقر على الصف طريقًا آخر بلوحة المفاتيح مثل رابط أو زر داخل خلية. لا توجد صفوف قابلة للتوسيع ولا تجميع ولا فرز بعدة أعمدة ولا تغيير لعرض الأعمدة ولا تمرير افتراضي ولا تذييل مدمج. على Vuetify: ‏VDataTableServer مع hide-default-footer؛ ويعرض أيضًا خط التحميل تحت الرأس أثناء التحميل. على PrimeVue: ‏DataTable بوضع lazy مع removable sort؛ ويستخدم التحديد أعمدة مربعات اختيار من Wakeb، ويستخدم عرضا التحميل والحالة الفارغة الصف الفارغ في PrimeVue. على shadcn-vue: بنية Table من shadcn-vue مع أزرار فرز من Wakeb ومربعات اختيار أصلية.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
