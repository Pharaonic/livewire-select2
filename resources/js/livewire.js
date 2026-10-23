import { readModel } from './model.js'

/**
 * Livewire 1 semantics of `wire:model`.
 *
 * Every Livewire 1 model update is live: Livewire 1 has no deferred updates,
 * and `.lazy` and `.debounce` only change when the browser sends it.
 */
export function modelBinding(element) {
    const model = readModel(element)

    return model === null ? null : { property: model.property, live: true }
}
