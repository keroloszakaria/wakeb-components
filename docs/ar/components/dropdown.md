<!-- Generated from docs/reference-data.mjs -->
# WDropdown

قائمة اختيار وإجراءات بزر فعلي وترجمة وألوان وروابط من المشروع.

## الاستخدام

```vue
<script setup lang="ts">
import { WDropdown } from 'wakeb-components'
</script>
<template>
  <WDropdown title="Status" :menu-items="[{ label: 'Pending', value: 0 }, { label: 'Approved', value: 1 }]" show-selected />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `menuItems` | `readonly DropdownItem[]` | `[]` | عناصر القائمة؛ الحدث يرجع نفس الكائن. |
| `title` | `string` | `undefined` | عنوان الزر قبل التنسيق. |
| `icon` | `SharedIcon` | `""` | أيقونة صريحة في زر القائمة. |
| `iconColor` | `string` | `""` | لون دلالي صريح للزر. |
| `showSelected` | `boolean` | `false` | عرض اسم الاختيار؛ له أولوية على showBoth. |
| `showBoth` | `boolean` | `false` | تنسيق العنوان والاختيار كنص واحد. |
| `iconPosition` | `"start" \| "end"` | `undefined` | موضع أيقونة الزر؛ البديل start. |
| `type` | `string` | `undefined` | نوع WButton؛ البديل primary. |
| `classList` | `ComponentClass` | `""` | classes على زر القائمة. |
| `size` | `string` | `"lg"` | حجم زر القائمة. |
| `isLinks` | `boolean` | `false` | روابط عادية لـhref أو to النصي؛ router-link داخل item-label. |
| `isLoading` | `boolean` | `false` | تعطيل القائمة والزر مع إظهار التحميل. |
| `disabled` | `boolean` | `false` | تعطيل القائمة والزر. |
| `showChevron` | `boolean` | `true` | إضافة سهم عند وجود أيقونة رئيسية. |
| `modelValue` | `NavigationKey \| null` | `undefined` | الاختيار الخارجي؛ صفر صالح وnull يحتفظ بالاختيار السابق. |
| `expandIcon` | `SharedIcon` | `"$expand"` | أيقونة القائمة المغلقة. |
| `collapseIcon` | `SharedIcon` | `"$collapse"` | أيقونة القائمة المفتوحة. |
| `labelFormatter` | `(label: string \| undefined) => string` | `label => label ?? ""` | دالة التنسيق أو الترجمة من المشروع للزر والعناصر. |
| `colorMap` | `Record<string, string>` | `undefined` | استبدال الألوان الدلالية success وdanger وwarning وprimary وinfo. |
| `menuStyle` | `CSSProperties` | `undefined` | أنماط ومتغيرات على القائمة المنقولة خارج الحاوية. |
| `providerProps` | `WakebProviderProps` | `undefined` | غير قابل للنقل. خصائص وأحداث أصلية لـprimitive القائمة (`VMenu` في Vuetify و`Menu` في PrimeVue). حالة الفتح و`disabled` وترتيب الطبقات وزر الفتح يملكها Wakeb، وفي PrimeVue أيضًا `model` و`popup` و`pt`. المفاتيح المتجاهلة تُنتج تحذيرًا في وضع التطوير. |

## الأحداث

`selectedItem(item: DropdownItem)` ثم `update:modelValue(value: NavigationKey)` عند نقر عنصر متاح، مرة لكل حدث؛ تتحدث الحالة بعدهما.

## Slots

`activator`: يستقبل `{props,isActive,buttonProps}`؛ اربط props وbuttonProps بزرّك. `item-icon`: يستقبل `{item,color}`؛ `item-label`: يستقبل `{item,text}` للروابط أو الأسماء المخصصة.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-dropdown-color-success` | `#12b76a` |
| `--wakeb-dropdown-color-danger` | `#f04438` |
| `--wakeb-dropdown-color-warning` | `#f79009` |
| `--wakeb-dropdown-color-primary` | `#087f8c` |
| `--wakeb-dropdown-color-info` | `#2e90fa` |
| `--wakeb-dropdown-activator-color` | `computed inline from selected color` |

## وجهة السمات

العنصر الجذري `div` على كل المزودين، وليس زر الفتح ولا القائمة المنقولة. خصص القائمة عبر `menuStyle`، ويستقبل slot الـactivator خصائصه الخاصة. أما `providerProps` فيذهب إلى primitive القائمة. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر.

## الوصول وحدود السلوك

الخصائص على div الخارجي. Vuetify يدير النقر الخارجي وEscape والكيبورد وزر WButton من نوع button. لا يوجد اعتماد على i18n أو router. عنوان showBoth يمر إلى labelFormatter كنص واحد مثل الأصل. مزامنة modelValue تعمل عند تغير القيمة أو menuItems فيتحدث الاسم مع البيانات الجديدة؛ null يمسح الاختيار وundefined يترك الاختيار غير المتحكم فيه كما هو. showSelected الأولي يختار عنوانًا أو أول اسم دون تمييز عنصر active. المطابقة الدقيقة للقيمة تكسب دائمًا ومقارنة الاسم بديل فقط، والصفر مدعوم. ألوان CSS الخام تعمل للعناصر؛ نص الزر يقبل المفاتيح الدلالية وvar() وhex مثل القديم. ألوان أيقونة WButton لها متغيراته المستقلة. menuStyle وcolorMap يخصصان القائمة المنقولة. الصفوف بدور menuitem داخل قائمة بدور menu. مع isLinks كل صف مفعل هو نفسه رابط من href أو to النصي، والصف المعطل أو أثناء التحميل بلا href ومعه aria-disabled. كائنات router تحتاج slot. نقر الصف المفعل يرسل الاختيار. التعطيل والتحميل يمنعان تفاعل القائمة الطبيعي.

## جرّب بنفسك

<NavigationPlayground initial="dropdown" />
