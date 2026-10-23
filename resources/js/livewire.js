import { readModel } from './model.js'

/**
 * Livewire 2 semantics of `wire:model`.
 *
 * `.defer` holds the update until the next request; every other form is live.
 * `.lazy` and `.debounce` only change when the browser sends it.
 */
export function modelBinding(element) {
    const model = readModel(element)

    return model === null ? null : { property: model.property, live: !model.modifiers.includes('defer') }
}
