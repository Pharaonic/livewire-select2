import { select2Error } from './functions.js'
import { buildOptions, withoutShorthandOverrides } from './options.js'

const NAMESPACE = '.pharaonicSelect2'

// Select2 reports '' or [] for "nothing selected"; Livewire may hold null.
function toWidget(value, multiple) {
    if (multiple) {
        return Array.isArray(value) ? value.map(String) : value === null || value === undefined || value === '' ? [] : [String(value)]
    }

    return value === null || value === undefined ? '' : String(value)
}

const same = (left, right) => JSON.stringify(left) === JSON.stringify(right)

const hasWireChange = (element) => Array.from(element.attributes).some((attribute) => attribute.name === 'wire:change' || attribute.name.startsWith('wire:change.'))

const hasSelect2 = (jQuery) => typeof jQuery === 'function' && typeof jQuery.fn === 'object' && typeof jQuery.fn.select2 === 'function'

/**
 * The `select2` integration for Livewire Assistant.
 *
 * - `window` is the page window; jQuery and Select2 are read from it at mount.
 * - `functions` resolves named functions in options.
 * - `modelBinding(element)` reads `wire:model` with the line's Livewire semantics.
 * - `assistant()` returns the runtime once it has registered this integration.
 */
export function createSelect2({ window, functions, modelBinding, assistant }) {
    const records = new WeakMap()
    // Elements waiting for named functions, or for jQuery and Select2 until the page has loaded.
    const waiting = new Map()
    const warned = new Set()

    const remount = (elements) => {
        const runtime = assistant()

        elements.forEach((element) => {
            runtime.destroy(element)
            runtime.scan(element)
        })
    }

    const wait = (element, names) => {
        names.forEach((name) => {
            if (!waiting.has(name)) {
                waiting.set(name, new Set())
            }

            waiting.get(name).add(element)
        })

        return () => names.forEach((name) => waiting.get(name)?.delete(element))
    }

    const release = (name) => {
        const elements = waiting.get(name)

        waiting.delete(name)

        if (elements && elements.size > 0) {
            remount([...elements])
        }
    }

    functions.onDefine((name) => release(`function:${name}`))

    const loaded = () => window.document.readyState === 'complete'

    if (!loaded()) {
        window.addEventListener('load', () => release('select2'), { once: true })
    }

    function create(element, options) {
        const jQuery = window.jQuery
        const $element = jQuery(element)

        withoutShorthandOverrides(element, () => $element.select2(options))

        const instance = $element.data('select2')

        // Outside wire:ignore, Livewire's morph rewrites the select and the Select2 markup.
        // Select2's own observer would react to the half-done morph and throw; update()
        // rebuilds the widget once the morph has finished instead.
        if (element.closest('[wire\\:ignore]') === null && instance && instance._observer) {
            instance._observer.disconnect()
        }

        return { $element, instance }
    }

    // Morphing a select outside wire:ignore removes the attributes and markup Select2 added.
    function isIntact(widget) {
        const element = widget.$element[0]
        const container = widget.instance && widget.instance.$container ? widget.instance.$container[0] : null

        return container !== null && container.isConnected && element.classList.contains('select2-hidden-accessible')
    }

    function teardown(widget) {
        if (widget.instance && widget.instance.$element) {
            widget.instance.destroy()
        }
    }

    function mount(context) {
        const { element, property, component } = context

        if (!hasSelect2(window.jQuery)) {
            if (!loaded()) {
                return wait(element, ['select2'])
            }

            throw select2Error('select2-missing', 'Select2 needs jQuery with the Select2 plugin on window.jQuery. Load both before the page finishes loading.')
        }

        const { options, missing } = buildOptions({ element, options: context.options, functions, jQuery: window.jQuery })

        if (missing.length > 0) {
            missing.filter((name) => !warned.has(name)).forEach((name) => {
                warned.add(name)
                window.console.warn(`Select2 function "${name}" is not defined yet. Its elements mount once Pharaonic.select2.define("${name}", ...) is called.`)
            })

            return wait(element, missing.map((name) => `function:${name}`))
        }

        const multiple = element.multiple
        const tags = Boolean(options.tags)
        const binding = property !== null ? { property, live: true } : modelBinding(element)
        let widget = create(element, options)

        // Tags may hold values the markup has no option for; Select2 can only select options.
        const addMissing = (values) => {
            const present = new Set(Array.from(element.options, (option) => option.value))

            ;(Array.isArray(values) ? values : [values]).filter((value) => value !== '' && !present.has(value)).forEach((value) => {
                element.appendChild(new window.Option(value, value, false, false))
            })
        }

        const apply = (value) => {
            const next = toWidget(value, multiple)

            if (tags) {
                addMissing(next)
            }

            // Only Select2's namespace is notified, so the handler that writes to Livewire stays silent.
            widget.$element.val(next).trigger('change.select2')
        }

        const sync = () => {
            if (binding !== null) {
                apply(component.get(binding.property))
            }
        }

        // Returns the request that carries a changed value, or null when Livewire already holds it.
        const write = () => {
            const value = toWidget(widget.$element.val(), multiple)

            if (same(value, toWidget(component.get(binding.property), multiple))) {
                return null
            }

            return component.set(binding.property, value, { live: binding.live })
        }

        let notifying = false

        // Select2 never fires the native change event, so wire:change would never run.
        // It gets one once the value is written, and our own handler ignores it.
        const notify = () => {
            if (!hasWireChange(element)) {
                return
            }

            notifying = true

            try {
                element.dispatchEvent(new window.Event('change', { bubbles: true }))
            } finally {
                notifying = false
            }
        }

        widget.$element.on(`change${NAMESPACE}`, () => {
            if (notifying) {
                return
            }

            const written = binding === null ? Promise.resolve() : write()

            if (written === null) {
                return
            }

            const failed = (error) => window.console.error(`Select2 could not update "${binding.property}".`, error)

            if (binding !== null && !binding.live) {
                // A deferred write settles with the next request, which wire:change is about to send.
                written.catch(failed)
                notify()
            } else {
                written.then(notify, failed)
            }
        })

        if (binding !== null) {
            sync()
            component.watch(binding.property, apply)
        }

        records.set(element, {
            refresh() {
                if (!isIntact(widget)) {
                    teardown(widget)
                    widget = create(element, options)
                }

                sync()
            },
        })

        return () => {
            records.delete(element)
            // Remove only our handlers, then restore the native <select>.
            widget.$element.off(NAMESPACE)
            teardown(widget)
        }
    }

    return {
        mount,

        // Livewire changed an element outside wire:ignore: rebuild what the morph removed.
        update({ element }) {
            const record = records.get(element)

            if (record) {
                record.refresh()
            }
        },
    }
}
