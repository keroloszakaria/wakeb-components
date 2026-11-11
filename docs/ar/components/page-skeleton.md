<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WPageSkeleton

صفوف Skeleton متجاوبة على شبكة Wakeb بوصف بيانات typed.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ComponentPlayground initial="page-skeleton" />

## الاستخدام

```vue
<script setup lang="ts">
import { WPageSkeleton } from 'wakeb-components'
</script>

<template>
  <WPageSkeleton :config="[{ repeat: 2, cols: 12, md: 6, variant: 'card', items: [{ type: 'text' }, { type: 'paragraph' }] }]" label="Loading report" />
</template>
```

## أمثلة

### أعمدة متجاوبة

عمودان عند md ويتراصان على الشاشات الأصغر.

```vue
<script setup lang="ts">
import { WPageSkeleton } from 'wakeb-components'
</script>

<template>
  <WPageSkeleton :config="[{ repeat: 2, cols: 12, md: 6, items: [{ type: 'heading, paragraph' }] }]" label="Loading cards" />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `config` | `readonly SkeletonRow[]` | `required` | وصف الصفوف؛ المصفوفة الفارغة تعرض حالة فارغة. راجع نماذج البيانات. |
| `direction` | `"row" \| "column"` | `"column"` | اتجاه flex للحاوية دون الاعتماد على Tailwind. |
| `label` | `string` | `"Loading content"` | اسم الحالة لقارئ الشاشة؛ ترجمه داخل المشروع. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

لا توجد slots؛ التكوين عبر config وheader/items وclasses ونقاط توقف Vuetify.



## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-skeleton-surface` | `#fff` |
| `--wakeb-skeleton-border` | `#eaecf0` |

## وجهة السمات

العنصر الجذري `div.page-skeleton` الذي يحمل `role="status"` على كل المزودين. قيمتا `role` و`aria-busy` ملك لـWakeb وتغلبان على سمات المستخدم؛ سمِّ الحالة عبر `label`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

يستخدم حالة واحدة باسم role=status وaria-busy=true مع إخفاء الصفوف الزخرفية عن ARIA لمنع تكرار القراءة؛ اعرضه أثناء التحميل فقط. repeat يُقرب لأسفل؛ القيم المفقودة وغير المحدودة والصفر والسالب تنتج عمودًا واحدًا. cols الافتراضي 12 للقيم الفارغة وفق العقد السابق. تقبل cols وsm وmd وlg القيم من 1 إلى 12 أو 'auto' أو true (تمدد) على شبكة Wakeb ذات الأعمدة الاثني عشر، ونقاط توقفها ثابتة: sm عند 600px وmd عند 960px وlg عند 1280px، ولا تغيّرها إعدادات المزوّد. القيم الأخرى تُتجاهل (وتأخذ cols القيمة 12) مع WAKEB_UNKNOWN_VALUE. الصفوف والأعمدة عناصر wakeb-grid-row وwakeb-grid-col، وليست VRow/VCol من Vuetify. type يتبع صيغة Skeleton في Wakeb: أسماء قابلة للنقل وتسلسلات بالفواصل وتكرار @N بحد أقصى 100. تُتجاهل الأسماء غير المعروفة مع WAKEB_UNKNOWN_VALUE، وتبقى أسماء Vuetify الخاصة تعمل تحت Vuetify مع WAKEB_DEPRECATED_VALUE. لا يحتاج CSS خاص بالمشروع. يضع النوع card عظام list-item ذات الصورة في النهاية بارتفاع 155px على المزودين.

**الرسم في PrimeVue.** نفس الشبكة والصيغة والأنواع والدلالات كما في Vuetify. تُتجاهل أسماء Vuetify الخاصة مع WAKEB_UNKNOWN_VALUE بدلًا من رسمها. كل عنصر صندوق `div.wakeb-skeleton` بحجم `width`/`height` (الأرقام بالـpx)، ويحتوي `.wakeb-skeleton__part--<name>` لكل اسم، مرسومًا بـ`Skeleton` من PrimeVue دون أنماطه. يلوّن CSS من Wakeb العظام بـ`--wakeb-ui-border` مع حركة موجية تتوقف مع reduced motion وتنعكس في RTL. الأحجام تقارب Vuetify 3 وليست مطابقة تمامًا.

| الاسم | العظام في PrimeVue |
| --- | --- |
| `text` | سطر واحد بعرض كامل |
| `paragraph` | ثلاثة أسطر، آخرها بعرض 60% |
| `heading` | شريط واحد بعرض 50% وارتفاع 1.5rem |
| `avatar` | دائرة واحدة بقطر 48px |
| `image` | كتلة واحدة بعرض كامل وارتفاع 200px |
| `button` | كتلة واحدة بحجم 64×36px |
| `chip` | شريحة واحدة بحجم 96×32px |
| `list-item` | سطر واحد داخل صف بارتفاع 48px |
| `list-item-avatar` | دائرة 40px وسطر واحد |
| `list-item-two-line` | سطران |
| `list-item-three-line` | ثلاثة أسطر |
| `list-item-avatar-two-line` | دائرة 40px وسطران |
| `list-item-avatar-three-line` | دائرة 40px وثلاثة أسطر |
| `table` | عنوان وخمسة صفوف من ست خلايا وسطر تذييل |
| `table-row` | ست خلايا |
| `card` | كتلة صورة بارتفاع 150px وعنوان | في shadcn-vue تطابق القواعد والشبكة وأشكال العظام ما في PrimeVue؛ وكل عظمة هي Skeleton من shadcn-vue (data-slot="skeleton" مع aria-hidden)، تنبض بـ--accent و--radius بدل موجة Wakeb، ويتوقف النبض مع reduced motion.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
