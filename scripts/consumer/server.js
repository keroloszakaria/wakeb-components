import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import wakeb from './plugins/wakeb-components.js'
import { expected, render, rendered } from './app.js'

export const checks = rendered(wakeb.capabilities.components).map((name) => [name, expected[name]])
export const renderPage = () => renderToString(createSSRApp({ render: render(wakeb.capabilities.components) }).use(wakeb))
