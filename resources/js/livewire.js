import { readModel } from './model.js'

/**
 * Livewire 4 semantics of `wire:model`.
 *
 * Plain `wire:model` is deferred until the next request. Only `.live`, and
 * `.lazy` without `.live`, send a request; `.change` and `.blur` on their own
 * only decide when the client-side value updates, so they stay deferred.
 * Combined with `.live` (`.live.blur`), the choice is sent right away.
 */
export function modelBinding(element) {
    const model = readModel(element)

    return model === null ? null : { property: model.property, live: model.modifiers.includes('live') || model.modifiers.includes('lazy') }
}
