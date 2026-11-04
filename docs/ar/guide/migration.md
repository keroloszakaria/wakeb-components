# الانتقال من الإصدار 0.7

::: warning إصدار تجريبي للطبقة
يصف هذا الدليل إصدار المزودات غير المنشور بعد (المراحل من M1 إلى M4، قيد التنفيذ). وهو ليس جزءًا من
0.7.x. يبقى الإصدار 0.7.x خاصًا بـVuetify، ولا يحتاج ملف plugin ولا تكاملًا مع أداة البناء.
:::

إصدار المزودات إصدار **كاسر للتوافق**. تبقى أسماء المكونات وطريقة استيرادها ومعظم الـprops كما هي،
لكن تطبيقك يحتاج ملف plugin وتكاملًا واحدًا مع Vite، وتتغير بعض القيم، وأصبح جزء من السلوك مملوكًا
لـWakeb. الواجهة ثابتة *بين المزودات*، لكنها ليست مطابقة *للإصدار 0.7*.

::: warning ما لا يغطيه هذا الانتقال
الانتقال إلى إصدار المزودات، ثم تبديل المزود لاحقًا، يغيّر طريقة عرض مكونات Wakeb فقط، ولا ينقل بقية
التطبيق. تبقى الأمور التالية من مسؤوليتك:

- الاستخدام المباشر لمكونات المزود داخل التطبيق، مثل `v-data-table` أو `DataTable` من PrimeVue أو
  شيفرة shadcn-vue المنسوخة إلى التطبيق.
- قيم `providerProps` وأي منفذ آخر غير قابل للنقل.
- CSS الذي يستهدف أصناف المزود أو بنية DOM الخاصة به (`.v-*` و`.p-*` وأصناف Tailwind داخل مخرجات
  Wakeb).
- الـtheme الخاص بالمزود وخيارات الـplugin الخاصة به ومجموعات أيقوناته وقيمه الافتراضية العامة.
- الأسماء القديمة المهجورة التي لا يقبلها إلا مزود واحد (أسماء ألوان Vuetify، وأسماء Skeleton
  الخاصة بـVuetify، وأنواع الشارة خارج قائمة Wakeb).

راجع [تبديل المزود](./switching) للاطلاع على قائمة التحقق التي تكشف هذه الاستخدامات.
:::

## قائمة التحقق

نفّذ الخطوات التالية بالترتيب. كل خطوة تشير إلى القسم الذي يشرحها.

1. ارفع `vue` إلى `^3.5.40`، وثبّت `vite` `^6.0.0` ضمن تبعيات تطبيقك
   ([تبعيات peer](#peer-dependencies)).
2. أنشئ `plugins/wakeb-components.js` وفيه `framework` كنص حرفي
   ([ملف الـplugin](#plugin-file)).
3. أضف `wakebComponents()` من `wakeb-components/vite` إلى `vite.config` مرة واحدة
   ([التكامل مع Vite](#vite-integration)).
4. ثبّت المزود أولًا، ثم `app.use(wakeb)`، واستورد `wakeb-components/style.css`
   ([تثبيت الـplugin](#install-the-plugin)).
5. شغّل خادم التطوير وافتح الـconsole. عالج كل تحذير `WAKEB_*`، وابدأ بـ`WAKEB_DEPRECATED_VALUE`
   ([تحذيرات التطوير](#development-warnings)).
6. استبدل القيم المهجورة بقيم قابلة للنقل: الـvariants والألوان وأنواع الشارة وأسماء Skeleton
   ([القيم المهجورة](#deprecated-values)).
7. شغّل `vue-tsc` أو `tsc --strict`، وعالج أخطاء الأنواع الخاصة بأسماء ألوان المزود وأنواع الشارة
   والـpayloads الخاطئة للأحداث والـslots ([العقود المكتوبة بالأنواع](./providers#typed-contracts)).
8. راجع [تغييرات السلوك](#behavior-changes) في WLoading والأيقونات وWCarousel وWAccordion، وحدّث
   الاختبارات التي كانت تعتمد على السلوك القديم.
9. ابنِ نسخة الإنتاج وشغّل اختباراتك. تُحذف تحذيرات التطوير من حزمة الإنتاج، أما الأخطاء فتبقى.
10. إن كنت تنوي تبديل المزود لاحقًا، فنفّذ [قائمة تحقق التبديل](./switching#checklist).

## تبعيات peer {#peer-dependencies}

| الحزمة | 0.7 | إصدار المزودات |
| --- | --- | --- |
| `vue` | `^3.5.0`، إلزامية | `^3.5.40`، إلزامية |
| `vite` | ليست peer | `^6.0.0`، إلزامية |
| `vuetify` | `^3.13.2`، إلزامية | `^3.13.2`، اختيارية: ثبّتها عند اختيار Vuetify |
| `primevue` و`@primeuix/themes` | غير مدعومة | `^4.5.5` و`^2.0.3`، اختيارية: ثبّتها عند اختيار PrimeVue |

- **Vue 3.5.40.** تستخدم تعريفات الأنواع معامل نوع العنصر الذي أضافه Vue 3.5.40 إلى
  `DefineComponent`. مع Vue من 3.5.0 إلى 3.5.39 تُبنى المكونات وتُعرض، لكن `tsc --strict` يرفض
  التعريفات.
- **Vite.** يُختار المزود فقط عبر plugin الخاص بـVite ‏`wakebComponents()`، لذلك أصبح Vite peer
  إلزاميًا. أدوات البناء الأخرى غير مدعومة في هذا الإصدار.
- **تبعيات المزود.** ثبّت peers المزود الذي تختاره فقط، ولن يعرض npm تحذير peer بخصوص المزود
  الآخر. الإصدارات المختبرة موجودة في [الإصدارات المدعومة](./installation).

```sh
# تطبيق Vuetify
npm install wakeb-components vuetify vue@^3.5.40 vite@^6
# تطبيق PrimeVue
npm install wakeb-components primevue @primeuix/themes vue@^3.5.40 vite@^6
```

## ملف الـplugin {#plugin-file}

يحتاج الاستيراد من `wakeb-components` الآن إلى plugin. أنشئ `plugins/wakeb-components.js` بجانب
`vite.config.js`:

```js
// plugins/wakeb-components.js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'vuetify', // نص حرفي: 'vuetify' أو 'primevue'
})
```

الخيار `framework` إلزامي وليست له قيمة افتراضية. ويجب أن يكون نصًا حرفيًا، لأن تكامل البناء يقرؤه
بمحلل نحوي ولا يشغّل الملف أبدًا. القيم القادمة من البيئة والمتغيرات والـspread وإعادة التصدير تفشل
بالرمز `WAKEB_CONFIG_INVALID`. الصيغ المقبولة وكل الصيغ المرفوضة موجودة في
[المزودات والإعداد](./providers).

بقية الخيارات (`defaults` و`locale` و`direction` و`theme` و`icons` و`providerOptions`) اختيارية،
وشرحها في [المزودات والإعداد](./providers).

## التكامل مع Vite {#vite-integration}

أضف تكامل البناء مرة واحدة. يقرأ ملف الـplugin ولا يضم إلى الحزمة إلا مكونات المزود المختار:

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { wakebComponents } from 'wakeb-components/vite'

export default defineConfig({
  plugins: [vue(), wakebComponents()],
})
```

لموقع آخر أو حزمة داخل monorepo أو ملف plugin بلغة TypeScript، مرّر `configFile` نسبةً إلى جذر Vite:
`wakebComponents({ configFile: 'src/plugins/wakeb.ts' })`. بدون هذا التكامل يفشل أول مكون من Wakeb
بالرمز `WAKEB_BUILD_PLUGIN_MISSING`.

## تثبيت الـplugin {#install-the-plugin}

```js
// main.js
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import App from './App.vue'
import wakeb from './plugins/wakeb-components.js'
import 'wakeb-components/style.css'

createApp(App)
  .use(createVuetify()) // إعداد المزود الحالي، يُثبَّت أولًا
  .use(wakeb)
  .mount('#app')
```

- احتفظ بإعداد المزود الحالي وثبّته **قبل** `app.use(wakeb)`. مع القيمة الافتراضية
  `providerOptions.mode: 'auto'` يعيد Wakeb استخدام هذه النسخة ولا يغيّر الـtheme أو القيم الافتراضية
  أو الأيقونات أو اللغة الخاصة بها. أما المزود الذي يُثبَّت بعد Wakeb فلا يُكتشف.
- إن لم يكن في تطبيقك نسخة من المزود، يثبّت Wakeb واحدة. راجع أوضاع `auto` و`reuse` و`install` في
  [المزودات والإعداد](./providers) و[تبديل المزود](./switching#host-provider-modes).
- لا يسجّل `app.use(wakeb)` المكونات على مستوى التطبيق. استمر في استيرادها بالاسم:
  `import { WButton } from 'wakeb-components'`.
- المكون الذي يُعرض في تطبيق بلا plugin يفشل بالرمز `WAKEB_CONTEXT_MISSING`.

## تحذيرات التطوير {#development-warnings}

في وضع التطوير يكتب Wakeb تحذيرًا في الـconsole برمز ثابت، مرة واحدة لكل تطبيق ولكل قيمة. تُحذف
التحذيرات من نسخة الإنتاج، لأن الشيفرة محمية بـ`process.env.NODE_ENV` الذي يستبدله Vite.

| الرمز | متى يظهر | ماذا تفعل |
| --- | --- | --- |
| `WAKEB_DEPRECATED_VALUE` | قيمة من 0.7 ما زالت تعمل لإصدار رئيسي واحد: اسم variant قديم، أو اسم لون من Vuetify، أو اسم Skeleton خاص بـVuetify، أو نوع شارة خارج قائمة Wakeb | استبدلها بالقيمة المذكورة في الرسالة ([القيم المهجورة](#deprecated-values)) |
| `WAKEB_UNKNOWN_VALUE` | قيمة لا يعرفها Wakeb: variant مجهول، أو لون ليس intent ولا لون CSS تحت PrimeVue، أو جزء Skeleton مجهول أو مشوّه، أو تكرار أكبر من 100، أو امتداد عمود غير صالح | استخدم قيمة من القوائم أدناه؛ يرجع المكون إلى قيمته الافتراضية مؤقتًا |
| `WAKEB_ICON_UNRESOLVED` | اسم أيقونة لا يحلّه alias ولا resolver ولا أيقونة مدمجة ولا مجموعة أيقونات المزود | سجّل الاسم في `icons.aliases`، أو مرّر بيانات مسار SVG أو مكونًا |
| `WAKEB_PROVIDER_PROP_IGNORED` | مفتاح في `providerProps` يملكه Wakeb، أو سمة قابلة للنقل، أو لا يعرّفه المكون الأساسي للمزود المختار؛ أو `providerProps` على مكون لا يقبله بعد | استخدم الـprop أو الحدث أو السمة القابلة للنقل |

أما الرموز التالية فهي **أخطاء** لا تحذيرات، تُرمى كـ`WakebError` مع الخاصية `code` في التطوير
والإنتاج:

| الرمز | متى يظهر |
| --- | --- |
| `WAKEB_CONFIG_INVALID` | خيارات plugin غير صالحة، أو `defaults` أو theme أو icons غير صالحة، أو ملف plugin مشوّه أو مفقود |
| `WAKEB_COMPONENT_UNSUPPORTED` | الـadapter التجريبي المختار لا يعرض هذا المكون بعد (راجع جدول المكونات المدعومة في [المزودات والإعداد](./providers)) |

القائمة الكاملة لرموز الأخطاء موجودة في [المزودات والإعداد](./providers).

## القيم المهجورة {#deprecated-values}

قبِل الإصدار 0.7 بعض القيم التي لا يفهمها إلا Vuetify. يستبدلها إصدار المزودات بقيم من Wakeb تعمل
على كل المزودات. تبقى القيم القديمة صالحة لمدة **إصدار رئيسي واحد**، وتكتب `WAKEB_DEPRECATED_VALUE`
في وضع التطوير، ثم تُحذف في الإصدار الرئيسي التالي. وتخضع `customHTML` في عناصر WTabs للقاعدة نفسها:
ما زالت تُرسم على كل المزودات، وتكتب `WAKEB_DEPRECATED_VALUE` مرة واحدة لكل تطبيق، ويُستبدل بها
الـslot ‏`tab-label`.

### الـvariants

تنطبق على `variant` في WBadge وWTooltipBtn، وعلى `badgeVariant` و`variant` العناصر في WBadgeStack.
تعمل هذه الأسماء القديمة على **كل** المزودات.

| قيمة 0.7 | استخدم بدلًا منها | ملاحظة |
| --- | --- | --- |
| `default` و`tonal` | `soft` | كانت `default` تُعرض أصلًا كـ`tonal`. القيمة الافتراضية لـWBadge أصبحت `soft`. |
| `flat` | `solid` | |
| `elevated` | `solid` | الارتفاع (elevation) غير قابل للنقل؛ أضف ظلًا بـCSS |
| `outlined` | `outline` | |
| `text` و`plain` | `ghost` | لا يُحتفظ بالمظهر الباهت لـ`plain`. القيمة الافتراضية لـWTooltipBtn أصبحت `ghost`. |

```vue
<!-- 0.7 -->
<WBadge label="مسودة" variant="outlined" />
<!-- إصدار المزودات -->
<WBadge label="مسودة" variant="outline" />
```

### الألوان

تنطبق على `color` في WLoading، و`avatarColor` في WAvatarStack وWUserBadge، و`color` في
WSegmentedProgress، و`dotColor` في WBadge، و`dotColor` و`color` العناصر و`dotColor` العناصر في
WBadgeStack، و`iconColor` في WAccordion.

أصبحت props الألوان تقبل intent من Wakeb أو لون CSS:

| قيمة 0.7 (أمثلة) | استخدم بدلًا منها |
| --- | --- |
| أسماء theme في Vuetify: `primary` و`secondary` و`success` و`warning` و`info` | الـintent بالاسم نفسه |
| اسم theme في Vuetify ‏`error` | الـintent ‏`danger` |
| أسماء لوحة الألوان في Vuetify: `red` و`red-darken-2` و`grey-lighten-1` | لون CSS (`#d32f2f` أو `rgb()` أو `hsl()` أو `var(--my-color)`) أو intent |
| لون CSS | بلا تغيير |

- الـintents هي: `primary` و`secondary` و`success` و`warning` و`danger` و`info` و`neutral`. يُحل كل
  intent إلى متغيره `--wakeb-ui-<intent>`، ثم إلى لون theme المزود، ثم إلى قيمة احتياطية من Wakeb.
  راجع [المزودات والإعداد](./providers).
- تحت **Vuetify** يظل اسم اللون الخاص بـVuetify يُعرض كما كان خلال فترة الإهمال، مع
  `WAKEB_DEPRECATED_VALUE`.
- تحت **PrimeVue** لا يُفهم الاسم نفسه، فيرجع الـprop إلى قيمته الافتراضية مع `WAKEB_UNKNOWN_VALUE`.
- يرفض TypeScript أسماء ألوان المزود من الآن: نوع الـprop هو `WakebColor`.

لا ينطبق ذلك على `iconColor` و`color` العناصر في WDropdown؛ فهي تحتفظ بمفاتيح `colorMap` الخاصة بها.

صارت القيمة الافتراضية المعلنة لـ`iconColor` في WAccordion و`dotColor` في WBadge وWBadgeStack هي
`undefined` بدل `""`، لأن `""` ليست `WakebColor`. لا يتغير شيء في العرض؛ يظهر الفرق فقط للكود الذي
يقرأ القيمة الافتراضية من تعريف المكوّن.

### نوع الشارة `type`

الخاصية `type` في WBadge (وكذلك `type` العناصر في WBadgeStack و`type` في WUserBadge) مفتاح نمط من
Wakeb، نوعه `WakebBadgeType`، وترسمه CSS الخاصة بـWakeb:

`success` و`success-transparent` و`primary` و`primarybtn` و`danger` و`danger-transparent` و`warning`
و`info` و`transparent` و`dark` و`tertiary` و`outline` و`outline-secondary` و`check` و`uncheck`.

- في 0.7 كانت `type` تُمرَّر أيضًا إلى Vuetify كـ`color` للـchip. لم تعد كذلك، فيتبع نص الـchip
  وأيقونته لون نص الشارة.
- النوع الذي ليس في هذه القائمة يُعامَل كاسم لون من Vuetify: تحت Vuetify يظل يُمرَّر كلون للـchip مع
  `WAKEB_DEPRECATED_VALUE`، ويرفضه TypeScript.
- `variant="solid"` يملأ الشارة باللون القوي للنوع. يمكنك تغييره بـ`--wakeb-badge-solid-bg`
  و`--wakeb-badge-solid-text`.

### أسماء Skeleton

تنطبق على `skeletonType` في WBaseSidebar، و`type` العناصر والترويسة في WPageSkeleton.

| قيمة 0.7 | إصدار المزودات |
| --- | --- |
| اسم قابل للنقل: `text` و`paragraph` و`heading` و`avatar` و`image` و`button` و`chip` و`list-item` و`list-item-avatar` و`list-item-two-line` و`list-item-three-line` و`list-item-avatar-two-line` و`list-item-avatar-three-line` و`table` و`table-row` و`card` | بلا تغيير |
| القوائم المفصولة بفواصل وتكرارات `@N` | بلا تغيير؛ التكرار الأكبر من 100 يُقصّ إلى 100 |
| أسماء Vuetify 3.13 الأخرى: `actions` و`article` و`card-avatar` و`date-picker` و`date-picker-options` و`date-picker-days` و`date-picker-header` و`divider` و`ossein` و`sentences` و`subtitle` و`table-heading` و`table-thead` و`table-tbody` و`table-tfoot` و`table-row-divider` و`table-cell` | Vuetify فقط: تظل تُعرض مع `WAKEB_DEPRECATED_VALUE`. تحت PrimeVue تُتخطى مع `WAKEB_UNKNOWN_VALUE`. استبدلها بأقرب اسم قابل للنقل. |
| الأسماء المجهولة و`@0` والأجزاء المشوهة | تُتخطى مع `WAKEB_UNKNOWN_VALUE`؛ وإن فرغت النتيجة يُعرض `text` |

انتقلت أيضًا صفوف WPageSkeleton من `VRow`/`VCol` في Vuetify إلى شبكة Wakeb من 12 عمودًا
(`wakeb-grid-row` و`wakeb-grid-col`) بنقاط توقف ثابتة: `sm` عند 600px و`md` عند 960px و`lg` عند
1280px. لم تعد إعدادات نقاط التوقف في Vuetify تؤثر فيها. يجب نقل CSS الذي كان يستهدف `.v-row` أو
`.v-col` داخل WPageSkeleton إلى أصناف Wakeb.

## تغييرات السلوك {#behavior-changes}

تسري هذه التغييرات فورًا، ولا توجد لها أسماء قديمة بديلة.

- **يملك WLoading دلالات الحالة.** يحتفظ الجذر بـ`role="status"` وباسم يمكن الوصول إليه من الـprop
  ‏`label`. تُربط سمات المستدعي أولًا، فلم تعد سمة `role` أو `aria-label` تستبدلهما. غيّر اسم الحالة
  بـ`label` (أو بقيمة افتراضية في الـplugin أو بـ`locale: 'ar'`). تنطبق القاعدة نفسها على الروابط التي
  يملكها Wakeb في WButton وWDropdown وWModal؛ راجع [وجهة السمات](./providers#attribute-targets).
- **الأيقونات المدمجة تتقدم تحت Vuetify.** أصبحت `$expand` و`$collapse` تعرض أسهم SVG الخاصة بـWakeb
  على كل المزودات، ومنها Vuetify، بدل الشكل القادم من مجموعة أيقونات Vuetify في تطبيقك. تُستخدم في مؤشر
  `isDropdown` في WButton، و`icon` في WAccordion، و`expandIcon`/`collapseIcon` في WDropdown. للاحتفاظ
  بشكلك الخاص سجّل الاسم في الـplugin: `icons: { aliases: { $expand: MyChevron } }` (مكون أو بيانات مسار
  SVG)، أو مرّر اسمًا من المزود مثل `mdi-chevron-down` إلى الـprop تحت Vuetify. بقية الأسماء ما زالت
  تُعرض عبر `VIcon` في Vuetify. راجع [المزودات والإعداد](./providers).
- **التشغيل التلقائي في WCarousel مملوك لـWakeb.** يدير Wakeb مؤقت التنقل على كل المزودات، وتحت
  Vuetify يُعطَّل `cycle` الخاص بـ`VCarousel`. يتوقف التنقل الآن مؤقتًا أثناء وجود المؤشر فوق
  الـcarousel أو مؤشرات الشرائح، وأثناء وجود التركيز داخل أي منهما، وعندما تكون الصفحة مخفية، وكلما فضّل
  المستخدم تقليل الحركة. كل تغيير للشريحة يعيد تشغيل `interval` كاملًا. الاختبارات التي تقدّم مؤقتات
  وهمية أثناء المرور أو التركيز على الـcarousel يجب أن تتوقع بقاءه على الشريحة نفسها.
- **لوحة WAccordion منطقة مسماة.** عند تحديد `title` تحمل اللوحة `role="region"` و`aria-label` بقيمة
  العنوان. وبدون عنوان لا تحمل أي role كما كان سابقًا. يحتفظ زر الترويسة بـ`aria-expanded`
  و`aria-controls`.
- **عقود محايدة مكتوبة بالأنواع.** نوع كل مكون جذري يأتي من عقد محايد لا يرتبط بمزود. يرفض `vue-tsc`
  الآن المعالجات وتفكيك الـslots التي لا تطابق الـpayloads المعلنة، وأسماء ألوان المزود، وأنواع الشارة
  خارج `WakebBadgeType`. أنواع العقود مثل `ButtonEmits` و`ModalSlots` و`WakebComponentEmits` مُصدَّرة.
  راجع [العقود المكتوبة بالأنواع](./providers#typed-contracts).
- **السمات الأصلية غير قابلة للنقل.** السمات التي لا يفهمها إلا Vuetify، مثل `max-width` على WModal،
  ما زالت تصل إلى Vuetify، لكنها لا تفعل شيئًا تحت PrimeVue. استخدم الـprops المكتوبة (`width`)، أو
  `providerProps` عندما لا يوجد prop قابل للنقل.

::: warning غير قابل للنقل: `providerProps`
تقبل WButton وWDropdown وWModal وWLoading الخاصية `providerProps`، وهي props أصلية للمكون الأساسي
لدى المزود المختار. هذه القيم **غير قابلة للنقل**: تحت مزود آخر تُتجاهل المفاتيح مع
`WAKEB_PROVIDER_PROP_IGNORED`. استخدمها فقط عندما لا يوجد prop قابل للنقل.

```vue
<!-- غير قابل للنقل: Vuetify فقط. -->
<WModal v-model="open" title="تعديل" :provider-props="{ scrollable: true }" />
```
:::

## أنواع الأيقونات {#icon-types}

لم يعد `SharedIcon` يشير إلى Vuetify. الأيقونة الآن اسم نصي، أو بيانات مسار SVG ‏(`WakebSvgIcon`،
وأصبحت `readonly`)، أو مكوّن Vue ‏(`WakebIconComponent`)؛ وحُذف النوع `JSXComponent` الخاص بـVuetify.

- **خصائص الأيقونات** تقبل كل قيم 0.7، فلا يلزم أي تغيير عند تمرير الأيقونات.
- **حمولات الـslots والأحداث التي تحمل أيقونة** (`IconSlotProps.icon`، والحدث `selectedItem` في
  WDropdown، وslots الأيقونة والعنوان في WButton وWBadge وWBadgeStack وWTooltipBtn وWDropdown
  وWExportDropdown وWTabs وWAccordion) تحمل الآن النوع المحايد. الكود الذي يعامل هذه الأيقونة
  كـ`JSXComponent` من Vuetify، أو يعدّل مصفوفة مسار SVG مباشرة، لم يعد يجتاز فحص الأنواع. انسخ
  المصفوفة قبل تعديلها، واعرض الأيقونة عبر خصائص الـslot نفسها بدل الاعتماد على داخليات Vuetify.

## ما لم يتغير بعد

- **تقرير تطوير بالقيم غير القابلة للنقل.** لا يوجد تقرير موحد بعد. استخدم تحذيرات الـconsole وأنماط
  البحث في [تبديل المزود](./switching#checklist).

## سجل adapters في Aware ‏(0.1–0.7)

توثّق الأقسام التالية كيف احتفظ Aware بمسارات الاستيراد الخاصة به عبر adapters توافقية أثناء نقل
المكونات إلى هذه الحزمة. وهي تصف 0.7.x وما قبله.

### 0.1–0.2

تحافظ أول دفعة على مسارات التطبيق الحالية كـadapters صغيرة:

| المسار الحالي | المكون المشترك |
| --- | --- |
| components/common/TruncatedText.vue | WTruncatedText |
| components/common/SegmentedProgress.vue | WSegmentedProgress |
| components/common/SemiCircleGauge.vue | WSemiCircleGauge |
| `components/common/AvatarStack.vue` | `WAvatarStack` |
| `components/common/Loading.vue` | `WLoading` |
| `components/common/PageSkeleton.vue` | `WPageSkeleton` |
| `components/common/VerticalSteps.vue` | `WVerticalSteps` |

تربط adapters ألوان Aware بمتغيرات الحزمة وتحافظ على props الافتراضية.
لا تحتاج الشاشات الحالية تغيير الاستيراد. تستورد المشاريع الجديدة المكونات
بالاسم من wakeb-components وتختار ألوانها وثيمها.

يظل حصر النسب واختصار النص ورسم المقاسات الصحيحة كما كان. المكون العام
يحمي أيضًا من المقاسات والسمك غير الصالح، ويدمج أحداث المستهلك مع أحداث
Vuetify للوصول بالكيبورد. هذه تحسينات دفاعية موثقة ولا تغير منطق العمل.

تظل الأزرار وbadges والنماذج والجداول وlayouts والصلاحيات والبيانات والثيم
في Aware. تحتاج الدفعة التالية مراجعة مستقلة لاعتمادياتها وواجهتها العامة.


دفعة 0.2 تضيف تحسينات دفاعية: max والتكرار لا يقبلان السالب أو القيم غير المحدودة، وأسماء المستخدمين غير الصالحة تستخدم نصًا بديلًا. أيقونات الخطوات في Aware تبقى SvgIcon عبر slots. ألوان قائمة الصور تُمرر عبر menuStyle لأن Vuetify ينقلها خارج حاوية المكون. لا توجد ترجمة أو store داخل الحزمة.


### 0.3.0

Button وBadge وAccordion أصبحوا adapters أيضًا. SvgIcon يظل في Aware عبر slots، وCSS صغير يربط tokens المشروع بمتغيرات الحزمة مرة واحدة، ويحتفظ بسلوك CSS الأصلي عندما يكون token مفقودًا. مسارات الاستيراد وprops القديمة ثابتة، بما فيها loading وisLoading وform/action وclassList وترتيب الأيقونات. header الافتراضي في adapter يحتفظ بـspan القديم؛ زر العنوان القابل للكيبورد هو افتراضي WAccordion للمشاريع الجديدة. أزرار المؤشر تحصل على أسماء ARIA وحالة الفتح دون تغيير النقر أو المظهر. actions توقف تصاعد النقر، والمحتوى يستخدم v-show.

| المسار | المكون |
| --- | --- |
| components/common/Button.vue | WButton |
| components/common/Badge.vue | WBadge |
| components/common/Accordion.vue | WAccordion |


### 0.4.0

BadgeStack وUserBadge وTooltipBtn أصبحوا adapters. صور الدوائر الظاهرة في المجموعة تظل DetectionTypeIcon الخاص بثيم Aware، وصور القائمة تظل img عادية. حاوية القائمة div القديمة وتقصير الأسماء وتخصيص كل عنصر ونصف القطر والشفافية محفوظة. WBadgeStack العام يوفر زر قائمة HTML افتراضيًا وmenuStyle وbadgeAttrs لتنسيق القائمة المنقولة. UserBadge يحتفظ بصورة 16px والأحرف عبر charAt وترتيب actions وتصاعد الأحداث. TooltipBtn يترجم path من i18n المشروع ويحتفظ بـpath كاسم ARIA القديم، مع تمرير attrs للحاوية والزر كما كان، بما فيه سلوك المستمعين والتصاعد القديم. WTooltipBtn العام يستقبل text مترجمًا ويمرر الأحداث والخصائص للزر مرة واحدة. استخدم العقد العام الأبسط في المشاريع الجديدة.

| المسار | المكون |
| --- | --- |
| components/common/BadgeStack.vue | WBadgeStack |
| components/common/UserBadge.vue | WUserBadge |
| components/common/TooltipBtn.vue | WTooltipBtn |


### 0.5.0

Tabs وTree وDropdown يحتفظون بمسارات الاستيراد في Aware. Tabs يمرر slots المحتوى ويترك تعديل لون SvgIcon داخل shadow DOM في adapter المشروع فقط. التنسيق والألوان تنتقل إلى متغيرات namespaced مع الحفاظ على سلوك tokens المفقودة. التركيب ومزامنة الأب لا يرسلان updateTab. Tree يحتفظ بالتحكم الخارجي في الفتح والاختيار وخطوط الربط والتعديل وslots. أسماء العناصر تظهر بكل الأعماق؛ slots الفارغة تستخدم بديل Vue مثل الأصل. WTree العام يضيف ARIA وتنقلًا بالكيبورد. Aware يستخدم keyboardNavigation=false للاحتفاظ بالتركيز الحالي. Dropdown يترجم عنوان الزر كاملًا من i18n المشروع ويعرض router-link وSvgIcon عبر slots؛ ألوان Aware وترتيب selectedItem ثم update:modelValue محفوظان.

| المسار | المكون |
| --- | --- |
| components/common/Tabs.vue | WTabs |
| components/common/Tree.vue | WTree |
| components/common/Dropdown.vue | WDropdown |


### 0.6.0

Carousel وExportDropdown وBaseSidebar يحتفظون بمسارات Aware الحالية. Carousel يظل بجذرين ويتجاهل خصائص fragment كما كان؛ hideDelimiters=true القديم يتحول إلى showIndicators=true، والمؤشرات تحتفظ بغياب type القديم. المشاريع الجديدة تستخدم showIndicators بمعناه المباشر ومؤشرات من نوع button. ExportDropdown يترك directive الصلاحيات على زر Aware الفعلي ويحافظ على أسماء SvgIcon والترجمة وقيمة select النصية. الحزمة العامة تختار الصيغة فقط؛ الصلاحيات وتوليد الملف في المشروع. BaseSidebar يترك GenericForm وsearchSchema وemitOnChange وupdateSchema داخل Aware عبر search slot. Tokens التدرج والأنماط العامة القديمة وأزرار وأيقونات الفلترة والترجمة في adapter. مواضع header وcontent وitem وfilter-modal وحالات التحميل والفراغ محفوظة.

| المسار | المكون |
| --- | --- |
| components/common/Carousel.vue | WCarousel |
| components/common/ExportDropdown.vue | WExportDropdown |
| components/common/BaseSidebar.vue | WBaseSidebar |

### النوافذ (0.7.0)

Modal وDrawer يحتفظان بمسارات Aware. يقابل isCloseable/ isLoading/ isDataLoaded خصائص closable/loading/dataLoaded في الحزمة، وcustomAction يقابل عكس showActions. يحافظ Modal على ظهور الرأس القديم وزخرفته وSvgIcon وترجمة الإغلاق؛ Drawer يحافظ على أسماء drawer-panel وتوقيت close من الزر فقط. إعدادات jervis-form تستمر في استخدام adapters؛ AddEditModal وschema والتحقق وخطوات الحفظ والصلاحيات وdrawerTarget غير المستخدم تبقى كما هي. العرض النصي في Drawer يستخدم parseInt كما كان.
