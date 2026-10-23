import { createFunctions } from './functions.js'
import { installLegacy } from './legacy.js'
import { modelBinding } from './livewire.js'
import { createSelect2 } from './select2.js'

/**
 * One integration per page. The browser build and the ESM build both resolve
 * to the API stored on `window.Pharaonic.select2`, whichever loads first.
 * The Assistant runtime is never loaded here, only registered with.
 */
function install(win) {
    const namespace = (win.Pharaonic ??= {})

    if (namespace.select2) {
        return namespace.select2
    }

    const functions = createFunctions()
    let assistant = null
    const pending = []

    const withAssistant = (callback) => {
        if (assistant) {
            callback(assistant)
        } else {
            pending.push(callback)
        }
    }

    const integration = createSelect2({ window: win, functions, modelBinding, assistant: () => assistant })

    const api = Object.freeze({
        define: functions.define,
    })

    namespace.select2 = api
    installLegacy(win, namespace, withAssistant)

    const registerSelect2 = (runtime) => {
        assistant = runtime
        runtime.register('select2', integration)
        pending.splice(0).forEach((callback) => callback(runtime))
    }

    if (namespace.assistant) {
        registerSelect2(namespace.assistant)
    } else {
        (win.PharaonicAssistantQueue ??= []).push(registerSelect2)
    }

    return api
}

const api = install(window)

export const define = (name, callback) => api.define(name, callback)
