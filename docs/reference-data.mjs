export default [
  {
    "name": "WTruncatedText",
    "slug": "truncated-text",
    "interface": "TruncatedTextProps",
    "summary": [
      "Readable shortened text with a keyboard-accessible Vuetify tooltip.",
      "نص مختصر مع Tooltip من Vuetify يعمل عند التركيز بالكيبورد."
    ],
    "props": [
      [
        "label",
        "string",
        "\"\"",
        "The full label; HTML is escaped.",
        "النص الكامل؛ لا يُفسر كـHTML."
      ],
      [
        "length",
        "number",
        "12",
        "Maximum UTF-16 length including the three-dot suffix.",
        "الطول بوحدات UTF-16 ويشمل النقاط الثلاث."
      ],
      [
        "tooltipLocation",
        "\"top\" | \"bottom\" | \"start\" | \"end\"",
        "\"top\"",
        "Tooltip placement through Vuetify.",
        "موضع Tooltip من خلال Vuetify."
      ],
      [
        "tooltipMaxWidth",
        "string | number",
        "280",
        "Tooltip maximum width.",
        "أقصى عرض للـTooltip."
      ],
      [
        "contentClass",
        "string",
        "\"wakeb-truncated-tooltip\"",
        "Class on the teleported tooltip content.",
        "class على محتوى Tooltip المنقول إلى overlay."
      ],
      [
        "tooltipStyle",
        "CSSProperties",
        "undefined",
        "Inline styles on the actual tooltip content, including its colors.",
        "styles على محتوى Tooltip نفسه، بما فيها الألوان."
      ]
    ],
    "slots": [
      "`default`: `{ text, label, truncated }`. The fallback renders shortened text.",
      "`default`: يستقبل `{ text, label, truncated }`. المحتوى الافتراضي هو النص المختصر."
    ],
    "variables": [
      [
        "--wakeb-text-focus-color",
        "Vuetify primary / #087f5b"
      ]
    ],
    "limits": [
      "The span receives DOM attributes and listeners. Focus/hover handlers are composed with Vuetify. Truncated labels get tabindex=0 and the full aria-label; short labels add no tab stop. Text truncation preserves Wakeb Utils behavior, including limits below 3 and UTF-16 emoji splitting. Tooltip location and delays follow Vuetify.",
      "تصل attributes والأحداث إلى span، وتُدمج أحداث التركيز مع Vuetify. النص المختصر قابل للتركيز وله aria-label كامل؛ النص القصير لا يضيف tab stop. نحافظ على سلوك Wakeb Utils: حد أقل من 3 يرجع النقاط الثلاث، وقد ينقسم emoji بسبب UTF-16. موضع Tooltip وتوقيته يتبعان Vuetify."
    ],
    "example": "<WTruncatedText label=\"A shared foundation for every team\" :length=\"20\" />"
  },
  {
    "name": "WSegmentedProgress",
    "slug": "segmented-progress",
    "interface": "SegmentedProgressProps",
    "summary": [
      "A striped progress display with numeric accessibility semantics.",
      "شريط تقدم مخطط بقيمة وحدود واضحة لقارئات الشاشة."
    ],
    "props": [
      [
        "value",
        "number",
        "0",
        "Percentage, normalized to 0–100; NaN becomes 0.",
        "النسبة؛ تُحصر بين 0 و100 وتصبح NaN صفرًا."
      ],
      [
        "label",
        "string",
        "\"\"",
        "Visible label within the filled segment.",
        "النص الظاهر داخل الجزء الممتلئ."
      ],
      [
        "color",
        "string",
        "var(--wakeb-progress-color, #12b76a)",
        "Any CSS color, including a CSS variable.",
        "أي لون CSS، بما فيه متغير CSS."
      ],
      [
        "ariaLabel",
        "string",
        "\"\"",
        "Accessible name; defaults to label, then the percentage.",
        "اسم لقارئ الشاشة؛ الافتراضي label ثم النسبة."
      ]
    ],
    "slots": [
      "`default`: `{ value, label }`, inside the filled segment.",
      "`default`: يستقبل `{ value, label }` داخل الجزء الممتلئ."
    ],
    "variables": [
      [
        "--wakeb-progress-color",
        "#12b76a"
      ],
      [
        "--wakeb-progress-height",
        "34px"
      ],
      [
        "--wakeb-progress-surface",
        "#fff"
      ],
      [
        "--wakeb-progress-track-background",
        "#f2f4f7"
      ],
      [
        "--wakeb-progress-track-border",
        "#d0d5dd"
      ]
    ],
    "limits": [
      "Uses role=progressbar and aria-valuemin/aria-valuemax/aria-valuenow. A zero value has no fill or visible label, but retains its accessible name. At 100 there is no empty track. Layout follows inherited direction; animations respect reduced motion. The component has no network or state-store side effects.",
      "يستخدم role=progressbar وحدود وقيمة ARIA. عند صفر لا يظهر جزء ممتلئ أو label مرئي، ويظل الاسم متاحًا لقارئ الشاشة. عند 100 يختفي الجزء الفارغ. الاتجاه موروث، والحركة تحترم reduced motion. لا توجد طلبات شبكة أو حالة مخزنة داخله."
    ],
    "example": "<WSegmentedProgress :value=\"65\" label=\"65%\" color=\"#0050ff\" />"
  },
  {
    "name": "WSemiCircleGauge",
    "slug": "semi-circle-gauge",
    "interface": "SemiCircleGaugeProps",
    "summary": [
      "A responsive SVG gauge with isolated gradient IDs and a value slot.",
      "مؤشر SVG نصف دائري، بعرّافات gradients مستقلة وslot للمحتوى."
    ],
    "props": [
      [
        "value",
        "number",
        "0",
        "Percentage normalized to 0–100; NaN becomes 0.",
        "النسبة بين 0 و100؛ تصبح NaN صفرًا."
      ],
      [
        "size",
        "number",
        "154",
        "Positive finite size in pixels; invalid sizes fall back to 154.",
        "حجم موجب ومحدود بالبكسل؛ القيم غير الصالحة ترجع إلى 154."
      ],
      [
        "thickness",
        "number",
        "0",
        "0 means 23.6% of size; positive values are capped at half the size.",
        "الصفر يعني 23.6% من الحجم، ويُحصر السمك الموجب عند نصف الحجم."
      ],
      [
        "label",
        "string",
        "\"\"",
        "Main visual label.",
        "القيمة أو النص الأساسي الظاهر."
      ],
      [
        "subLabel",
        "string",
        "\"\"",
        "Small text above the main label.",
        "نص صغير فوق القيمة الأساسية."
      ],
      [
        "ariaLabel",
        "string",
        "\"\"",
        "Accessible description; defaults to the normalized percentage.",
        "وصف لقارئ الشاشة؛ الافتراضي النسبة بعد الحصر."
      ]
    ],
    "slots": [
      "`default`: `{ value, label, subLabel }`, replacing visual center text.",
      "`default`: يستقبل `{ value, label, subLabel }` بدل النص الداخلي."
    ],
    "variables": [
      [
        "--wakeb-gauge-color",
        "#12b76a"
      ],
      [
        "--wakeb-gauge-highlight",
        "gauge color"
      ],
      [
        "--wakeb-gauge-track-background",
        "#f2f4f7"
      ],
      [
        "--wakeb-gauge-track-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-gauge-needle-color",
        "#fff"
      ],
      [
        "--wakeb-gauge-text-color",
        "currentColor"
      ],
      [
        "--wakeb-gauge-muted-color",
        "#667085"
      ]
    ],
    "limits": [
      "SVG role=img exposes the percentage or ariaLabel; decorative center text is aria-hidden. Vue useId keeps SVG references distinct and stable across SSR requests. RTL mirrors geometry only; text remains readable. Invalid geometry is normalized; animations honor reduced motion. Size is the full gauge width; the arc is half-height.",
      "يقرأ قارئ الشاشة النسبة أو ariaLabel عبر SVG بدور img، ويُخفى النص الزخرفي المكرر عن ARIA. Vue useId يمنع تداخل عرّافات SVG ويدعم SSR. ينعكس الرسم في RTL ولا ينعكس النص. تُصحح الأبعاد غير الصالحة، وتُحترم reduced motion. size هو العرض الكامل، وارتفاع القوس نصفه."
    ],
    "example": "<WSemiCircleGauge :value=\"75\" label=\"75%\" sub-label=\"Quality\" aria-label=\"Quality: 75 percent\" />"
  },
  {
    "name": "WAvatarStack",
    "slug": "avatar-stack",
    "interface": "AvatarStackProps",
    "summary": [
      "Overlapping avatars with nested data fields and an accessible overflow menu.",
      "صور متداخلة، مع حقول بيانات متداخلة وقائمة overflow قابلة للفتح بالكيبورد."
    ],
    "props": [
      [
        "items",
        "readonly unknown[]",
        "[]",
        "Entries; null or malformed entries use fallback labels.",
        "العناصر؛ القيم المفقودة أو غير الصالحة تستخدم النص البديل."
      ],
      [
        "max",
        "number",
        "3",
        "Visible count; finite values are floored and clamped to zero, NaN/infinity use 3.",
        "العدد الظاهر؛ يُقرب لأسفل ويُحصر عند صفر. القيم غير المحدودة تستخدم 3."
      ],
      [
        "size",
        "string | number",
        "32",
        "Vuetify avatar size.",
        "حجم الصورة عبر Vuetify."
      ],
      [
        "avatarColor",
        "string",
        "\"primary\"",
        "Initials and overflow background; image avatars retain primary.",
        "خلفية الحروف والعدد الإضافي؛ الصور تستخدم primary."
      ],
      [
        "showOverflowMenu",
        "boolean",
        "false",
        "Show remaining users in a Vuetify menu.",
        "عرض باقي المستخدمين في قائمة Vuetify."
      ],
      [
        "showTooltip",
        "boolean",
        "true",
        "Enable focus/hover tooltips for visible users.",
        "تفعيل Tooltip بالتركيز أو المرور على المستخدمين الظاهرين."
      ],
      [
        "itemKey",
        "string",
        "\"id\"",
        "Dot path for a string/number key; index fallback.",
        "مسار بالنقاط لمفتاح نصي أو رقمي؛ البديل index."
      ],
      [
        "nameKey",
        "string",
        "\"name\"",
        "Dot path for a display name.",
        "مسار اسم العرض."
      ],
      [
        "avatarKey",
        "string",
        "\"avatar\"",
        "Dot path for the image URL.",
        "مسار رابط الصورة."
      ],
      [
        "unknownLabel",
        "string",
        "\"Unknown user\"",
        "Localize missing names; missing initials render ?.",
        "ترجمة الاسم البديل؛ الحروف المفقودة تظهر ?."
      ],
      [
        "overflowLabel",
        "string",
        "\"\"",
        "Accessible name of overflow; defaults to +count.",
        "الاسم المساعد للعدد الإضافي؛ الافتراضي +count."
      ],
      [
        "menuStyle",
        "CSSProperties",
        "{}",
        "Styles on the teleported menu, including its CSS variables.",
        "styles ومتغيرات CSS على القائمة المنقولة إلى overlay."
      ],
      [
        "tooltipStyle",
        "CSSProperties",
        "{}",
        "Styles on the teleported tooltip content.",
        "styles على محتوى Tooltip المنقول."
      ]
    ],
    "slots": [
      "`avatar`: `{ item, index, label, avatar, initials }`; replaces each visible avatar. `overflow`: `{ count }`; replaces the +count text.",
      "`avatar`: يستقبل `{ item, index, label, avatar, initials }` لاستبدال الصورة. `overflow`: يستقبل `{ count }` لاستبدال نص العدد."
    ],
    "variables": [
      [
        "--wakeb-avatar-border",
        "Vuetify surface / white"
      ],
      [
        "--wakeb-avatar-overlap",
        "-10px"
      ],
      [
        "--wakeb-avatar-focus",
        "Vuetify primary / #087f8c"
      ],
      [
        "--wakeb-avatar-menu-surface",
        "Vuetify surface / white"
      ],
      [
        "--wakeb-avatar-menu-text",
        "Vuetify on-surface / #101828"
      ]
    ],
    "limits": [
      "Visible avatars have full accessible names and gain a tab stop only when tooltips are enabled. Overflow is a real button when the menu is enabled; click, keyboard activation and hover use Vuetify. Without a menu it is a static named image. Duplicate item keys are the caller’s responsibility. Only own-property dot paths are read; names are escaped text. Image paths accept http-prefixed, slash-relative or data URLs; image fetching follows the browser and Vuetify. Fallback initials use the first Unicode code point of two words. No i18n/store instance is needed. Teleported menu variables belong in menuStyle; tooltip styling belongs in tooltipStyle.",
      "للصور اسم مساعد كامل، وتصبح قابلة للتركيز عند تفعيل Tooltip فقط. العدد الإضافي زر فعلي عند تفعيل القائمة ويعمل بالنقر والكيبورد والمرور من خلال Vuetify، وإلا فهو صورة نصية ثابتة. المفاتيح المكررة مسؤولية المستهلك. تُقرأ مسارات الحقول المملوكة للكائن فقط وتُعرض الأسماء كنصوص آمنة. روابط الصور تدعم http والمسار الذي يبدأ بشرطة مائلة وdata؛ التحميل يتبع المتصفح وVuetify. الحروف البديلة من أول Unicode code point لأول كلمتين. لا يحتاج i18n أو store. تخصيص القائمة المنقولة عبر menuStyle والـTooltip عبر tooltipStyle."
    ],
    "example": "<WAvatarStack :items=\"[{ id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Grace Hopper' }]\" :max=\"1\" show-overflow-menu overflow-label=\"More people\" />"
  },
  {
    "name": "WLoading",
    "slug": "loading",
    "interface": "LoadingProps",
    "summary": [
      "A named loading status with a Vuetify circular indicator.",
      "حالة تحميل باسم قابل للترجمة ومؤشر دائري من Vuetify."
    ],
    "props": [
      [
        "size",
        "string | number",
        "50",
        "Vuetify spinner size.",
        "حجم مؤشر Vuetify."
      ],
      [
        "color",
        "string",
        "\"primary\"",
        "Vuetify theme key or CSS color.",
        "لون CSS أو اسم لون في ثيم Vuetify."
      ],
      [
        "label",
        "string",
        "\"Loading\"",
        "Accessible loading status; supply translated text.",
        "اسم حالة التحميل لقارئ الشاشة؛ مرر ترجمة المشروع."
      ]
    ],
    "slots": [
      "`default`: replaces the spinner; the named status container stays.",
      "`default`: يستبدل المؤشر مع الاحتفاظ بحاوية الحالة واسمها."
    ],
    "variables": [],
    "limits": [
      "The root is role=status; the default spinner is decorative and aria-hidden to avoid duplicate announcements. Centering works without utility CSS. The component has no timer, request or loading state of its own; mount/unmount it from the host. Vue/Vuetify owns indicator animation.",
      "الحاوية role=status والمؤشر الافتراضي زخرفي ومخفي عن ARIA لمنع تكرار القراءة. التوسيط يعمل دون utility CSS. لا يوجد مؤقت أو طلب شبكة أو حالة تحميل داخلية؛ المشروع يتحكم في ظهور المكون. حركة المؤشر تتبع Vuetify."
    ],
    "example": "<WLoading label=\"Loading report\" :size=\"50\" />"
  },
  {
    "name": "WPageSkeleton",
    "slug": "page-skeleton",
    "interface": "PageSkeletonProps",
    "summary": [
      "Responsive Vuetify skeleton rows driven by typed descriptors.",
      "صفوف Skeleton متجاوبة من Vuetify بوصف بيانات typed."
    ],
    "props": [
      [
        "config",
        "readonly SkeletonRow[]",
        "required",
        "Row descriptors; empty arrays render an empty status. See Data models.",
        "وصف الصفوف؛ المصفوفة الفارغة تعرض حالة فارغة. راجع نماذج البيانات."
      ],
      [
        "direction",
        "\"row\" | \"column\"",
        "\"column\"",
        "Root flex direction, independent of Tailwind.",
        "اتجاه flex للحاوية دون الاعتماد على Tailwind."
      ],
      [
        "label",
        "string",
        "\"Loading content\"",
        "Accessible status name; localize in the host.",
        "اسم الحالة لقارئ الشاشة؛ ترجمه داخل المشروع."
      ]
    ],
    "slots": [
      "No slots; compose rows with config, header/items, classes and Vuetify grid breakpoints.",
      "لا توجد slots؛ التكوين عبر config وheader/items وclasses ونقاط توقف Vuetify."
    ],
    "variables": [
      [
        "--wakeb-skeleton-surface",
        "#fff"
      ],
      [
        "--wakeb-skeleton-border",
        "#eaecf0"
      ]
    ],
    "limits": [
      "Uses one named role=status and aria-busy=true; skeleton rows are aria-hidden to prevent duplicate announcements. Render this component only while content is loading. Row repeat is floored; missing, nonfinite, zero or negative repeats render one column. cols defaults to 12 when falsy, preserving the app contract; sm/md/lg follow Vuetify. Skeleton type strings are Vuetify types, including its comma/multiplier syntax. No application CSS is required. Current specialized card bone styling targets Vuetify 3 structure.",
      "يستخدم حالة واحدة باسم role=status وaria-busy=true مع إخفاء الصفوف الزخرفية عن ARIA لمنع تكرار القراءة؛ اعرضه أثناء التحميل فقط. repeat يُقرب لأسفل؛ القيم المفقودة وغير المحدودة والصفر والسالب تنتج عمودًا واحدًا. cols الافتراضي 12 للقيم الفارغة وفق العقد السابق، وsm/md/lg تتبع Vuetify. type يدعم صيغة أنواع Skeleton في Vuetify بما فيها الفواصل والتكرار. لا يحتاج CSS خاص بالمشروع. تخصيص عظام card يستهدف بنية Vuetify 3."
    ],
    "example": "<WPageSkeleton :config=\"[{ repeat: 2, cols: 12, md: 6, variant: 'card', items: [{ type: 'text' }, { type: 'paragraph' }] }]\" label=\"Loading report\" />"
  },
  {
    "name": "WVerticalSteps",
    "slug": "vertical-steps",
    "interface": "VerticalStepsProps",
    "summary": [
      "Presentational steps with replaceable icons, title slots and a plain data contract.",
      "خطوات عرض بأيقونات وعناوين قابلة للاستبدال وعقد بيانات بسيط."
    ],
    "props": [
      [
        "steps",
        "readonly VerticalStep[]",
        "[]",
        "title/time/date/is_active descriptors. See Data models.",
        "عناصر title/time/date/is_active. راجع نماذج البيانات."
      ],
      [
        "label",
        "string",
        "\"Steps\"",
        "Accessible list name; localize in the host.",
        "اسم القائمة لقارئ الشاشة؛ ترجمه داخل المشروع."
      ]
    ],
    "slots": [
      "`indicator` replaces the complete marker; `icon` replaces the default marker content. `title`, `timeIcon`, `dateIcon`: each receives `{ step, index }`. Fallback icons are simple text symbols; no icon font is required.",
      "`indicator` يستبدل العلامة بالكامل، و`icon` محتواها الافتراضي. `title` و`timeIcon` و`dateIcon`: كل منها يستقبل `{ step, index }`. الأيقونات الافتراضية رموز نصية ولا تحتاج خط أيقونات."
    ],
    "variables": [
      [
        "--wakeb-steps-accent",
        "#087f8c"
      ],
      [
        "--wakeb-steps-surface",
        "#f9fafb"
      ],
      [
        "--wakeb-steps-text",
        "currentColor"
      ],
      [
        "--wakeb-steps-active-text",
        "#fff"
      ],
      [
        "--wakeb-steps-muted",
        "#667085"
      ]
    ],
    "limits": [
      "Uses list/listitem roles. is_active is a visual completion flag, not interactive navigation or aria-current. The host supplies formatted date/time strings and translations. Text is escaped. Steps use positional keys and do not own selection state. Layout uses logical directions and needs no utility framework. This preserves the horizontal row layout; long content should be tested in the host’s available width.",
      "يستخدم أدوار list/listitem. is_active حالة اكتمال مرئية، وليس تنقلًا تفاعليًا أو aria-current. المشروع يمرر التاريخ والوقت بعد التنسيق والترجمة. النص آمن من تفسير HTML. المفاتيح موضعية ولا توجد حالة اختيار داخلية. الاتجاهات منطقية ولا يحتاج framework للـutilities. نحافظ على تخطيط الصف الأفقي؛ اختبر النص الطويل في عرض المشروع المتاح."
    ],
    "example": "<WVerticalSteps :steps=\"[{ title: 'Review', is_active: true, time: '09:00', date: '2026-10-28' }, { title: 'Ship' }]\" label=\"Release steps\" />"
  }
];
