<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# WList

قائمة صفوف بعناوين، ويمكن جعلها قابلة للنقر.

::: info نسخة تجريبية 0.8.0-alpha.0
تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.
:::

## معاينة

تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).

<ElementsPlayground initial="list" />

## الاستخدام

```vue
<script setup lang="ts">
import { WList } from 'wakeb-components'
import { ref } from 'vue'
import type { ListItem } from 'wakeb-components'
const selected = ref<ListItem | null>(null)
const open = (item: ListItem) => { selected.value = item }
</script>

<template>
  <WList interactive aria-label="Account" :items="[{ title: 'Profile', value: 'profile' }]" @select="open" />
</template>
```

## أمثلة

### محتوى عنصر مخصص

استخدم item لمحتوى غير تفاعلي مع الحفاظ على دلالة القائمة.

```vue
<script setup lang="ts">
import { WList } from 'wakeb-components'
</script>

<template>
  <WList :items="[{ title: 'Profile', value: 'profile' }]" aria-label="Account"><template #item="{ item }"><strong>{{ item.title }}</strong></template></WList>
</template>
```

## الخصائص

| الخاصية | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `items` | `readonly ListItem[]` | `[]` | الصفوف: `{ title, subtitle?, value?, icon?, disabled? }`؛ والنصوص مترجمة من المشروع. |
| `density` | `"default" \| "comfortable" \| "compact"` | `undefined` | ارتفاع الصف. بدون قيمة يبقى الافتراضي للمزود. |
| `interactive` | `boolean` | `false` | يجعل الصفوف المتاحة قابلة للنقر وترسل select. |
| `ariaLabel` | `string` | `undefined` | الاسم المساعد للقائمة. |

## الأحداث

`select(item: ListItem)` عند تفعيل صف متاح في قائمة قابلة للنقر.

```ts
select: [item: ListItem];
```

## Slots

`item` يستقبل `{ item, index }` ويستبدل نص الصف. `prepend` يستقبل `{ item, index }` ويستبدل الأيقونة في بدايته.

```ts
item?(props: { item: ListItem; index: number }): unknown;
prepend?(props: { item: ListItem; index: number }): unknown;
```

## متغيرات CSS

لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.

## وجهة السمات

تصل السمات والمستمعات العادية إلى عنصر القائمة (role=list).

## التفاعل بالكيبورد

| المفتاح | السلوك |
| --- | --- |
| `Tab / Enter / Space` | التركيز وتفعيل صف مفعل. يستخدم Vuetify عنصر listitem قابلًا للتركيز، ويستخدم PrimeVue وshadcn-vue أزرارًا أصلية داخل listitems. |

## الوصول وحدود السلوك

القائمة role=list وصفوفها listitem؛ وليست أداة اختيار (لا توجد حالة active أو selected) وليست قائمة أوامر. مفتاح الصف هو value وإلا ترتيبه. على Vuetify: ‏VList وVListItem؛ والصفوف القابلة للنقر عناصر قائمة ينقل Vuetify التركيز بينها بالأسهم. على PrimeVue وshadcn-vue: ‏markup من Wakeb، ‏ul من صفوف li؛ والصفوف القابلة للنقر أزرار أصلية يُوصل إليها بـTab، والصفوف المعطلة أزرار معطلة. أيقونات الصفوف تُحل مثل باقي أيقونات Wakeb.

---

لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).
