# مزودات الواجهة والإعداد

::: warning إصدار تجريبي للإطار
تشرح هذه الصفحة طبقة المزودات غير المنشورة بعد (المرحلتان M1 وM2، والعمل جارٍ)، وهي ليست جزءًا من 0.7.x.
يبقى الإصدار 0.7.x خاصًا بـVuetify ولا يحتاج أي تكامل في البناء.
:::

لمكونات Wakeb واجهة Vue واحدة: نفس الاستيراد والـprops والأحداث والـslots وروابط `v-model`.
المزود (Vuetify أو PrimeVue) هو الذي يرسم المكونات. تختار المزود مرة واحدة في ملف واحد، ولا
يحتوي ملف البناء إلا على renderers هذا المزود.

## الإعداد

1. ثبّت الحزمة والـpeers الخاصة بمزود **واحد**:

| المزود | التثبيت |
| --- | --- |
| Vuetify | `npm install wakeb-components vuetify` |
| PrimeVue | `npm install wakeb-components primevue @primeuix/themes` |

أقل إصدارات الـpeers المختبرة وأحدثها مذكورة في [الإصدارات المدعومة](./installation#الإصدارات-المدعومة).
PrimeVue 5 غير مدعوم لأن رخصته أصبحت تجارية وتتطلب مفتاح ترخيص.

2. أنشئ الملف `plugins/wakeb-components.js` بجوار `vite.config.js`:

```js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'primevue', // 'vuetify' أو 'primevue'
})
```

3. أضف تكامل البناء مرة واحدة:

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { wakebComponents } from 'wakeb-components/vite'

export default defineConfig({
  plugins: [vue(), wakebComponents()],
})
```

4. ثبّت الـplugin واستورد الأنماط:

```js
import { createApp } from 'vue'
import App from './App.vue'
import wakeb from './plugins/wakeb-components.js'
import 'wakeb-components/style.css'

createApp(App).use(wakeb).mount('#app')
```

يبقى استيراد المكونات واحدًا مع كل مزود:

```vue
<script setup>
import { WButton, WModal } from 'wakeb-components'
</script>
```

## كيف يُحدَّد المزود

تقرأ `wakebComponents()` ملف الـplugin بمحلل نحوي ولا تشغّله أبدًا. الصيغة الوحيدة المقبولة:

```js
import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'vuetify', // نص ثابت
  // بقية الخيارات يمكن أن تكون أي تعبير
})
```

يمكن إعادة تسمية الاستيراد (`import { createWakebComponents as make }`)، وتُقبل صيغ TypeScript
مثل `satisfies`. الصيغ التالية تفشل بالرمز `WAKEB_CONFIG_INVALID`، وتعرض الرسالة الصيغة المقبولة:

| المرفوض | مثال |
| --- | --- |
| قيمة من البيئة | `framework: import.meta.env.VITE_UI` أو `process.env.UI ?? 'vuetify'` |
| متغير أو ثابت مستورد | `framework: UI` |
| Spread | `createWakebComponents({ ...base })` |
| مفتاح مكرر أو محسوب | `{ framework: 'a', framework: 'b' }` و`{ ['framework']: 'a' }` |
| إعادة تصدير | `export { default } from './real-plugin.js'` |
| تصدير افتراضي غير مباشر | `const plugin = createWakebComponents(...); export default plugin` |
| متغير للخيارات | `createWakebComponents(options)` |

لمسار آخر أو حزمة داخل monorepo أو ملف TypeScript مرّر `configFile` نسبيًا إلى جذر Vite:
`wakebComponents({ configFile: 'src/plugins/wakeb.ts' })`. إذا لم يوجد الملف تعرض الرسالة كل
المسارات التي بُحث فيها. تغيير `framework` يعيد تشغيل خادم التطوير، ولا يُبدَّل المزود أثناء العمل.

## نسخة المزود في التطبيق

تثبّت أغلب التطبيقات مزودها بنفسها وتضبط الـtheme الخاص به. في الوضع الافتراضي (`mode: 'auto'`)
يعيد Wakeb استخدام تلك النسخة ولا يغيّر الـtheme ولا القيم الافتراضية ولا الأيقونات ولا اللغة.

```js
export default createWakebComponents({
  framework: 'vuetify',
  providerOptions: { kind: 'vuetify', mode: 'reuse' },
})
```

| الوضع | السلوك |
| --- | --- |
| `auto` (الافتراضي) | يستخدم المزود المثبت على نفس التطبيق، وإلا يثبّت نسخة |
| `reuse` | يتطلب مزودًا مثبتًا، وإلا يفشل بـ`WAKEB_HOST_PROVIDER_MISSING` |
| `install` | يثبّت Wakeb المزود، ويفشل بـ`WAKEB_INSTALL_CONFLICT` إذا كان التطبيق قد ثبّته |

ثبّت مزودك **قبل** `app.use(wakeb)`. يجري الاكتشاف لحظة تثبيت Wakeb، فلا يُرى المزود المثبت
بعده وتتعارض نسختان. الاكتشاف خاص بكل تطبيق: Vuetify عبر خدماته المحقونة، وPrimeVue عبر
`app.config.globalProperties.$primevue`.

يحمل `providerOptions.options` خيارات المزود الأصلية، ويُستخدم فقط عندما يثبّت Wakeb المزود.
هذه الخيارات غير قابلة للنقل بين المزودات، وتُرفض مع `mode: 'reuse'`، وتُرفض أيضًا عندما يجد
وضع `auto` نسخة مثبتة لأنها ستُتجاهل. عندما يثبّت Wakeb مكتبة Vuetify يستخدم `ssr: true`،
وعندما يثبّت PrimeVue يستخدم preset ‏Aura.

## خيارات الـplugin

كل الخيارات اختيارية ما عدا `framework`. القيم غير الصالحة تفشل بالخطأ `WAKEB_CONFIG_INVALID`
مع رسالة تحدد الحقل.

```js
export default createWakebComponents({
  framework: 'vuetify',
  defaults: { WButton: { size: 'md' }, WModal: { persistent: false } },
  locale: 'ar',
  direction: 'rtl',
  theme: { mode: 'dark', tokens: { primary: '#087f8c', radius: '8px' } },
})
```

### القيم الافتراضية للمكونات

يضبط `defaults` خصائص كل نسخ المكوّن في هذا التطبيق. تُحسم قيمة كل خاصية بهذا الترتيب:

1. القيمة الممررة على المكوّن. تُعد `false` و`0` و`''` و`null` قيمًا ممررة.
2. القيمة الافتراضية في الـplugin.
3. النص المدمج الخاص بالـ`locale` المضبوط.
4. القيمة الافتراضية للمكوّن نفسه.

القيمة `undefined` تعني أن الخاصية لم تُمرَّر. وتحتفظ السمات المنطقية بمعناها في HTML، فتكون
`<WButton disabled>` بالقيمة `true` حتى لو كانت القيمة الافتراضية في الـplugin هي `false`.

القيم الافتراضية سطحية: القيمة من نوع object تحل محل القيمة الافتراضية للمكوّن ولا تُدمج
معها. تحصل كل نسخة على نسختها الخاصة، وتغيير الكائن المصدر بعد `createWakebComponents()` لا
يؤثر. وتُرفض الحالات التالية في TypeScript ووقت التشغيل:

- خصائص البيانات والـmodel: `items` و`nodes` و`tabs` و`steps` و`slides` و`config` و`user`
  و`menuItems` و`formats` و`modelValue` و`selectedTab` و`expandedKeys` و`activeKey`
  و`activePath` و`editingNodeId`.
- مستمعات الأحداث مثل `onClick`.
- دوال الاستدعاء مثل `labelFormatter`.
- `providerProps`، لأنه غير قابل للنقل ويُضبط لكل نسخة على حدة (راجع [الخصائص الأصلية](#native-props)).
- أسماء المكونات غير المعروفة. ويرفض TypeScript أيضًا الخصائص غير المعروفة وأنواع القيم الخاطئة.

تنطبق القيم الافتراضية على المكونات المستوردة من `wakeb-components`. أما المكونات التي يرسمها
Wakeb داخل مكوّن آخر، مثل زر الإغلاق في WModal، فتأخذ خصائصها من ذلك المكوّن.

### اللغة والاتجاه

يحدد `locale` (القيمة الافتراضية `'en'`) النصوص المدمجة، مثل اسم زر الإغلاق في WModal واسم
حالة WLoading. مع `'ar'` تظهر هذه النصوص بالعربية. خاصية النص أو القيمة الافتراضية في الـplugin
تتقدم دائمًا، ولا يقرأ Wakeb نسخة i18n الخاصة بالتطبيق.

الخيار `direction` مستقل عن `locale`. عند ضبطه يكتب Wakeb السمة `dir` على جذور مكوناته وعلى
محتوى الطبقات المنقولة (teleported). وعند تركه دون ضبط ترث المكونات اتجاه الصفحة.

### متغيرات الـtheme

يضبط `theme.tokens` متغيرات دلالية على جذور مكونات Wakeb ومحتوى الطبقات، وتقتصر على هذا التطبيق:

| الـtoken | المتغير | يستخدمه |
| --- | --- | --- |
| `primary` | `--wakeb-ui-primary` | خلفية WButton الأساسية، ولون `primary` في WDropdown |
| `onPrimary` | `--wakeb-ui-on-primary` | نص WButton الأساسي، وأحرف الصور الرمزية، ونص WBadge الممتلئ |
| `secondary` و`success` و`warning` و`danger` و`info` و`neutral` | `--wakeb-ui-<intent>` | خصائص الألوان المضبوطة على هذا الـintent |
| `surface` | `--wakeb-ui-surface` | خلفية WModal |
| `onSurface` | `--wakeb-ui-on-surface` | عنوان WModal |
| `muted` | `--wakeb-ui-muted` | وصف WModal |
| `border` | `--wakeb-ui-border` | حدود WModal |
| `focus` | `--wakeb-ui-focus` | إطار التركيز في WButton |
| `radius` | `--wakeb-ui-radius` | زوايا WButton وWModal |
| `spacing` | `--wakeb-ui-spacing` | الحشو الداخلي في WModal |
| `fontFamily` | `--wakeb-ui-font-family` | محتوى WModal |
| `zIndexOverlay` (رقم) | `--wakeb-ui-z-index-overlay` | ترتيب الطبقات المنقولة: WModal وWDropdown وWExportDropdown وقائمتا WAvatarStack وWBadgeStack وتلميحات Vuetify |

متغيرات المكونات مثل `--wakeb-button-primary-background` تتقدم على هذه المتغيرات. تقبل
متغيرات الألوان صيغ hex و`rgb()` و`hsl()` و`var(--…)` وأسماء الألوان، ويقبل `radius`
و`spacing` الأطوال. وتُرفض القيم التي قد تخرج من تعريف CSS.

يكتب `theme.mode: 'dark'` السمة `data-wakeb-theme="dark"` ويحوّل متغيرات السطح والنص والنص
الثانوي والحدود إلى قيم داكنة. لا يتبع Wakeb إعداد `prefers-color-scheme` ولا يحفظ الوضع.
تُطبَّق الخيارات عند تثبيت الـplugin، والتغييرات اللاحقة تتم عبر CSS عادي.

### الأيقونات

تقبل خصائص الأيقونات (`icon` و`badgeIcon` و`headerIcon` و`expandIcon` و`collapseIcon`، و`icon`
في عناصر القوائم وصيغ التصدير) قيمة من النوع `SharedIcon`، وهي واحدة مما يلي:

- **اسم** مثل `'$close'` أو `'brand-logo'`، ويُحل بالترتيب الموضح أدناه.
- **بيانات مسار SVG** (`WakebSvgIcon`): مصفوفة من نصوص المسارات أو أزواج `[path, opacity]`
  على مساحة 24×24، مثل `['M7 10l5 5 5-5z']`. والنص الذي يبدأ بـ`svg:` يُقرأ مسارًا واحدًا، مثل
  `'svg:M7 10l5 5 5-5z'`، وبذلك تبقى مدخلات SVG الحالية في Vuetify تعمل.
- **مكوّن Vue** يُرسم كما هو.

ويسجّل الخيار `icons` أسماءً خاصة بهذا التطبيق:

```js
import { h } from 'vue'
import BrandLogo from './BrandLogo.vue'

export default createWakebComponents({
  framework: 'primevue',
  icons: {
    aliases: {
      'brand-logo': BrandLogo,
      $close: ['M6 6l12 12M18 6L6 18'],
    },
    resolve: (name) => (name.startsWith('app-') ? appIcons[name.slice(4)] : undefined),
  },
})
```

| الحقل | النوع | المعنى |
| --- | --- | --- |
| `aliases` | `Record<string, WakebIconDefinition>` | أسماء مربوطة ببيانات مسار SVG أو بمكوّن |
| `resolve` | `(name: string) => WakebIconDefinition \| undefined` | يُستدعى للأسماء غير الموجودة في `aliases`؛ أعد `undefined` لمتابعة الحل |

النوع `WakebIconDefinition` إما بيانات مسار SVG أو مكوّن Vue. لا يُقبل النص قيمةً محلولة، فلا
يمكن أن يشير اسم إلى اسم آخر أو إلى HTML، ولا يرسم Wakeb الأيقونات من نصوص HTML أبدًا. ولا
تحتوي بيانات المسار إلا أوامر مسارات SVG والأرقام. وتُنسخ `aliases` عند إنشاء الـplugin، فلا
يؤثر تعديل الكائن الأصلي بعد ذلك.

يُحل الاسم بالترتيب التالي، وأول تطابق هو المعتمد:

1. البادئة `svg:`: بقية النص مسار SVG واحد.
2. `icons.aliases[name]`.
3. `icons.resolve(name)`.
4. أيقونة مدمجة في Wakeb (الجدول أدناه).
5. مجموعة الأيقونات الخاصة بالمزود المختار:
   - **Vuetify:** يُمرَّر الاسم إلى `VIcon`، فتبقى أسماء `mdi-*` وأسماء `$alias` تعمل وفق إعداد
     الأيقونات وخط الأيقونات في Vuetify لديك.
   - **PrimeVue:** تُرسم أسماء أصناف PrimeIcons (`pi pi-check` أو `pi-check`) في عنصر `<i>`.
     حمّل ملف CSS الخاص بـ`primeicons` بنفسك.
6. أي اسم آخر: مربع Wakeb البديل (أدناه).

الأيقونات المدمجة مسارات SVG بسيطة من Material Design Icons (رخصة Apache-2.0). لا تحتاج إلى
خط أيقونات، وتُرسم بالشكل نفسه مع كل المزودات:

| الاسم | الشكل | يُستخدم افتراضيًا في |
| --- | --- | --- |
| `$expand` | سهم للأسفل | مؤشر `isDropdown` في WButton، و`icon` في WAccordion، و`expandIcon` في WDropdown |
| `$collapse` | سهم للأعلى | `collapseIcon` في WDropdown |
| `$prev` و`$next` | سهم لليسار وسهم لليمين | متاحة للاستخدام |
| `$close` | علامة إغلاق | متاحة للاستخدام |
| `$loading` | ربع قوس (ثابت؛ حرّكه عبر CSS) | متاحة للاستخدام |
| `$complete` | علامة صح | متاحة للاستخدام |
| `$checkboxOn` و`$checkboxOff` | مربع محدد ومربع فارغ | متاحة للاستخدام |
| `$radioOn` و`$radioOff` | دائرة ممتلئة ودائرة فارغة | متاحة للاستخدام |

لأن الأيقونات المدمجة تسبق المزود، أصبح `$expand` و`$collapse` يُرسمان بـSVG من Wakeb تحت
Vuetify أيضًا وبالحجم نفسه. لاستخدام شكلك الخاص سجّل الاسم في `icons.aliases`، أو مرّر اسمًا من
المزود مثل `mdi-chevron-down` تحت Vuetify.

**البديل.** عندما لا يُحل الاسم ولا تملك المزود مجموعة أيقونات مطابقة، يرسم Wakeb إطار مربع
(`svg.wakeb-icon--fallback`) بالحجم واللون المطلوبين، فيحافظ العنصر على حجمه ويبقى قابلًا
للاستخدام. وفي وضع التطوير يسجّل Wakeb أيضًا `WAKEB_ICON_UNRESOLVED` مرة واحدة لكل تطبيق واسم.
وإذا أعادت `resolve` قيمة ليست بيانات مسار SVG ولا مكوّنًا، تُتجاهل مع الرمز نفسه ويستمر الحل
بالأيقونات المدمجة. ويُحذف التحذير من بناء الإنتاج.

**الحدود.**

- أسماء MDI وأسماء alias في Vuetify غير قابلة للنقل؛ فهي تُرسم تحت Vuetify فقط، وتحت PrimeVue
  يظهر مكانها المربع البديل. استخدم بيانات مسار أو مكوّنًا أو alias في `icons` عندما يجب أن تعمل
  الأيقونة مع كل المزودات.
- تستقبل slots الأيقونات (`icon` و`dropdown` و`item-icon` و`header-icon` وغيرها) القيمة التي
  مرّرتها، لا الأيقونة المحلولة.
- الأيقونات زخرفية (`aria-hidden`)، فأعطِ العناصر التي تحتوي أيقونة فقط `ariaLabel` أو `title`.
- تعمل `resolve` عند كل رسم ويجب أن تكون متزامنة. أعد القيمة نفسها للاسم نفسه، من خريطة مثلًا،
  حتى لا تُعاد إنشاء المكونات. ويحتاج تعريف المكوّن إلى دالة `render` أو `setup`، وتُرفض كائنات
  `template` التي تُترجم وقت التشغيل.
- يُقرأ الخيار `icons` مرة واحدة عند التثبيت، وهو خاص بالتطبيق، فيمكن لتطبيقين أو لطلبَي SSR
  استخدام محلِّلات مختلفة.

## مفردات الأنماط

الخصائص التي تختار نمطًا مرئيًا تقبل قيم Wakeb فقط، فتعمل القيمة نفسها مع كل المزودات. أول
مجموعة قابلة للنقل هي `variant` في WBadge وWTooltipBtn، و`badgeVariant` و`variant` الخاص
بالعناصر في WBadgeStack:

| القيمة | المعنى | الرسم في Vuetify |
| --- | --- | --- |
| `soft` | خلفية خفيفة اللون (افتراضي WBadge) | `tonal` |
| `solid` | خلفية ممتلئة | `flat` |
| `outline` | حدود دون تعبئة | `outlined` |
| `ghost` | نص فقط (افتراضي WTooltipBtn) | `text` |

عمود Vuetify ربط مبدئي لإصدار Vuetify 3.13، وقد يتغير عند إضافة اختبارات العقد المرئي، أما
قيم Wakeb فتبقى ثابتة.

ما زالت الأسماء القديمة تعمل حتى الإصدار الرئيسي التالي. في وضع التطوير يسجّل كل اسم منها
التحذير `WAKEB_DEPRECATED_VALUE` مرة واحدة لكل تطبيق ومكوّن وخاصية وقيمة:

| القيمة القديمة | البديل | ملاحظة |
| --- | --- | --- |
| `default` و`tonal` | `soft` | كانت `default` تُرسم أصلًا بالشكل `tonal` |
| `flat` | `solid` | |
| `elevated` | `solid` | الارتفاع غير قابل للنقل؛ أضف ظلًا عبر CSS |
| `outlined` | `outline` | |
| `text` و`plain` | `ghost` | لا يُحتفظ بالمظهر الباهت لـ`plain` |

القيمة غير المعروفة ترجع إلى القيمة الافتراضية للمكوّن وتسجّل `WAKEB_UNKNOWN_VALUE` في وضع
التطوير. ويُحذف التحذيران من بناء الإنتاج، لأن الكود محاط بشرط `process.env.NODE_ENV` الذي
يستبدله Vite.

### الـintents والألوان

تقبل خصائص الألوان intent من Wakeb أو لون CSS، ويرفض النوع `WakebColor` أي قيمة أخرى أثناء
الترجمة:

- الـintents: ‏`primary` و`secondary` و`success` و`warning` و`danger` و`info` و`neutral`.
- ألوان CSS: ‏`#hex` و`rgb()` و`rgba()` و`hsl()` و`hsla()` و`hwb()` و`lab()` و`lch()` و`oklab()`
  و`oklch()` و`color()` و`color-mix()` و`var(--…)` (مع قيمة احتياطية أو بدونها)، و`transparent`
  و`currentColor`.

الأسماء المجردة مثل `red` أو `error` غير قابلة للنقل، لأن Vuetify يقرؤها أسماءً من ثيمه أو من
لوحة ألوانه.

تشمل القاعدة هذه الخصائص:

- `color` في WLoading
- `avatarColor` في WAvatarStack وWUserBadge
- `color` في WSegmentedProgress
- `dotColor` في WBadge
- `dotColor` في WBadgeStack، و`color` و`dotColor` في عناصره
- `iconColor` في WAccordion

يحتفظ `iconColor` و`color` العنصر في WDropdown بمفاتيح `colorMap` الخاصة به.

يُحسب الـintent بهذا الترتيب: الـtoken الخاص به (مثل `--wakeb-ui-danger`)، ثم لون ثيم المزوّد
المختار، ثم قيمة احتياطية من Wakeb:

| الـintent | الربط في Vuetify | الربط في PrimeVue | القيمة الاحتياطية |
| --- | --- | --- | --- |
| `primary` | `--v-theme-primary` | `--p-primary-color` | `#087f8c` |
| `secondary` | `--v-theme-secondary` | لا يوجد | `#475467` |
| `success` | `--v-theme-success` | لا يوجد | `#12b76a` |
| `warning` | `--v-theme-warning` | لا يوجد | `#f79009` |
| `danger` | `--v-theme-error` | لا يوجد | `#f04438` |
| `info` | `--v-theme-info` | لا يوجد | `#2e90fa` |
| `neutral` | لا يوجد | لا يوجد | `#667085` |

دون tokens يحتفظ تطبيق Vuetify بألوان ثيمه. تأخذ أحرف الصور الرمزية لونها من
`--wakeb-avatar-text`، ثم `--wakeb-ui-on-primary`، ثم الأبيض.

تتبع أسماء ألوان المزوّد سياسة الإهمال. تحت Vuetify تبقى تُرسم كما كانت، وتسجّل
`WAKEB_DEPRECATED_VALUE` في وضع التطوير. أما تحت المزودات الأخرى فترجع إلى القيمة الافتراضية
للخاصية، وتسجّل `WAKEB_UNKNOWN_VALUE`.

`type` في WBadge مفتاح نمط من Wakeb (`WakebBadgeType`) ترسمه Wakeb CSS، ولم يعد يُرسل إلى
Vuetify بوصفه `color` للشارة. لذلك يتبع نص الشارة وأيقونتها لون نص الشارة. والنوع غير الموجود في
القائمة يُعامل كاسم لون من Vuetify، ويخضع لمعالجة الإهمال نفسها. ويملأ `variant="solid"` الشارة
باللون القوي لنوعها، ويمكن تغييره عبر `--wakeb-badge-solid-bg` و`--wakeb-badge-solid-text`.

### أسماء الـSkeleton

يستخدم `skeletonType` في WBaseSidebar، و`type` في عناصر WPageSkeleton وترويساتها، صيغة
Skeleton في Wakeb.

**الأسماء:** ‏`text` و`paragraph` و`heading` و`avatar` و`image` و`button` و`chip` و`list-item`
و`list-item-avatar` و`list-item-two-line` و`list-item-three-line` و`list-item-avatar-two-line`
و`list-item-avatar-three-line` و`table` و`table-row` و`card`.

**الصيغة:**
- تفصل الفواصل بين الأسماء.
- يمكن أن يتبع أي اسم تكرار موجب بالشكل `@N`، مثل `list-item@3`.
- الحد الأقصى للتكرار 100 لكل عنصر.
- القيمة الفارغة تعرض `text`.

**القيم غير الصالحة:**
- تُتجاهل الأسماء غير المعروفة و`@0` والأجزاء غير الصحيحة، مع `WAKEB_UNKNOWN_VALUE` في وضع
  التطوير.
- أما بقية أسماء Vuetify 3.13 (`article` و`actions` و`sentences` وغيرها) فتبقى تعمل تحت
  Vuetify مع `WAKEB_DEPRECATED_VALUE`.

**الشبكة:** تستخدم صفوف WPageSkeleton شبكة Wakeb ذات الأعمدة الاثني عشر. نقاط توقفها ثابتة:
`sm` عند 600px و`md` عند 960px و`lg` عند 1280px، ولا تغيّرها إعدادات المزوّد.
- تقبل `cols` و`sm` و`md` و`lg` القيم من `1` إلى `12`، أو `'auto'`، أو `true` التي تجعل العمود
  يتمدد.
- قيمة `cols` الفارغة تعني 12.
- تُتجاهل القيم الأخرى مع `WAKEB_UNKNOWN_VALUE`، وتأخذ `cols` في هذه الحالة القيمة 12.

## وجهة السمات {#attribute-targets}

يرسل كل مكوّن `class` و`style` و`id` و`aria-*` و`data-*` ومستمعي DOM مثل `@mouseenter` إلى
عنصر واحد فقط، وهو وجهة السمات الخاصة به. أما مستمعو الأحداث التي يعلنها المكوّن، مثل `@click`
في WButton أو `@update:modelValue` في WModal، فهي أحداث Vue: تُطلق مرة واحدة ولا تُربط بالـDOM
أيضًا. تُدمج `class` و`style` مع قيم Wakeb، وتتبع السمات الأخرى التي تحمل الاسم نفسه القواعد
التالية.

| المكوّن | وجهة السمات |
| --- | --- |
| WButton | عنصر `<button>` الأصلي على كل المزودين. أما `wrapperAttrs` فتستهدف الـdiv الخارجي للتخطيط. |
| WDropdown | العنصر الجذري `div` على كل المزودين، وليس زر الفتح ولا القائمة المنقولة. |
| WModal | العنصر الذي يحمل `role="dialog"` (ويحمل أيضًا `.wakeb-modal`) على كل المزودين، وهو منقول خارج المكوّن. |
| WLoading | الجذر الذي يحمل `role="status"` على كل المزودين. |
| WTruncatedText | عنصر `<span>` النصي الذي يفتح الـTooltip. |
| WTooltipBtn | عنصر `<button>` الأصلي. أما `wrapperAttrs` فتستهدف الـspan الخارجي. |
| WCarousel | جذر العرض المتتابع (`role="region"`). وكل مؤشر يستقبل `indicatorAttrs`. |
| WDrawer | جذر اللوحة الجانبية، وهو عنصر `<nav>` يحمل أيضًا `.wakeb-drawer`. |
| WExportDropdown | طبقة القائمة المنقولة، ولا توجد إلا أثناء فتح القائمة (للتوافق مع الإصدار الأساسي). |
| WTree | عنصر `ul` الجذري (`role="tree"`). |
| بقية المكونات | العنصر الجذري. يرسل WBadge القيمة `chipAttrs` إلى الـchip، ويرسل WBadgeStack القيمة `badgeAttrs` إلى كل شارة. |

في WButton وWDropdown وWModal وWLoading تغلب الروابط التي يملكها Wakeb على السمات: قيمة
`type` للزر، ومعالجة التعطيل والتحميل، والاسم الوصفي للنافذة، وقيمتا `role` و`aria-label`
لحالة التحميل. لتغيير هذه القيم استخدم الخصائص المكتوبة (`title` و`ariaLabel` و`label`).
ويُستثنى WButton: قيمة `aria-label` من المستخدم تسمي الزر. أما المكونات التي يرسمها Vuetify
فقط فما زالت تستخدم دمج السمات الافتراضي في Vue، فتحل السمة القادمة من المستخدم محل سمة المكوّن
التي تحمل الاسم نفسه؛ لا تمرر `role` أو قيم `aria-*` يضعها المكوّن أصلًا. وستنتقل إلى القواعد
نفسها عند نقلها.

تذكر صفحة كل مكوّن وجهة سماته في قسم **وجهة السمات**.

## الخصائص الأصلية: `providerProps` {#native-props}

::: warning غير قابل للنقل
يستقبل `providerProps` خصائص أصلية خاصة بالمزود المختار. المفاتيح نفسها لا تعني شيئًا، أو تعني
شيئًا آخر، تحت مزود آخر، وتبديل المزود لا يترجمها. فضّل الخصائص والـslots والسمات والمتغيرات
القابلة للنقل، واجعل كل استخدام سهل العثور عليه.
:::

تقبل WButton وWDropdown وWModal وWLoading الخاصية `providerProps`، وهي كائن بسيط من الخصائص
والأحداث الأصلية يمرره Wakeb إلى primitive واحد في المزود:

| المكوّن | primitive في Vuetify | primitive في PrimeVue |
| --- | --- | --- |
| WButton | `VBtn` | `Button` |
| WDropdown | `VMenu` | `Menu` |
| WModal | `VDialog` | `Dialog` |
| WLoading | `VProgressCircular` | `ProgressSpinner` |

```vue
<!-- غير قابل للنقل: Vuetify فقط. تحت PrimeVue تُتجاهل هذه المفاتيح مع تحذير. -->
<WModal v-model="open" title="تعديل" :provider-props="{ scrollable: true, onAfterEnter: track }" />

<!-- غير قابل للنقل: PrimeVue فقط. -->
<WModal v-model="open" title="تعديل" :provider-props="{ position: 'top', onShow: track }" />
```

**ما يُتجاهل.** يحذف Wakeb هذه المفاتيح في كل بناء، ويبلّغ عن كل مفتاح مرة واحدة لكل تطبيق في
وضع التطوير بالتحذير `WAKEB_PROVIDER_PROP_IGNORED`:

- السمات القابلة للنقل: `class` و`style` و`id` و`role` و`tabindex` و`aria-*` و`data-*`،
  وكذلك `key` و`ref`. مررها على المكوّن نفسه لتصل إلى وجهة سماته.
- الروابط التي يملكها Wakeb: الـmodels وكل معالج `onUpdate:*`، وحماية التحميل والتعطيل، ونوع
  العنصر، وحصر التركيز وترتيب الطبقات، والأحداث الأصلية التي تكرر حدثًا قابلًا للنقل. وتفصيلها:
  - WButton: `disabled` و`loading` و`type` و`onClick` ومفاتيح الروابط وتغيير العنصر (`href`
    و`to` و`tag` في Vuetify؛ و`as` و`asChild` إضافة إلى `label` و`badge` و`unstyled` و`pt`
    في PrimeVue).
  - WDropdown: `modelValue` و`disabled` و`zIndex` و`activator` في Vuetify؛ و`model` و`popup`
    و`autoZIndex` و`baseZIndex` و`pt` في PrimeVue.
  - WModal: `modelValue` و`persistent` و`maxWidth` و`zIndex` و`activator` و`onAfterLeave`
    و`retainFocus` و`captureFocus` و`contentProps` في Vuetify؛ و`visible` و`modal`
    و`blockScroll` و`draggable` و`closeOnEscape` و`dismissableMask` و`autoZIndex`
    و`baseZIndex` و`pt` و`onAfterHide` في PrimeVue.
  - WLoading: `indeterminate` و`modelValue` و`color` و`size` في Vuetify؛ و`strokeWidth`
    و`pt` في PrimeVue.
- المفاتيح التي لا يعلنها الـprimitive المختار كخاصية أو حدث، ومنها مستمعو DOM العاديون مثل
  `onMouseenter`. اربطها على المكوّن نفسه.

**الأولوية.** على الـprimitive تغلب روابط Wakeb أولًا، ثم السمات المُمررة على المكوّن، ثم
`providerProps`. الأحداث الأصلية التي يستخدمها Wakeb أيضًا، مثل `onShow` في النافذة، تعمل بجانب
معالج Wakeb ولا تحل محله.

**النطاق.** `providerProps` خاص بكل نسخة. ترفضه `defaults` في الـplugin في TypeScript ووقت
التشغيل (`WAKEB_CONFIG_INVALID`). نوعه `WakebProviderProps` ‏(`Record<string, unknown>`)، لذلك
تبقى تعريفات الجذر محايدة تجاه المزود ولا يفحص TypeScript المفاتيح الأصلية، بل يفحصها التحقق
وقت التشغيل مقابل الـprimitive المختار. لا يصل إلى المكونات الداخلية، مثل زر الفتح داخل
WDropdown أو زر الإغلاق داخل WModal. ولا تقبله المكونات السبعة عشر الأخرى بعد: يرفضه TypeScript،
ويُحذف وقت التشغيل مع التحذير نفسه.

## الأخطاء

| الرمز | السبب | الحل |
| --- | --- | --- |
| `WAKEB_CONFIG_INVALID` | framework أو خيار غير معروف، أو defaults أو theme أو icons غير صالحة، أو ملف plugin غير صالح أو مفقود | اتبع الرسالة، فهي تحدد الحقل أو الملف |
| `WAKEB_BUILD_PLUGIN_MISSING` | بُني التطبيق دون `wakebComponents()` | أضفها إلى plugins في Vite وأعد التشغيل |
| `WAKEB_FRAMEWORK_MISMATCH` | قيمة `framework` وقت التشغيل تختلف عن قيمة البناء | أعد تشغيل خادم التطوير أو أعد البناء |
| `WAKEB_PROVIDER_MISSING` | الـpeers الخاصة بالمزود المختار غير مثبتة | نفّذ أمر التثبيت الموجود في الرسالة |
| `WAKEB_CONTEXT_MISSING` | رُسم مكوّن دون `app.use(wakeb)` | ثبّت الـplugin على هذا التطبيق |
| `WAKEB_INSTALL_CONFLICT` | plugin ثانٍ لـWakeb على نفس التطبيق، أو وضع `install` مع مزود مثبت | استخدم plugin واحدًا لكل تطبيق |
| `WAKEB_HOST_PROVIDER_MISSING` | وضع `reuse` دون مزود مثبت | ثبّت المزود قبل Wakeb |
| `WAKEB_COMPONENT_UNSUPPORTED` | المحوّل التجريبي المختار لا يحتوي هذا المكوّن | راجع الجدول التالي |
| `WAKEB_CAPABILITY_UNSUPPORTED` | `framework: 'shadcn'` في هذا البناء | استخدم Vuetify أو PrimeVue |

الأخطاء من النوع `WakebError` ولها الخاصية `code`، ويُصدَّر النوع من `wakeb-components`.
أما تحذيرات وضع التطوير (`WAKEB_DEPRECATED_VALUE` و`WAKEB_UNKNOWN_VALUE`
و`WAKEB_ICON_UNRESOLVED` و`WAKEB_PROVIDER_PROP_IGNORED`) فهي تحذيرات في
الـconsole وليست أخطاء، وتُحذف من بناء الإنتاج.

## المكونات المدعومة

تحتوي `wakeb.capabilities.components` على المكونات التي يرسمها المحوّل المختار.

| المكوّن | Vuetify | PrimeVue (تجريبي) |
| --- | --- | --- |
| WButton وWDropdown وWModal وWLoading | مدعوم | مدعوم |
| بقية المكونات (17 مكوّنًا) | مدعوم | ليس بعد: `WAKEB_COMPONENT_UNSUPPORTED` |
| shadcn-vue | — | مخطط له (المرحلة M5) |

## حدود الإصدار التجريبي

- **نفس العقد مع DOM مختلف.** تجتاز WButton وWDropdown وWModal نفس اختبارات العقد على
  المزودين، لكن الـmarkup مختلف: يرسم PrimeVue القائمة والنافذة بعناصر الطبقة الخاصة به.
- **سمات خاصة بـVuetify.** تبقى `max-width` في WModal وبقية سمات Vuetify الأصلية واجهة توافق
  مع Vuetify فقط. على PrimeVue استخدم الخاصية `width`.
- **التلميح في PrimeVue.** يفتح تلميح WButton على PrimeVue عند مرور المؤشر فقط، ويبقى للزر
  اسم متاح لقارئ الشاشة من `title`.
- **الأنماط في PrimeVue.** يرسم WButton زر PrimeVue دون أنماطه ويعتمد على tokens ‏Wakeb.
  القائمة والنافذة تحتاجان وضع الأنماط في PrimeVue، والتطبيق الذي يفعّل `unstyled: true`
  عمومًا يجب أن يضبط أنماط هذه الطبقات بنفسه.
- **PrimeVue في أكثر من تطبيق.** يحتفظ PrimeVue بخدمة الـtheme على مستوى الوحدة، فيتشارك
  تطبيقان في الصفحة نفسها أنماط الـtheme. يبقى سياق Wakeb منفصلًا لكل تطبيق.
- **حدود نطاق الـtheme.** تصل سمات الـtheme والاتجاه (`data-wakeb-theme` و`dir` ومتغيرات
  `--wakeb-ui-*`) إلى جذور المكونات وإلى كل طبقة منقولة: نافذة WModal، وقائمتا WDropdown
  وWExportDropdown، وقائمتا العناصر الإضافية في WAvatarStack وWBadgeStack، وتلميحات WButton
  وWTooltipBtn وWTruncatedText وWAvatarStack. خصائص تنسيق الطبقة مثل `menuStyle`
  و`tooltipStyle` توضع على محتوى الطبقة داخل هذا النطاق، لذا تتقدم عليه. ويحتفظ كل تطبيق في
  الصفحة نفسها بنطاق طبقاته الخاص.
- **حدود ترتيب الطبقات.** يُطبَّق `zIndexOverlay` على كل طبقات Vuetify السابقة وعلى قائمة
  PrimeVue ونافذته. يستقبل تلميح WButton على PrimeVue سمات الـtheme، لكنه يحتفظ بترتيب
  z-index الخاص بتلميحات PrimeVue. أما WDrawer فلا يُنقل: هو عنصر تخطيط في Vuetify يُرسم في
  مكانه، فتصل سمات النطاق إلى لوحته كجذر، ويبقى z-index الخاص به للتخطيط في Vuetify الذي
  يحدد موضع الخلفية المعتمة أيضًا.
- **مستخدمو المتغيرات.** تستخدم WButton وWDropdown وWModal هذه المتغيرات، وتحتفظ بقية المكونات
  بمتغيراتها الخاصة حتى يتم نقلها. والمتغيرات الموجودة على الطبقة متاحة لأنماطك الخاصة بمحتواها.
- **غلاف المكوّن.** كل مكوّن مستورد من الجذر غلاف رقيق حول renderer المزود. أدوات الاختبار
  التي تبحث عن المكونات بالاسم، مثل `findAllComponents(WTabs)`، تجد الغلاف والـrenderer معًا.
- **الأنماط.** ما زال `style.css` يحتوي أنماط كل الـrenderers، وتقسيمه حسب المزود مخطط له.
- **WDrawer** يحتاج تخطيط تطبيق Vuetify. طبقة overlay محايدة مخطط لها (المرحلة M4).

## ما لا يغطيه تبديل المزود

تبديل المزود يغيّر طريقة رسم مكونات Wakeb فقط، ولا ينقل بقية التطبيق. قبل التبديل ابحث في
مشروعك عن:

- الاستخدام المباشر لمكونات المزود، مثل `v-data-table` أو `DataTable` في PrimeVue.
- قيم `providerProps`. مفاتيحها تخص مزودًا واحدًا، وتُتجاهل تحت مزود آخر مع التحذير
  `WAKEB_PROVIDER_PROP_IGNORED`.
- منافذ native مثل `chipAttrs`، أو `wrapperAttrs` بسمات خاصة بالمزود، أو خصائص أصلية مُمررة
  كسمات.
- الأنماط التي تستهدف classes أو DOM المزود: `.v-*` و`.p-*`.
- الـtheme وخيارات الـplugin والأيقونات والقيم الافتراضية العامة الخاصة بالمزود.
- السمات الأصلية التي يفهمها مزود واحد فقط، مثل `max-width` في Vuetify.

بحث مقترح: `rg "v-[a-z-]+|\.v-|\.p-|from 'vuetify|from 'primevue|provider-?props" src`.
وفي وضع التطوير شغّل التطبيق على المزود الجديد وابحث في الـconsole عن
`WAKEB_PROVIDER_PROP_IGNORED`: فهو يذكر كل مفتاح أصلي لا يقبله المزود الجديد.
