# سجل التغييرات

## غير منشور (إصدار تجريبي للإطار)

تغيير غير متوافق: الاستيراد من جذر الحزمة يتطلب الآن ملف plugin والدالة `wakebComponents()` من `wakeb-components/vite`. استمر على 0.7.x لاستخدام Vuetify وحده دون تكامل في البناء.

- إضافة `createWakebComponents({ framework })` وتكامل البناء `wakeb-components/vite` ورموز أخطاء `WakebError` وبيانات `capabilities`.
- يقرأ تكامل البناء قيمة framework من ملف الـplugin دون تشغيله، ولا يضم إلا renderers المزود المختار. الصيغ غير المدعومة تفشل برسالة واضحة.
- أوضاع المزود `auto` و`reuse` و`install` تعيد استخدام نسخة Vuetify أو PrimeVue في التطبيق دون تغيير الـtheme أو القيم الافتراضية.
- محوّل PrimeVue 4 تجريبي لـWButton وWDropdown وWModal وWLoading، وبقية المكونات تعلن `WAKEB_COMPONENT_UNSUPPORTED`.
- لم يعد `SharedIcon` يشير إلى أنواع Vuetify.
- قيم `defaults` لكل مكوّن في الـplugin، تتقدم عليها الخصائص الممررة، وتُرفض فيها خصائص البيانات والـmodel ودوال الاستدعاء.
- نصوص مدمجة بالعربية مع `locale: 'ar'`، والخيار `direction`، والخيار `theme` مع `mode` ومتغيرات `--wakeb-ui-*` المقتصرة على كل تطبيق وطبقاته.
- تغيير غير متوافق: تستخدم WBadge وWTooltipBtn وWBadgeStack قيم `variant` القابلة للنقل `soft` و`solid` و`outline` و`ghost`. الأسماء القديمة تعمل مع تحذير `WAKEB_DEPRECATED_VALUE` في وضع التطوير، ويفقد `elevated` الارتفاع ويفقد `plain` مظهره الباهت.
- تغيير غير متوافق: تقبل خصائص الألوان intent من Wakeb أو لون CSS (`WakebColor`). يُحسب الـintent عبر tokens ‏`--wakeb-ui-*` ثم ثيم المزوّد، فيحتفظ تطبيق Vuetify غير المضبوط بألوانه. وتبقى أسماء ألوان Vuetify تعمل تحت Vuetify مع تحذير `WAKEB_DEPRECATED_VALUE`.
- تغيير غير متوافق: ترسم Wakeb CSS وحدها `type` في WBadge، ولم يعد يُرسل إلى Vuetify كلون للشارة، ويملأ `solid` الشارة بلون النوع. أُضيفت tokens للـintents والمتغيرات `--wakeb-avatar-text` و`--wakeb-badge-solid-bg` و`--wakeb-badge-solid-text`.
- تغيير غير متوافق: يتبع `skeletonType` في WBaseSidebar وأنواع WPageSkeleton صيغة Skeleton في Wakeb. الحد الأقصى للتكرار 100، وتُتجاهل الأسماء غير المعروفة مع `WAKEB_UNKNOWN_VALUE`.

## غير منشور (0.7.x)

- إصلاح WSegmentedProgress بحيث لا يؤثر طول النص على نسبة الجزء الممتلئ.
- WDropdown: المطابقة الدقيقة للقيمة تكسب على الاسم، والبيانات الجديدة تحدّث الاسم المعروض، و`null` يمسح الاختيار، والصفوف بأدوار menu، والروابط المعطلة بلا `href`.
- أدوار menu في WExportDropdown. قوائم الزيادة المعلوماتية في WAvatarStack وWBadgeStack لم تعد تُعلن كقوائم أوامر، وشكل الأيقونة الدائري يصل للقائمة المنقولة.
- ربط تبويبات WTabs باللوحات بمعرّفات فريدة، وWTree يعيد التركيز لعنصر ظاهر عند اختفاء العنصر المركّز.
- تحميل WButton يمنع click وإرسال الفورم في الوضعين، ومتغيرات حالات الزر الثانوي ومتغيرات الخلفية واللون الموثقة أصبحت تعمل.
- WModal يعرض الرأس بالوصف وحده، ويحترم max-width الأصلية عند غياب width.
- بناء التوثيق يبني المكتبة قبل تجهيز ملف التنزيل ويتأكد أن متغيرات CSS الموثقة مستخدمة، والتحقق من النشر يقارن بإيصال البناء المحلي والـcommit.
- تحديث Vite إلى 6.4.5.

## 0.7.0

إضافة WModal وWDrawer لحاويات النوافذ مع تحميل مستقل وslots وإغلاق ومتغيرات CSS. Aware يحتفظ بـAddEditModal وGenericForm وschema والتحقق والصلاحيات وزخرفة الرأس وربط الثيم. يستمر سلوك Dialog الأصلي للتركيز وEscape والتمرير، وسلوك Drawer الأصلي.

## 0.6.0

- إضافة WCarousel وWExportDropdown وWBaseSidebar بخصائص typed وتحكم في الشرائح وصيغ تصدير وslots مستقلة عن الفورم.
- إبقاء صلاحيات Aware وGenericForm والترجمة وSvgIcon وtokens التدرج ومعنى المؤشرات القديم في adapters.
- اختبارات فعلية للتشغيل التلقائي والقوائم وSkeleton والتوافق وتوثيق تفاعلي بالعربي والإنجليزي.

## 0.5.0

- إضافة WTabs وWTree وWDropdown بخصائص typed وslots، مع فصل الترجمة والتوجيه عن الحزمة.
- الحفاظ على اختيار Aware وخطوط الشجرة وحالة التعديل والأيقونات وترتيب أحداث القائمة عبر adapters.
- تنقل بالكيبورد للشجرة واختبارات Vuetify ومستهلك SSR ومتصفح وأمثلة حية بالعربي والإنجليزي.

## 0.4.0

- إضافة WBadgeStack وWUserBadge وWTooltipBtn بخصائص typed وslots للصورة والأيقونة، مع الترجمة من المشروع.
- الحفاظ على تخصيص عناصر Aware وقائمة الزيادة وأيقونات الاكتشاف والأحرف والإجراءات وخصائص Tooltip القديمة عبر adapters.
- إضافة اختبارات Vuetify فعلية للزيادة وTooltip والصور والتوافق، وتوثيق تفاعلي بالعربي والإنجليزي.

## 0.3.0

إضافة WButton وWBadge ثم WAccordion، مع الحفاظ على عقود Aware والأيقونات وloading وisLoading. اختبارات الأحداث والفورم والـslots والكيبورد وSSR وتوثيق CSS وtyped APIs.

## 0.2.0

إضافة WAvatarStack وWLoading وWPageSkeleton وWVerticalSteps، مع نماذج بيانات typed وstyles للـoverlay وslots للأيقونات. واجهات 0.1 مستمرة كما هي.

## 0.1.1

نشر أول ثلاثة مكونات على npm. التثبيت باستخدام `wakeb-components@0.1.1`.

## 0.1.0

ثلاثة مكونات عرض، وprops وslots typed، ومتغيرات مستقلة، وVue وVuetify كـpeers، والتحقق من تثبيت الحزمة والمتصفح وSSR.
