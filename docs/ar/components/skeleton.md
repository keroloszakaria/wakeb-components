<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WSkeleton

عنصر تحميل مؤقت يُرسم بقواعد skeleton المحمولة؛ وعند انتهاء التحميل يعرض الـslot الافتراضي.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="skeleton" />

## الاستخدام

```vue
<script setup lang="ts">
import { WSkeleton } from 'wakeb-components'
</script>

<template>
  <WSkeleton type="list-item-avatar-two-line@3" width="320" />
</template>
```

## أمثلة

### إظهار المحتوى

اضبط loading على false لإظهار المحتوى.

```vue
<script setup lang="ts">
import { WSkeleton } from 'wakeb-components'
</script>

<template>
  <WSkeleton :loading="false" type="paragraph"><p>Loaded content</p></WSkeleton>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `type` | `string` | `"text"` | أسماء skeleton محمولة مفصولة بفواصل (text وparagraph وheading وavatar وimage وbutton وchip وlist-item وlist-item-avatar وlist-item-two-line وlist-item-three-line وlist-item-avatar-two-line وlist-item-avatar-three-line وtable وtable-row وcard)، ويمكن أن يتبع كل اسم ‎@N (بحد أقصى 100). |
| `width` | `string \| number` | `undefined` | عرض الصندوق؛ الأرقام والنصوص الرقمية بالبكسل. |
| `height` | `string \| number` | `undefined` | ارتفاع الصندوق؛ الأرقام والنصوص الرقمية بالبكسل. |
| `loading` | `boolean` | `true` | طالما القيمة true تُرسم العظام؛ وfalse يعرض الـslot الافتراضي بدلًا منها (ولا شيء بدونه). |
| `label` | `string` | `"Loading..."` | الاسم المساعد لحالة التحميل؛ الافتراضي يتبع لغة الـplugin (بالعربية: جارٍ التحميل...). |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

`default` (بدون بيانات) هو المحتوى بعد التحميل، ويُعرض عندما تكون `loading` بقيمة false.

```ts
default?(): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات إلى جذر الـskeleton أثناء التحميل. يربط Wakeb السمات role وaria-busy وaria-label بعدها، فتبقى تحت تحكم Wakeb. وعندما تكون loading بقيمة false لا يُرسم شيء من الـskeleton ولا تُطبق السمات على محتوى الـslot.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

الجذر role=status مع aria-busy=true وaria-label، والعظام زخرفية. الأسماء غير المعروفة تُتخطى مع WAKEB_UNKNOWN_VALUE، وإذا لم يبق شيء يُرسم `text`. على Vuetify: يُرسم بـVSkeletonLoader الذي يقبل أيضًا أسماء Vuetify الخاصة (divider وarticle وsentences...) مع WAKEB_DEPRECATED_VALUE، ويُستبدل role=alert الخاص به بحالة Wakeb. على PrimeVue: أشكال العظام المشتركة في Wakeb مرسومة بـSkeleton من PrimeVue في الوضع unstyled مع موجة Wakeb؛ وتُتخطى أسماء Vuetify الخاصة. على shadcn-vue: نفس الأشكال بشكل Skeleton من shadcn-vue (لون accent وradius ونبض)؛ وتُتخطى أسماء Vuetify الخاصة. الأشكال تقارب تخطيطات Vuetify؛ الأحجام قريبة وليست مطابقة بالبكسل.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
