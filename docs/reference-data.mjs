export default [
  {
    "name": "WTruncatedText",
    "slug": "truncated-text",
    "interface": "TruncatedTextProps",
    "summary": [
      "Readable shortened text with a tooltip that opens on hover and keyboard focus.",
      "نص مختصر مع Tooltip يفتح عند مرور المؤشر وعند التركيز بالكيبورد."
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
        "Tooltip placement; start and end are logical sides.",
        "موضع Tooltip؛ start وend جهتان منطقيتان."
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
        "Vuetify primary or --wakeb-ui-focus / PrimeVue primary / #087f5b"
      ]
    ],
    "attrs": [
      "The text `<span>` that activates the tooltip. Caller focus and hover listeners are composed with the tooltip's own. Wakeb owns tabindex and aria-label: it sets them for truncated text and removes them otherwise, so caller values are ignored. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "عنصر `<span>` الذي يفتح الـTooltip. تُدمج أحداث التركيز والمرور من المستخدم مع أحداث الـTooltip. يملك Wakeb قيمتي tabindex وaria-label: يضعهما للنص المختصر ويزيلهما في غير ذلك، فتُتجاهل القيم القادمة من المستخدم. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "The span receives DOM attributes and listeners. Focus/hover handlers are composed with Vuetify. Truncated labels get tabindex=0 and the full aria-label; short labels add no tab stop. Text truncation preserves Wakeb Utils behavior, including limits below 3 and UTF-16 emoji splitting. Tooltip location and delays follow Vuetify. Under PrimeVue: the PrimeVue tooltip directive renders the tooltip on document.body; Wakeb opens it on hover and keyboard focus, and it closes on blur, click and Escape. The span references it through aria-describedby with a useId id, and a caller aria-describedby wins, as on Vuetify. start and end follow the plugin direction option. tooltipStyle styles the tooltip text bubble, contentClass and tooltipMaxWidth the tooltip root, which also carries the plugin theme scope; PrimeVue keeps its own tooltip z-index, so zIndexOverlay does not apply. The focus outline falls back to --wakeb-ui-focus, then the PrimeVue primary color.",
      "تصل attributes والأحداث إلى span، وتُدمج أحداث التركيز مع Vuetify. النص المختصر قابل للتركيز وله aria-label كامل؛ النص القصير لا يضيف tab stop. نحافظ على سلوك Wakeb Utils: حد أقل من 3 يرجع النقاط الثلاث، وقد ينقسم emoji بسبب UTF-16. موضع Tooltip وتوقيته يتبعان Vuetify. تحت PrimeVue: يرسم توجيه Tooltip في PrimeVue التلميح داخل document.body، ويفتحه Wakeb عند مرور المؤشر وعند التركيز بالكيبورد، ويُغلق عند فقدان التركيز والنقر وEscape. يشير الـspan إليه عبر aria-describedby بمعرّف من useId، وتتقدم قيمة aria-describedby القادمة من المستخدم كما في Vuetify. تتبع start وend خيار direction في الـplugin. تنسّق tooltipStyle فقاعة نص التلميح، وتنسّق contentClass وtooltipMaxWidth جذر التلميح الذي يحمل نطاق theme الخاص بالـplugin أيضًا؛ ويحتفظ PrimeVue بترتيب z-index الخاص بتلميحاته، فلا ينطبق zIndexOverlay. يرجع إطار التركيز إلى --wakeb-ui-focus ثم إلى اللون الأساسي في PrimeVue."
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
        "WakebColor",
        "var(--wakeb-progress-color, #12b76a)",
        "Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. Other values fall back to the default.",
        "intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS. القيم الأخرى ترجع إلى القيمة الافتراضية."
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
    "attrs": [
      "The root `div.segmented-progress` with `role=\"progressbar\"` on every provider. `role` and `aria-value*` are Wakeb-owned and win over caller attributes; a caller `aria-label` is the typed `ariaLabel` prop. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الجذري `div.segmented-progress` الذي يحمل `role=\"progressbar\"` على كل المزودين. قيمتا `role` و`aria-value*` ملك لـWakeb وتغلبان على سمات المستخدم؛ وقيمة `aria-label` من المستخدم هي الخاصية المكتوبة `ariaLabel`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Uses role=progressbar and aria-valuemin/aria-valuemax/aria-valuenow. A zero value has no fill or visible label, but retains its accessible name. At 100 there is no empty track. Segments size from a zero flex basis, so the fill is value% of the track width minus the 2px gap whatever the label length. Layout follows inherited direction; animations respect reduced motion. The component has no network or state-store side effects. PrimeVue renders the same Wakeb markup and CSS as Vuetify (no PrimeVue ProgressBar), so the DOM, slot payload and tokens are identical on both providers. Under shadcn-vue the same Wakeb markup and CSS render (the shadcn-vue Progress has no segmented track or label slot), so the DOM, slot payload and tokens are identical.",
      "يستخدم role=progressbar وحدود وقيمة ARIA. عند صفر لا يظهر جزء ممتلئ أو label مرئي، ويظل الاسم متاحًا لقارئ الشاشة. عند 100 يختفي الجزء الفارغ. الأجزاء تبدأ من flex basis صفر، فالجزء الممتلئ يساوي value% من عرض الشريط بعد خصم مسافة 2px مهما كان طول النص. الاتجاه موروث، والحركة تحترم reduced motion. لا توجد طلبات شبكة أو حالة مخزنة داخله. يرسم PrimeVue الـmarkup والـCSS نفسيهما من Wakeb كما في Vuetify (دون ProgressBar من PrimeVue)، فيتطابق الـDOM وبيانات الـslot والـtokens على المزودين. في shadcn-vue يُرسم الـmarkup وأنماط CSS نفسها من Wakeb (لا يملك Progress في shadcn-vue مسارًا مقسّمًا ولا slot للنص)، فالـDOM وقيم الـslot والـtokens متطابقة."
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
    "attrs": [
      "The root `div.semi-circle-gauge`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الجذري `div.semi-circle-gauge`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "SVG role=img exposes the percentage or ariaLabel; decorative center text is aria-hidden. Vue useId keeps SVG references distinct and stable across SSR requests. RTL mirrors geometry only; text remains readable. Invalid geometry is normalized; animations honor reduced motion. Size is the full gauge width; the arc is half-height. PrimeVue renders the same Wakeb SVG and CSS as Vuetify (PrimeVue Knob is an input, so it is not used); the DOM, IDs and tokens are identical on both providers. Under shadcn-vue the same Wakeb SVG and geometry render; shadcn-vue and reka-ui have no read-only gauge.",
      "يقرأ قارئ الشاشة النسبة أو ariaLabel عبر SVG بدور img، ويُخفى النص الزخرفي المكرر عن ARIA. Vue useId يمنع تداخل عرّافات SVG ويدعم SSR. ينعكس الرسم في RTL ولا ينعكس النص. تُصحح الأبعاد غير الصالحة، وتُحترم reduced motion. size هو العرض الكامل، وارتفاع القوس نصفه. يرسم PrimeVue نفس SVG وCSS من Wakeb كما في Vuetify (لا يُستخدم Knob من PrimeVue لأنه حقل إدخال)، فيتطابق الـDOM والعرّافات والـtokens على المزودين. في shadcn-vue يُرسم ملف SVG نفسه من Wakeb بالهندسة نفسها؛ لا يملك shadcn-vue ولا reka-ui مقياسًا للقراءة فقط."
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
        "Avatar size: a number or numeric string in pixels, another CSS length, or a Vuetify size name (x-small 24px, small 32px, default 40px, large 48px, x-large 56px).",
        "حجم الصورة: رقم أو نص رقمي بالبكسل، أو طول CSS آخر، أو اسم حجم من Vuetify ‏(x-small ‏24px وsmall ‏32px وdefault ‏40px وlarge ‏48px وx-large ‏56px)."
      ],
      [
        "avatarColor",
        "WakebColor",
        "\"primary\"",
        "Initials, overflow and image-avatar background. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. Initials use --wakeb-avatar-text.",
        "خلفية الحروف والعدد الإضافي والصور. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS. لون الحروف من --wakeb-avatar-text."
      ],
      [
        "showOverflowMenu",
        "boolean",
        "false",
        "Show remaining users in an overflow list (a Vuetify menu or a PrimeVue Popover).",
        "عرض باقي المستخدمين في قائمة زيادة (قائمة Vuetify أو Popover في PrimeVue)."
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
      ],
      [
        "--wakeb-avatar-text",
        "--wakeb-ui-on-primary / #fff"
      ]
    ],
    "attrs": [
      "The root `div.avatars-stack`. The overflow menu is teleported and does not receive them; style it with `menuStyle`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الجذري `div.avatars-stack`. قائمة الزيادة منقولة خارج المكوّن ولا تستقبلها؛ خصصها عبر `menuStyle`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Visible avatars have full accessible names and gain a tab stop only when tooltips are enabled. Overflow is a real button when the menu is enabled. It exposes aria-expanded but not aria-haspopup, because the list is informational. Click, keyboard activation and hover use Vuetify. Without a menu it is a static named image. Duplicate item keys are the caller’s responsibility. Only own-property dot paths are read; names are escaped text. Image paths accept http-prefixed, slash-relative or data URLs; image fetching follows the browser and Vuetify. Fallback initials use the first Unicode code point of two words. No i18n/store instance is needed. Teleported menu variables belong in menuStyle; tooltip styling belongs in tooltipStyle. The menu and tooltips carry only the plugin theme scope (data-wakeb-theme, dir, --wakeb-ui-* variables and zIndexOverlay); menuStyle and tooltipStyle win over it. PrimeVue: avatars use PrimeVue Avatar, sized and colored by Wakeb CSS. The overflow is a native button that opens a Popover on hover, focus or click; Escape or an outside click closes it, and aria-controls names it only while it is open. The Popover is a non-modal dialog (aria-modal=\"false\") named by overflowLabel; PrimeVue places it below or above the button and adds its focus-trap sentinels. Tooltips use PrimeVue's tooltip directive; Wakeb also opens them on keyboard focus and closes them on blur and Escape. Tooltips carry the theme scope and tooltipStyle but keep PrimeVue's own tooltip z-index stack; the Popover takes zIndexOverlay. Provider color names in avatarColor are not portable on PrimeVue: they fall back to primary with WAKEB_UNKNOWN_VALUE.",
      "للصور اسم مساعد كامل، وتصبح قابلة للتركيز عند تفعيل Tooltip فقط. العدد الإضافي زر فعلي عند تفعيل القائمة، يعلن aria-expanded دون aria-haspopup لأن القائمة معلوماتية فقط، ويعمل بالنقر والكيبورد والمرور من خلال Vuetify، وإلا فهو صورة نصية ثابتة. المفاتيح المكررة مسؤولية المستهلك. تُقرأ مسارات الحقول المملوكة للكائن فقط وتُعرض الأسماء كنصوص آمنة. روابط الصور تدعم http والمسار الذي يبدأ بشرطة مائلة وdata؛ التحميل يتبع المتصفح وVuetify. الحروف البديلة من أول Unicode code point لأول كلمتين. لا يحتاج i18n أو store. تخصيص القائمة المنقولة عبر menuStyle والـTooltip عبر tooltipStyle. لا تحمل القائمة والتلميحات إلا نطاق theme الخاص بالـplugin ‏(data-wakeb-theme وdir ومتغيرات --wakeb-ui-* وzIndexOverlay)، وتتقدم menuStyle وtooltipStyle عليه. في PrimeVue: تستخدم الصور مكوّن Avatar من PrimeVue بحجم وألوان من CSS الخاص بـWakeb. زر الزيادة زر HTML يفتح Popover عند المرور أو التركيز أو النقر، ويغلقه Escape أو النقر خارجه، ولا يشير إليه aria-controls إلا أثناء فتحه. الـPopover نافذة حوار غير مقيِّدة (aria-modal=\"false\") يسميها overflowLabel، ويضعها PrimeVue أسفل الزر أو أعلاه ويضيف عناصر حصر التركيز الخاصة به. تستخدم التلميحات directive التلميح في PrimeVue، ويفتحها Wakeb أيضًا عند التركيز بالكيبورد ويغلقها عند فقدان التركيز وEscape. تحمل التلميحات نطاق theme وtooltipStyle لكنها تحتفظ بترتيب z-index الخاص بتلميحات PrimeVue، بينما يأخذ الـPopover قيمة zIndexOverlay. أسماء ألوان المزود في avatarColor غير قابلة للنقل في PrimeVue: تعود إلى primary مع WAKEB_UNKNOWN_VALUE."
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
        "WakebColor",
        "\"primary\"",
        "Spinner color. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color.",
        "لون المؤشر. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS."
      ],
      [
        "label",
        "string",
        "\"Loading\"",
        "Accessible loading status; supply translated text.",
        "اسم حالة التحميل لقارئ الشاشة؛ مرر ترجمة المشروع."
      ],
      [
        "providerProps",
        "WakebProviderProps",
        "undefined",
        "Nonportable. Native props for the indicator primitive (Vuetify `VProgressCircular`, PrimeVue `ProgressSpinner`). `color`, `size`, the indeterminate state and PrimeVue `strokeWidth`/`pt` stay Wakeb-owned. Has no effect when the default slot replaces the indicator.",
        "غير قابل للنقل. خصائص أصلية لـprimitive مؤشر التحميل (`VProgressCircular` في Vuetify و`ProgressSpinner` في PrimeVue). `color` و`size` وحالة التحميل غير المحددة و`strokeWidth` و`pt` في PrimeVue يملكها Wakeb. لا أثر له عندما يستبدل الـslot الافتراضي المؤشر."
      ]
    ],
    "slots": [
      "`default`: replaces the spinner; the named status container stays.",
      "`default`: يستبدل المؤشر مع الاحتفاظ بحاوية الحالة واسمها."
    ],
    "variables": [],
    "attrs": [
      "The root `div.loading` with `role=\"status\"`, on every provider. Wakeb's role and aria-label win. `providerProps` goes to the indicator primitive instead. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الجذري `div.loading` الذي يحمل `role=\"status\"` على كل المزودين. تبقى role وaria-label الخاصة بـWakeb هي الغالبة. أما `providerProps` فيذهب إلى مؤشر التحميل الخاص بالمزود. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
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
      "Responsive skeleton rows on the Wakeb grid, driven by typed descriptors.",
      "صفوف Skeleton متجاوبة على شبكة Wakeb بوصف بيانات typed."
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
    "attrs": [
      "The root `div.page-skeleton` with `role=\"status\"` on every provider. `role` and `aria-busy` are Wakeb-owned and win over caller attributes; name the status with `label`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الجذري `div.page-skeleton` الذي يحمل `role=\"status\"` على كل المزودين. قيمتا `role` و`aria-busy` ملك لـWakeb وتغلبان على سمات المستخدم؛ سمِّ الحالة عبر `label`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Uses one named role=status and aria-busy=true; skeleton rows are aria-hidden to prevent duplicate announcements. Render this component only while content is loading. Row repeat is floored; missing, nonfinite, zero or negative repeats render one column. cols defaults to 12 when falsy, preserving the app contract. cols, sm, md and lg take 1–12, 'auto' or true (grow) on the Wakeb 12-column grid with fixed breakpoints sm 600px, md 960px and lg 1280px; provider breakpoint settings do not change it. Other spans are ignored (cols uses 12) with WAKEB_UNKNOWN_VALUE. Rows and columns are wakeb-grid-row and wakeb-grid-col elements, not Vuetify VRow/VCol. Item and header types use the Wakeb skeleton grammar: portable names, comma sequences and @N repetitions capped at 100. Unknown names are skipped with WAKEB_UNKNOWN_VALUE; Vuetify-only names still render under Vuetify with WAKEB_DEPRECATED_VALUE. No application CSS is required. The card variant moves avatar list-item bones to the end and makes them 155px high on both providers.\n\n**PrimeVue rendering.** Same grid, grammar, variants and semantics as Vuetify. Vuetify-only names are skipped with WAKEB_UNKNOWN_VALUE instead of rendering. Each item is a `div.wakeb-skeleton` box sized by `width`/`height` (numbers are px) that holds one `.wakeb-skeleton__part--<name>` per parsed name, drawn with PrimeVue `Skeleton` in unstyled mode. Wakeb CSS paints the bones with `--wakeb-ui-border` and a wave animation that stops under reduced motion and reverses in RTL. Sizes approximate Vuetify 3 and are not pixel-identical.\n\n| Name | PrimeVue bones |\n| --- | --- |\n| `text` | One full-width line |\n| `paragraph` | Three lines, the last at 60% |\n| `heading` | One 50% bar, 1.5rem high |\n| `avatar` | One 48px circle |\n| `image` | One full-width block, 200px high |\n| `button` | One 64×36px block |\n| `chip` | One 96×32px pill |\n| `list-item` | One line in a 48px row |\n| `list-item-avatar` | 40px circle and one line |\n| `list-item-two-line` | Two lines |\n| `list-item-three-line` | Three lines |\n| `list-item-avatar-two-line` | 40px circle and two lines |\n| `list-item-avatar-three-line` | 40px circle and three lines |\n| `table` | Heading, five rows of six cells and a footer line |\n| `table-row` | Six cells |\n| `card` | 150px image block and a heading | Under shadcn-vue the grammar, grid and bone shapes match PrimeVue; each bone is the shadcn-vue Skeleton (data-slot=\"skeleton\", aria-hidden), which pulses with --accent and --radius instead of the Wakeb wave and stops under reduced motion.",
      "يستخدم حالة واحدة باسم role=status وaria-busy=true مع إخفاء الصفوف الزخرفية عن ARIA لمنع تكرار القراءة؛ اعرضه أثناء التحميل فقط. repeat يُقرب لأسفل؛ القيم المفقودة وغير المحدودة والصفر والسالب تنتج عمودًا واحدًا. cols الافتراضي 12 للقيم الفارغة وفق العقد السابق. تقبل cols وsm وmd وlg القيم من 1 إلى 12 أو 'auto' أو true (تمدد) على شبكة Wakeb ذات الأعمدة الاثني عشر، ونقاط توقفها ثابتة: sm عند 600px وmd عند 960px وlg عند 1280px، ولا تغيّرها إعدادات المزوّد. القيم الأخرى تُتجاهل (وتأخذ cols القيمة 12) مع WAKEB_UNKNOWN_VALUE. الصفوف والأعمدة عناصر wakeb-grid-row وwakeb-grid-col، وليست VRow/VCol من Vuetify. type يتبع صيغة Skeleton في Wakeb: أسماء قابلة للنقل وتسلسلات بالفواصل وتكرار @N بحد أقصى 100. تُتجاهل الأسماء غير المعروفة مع WAKEB_UNKNOWN_VALUE، وتبقى أسماء Vuetify الخاصة تعمل تحت Vuetify مع WAKEB_DEPRECATED_VALUE. لا يحتاج CSS خاص بالمشروع. يضع النوع card عظام list-item ذات الصورة في النهاية بارتفاع 155px على المزودين.\n\n**الرسم في PrimeVue.** نفس الشبكة والصيغة والأنواع والدلالات كما في Vuetify. تُتجاهل أسماء Vuetify الخاصة مع WAKEB_UNKNOWN_VALUE بدلًا من رسمها. كل عنصر صندوق `div.wakeb-skeleton` بحجم `width`/`height` (الأرقام بالـpx)، ويحتوي `.wakeb-skeleton__part--<name>` لكل اسم، مرسومًا بـ`Skeleton` من PrimeVue دون أنماطه. يلوّن CSS من Wakeb العظام بـ`--wakeb-ui-border` مع حركة موجية تتوقف مع reduced motion وتنعكس في RTL. الأحجام تقارب Vuetify 3 وليست مطابقة تمامًا.\n\n| الاسم | العظام في PrimeVue |\n| --- | --- |\n| `text` | سطر واحد بعرض كامل |\n| `paragraph` | ثلاثة أسطر، آخرها بعرض 60% |\n| `heading` | شريط واحد بعرض 50% وارتفاع 1.5rem |\n| `avatar` | دائرة واحدة بقطر 48px |\n| `image` | كتلة واحدة بعرض كامل وارتفاع 200px |\n| `button` | كتلة واحدة بحجم 64×36px |\n| `chip` | شريحة واحدة بحجم 96×32px |\n| `list-item` | سطر واحد داخل صف بارتفاع 48px |\n| `list-item-avatar` | دائرة 40px وسطر واحد |\n| `list-item-two-line` | سطران |\n| `list-item-three-line` | ثلاثة أسطر |\n| `list-item-avatar-two-line` | دائرة 40px وسطران |\n| `list-item-avatar-three-line` | دائرة 40px وثلاثة أسطر |\n| `table` | عنوان وخمسة صفوف من ست خلايا وسطر تذييل |\n| `table-row` | ست خلايا |\n| `card` | كتلة صورة بارتفاع 150px وعنوان | في shadcn-vue تطابق القواعد والشبكة وأشكال العظام ما في PrimeVue؛ وكل عظمة هي Skeleton من shadcn-vue (data-slot=\"skeleton\" مع aria-hidden)، تنبض بـ--accent و--radius بدل موجة Wakeb، ويتوقف النبض مع reduced motion."
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
    "attrs": [
      "The root `div.steps` with `role=\"list\"` on every provider. `role` is Wakeb-owned and wins over caller attributes; name the list with `label`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الجذري `div.steps` الذي يحمل `role=\"list\"` على كل المزودين. قيمة `role` ملك لـWakeb وتغلب على سمات المستخدم؛ سمِّ القائمة عبر `label`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Uses list/listitem roles. is_active is a visual completion flag, not interactive navigation or aria-current. The host supplies formatted date/time strings and translations. Text is escaped. Steps use positional keys and do not own selection state. Layout uses logical directions and needs no utility framework. This preserves the horizontal row layout; long content should be tested in the host’s available width. PrimeVue renders the same Wakeb list markup and CSS as Vuetify (PrimeVue Stepper is an interactive wizard, so it is not used); the DOM and slot payloads are identical on both providers. Under shadcn-vue the same Wakeb list markup renders; the shadcn-vue Stepper is an interactive wizard and is not used.",
      "يستخدم أدوار list/listitem. is_active حالة اكتمال مرئية، وليس تنقلًا تفاعليًا أو aria-current. المشروع يمرر التاريخ والوقت بعد التنسيق والترجمة. النص آمن من تفسير HTML. المفاتيح موضعية ولا توجد حالة اختيار داخلية. الاتجاهات منطقية ولا يحتاج framework للـutilities. نحافظ على تخطيط الصف الأفقي؛ اختبر النص الطويل في عرض المشروع المتاح. يرسم PrimeVue الـmarkup والـCSS نفسيهما من Wakeb كما في Vuetify (لا يُستخدم Stepper من PrimeVue لأنه معالج تفاعلي)، فيتطابق الـDOM وبيانات الـslots على المزودين. في shadcn-vue يُرسم markup القائمة نفسه من Wakeb؛ ولا يُستخدم Stepper من shadcn-vue لأنه معالج تفاعلي."
    ],
    "example": "<WVerticalSteps :steps=\"[{ title: 'Review', is_active: true, time: '09:00', date: '2026-10-28' }, { title: 'Ship' }]\" label=\"Release steps\" />"
  },
  {
    "name": "WButton",
    "slug": "button",
    "interface": "ButtonProps",
    "summary": [
      "Vuetify buttons with explicit states, icon slots and semantic style variables.",
      "زر Vuetify بحالات واضحة وslots للأيقونات ومتغيرات ألوان مستقلة."
    ],
    "props": [
      [
        "isTooltip",
        "boolean",
        "false",
        "Icon-only tooltip branch using title as the tooltip text.",
        "فرع زر الأيقونة مع Tooltip نصه title."
      ],
      [
        "location",
        "\"top\" | \"bottom\" | \"start\" | \"end\"",
        "\"top\"",
        "Tooltip placement.",
        "موضع Tooltip."
      ],
      [
        "title",
        "string",
        "\"\"",
        "Escaped button text; an empty title uses the content slot.",
        "نص آمن؛ title الفارغ يستخدم content slot."
      ],
      [
        "classList",
        "ComponentClass",
        "\"\"",
        "Classes on the actual Vuetify button.",
        "classes على الزر الفعلي."
      ],
      [
        "iconPosition",
        "\"start\" | \"end\"",
        "\"start\"",
        "Icon location around a nonempty title.",
        "موضع الأيقونة حول العنوان."
      ],
      [
        "type",
        "string",
        "\"primary\"",
        "primary/secondary/outline/danger/tertiary/link/icon/table-icon/text; custom strings add classes.",
        "الأنواع primary/secondary/outline/danger/tertiary/link/icon/table-icon/text؛ القيم الأخرى تضيف classes فقط."
      ],
      [
        "size",
        "string",
        "\"lg\"",
        "xl/lg/md/sm; custom strings need consumer CSS.",
        "المقاسات xl/lg/md/sm؛ القيم الأخرى تحتاج CSS من المستهلك."
      ],
      [
        "isLoading",
        "boolean",
        "false",
        "Vuetify loading indicator plus the shared loading style.",
        "مؤشر تحميل Vuetify مع تنسيق التحميل العام."
      ],
      [
        "isDropdown",
        "boolean",
        "false",
        "Append the dropdown slot or the built-in $expand chevron.",
        "إضافة dropdown slot أو السهم المدمج $expand."
      ],
      [
        "action",
        "\"button\" | \"submit\" | \"reset\"",
        "\"button\"",
        "Native HTML button type.",
        "نوع زر HTML الفعلي."
      ],
      [
        "disabled",
        "boolean",
        "false",
        "Native disabled state.",
        "حالة تعطيل HTML."
      ],
      [
        "icon",
        "SharedIcon",
        "\"\"",
        "Icon name, SVG path data or component, resolved as described in Providers > Icons; the icon slot receives the value as passed.",
        "اسم أيقونة أو بيانات مسار SVG أو مكوّن، ويُحل كما في المزودات > الأيقونات؛ ويستقبل icon slot القيمة كما مُررت."
      ],
      [
        "iconSize",
        "string | number",
        "\"sm\"",
        "xs/sm/md/lg/xl map to 16/20/24/32/40px; free uses Vuetify default.",
        "xs/sm/md/lg/xl تعني 16/20/24/32/40px؛ free يستخدم افتراضي Vuetify."
      ],
      [
        "maxIconWidth",
        "string | number",
        "\"100%\"",
        "Maximum icon width; numeric fallback widths use px.",
        "أقصى عرض للأيقونة؛ الرقم يُحول إلى px في العرض الافتراضي."
      ],
      [
        "iconColorType",
        "\"danger\" | \"primary\" | \"success\" | \"warning\" | \"currentColor\"",
        "\"currentColor\"",
        "Semantic icon role, resolved through namespaced CSS variables.",
        "لون دلالي للأيقونة من متغيرات CSS المستقلة."
      ],
      [
        "customIconColor",
        "string",
        "\"\"",
        "Explicit icon color; takes precedence over the role.",
        "لون صريح للأيقونة وله الأولوية."
      ],
      [
        "wrapperAttrs",
        "Record<string, unknown>",
        "{}",
        "Explicit attributes for the outer layout div; normal attrs target the button.",
        "attributes صريحة لحاوية div الخارجية؛ attributes العادية تصل إلى الزر."
      ],
      [
        "providerProps",
        "WakebProviderProps",
        "undefined",
        "Nonportable. Native props and listeners for the selected provider's button primitive (Vuetify `VBtn`, PrimeVue `Button`). Wakeb-owned keys (`disabled`, `loading`, `type`, `onClick`, link and element keys; on PrimeVue also `label`, `badge`, `unstyled`, `pt`) and portable attributes are ignored with a development warning.",
        "غير قابل للنقل. خصائص وأحداث أصلية لـprimitive الزر في المزود المختار (`VBtn` في Vuetify و`Button` في PrimeVue). المفاتيح التي يملكها Wakeb (`disabled` و`loading` و`type` و`onClick` ومفاتيح الروابط وتغيير العنصر، وفي PrimeVue أيضًا `label` و`badge` و`unstyled` و`pt`) والسمات القابلة للنقل تُتجاهل مع تحذير في وضع التطوير."
      ]
    ],
    "slots": [
      "`icon` and `dropdown`: `{ icon, size, color, maxWidth }`. `content` (or `default` fallback): content when title is empty and isTooltip=false. Tooltip mode renders the icon only. Icons resolve through the icons plugin option and the Wakeb built-ins; other names render through VIcon under Vuetify (configure its icon set/font) and as the fallback box under other providers.",
      "`icon` و`dropdown`: يستقبلان `{ icon, size, color, maxWidth }`. `content` أو `default` كبديل: محتوى عند فراغ title وisTooltip=false. وضع Tooltip يعرض الأيقونة فقط. تُحل الأيقونات عبر الخيار icons والأيقونات المدمجة في Wakeb؛ وبقية الأسماء تُرسم عبر VIcon تحت Vuetify (جهز مجموعة/خط أيقوناته) وكمربع بديل مع المزودات الأخرى."
    ],
    "variables": [
      [
        "--wakeb-button-danger-background",
        "#d92d20"
      ],
      [
        "--wakeb-button-danger-border",
        "transparent"
      ],
      [
        "--wakeb-button-danger-color",
        "#fff"
      ],
      [
        "--wakeb-button-danger-disabled-background",
        "#eaecf0"
      ],
      [
        "--wakeb-button-danger-disabled-border",
        "#eaecf0"
      ],
      [
        "--wakeb-button-danger-disabled-color",
        "#98a2b3"
      ],
      [
        "--wakeb-button-danger-disabled-opacity",
        ".5"
      ],
      [
        "--wakeb-button-danger-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-danger-hover-background",
        "#b42318"
      ],
      [
        "--wakeb-button-danger-hover-border",
        "transparent"
      ],
      [
        "--wakeb-button-danger-loading-background",
        "#d92d20"
      ],
      [
        "--wakeb-button-danger-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-disabled-text",
        "#667085"
      ],
      [
        "--wakeb-button-fallback",
        "not defined (normal per-token defaults)"
      ],
      [
        "--wakeb-button-icon-background",
        "transparent"
      ],
      [
        "--wakeb-button-icon-color",
        "#344054"
      ],
      [
        "--wakeb-button-icon-hover-background",
        "transparent"
      ],
      [
        "--wakeb-button-icon-hover-color",
        "#344054"
      ],
      [
        "--wakeb-button-icon-primary",
        "#087f8c"
      ],
      [
        "--wakeb-button-icon-success",
        "#12b76a"
      ],
      [
        "--wakeb-button-icon-warning",
        "#f79009"
      ],
      [
        "--wakeb-button-link-color",
        "#344054"
      ],
      [
        "--wakeb-button-link-disabled-opacity",
        ".5"
      ],
      [
        "--wakeb-button-link-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-link-hover-color",
        "#344054"
      ],
      [
        "--wakeb-button-link-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-outline-background",
        "transparent"
      ],
      [
        "--wakeb-button-outline-border",
        "transparent"
      ],
      [
        "--wakeb-button-outline-color",
        "#344054"
      ],
      [
        "--wakeb-button-outline-danger-text",
        "#b42318"
      ],
      [
        "--wakeb-button-outline-disabled-background",
        "#eaecf0"
      ],
      [
        "--wakeb-button-outline-disabled-border",
        "#eaecf0"
      ],
      [
        "--wakeb-button-outline-disabled-color",
        "#98a2b3"
      ],
      [
        "--wakeb-button-outline-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-outline-hover-background",
        "transparent"
      ],
      [
        "--wakeb-button-outline-hover-border",
        "transparent"
      ],
      [
        "--wakeb-button-outline-loading-background",
        "transparent"
      ],
      [
        "--wakeb-button-outline-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-primary-background",
        "#087f8c"
      ],
      [
        "--wakeb-button-primary-border",
        "transparent"
      ],
      [
        "--wakeb-button-primary-color",
        "#fff"
      ],
      [
        "--wakeb-button-primary-disabled-background",
        "#eaecf0"
      ],
      [
        "--wakeb-button-primary-disabled-border",
        "#eaecf0"
      ],
      [
        "--wakeb-button-primary-disabled-color",
        "#98a2b3"
      ],
      [
        "--wakeb-button-primary-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-primary-hover-background",
        "#066b75"
      ],
      [
        "--wakeb-button-primary-hover-border",
        "transparent"
      ],
      [
        "--wakeb-button-primary-loading-background",
        "#087f8c"
      ],
      [
        "--wakeb-button-primary-loading-border",
        "transparent"
      ],
      [
        "--wakeb-button-primary-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-radius",
        "12px"
      ],
      [
        "--wakeb-button-secondary-background",
        "#f2f4f7"
      ],
      [
        "--wakeb-button-secondary-border",
        "transparent"
      ],
      [
        "--wakeb-button-secondary-color",
        "#344054"
      ],
      [
        "--wakeb-button-secondary-disabled-background",
        "#eaecf0"
      ],
      [
        "--wakeb-button-secondary-disabled-border",
        "#eaecf0"
      ],
      [
        "--wakeb-button-secondary-disabled-color",
        "#98a2b3"
      ],
      [
        "--wakeb-button-secondary-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-secondary-hover-background",
        "#f2f4f7"
      ],
      [
        "--wakeb-button-secondary-hover-border",
        "transparent"
      ],
      [
        "--wakeb-button-secondary-loading-background",
        "#f2f4f7"
      ],
      [
        "--wakeb-button-secondary-surface",
        "#f2f4f7"
      ],
      [
        "--wakeb-button-secondary-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-secondary-text",
        "#344054"
      ],
      [
        "--wakeb-button-size-lg-font-size",
        "1rem"
      ],
      [
        "--wakeb-button-size-lg-gap",
        "6px"
      ],
      [
        "--wakeb-button-size-lg-padding",
        "10px 16px"
      ],
      [
        "--wakeb-button-size-md-font-size",
        ".875rem"
      ],
      [
        "--wakeb-button-size-md-gap",
        "4px"
      ],
      [
        "--wakeb-button-size-md-padding",
        "10px 14px"
      ],
      [
        "--wakeb-button-size-sm-font-size",
        ".75rem"
      ],
      [
        "--wakeb-button-size-sm-gap",
        "4px"
      ],
      [
        "--wakeb-button-size-sm-padding",
        "8px 12px"
      ],
      [
        "--wakeb-button-size-xl-font-size",
        "1.125rem"
      ],
      [
        "--wakeb-button-size-xl-gap",
        "6px"
      ],
      [
        "--wakeb-button-size-xl-padding",
        "12px 18px"
      ],
      [
        "--wakeb-button-table-icon-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-color",
        "#344054"
      ],
      [
        "--wakeb-button-table-icon-delete-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-delete-border",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-delete-color",
        "#344054"
      ],
      [
        "--wakeb-button-table-icon-edit-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-edit-border",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-edit-color",
        "#344054"
      ],
      [
        "--wakeb-button-table-icon-radius",
        "8px"
      ],
      [
        "--wakeb-button-table-icon-restore-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-restore-border",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-restore-color",
        "#344054"
      ],
      [
        "--wakeb-button-table-icon-unlock-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-unlock-border",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-unlock-color",
        "#344054"
      ],
      [
        "--wakeb-button-table-icon-view-background",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-view-border",
        "transparent"
      ],
      [
        "--wakeb-button-table-icon-view-color",
        "#344054"
      ],
      [
        "--wakeb-button-tertiary-background",
        "transparent"
      ],
      [
        "--wakeb-button-tertiary-border",
        "transparent"
      ],
      [
        "--wakeb-button-tertiary-color",
        "#344054"
      ],
      [
        "--wakeb-button-tertiary-disabled-background",
        "#eaecf0"
      ],
      [
        "--wakeb-button-tertiary-disabled-border",
        "#eaecf0"
      ],
      [
        "--wakeb-button-tertiary-disabled-color",
        "#98a2b3"
      ],
      [
        "--wakeb-button-tertiary-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-tertiary-hover-background",
        "transparent"
      ],
      [
        "--wakeb-button-tertiary-loading-background",
        "transparent"
      ],
      [
        "--wakeb-button-tertiary-svg",
        "currentColor"
      ],
      [
        "--wakeb-button-text-color",
        "#344054"
      ],
      [
        "--wakeb-button-text-focus-outline",
        "#087f8c"
      ],
      [
        "--wakeb-button-text-hover-color",
        "#344054"
      ]
    ],
    "attrs": [
      "The native `<button>` on every provider, not the outer layout div; use `wrapperAttrs` for that div. Wakeb's type, disabled and loading handling win, and a caller `onClick` is the portable click, emitted once. `providerProps` reaches the same button primitive below the caller attributes. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "عنصر `<button>` الأصلي على كل المزودين، وليس الـdiv الخارجي المخصص للتخطيط؛ استخدم `wrapperAttrs` لذلك الـdiv. تبقى معالجة type وdisabled وloading الخاصة بـWakeb هي الغالبة، و`onClick` من المستخدم هو حدث click القابل للنقل ويُرسل مرة واحدة. يصل `providerProps` إلى primitive الزر نفسه بأولوية أقل من سمات المستخدم. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "The native element keeps form/type, disabled state and Vuetify aria-busy behavior. Click emits its original MouseEvent once; .stop/.prevent can be used by the host. Native keyboard activation is left to the browser. Icon-only buttons need an aria-label; tooltip buttons use title as a fallback accessible name. Tooltip focus listeners are composed with consumer listeners. Loading acts like disabled for activation in standard and tooltip modes: no click event and no native submit/reset. It is still not a request lock; the host owns request state. A native loading attr also reaches VBtn and does not add the isLoading style class. Reduced-motion settings remove shared transitions. The outer div is retained for layout; wrapperAttrs does not redirect native attrs. Unknown variants/sizes are extension classes. The compatibility-only --wakeb-button-fallback switch is reserved for adapters; leave it undefined for normal defaults.",
      "الزر يحتفظ بـform/type والتعطيل وaria-busy من Vuetify. click يمرر MouseEvent الأصلي مرة واحدة ويدعم .stop/.prevent. التفعيل بالكيبورد يتبع المتصفح. زر الأيقونة يحتاج aria-label؛ زر Tooltip يستخدم title كاسم بديل. أحداث التركيز تُدمج مع أحداث Vuetify. التحميل يعمل مثل التعطيل في الوضع العادي ووضع Tooltip: لا يرسل click ولا يرسل الفورم أو يعيد ضبطه. ومع ذلك ليس قفلًا للطلبات؛ المشروع يملك حالة الطلب. attribute باسم loading يصل أيضًا إلى VBtn دون إضافة class الخاصة بـisLoading. reduced-motion يلغي transitions المشتركة. div الخارجية مخصصة للتخطيط؛ wrapperAttrs لا يغيّر وجهة attributes العادية. الأنواع والمقاسات غير المعروفة classes للتوسعة. متغير --wakeb-button-fallback مخصص للتوافق؛ اتركه غير معرف لاستخدام القيم الافتراضية."
    ],
    "example": "<WButton title=\"Save changes\" action=\"submit\" type=\"primary\" />",
    "playground": "FoundationPlayground",
    "events": [
      "`click(event: MouseEvent)` — original native event, once per activation.",
      "`click(event: MouseEvent)` — الحدث الأصلي مرة واحدة لكل تفعيل."
    ]
  },
  {
    "name": "WBadge",
    "slug": "badge",
    "interface": "BadgeProps",
    "summary": [
      "Semantic chips with independent colors, dot styles and ordered icon/action slots.",
      "شارات بألوان دلالية ونقطة قابلة للتخصيص وترتيب ثابت للأيقونة والـactions."
    ],
    "props": [
      [
        "label",
        "string",
        "\"\"",
        "Escaped fallback content.",
        "النص الافتراضي الآمن."
      ],
      [
        "classList",
        "ComponentClass",
        "\"\"",
        "Classes on the chip.",
        "classes على الشارة."
      ],
      [
        "type",
        "WakebBadgeType",
        "\"primary\"",
        "Wakeb style key painted by Wakeb CSS: primary, primarybtn, success, danger, warning, info, outline, outline-secondary, transparent, dark, tertiary, success-transparent, danger-transparent, check, uncheck. It is no longer sent to Vuetify as a color. Other values are deprecated Vuetify color names: they still render under Vuetify with WAKEB_DEPRECATED_VALUE. Under PrimeVue they fall back to primary with WAKEB_UNKNOWN_VALUE.",
        "مفتاح نمط ترسمه Wakeb CSS: primary وprimarybtn وsuccess وdanger وwarning وinfo وoutline وoutline-secondary وtransparent وdark وtertiary وsuccess-transparent وdanger-transparent وcheck وuncheck. لم يعد يُرسل إلى Vuetify كلون. القيم الأخرى أسماء ألوان Vuetify مهملة، وما زالت تعمل تحت Vuetify مع WAKEB_DEPRECATED_VALUE. وتحت PrimeVue ترجع إلى primary مع WAKEB_UNKNOWN_VALUE."
      ],
      [
        "icon",
        "SharedIcon",
        "\"\"",
        "Icon name, SVG path data or component (Providers > Icons), or the icon-slot value.",
        "اسم أيقونة أو بيانات مسار SVG أو مكوّن (المزودات > الأيقونات)، أو قيمة icon slot."
      ],
      [
        "isDot",
        "boolean",
        "false",
        "Show the decorative dot before content.",
        "عرض النقطة الزخرفية قبل المحتوى."
      ],
      [
        "borderRadius",
        "string",
        "\"md\"",
        "sm selects 8px; md/default preserves the 24px chip radius.",
        "sm يختار 8px؛ md والافتراضي يحتفظان بنصف قطر 24px."
      ],
      [
        "customBorderRadius",
        "string",
        "\"\"",
        "Explicit CSS border radius.",
        "قيمة CSS صريحة لنصف القطر."
      ],
      [
        "customPadding",
        "string",
        "\"\"",
        "Explicit padding, auto height and tighter content gap.",
        "padding صريح وارتفاع تلقائي ومسافة محتوى أصغر."
      ],
      [
        "dotColor",
        "WakebColor",
        "undefined",
        "Dot color override. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color.",
        "لون النقطة. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS."
      ],
      [
        "variant",
        "WakebVariant | WakebDeprecatedVariant",
        "\"soft\"",
        "Portable style: soft, solid, outline or ghost. Baseline names (default, tonal, flat, elevated, outlined, text, plain) still work and warn in development.",
        "النمط القابل للنقل: soft أو solid أو outline أو ghost. الأسماء القديمة (default وtonal وflat وelevated وoutlined وtext وplain) ما زالت تعمل مع تحذير في وضع التطوير."
      ],
      [
        "iconSize",
        "string | number",
        "\"xs\"",
        "xs/sm/md/lg/xl map to 16/20/24/32/40px.",
        "xs/sm/md/lg/xl تعني 16/20/24/32/40px."
      ],
      [
        "iconPosition",
        "\"before\" | \"after\"",
        "\"before\"",
        "Place icon and actions before or after the content.",
        "موضع الأيقونة والـactions قبل أو بعد المحتوى."
      ],
      [
        "chipAttrs",
        "Record<string, unknown>",
        "{}",
        "Explicit attrs for the chip element (VChip on Vuetify, the unstyled PrimeVue Tag on PrimeVue); normal attrs belong to the wrapper.",
        "attributes صريحة لعنصر الشارة (VChip في Vuetify، وTag من PrimeVue دون أنماطه في PrimeVue)؛ العادية تصل للحاوية الخارجية."
      ]
    ],
    "slots": [
      "`default`: replaces label. `icon`: `{ icon, size }`, with a provider icon fallback. `actions`: follows the icon. Before order: icon/actions/dot/content. After order: dot/content/icon/actions.",
      "`default`: يستبدل label. `icon`: يستقبل `{ icon, size }` مع أيقونة المزود كافتراضي. `actions`: يلي الأيقونة. الترتيب before: أيقونة/actions/نقطة/محتوى؛ after: نقطة/محتوى/أيقونة/actions."
    ],
    "variables": [
      [
        "--wakeb-badge-check-color",
        "#667085"
      ],
      [
        "--wakeb-badge-danger-bg",
        "#fef3f2"
      ],
      [
        "--wakeb-badge-danger-bg-rgb",
        "254, 243, 242"
      ],
      [
        "--wakeb-badge-danger-dot",
        "#f04438"
      ],
      [
        "--wakeb-badge-danger-text",
        "#b42318"
      ],
      [
        "--wakeb-badge-dark-bg",
        "#fff"
      ],
      [
        "--wakeb-badge-dark-text",
        "#667085"
      ],
      [
        "--wakeb-badge-fallback",
        "not defined (normal per-token defaults)"
      ],
      [
        "--wakeb-badge-info-bg",
        "#f0f9ff"
      ],
      [
        "--wakeb-badge-info-dot",
        "#0ba5ec"
      ],
      [
        "--wakeb-badge-info-text",
        "#026aa2"
      ],
      [
        "--wakeb-badge-neutral-bg",
        "#f2f4f7"
      ],
      [
        "--wakeb-badge-neutral-text",
        "#667085"
      ],
      [
        "--wakeb-badge-solid-bg",
        "type dot color / --wakeb-ui-primary"
      ],
      [
        "--wakeb-badge-solid-text",
        "--wakeb-ui-on-primary / #fff"
      ],
      [
        "--wakeb-badge-outline-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-badge-outline-secondary-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-badge-outline-secondary-text",
        "#667085"
      ],
      [
        "--wakeb-badge-primary-bg",
        "#eff8ff"
      ],
      [
        "--wakeb-badge-primary-button-bg",
        "#087f8c"
      ],
      [
        "--wakeb-badge-primary-dot",
        "#2e90fa"
      ],
      [
        "--wakeb-badge-primary-text",
        "#175cd3"
      ],
      [
        "--wakeb-badge-success-bg",
        "#ecfdf3"
      ],
      [
        "--wakeb-badge-success-bg-rgb",
        "236, 253, 243"
      ],
      [
        "--wakeb-badge-success-dot",
        "#12b76a"
      ],
      [
        "--wakeb-badge-success-text",
        "#027a48"
      ],
      [
        "--wakeb-badge-tertiary-bg-rgb",
        "242, 244, 247"
      ],
      [
        "--wakeb-badge-tertiary-text",
        "#667085"
      ],
      [
        "--wakeb-badge-warning-bg",
        "#fffaeb"
      ],
      [
        "--wakeb-badge-warning-dot",
        "#f79009"
      ],
      [
        "--wakeb-badge-warning-text",
        "#b54708"
      ]
    ],
    "attrs": [
      "The root wrapper `div`. The chip inside receives only `chipAttrs`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "الحاوية الجذرية `div`. الـchip الداخلي يستقبل `chipAttrs` فقط. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "A badge is presentational unless explicit chipAttrs make it interactive. Supply visible status text; color and dot alone are not an accessible label. Native wrapper listeners receive bubbling DOM events; there are no custom emits. Chip styles preserve the extracted outline descendant backgrounds and specialized class hooks. Custom icons belong in the icon slot. Semantic variables customize colors without app tokens. Current-color variables are implementation details; use dotColor or documented semantic tokens. The compatibility-only --wakeb-badge-fallback switch stays undefined in normal use. Every renderer marks the chip with .wakeb-badge, its Wakeb type class and one of .wakeb-badge--soft, --solid, --outline or --ghost. Under PrimeVue: the chip is an unstyled PrimeVue Tag (a span) whose content sits in span.wakeb-badge__content; the same Wakeb stylesheet as on Vuetify paints types, the solid variant, radius, padding and the dot, and Wakeb CSS adds the VChip looks for soft (12% currentColor underlay) and outline (1px currentColor border). chipAttrs reach the Tag element as DOM attributes, so VChip props in it have no effect. Non-Wakeb types are not colors: primary is used with WAKEB_UNKNOWN_VALUE. Icons render through the Wakeb icon renderer; MDI names need an icons alias. providerProps is not accepted on either provider.",
      "الشارة للعرض ما لم تجعلها chipAttrs تفاعلية. قدم نص حالة واضحًا؛ اللون والنقطة وحدهما لا يمثلان اسمًا لقارئ الشاشة. أحداث الحاوية هي أحداث DOM المتصاعدة ولا توجد emits مخصصة. التنسيق يحتفظ بخلفيات descendants للنوع outline وclasses الخاصة. ضع الأيقونات المخصصة في icon slot. الألوان الدلالية مستقلة عن tokens المشروع. متغيرات اللون الحالي داخلية؛ استخدم dotColor أو tokens الموثقة. اترك --wakeb-badge-fallback غير معرف في الاستخدام العادي. كل renderer يضع على الشارة class ‏.wakeb-badge وclass نوع Wakeb وواحدًا من .wakeb-badge--soft و--solid و--outline و--ghost. تحت PrimeVue: الشارة مكوّن Tag من PrimeVue دون أنماطه (span)، ومحتواها داخل span.wakeb-badge__content؛ وملف أنماط Wakeb نفسه المستخدم في Vuetify يرسم الأنواع والنمط solid ونصف القطر والـpadding والنقطة، وتضيف Wakeb CSS مظهري VChip في soft (طبقة سفلية من currentColor بنسبة 12%) وoutline (حد بعرض 1px من currentColor). تصل chipAttrs إلى عنصر Tag كسمات DOM، فلا أثر لخصائص VChip فيها. الأنواع غير التابعة لـWakeb ليست ألوانًا: يُستخدم primary مع WAKEB_UNKNOWN_VALUE. تُرسم الأيقونات عبر عارض أيقونات Wakeb، وتحتاج أسماء MDI إلى alias في الخيار icons. لا يقبل أي من المزودين providerProps."
    ],
    "example": "<WBadge label=\"Approved\" type=\"success\" is-dot />",
    "playground": "FoundationPlayground"
  },
  {
    "name": "WAccordion",
    "slug": "accordion",
    "interface": "AccordionProps",
    "summary": [
      "Disclosure panels with preserved content, scoped headers and keyboard-ready default triggers.",
      "لوحات فتح وإغلاق تحتفظ بالمحتوى، مع header slots وزر افتراضي يدعم الكيبورد."
    ],
    "props": [
      [
        "title",
        "string",
        "\"\"",
        "Default title and accessible toggle name.",
        "العنوان الافتراضي واسم زر الفتح."
      ],
      [
        "modelValue",
        "boolean",
        "false",
        "Initial/external open state; internal clicks remain usable without parent updates.",
        "حالة الفتح الابتدائية والخارجية؛ النقر الداخلي يعمل دون تحديث الوالد."
      ],
      [
        "classList",
        "ComponentClass",
        "\"\"",
        "Classes on the accordion root.",
        "classes على الحاوية."
      ],
      [
        "icon",
        "SharedIcon",
        "\"$expand\"",
        "Indicator icon supplied to WButton or toggleIcon.",
        "أيقونة المؤشر لـWButton أو toggleIcon."
      ],
      [
        "noBorder",
        "boolean",
        "false",
        "Remove outer border and radius.",
        "إزالة الحد الخارجي ونصف القطر."
      ],
      [
        "beforeIcon",
        "boolean",
        "false",
        "Show a toggle before the title.",
        "عرض زر فتح قبل العنوان."
      ],
      [
        "afterIcon",
        "boolean",
        "false",
        "Show a toggle after the title.",
        "عرض زر فتح بعد العنوان."
      ],
      [
        "iconColor",
        "WakebColor",
        "undefined",
        "Indicator color override. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color.",
        "لون المؤشر. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS."
      ],
      [
        "iconSize",
        "string | number",
        "\"sm\"",
        "Indicator icon size.",
        "حجم أيقونة المؤشر."
      ],
      [
        "maxIconWidth",
        "string | number",
        "\"100%\"",
        "Indicator maximum width.",
        "أقصى عرض للمؤشر."
      ],
      [
        "headerTitleClassList",
        "ComponentClass",
        "\"\"",
        "Classes on the default title trigger.",
        "classes على زر العنوان الافتراضي."
      ],
      [
        "headerClassList",
        "ComponentClass",
        "\"\"",
        "Classes on the clickable header.",
        "classes على الـheader القابل للنقر."
      ],
      [
        "bodyClassList",
        "ComponentClass",
        "\"\"",
        "Classes on the retained body.",
        "classes على المحتوى المحتفظ به."
      ],
      [
        "transparent",
        "boolean",
        "false",
        "Transparent outer background.",
        "خلفية خارجية شفافة."
      ],
      [
        "toggleLabel",
        "string",
        "\"\"",
        "Localized toggle name; fallback is title, then Toggle section.",
        "اسم مترجم لزر الفتح؛ البديل title ثم Toggle section."
      ],
      [
        "contentId",
        "string",
        "\"\"",
        "Explicit panel ID; otherwise a stable Vue useId-based ID.",
        "معرف صريح للمحتوى؛ وإلا معرف ثابت من Vue useId."
      ]
    ],
    "slots": [
      "`header`: `{ open, toggle, triggerProps }`; bind triggerProps to a native button for keyboard/ARIA behavior. `actions`: `{ open, toggle }`, isolated from header clicks. `default`: `{ open }`, retained with v-show. `toggleIcon`: `{ icon, size, color, maxWidth }`. Indicators inherit the documented WButton CSS variables.",
      "`header`: يستقبل `{ open, toggle, triggerProps }`؛ اربط triggerProps بزر HTML لدعم الكيبورد وARIA. `actions`: يستقبل `{ open, toggle }` مع عزله عن نقر الـheader. `default`: يستقبل `{ open }` ويحتفظ بالمحتوى عبر v-show. `toggleIcon`: يستقبل `{ icon, size, color, maxWidth }`. المؤشرات ترث متغيرات CSS الموثقة لـWButton."
    ],
    "variables": [
      [
        "--wakeb-accordion-background",
        "#fff"
      ],
      [
        "--wakeb-accordion-body-background",
        "#fff"
      ],
      [
        "--wakeb-accordion-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-accordion-fallback",
        "not defined (normal per-token defaults)"
      ],
      [
        "--wakeb-accordion-focus",
        "#087f8c"
      ],
      [
        "--wakeb-accordion-hover-rgb",
        "249, 250, 251"
      ],
      [
        "--wakeb-accordion-radius",
        "12px"
      ],
      [
        "--wakeb-accordion-title",
        "#101828"
      ]
    ],
    "attrs": [
      "The root `div.accordion`. The toggle button keeps Wakeb's aria-expanded and aria-controls. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الجذري `div.accordion`. يحتفظ زر الفتح والطي بقيم aria-expanded وaria-controls التي يضعها Wakeb. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "The default title is a native button with aria-expanded/aria-controls; pointer clicks elsewhere on the header also toggle. Icon toggles stop propagation so one activation emits one update. Actions never toggle the panel. Custom headers must supply their own accessible control via triggerProps; stop unrelated interactive header controls from bubbling. The body uses v-show, retaining nested form state. Parent modelValue changes synchronize local state without echoing an update event; local clicks also work when a parent supplies a constant value. Vue useId is stable per application/SSR request; use unique app.config.idPrefix values for multiple independent Vue apps. Motion respects reduced-motion preferences. Indicator rotation preserves 180deg when closed and 0deg when open. The compatibility --wakeb-accordion-fallback switch is reserved for adapters. When a title is set, the panel is a region named by it. PrimeVue renders the same Wakeb disclosure markup and uses the PrimeVue WButton for the icon toggles; it does not use PrimeVue's Accordion component, so there is no PrimeVue panel model or header DOM. Under shadcn-vue the same Wakeb disclosure renders; the indicators are WButton (the shadcn-vue Button, data-slot=\"button\") and the closed panel stays mounted with v-show. reka-ui Collapsible is not used because it unmounts a closed panel.",
      "العنوان الافتراضي زر HTML يحمل aria-expanded/aria-controls؛ النقر على باقي الـheader يفتح ويغلق أيضًا. أزرار المؤشرات توقف تصاعد الحدث فكل تفعيل يرسل تحديثًا واحدًا. actions لا يفتح اللوحة. الـheader المخصص يحتاج زرًا قابلًا للوصول عبر triggerProps مع إيقاف تصاعد أحداث التحكم غير المرتبطة. المحتوى يستخدم v-show للاحتفاظ بحالة الفورم. تحديث modelValue الخارجي يزامن الحالة دون إعادة إرسال الحدث، والنقر يعمل حتى مع قيمة ثابتة من الوالد. Vue useId ثابت لكل تطبيق/طلب SSR؛ استخدم app.config.idPrefix مختلفًا للتطبيقات المستقلة المتعددة. الحركة تحترم reduced-motion. دوران المؤشر 180deg عند الإغلاق و0deg عند الفتح كما في العقد المستخرج. --wakeb-accordion-fallback مخصص للتوافق. عند تحديد title تصبح اللوحة region يحمل اسمه. يرسم PrimeVue نفس عناصر الفتح والإغلاق الخاصة بـWakeb ويستخدم WButton الخاص بـPrimeVue لأزرار المؤشرات؛ ولا يستخدم مكوّن Accordion من PrimeVue، فلا يوجد نموذج لوحات أو DOM للـheader من PrimeVue. في shadcn-vue يُرسم عنصر الإفصاح نفسه من Wakeb؛ والمؤشرات هي WButton (زر shadcn-vue مع data-slot=\"button\")، وتبقى اللوحة المغلقة مركّبة عبر v-show. لا يُستخدم Collapsible من reka-ui لأنه يزيل اللوحة المغلقة."
    ],
    "example": "<WAccordion title=\"Details\" after-icon :model-value=\"true\"><p>Persistent panel content</p></WAccordion>",
    "playground": "FoundationPlayground",
    "events": [
      "`update:modelValue(value: boolean)` — emitted only by local toggle actions.",
      "`update:modelValue(value: boolean)` — يُرسل عند التفعيل المحلي فقط."
    ]
  },
  {
    "name": "WBadgeStack",
    "slug": "badge-stack",
    "interface": "BadgeStackProps",
    "summary": [
      "Badges with per-item styling, image slots and an optional overflow menu.",
      "مجموعة شارات بتخصيص لكل عنصر وأيقونات قابلة للاستبدال وقائمة زيادة اختيارية."
    ],
    "props": [
      [
        "items",
        "readonly BadgeStackItem[]",
        "[]",
        "Records with label, image URL, color and per-badge overrides.",
        "عناصر تحمل الاسم ورابط الصورة واللون وتخصيصات الشارة."
      ],
      [
        "max",
        "number",
        "1",
        "Visible item slice limit; use a finite nonnegative integer.",
        "حد العناصر الظاهرة؛ استخدم عددًا صحيحًا محدودًا لا يقل عن صفر."
      ],
      [
        "truncateLength",
        "number",
        "12",
        "Visible label length including the three-dot suffix. Overflow labels stay full.",
        "طول الاسم الظاهر شامل النقاط؛ أسماء قائمة الزيادة كاملة."
      ],
      [
        "showOverflowMenu",
        "boolean",
        "false",
        "Enable a real hover/click/keyboard overflow list on +N (a Vuetify menu or a PrimeVue Popover).",
        "تفعيل قائمة زيادة حقيقية عند hover أو النقر أو الكيبورد على +N (قائمة Vuetify أو Popover في PrimeVue)."
      ],
      [
        "badgeType",
        "string",
        "\"transparent\"",
        "Default WBadge semantic type.",
        "نوع WBadge الافتراضي."
      ],
      [
        "badgeVariant",
        "BadgeProps[\"variant\"]",
        "\"soft\"",
        "Style of every badge and of the +N badge; an item variant overrides it per row. Baseline names warn in development.",
        "نمط كل الشارات وشارة +N، ويتقدم عليه variant الخاص بكل عنصر. الأسماء القديمة تعطي تحذيرًا في وضع التطوير."
      ],
      [
        "badgeBorderRadius",
        "string",
        "\"md\"",
        "Default preset radius.",
        "نصف القطر الافتراضي."
      ],
      [
        "customBorderRadius",
        "string",
        "\"sm\"",
        "Legacy custom radius passed verbatim; use a CSS length for new code.",
        "القيمة القديمة تمر كما هي؛ استخدم طول CSS صالحًا في المشاريع الجديدة."
      ],
      [
        "badgePadding",
        "string",
        "\"\"",
        "Default custom chip padding.",
        "حشو الشارة المخصص."
      ],
      [
        "dotColor",
        "WakebColor",
        "undefined",
        "Default dot color. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color. Item color and dotColor follow the same rule.",
        "لون النقطة الافتراضي. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS. تتبع color وdotColor في العناصر القاعدة نفسها."
      ],
      [
        "badgeClassList",
        "ComponentClass",
        "\"\"",
        "Classes applied to each chip.",
        "classes على كل chip."
      ],
      [
        "isDot",
        "boolean",
        "false",
        "Default status dot visibility.",
        "إظهار نقطة الحالة افتراضيًا."
      ],
      [
        "iconSize",
        "string | number",
        "\"xs\"",
        "Default badge glyph size; image dimensions use the stack stylesheet.",
        "حجم glyph؛ أبعاد الصور تحددها أنماط المجموعة."
      ],
      [
        "iconPosition",
        "\"before\" | \"after\"",
        "\"before\"",
        "Image/glyph placement in each badge.",
        "موضع الأيقونة أو الصورة داخل الشارة."
      ],
      [
        "iconVariant",
        "\"default\" | \"circle\"",
        "\"default\"",
        "Flat images or a circular image wrapper.",
        "صورة عادية أو حاوية دائرية."
      ],
      [
        "iconBackgroundOpacity",
        "number",
        "1",
        "Circle background mix, clamped to 0–1.",
        "قوة لون الدائرة، بين صفر وواحد."
      ],
      [
        "customOverflowBorderRadius",
        "string",
        "\"999px\"",
        "Custom radius of +N when it opens a menu.",
        "نصف قطر +N عندما يفتح قائمة."
      ],
      [
        "overflowLabel",
        "string",
        "\"\"",
        "Accessible menu button name; fallback +N.",
        "الاسم المقروء لزر القائمة؛ البديل +N."
      ],
      [
        "overflowTag",
        "\"button\" | \"div\"",
        "\"button\"",
        "Native button by default; div is reserved for legacy adapters.",
        "زر HTML افتراضيًا؛ div لتوافق المشاريع القديمة."
      ],
      [
        "menuStyle",
        "CSSProperties",
        "undefined",
        "Styles/variables placed directly on the teleported list.",
        "أنماط ومتغيرات على القائمة المنقولة خارج الحاوية."
      ],
      [
        "badgeAttrs",
        "Record<string, unknown>",
        "undefined",
        "Wrapper attributes on every WBadge, including teleported rows. Avoid overriding its content props.",
        "خصائص حاوية كل WBadge، حتى صفوف القائمة؛ تجنب استبدال خصائص المحتوى."
      ]
    ],
    "slots": [
      "`icon`: `{ item, index, overflow, variant, style }`, replacing the complete image wrapper. `badgeIcon`: `{ item, icon, size }` for glyph-only rows. `label`: `{ item, text, overflow }`. Index is local to the visible/overflow slice.",
      "`icon`: يستقبل `{ item, index, overflow, variant, style }` ويستبدل حاوية الصورة كاملة. `badgeIcon`: للأيقونات غير المصورة. `label`: يستقبل `{ item, text, overflow }`. الفهرس داخل الجزء الظاهر أو المخفي."
    ],
    "variables": [
      [
        "--wakeb-badge-stack-overflow-background",
        "#fff"
      ],
      [
        "--wakeb-badge-stack-overflow-color",
        "#101828"
      ],
      [
        "--wakeb-badge-stack-menu-surface",
        "Vuetify surface"
      ],
      [
        "--wakeb-badge-stack-icon-background",
        "#087f8c"
      ],
      [
        "--wakeb-badge-stack-focus",
        "#087f8c"
      ],
      [
        "--wakeb-badge-stack-fallback",
        "not defined (legacy menu adapter switch)"
      ]
    ],
    "attrs": [
      "The root flex `div.badge-stack`. Each badge receives `badgeAttrs`; the teleported overflow menu receives neither. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "حاوية flex الجذرية `div.badge-stack`. كل شارة تستقبل `badgeAttrs`، وقائمة الزيادة المنقولة لا تستقبل أيًّا منهما. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Ordinary attrs target the flex wrapper. No business/theme/icon registry is imported. WBadge variables also apply. Set menu colors through menuStyle and badgeAttrs styles/classes because Vuetify teleports the list outside the stack; the menu carries only the plugin theme scope and zIndexOverlay, and menuStyle wins over it. Image URLs render as decorative img elements; no fetch proxy or detection tint is built in. Nullish per-item overrides preserve false/empty values. max keeps Array.slice and count arithmetic for compatibility; negative, fractional or nonfinite values are unsupported configurations. Visible labels use Wakeb Utils UTF-16 truncation; the menu shows full labels. Only the menu overflow uses customOverflowBorderRadius; the static +N uses customBorderRadius. The circle icon variant also applies to the teleported overflow list. The overflow activator is not announced as a menu because the list is informational. The inherited 58px overflow selector and the legacy circle sizing rules are retained; replace through CSS as needed. Native menu button supports focus, Enter/Space and Escape via Vuetify. The legacy div tag does not provide a native tab stop. PrimeVue: the overflow list opens in a Popover with the same opening rules (hover; click toggles the button; the legacy div opens on hover only). Escape and outside clicks close it; it takes the theme scope and zIndexOverlay, and menuStyle on the list wins. Badges are the PrimeVue WBadge: type and variant classes and the --wakeb-badge-* variables match, but the DOM is a PrimeVue Tag, not a VChip, and a non-Wakeb badge type falls back to primary with WAKEB_UNKNOWN_VALUE. Badge glyphs resolve through the Wakeb icon resolver.",
      "الخصائص العادية تستهدف حاوية flex. لا يوجد اعتماد على بيانات العمل أو theme أو registry للأيقونات. متغيرات WBadge متاحة أيضًا. خصص ألوان القائمة عبر menuStyle وbadgeAttrs لأن Vuetify ينقلها خارج الحاوية؛ لا تحمل القائمة إلا نطاق theme الخاص بالـplugin وzIndexOverlay، وتتقدم menuStyle عليه. الصور زخرفية ولا توجد خدمة لجلبها أو تلوين خاص بنوع الاكتشاف. تخصيص العنصر يحترم false والقيم الفارغة. max يحافظ على Array.slice والحساب القديم؛ الأعداد السالبة والكسرية وغير المحدودة إعدادات غير مدعومة. التقصير بوحدات UTF-16 من Wakeb Utils. القائمة تعرض الأسماء كاملة. customOverflowBorderRadius يخص زر القائمة فقط؛ +N الثابت يستخدم customBorderRadius. شكل الأيقونة الدائري يطبق أيضًا على القائمة المنقولة، وزر الزيادة لا يُعلن كقائمة أوامر لأن القائمة معلوماتية. قواعد أحجام الزيادة والدائرة القديمة محفوظة. الزر الافتراضي يدعم التركيز وEnter/Space وEscape من Vuetify؛ div القديم لا يضيف tab stop. في PrimeVue: تُفتح قائمة الزيادة داخل Popover بنفس قواعد الفتح (المرور دائمًا، والنقر يفتح ويغلق مع الزر، وdiv القديم يُفتح بالمرور فقط). يغلقها Escape والنقر خارجها، وتحمل نطاق theme وzIndexOverlay، وتتقدم menuStyle على القائمة. الشارات هي WBadge الخاص بـPrimeVue: أصناف type وvariant ومتغيرات --wakeb-badge-* متطابقة، لكن الـDOM عنصر Tag من PrimeVue وليس VChip، ونوع الشارة غير المعرّف في Wakeb يعود إلى primary مع WAKEB_UNKNOWN_VALUE. أيقونات الشارات تمر عبر محلل أيقونات Wakeb."
    ],
    "example": "<WBadgeStack :items=\"[{ id: 1, label: 'Administrator' }, { id: 2, label: 'Reviewer' }]\" show-overflow-menu overflow-label=\"More roles\" />",
    "playground": "IdentityPlayground",
    "events": [
      "No custom events. Native wrapper listeners bubble normally; menu state belongs to the provider overlay (Vuetify menu or PrimeVue Popover).",
      "لا توجد أحداث مخصصة. أحداث الحاوية تتصاعد طبيعيًا؛ حالة القائمة تديرها طبقة المزود (قائمة Vuetify أو Popover في PrimeVue)."
    ]
  },
  {
    "name": "WUserBadge",
    "slug": "user-badge",
    "interface": "UserBadgeProps",
    "summary": [
      "A compact user badge with avatar/initials and an actions slot.",
      "شارة مستخدم بصورة أو أحرف بديلة وslot للإجراءات."
    ],
    "props": [
      [
        "user",
        "BadgeUser",
        "{}",
        "Presentational name/avatar record; data is escaped text.",
        "بيانات العرض للاسم والصورة؛ الاسم نص آمن."
      ],
      [
        "type",
        "WakebBadgeType",
        "\"outline\"",
        "WBadge style key.",
        "مفتاح نمط WBadge."
      ],
      [
        "borderRadius",
        "string",
        "\"md\"",
        "Badge radius preset.",
        "نصف قطر الشارة."
      ],
      [
        "icon",
        "SharedIcon",
        "\"\"",
        "Legacy WBadge icon prop; avatar slot replaces the glyph.",
        "خاصية الأيقونة القديمة؛ الصورة تستبدل glyph."
      ],
      [
        "iconSize",
        "string | number",
        "\"xs\"",
        "Legacy WBadge glyph size; avatarSize controls the actual avatar.",
        "حجم glyph القديم؛ avatarSize يتحكم في الصورة."
      ],
      [
        "iconPosition",
        "\"before\" | \"after\"",
        "\"before\"",
        "Avatar position relative to content.",
        "موضع الصورة بالنسبة للمحتوى."
      ],
      [
        "avatarSize",
        "string | number",
        "16",
        "Avatar size: a number of pixels or a CSS length. Vuetify size names work only under Vuetify.",
        "حجم الصورة: رقم بالبكسل أو طول CSS. أسماء أحجام Vuetify تعمل تحت Vuetify فقط."
      ],
      [
        "avatarColor",
        "WakebColor",
        "\"primary\"",
        "Initials avatar background. Wakeb intent (primary, secondary, success, warning, danger, info, neutral) or CSS color.",
        "خلفية حاوية الأحرف. intent من Wakeb (primary وsecondary وsuccess وwarning وdanger وinfo وneutral) أو لون CSS."
      ]
    ],
    "slots": [
      "`avatar`: `{ user, avatar, initials, size }`. `default`: `{ user }`, replacing the name only. `actions`: `{ user }`, rendered after the name.",
      "`avatar`: يستقبل `{ user, avatar, initials, size }`. `default`: يستقبل `{ user }` لاستبدال الاسم فقط. `actions`: بعد الاسم."
    ],
    "variables": [
      [
        "--wakeb-user-badge-initials-size",
        "8px"
      ],
      [
        "--wakeb-avatar-text",
        "--wakeb-ui-on-primary / #fff"
      ]
    ],
    "attrs": [
      "The root `div.wakeb-user-badge`, which is the WBadge wrapper. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الجذري `div.wakeb-user-badge`، وهو حاوية WBadge. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Ordinary attrs/listeners target the WBadge wrapper. WBadge variables control the chip. HTTP-prefixed, root-relative and data URLs use VImg; other values use initials. There is no network-error initials fallback, matching the original component. Missing/empty name or an em dash uses ?, whitespace-only uses an empty initial; initials preserve charAt(0) UTF-16 behavior and use the first two words. Supply a user object with string fields; null is not supported. Avatars are decorative because the adjacent name identifies the user. Actions bubble naturally; stop propagation in the action if its parent has a click handler. No Tailwind dependency is required for the 8px initials. Under PrimeVue: the badge is the PrimeVue WBadge renderer and the avatar is a PrimeVue Avatar (.wakeb-avatar) with a decorative img (alt=\"\") or the initials; Wakeb CSS gives it the round VAvatar box, so it looks the same in PrimeVue styled or unstyled mode. avatarColor resolves Wakeb intents through --wakeb-ui-* and then the PrimeVue primary color for primary; provider color names fall back to primary with WAKEB_UNKNOWN_VALUE.",
      "الخصائص والأحداث تستهدف حاوية WBadge ومتغيراته تخصص الشارة. الصور التي تبدأ بـhttp أو / أو data تعرض عبر VImg؛ الباقي يستخدم الأحرف. لا يوجد بديل تلقائي عند فشل تحميل الصورة، مثل الأصل. الاسم الفارغ أو — يعطي ?؛ المسافات فقط تعطي حرفًا فارغًا. الأحرف تحافظ على charAt(0) بوحدات UTF-16 لأول كلمتين. مرر كائنًا بحقول نصية؛ null غير مدعوم. الصورة زخرفية لأن الاسم بجوارها. الإجراءات تتصاعد طبيعيًا؛ أوقف التصاعد عند الحاجة. حجم الأحرف 8px يعمل دون Tailwind. تحت PrimeVue: الشارة هي renderer ‏WBadge الخاص بـPrimeVue، والصورة مكوّن Avatar من PrimeVue ‏(.wakeb-avatar) يحوي img زخرفيًا (alt=\"\") أو الأحرف؛ وتمنحه Wakeb CSS شكل VAvatar الدائري، فيبدو بالشكل نفسه في وضعي PrimeVue بأنماط أو دونها. يحل avatarColor قيم intent من Wakeb عبر --wakeb-ui-* ثم عبر اللون الأساسي في PrimeVue لقيمة primary؛ وترجع أسماء ألوان المزود إلى primary مع WAKEB_UNKNOWN_VALUE."
    ],
    "example": "<WUserBadge :user=\"{ name: 'Ada Lovelace', avatar: '/avatars/ada.png' }\"><template #actions><button type=\"button\">Remove</button></template></WUserBadge>",
    "playground": "IdentityPlayground",
    "events": [
      "No custom events. Native listeners target the outer badge wrapper.",
      "لا توجد أحداث مخصصة؛ الأحداث العادية تستهدف حاوية الشارة."
    ]
  },
  {
    "name": "WTooltipBtn",
    "slug": "tooltip-btn",
    "interface": "TooltipBtnProps",
    "summary": [
      "An icon button with host-translated tooltip text and native button attributes.",
      "زر أيقونة بنص Tooltip مترجم من المشروع وخصائص زر HTML."
    ],
    "props": [
      [
        "icon",
        "SharedIcon",
        "undefined",
        "Icon name, SVG path data or component (Providers > Icons); the icon slot can replace it.",
        "اسم أيقونة أو بيانات مسار SVG أو مكوّن (المزودات > الأيقونات)؛ ويمكن استبدالها بـslot."
      ],
      [
        "text",
        "string",
        "\"\"",
        "Already translated tooltip text; empty disables the tooltip.",
        "نص Tooltip مترجم مسبقًا؛ القيمة الفارغة تلغيه."
      ],
      [
        "ariaLabel",
        "string | null",
        "undefined",
        "Explicit accessible button name; fallback text.",
        "اسم مقروء صريح للزر؛ البديل text."
      ],
      [
        "btnIcon",
        "boolean",
        "false",
        "Enable the round icon-button layout (VBtn icon on Vuetify, a 48px circle on PrimeVue).",
        "تفعيل شكل زر الأيقونة الدائري (icon في VBtn على Vuetify، ودائرة بقطر 48px على PrimeVue)."
      ],
      [
        "variant",
        "WakebVariant | WakebDeprecatedVariant",
        "\"ghost\"",
        "Portable style: soft, solid, outline or ghost. Baseline names (text, flat, elevated, tonal, outlined, plain) still work and warn in development.",
        "النمط القابل للنقل: soft أو solid أو outline أو ghost. الأسماء القديمة (text وflat وelevated وtonal وoutlined وplain) ما زالت تعمل مع تحذير في وضع التطوير."
      ],
      [
        "location",
        "\"top\" | \"bottom\" | \"start\" | \"end\"",
        "\"bottom\"",
        "Tooltip placement.",
        "موضع Tooltip."
      ],
      [
        "openDelay",
        "string | number",
        "200",
        "Tooltip opening delay in milliseconds.",
        "تأخير فتح Tooltip بالمللي ثانية."
      ],
      [
        "contentClass",
        "string",
        "\"v-app-tooltip-btn__content\"",
        "Class on the tooltip overlay.",
        "class على Tooltip overlay."
      ],
      [
        "tooltipStyle",
        "CSSProperties",
        "undefined",
        "Styles directly on the teleported tooltip content.",
        "أنماط على محتوى Tooltip المنقول."
      ],
      [
        "wrapperAttrs",
        "Record<string, unknown>",
        "undefined",
        "Explicit attributes for the layout span; ordinary attrs target the native button.",
        "خصائص span الخارجي؛ الخصائص العادية تستهدف زر HTML الأصلي."
      ]
    ],
    "slots": [
      "`icon`: `{ icon }`, replacing the default icon. There is no default content slot; use WButton for text actions.",
      "`icon`: يستقبل `{ icon }` ويستبدل الأيقونة الافتراضية. لا يوجد slot افتراضي للنص؛ استخدم WButton للأزرار النصية."
    ],
    "variables": [],
    "attrs": [
      "The native `<button>` (VBtn on Vuetify, an unstyled PrimeVue Button on PrimeVue), not the outer span; use `wrapperAttrs` for the span. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "عنصر `<button>` الأصلي (VBtn في Vuetify، وButton من PrimeVue دون أنماطه في PrimeVue)، وليس الـspan الخارجي؛ استخدم `wrapperAttrs` لذلك الـspan. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "VBtn receives ordinary attrs and native listeners once; use wrapperAttrs for the outer span. Defaults keep the original look: the ghost variant (Vuetify text), bottom placement and 200ms opening delay. Pass text=t(key) from the host; the package has no i18n dependency or path prop. VTooltip uses activator=parent, preserving Vuetify focus, hover, Escape and aria-describedby. Provide ariaLabel or meaningful text for icon-only controls. Disabled native buttons retain their disabled behavior and do not offer a keyboard tooltip target; use a deliberate separate help element if needed. Icon names resolve through the icons plugin option and the Wakeb built-ins first; other names need your Vuetify icon configuration. The icon slot can supply an inline SVG. Tooltip styles belong in tooltipStyle, not inherited variables, because of teleport; the tooltip carries only the plugin theme scope and zIndexOverlay, and tooltipStyle wins over it. VBtn styling uses your existing Vuetify theme; there are no additional package-specific CSS variables. Under PrimeVue: the button is an unstyled PrimeVue Button with type=button by default; caller attrs such as type, form, disabled and aria-label win, and native listeners fire once. Wakeb CSS paints the four variants with currentColor (solid uses --wakeb-ui-primary and --wakeb-ui-on-primary) in the VBtn box: 36px high with a 64px minimum width, or a 48px circle with btnIcon; there are no PrimeVue severities or sizes. The PrimeVue tooltip directive opens on hover and keyboard focus after openDelay, closes on blur, click and Escape, and is linked through aria-describedby with a useId id. start and end follow the plugin direction option. tooltipStyle styles the tooltip text bubble and contentClass the tooltip root, which carries the plugin theme scope; PrimeVue keeps its own tooltip z-index, so zIndexOverlay does not apply. Without an icon nothing renders inside the button; Vuetify renders an empty VIcon.",
      "الخصائص والأحداث العادية تصل إلى VBtn مرة واحدة؛ wrapperAttrs للحاوية الخارجية. الافتراضات تحافظ على المظهر الأصلي: النمط ghost ‏(text في Vuetify) وأسفل وتأخير 200ms. مرر text=t(key) من المشروع؛ الحزمة لا تعتمد على i18n ولا تستقبل path. VTooltip يستخدم activator=parent مع التركيز وhover وEscape وaria-describedby. وفر ariaLabel أو نصًا واضحًا للأزرار المصورة. الزر المعطل يحتفظ بسلوكه ولا يصبح هدفًا للـTooltip عبر الكيبورد؛ استخدم عنصر مساعدة منفصلًا عند الحاجة. تُحل أسماء الأيقونات أولًا عبر الخيار icons والأيقونات المدمجة، وبقية الأسماء تحتاج إعداد أيقونات Vuetify؛ slot يدعم SVG مباشرة. خصص Tooltip عبر tooltipStyle بسبب teleport؛ لا يحمل التلميح إلا نطاق theme الخاص بالـplugin وzIndexOverlay، وتتقدم tooltipStyle عليه. التنسيق من Vuetify theme دون متغيرات CSS إضافية خاصة بالحزمة. تحت PrimeVue: الزر هو Button من PrimeVue دون أنماطه، ونوعه type=button افتراضيًا؛ وتتقدم سمات المستخدم مثل type وform وdisabled وaria-label، وتعمل الأحداث الأصلية مرة واحدة. ترسم Wakeb CSS الأنماط الأربعة بلون currentColor (ويستخدم solid المتغيرين --wakeb-ui-primary و--wakeb-ui-on-primary) بأبعاد VBtn: ارتفاع 36px وعرض أدنى 64px، أو دائرة بقطر 48px مع btnIcon؛ ولا تُستخدم severities أو أحجام PrimeVue. يفتح توجيه Tooltip في PrimeVue عند مرور المؤشر وعند التركيز بالكيبورد بعد openDelay، ويُغلق عند فقدان التركيز والنقر وEscape، ويرتبط بالزر عبر aria-describedby بمعرّف من useId. تتبع start وend خيار direction في الـplugin. تنسّق tooltipStyle فقاعة نص التلميح، وتنسّق contentClass جذر التلميح الذي يحمل نطاق theme الخاص بالـplugin؛ ويحتفظ PrimeVue بترتيب z-index الخاص بتلميحاته، فلا ينطبق zIndexOverlay. دون أيقونة لا يُرسم شيء داخل الزر، بينما يرسم Vuetify مكوّن VIcon فارغًا."
    ],
    "example": "<WTooltipBtn text=\"Save changes\" icon=\"$complete\" btn-icon aria-label=\"Save changes\" @click=\"() => {}\" />",
    "playground": "IdentityPlayground",
    "events": [
      "No custom events. Native click/keyboard/form attrs are forwarded to the native button without an extra wrapper listener.",
      "لا توجد أحداث مخصصة. أحداث النقر والكيبورد وخصائص الفورم تصل إلى زر HTML الأصلي دون مستمع إضافي على الحاوية."
    ]
  },
  {
    "name": "WTabs",
    "slug": "tabs",
    "interface": "TabsProps",
    "summary": [
      "Styled tab rails and lazily mounted panels with explicit selection events.",
      "شريط تبويبات ولوحات تُركَّب عند الحاجة مع أحداث اختيار واضحة."
    ],
    "props": [
      [
        "styleType",
        "\"outlined\" | \"filled\" | \"none\" | \"minimal\"",
        "\"outlined\"",
        "Visual rail preset.",
        "شكل شريط التبويبات."
      ],
      [
        "isVertical",
        "boolean",
        "false",
        "Vertical rail layout.",
        "شريط تبويبات رأسي."
      ],
      [
        "tabs",
        "readonly TabItem[]",
        "[] (required)",
        "Tab records with labels, slot keys and optional content.",
        "بيانات التبويبات: الاسم ومفتاح slot والمحتوى الاختياري."
      ],
      [
        "selectedTab",
        "NavigationKey | null",
        "\"\"",
        "External selected value; empty switcher means no highlight.",
        "قيمة الاختيار الخارجية؛ القيمة الفارغة في switcher تلغي التحديد."
      ],
      [
        "isSwitcherOnly",
        "boolean",
        "false",
        "Render only the rail, without panels.",
        "عرض الشريط فقط دون المحتوى."
      ],
      [
        "valueKey",
        "string",
        "\"slot\"",
        "Record property used for values and named content slots.",
        "الحقل المستخدم لقيمة التبويب واسم slot للمحتوى."
      ],
      [
        "iconOnly",
        "boolean",
        "false",
        "Hide default labels while retaining icon and notification; the label becomes its aria-label.",
        "إخفاء الاسم الظاهر مع بقاء الأيقونة والعداد؛ الاسم يصبح aria-label."
      ],
      [
        "tabHeight",
        "string | number | null",
        "null",
        "Numeric pixel height; numeric strings are accepted.",
        "الارتفاع بالبكسل؛ يقبل رقمًا أو نصًا رقميًا."
      ],
      [
        "iconSize",
        "string | number",
        "\"sm\"",
        "Icon size token or pixels.",
        "حجم الأيقونة كاسم أو بكسل."
      ],
      [
        "classList",
        "ComponentClass",
        "\"\"",
        "Extra classes on the outer layout.",
        "classes إضافية على الحاوية."
      ],
      [
        "contentGap",
        "string | number | null",
        "null",
        "Numeric pixel gap; default 32px.",
        "المسافة بالبكسل؛ الافتراضي 32px."
      ],
      [
        "ariaLabel",
        "string",
        "\"Tabs\"",
        "Accessible tablist name.",
        "اسم شريط التبويبات لقارئ الشاشة."
      ]
    ],
    "slots": [
      "`header`, `actions`; `tab-label`: `{ tabItem, index }` replaces the default label/HTML; `tab-icon`: `{ tabItem, index, size }`; content slots use each record valueKey. Header/actions/tab-label/tab-icon are reserved names.",
      "`header` و`actions`؛ `tab-label`: يستقبل `{ tabItem, index }` ويستبدل الاسم وHTML؛ `tab-icon`: يستقبل `{ tabItem, index, size }`. أسماء محتوى التبويبات من valueKey؛ الأسماء السابقة محجوزة."
    ],
    "variables": [
      [
        "--wakeb-tabs-item-height",
        "44px"
      ],
      [
        "--wakeb-tabs-filled-tab-radius",
        "10px"
      ],
      [
        "--wakeb-tabs-filled-item-active-bg",
        "#e6f2f3"
      ],
      [
        "--wakeb-tabs-filled-item-active-color",
        "#087f8c"
      ],
      [
        "--wakeb-tabs-item-active-color",
        "#087f8c"
      ],
      [
        "--wakeb-tabs-item-active-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-tabs-item-color",
        "#344054"
      ],
      [
        "--wakeb-tabs-input-bg",
        "#fff"
      ],
      [
        "--wakeb-tabs-input-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-tabs-input-label",
        "#344054"
      ],
      [
        "--wakeb-tabs-minimal-tab-gap",
        "4px"
      ],
      [
        "--wakeb-tabs-minimal-tab-padding",
        "4px"
      ],
      [
        "--wakeb-tabs-minimal-tab-bg",
        "#f2f4f7"
      ],
      [
        "--wakeb-tabs-minimal-tab-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-tabs-minimal-tab-radius",
        "12px"
      ],
      [
        "--wakeb-tabs-minimal-item-radius",
        "8px"
      ],
      [
        "--wakeb-tabs-minimal-item-color",
        "#667085"
      ],
      [
        "--wakeb-tabs-minimal-item-active-color",
        "#101828"
      ],
      [
        "--wakeb-tabs-minimal-item-active-radius",
        "8px"
      ],
      [
        "--wakeb-tabs-section-color",
        "#667085"
      ],
      [
        "--wakeb-tabs-section-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-tabs-content-gap",
        "32px"
      ],
      [
        "--wakeb-tabs-fallback",
        "undefined (legacy adapter switch)"
      ]
    ],
    "events": [
      "`updateTab(value: NavigationKey | undefined)` for accepted local changes only; no mount or parent-sync echo.",
      "`updateTab(value: NavigationKey | undefined)` للتغيير المحلي فقط؛ لا يُرسل عند التركيب أو مزامنة الأب."
    ],
    "attrs": [
      "The root layout `div.wakeb-tabs`. Tabs and panels keep Wakeb's ids, roles and aria-controls/labelledby links. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "حاوية التخطيط الجذرية `div.wakeb-tabs`. تحتفظ التبويبات واللوحات بالمعرفات والأدوار وروابط aria-controls وaria-labelledby التي يضعها Wakeb. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Ordinary attrs target the layout root. Vue/Vuetify are peers; no Tailwind is needed. Numeric height/gap props append px; do not pass CSS units. Section labels and headers remain inside the rail. VTabs provides tablist roles, focus and arrow navigation. Each tab has an id unique within the app; the selected tab references its rendered role=tabpanel wrapper (div.wakeb-tabs__panel) through aria-controls, and the panel is labelled by its tab; panels are lazily mounted by VTabsWindow, retaining mounted Vue state. Empty selectedTab in switcher mode deliberately clears highlight. selectedTab/isSwitcherOnly are synchronized; the items array itself does not reset selection in application code, leaving group changes to Vuetify. Zero notification/content uses the original truthy check. customHTML is inserted verbatim with v-html and must be trusted or sanitized by the host; function context is {value,isSelected}. Prefer tab-label for untrusted data. Icons use VIcon or tab-icon slots and currentColor; no shadow DOM icon patch runs in the package. Icon-only tabs use the record label as aria-label. Supply a meaningful label, including when replacing label content. A vertical rail sets aria-orientation=vertical on the tablist. PrimeVue: Wakeb renders the tablist itself (a div with role=tablist and button role=tab items) because PrimeVue Tabs generates its own ids and mounts all panels or unmounts hidden ones. Selection, ids and events come from the same shared code as Vuetify. Keys follow the Vuetify slide group: manual activation with click, Enter or Space; arrows move focus along the orientation, wrap, and reverse horizontally when the tablist is RTL; Home/End jump to the ends; the selected tab, or the first tab when none is selected, is the single tab stop. Panels mount on first selection and stay mounted, switching without a transition. Icons render through the Wakeb icon resolver. The tab look comes from the same --wakeb-tabs-* variables on Wakeb markup, not from PrimeVue styles. shadcn-vue: the same Wakeb markup, CSS, keys and lazy panels as PrimeVue, because the shadcn-vue Tabs (reka-ui) selects on arrow focus by default. The tabs carry no data-slot or wakeb-sc-* classes; providerProps is dropped with WAKEB_PROVIDER_PROP_IGNORED.",
      "الخصائص على الحاوية. Vue وVuetify هما peers ولا تحتاج Tailwind. الارتفاع والمسافة يضيفان px؛ لا تمرر وحدات CSS. عناوين الأقسام والـheader داخل الشريط. Vuetify يوفر tablist والتركيز والأسهم. لكل تبويب id فريد داخل التطبيق، والتبويب المحدد يشير عبر aria-controls إلى لوحته المعروضة (div.wakeb-tabs__panel بدور tabpanel) واللوحة تأخذ اسمها من التبويب؛ اللوحات تُركب عند الحاجة وتحتفظ بحالة Vue بعد التركيب. selectedTab الفارغ في switcher يلغي التحديد. المزامنة تخص selectedTab وisSwitcherOnly؛ تغيير قائمة العناصر يترك سلوك المجموعة لـVuetify. الصفر في content أو notification يتبع فحص truthy القديم. customHTML يدخل كما هو عبر v-html ويجب أن يكون موثوقًا أو منقّى من المشروع؛ سياق الدالة {value,isSelected}. استخدم tab-label للبيانات غير الموثوقة. الأيقونات عبر VIcon أو slot دون تعديل shadow DOM داخل الحزمة. التبويب المصور فقط يستخدم label كاسم ARIA؛ وفر اسمًا واضحًا حتى مع المحتوى المخصص. الشريط العمودي يضع aria-orientation=vertical على قائمة التبويبات. على PrimeVue يرسم Wakeb قائمة التبويبات بنفسه (div بدور tablist وعناصر button بدور tab) لأن Tabs في PrimeVue يولّد معرفاته الخاصة ويركّب كل اللوحات أو يزيل المخفية منها. التحديد والمعرفات والأحداث من الكود المشترك نفسه مع Vuetify. المفاتيح تتبع سلوك Vuetify: التفعيل يدوي بالنقر أو Enter أو Space، والأسهم تنقل التركيز حسب الاتجاه وتلتف وتنعكس أفقيًا عندما تكون القائمة RTL، وHome/End للطرفين، والتبويب المحدد (أو الأول إن لم يُحدد شيء) هو محطة Tab الوحيدة. اللوحات تُركَّب عند أول اختيار وتبقى مركّبة وتتبدل دون حركة انتقال. الأيقونات عبر محلل أيقونات Wakeb. شكل التبويبات من متغيرات --wakeb-tabs-* نفسها على markup يملكه Wakeb، وليس من أنماط PrimeVue. على shadcn-vue يُستخدم markup ‏Wakeb وأنماطه ومفاتيحه ولوحاته المؤجلة نفسها كما في PrimeVue، لأن Tabs في shadcn-vue ‏(reka-ui) يحدد التبويب عند نقل التركيز بالأسهم افتراضيًا. لا تحمل التبويبات data-slot ولا أصناف wakeb-sc-*، وتُهمَل providerProps مع WAKEB_PROVIDER_PROP_IGNORED."
    ],
    "example": "<WTabs :tabs=\"[{ slot: 'overview', label: 'Overview' }, { slot: 'details', label: 'Details' }]\"><template #overview>Overview panel</template><template #details>Details panel</template></WTabs>",
    "playground": "NavigationPlayground"
  },
  {
    "name": "WTree",
    "slug": "tree",
    "interface": "TreeProps",
    "summary": [
      "A controlled recursive tree with connector lines, composable rows and keyboard navigation.",
      "شجرة متداخلة يتحكم فيها المشروع مع خطوط الربط وslots وتنقل بالكيبورد."
    ],
    "props": [
      [
        "nodes",
        "readonly TreeNode[]",
        "[]",
        "Acyclic presentational records with unique primitive keys.",
        "بيانات عرض دون مراجع دائرية ومفاتيح نصية أو رقمية فريدة."
      ],
      [
        "itemKey",
        "string",
        "\"id\"",
        "Key field.",
        "حقل المفتاح."
      ],
      [
        "itemLabel",
        "string",
        "\"name\"",
        "Visible/accessibility name field.",
        "حقل الاسم الظاهر والمقروء."
      ],
      [
        "itemDescription",
        "string",
        "\"description\"",
        "Optional description field.",
        "حقل الوصف الاختياري."
      ],
      [
        "childrenKey",
        "string",
        "\"children\"",
        "Child array field.",
        "حقل قائمة الأبناء."
      ],
      [
        "level",
        "number",
        "0",
        "Starting depth, mainly for recursive composition.",
        "عمق البداية؛ يستخدم في التركيب المتداخل."
      ],
      [
        "isRoot",
        "boolean",
        "true",
        "Root tree vs nested group; internal recursion sets false.",
        "شجرة رئيسية أو مجموعة داخلية؛ التداخل الداخلي يمرر false."
      ],
      [
        "expandedKeys",
        "readonly NavigationKey[]",
        "[]",
        "Controlled expanded branches; update in the host on toggle.",
        "الفروع المفتوحة؛ حدّثها في المشروع عند toggle."
      ],
      [
        "activeKey",
        "NavigationKey | null",
        "null",
        "Controlled selected node key.",
        "مفتاح العنصر المختار من المشروع."
      ],
      [
        "activePath",
        "readonly NavigationKey[]",
        "[]",
        "Explicit path for nested/nonroot groups; root resolves from activeKey.",
        "مسار المجموعات الداخلية؛ الجذر يستنتجه من activeKey."
      ],
      [
        "rtl",
        "boolean",
        "false",
        "RTL connectors and reversed expand/collapse arrow keys.",
        "اتجاه RTL مع عكس أسهم الفتح والإغلاق."
      ],
      [
        "editingNodeId",
        "NavigationKey | null",
        "null",
        "Inline-edit class hook; numeric/string IDs compare compatibly.",
        "class لحالة التعديل؛ المقارنة تدعم الرقم وتمثيله النصي."
      ],
      [
        "keyboardNavigation",
        "boolean",
        "true",
        "ARIA tree and roving keyboard navigation; false preserves legacy list behavior.",
        "شجرة ARIA وتنقل بالكيبورد؛ false يحتفظ بسلوك القائمة القديم."
      ],
      [
        "ariaLabel",
        "string",
        "\"Tree\"",
        "Accessible root name.",
        "اسم الشجرة المقروء."
      ],
      [
        "toggleLabel",
        "string",
        "\"Toggle branch\"",
        "Accessible name for the default branch toggle.",
        "اسم زر فتح الفرع الافتراضي."
      ]
    ],
    "slots": [
      "`node`: `{node,level,expanded}`; `actions`: `{node,level}`; `toggle-leading` and `toggle-trailing`: `{node,level,expanded,hasChildren,toggle}`. Slots propagate to every level. Actions stop click bubbling; custom leading toggles must stop their own click.",
      "`node`: يستقبل `{node,level,expanded}`؛ `actions`: يستقبل `{node,level}`؛ `toggle-leading` و`toggle-trailing`: يستقبلان `{node,level,expanded,hasChildren,toggle}`. جميعها تنتقل لكل المستويات. actions توقف تصاعد النقر؛ أوقف تصاعد زر leading المخصص عند الحاجة."
    ],
    "variables": [
      [
        "--wakeb-tree-input-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-tree-primary",
        "#087f8c"
      ],
      [
        "--wakeb-tree-hover-bg",
        "#f2f4f7"
      ],
      [
        "--wakeb-tree-active-text",
        "#fff"
      ],
      [
        "--wakeb-tree-paragraph-primary",
        "#101828"
      ],
      [
        "--wakeb-tree-paragraph-tertiary",
        "#667085"
      ],
      [
        "--wakeb-tree-toggle-color",
        "#667085"
      ],
      [
        "--wakeb-tree-focus",
        "#087f8c"
      ],
      [
        "--wakeb-tree-fallback",
        "undefined (legacy adapter switch)"
      ]
    ],
    "events": [
      "`node-click(node: TreeNode)` requests selection; `toggle(node: TreeNode)` requests expansion. Update activeKey/expandedKeys in the host; the tree never mutates records.",
      "`node-click(node: TreeNode)` لطلب الاختيار، و`toggle(node: TreeNode)` لطلب الفتح. حدّث activeKey وexpandedKeys في المشروع؛ الشجرة لا تعدل البيانات."
    ],
    "attrs": [
      "The root `ul` with `role=\"tree\"`. Nested groups do not receive them. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "عنصر `ul` الجذري الذي يحمل `role=\"tree\"`. المجموعات الفرعية لا تستقبلها. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Root attrs target ul. Data must be acyclic with globally unique string/number keys; only loaded children are considered. Field keys are direct properties, not dotted paths. activeKey uses strict identity; editingNodeId also supports string equivalence. Root computes active ancestors; nonroot groups use activePath. Collapsing unmounts descendant DOM through v-if and transition, so keep editable drafts in host state. Arrow Up/Down traverse visible nodes; Home/End move to bounds; expand/collapse arrows reverse in RTL; Enter/Space request selection. Expansion remains controlled. Nested controls keep their own keys. There is one roving tab target per tree; when a row disappears the target moves to its nearest visible ancestor, otherwise the previous visible row, and DOM focus follows only when focus was inside the tree. No typeahead, virtualization, drag/drop, checkbox selection or remote loading is built in. Default labels propagate to every level. Empty named slots use Vue fallback content, including branch toggles. Motion respects reduced-motion preferences. PrimeVue: the same Wakeb markup, CSS and shared tree code render on both providers, because PrimeVue Tree uses key maps for expansion and selection; the default branch toggle is the PrimeVue WButton. shadcn-vue: the same Wakeb markup and shared tree code, because shadcn-vue has no Tree and reka-ui Tree uses a flattened item model with its own selection; the default branch toggle is the shadcn-vue WButton (data-slot=button).",
      "الخصائص تستهدف ul. البيانات دون دورات وبمفاتيح نصية أو رقمية فريدة في الشجرة، والأبناء المحمّلون فقط هم المعروضون. مفاتيح الحقول مباشرة دون dotted paths. activeKey يقارن بدقة وeditingNodeId يدعم تمثيل المفتاح النصي. الجذر يستنتج مسار العنصر؛ المجموعة الداخلية تستخدم activePath. الإغلاق يزيل DOM الأبناء عبر v-if؛ احفظ مسودات التعديل في حالة المشروع. أعلى/أسفل للتنقل وHome/End للحدود وأسهم الفروع تنعكس في RTL وEnter/Space لطلب الاختيار. الفتح يظل بتحكم الأب. عناصر التحكم الداخلية تحتفظ بمفاتيحها. يوجد هدف Tab واحد لكل شجرة وعند اختفاء العنصر ينتقل لأقرب أب ظاهر أو للعنصر الظاهر السابق، والتركيز الفعلي ينتقل فقط لو كان داخل الشجرة. لا يوجد typeahead أو virtualization أو سحب أو checkboxes أو تحميل بعيد. الأسماء الافتراضية تظهر بكل المستويات؛ slots الفارغة تستخدم بديل Vue، بما فيها أزرار الفروع. الحركة تحترم reduced-motion. على PrimeVue يُستخدم markup ‏Wakeb وأنماطه وكود الشجرة المشترك نفسه على المزودين، لأن Tree في PrimeVue يعتمد خرائط مفاتيح للفتح والاختيار؛ وزر فتح الفرع الافتراضي هو WButton الخاص بـPrimeVue. على shadcn-vue يُستخدم markup ‏Wakeb وكود الشجرة المشترك نفسه، لأن shadcn-vue لا يحتوي على Tree، وTree في reka-ui يعتمد قائمة عناصر مسطّحة واختيارًا خاصًا به؛ وزر فتح الفرع الافتراضي هو WButton الخاص بـshadcn-vue ‏(data-slot=button)."
    ],
    "example": "<WTree :nodes=\"[{ id: 1, name: 'Team', children: [{ id: 2, name: 'Member' }] }]\" :expanded-keys=\"[1]\" aria-label=\"Teams\" />",
    "playground": "NavigationPlayground"
  },
  {
    "name": "WDropdown",
    "slug": "dropdown",
    "interface": "DropdownProps",
    "summary": [
      "A selection/action menu with native button integration and host-owned labels, colors and links.",
      "قائمة اختيار وإجراءات بزر فعلي وترجمة وألوان وروابط من المشروع."
    ],
    "props": [
      [
        "menuItems",
        "readonly DropdownItem[]",
        "[]",
        "Option records; original objects are emitted.",
        "عناصر القائمة؛ الحدث يرجع نفس الكائن."
      ],
      [
        "title",
        "string",
        "undefined",
        "Activator title before formatting.",
        "عنوان الزر قبل التنسيق."
      ],
      [
        "icon",
        "SharedIcon",
        "\"\"",
        "Explicit leading activator icon.",
        "أيقونة صريحة في زر القائمة."
      ],
      [
        "iconColor",
        "string",
        "\"\"",
        "Activator semantic color override.",
        "لون دلالي صريح للزر."
      ],
      [
        "showSelected",
        "boolean",
        "false",
        "Show selection label; takes precedence over showBoth.",
        "عرض اسم الاختيار؛ له أولوية على showBoth."
      ],
      [
        "showBoth",
        "boolean",
        "false",
        "Format title: selected label as one string.",
        "تنسيق العنوان والاختيار كنص واحد."
      ],
      [
        "iconPosition",
        "\"start\" | \"end\"",
        "undefined",
        "Activator icon placement; fallback start.",
        "موضع أيقونة الزر؛ البديل start."
      ],
      [
        "type",
        "string",
        "undefined",
        "WButton visual type; fallback primary.",
        "نوع WButton؛ البديل primary."
      ],
      [
        "classList",
        "ComponentClass",
        "\"\"",
        "Classes on the activator button.",
        "classes على زر القائمة."
      ],
      [
        "size",
        "string",
        "\"lg\"",
        "Activator size.",
        "حجم زر القائمة."
      ],
      [
        "isLinks",
        "boolean",
        "false",
        "Native anchors for href/string to; router links belong in item-label.",
        "روابط عادية لـhref أو to النصي؛ router-link داخل item-label."
      ],
      [
        "isLoading",
        "boolean",
        "false",
        "Disable activator/menu and show button loading.",
        "تعطيل القائمة والزر مع إظهار التحميل."
      ],
      [
        "disabled",
        "boolean",
        "false",
        "Disable menu and activator.",
        "تعطيل القائمة والزر."
      ],
      [
        "showChevron",
        "boolean",
        "true",
        "Append a chevron when a leading icon exists.",
        "إضافة سهم عند وجود أيقونة رئيسية."
      ],
      [
        "modelValue",
        "NavigationKey | null",
        "undefined",
        "External selection; zero is valid, null retains prior selection.",
        "الاختيار الخارجي؛ صفر صالح وnull يحتفظ بالاختيار السابق."
      ],
      [
        "expandIcon",
        "SharedIcon",
        "\"$expand\"",
        "Collapsed fallback icon.",
        "أيقونة القائمة المغلقة."
      ],
      [
        "collapseIcon",
        "SharedIcon",
        "\"$collapse\"",
        "Open fallback icon.",
        "أيقونة القائمة المفتوحة."
      ],
      [
        "labelFormatter",
        "(label: string | undefined) => string",
        "label => label ?? \"\"",
        "Host formatter/translator for activator and items.",
        "دالة التنسيق أو الترجمة من المشروع للزر والعناصر."
      ],
      [
        "colorMap",
        "Record<string, string>",
        "undefined",
        "Override semantic success/danger/warning/primary/info colors.",
        "استبدال الألوان الدلالية success وdanger وwarning وprimary وinfo."
      ],
      [
        "menuStyle",
        "CSSProperties",
        "undefined",
        "Styles/variables directly on the teleported list.",
        "أنماط ومتغيرات على القائمة المنقولة خارج الحاوية."
      ],
      [
        "providerProps",
        "WakebProviderProps",
        "undefined",
        "Nonportable. Native props and listeners for the menu primitive (Vuetify `VMenu`, PrimeVue `Menu`). Open state, `disabled`, stacking and the activator stay Wakeb-owned; on PrimeVue also `model`, `popup` and `pt`. Ignored keys produce a development warning.",
        "غير قابل للنقل. خصائص وأحداث أصلية لـprimitive القائمة (`VMenu` في Vuetify و`Menu` في PrimeVue). حالة الفتح و`disabled` وترتيب الطبقات وزر الفتح يملكها Wakeb، وفي PrimeVue أيضًا `model` و`popup` و`pt`. المفاتيح المتجاهلة تُنتج تحذيرًا في وضع التطوير."
      ]
    ],
    "slots": [
      "`activator`: `{props,isActive,buttonProps}`; bind both props and buttonProps to your button. `item-icon`: `{item,color}`; `item-label`: `{item,text}` for router-link or custom labels.",
      "`activator`: يستقبل `{props,isActive,buttonProps}`؛ اربط props وbuttonProps بزرّك. `item-icon`: يستقبل `{item,color}`؛ `item-label`: يستقبل `{item,text}` للروابط أو الأسماء المخصصة."
    ],
    "variables": [
      [
        "--wakeb-dropdown-color-success",
        "#12b76a"
      ],
      [
        "--wakeb-dropdown-color-danger",
        "#f04438"
      ],
      [
        "--wakeb-dropdown-color-warning",
        "#f79009"
      ],
      [
        "--wakeb-dropdown-color-primary",
        "#087f8c"
      ],
      [
        "--wakeb-dropdown-color-info",
        "#2e90fa"
      ],
      [
        "--wakeb-dropdown-activator-color",
        "computed inline from selected color"
      ]
    ],
    "events": [
      "`selectedItem(item: DropdownItem)` then `update:modelValue(value: NavigationKey)` on an enabled option click, once each; selection updates afterwards.",
      "`selectedItem(item: DropdownItem)` ثم `update:modelValue(value: NavigationKey)` عند نقر عنصر متاح، مرة لكل حدث؛ تتحدث الحالة بعدهما."
    ],
    "attrs": [
      "The root `div` on every provider: not the activator button and not the teleported menu. Style the menu with `menuStyle`; the activator slot receives its own props. `providerProps` goes to the menu primitive. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الجذري `div` على كل المزودين، وليس زر الفتح ولا القائمة المنقولة. خصص القائمة عبر `menuStyle`، ويستقبل slot الـactivator خصائصه الخاصة. أما `providerProps` فيذهب إلى primitive القائمة. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Attrs target the outer div. VMenu/VList own click-away, Escape and keyboard movement; the WButton activator uses action=button. No i18n/router instance is imported. Format title: label through labelFormatter as one string, matching the legacy composite-label contract. modelValue synchronization runs when the value or menuItems change, so replaced records refresh the label; null clears the selection and undefined leaves an uncontrolled selection unchanged. Initial showSelected falls back to title or the first label without marking it active. An exact value match always wins; label matching is only a fallback; zero is supported. Raw CSS colors work on option icons/text; activator text accepts semantic keys and var()/hex values, preserving the old contract. Semantic WButton icon colors have their own WButton variables. Bind colors to menuStyle or colorMap for teleported lists. Rows use role=menuitem inside a role=menu list. With isLinks each enabled row is itself an anchor using href or a string to; disabled or loading rows have no href and set aria-disabled. Route objects require an item-label slot. Clicking an enabled row emits selection. Disabled/loading suppress normal menu interaction.",
      "الخصائص على div الخارجي. Vuetify يدير النقر الخارجي وEscape والكيبورد وزر WButton من نوع button. لا يوجد اعتماد على i18n أو router. عنوان showBoth يمر إلى labelFormatter كنص واحد مثل الأصل. مزامنة modelValue تعمل عند تغير القيمة أو menuItems فيتحدث الاسم مع البيانات الجديدة؛ null يمسح الاختيار وundefined يترك الاختيار غير المتحكم فيه كما هو. showSelected الأولي يختار عنوانًا أو أول اسم دون تمييز عنصر active. المطابقة الدقيقة للقيمة تكسب دائمًا ومقارنة الاسم بديل فقط، والصفر مدعوم. ألوان CSS الخام تعمل للعناصر؛ نص الزر يقبل المفاتيح الدلالية وvar() وhex مثل القديم. ألوان أيقونة WButton لها متغيراته المستقلة. menuStyle وcolorMap يخصصان القائمة المنقولة. الصفوف بدور menuitem داخل قائمة بدور menu. مع isLinks كل صف مفعل هو نفسه رابط من href أو to النصي، والصف المعطل أو أثناء التحميل بلا href ومعه aria-disabled. كائنات router تحتاج slot. نقر الصف المفعل يرسل الاختيار. التعطيل والتحميل يمنعان تفاعل القائمة الطبيعي."
    ],
    "example": "<WDropdown title=\"Status\" :menu-items=\"[{ label: 'Pending', value: 0 }, { label: 'Approved', value: 1 }]\" show-selected />",
    "playground": "NavigationPlayground"
  },
  {
    "name": "WCarousel",
    "slug": "carousel",
    "interface": "CarouselProps",
    "summary": [
      "A carousel with scoped slides, host-owned playback and accessible custom indicators.",
      "عرض شرائح بمحتوى مخصص وتحكم في التشغيل ومؤشرات قابلة للوصول."
    ],
    "props": [
      [
        "slides",
        "readonly unknown[]",
        "[]",
        "Records passed unchanged to the slide slot.",
        "عناصر تمر كما هي إلى slot الشريحة."
      ],
      [
        "modelValue",
        "number",
        "undefined",
        "Optional external index; local selection starts at zero.",
        "فهرس خارجي اختياري؛ الاختيار المحلي يبدأ من صفر."
      ],
      [
        "interval",
        "number",
        "5000",
        "Autoplay delay in milliseconds; values that are not positive use 6000.",
        "الفاصل الزمني للتشغيل التلقائي بالمللي ثانية."
      ],
      [
        "cycle",
        "boolean",
        "true",
        "Enable automatic cycling; offer a visible pause control when autoplay is used.",
        "تشغيل التنقل التلقائي؛ وفر تحكمًا ظاهرًا للإيقاف عند استخدامه."
      ],
      [
        "showArrows",
        "boolean | \"hover\"",
        "false",
        "Native previous/next controls.",
        "أزرار السابق والتالي الأصلية."
      ],
      [
        "showIndicators",
        "boolean",
        "false",
        "Show custom clickable indicators; this name has normal positive semantics.",
        "إظهار مؤشرات قابلة للنقر؛ الاسم بمعناه المباشر."
      ],
      [
        "height",
        "string | number",
        "\"100%\"",
        "Native carousel height.",
        "ارتفاع Carousel."
      ],
      [
        "ariaLabel",
        "string",
        "\"Carousel\"",
        "Accessible carousel region name.",
        "اسم عرض الشرائح المقروء."
      ],
      [
        "indicatorLabel",
        "(index: number) => string",
        "index => 'Go to slide ' + (index + 1)",
        "Host-localized indicator names; index is zero-based.",
        "دالة تسمية المؤشرات من المشروع؛ الفهرس يبدأ من صفر."
      ],
      [
        "indicatorAttrs",
        "Record<string, unknown>",
        "undefined",
        "Extra DOM attrs/style on each indicator; may override its native type.",
        "خصائص وأنماط كل مؤشر؛ يمكنها استبدال type الخاص بالزر."
      ],
      [
        "keyboardIndicators",
        "boolean",
        "true",
        "Enable enhanced indicator arrow/Home/End keys and focus styling; false keeps native button behavior.",
        "تفعيل مفاتيح الأسهم وHome/End وتنسيق التركيز؛ false يحتفظ بسلوك الزر الطبيعي."
      ]
    ],
    "slots": [
      "`slide`: `{slide,index}`; `prev`/`next`: `{props}` with `icon`, `class`, `onClick` and `aria-label` (Vuetify passes its own window values); bind those props to your native arrow controls.",
      "`slide`: يستقبل `{slide,index}`؛ `prev` و`next`: يستقبلان `{props}` بالمفاتيح `icon` و`class` و`onClick` و`aria-label` (يمرر Vuetify قيم نافذته الخاصة)؛ اربطها بأزرار التنقل."
    ],
    "variables": [
      [
        "--wakeb-carousel-indicator-bg",
        "#98a2b3"
      ],
      [
        "--wakeb-carousel-indicator-active-bg",
        "#087f8c"
      ],
      [
        "--wakeb-carousel-focus",
        "#087f8c"
      ],
      [
        "--wakeb-carousel-fallback",
        "undefined (legacy adapter switch)"
      ]
    ],
    "events": [
      "`update:modelValue(index: number)` once for an actual local index change; syncing the same valid parent value is silent.",
      "`update:modelValue(index: number)` مرة عند تغيير الفهرس محليًا؛ مزامنة قيمة الأب الصالحة لا تكرر الحدث."
    ],
    "attrs": [
      "The carousel root (VCarousel, `role=\"region\"`). The indicator container is a second root node and does not receive them; each indicator receives `indicatorAttrs`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "جذر العرض المتتابع (VCarousel الذي يحمل `role=\"region\"`). حاوية المؤشرات عقدة جذرية ثانية لا تستقبلها، وكل مؤشر يستقبل `indicatorAttrs`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "The component keeps two root nodes, without a layout wrapper. Put it in a positioned parent because custom indicators are absolutely positioned 2rem above its bottom. Ordinary attrs target VCarousel. Native delimiters stay hidden; showIndicators controls the custom dots. Custom indicators are type=button, have accessible names/current state, and support Arrow Left/Right (reversed in RTL), Home/End and normal Enter/Space. Arrow slots retain Vuetify keyboard behavior. Slides render through Vuetify lazy items. Use finite indices in range and positive intervals. Wakeb owns the autoplay timer on every provider (VCarousel's own cycle stays off): it advances once per interval and wraps, restarts the interval after every index change, and pauses while the pointer is over the carousel or its indicators, while focus is inside either, while the document is hidden, and whenever the user prefers reduced motion. The timer starts only after mount and is cleared, with its listeners, on unmount. The demo starts paused and exposes a cycle control. Use cycle=false for static/reduced-motion experiences; the indicator animation respects reduced motion, while slide transitions are Vuetify attrs. Labels and URLs/content come from the host. Aware keeps the original inverted hideDelimiters=true meaning through its adapter and retains the legacy missing indicator type. Aware disables the enhanced indicator keys/focus styling to retain its original behavior. PrimeVue: Wakeb renders the region, slides and arrows itself, because PrimeVue Carousel pages through several visible items with its own autoplay. Slides mount on first visit, stay mounted and switch without a transition or swipe gestures. Default arrows are native buttons with the built-in $prev/$next icons and the labels Previous visual/Next visual (Arabic under locale ar); Left/Right arrow keys on them move and keep focus, as in Vuetify. Attrs target the Wakeb region div. shadcn-vue: the same Wakeb region, slides, arrows, indicators and autoplay pause rules as PrimeVue, because the shadcn-vue Carousel needs Embla and has no autoplay or indicators.",
      "المكوّن يحتفظ بجذرين دون حاوية إضافية. ضعه داخل أب position:relative لأن المؤشرات موضوعة absolute على بعد 2rem من أسفله. الخصائص العادية تستهدف VCarousel. مؤشرات Vuetify الأصلية مخفية، وshowIndicators يتحكم في المؤشرات المخصصة. المؤشرات العامة type=button ولها أسماء وحالة حالية وتدعم اليمين واليسار مع عكس RTL وHome/End وEnter/Space. أزرار السابق والتالي تحتفظ بسلوك Vuetify. الشرائح تُركب عند الحاجة. استخدم فهارس محدودة ضمن النطاق وفواصل زمنية موجبة. Wakeb يملك مؤقت التشغيل التلقائي على كل المزودين (مؤقت VCarousel الخاص معطل): يتقدم مرة كل فاصل ويلتف، ويعيد بدء الفاصل بعد كل تغيير للفهرس، ويتوقف أثناء وجود المؤشر فوق العرض أو مؤشراته، وأثناء وجود التركيز داخل أي منهما، وعندما تكون الصفحة مخفية، وكلما فضّل المستخدم تقليل الحركة. يبدأ المؤقت بعد التركيب فقط ويُزال مع مستمعيه عند الإزالة؛ المثال يبدأ متوقفًا ويوفر تحكمًا في cycle. استخدم cycle=false للتجارب الثابتة أو قليلة الحركة؛ حركة المؤشرات تحترم reduced-motion وانتقالات الشرائح من خصائص Vuetify. المحتوى من المشروع. Aware يحتفظ بعكس معنى hideDelimiters=true وبسلوك type القديم للمؤشرات. Aware يعطل مفاتيح المؤشرات وتنسيق التركيز الإضافيين للاحتفاظ بالسلوك الأصلي. على PrimeVue يرسم Wakeb المنطقة والشرائح والأسهم بنفسه، لأن Carousel في PrimeVue يعرض صفحات من عدة عناصر بمؤقته الخاص. الشرائح تُركَّب عند أول زيارة وتبقى مركّبة وتتبدل دون حركة انتقال أو إيماءات سحب. الأسهم الافتراضية أزرار أصلية بأيقونتي $prev و$next المدمجتين وبالاسمين Previous visual وNext visual (وبالعربية مع locale ar)؛ ومفاتيح الأسهم يمينًا ويسارًا عليها تنقل الشريحة وتُبقي التركيز كما في Vuetify. الخصائص تستهدف div المنطقة الذي يرسمه Wakeb. على shadcn-vue تُستخدم المنطقة والشرائح والأسهم والمؤشرات وقواعد إيقاف التشغيل التلقائي نفسها كما في PrimeVue، لأن Carousel في shadcn-vue يحتاج إلى Embla ولا يوفّر تشغيلًا تلقائيًا ولا مؤشرات."
    ],
    "example": "<div style=\"position:relative;height:240px\"><WCarousel :slides=\"['First', 'Second']\" :cycle=\"false\" show-indicators><template #slide=\"{slide}\">{{slide}}</template></WCarousel></div>",
    "playground": "CompositionPlayground"
  },
  {
    "name": "WExportDropdown",
    "slug": "export-dropdown",
    "interface": "ExportDropdownProps",
    "summary": [
      "An export-format picker that emits intent while the host owns permissions and file generation.",
      "قائمة صيغ تصدير ترسل الاختيار؛ المشروع يملك الصلاحيات وتوليد الملفات."
    ],
    "props": [
      [
        "isLoading",
        "boolean",
        "false",
        "Disable menu/activator while a host export is in progress.",
        "تعطيل القائمة والزر أثناء التصدير في المشروع."
      ],
      [
        "disabled",
        "boolean",
        "false",
        "Disable the menu and button.",
        "تعطيل القائمة والزر."
      ],
      [
        "title",
        "string",
        "\"Download\"",
        "Already translated button text.",
        "نص الزر مترجم مسبقًا."
      ],
      [
        "formats",
        "readonly ExportFormat[]",
        "PDF / XLSX",
        "Configurable labels, string values and optional icons/disabled flags.",
        "الأسماء والقيم النصية وأيقونات وحالات التعطيل الاختيارية."
      ],
      [
        "menuStyle",
        "CSSProperties",
        "undefined",
        "Direct styles on the teleported list.",
        "أنماط على القائمة المنقولة خارج الحاوية."
      ]
    ],
    "slots": [
      "`activator`: `{props,buttonProps}`. Bind menu props and button props, and attach your host permission directive there. `format-icon` / `format-label`: `{format,index}`.",
      "`activator`: يستقبل `{props,buttonProps}`؛ اربط خصائص القائمة والزر وضع directive صلاحيات المشروع هنا. `format-icon` و`format-label`: يستقبلان `{format,index}`."
    ],
    "variables": [
      [
        "--wakeb-export-button-height",
        "44px"
      ]
    ],
    "events": [
      "`select(value: string)` once for an enabled format. No file is generated or downloaded by the component.",
      "`select(value: string)` مرة لاختيار صيغة متاحة. المكوّن لا يولد ملفًا ولا ينزله."
    ],
    "attrs": [
      "Baseline compatibility: ordinary attrs reach the teleported menu overlay (VMenu on Vuetify, the Menu root on PrimeVue), which exists only while the menu is open. They do not reach the activator button; use the activator slot for that. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "للتوافق مع الإصدار الأساسي: تصل السمات العادية إلى طبقة القائمة المنقولة (VMenu على Vuetify وجذر Menu على PrimeVue)، وهي موجودة فقط أثناء فتح القائمة. لا تصل إلى زر الفتح؛ استخدم slot الـactivator لذلك. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "The root is VMenu, preserving its attrs/teleport contract. Default formats are PDF/pdf and Excel/xlsx with English labels; supply localized records. Inline SVG fallbacks need no icon font; optional format.icon resolves through the icons plugin option and the Wakeb built-ins, then the host Vuetify icon configuration. Loading disables the public default activator and menu; custom activators receive buttonProps and may preserve their existing loading contract. Permission checks, export state, network requests, MIME handling and download services stay in the host. Use the activator slot for directives; the package has no permission prop or auth dependency. menuStyle targets the actual teleported list and wins over the plugin theme scope and zIndexOverlay that the menu carries. VMenu/VList provide outside-click, Escape and keyboard behavior; rows use role=menuitem in a role=menu list and disabled formats set aria-disabled. The default native action is button, and its default height is 44px. PrimeVue: the formats render in PrimeVue Menu (popup), which owns positioning, arrow keys, Enter/Space, Escape, outside clicks and focus return; the activator carries aria-haspopup, aria-expanded and aria-controls. Attrs, the theme scope and zIndexOverlay reach the teleported Menu root; menuStyle reaches the role=menu list. Format icons resolve through the icons option and the Wakeb built-ins (PrimeIcons class names also work), not a Vuetify icon set.",
      "الجذر VMenu ويحتفظ بعقد الخصائص وteleport. الافتراضي PDF/pdf وExcel/xlsx بأسماء إنجليزية؛ مرر بيانات مترجمة. أيقونات SVG الافتراضية لا تحتاج خط أيقونات؛ format.icon الاختيارية تُحل عبر الخيار icons والأيقونات المدمجة ثم إعداد Vuetify للمشروع. التحميل يعطل الزر العام والقائمة؛ الـactivator المخصص يمكنه الحفاظ على سلوكه القديم. الصلاحيات وحالة التصدير والشبكة وتوليد الملف والتنزيل في المشروع. استخدم activator للصلاحيات؛ الحزمة لا تستقبل permission ولا تعتمد على auth. menuStyle يستهدف القائمة المنقولة ويتقدم على نطاق theme الخاص بالـplugin وzIndexOverlay اللذين تحملهما القائمة. Vuetify يدير النقر الخارجي وEscape والكيبورد؛ الصفوف بدور menuitem داخل menu والصيغ المعطلة معها aria-disabled. نوع الزر button وارتفاعه الافتراضي 44px. على PrimeVue: تُرسم الصيغ في Menu المنبثقة من PrimeVue، وهي المسؤولة عن الموضع والأسهم وEnter/Space وEscape والنقر الخارجي وإعادة التركيز؛ ويحمل زر الفتح aria-haspopup وaria-expanded وaria-controls. تصل الخصائص ونطاق theme وzIndexOverlay إلى جذر Menu المنقول، ويصل menuStyle إلى القائمة التي تحمل role=menu. أيقونات الصيغ تُحل عبر الخيار icons والأيقونات المدمجة في Wakeb (وتعمل أسماء PrimeIcons أيضًا)، لا عبر أيقونات Vuetify."
    ],
    "example": "<WExportDropdown title=\"Download report\" @select=\"format => console.log(format)\" />",
    "playground": "CompositionPlayground"
  },
  {
    "name": "WBaseSidebar",
    "slug": "base-sidebar",
    "interface": "BaseSidebarProps",
    "summary": [
      "A gradient sidebar shell with search/content slots, filter actions and loading/empty/list states.",
      "حاوية جانبية بخلفية متدرجة وslots للبحث والمحتوى وأزرار الفلترة وحالات القائمة."
    ],
    "props": [
      [
        "title",
        "string",
        "required",
        "Already translated heading.",
        "العنوان مترجم مسبقًا."
      ],
      [
        "loading",
        "boolean",
        "false",
        "Loading state takes precedence over empty/items.",
        "التحميل له أولوية على القائمة والحالة الفارغة."
      ],
      [
        "items",
        "readonly SidebarItem[]",
        "[]",
        "Presentational item records.",
        "عناصر العرض."
      ],
      [
        "skeletonType",
        "string",
        "\"list-item-two-line, list-item-two-line, list-item-two-line\"",
        "Wakeb skeleton grammar: comma-separated portable names, each optionally @N (capped at 100).",
        "صيغة Skeleton في Wakeb: أسماء قابلة للنقل تفصلها فواصل، ويمكن أن يتبع كل اسم @N (بحد أقصى 100)."
      ],
      [
        "hasFilter",
        "boolean",
        "true",
        "Render default filter controls.",
        "إظهار أزرار الفلترة الافتراضية."
      ],
      [
        "isFiltered",
        "boolean",
        "false",
        "Render the default cancel control.",
        "إظهار زر إلغاء الفلتر."
      ],
      [
        "skeletonWidth",
        "string | number",
        "\"360px\"",
        "Vuetify skeleton width.",
        "عرض Skeleton."
      ],
      [
        "itemKey",
        "string",
        "\"id\"",
        "Direct key field, falling back to row index.",
        "حقل المفتاح المباشر؛ البديل فهرس الصف."
      ],
      [
        "filterLabel",
        "string",
        "\"Filter\"",
        "Default filter button text.",
        "نص زر الفلتر."
      ],
      [
        "cancelLabel",
        "string",
        "\"Cancel\"",
        "Default cancel button text.",
        "نص زر الإلغاء."
      ],
      [
        "emptyLabel",
        "string",
        "\"No data\"",
        "Already translated empty-state text.",
        "نص الحالة الفارغة مترجم مسبقًا."
      ]
    ],
    "slots": [
      "`header-actions`: `{isFiltered,filterClick,filterCancel}`; `content` / `search`: `{search(payload)}`; `item`: `{item,index}`; `loading`: `{type,width}`; `empty`: `{label}`; `filter-modal`: no props. The content slot replaces search and the list entirely.",
      "`header-actions`: يستقبل `{isFiltered,filterClick,filterCancel}`؛ `content` و`search`: يستقبلان `{search(payload)}`؛ `item`: يستقبل `{item,index}`؛ `loading`: يستقبل `{type,width}`؛ `empty`: يستقبل `{label}`؛ `filter-modal`: دون خصائص. content يستبدل البحث والقائمة بالكامل."
    ],
    "variables": [
      [
        "--wakeb-sidebar-outer-bg",
        "120deg conic gradient"
      ],
      [
        "--wakeb-sidebar-inner-bg",
        "240deg linear gradient"
      ],
      [
        "--wakeb-sidebar-body",
        "#fff"
      ],
      [
        "--wakeb-sidebar-body-rgb",
        "255,255,255"
      ],
      [
        "--wakeb-sidebar-title",
        "#fff"
      ],
      [
        "--wakeb-sidebar-empty-color",
        "#667085"
      ],
      [
        "--wakeb-sidebar-fallback",
        "undefined (legacy adapter switch)"
      ]
    ],
    "events": [
      "`search(payload: unknown)` only when a search/content slot calls its search callback; `filterClick()` and `filterCancel()` for controls. No records or schemas are mutated.",
      "`search(payload: unknown)` عندما يستدعي slot البحث دالة search؛ و`filterClick()` و`filterCancel()` للأزرار. لا تتغير العناصر أو schemas داخل المكوّن."
    ],
    "attrs": [
      "The root `div.wakeb-base-sidebar`. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الجذري `div.wakeb-base-sidebar`. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Attrs target the outer div. The package owns no form/schema, store, translations or filter modal. Supply a native input or your form library through search and call search(payload). Aware retains GenericForm and updateSchema in its adapter. Without a search slot, the public component renders no search control. The header remains while content is replaced. Loading wins over empty/list. The default list keeps min-height 400px and max-height 60dvh, with a 340px minimum shell width; override root min-width for narrower responsive layouts. The bottom 72px fade is decorative and does not intercept pointers. Use namespaced CSS variables for gradients/body/title colors and loading/empty slots for custom states. Legacy global card-gradient/sidebar rules remain in Aware only; package styles are scoped. List item identity uses a direct field or index, and slots own item interactions. PrimeVue: the same markup, slots and variables; the filter buttons are the PrimeVue WButton. The loading skeleton renders the portable skeleton names with PrimeVue Skeleton bones inside one polite role=alert region named \"Loading...\" (Arabic: \"جارٍ التحميل...\"), matching the Vuetify loader semantics. Vuetify-only skeleton names are skipped there with WAKEB_UNKNOWN_VALUE; the loading slot receives the normalized sequence on both providers.",
      "الخصائص على div الخارجي. الحزمة لا تملك form أو schema أو store أو ترجمة أو نافذة فلتر. وفر input أو مكتبة الفورم في search واستدعِ search(payload). Aware يحتفظ بـGenericForm وupdateSchema في adapter. دون search لا يظهر بحث افتراضي. يبقى الـheader عند استبدال المحتوى. التحميل له أولوية على الحالة الفارغة والقائمة. القائمة تحتفظ بحد أدنى 400px وأقصى 60dvh والحاوية بحد أدنى 340px؛ استبدل min-width للتصميم الأضيق. التلاشي السفلي 72px زخرفي ولا يمنع النقر. خصص الألوان عبر CSS والتحميل والحالة الفارغة عبر slots. أنماط card-gradient العامة القديمة تبقى في Aware فقط، وأنماط الحزمة scoped. هوية العنصر من حقل مباشر أو الفهرس وslot يملك التفاعل معه. على PrimeVue: نفس الـmarkup والـslots والمتغيرات، وأزرار الفلتر هي WButton على PrimeVue. يرسم هيكل التحميل أسماء الهياكل المحمولة بعناصر Skeleton من PrimeVue داخل منطقة واحدة بدور role=alert وaria-live=polite واسمها \"Loading...\" (وبالعربية \"جارٍ التحميل...\")، مطابقة لدلالات محمّل Vuetify. الأسماء الخاصة بـVuetify تُتجاوز هناك مع WAKEB_UNKNOWN_VALUE، ويستقبل slot التحميل التسلسل الموحد على المزودين."
    ],
    "example": "<WBaseSidebar title=\"People\" :items=\"[{id:1,name:'Ada'}]\" :has-filter=\"false\"><template #item=\"{item}\">{{item.name}}</template></WBaseSidebar>",
    "playground": "CompositionPlayground"
  },
  {
    "name": "WModal",
    "slug": "modal",
    "interface": "ModalProps",
    "summary": [
      "A Vuetify dialog shell with independent data/loading states, header composition and explicit action slots.",
      "حاوية Dialog من Vuetify مع تحميل البيانات والعمليات بشكل منفصل وslots للرأس والإجراءات."
    ],
    "props": [
      [
        "modelValue",
        "boolean",
        "false",
        "Open state; local changes emit once.",
        "حالة الفتح؛ التغيير المحلي يرسل حدثًا واحدًا."
      ],
      [
        "title",
        "string",
        "\"\"",
        "Already translated heading.",
        "عنوان مترجم من المشروع."
      ],
      [
        "persistent",
        "boolean",
        "true",
        "Prevent native outside/Escape dismissal.",
        "منع الإغلاق الأصلي من الخارج أو Escape."
      ],
      [
        "closable",
        "boolean",
        "true",
        "Show the close button.",
        "إظهار زر الإغلاق."
      ],
      [
        "loading",
        "boolean",
        "false",
        "Show an independent overlay; never initiates a request.",
        "طبقة تحميل مستقلة دون تنفيذ طلب."
      ],
      [
        "dataLoaded",
        "boolean",
        "true",
        "Replace the content with the loading slot until data is ready.",
        "استبدال المحتوى بالتحميل حتى تجهز البيانات."
      ],
      [
        "closeLabel",
        "string",
        "\"Close\"",
        "Localized accessible close-button name.",
        "اسم زر الإغلاق المقروء بعد ترجمته."
      ],
      [
        "loadingLabel",
        "string",
        "\"Loading\"",
        "Localized name for loading indicators.",
        "اسم مقروء ومترجم للتحميل."
      ],
      [
        "width",
        "string | number",
        "undefined",
        "Maximum dialog width; native attrs remain available.",
        "أقصى عرض للنافذة؛ خصائص Vuetify متاحة."
      ],
      [
        "description",
        "string",
        "\"\"",
        "Optional description in the default header.",
        "وصف اختياري في الرأس الافتراضي."
      ],
      [
        "showActions",
        "boolean",
        "true",
        "Render the VCard action slot, including its empty footer.",
        "إظهار منطقة إجراءات VCard بما فيها القدم الفارغة."
      ],
      [
        "titleClass",
        "ComponentClass",
        "\"\"",
        "Classes on the default title.",
        "كلاسات العنوان الافتراضي."
      ],
      [
        "headerIcon",
        "SharedIcon",
        "\"\"",
        "Optional icon name, SVG path data or component (Providers > Icons); header-icon can replace it.",
        "اسم أيقونة أو بيانات مسار SVG أو مكوّن اختياري (المزودات > الأيقونات)؛ ويمكن استبداله بـheader-icon."
      ],
      [
        "ariaLabel",
        "string",
        "\"Dialog\"",
        "Fallback dialog name when title is empty.",
        "اسم بديل للنافذة عند غياب العنوان."
      ],
      [
        "providerProps",
        "WakebProviderProps",
        "undefined",
        "Nonportable. Native props and listeners for the dialog primitive (Vuetify `VDialog`, PrimeVue `Dialog`). The model, dismissal policy, width, stacking, focus containment, scroll lock, `afterLeave` callbacks, `contentProps` and `pt` stay Wakeb-owned. Other native callbacks run alongside Wakeb's own. Ignored keys produce a development warning.",
        "غير قابل للنقل. خصائص وأحداث أصلية لـprimitive النافذة (`VDialog` في Vuetify و`Dialog` في PrimeVue). الـmodel وسياسة الإغلاق والعرض وترتيب الطبقات وحصر التركيز وقفل التمرير وأحداث `afterLeave` و`contentProps` و`pt` يملكها Wakeb. الأحداث الأصلية الأخرى تعمل بجانب معالجات Wakeb. المفاتيح المتجاهلة تُنتج تحذيرًا في وضع التطوير."
      ]
    ],
    "variables": [
      [
        "--wakeb-modal-bg",
        "rgb(var(--v-theme-surface))"
      ],
      [
        "--wakeb-modal-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-modal-title",
        "inherit"
      ],
      [
        "--wakeb-modal-margin",
        "1rem"
      ],
      [
        "--wakeb-modal-padding",
        "1.25rem"
      ],
      [
        "--wakeb-modal-radius",
        "4px"
      ],
      [
        "--wakeb-modal-icon-bg",
        "#e6f4f5"
      ],
      [
        "--wakeb-modal-description",
        "rgb(var(--v-theme-on-surface))"
      ],
      [
        "--wakeb-modal-loading-bg",
        "rgba(var(--v-theme-surface), 0.72)"
      ],
      [
        "--wakeb-modal-fallback",
        "undefined (legacy adapter switch)"
      ],
      [
        "--wakeb-modal-close-color",
        "rgb(var(--v-theme-on-surface))"
      ],
      [
        "--wakeb-modal-icon-color",
        "#087f8c"
      ]
    ],
    "events": [
      "`update:modelValue(value: boolean)` for local changes; parent synchronization is silent. `afterLeave()` when the native dialog transition ends.",
      "`update:modelValue(value: boolean)` للتغييرات المحلية؛ مزامنة الأب صامتة. `afterLeave()` بعد انتهاء انتقال إغلاق Vuetify."
    ],
    "slots": [
      "`activator {props,isActive}`: bind props to the launch button to retain native focus return. `header {close}` replaces the entire header. `title`, `header-icon`, `header-decoration`, `header-actions` compose the default header. `close-button {close,label}` replaces its button. `content` falls back to `default`; `actions` supplies the footer. `loading {label}` replaces content; `loading-overlay {label}` replaces the independent overlay.",
      "`activator {props,isActive}`: اربط props بزر الفتح لإعادة التركيز أصليًا. `header {close}` يستبدل الرأس بالكامل. `title` و`header-icon` و`header-decoration` و`header-actions` لتركيب الرأس الافتراضي. `close-button {close,label}` يستبدل زر الإغلاق. `content` وبديله `default` للمحتوى؛ `actions` للقدم. `loading {label}` بديل المحتوى؛ `loading-overlay {label}` لطبقة تحميل مستقلة."
    ],
    "attrs": [
      "The element with `role=\"dialog\"`, which also carries `.wakeb-modal`, on every provider. It is teleported, so it exists only while the dialog is rendered. Wakeb's accessible name (`title`, then `ariaLabel`) wins over a caller `aria-label`. `providerProps` goes to the dialog primitive. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الذي يحمل `role=\"dialog\"`، ويحمل أيضًا `.wakeb-modal`، على كل المزودين. هذا العنصر منقول خارج المكوّن، فلا يوجد إلا أثناء رسم النافذة. الاسم الذي يضعه Wakeb (`title` ثم `ariaLabel`) يغلب `aria-label` من المستخدم. أما `providerProps` فيذهب إلى primitive النافذة. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Attrs target VDialog; its native transition, scrim, scrollStrategy and focus behavior remain available. Persistent defaults true, so Escape/outside clicks do not close it. Native focus capture/trap, scroll blocking and overlay stacking are delegated to Vuetify. Use the activator slot for focus return; programmatic launchers own restoration if no activator exists. Mount within your Vuetify application. Header slots are trusted Vue content: no raw SVG injection is built into the package. Aware retains its raw header decoration, SvgIcon, translated close button and legacy title/header visibility through header replacement; customAction maps to !showActions. Data-not-ready content is unmounted, not merely hidden. loading is presentation only; the host decides whether close/save is allowed and owns submission/permissions. The shared default loading overlay covers the card; Aware retains its existing loader markup through a slot. A description alone renders the default header. width wins over a native max-width attr, which applies only when width is absent. Modal radius is 4px, matching Vuetify dialog cards.",
      "الخصائص تستهدف VDialog؛ خصائص الانتقال وscrim وscrollStrategy والتركيز الأصلية متاحة. persistent افتراضيًا true فيمنع Escape والنقر خارج النافذة من إغلاقها. Vuetify يدير التركيز وحصره وحجب التمرير وتراص النوافذ. استخدم activator لإعادة التركيز؛ زر الفتح البرمجي دون activator مسؤول عن استعادته. استخدمها داخل تطبيق Vuetify. slots محتوى Vue موثوق؛ الحزمة لا تحقن SVG خامًا. Aware يحتفظ بزخرفة الرأس وSvgIcon وترجمة الإغلاق وقواعد ظهور الرأس القديمة؛ customAction يقابل عكس showActions. المحتوى يزال أثناء عدم جاهزية البيانات. loading للعرض فقط؛ المشروع يقرر الإغلاق والحفظ ويملك الصلاحيات والإرسال. الطبقة العامة تغطي البطاقة؛ Aware يحتفظ بعناصر التحميل القديمة عبر slot. الوصف وحده يكفي لإظهار الرأس الافتراضي. width يكسب على max-width الأصلية التي تُستخدم فقط عند غياب width. حافة البطاقة 4px مثل Dialog في Vuetify."
    ],
    "example": "<button type=\"button\" @click=\"open = true\">Open</button>\n  <WModal v-model=\"open\" title=\"Report\" width=\"640\"><template #content>Report content</template></WModal>",
    "playground": "OverlayPlayground",
    "setup": "import { ref } from 'vue'\nconst open = ref(false)"
  },
  {
    "name": "WDrawer",
    "slug": "drawer",
    "interface": "DrawerProps",
    "summary": [
      "A temporary Vuetify navigation drawer with logical RTL positions, scrolling content and composable actions.",
      "حاوية جانبية مؤقتة من Vuetify باتجاهات RTL ومحتوى قابل للتمرير وإجراءات قابلة للتركيب."
    ],
    "props": [
      [
        "modelValue",
        "boolean",
        "false",
        "Open state; local changes emit once.",
        "حالة الفتح؛ التغيير المحلي يرسل حدثًا واحدًا."
      ],
      [
        "title",
        "string",
        "\"\"",
        "Already translated heading.",
        "عنوان مترجم من المشروع."
      ],
      [
        "persistent",
        "boolean",
        "false",
        "Prevent scrim dismissal.",
        "منع الإغلاق بالنقر على الخلفية."
      ],
      [
        "closable",
        "boolean",
        "true",
        "Show the close button.",
        "إظهار زر الإغلاق."
      ],
      [
        "loading",
        "boolean",
        "false",
        "Show an independent overlay; never initiates a request.",
        "طبقة تحميل مستقلة دون تنفيذ طلب."
      ],
      [
        "dataLoaded",
        "boolean",
        "true",
        "Replace the content with the loading slot until data is ready.",
        "استبدال المحتوى بالتحميل حتى تجهز البيانات."
      ],
      [
        "closeLabel",
        "string",
        "\"Close\"",
        "Localized accessible close-button name.",
        "اسم زر الإغلاق المقروء بعد ترجمته."
      ],
      [
        "loadingLabel",
        "string",
        "\"Loading\"",
        "Localized name for loading indicators.",
        "اسم مقروء ومترجم للتحميل."
      ],
      [
        "width",
        "string | number",
        "420",
        "Numbers pass through; strings use parseInt with 420 fallback.",
        "الأرقام تمر كما هي؛ النصوص تستخدم parseInt والبديل 420."
      ],
      [
        "position",
        "\"start\" | \"end\"",
        "\"end\"",
        "Logical side resolved from Vuetify RTL.",
        "جانب منطقي حسب RTL في Vuetify."
      ],
      [
        "transparentOverlay",
        "boolean",
        "false",
        "Remove the scrim, retaining temporary drawer semantics.",
        "إزالة الخلفية المعتمة مع الاحتفاظ بحاوية مؤقتة."
      ],
      [
        "ariaLabel",
        "string",
        "\"Drawer\"",
        "Fallback accessible name when title is empty.",
        "اسم مقروء بديل عند غياب العنوان."
      ]
    ],
    "variables": [
      [
        "--wakeb-drawer-bg",
        "rgb(var(--v-theme-surface))"
      ],
      [
        "--wakeb-drawer-border",
        "#d0d5dd"
      ],
      [
        "--wakeb-drawer-title",
        "inherit"
      ],
      [
        "--wakeb-drawer-radius",
        "20px"
      ],
      [
        "--wakeb-drawer-padding",
        "1.25rem"
      ],
      [
        "--wakeb-drawer-loading-bg",
        "rgba(var(--v-theme-surface), 0.72)"
      ],
      [
        "--wakeb-drawer-fallback",
        "undefined (legacy adapter switch)"
      ],
      [
        "--wakeb-drawer-close-color",
        "rgb(var(--v-theme-on-surface))"
      ]
    ],
    "events": [
      "`update:modelValue(value: boolean)` for local changes. `close()` only from the supplied/default close callback, after the model update; scrim/parent updates do not emit close.",
      "`update:modelValue(value: boolean)` للتغييرات المحلية. `close()` من دالة زر الإغلاق فقط بعد تحديث الموديل؛ الخلفية وتغيير الأب لا يرسلان close."
    ],
    "slots": [
      "`title`, `header-actions`, `close-button {close,label}`, `content`, `default`, `actions`, `loading {label}` and `loading-overlay {label}`. content and default render in sequence; footer exists only when actions is supplied.",
      "`title` و`header-actions` و`close-button {close,label}` و`content` و`default` و`actions` و`loading {label}` و`loading-overlay {label}`. content وdefault يظهران بالتتابع؛ القدم تظهر فقط عند توفير actions."
    ],
    "attrs": [
      "The element that carries `.wakeb-drawer`: on Vuetify the drawer root (VNavigationDrawer, a `<nav>`); on PrimeVue the teleported `role=\"dialog\"` element, present only while open. `title`, then `ariaLabel`, names it on both providers. Listeners for declared Wakeb events go through Vue emits, once; other listeners are DOM listeners on this element.",
      "العنصر الذي يحمل `.wakeb-drawer`: على Vuetify جذر اللوحة (VNavigationDrawer، وهو عنصر `<nav>`)، وعلى PrimeVue العنصر المنقول الذي يحمل `role=\"dialog\"` ولا يوجد إلا أثناء فتح اللوحة. يسميه `title` ثم `ariaLabel` على المزودين. مستمعو أحداث Wakeb المعلنة يمرون عبر emits في Vue مرة واحدة؛ أما بقية المستمعين فهم مستمعو DOM على هذا العنصر."
    ],
    "limits": [
      "Vuetify: requires a Vuetify layout provider (normally VApp); do not instantiate it outside a layout. Attrs target VNavigationDrawer, including native focus/resize/route-watcher options. It remains temporary, keeps its native scrim and touch behavior and maps end to right in LTR/left in RTL. Unlike VDialog, VNavigationDrawer does not provide Escape dismissal or dialog scroll blocking; this component preserves those native semantics. Do not infer dialog-style stacked-overlay guarantees when nesting drawers and dialogs; test your composition. Manage launch/return focus in the host. Width \"50%\" parses to 50px, preserving Aware behavior; use numeric/pixel widths. Content scrolls, header/footer stay outside its scroll area. Data-not-ready unmounts content; loading overlays are independent and contain no form or save logic. Aware keeps its icon button, translated slot content, theme-token aliases and per-screen drawer-panel hooks. AddEditModal, schemas, validation and permissions remain in Aware. PrimeVue: rendered with PrimeVue Drawer, which teleports to the body under its own mask, so it needs no layout host and no wrapper around the app root. It is a modal role=dialog: focus moves into the drawer and Tab stays inside, Escape and outside clicks close it unless persistent, body scrolling is locked while open, and focus returns to the opener after it closes. Closed content is not rendered. transparentOverlay hides the mask color but keeps the mask, so the background stays inert and an outside click still closes a non-persistent drawer. The logical side follows the Wakeb direction option, not the page dir. The mask takes zIndexOverlay; without it, the drawer shares PrimeVue's modal z-index stack with WModal. Vuetify-native drawer attrs (rail, touch, route watcher) do not apply.",
      "على Vuetify: تحتاج مزود layout من Vuetify، عادة VApp؛ لا تستخدمها خارج layout. الخصائص تستهدف VNavigationDrawer بما فيها خيارات التركيز وresize ومراقبة المسار الأصلية. تظل temporary مع الخلفية واللمس الأصليين؛ end يمين في LTR ويسار في RTL. بعكس VDialog، VNavigationDrawer لا يوفر إغلاق Escape أو حجب تمرير Dialog؛ المكوّن يحتفظ بالسلوك الأصلي. لا تفترض ضمان تراص Dialog عند تداخل حاويات جانبية ونوافذ؛ اختبر التركيب. المشروع يدير التركيز عند الفتح والعودة. العرض \"50%\" يتحول إلى 50px للحفاظ على سلوك Aware؛ استخدم أرقامًا أو بكسل. المحتوى يتمرر والرأس والقدم خارجه. عدم جاهزية البيانات يزيل المحتوى؛ طبقة التحميل مستقلة دون حفظ أو form. Aware يحتفظ بزر الأيقونة وترجمة المحتوى وربط الثيم ونقاط تنسيق drawer-panel. AddEditModal وschema والتحقق والصلاحيات تبقى في Aware. على PrimeVue: تُرسم بـDrawer من PrimeVue، وهو يُنقل إلى body تحت طبقة خلفية خاصة به، فلا يحتاج layout حاضنًا ولا غلافًا حول جذر التطبيق. هي role=dialog مشروطة: ينتقل التركيز إلى داخلها ويبقى Tab فيها، ويغلقها Escape والنقر خارجها ما لم تكن persistent، ويُمنع تمرير الصفحة أثناء فتحها، ويعود التركيز إلى زر الفتح بعد إغلاقها. المحتوى المغلق لا يُرسم. يخفي transparentOverlay لون الخلفية ويبقيها، فتظل الصفحة غير قابلة للتفاعل ويغلق النقر الخارجي اللوحة غير الـpersistent. يتبع الجانب المنطقي خيار direction في Wakeb لا dir الصفحة. تأخذ الخلفية zIndexOverlay، وبدونه تتشارك اللوحة مع WModal ترتيب z-index الخاص بنوافذ PrimeVue. خصائص Vuetify الأصلية للوحة (rail واللمس ومراقبة المسار) لا تنطبق."
    ],
    "example": "<button type=\"button\" @click=\"open = true\">Open</button>\n  <WDrawer v-model=\"open\" title=\"Details\"><template #content>Details content</template></WDrawer>",
    "playground": "OverlayPlayground",
    "setup": "import { ref } from 'vue'\nconst open = ref(false)"
  }
];
