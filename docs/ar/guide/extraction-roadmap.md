# خريطة الفصل

تم فصل سبعة مكونات عرض وتحميل، مع الاحتفاظ بمسارات Aware كـadapters. مراجعة بقية مجلد common أظهرت أن المكونات التالية تحتاج عقودًا إضافية قبل نقلها.

| المجموعة | المكونات | المطلوب قبل الفصل |
| --- | --- | --- |
| الأساس المرئي | Button, Badge, BadgeStack, UserBadge, TooltipBtn, Accordion | فصل SvgIcon والألوان semantic عن الأسماء العالمية، ونقل الترجمة إلى props/slots، وتثبيت أحداث الزر والفتح والإغلاق |
| التنقل والقوائم | Tabs, Tree, Dropdown, Carousel, ExportDropdown, BaseSidebar | تثبيت selection/events/keyboard وslots؛ Carousel يحتوي اسم hideDelimiters بسلوك عكسي يجب الاحتفاظ به في adapter |
| النوافذ | Modal, Drawer, AddEditModal | فصل صورة header وButton وحالات الحفظ والتحميل والترجمة، والتحقق من التركيز وEscape وscroll lock |
| الجداول والنماذج | Table, CardView, Card, GenericForm, AdvancedFiltersModal, CheckboxFilterDropdown, PageTabsFilter, ActiveToggleBadge | فصل schema والصلاحيات وenums/actions وjervis-form؛ المكون العام يتلقى بيانات وأحداثًا |
| التاريخ والملفات | Calendar, DatePicker, DateTimeField, CurrentDataTime, FilePreview | عقود locale/timezone وتنسيق التاريخ واعتمادات datepicker؛ مؤقت الساعة يحتاج lifecycle مستقلًا |
| أجزاء متخصصة | PlateCard, PlatePreview, Map, StreamingHandle, MediaMtxPlayer, RealtimeStreamManager, Kanban | تبقى في حزم المجال/التكامل: wakeb-map أو البث أو اللوحات، بعد تحديد peer dependencies |
| حالة التطبيق والخدمات | ThemeToggle, ExpandableStatsCards, HandControlOverlay, HandControlToggle, VoiceControlToggle | فصل storage/theme وتوليد StatisticsCard وخدمات الكاميرا والميكروفون ومنطق feature عن العرض |
| تركيب محلي | Suspenser | يستعمل Loading المشترك بالفعل من خلال adapter؛ لا يحتاج API حزمة إضافيًا الآن |

الخطوة التالية المناسبة هي أساس Button/Badge ثم Accordion؛ هذا يفتح نقل القوائم والنوافذ دون الاعتماد على aliases أو أيقونات الشركة. كل دفعة تحتاج اختبارات المستهلك، توافق Aware، وتوثيقًا للـprops والأحداث والـslots قبل الإصدار.
