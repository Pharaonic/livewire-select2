/**
 * Deprecated aliases: `Pharaonic.Select2.init()` and `.load(element)`, and the
 * `pharaonic.select2.init` and `pharaonic.select2.load` window events. Livewire
 * Assistant mounts elements by itself, including the ones Livewire adds later.
 */
export function installLegacy(win, namespace, withAssistant) {
    const scan = (root) => withAssistant((assistant) => assistant.scan(root))

    namespace.Select2 = Object.freeze({
        init: () => scan(win.document),
        load: (element) => {
            const target = element && element.jquery ? element[0] : element

            scan(target || win.document)
        },
    })

    win.addEventListener('pharaonic.select2.init', () => scan(win.document))
    win.addEventListener('pharaonic.select2.load', (event) => namespace.Select2.load(event.detail && event.detail.target))
}
