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
  }
];
