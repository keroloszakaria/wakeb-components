<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WTree

شجرة متداخلة يتحكم فيها المشروع مع خطوط الربط وslots وتنقل بالكيبورد.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<NavigationPlayground initial="tree" />

## الاستخدام

```vue
<script setup lang="ts">
import { WTree } from 'wakeb-components'
</script>

<template>
  <WTree :nodes="[{ id: 1, name: 'Team', children: [{ id: 2, name: 'Member' }] }]" :expanded-keys="[1]" aria-label="Teams" />
</template>
```

## أمثلة

### التوسع من التطبيق

استقبل toggle وحدّث قائمة المفاتيح الموسعة.

```vue
<script setup lang="ts">
import { WTree } from 'wakeb-components'
import { ref } from 'vue'
import type { NavigationKey } from 'wakeb-components'
const expanded = ref<NavigationKey[]>([])
</script>

<template>
  <WTree :nodes="[{ id: 'team', name: 'Team', children: [{ id: 'ada', name: 'Ada' }] }]" :expanded-keys="expanded" aria-label="People" @toggle="node => { if (node.id !== undefined) expanded = expanded.includes(node.id) ? [] : [node.id] }" />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `nodes` | `readonly TreeNode[]` | `[]` | بيانات عرض دون مراجع دائرية ومفاتيح نصية أو رقمية فريدة. |
| `itemKey` | `string` | `"id"` | حقل المفتاح. |
| `itemLabel` | `string` | `"name"` | حقل الاسم الظاهر والمقروء. |
| `itemDescription` | `string` | `"description"` | حقل الوصف الاختياري. |
| `childrenKey` | `string` | `"children"` | حقل قائمة الأبناء. |
| `level` | `number` | `0` | عمق البداية؛ يستخدم في التركيب المتداخل. |
| `isRoot` | `boolean` | `true` | شجرة رئيسية أو مجموعة داخلية؛ التداخل الداخلي يمرر false. |
| `expandedKeys` | `readonly NavigationKey[]` | `[]` | الفروع المفتوحة؛ حدّثها في المشروع عند toggle. |
| `activeKey` | `NavigationKey \| null` | `null` | مفتاح العنصر المختار من المشروع. |
| `activePath` | `readonly NavigationKey[]` | `[]` | مسار المجموعات الداخلية؛ الجذر يستنتجه من activeKey. |
| `rtl` | `boolean` | `false` | اتجاه RTL مع عكس أسهم الفتح والإغلاق. |
| `editingNodeId` | `NavigationKey \| null` | `null` | class لحالة التعديل؛ المقارنة تدعم الرقم وتمثيله النصي. |
| `keyboardNavigation` | `boolean` | `true` | شجرة ARIA وتنقل بالكيبورد؛ false يحتفظ بسلوك القائمة القديم. |
| `ariaLabel` | `string` | `"Tree"` | اسم الشجرة المقروء. |
| `toggleLabel` | `string` | `"Toggle branch"` | اسم زر فتح الفرع الافتراضي. |

## الأحداث

`node-click(node: TreeNode)` لطلب الاختيار، و`toggle(node: TreeNode)` لطلب الفتح. حدّث activeKey وexpandedKeys في المشروع؛ الشجرة لا تعدل البيانات.

```ts
"node-click": [node: TreeNode];
toggle: [node: TreeNode];
```

## Slots

`node`: يستقبل `{node,level,expanded}`؛ `actions`: يستقبل `{node,level}`؛ `toggle-leading` و`toggle-trailing`: يستقبلان `{node,level,expanded,hasChildren,toggle}`. جميعها تنتقل لكل المستويات. actions توقف تصاعد النقر؛ أوقف تصاعد زر leading المخصص عند الحاجة.

```ts
node?(props: { node: TreeNode; level: number; expanded: boolean }): unknown;
actions?(props: { node: TreeNode; level: number }): unknown;
"toggle-leading"?(props: TreeToggleSlotProps): unknown;
"toggle-trailing"?(props: TreeToggleSlotProps): unknown;
```

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-tree-input-border` | `#d0d5dd` |
| `--wakeb-tree-primary` | `#087f8c` |
| `--wakeb-tree-hover-bg` | `#f2f4f7` |
| `--wakeb-tree-active-text` | `#fff` |
| `--wakeb-tree-paragraph-primary` | `#101828` |
| `--wakeb-tree-paragraph-tertiary` | `#667085` |
| `--wakeb-tree-toggle-color` | `#667085` |
| `--wakeb-tree-focus` | `#087f8c` |
| `--wakeb-tree-fallback` | `undefined (legacy adapter switch)` |

## وجهة السمات

عنصر `ul` الجذري الذي يحمل `role="tree"`. المجموعات الفرعية لا تستقبلها. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Up / Down` | التنقل بين العقد الظاهرة. |
| `Left / Right` | الطي والتوسع أو الانتقال للأصل أو الفرع بحسب الاتجاه. |
| `Home / End` | التركيز على أول أو آخر عقدة ظاهرة. |
| `Enter / Space` | تفعيل العقدة الحالية. |

## الوصول وحدود السلوك

الخصائص تستهدف ul. البيانات دون دورات وبمفاتيح نصية أو رقمية فريدة في الشجرة، والأبناء المحمّلون فقط هم المعروضون. مفاتيح الحقول مباشرة دون dotted paths. activeKey يقارن بدقة وeditingNodeId يدعم تمثيل المفتاح النصي. الجذر يستنتج مسار العنصر؛ المجموعة الداخلية تستخدم activePath. الإغلاق يزيل DOM الأبناء عبر v-if؛ احفظ مسودات التعديل في حالة المشروع. أعلى/أسفل للتنقل وHome/End للحدود وأسهم الفروع تنعكس في RTL وEnter/Space لطلب الاختيار. الفتح يظل بتحكم الأب. عناصر التحكم الداخلية تحتفظ بمفاتيحها. يوجد هدف Tab واحد لكل شجرة وعند اختفاء العنصر ينتقل لأقرب أب ظاهر أو للعنصر الظاهر السابق، والتركيز الفعلي ينتقل فقط لو كان داخل الشجرة. لا يوجد typeahead أو virtualization أو سحب أو checkboxes أو تحميل بعيد. الأسماء الافتراضية تظهر بكل المستويات؛ slots الفارغة تستخدم بديل Vue، بما فيها أزرار الفروع. الحركة تحترم reduced-motion. على PrimeVue يُستخدم markup ‏Wakeb وأنماطه وكود الشجرة المشترك نفسه على المزودين، لأن Tree في PrimeVue يعتمد خرائط مفاتيح للفتح والاختيار؛ وزر فتح الفرع الافتراضي هو WButton الخاص بـPrimeVue. على shadcn-vue يُستخدم markup ‏Wakeb وكود الشجرة المشترك نفسه، لأن shadcn-vue لا يحتوي على Tree، وTree في reka-ui يعتمد قائمة عناصر مسطّحة واختيارًا خاصًا به؛ وزر فتح الفرع الافتراضي هو WButton الخاص بـshadcn-vue ‏(data-slot=button). تستخدم ألوان النص والوصف وخلفية المرور افتراضيًا tokens الثيم المحلية في Wakeb عند وجودها، بما فيها الوضع الداكن، وتتقدم متغيرات CSS الخاصة بالمكوّن.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
