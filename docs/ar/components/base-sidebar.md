<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WBaseSidebar

حاوية جانبية بخلفية متدرجة وslots للبحث والمحتوى وأزرار الفلترة وحالات القائمة.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<CompositionPlayground initial="base-sidebar" />

## الاستخدام

```vue
<script setup lang="ts">
import { WBaseSidebar } from 'wakeb-components'
</script>

<template>
  <WBaseSidebar title="People" :items="[{id:1,name:'Ada'}]" :has-filter="false"><template #item="{item}">{{item.name}}</template></WBaseSidebar>
</template>
```

## أمثلة

### حالة فارغة

خصص empty slot لعرض رسالة مفيدة.

```vue
<script setup lang="ts">
import { WBaseSidebar } from 'wakeb-components'
</script>

<template>
  <WBaseSidebar title="People" :items="[]" :has-filter="false"><template #empty>No people yet.</template></WBaseSidebar>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `title` | `string` | `required` | العنوان مترجم مسبقًا. |
| `loading` | `boolean` | `false` | التحميل له أولوية على القائمة والحالة الفارغة. |
| `items` | `readonly SidebarItem[]` | `[]` | عناصر العرض. |
| `skeletonType` | `string` | `"list-item-two-line, list-item-two-line, list-item-two-line"` | صيغة Skeleton في Wakeb: أسماء قابلة للنقل تفصلها فواصل، ويمكن أن يتبع كل اسم @N (بحد أقصى 100). |
| `hasFilter` | `boolean` | `true` | إظهار أزرار الفلترة الافتراضية. |
| `isFiltered` | `boolean` | `false` | إظهار زر إلغاء الفلتر. |
| `skeletonWidth` | `string \| number` | `"360px"` | عرض Skeleton. |
| `itemKey` | `string` | `"id"` | حقل المفتاح المباشر؛ البديل فهرس الصف. |
| `filterLabel` | `string` | `"Filter"` | نص زر الفلتر. |
| `cancelLabel` | `string` | `"Cancel"` | نص زر الإلغاء. |
| `emptyLabel` | `string` | `"No data"` | نص الحالة الفارغة مترجم مسبقًا. |

## الأحداث

`search(payload: unknown)` عندما يستدعي slot البحث دالة search؛ و`filterClick()` و`filterCancel()` للأزرار. لا تتغير العناصر أو schemas داخل المكوّن.

```ts
search: [payload: unknown];
filterClick: [];
filterCancel: [];
```

## Slots

`header-actions`: يستقبل `{isFiltered,filterClick,filterCancel}`؛ `content` و`search`: يستقبلان `{search(payload)}`؛ `item`: يستقبل `{item,index}`؛ `loading`: يستقبل `{type,width}`؛ `empty`: يستقبل `{label}`؛ `filter-modal`: دون خصائص. content يستبدل البحث والقائمة بالكامل.

```ts
"header-actions"?(props: { isFiltered: boolean; filterClick: () => void; filterCancel: () => void }): unknown;
content?(props: { search: (payload: unknown) => void }): unknown;
search?(props: { search: (payload: unknown) => void }): unknown;
item?(props: { item: SidebarItem; index: number }): unknown;
loading?(props: { type: string; width: string | number }): unknown;
empty?(props: { label: string }): unknown;
"filter-modal"(): unknown;
```

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

## وجهة السمات

العنصر الجذري `div.wakeb-base-sidebar`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

الخصائص على div الخارجي. الحزمة لا تملك form أو schema أو store أو ترجمة أو نافذة فلتر. وفر input أو مكتبة الفورم في search واستدعِ search(payload). Aware يحتفظ بـGenericForm وupdateSchema في adapter. دون search لا يظهر بحث افتراضي. يبقى الـheader عند استبدال المحتوى. التحميل له أولوية على الحالة الفارغة والقائمة. القائمة تحتفظ بحد أدنى 400px وأقصى 60dvh والحاوية بحد أدنى 340px؛ استبدل min-width للتصميم الأضيق. التلاشي السفلي 72px زخرفي ولا يمنع النقر. خصص الألوان عبر CSS والتحميل والحالة الفارغة عبر slots. أنماط card-gradient العامة القديمة تبقى في Aware فقط، وأنماط الحزمة scoped. هوية العنصر من حقل مباشر أو الفهرس وslot يملك التفاعل معه. على PrimeVue: نفس الـmarkup والـslots والمتغيرات، وأزرار الفلتر هي WButton على PrimeVue. يرسم هيكل التحميل أسماء الهياكل المحمولة بعناصر Skeleton من PrimeVue داخل منطقة واحدة بدور role=alert وaria-live=polite واسمها "Loading..." (وبالعربية "جارٍ التحميل...")، مطابقة لدلالات محمّل Vuetify. الأسماء الخاصة بـVuetify تُتجاوز هناك مع WAKEB_UNKNOWN_VALUE، ويستقبل slot التحميل التسلسل الموحد على المزودين. على shadcn-vue: نفس الـmarkup والـslots والمتغيرات، وأزرار الفلتر هي WButton على shadcn-vue، ويستخدم هيكل التحميل عناصر Skeleton من shadcn-vue داخل منطقة role=alert نفسها وبالاسم نفسه، وتُتجاوز الأسماء الخاصة بـVuetify بالطريقة نفسها. يستخدم سطح المحتوى ولون النص tokens السطح والنص المحلية في Wakeb عند وجودها، بما فيها الوضع الداكن، وتتقدم --wakeb-sidebar-body.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
