<!-- Generated from docs/reference-data.mjs -->
# WTree

شجرة متداخلة يتحكم فيها المشروع مع خطوط الربط وslots وتنقل بالكيبورد.

## الاستخدام

```vue
<script setup lang="ts">
import { WTree } from 'wakeb-components'
</script>
<template>
  <WTree :nodes="[{ id: 1, name: 'Team', children: [{ id: 2, name: 'Member' }] }]" :expanded-keys="[1]" aria-label="Teams" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
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

## Slots

`node`: يستقبل `{node,level,expanded}`؛ `actions`: يستقبل `{node,level}`؛ `toggle-leading` و`toggle-trailing`: يستقبلان `{node,level,expanded,hasChildren,toggle}`. جميعها تنتقل لكل المستويات. actions توقف تصاعد النقر؛ أوقف تصاعد زر leading المخصص عند الحاجة.

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

## الوصول وحدود السلوك

الخصائص تستهدف ul. البيانات دون دورات وبمفاتيح نصية أو رقمية فريدة في الشجرة، والأبناء المحمّلون فقط هم المعروضون. مفاتيح الحقول مباشرة دون dotted paths. activeKey يقارن بدقة وeditingNodeId يدعم تمثيل المفتاح النصي. الجذر يستنتج مسار العنصر؛ المجموعة الداخلية تستخدم activePath. الإغلاق يزيل DOM الأبناء عبر v-if؛ احفظ مسودات التعديل في حالة المشروع. أعلى/أسفل للتنقل وHome/End للحدود وأسهم الفروع تنعكس في RTL وEnter/Space لطلب الاختيار. الفتح يظل بتحكم الأب. عناصر التحكم الداخلية تحتفظ بمفاتيحها. يوجد هدف Tab واحد لكل شجرة ويتغير عند اختفاء العنصر. لا يوجد typeahead أو virtualization أو سحب أو checkboxes أو تحميل بعيد. الأسماء الافتراضية تظهر بكل المستويات؛ slots الفارغة تستخدم بديل Vue، بما فيها أزرار الفروع. الحركة تحترم reduced-motion.

## جرّب بنفسك

<NavigationPlayground initial="tree" />
