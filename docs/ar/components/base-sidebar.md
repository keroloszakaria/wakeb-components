<!-- Generated from docs/reference-data.mjs -->
# WBaseSidebar

حاوية جانبية بخلفية متدرجة وslots للبحث والمحتوى وأزرار الفلترة وحالات القائمة.

## الاستخدام

```vue
<script setup lang="ts">
import { WBaseSidebar } from 'wakeb-components'
</script>
<template>
  <WBaseSidebar title="People" :items="[{id:1,name:'Ada'}]" :has-filter="false"><template #item="{item}">{{item.name}}</template></WBaseSidebar>
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `title` | `string` | `required` | العنوان مترجم مسبقًا. |
| `loading` | `boolean` | `false` | التحميل له أولوية على القائمة والحالة الفارغة. |
| `items` | `readonly SidebarItem[]` | `[]` | عناصر العرض. |
| `skeletonType` | `string` | `"list-item-two-line, list-item-two-line, list-item-two-line"` | نوع Skeleton في Vuetify. |
| `hasFilter` | `boolean` | `true` | إظهار أزرار الفلترة الافتراضية. |
| `isFiltered` | `boolean` | `false` | إظهار زر إلغاء الفلتر. |
| `skeletonWidth` | `string \| number` | `"360px"` | عرض Skeleton. |
| `itemKey` | `string` | `"id"` | حقل المفتاح المباشر؛ البديل فهرس الصف. |
| `filterLabel` | `string` | `"Filter"` | نص زر الفلتر. |
| `cancelLabel` | `string` | `"Cancel"` | نص زر الإلغاء. |
| `emptyLabel` | `string` | `"No data"` | نص الحالة الفارغة مترجم مسبقًا. |

## الأحداث

`search(payload: unknown)` عندما يستدعي slot البحث دالة search؛ و`filterClick()` و`filterCancel()` للأزرار. لا تتغير العناصر أو schemas داخل المكوّن.

## Slots

`header-actions`: يستقبل `{isFiltered,filterClick,filterCancel}`؛ `content` و`search`: يستقبلان `{search(payload)}`؛ `item`: يستقبل `{item,index}`؛ `loading`: يستقبل `{type,width}`؛ `empty`: يستقبل `{label}`؛ `filter-modal`: دون خصائص. content يستبدل البحث والقائمة بالكامل.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-sidebar-outer-bg` | `120deg conic gradient` |
| `--wakeb-sidebar-inner-bg` | `240deg linear gradient` |
| `--wakeb-sidebar-body` | `#fff` |
| `--wakeb-sidebar-body-rgb` | `255,255,255` |
| `--wakeb-sidebar-title` | `#fff` |
| `--wakeb-sidebar-empty-color` | `#667085` |
| `--wakeb-sidebar-fallback` | `undefined (legacy adapter switch)` |

## الوصول وحدود السلوك

الخصائص على div الخارجي. الحزمة لا تملك form أو schema أو store أو ترجمة أو نافذة فلتر. وفر input أو مكتبة الفورم في search واستدعِ search(payload). Aware يحتفظ بـGenericForm وupdateSchema في adapter. دون search لا يظهر بحث افتراضي. يبقى الـheader عند استبدال المحتوى. التحميل له أولوية على الحالة الفارغة والقائمة. القائمة تحتفظ بحد أدنى 400px وأقصى 60dvh والحاوية بحد أدنى 340px؛ استبدل min-width للتصميم الأضيق. التلاشي السفلي 72px زخرفي ولا يمنع النقر. خصص الألوان عبر CSS والتحميل والحالة الفارغة عبر slots. أنماط card-gradient العامة القديمة تبقى في Aware فقط، وأنماط الحزمة scoped. هوية العنصر من حقل مباشر أو الفهرس وslot يملك التفاعل معه.

## جرّب بنفسك

<CompositionPlayground initial="base-sidebar" />
