<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WPopover

لوحة غير مشروطة مرتبطة بزر فتح، للفلاتر والنماذج الصغيرة التي تبقى مفتوحة أثناء العمل فيها.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<FormsPlayground initial="popover" />

## الاستخدام

```vue
<script setup lang="ts">
import { WPopover } from 'wakeb-components'
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <WPopover v-model="open" aria-label="Filters">
    <template #activator="{ props }"><button type="button" v-bind="props">Filters</button></template>
    <template #default="{ close }"><button type="button" @click="close">Done</button></template>
  </WPopover>
</template>
```

## أمثلة

### إغلاق صريح

اربط props الخاصة بالزر واستعمل close من slot للإغلاق.

```vue
<script setup lang="ts">
import { WPopover } from 'wakeb-components'
</script>

<template>
  <WPopover aria-label="Help" :close-on-content-click="false"><template #activator="{ props }"><button type="button" v-bind="props">Help</button></template><template #default="{ close }"><p>Helpful details</p><button type="button" @click="close">Done</button></template></WPopover>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | حالة الفتح. بدونها يحتفظ المكوّن بحالته، وكل تغيير محلي يرسل حدثًا واحدًا. |
| `location` | `WakebPopoverLocation` | `"bottom start"` | الجانب والمحاذاة المنطقية بالنسبة لزر الفتح؛ start وend يتبعان الاتجاه. |
| `offset` | `number` | `0` | المسافة بالبكسل بين زر الفتح واللوحة. |
| `disabled` | `boolean` | `false` | لا يفتح؛ وتعطيله أثناء الفتح يغلقه. |
| `closeOnContentClick` | `boolean` | `false` | الإغلاق بعد أي نقرة داخل اللوحة. |
| `ariaLabel` | `string` | `undefined` | اسم مقروء ومترجم للوحة. |
| `contentClass` | `ComponentClass` | `undefined` | أصناف CSS على اللوحة. |
| `contentStyle` | `CSSProperties` | `undefined` | أنماط مباشرة على اللوحة، تُطبّق أخيرًا. |

## الأحداث

`update:modelValue(value: boolean)` عندما يغيّر زر الفتح أو دالة `close` أو Escape أو النقر خارج اللوحة أو `disabled` حالة الفتح. تغيير الأب للموديل لا يرسل حدثًا.

```ts
"update:modelValue": [value: boolean];
```

## Slots

`activator {props,isActive}`: اربط `props` على الزر؛ فهي تفتح اللوحة وتغلقها وتحمل aria-haspopup="dialog" وaria-expanded وaria-controls. `default {close}`: محتوى اللوحة؛ استدعِ `close()` لإغلاقها.

```ts
activator?(props: { props: Record<string, unknown>; isActive: boolean }): unknown;
default?(props: { close: () => void }): unknown;
```

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-popover-background` | `var(--wakeb-ui-surface, rgb(var(--v-theme-surface, 255, 255, 255)))` |
| `--wakeb-popover-border` | `0` |
| `--wakeb-popover-radius` | `4px` |
| `--wakeb-popover-shadow` | `Vuetify menu elevation` |

## وجهة السمات

على Vuetify تمر السمات إلى VMenu. على PrimeVue وshadcn-vue تصل السمات إلى span المحيط بزر الفتح، وتشمل class وstyle وid وdata-* ومستمعي DOM؛ ولا تصل إلى اللوحة أو الزر داخل slot. استخدم contentClass وcontentStyle للوحة وprops الخاصة بـactivator للزر. تُنقل اللوحة (.wakeb-popover) إلى body مع نطاق الثيم وzIndexOverlay.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Enter / Space` | تفعيل زر أصلي مرتبط بـprops الخاصة بالمشغل. |
| `Escape` | إغلاق النافذة. |

## الوصول وحدود السلوك

اللوحة role=dialog غير مشروطة مع aria-modal=false واسم ariaLabel. ينتقل التركيز إلى اللوحة عند فتحها، ولا يُحصر Tab داخلها، ويغلقها Escape والنقر خارجها، ويعود التركيز إلى زر الفتح عند إغلاقها من داخلها. النقر داخل اللوحة لا يغلقها إلا مع closeOnContentClick. على Vuetify: تُرسم بـVMenu. على PrimeVue: تُرسم بـPopover الذي يضع اللوحة أسفل زر الفتح ويقلبها للأعلى عند ضيق المساحة، فلا ينطبق location وoffset إلا جزئيًا، ويُلف زر الفتح في span من نوع inline-block. على shadcn-vue: تُرسم بـPopover من reka-ui وPopoverContent من shadcn-vue، ويُلف زر الفتح في span من نوع inline-block. الفتح بالمرور والسهم والسلوك المشروط المتداخل ليست جزءًا من العقد.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
