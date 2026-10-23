import { FUNCTION_OPTIONS } from './functions.js'

// A shorthand is on when present, unless its value is "false".
const enabled = (value) => value.toLowerCase() !== 'false'

// `data-parent` without a value opens the dropdown in the closest modal or dialog.
const DIALOG = '.modal, dialog, [role="dialog"]'
const NEAREST_DIALOG = Symbol('nearest dialog')

/**
 * Shorthand attributes for the most common Select2 options. Select2 reads its
 * own `data-*` attributes as raw strings, so an empty `data-tags` would mean
 * off; these read presence as on.
 */
const SHORTHANDS = {
    'data-tags': (options, value) => {
        options.tags = enabled(value)
    },
    'data-clear': (options, value) => {
        options.allowClear = enabled(value)
    },
    'data-search-off': (options, value) => {
        if (enabled(value)) {
            options.minimumResultsForSearch = -1
        }
    },
    'data-parent': (options, value) => {
        if (value === '') {
            options.dropdownParent = NEAREST_DIALOG
        } else if (enabled(value)) {
            options.dropdownParent = value
        }
    },
    'data-template': (options, value) => {
        if (value !== '') {
            options.templateResult = value
            options.templateSelection = value
        }
    },
}

/**
 * The default template: an option's `data-image` is shown before its text.
 * Built with DOM nodes, so neither the URL nor the text is parsed as markup.
 */
export function withImage(state) {
    const element = state.element
    const source = element && typeof element.getAttribute === 'function' ? element.getAttribute('data-image') : null

    if (!source) {
        return state.text
    }

    const document = element.ownerDocument
    const wrapper = document.createElement('span')
    const image = document.createElement('img')

    image.src = source
    image.alt = ''
    image.className = 'pharaonic-select2-image'
    Object.assign(image.style, { height: '1.25em', verticalAlign: 'middle', marginInlineEnd: '0.4em' })
    wrapper.append(image, document.createTextNode(state.text))

    return wrapper
}

const copy = (value) => (value === undefined ? {} : JSON.parse(JSON.stringify(value)))

function walk(options, path) {
    const keys = path.split('.')
    const last = keys.pop()
    const parent = keys.reduce((carry, key) => (carry !== null && typeof carry === 'object' ? carry[key] : undefined), options)

    return parent !== null && typeof parent === 'object' ? { parent, key: last } : null
}

/**
 * Build the Select2 configuration of an element: shorthand attributes first, then
 * `data-options`, then named functions, the dropdown parent, and the default
 * image templates are resolved.
 * Returns the names that are not defined yet in `missing`.
 */
export function buildOptions({ element, options, functions, jQuery }) {
    const result = {}

    for (const [attribute, apply] of Object.entries(SHORTHANDS)) {
        if (element.hasAttribute(attribute)) {
            apply(result, element.getAttribute(attribute).trim())
        }
    }

    Object.assign(result, copy(options))

    const missing = []

    for (const path of FUNCTION_OPTIONS) {
        const slot = walk(result, path)

        if (slot === null || typeof slot.parent[slot.key] !== 'string') {
            continue
        }

        const name = slot.parent[slot.key].trim()
        const callback = functions.get(name)

        if (callback === undefined) {
            missing.push(name)
        } else {
            slot.parent[slot.key] = callback
        }
    }

    if (result.dropdownParent === NEAREST_DIALOG) {
        const dialog = element.closest(DIALOG)

        if (dialog !== null) {
            result.dropdownParent = jQuery(dialog)
        } else {
            delete result.dropdownParent
        }
    } else if (typeof result.dropdownParent === 'string') {
        const parent = result.dropdownParent.trim() === '' ? jQuery() : jQuery(result.dropdownParent)

        if (parent.length > 0) {
            result.dropdownParent = parent.first()
        } else {
            delete result.dropdownParent
        }
    }

    for (const key of ['templateResult', 'templateSelection']) {
        if (result[key] === undefined) {
            result[key] = withImage
        }
    }

    // Select2 only shows the clear button with a placeholder; an empty one adds no text.
    if (result.allowClear && (result.placeholder === undefined || result.placeholder === null)) {
        result.placeholder = ''
    }

    return { options: result, missing: [...new Set(missing)] }
}

/**
 * Select2 lets its own `data-*` attributes override the options it is given,
 * reading them as raw strings. `data-tags` is also a Select2 key, where "" is
 * off and "false" is on, so it is hidden while Select2 reads its options.
 */
export function withoutShorthandOverrides(element, callback) {
    const hidden = []

    if (element.hasAttribute('data-tags')) {
        hidden.push(['data-tags', element.getAttribute('data-tags')])
        element.removeAttribute('data-tags')
    }

    try {
        return callback()
    } finally {
        hidden.forEach(([name, value]) => element.setAttribute(name, value))
    }
}
