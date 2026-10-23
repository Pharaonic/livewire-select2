/**
 * Select2 options whose value is a function. Markup names a function defined
 * with `define()` instead of embedding code, e.g. `{"templateResult": "flag"}`.
 */
export const FUNCTION_OPTIONS = Object.freeze([
    'templateResult',
    'templateSelection',
    'matcher',
    'sorter',
    'escapeMarkup',
    'createTag',
    'insertTag',
    'tokenizer',
    'ajax.data',
    'ajax.processResults',
    'ajax.transport',
])

const NAME = /^[A-Za-z0-9][A-Za-z0-9.:_-]*$/

export function select2Error(code, message) {
    return Object.assign(new Error(message), { code })
}

/**
 * Named functions for Select2 options. Names are defined once; elements that
 * wait for a name are told through `onDefine`.
 */
export function createFunctions() {
    const functions = new Map()
    const listeners = new Set()

    return {
        define(name, callback) {
            const key = typeof name === 'string' ? name.trim() : ''

            if (!NAME.test(key)) {
                throw select2Error('invalid-function', 'A Select2 function name starts with a letter or digit and continues with letters, digits, ".", ":", "_" or "-".')
            }

            if (typeof callback !== 'function') {
                throw select2Error('invalid-function', `The Select2 function "${key}" must be a function.`)
            }

            const current = functions.get(key)

            if (current === callback) {
                return
            }

            if (current !== undefined) {
                throw select2Error('function-conflict', `The Select2 function "${key}" is already defined.`)
            }

            functions.set(key, callback)
            listeners.forEach((listener) => listener(key))
        },

        get: (name) => functions.get(name),

        onDefine(listener) {
            listeners.add(listener)

            return () => listeners.delete(listener)
        },
    }
}
