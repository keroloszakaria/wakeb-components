// @vitest-environment node
import { expect, it } from 'vitest'
import { splitSelectorList } from '../scripts/css-selectors.mjs'

it('keeps Vite 8 RTL language fallbacks inside their scoped selector', () => {
  const rtl = '.wakeb-sc-menu:where(:lang(ae),:lang(ar),:lang(arc),:lang(ur))'
  expect(splitSelectorList(`${rtl}, .wakeb-sc-menu[dir="rtl"]`)).toEqual([rtl, '.wakeb-sc-menu[dir="rtl"]'])
})

it('preserves nested functions, quoted attribute values and escaped commas', () => {
  const selector = '.wakeb\\,name:is([data-label="a,b"], :not(.a, .b))'
  expect(splitSelectorList(`${selector}, [data-wakeb-theme]`)).toEqual([selector, '[data-wakeb-theme]'])
})

it('still exposes leaked global selectors after a functional selector', () => {
  const selectors = splitSelectorList('.wakeb-sc-menu:where(:lang(ar),:lang(he)), body, :root')
  expect(selectors.filter(selector => !/^([a-z][\w-]*)?[.[]/.test(selector))).toEqual(['body', ':root'])
})
