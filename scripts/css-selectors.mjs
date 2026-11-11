/** Split only top-level commas; Vite 8 expands logical properties with :where(:lang(...), ...). */
export function splitSelectorList(list) {
  const selectors = []
  let start = 0, depth = 0, quote = '', escaped = false
  for (let i = 0; i < list.length; i++) {
    const char = list[i]
    if (escaped) { escaped = false; continue }
    if (char === '\\') { escaped = true; continue }
    if (quote) { if (char === quote) quote = ''; continue }
    if (char === '"' || char === "'") { quote = char; continue }
    if (char === '(' || char === '[') depth++
    else if (char === ')' || char === ']') depth--
    else if (char === ',' && depth === 0) { selectors.push(list.slice(start, i).trim()); start = i + 1 }
  }
  selectors.push(list.slice(start).trim())
  return selectors.filter(Boolean)
}
