<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WAvatarStack

صور متداخلة، مع حقول بيانات متداخلة وقائمة overflow قابلة للفتح بالكيبورد.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ComponentPlayground initial="avatar-stack" />

## الاستخدام

```vue
<script setup lang="ts">
import { WAvatarStack } from 'wakeb-components'
</script>

<template>
  <WAvatarStack :items="[{ id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Grace Hopper' }]" :max="1" show-overflow-menu overflow-label="More people" />
</template>
```

## أمثلة

### عدد العناصر الإضافية

حدد عدد الأشخاص الظاهرين؛ الباقي يظهر كعدد نصي افتراضيًا.

```vue
<script setup lang="ts">
import { WAvatarStack } from 'wakeb-components'
</script>

<template>
  <WAvatarStack :items="[{ name: 'Ada' }, { name: 'Grace' }, { name: 'Linus' }]" :max="1" />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `items` | `readonly unknown[]` | `[]` | العناصر؛ القيم المفقودة أو غير الصالحة تستخدم النص البديل. |
| `max` | `number` | `3` | العدد الظاهر؛ يُقرب لأسفل ويُحصر عند صفر. القيم غير المحدودة تستخدم 3. |
| `size` | `string \| number` | `32` | حجم الصورة: رقم أو نص رقمي بالبكسل، أو طول CSS آخر، أو اسم حجم من Vuetify ‏(x-small ‏24px وsmall ‏32px وdefault ‏40px وlarge ‏48px وx-large ‏56px). |
| `avatarColor` | `WakebColor \| WakebDeprecatedColor` | `"primary"` | خلفية الحروف والعدد الإضافي والصور. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS. لون الحروف من --wakeb-avatar-text. أسماء ألوان Vuetify المهملة (WakebDeprecatedColor مثل error أو red-darken-2) ما زالت مقبولة في TypeScript وتُعرض تحت Vuetify مع WAKEB_DEPRECATED_VALUE، وترجع المزودات الأخرى إلى القيمة الافتراضية مع WAKEB_UNKNOWN_VALUE. |
| `showOverflowMenu` | `boolean` | `false` | عرض باقي المستخدمين في قائمة زيادة (قائمة Vuetify أو Popover في PrimeVue). |
| `showTooltip` | `boolean` | `true` | تفعيل Tooltip بالتركيز أو المرور على المستخدمين الظاهرين. |
| `itemKey` | `string` | `"id"` | مسار بالنقاط لمفتاح نصي أو رقمي؛ البديل index. |
| `nameKey` | `string` | `"name"` | مسار اسم العرض. |
| `avatarKey` | `string` | `"avatar"` | مسار رابط الصورة. |
| `unknownLabel` | `string` | `"Unknown user"` | ترجمة الاسم البديل؛ الحروف المفقودة تظهر ?. |
| `overflowLabel` | `string` | `""` | الاسم المساعد للعدد الإضافي؛ الافتراضي +count. |
| `menuStyle` | `CSSProperties` | `{}` | styles ومتغيرات CSS على القائمة المنقولة إلى overlay. |
| `tooltipStyle` | `CSSProperties` | `{}` | styles على محتوى Tooltip المنقول. |

## الأحداث

لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.



## Slots

`avatar`: يستقبل `{ item, index, label, avatar, initials }` لاستبدال الصورة. `overflow`: يستقبل `{ count }` لاستبدال نص العدد.

```ts
avatar(props: { item: unknown; index: number; label: string; avatar: string; initials: string }): unknown;
overflow(props: { count: number }): unknown;
```

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-avatar-border` | `Vuetify surface / white` |
| `--wakeb-avatar-overlap` | `-10px` |
| `--wakeb-avatar-focus` | `Vuetify primary / #087f8c` |
| `--wakeb-avatar-menu-surface` | `Vuetify surface / white` |
| `--wakeb-avatar-menu-text` | `Vuetify on-surface / #101828` |
| `--wakeb-avatar-text` | `--wakeb-ui-on-primary / #fff` |

## وجهة السمات

العنصر الجذري `div.avatars-stack`. قائمة الزيادة منقولة خارج المكوّن ولا تستقبلها؛ خصصها عبر `menuStyle`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab / Enter / Space` | التركيز وتفعيل زر الباقي الأصلي عند تشغيل القائمة. عنصر div القديم ليس زر كيبورد أصليًا. |
| `Escape` | إغلاق لوحة الباقي أو التلميح المفتوح. |

## الوصول وحدود السلوك

للصور اسم مساعد كامل، وتصبح قابلة للتركيز عند تفعيل Tooltip فقط. العدد الإضافي زر فعلي عند تفعيل القائمة، يعلن aria-expanded دون aria-haspopup لأن القائمة معلوماتية فقط، ويعمل بالنقر والكيبورد والمرور من خلال Vuetify، وإلا فهو صورة نصية ثابتة. المفاتيح المكررة مسؤولية المستهلك. تُقرأ مسارات الحقول المملوكة للكائن فقط وتُعرض الأسماء كنصوص آمنة. روابط الصور تدعم http والمسار الذي يبدأ بشرطة مائلة وdata؛ التحميل يتبع المتصفح وVuetify. الحروف البديلة من أول Unicode code point لأول كلمتين. لا يحتاج i18n أو store. تخصيص القائمة المنقولة عبر menuStyle والـTooltip عبر tooltipStyle. لا تحمل القائمة والتلميحات إلا نطاق theme الخاص بالـplugin ‏(data-wakeb-theme وdir ومتغيرات --wakeb-ui-* وzIndexOverlay)، وتتقدم menuStyle وtooltipStyle عليه. في PrimeVue: تستخدم الصور مكوّن Avatar من PrimeVue بحجم وألوان من CSS الخاص بـWakeb. زر الزيادة زر HTML يفتح Popover عند المرور أو التركيز أو النقر، ويغلقه Escape أو النقر خارجه، ولا يشير إليه aria-controls إلا أثناء فتحه. الـPopover نافذة حوار غير مقيِّدة (aria-modal="false") يسميها overflowLabel، ويضعها PrimeVue أسفل الزر أو أعلاه ويضيف عناصر حصر التركيز الخاصة به. تستخدم التلميحات directive التلميح في PrimeVue، ويفتحها Wakeb أيضًا عند التركيز بالكيبورد ويغلقها عند فقدان التركيز وEscape. تحمل التلميحات نطاق theme وقيمة zIndexOverlay بدلًا من z-index تلميحات PrimeVue، ثم tooltipStyle التي تتقدم عليهما بما فيها zIndex؛ ويبقى نمط pt.directives.tooltip.root العام في PrimeVue تحتها. ويأخذ الـPopover قيمة zIndexOverlay. أسماء ألوان المزود في avatarColor غير قابلة للنقل في PrimeVue: تعود إلى primary مع WAKEB_UNKNOWN_VALUE. تحت shadcn-vue: تستخدم كل صورة Tooltip من reka-ui (عند التركيز ومرور المؤشر، ويغلقه Escape، ويُربط عبر aria-describedby ما دام مفتوحًا). الصور markup من Wakeb بصور زخرفية. تُرسم قائمة الزيادة داخل Popover من reka-ui بقواعد الفتح في Vuetify (مرور المؤشر والتركيز، والنقر يبقيها مفتوحة)، ويغلقها Escape أو الضغط خارجها. لا يأخذ الـPopover التركيز أبدًا، وله aria-modal=false وaria-label، ويشير aria-controls في الزر إلى القائمة. يحمل جذر الـPopover نطاق theme وzIndexOverlay، ودون خيار direction تكتب reka-ui السمة dir=ltr عليه. وترجع أسماء ألوان المزوّد إلى primary مع WAKEB_UNKNOWN_VALUE.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
