/**
 * The `wire:model` attribute of an element: its property and modifiers, or
 * null when the element has none.
 */
export function readModel(element) {
    for (const attribute of Array.from(element.attributes)) {
        if (attribute.name !== 'wire:model' && !attribute.name.startsWith('wire:model.')) {
            continue
        }

        const property = attribute.value.trim()

        if (property === '') {
            return null
        }

        return { property, modifiers: attribute.name.split('.').slice(1) }
    }

    return null
}
