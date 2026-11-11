<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WButtonToggle

مجموعة أزرار تبديل متلاصقة باختيار واحد أو متعدد.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="button-toggle" />

## الاستخدام

```vue
<script setup lang="ts">
import { WButtonToggle } from 'wakeb-components'
import { ref } from 'vue'
const position = ref<string | number | (string | number)[] | null>('top')
</script>

<template>
  <WButtonToggle v-model="position" mandatory block aria-label="Legend position" :items="[{ label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }]" />
</template>
```

## أمثلة

### اختيار متعدد

استعمل نموذج مصفوفة مع multiple.

```vue
<script setup lang="ts">
import { WButtonToggle } from 'wakeb-components'
import { ref } from 'vue'
const selected = ref<string | number | (string | number)[] | null>(['bold'])
</script>

<template>
  <WButtonToggle v-model="selected" multiple aria-label="Text style" :items="[{ label: 'Bold', value: 'bold' }, { label: 'Italic', value: 'italic' }]" />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| readonly (string \| number)[] \| null` | `null` | القيمة المحددة، أو قائمة قيم مع multiple. |
| `items` | `readonly ButtonToggleItem[]` | `[]` | الأزرار: `{ label, value, disabled? }`؛ والأسماء مترجمة من المشروع. |
| `multiple` | `boolean` | `false` | يسمح بتحديد أكثر من عنصر؛ والقيمة قائمة بترتيب العناصر. |
| `mandatory` | `boolean` | `false` | يحافظ على آخر اختيار: الضغط عليه مرة أخرى لا يفعل شيئًا. ولا يحدد عنصرًا من تلقاء نفسه. |
| `color` | `WakebColor` | `"primary"` | لون الزر المحدد: intent من Wakeb أو لون CSS. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | المسافات في الأزرار. بدون قيمة يبقى الافتراضي للمزود. |
| `disabled` | `boolean` | `false` | يعطل كل الأزرار. |
| `block` | `boolean` | `false` | يملأ العرض وتتقاسمه الأزرار بالتساوي. |
| `ariaLabel` | `string` | `undefined` | الاسم المساعد للمجموعة. |

## الأحداث

`update:modelValue(value)` بالقيمة الجديدة، أو null عند الإلغاء، أو قائمة جديدة مع multiple.

```ts
"update:modelValue": [value: string | number | (string | number)[] | null];
```

## Slots

`item` يستقبل `{ item, selected }` ويستبدل نص الزر.

```ts
item?(props: { item: ButtonToggleItem; selected: boolean }): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى عنصر المجموعة (role=group).

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab` | التركيز على الإجراءات المفعلة. |
| `Enter / Space` | تفعيل الزر الأصلي الحالي. |

## الوصول وحدود السلوك

كل المزودات ترسم مجموعة role=group من أزرار أصلية مع aria-pressed، وWakeb يدير القيمة، فتعمل mandatory وmultiple وdisabled بنفس الطريقة في كل مكان. مفاتيح الأسهم لا تتنقل بين الأزرار؛ Tab هو الذي يتنقل. تتم مقارنة القيم بـ===. على Vuetify: ‏VBtnGroup (outlined وdivided) من VBtn؛ الزر المحدد active ويأخذ اللون. على PrimeVue: زر ToggleButton لكل عنصر مضمومة في مجموعة؛ واللون يضبط tokens الحالة المحددة. على shadcn-vue: أزرار أصلية بشكل ToggleGroup من shadcn-vue؛ والزر المحدد يمتلئ باللون.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
