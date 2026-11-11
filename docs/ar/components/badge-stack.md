<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WBadgeStack

مجموعة شارات بتخصيص لكل عنصر وأيقونات قابلة للاستبدال وقائمة زيادة اختيارية.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<IdentityPlayground initial="badge-stack" />

## الاستخدام

```vue
<script setup lang="ts">
import { WBadgeStack } from 'wakeb-components'
</script>

<template>
  <WBadgeStack :items="[{ id: 1, label: 'Administrator' }, { id: 2, label: 'Reviewer' }]" show-overflow-menu overflow-label="More roles" />
</template>
```

## أمثلة

### حد العناصر الظاهرة

اعرض الباقي كعدد دون قائمة.

```vue
<script setup lang="ts">
import { WBadgeStack } from 'wakeb-components'
</script>

<template>
  <WBadgeStack :items="[{ label: 'Admin' }, { label: 'Reviewer' }]" :max="1" />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `items` | `readonly BadgeStackItem[]` | `[]` | عناصر تحمل الاسم ورابط الصورة واللون وتخصيصات الشارة. |
| `max` | `number` | `1` | حد العناصر الظاهرة؛ استخدم عددًا صحيحًا محدودًا لا يقل عن صفر. |
| `truncateLength` | `number` | `12` | طول الاسم الظاهر شامل النقاط؛ أسماء قائمة الزيادة كاملة. |
| `showOverflowMenu` | `boolean` | `false` | تفعيل قائمة زيادة حقيقية عند hover أو النقر أو الكيبورد على +N (قائمة Vuetify أو Popover في PrimeVue). |
| `badgeType` | `WakebBadgeType \| WakebDeprecatedBadgeType` | `"transparent"` | نوع WBadge الافتراضي. |
| `badgeVariant` | `BadgeProps["variant"]` | `"soft"` | نمط كل الشارات وشارة +N، ويتقدم عليه variant الخاص بكل عنصر. الأسماء القديمة تعطي تحذيرًا في وضع التطوير. |
| `badgeBorderRadius` | `string` | `"md"` | نصف القطر الافتراضي. |
| `customBorderRadius` | `string` | `"sm"` | القيمة القديمة تمر كما هي؛ استخدم طول CSS صالحًا في المشاريع الجديدة. |
| `badgePadding` | `string` | `""` | حشو الشارة المخصص. |
| `dotColor` | `WakebColor` | `undefined` | لون النقطة الافتراضي. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS. تتبع color وdotColor في العناصر القاعدة نفسها. |
| `badgeClassList` | `ComponentClass` | `""` | classes على كل chip. |
| `isDot` | `boolean` | `false` | إظهار نقطة الحالة افتراضيًا. |
| `iconSize` | `string \| number` | `"xs"` | حجم glyph؛ أبعاد الصور تحددها أنماط المجموعة. |
| `iconPosition` | `"before" \| "after"` | `"before"` | موضع الأيقونة أو الصورة داخل الشارة. |
| `iconVariant` | `"default" \| "circle"` | `"default"` | صورة عادية أو حاوية دائرية. |
| `iconBackgroundOpacity` | `number` | `1` | قوة لون الدائرة، بين صفر وواحد. |
| `customOverflowBorderRadius` | `string` | `"999px"` | نصف قطر +N عندما يفتح قائمة. |
| `overflowLabel` | `string` | `""` | الاسم المقروء لزر القائمة؛ البديل +N. |
| `overflowTag` | `"button" \| "div"` | `"button"` | زر HTML افتراضيًا؛ div لتوافق المشاريع القديمة. |
| `menuStyle` | `CSSProperties` | `undefined` | أنماط ومتغيرات على القائمة المنقولة خارج الحاوية. |
| `badgeAttrs` | `Record<string, unknown>` | `undefined` | خصائص حاوية كل WBadge، حتى صفوف القائمة؛ تجنب استبدال خصائص المحتوى. |

## الأحداث

لا توجد أحداث مخصصة. أحداث الحاوية تتصاعد طبيعيًا؛ حالة القائمة تديرها طبقة المزود (قائمة Vuetify أو Popover في PrimeVue).



## Slots

`icon`: يستقبل `{ item, index, overflow, variant, style }` ويستبدل حاوية الصورة كاملة. `badgeIcon`: للأيقونات غير المصورة. `label`: يستقبل `{ item, text, overflow }`. الفهرس داخل الجزء الظاهر أو المخفي.

```ts
icon?(props: BadgeStackIconSlotProps): unknown;
badgeIcon?(props: { item: BadgeStackItem; icon: SharedIcon | undefined; size: string | number }): unknown;
label?(props: { item: BadgeStackItem; text: string; overflow: boolean }): unknown;
```

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-badge-stack-overflow-background` | `#fff` |
| `--wakeb-badge-stack-overflow-color` | `#101828` |
| `--wakeb-badge-stack-menu-surface` | `Vuetify surface` |
| `--wakeb-badge-stack-icon-background` | `#087f8c` |
| `--wakeb-badge-stack-focus` | `#087f8c` |
| `--wakeb-badge-stack-fallback` | `not defined (legacy menu adapter switch)` |

## وجهة السمات

حاوية flex الجذرية `div.badge-stack`. كل شارة تستقبل `badgeAttrs`، وقائمة الزيادة المنقولة لا تستقبل أيًّا منهما. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab / Enter / Space` | التركيز وتفعيل زر الباقي الأصلي عند تشغيل القائمة. عنصر div القديم ليس زر كيبورد أصليًا. |
| `Escape` | إغلاق لوحة الباقي أو التلميح المفتوح. |

## الوصول وحدود السلوك

الخصائص العادية تستهدف حاوية flex. لا يوجد اعتماد على بيانات العمل أو theme أو registry للأيقونات. متغيرات WBadge متاحة أيضًا. خصص ألوان القائمة عبر menuStyle وbadgeAttrs لأن Vuetify ينقلها خارج الحاوية؛ لا تحمل القائمة إلا نطاق theme الخاص بالـplugin وzIndexOverlay، وتتقدم menuStyle عليه. الصور زخرفية ولا توجد خدمة لجلبها أو تلوين خاص بنوع الاكتشاف. تخصيص العنصر يحترم false والقيم الفارغة. max يحافظ على Array.slice والحساب القديم؛ الأعداد السالبة والكسرية وغير المحدودة إعدادات غير مدعومة. التقصير بوحدات UTF-16 من Wakeb Utils. القائمة تعرض الأسماء كاملة. customOverflowBorderRadius يخص زر القائمة فقط؛ +N الثابت يستخدم customBorderRadius. شكل الأيقونة الدائري يطبق أيضًا على القائمة المنقولة، وزر الزيادة لا يُعلن كقائمة أوامر لأن القائمة معلوماتية. قواعد أحجام الزيادة والدائرة القديمة محفوظة. الزر الافتراضي يدعم التركيز وEnter/Space وEscape من Vuetify؛ div القديم لا يضيف tab stop. في PrimeVue: تُفتح قائمة الزيادة داخل Popover بنفس قواعد الفتح (المرور دائمًا، والنقر يفتح ويغلق مع الزر، وdiv القديم يُفتح بالمرور فقط). يغلقها Escape والنقر خارجها، وتحمل نطاق theme وzIndexOverlay، وتتقدم menuStyle على القائمة. الشارات هي WBadge الخاص بـPrimeVue: أصناف type وvariant ومتغيرات --wakeb-badge-* متطابقة، لكن الـDOM عنصر Tag من PrimeVue وليس VChip، ونوع الشارة غير المعرّف في Wakeb يعود إلى primary مع WAKEB_UNKNOWN_VALUE. أيقونات الشارات تمر عبر محلل أيقونات Wakeb. تحت shadcn-vue: تُرسم قائمة الزيادة داخل Popover من reka-ui: يفتحها مرور المؤشر، ويبدّلها الزر بالنقر، ويفتحها الـdiv القديم بمرور المؤشر فقط، ويغلقها Escape أو الضغط خارجها. لا تأخذ التركيز أبدًا، ولها aria-modal=false وaria-label، ويشير aria-controls في زر الفتح إلى القائمة. يحمل جذر الـPopover نطاق theme وzIndexOverlay، ودون خيار direction تكتب reka-ui السمة dir=ltr عليه.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
