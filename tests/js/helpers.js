import { readFileSync } from 'node:fs'
import { Window } from 'happy-dom'
import { createFunctions } from '../../resources/js/functions.js'
import { createSelect2 } from '../../resources/js/select2.js'

const root = new URL('../../', import.meta.url)
const source = (path) => readFileSync(new URL(path, root), 'utf8')
const jquery = source('node_modules/jquery/dist/jquery.min.js')
const select2 = source('node_modules/select2/dist/js/select2.min.js')

/**
 * A component with client state, writes recorded in `writes`, and watchers
 * that a test fires through `serverSets`.
 */
export function component(data = {}) {
    const watchers = []

    return {
        data,
        writes: [],
        watchers,
        get: (path) => path.split('.').reduce((carry, key) => (carry == null ? undefined : carry[key]), data),
        set(path, value, options) {
            this.writes.push([path, value, options])

            return Promise.resolve()
        },
        watch(path, callback) {
            watchers.push({ path, callback })

            return () => {}
        },
        serverSets(path, value) {
            data[path] = value
            watchers.filter((watcher) => watcher.path === path).forEach((watcher) => watcher.callback(value))
        },
    }
}

/**
 * A page with real jQuery and Select2 (unless `withSelect2` is false) and the
 * integration created against a recording assistant.
 *
 * happy-dom does not match selected options with `:selected` or `:checked`,
 * which Select2 and jQuery use to read multiple selections and labels; the
 * browser suite covers those.
 */
export function setup(html, { withSelect2 = true, modelBinding = () => null, readyState = 'complete' } = {}) {
    const win = new Window({ url: 'https://example.test/' })
    const warnings = []
    const assistantCalls = []

    win.console.warn = (message) => warnings.push(message)
    win.console.error = () => {}
    win.document.body.innerHTML = html

    if (withSelect2) {
        win.eval(jquery)
        win.eval(select2)
    }

    Object.defineProperty(win.document, 'readyState', { configurable: true, get: () => readyState })

    const functions = createFunctions()
    const assistant = {
        destroy: (element) => assistantCalls.push(['destroy', element]),
        scan: (element) => assistantCalls.push(['scan', element]),
    }
    const integration = createSelect2({ window: win, functions, modelBinding, assistant: () => assistant })

    const mount = (selector, { property = null, options = {}, bound = component() } = {}) => {
        const element = win.document.querySelector(selector)
        const cleanup = integration.mount({ element, property, options, component: bound, onCleanup() {} })

        return { element, cleanup, component: bound, $: win.jQuery ? win.jQuery(element) : null }
    }

    return {
        win,
        document: win.document,
        functions,
        integration,
        mount,
        warnings,
        assistantCalls,
        loadSelect2() {
            win.eval(jquery)
            win.eval(select2)
        },
    }
}
