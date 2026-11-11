<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WDivider

خط فاصل أفقي أو رأسي.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="divider" />

## الاستخدام

```vue
<script setup lang="ts">
import { WDivider } from 'wakeb-components'
</script>

<template>
  <WDivider class="my-2" />
</template>
```

## أمثلة

### فاصل رأسي

يحتاج الفاصل الرأسي إلى عنصر حاوٍ بارتفاع محدد.

```vue
<script setup lang="ts">
import { WDivider } from 'wakeb-components'
</script>

<template>
  <div style="display:flex;height:48px;align-items:stretch"><span>Start</span><WDivider vertical /><span>End</span></div>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `vertical` | `boolean` | `false` | خط رأسي يمتد بارتفاع الصف. |
| `thickness` | `number \| string` | `1` | سمك الخط؛ الأرقام بالبكسل. |
| `color` | `WakebColor` | `undefined` | لون الخط: intent من Wakeb أو لون CSS. بدون قيمة يبقى لون الإطار في المزود. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

لا يوجد.



## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى عنصر الفاصل.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

العنصر role=separator ‏(hr على Vuetify) مع aria-orientation=vertical في الوضع الرأسي. ليس له هامش؛ أضف المسافات بالـclasses. لا يوجد inset ولا نص داخل الخط. على Vuetify: ‏VDivider؛ واللون يضبط الشفافية كاملة أيضًا. على PrimeVue: ‏Divider بدون هوامشه. على shadcn-vue: ‏Separator من reka-ui بتنسيق shadcn-vue.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
