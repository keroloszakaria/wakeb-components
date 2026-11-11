import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { components } from './agent-artifacts.mjs'

export function writeComponentPages(root) {
  for (const lang of [0, 1]) {
    const prefix = lang ? 'ar/' : ''
    const folder = join(root, 'docs', prefix, 'components')
    mkdirSync(folder, { recursive: true })
    for (const entry of components) {
      const t = (en, ar) => lang ? ar : en
      const table = (headers, rows) => `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map(row => '| ' + row.join(' | ') + ' |').join('\n')}`
      const code = text => `\`\`\`vue\n${text}\`\`\``
      const signatures = members => members.length ? `\`\`\`ts\n${members.map(member => member.signature).join('\n')}\n\`\`\`` : ''
      const page = `<!-- Generated from docs/reference-data.mjs, docs/recipes.mjs and src/contracts.ts -->
# ${entry.name}

${entry.summary[lang]}

::: info ${t('0.8.0-alpha.0 candidate', 'نسخة تجريبية 0.8.0-alpha.0')}
${t('This page describes the local, unreleased three-provider API. Install the [candidate archive](../guide/installation) and complete [provider setup](../guide/providers) first. The public 0.7 API differs.', 'تصف الصفحة الواجهة المحلية غير المنشورة للمزودات الثلاثة. ثبّت [الأرشيف التجريبي](../guide/installation) وأكمل [إعداد المزود](../guide/providers) أولًا؛ واجهة 0.7 العامة مختلفة.')}
:::

## ${t('Preview', 'معاينة')}

${t('Live preview uses Vuetify. The same public API is checked separately on PrimeVue and shadcn-vue; see [verification](../guide/verification).', 'تستخدم المعاينة Vuetify. تُفحص الواجهة العامة نفسها بصورة مستقلة على PrimeVue وshadcn-vue؛ راجع [التحقق](../guide/verification).')}

<${entry.playground ?? 'ComponentPlayground'} initial="${entry.slug}" />

## ${t('Usage', 'الاستخدام')}

${code(entry.usage)}

## ${t('Examples', 'أمثلة')}

### ${entry.recipe.title[lang]}

${entry.recipe.description[lang]}

${code(entry.recipe.source)}

## ${t('Props', 'الخصائص')}

${table(t(['Prop', 'Type', 'Default', 'Description'], ['الخاصية', 'النوع', 'الافتراضي', 'الوصف']), entry.props.map(([name, type, fallback, en, ar]) => [`\`${name}\``, `\`${type.replaceAll('|', '\\|')}\``, `\`${fallback}\``, lang ? ar : en]))}

## ${t('Events', 'الأحداث')}

${entry.events?.[lang] ?? t('No declared component events. DOM listeners follow the attribute target below.', 'لا توجد أحداث مخصصة معلنة. تتبع أحداث DOM وجهة السمات أدناه.')}

${signatures(entry.eventSignatures)}

## Slots

${entry.slots[lang]}

${signatures(entry.slotSignatures)}

## ${t('CSS variables', 'متغيرات CSS')}

${entry.variables.length ? table(t(['Variable', 'Default'], ['المتغير', 'الافتراضي']), entry.variables.map(([name, fallback]) => [`\`${name}\``, `\`${fallback}\``])) : t('No component-specific CSS variables. Use [shared theme tokens](../guide/customization), supported props or slots.', 'لا توجد متغيرات CSS خاصة بهذا المكون. استخدم [متغيرات الثيم المشتركة](../guide/customization) والخصائص أو slots المدعومة.')}

## ${t('Attribute target', 'وجهة السمات')}

${entry.attrs[lang]}

## ${t('Keyboard interaction', 'التفاعل بالكيبورد')}

${entry.keyboard.length ? table(t(['Key', 'Behavior'], ['المفتاح', 'السلوك']), entry.keyboard.map(([key, en, ar]) => [`\`${key}\``, lang ? ar : en])) : t('This component adds no Wakeb keyboard command. Native or slotted interactive content keeps its own keyboard behavior. See the exact focus, role and provider notes below.', 'لا يضيف المكون أمر كيبورد خاصًا بـWakeb. تحتفظ العناصر التفاعلية الأصلية أو المضافة عبر slots بسلوكها. راجع تفاصيل التركيز والأدوار واختلافات المزودات أدناه.')}

## ${t('Accessibility and limits', 'الوصول وحدود السلوك')}

${entry.limits[lang]}

---

${t('Need this contract in your coding agent? Use the [skill and MCP](../guide/agents).', 'لاستخدام هذا العقد مع agent يكتب الكود، راجع [الـskill وMCP](../guide/agents).')}
`
      writeFileSync(join(folder, entry.slug + '.md'), page)
    }
    const coverageFile = join(root, 'docs', prefix, 'guide/verification.md')
    const coverage = `<!-- component-coverage -->\n\n| ${lang ? 'المكون | Vuetify | PrimeVue | shadcn-vue | أمثلة SFC' : 'Component | Vuetify | PrimeVue | shadcn-vue | SFC examples'} |\n| --- | --- | --- | --- | --- |\n${components.map(entry => `| [${entry.name}](../components/${entry.slug}) | ${lang ? 'عقد + متصفح' : 'Contract + browser'} | ${lang ? 'عقد + متصفح' : 'Contract + browser'} | ${lang ? 'عقد + متصفح' : 'Contract + browser'} | 2 |`).join('\n')}\n\n<!-- /component-coverage -->`
    const current = readFileSync(coverageFile, 'utf8')
    writeFileSync(coverageFile, current.replace(/<!-- component-coverage -->(?:[\s\S]*?<!-- \/component-coverage -->)?/, coverage))
  }
}
