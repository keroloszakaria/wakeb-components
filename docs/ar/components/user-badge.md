<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WUserBadge

شارة مستخدم بصورة أو أحرف بديلة وslot للإجراءات.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<IdentityPlayground initial="user-badge" />

## الاستخدام

```vue
<script setup lang="ts">
import { WUserBadge } from 'wakeb-components'
</script>

<template>
  <WUserBadge :user="{ name: 'Ada Lovelace' }"><template #actions><button type="button">Remove</button></template></WUserBadge>
</template>
```

## أمثلة

### الحروف الأولى

عند غياب رابط الصورة تُستخدم الحروف الأولى من الاسم.

```vue
<script setup lang="ts">
import { WUserBadge } from 'wakeb-components'
</script>

<template>
  <WUserBadge :user="{ name: 'Grace Hopper' }" />
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `user` | `BadgeUser` | `{}` | بيانات العرض للاسم والصورة؛ الاسم نص آمن. |
| `type` | `WakebBadgeType \| WakebDeprecatedBadgeType` | `"outline"` | مفتاح نمط WBadge. |
| `borderRadius` | `string` | `"md"` | نصف قطر الشارة. |
| `icon` | `SharedIcon` | `""` | خاصية الأيقونة القديمة؛ الصورة تستبدل glyph. |
| `iconSize` | `string \| number` | `"xs"` | حجم glyph القديم؛ avatarSize يتحكم في الصورة. |
| `iconPosition` | `"before" \| "after"` | `"before"` | موضع الصورة بالنسبة للمحتوى. |
| `avatarSize` | `string \| number` | `16` | حجم الصورة: رقم بالبكسل أو طول CSS. أسماء أحجام Vuetify تعمل تحت Vuetify فقط. |
| `avatarColor` | `WakebColor \| WakebDeprecatedColor` | `"primary"` | خلفية حاوية الأحرف. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS. أسماء ألوان Vuetify المهملة (WakebDeprecatedColor مثل error أو red-darken-2) ما زالت مقبولة في TypeScript وتُعرض تحت Vuetify مع WAKEB_DEPRECATED_VALUE، وترجع المزودات الأخرى إلى القيمة الافتراضية مع WAKEB_UNKNOWN_VALUE. |

## الأحداث

لا توجد أحداث مخصصة؛ الأحداث العادية تستهدف حاوية الشارة.



## Slots

`avatar`: يستقبل `{ user, avatar, initials, size }`. `default`: يستقبل `{ user }` لاستبدال الاسم فقط. `actions`: بعد الاسم.

```ts
avatar?(props: { user: BadgeUser; avatar: string; initials: string; size: string | number }): unknown;
default?(props: { user: BadgeUser }): unknown;
actions?(props: { user: BadgeUser }): unknown;
```

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-user-badge-initials-size` | `8px` |
| `--wakeb-avatar-text` | `--wakeb-ui-on-primary / #fff` |

## وجهة السمات

العنصر الجذري `div.wakeb-user-badge`، وهو حاوية WBadge. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## التفاعل بالكيبورد

لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.

## الوصول وحدود السلوك

الخصائص والأحداث تستهدف حاوية WBadge ومتغيراته تخصص الشارة. الصور التي تبدأ بـhttp أو / أو data تعرض عبر VImg؛ الباقي يستخدم الأحرف. لا يوجد بديل تلقائي عند فشل تحميل الصورة، مثل الأصل. الاسم الفارغ أو — يعطي ?؛ المسافات فقط تعطي حرفًا فارغًا. الأحرف تحافظ على charAt(0) بوحدات UTF-16 لأول كلمتين. مرر كائنًا بحقول نصية؛ null غير مدعوم. الصورة زخرفية لأن الاسم بجوارها. الإجراءات تتصاعد طبيعيًا؛ أوقف التصاعد عند الحاجة. حجم الأحرف 8px يعمل دون Tailwind. تحت PrimeVue: الشارة هي renderer ‏WBadge الخاص بـPrimeVue، والصورة مكوّن Avatar من PrimeVue ‏(.wakeb-avatar) يحوي img زخرفيًا (alt="") أو الأحرف؛ وتمنحه Wakeb CSS شكل VAvatar الدائري، فيبدو بالشكل نفسه في وضعي PrimeVue بأنماط أو دونها. يحل avatarColor قيم intent من Wakeb عبر --wakeb-ui-* ثم عبر اللون الأساسي في PrimeVue لقيمة primary؛ وترجع أسماء ألوان المزود إلى primary مع WAKEB_UNKNOWN_VALUE. تحت shadcn-vue: الصورة الرمزية markup من Wakeb ‏(data-slot=avatar) بصورة زخرفية عادية، فتظهر فورًا وعلى الخادم أيضًا؛ ولا يُستخدم AvatarImage من reka-ui لأنه ينتظر تحميل الصورة. تتحول أرقام avatarSize وأسماء أحجام Vuetify إلى pixels. وترجع أسماء ألوان المزوّد إلى primary مع WAKEB_UNKNOWN_VALUE.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
