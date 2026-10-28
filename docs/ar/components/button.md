<!-- Generated from docs/reference-data.mjs -->
# WButton

زر Vuetify بحالات واضحة وslots للأيقونات ومتغيرات ألوان مستقلة.

## الاستخدام

```vue
<script setup lang="ts">
import { WButton } from 'wakeb-components'
</script>
<template>
  <WButton title="Save changes" action="submit" type="primary" />
</template>
```

## المدخلات

| المعامل | النوع | الافتراضي | الوصف |
| --- | --- | --- | --- |
| `isTooltip` | `boolean` | `false` | فرع زر الأيقونة مع Tooltip نصه title. |
| `location` | `"top" \| "bottom" \| "start" \| "end"` | `"top"` | موضع Tooltip. |
| `title` | `string` | `""` | نص آمن؛ title الفارغ يستخدم content slot. |
| `classList` | `ComponentClass` | `""` | classes على الزر الفعلي. |
| `iconPosition` | `"start" \| "end"` | `"start"` | موضع الأيقونة حول العنوان. |
| `type` | `string` | `"primary"` | الأنواع primary/secondary/outline/danger/tertiary/link/icon/table-icon/text؛ القيم الأخرى تضيف classes فقط. |
| `size` | `string` | `"lg"` | المقاسات xl/lg/md/sm؛ القيم الأخرى تحتاج CSS من المستهلك. |
| `isLoading` | `boolean` | `false` | مؤشر تحميل Vuetify مع تنسيق التحميل العام. |
| `isDropdown` | `boolean` | `false` | إضافة dropdown slot أو أيقونة Vuetify $expand. |
| `action` | `"button" \| "submit" \| "reset"` | `"button"` | نوع زر HTML الفعلي. |
| `disabled` | `boolean` | `false` | حالة تعطيل HTML. |
| `icon` | `SharedIcon` | `""` | أيقونة Vuetify أو القيمة الممررة إلى icon slot. |
| `iconSize` | `string \| number` | `"sm"` | xs/sm/md/lg/xl تعني 16/20/24/32/40px؛ free يستخدم افتراضي Vuetify. |
| `maxIconWidth` | `string \| number` | `"100%"` | أقصى عرض للأيقونة؛ الرقم يُحول إلى px في العرض الافتراضي. |
| `iconColorType` | `"danger" \| "primary" \| "success" \| "warning" \| "currentColor"` | `"currentColor"` | لون دلالي للأيقونة من متغيرات CSS المستقلة. |
| `customIconColor` | `string` | `""` | لون صريح للأيقونة وله الأولوية. |
| `wrapperAttrs` | `Record<string, unknown>` | `{}` | attributes صريحة لحاوية div الخارجية؛ attributes العادية تصل إلى الزر. |

## الأحداث

`click(event: MouseEvent)` — الحدث الأصلي مرة واحدة لكل تفعيل.

## Slots

`icon` و`dropdown`: يستقبلان `{ icon, size, color, maxWidth }`. `content` أو `default` كبديل: محتوى عند فراغ title وisTooltip=false. وضع Tooltip يعرض الأيقونة فقط. العرض الافتراضي يستخدم VIcon؛ جهز مجموعة/خط أيقونات Vuetify في المشروع أو استخدم slots.

## متغيرات CSS

| المتغير | الافتراضي |
| --- | --- |
| `--wakeb-button-danger-background` | `#d92d20` |
| `--wakeb-button-danger-border` | `transparent` |
| `--wakeb-button-danger-color` | `#fff` |
| `--wakeb-button-danger-disabled-background` | `#eaecf0` |
| `--wakeb-button-danger-disabled-border` | `#eaecf0` |
| `--wakeb-button-danger-disabled-color` | `#98a2b3` |
| `--wakeb-button-danger-disabled-opacity` | `.5` |
| `--wakeb-button-danger-focus-outline` | `#087f8c` |
| `--wakeb-button-danger-hover-background` | `#b42318` |
| `--wakeb-button-danger-hover-border` | `transparent` |
| `--wakeb-button-danger-loading-background` | `#d92d20` |
| `--wakeb-button-danger-svg` | `currentColor` |
| `--wakeb-button-disabled-text` | `#667085` |
| `--wakeb-button-fallback` | `not defined (normal per-token defaults)` |
| `--wakeb-button-icon-background` | `transparent` |
| `--wakeb-button-icon-color` | `#344054` |
| `--wakeb-button-icon-hover-background` | `transparent` |
| `--wakeb-button-icon-hover-color` | `#344054` |
| `--wakeb-button-icon-primary` | `#087f8c` |
| `--wakeb-button-icon-success` | `#12b76a` |
| `--wakeb-button-icon-warning` | `#f79009` |
| `--wakeb-button-link-color` | `#344054` |
| `--wakeb-button-link-disabled-opacity` | `.5` |
| `--wakeb-button-link-focus-outline` | `#087f8c` |
| `--wakeb-button-link-hover-color` | `#344054` |
| `--wakeb-button-link-svg` | `currentColor` |
| `--wakeb-button-outline-background` | `transparent` |
| `--wakeb-button-outline-border` | `transparent` |
| `--wakeb-button-outline-color` | `#344054` |
| `--wakeb-button-outline-danger-text` | `#b42318` |
| `--wakeb-button-outline-disabled-background` | `#eaecf0` |
| `--wakeb-button-outline-disabled-border` | `#eaecf0` |
| `--wakeb-button-outline-disabled-color` | `#98a2b3` |
| `--wakeb-button-outline-focus-outline` | `#087f8c` |
| `--wakeb-button-outline-hover-background` | `transparent` |
| `--wakeb-button-outline-hover-border` | `transparent` |
| `--wakeb-button-outline-loading-background` | `transparent` |
| `--wakeb-button-outline-svg` | `currentColor` |
| `--wakeb-button-primary-background` | `#087f8c` |
| `--wakeb-button-primary-border` | `transparent` |
| `--wakeb-button-primary-color` | `#fff` |
| `--wakeb-button-primary-disabled-background` | `#eaecf0` |
| `--wakeb-button-primary-disabled-border` | `#eaecf0` |
| `--wakeb-button-primary-disabled-color` | `#98a2b3` |
| `--wakeb-button-primary-focus-outline` | `#087f8c` |
| `--wakeb-button-primary-hover-background` | `#066b75` |
| `--wakeb-button-primary-hover-border` | `transparent` |
| `--wakeb-button-primary-loading-background` | `#087f8c` |
| `--wakeb-button-primary-loading-border` | `transparent` |
| `--wakeb-button-primary-svg` | `currentColor` |
| `--wakeb-button-radius` | `12px` |
| `--wakeb-button-secondary-background` | `#f2f4f7` |
| `--wakeb-button-secondary-border` | `transparent` |
| `--wakeb-button-secondary-color` | `#344054` |
| `--wakeb-button-secondary-disabled-background` | `#eaecf0` |
| `--wakeb-button-secondary-disabled-border` | `#eaecf0` |
| `--wakeb-button-secondary-disabled-color` | `#98a2b3` |
| `--wakeb-button-secondary-focus-outline` | `#087f8c` |
| `--wakeb-button-secondary-hover-background` | `#f2f4f7` |
| `--wakeb-button-secondary-hover-border` | `transparent` |
| `--wakeb-button-secondary-loading-background` | `#f2f4f7` |
| `--wakeb-button-secondary-surface` | `#f2f4f7` |
| `--wakeb-button-secondary-svg` | `currentColor` |
| `--wakeb-button-secondary-text` | `#344054` |
| `--wakeb-button-size-lg-font-size` | `1rem` |
| `--wakeb-button-size-lg-gap` | `6px` |
| `--wakeb-button-size-lg-padding` | `10px 16px` |
| `--wakeb-button-size-md-font-size` | `.875rem` |
| `--wakeb-button-size-md-gap` | `4px` |
| `--wakeb-button-size-md-padding` | `10px 14px` |
| `--wakeb-button-size-sm-font-size` | `.75rem` |
| `--wakeb-button-size-sm-gap` | `4px` |
| `--wakeb-button-size-sm-padding` | `8px 12px` |
| `--wakeb-button-size-xl-font-size` | `1.125rem` |
| `--wakeb-button-size-xl-gap` | `6px` |
| `--wakeb-button-size-xl-padding` | `12px 18px` |
| `--wakeb-button-table-icon-background` | `transparent` |
| `--wakeb-button-table-icon-color` | `#344054` |
| `--wakeb-button-table-icon-delete-background` | `transparent` |
| `--wakeb-button-table-icon-delete-border` | `transparent` |
| `--wakeb-button-table-icon-delete-color` | `#344054` |
| `--wakeb-button-table-icon-edit-background` | `transparent` |
| `--wakeb-button-table-icon-edit-border` | `transparent` |
| `--wakeb-button-table-icon-edit-color` | `#344054` |
| `--wakeb-button-table-icon-radius` | `8px` |
| `--wakeb-button-table-icon-restore-background` | `transparent` |
| `--wakeb-button-table-icon-restore-border` | `transparent` |
| `--wakeb-button-table-icon-restore-color` | `#344054` |
| `--wakeb-button-table-icon-unlock-background` | `transparent` |
| `--wakeb-button-table-icon-unlock-border` | `transparent` |
| `--wakeb-button-table-icon-unlock-color` | `#344054` |
| `--wakeb-button-table-icon-view-background` | `transparent` |
| `--wakeb-button-table-icon-view-border` | `transparent` |
| `--wakeb-button-table-icon-view-color` | `#344054` |
| `--wakeb-button-tertiary-background` | `transparent` |
| `--wakeb-button-tertiary-border` | `transparent` |
| `--wakeb-button-tertiary-color` | `#344054` |
| `--wakeb-button-tertiary-disabled-background` | `#eaecf0` |
| `--wakeb-button-tertiary-disabled-border` | `#eaecf0` |
| `--wakeb-button-tertiary-disabled-color` | `#98a2b3` |
| `--wakeb-button-tertiary-focus-outline` | `#087f8c` |
| `--wakeb-button-tertiary-hover-background` | `transparent` |
| `--wakeb-button-tertiary-loading-background` | `transparent` |
| `--wakeb-button-tertiary-svg` | `currentColor` |
| `--wakeb-button-text-color` | `#344054` |
| `--wakeb-button-text-focus-outline` | `#087f8c` |
| `--wakeb-button-text-hover-color` | `#344054` |

## الوصول وحدود السلوك

الزر يحتفظ بـform/type والتعطيل وaria-busy من Vuetify. click يمرر MouseEvent الأصلي مرة واحدة ويدعم .stop/.prevent. التفعيل بالكيبورد يتبع المتصفح. زر الأيقونة يحتاج aria-label؛ زر Tooltip يستخدم title كاسم بديل. أحداث التركيز تُدمج مع أحداث Vuetify. التحميل يمنع تفاعل المؤشر العادي عبر Vuetify/CSS، وإرسال حدث صناعي ليس بديلًا لقفل الطلبات. attribute باسم loading يصل أيضًا إلى VBtn دون إضافة class الخاصة بـisLoading. reduced-motion يلغي transitions المشتركة. div الخارجية مخصصة للتخطيط؛ wrapperAttrs لا يغيّر وجهة attributes العادية. الأنواع والمقاسات غير المعروفة classes للتوسعة. متغير --wakeb-button-fallback مخصص للتوافق؛ اتركه غير معرف لاستخدام القيم الافتراضية.

## جرّب بنفسك

<FoundationPlayground initial="button" />
