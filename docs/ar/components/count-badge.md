<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WCountBadge

عدد أو نقطة مثبتة على ركن العنصر الذي تغلفه، مثل الإشعارات غير المقروءة على أيقونة الجرس.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="count-badge" />

## الاستخدام

```vue
<script setup lang="ts">
import { WCountBadge, WButton } from 'wakeb-components'
</script>

<template>
  <WCountBadge content="5" label="5 unread notifications"><WButton type="outline" aria-label="Notifications">🔔</WButton></WCountBadge>
</template>
```

## أمثلة

### مؤشر نقطة

أضف للنقطة اسمًا واضحًا يشرح معناها.

```vue
<script setup lang="ts">
import { WCountBadge, WButton } from 'wakeb-components'
</script>

<template>
  <WCountBadge dot label="Unread notifications"><WButton title="Inbox" /></WCountBadge>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `content` | `number \| string` | `undefined` | العدد أو نص قصير. الأعداد الصحيحة الأكبر من max تظهر بالشكل max+؛ والقيمة الفارغة تخفي المؤشر إلا مع dot. |
| `max` | `number` | `99` | أكبر عدد يظهر كما هو. |
| `dot` | `boolean` | `false` | يعرض نقطة صغيرة بلا نص بدلًا من العدد. |
| `color` | `WakebColor` | `"danger"` | لون المؤشر: intent من Wakeb أو لون CSS. |
| `visible` | `boolean` | `true` | القيمة false تخفي المؤشر وتبقي العنصر المغلف. |
| `label` | `string` | `undefined` | الاسم المساعد للمؤشر، مثل "5 إشعارات غير مقروءة". وبدونه يكون الاسم هو النص الظاهر. |
| `location` | `CountBadgeLocation` | `"top end"` | الركن: top end أو top start أو bottom end أو bottom start. يتبع end وstart اتجاه النص؛ والقيم غير المعروفة تعود إلى top end. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

`default` (بدون بيانات) هو العنصر المغلف، مثل زر أيقونة.

```ts
default?(): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى جذر الغلاف.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

المؤشر role=status مع aria-live=polite، فتعلن قارئات الشاشة تغيّر العدد؛ ولا يسمي العنصر المغلف الذي يحتاج اسمًا خاصًا به. على Vuetify: ‏VBadge؛ والنقطة بلا label تبقي اسم Vuetify الافتراضي "Badge"، والمؤشر المخفي يبقى في DOM مع display none. على PrimeVue: ‏Badge من PrimeVue بموضع من Wakeb. على shadcn-vue: شارة بتنسيق shadcn-vue بموضع من Wakeb. على PrimeVue وshadcn-vue تكون النقطة بلا label مخفية عن التقنيات المساعدة (aria-hidden) ولا يُرسم المؤشر المخفي.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
