import { readModel } from './model.js'

const LIVE = ['live', 'lazy', 'change', 'blur']

/**
 * Livewire 3 semantics of `wire:model`.
 *
 * Plain `wire:model` is deferred until the next request. `.live` sends right
 * away, and so do `.lazy`, `.change`, and `.blur`, which Livewire 3 sends on
 * change or blur: a Select2 choice is that change, and Select2 never blurs
 * the native select. `.debounce` without `.live` stays deferred.
 */
export function modelBinding(element) {
    const model = readModel(element)

    return model === null ? null : { property: model.property, live: model.modifiers.some((modifier) => LIVE.includes(modifier)) }
}
