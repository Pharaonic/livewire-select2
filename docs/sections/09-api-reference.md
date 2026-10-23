## API Reference

### Markup

| Attribute | Value |
| --- | --- |
| `data-pharaonic` | `select2` |
| `wire:model` | Property name or dot path; modifiers accepted |
| `data-property` | Property name or dot path; wins over `wire:model` |
| `data-tags` | `tags: true`; `"false"` turns it off |
| `data-clear` | `allowClear: true`, with an empty placeholder when none is set; `"false"` turns it off |
| `data-search-off` | `minimumResultsForSearch: -1`; `"false"` turns it off |
| `data-parent` | `dropdownParent` from a CSS selector; without a value, the closest `.modal`, `<dialog>`, or `[role="dialog"]` |
| `data-template` | Named function for `templateResult` and `templateSelection` |
| `wire:change` | Runs after the new value is written |
| `data-options` | JSON object passed to Select2; overrides the shorthands |
| `data-component-id` | Component id; empty or absent means the closest component |

On `<option>`:

| Attribute | Value |
| --- | --- |
| `data-image` | Image URL shown before the option text |

### Browser API

Available as `window.Pharaonic.select2` and as named exports of `dist/livewire-select2.esm.js`.

| Method | Description | Returns |
| --- | --- | --- |
| `define(name, callback)` | Names a function for function options in `data-options` | `undefined` |

Deprecated aliases, on `window.Pharaonic.Select2`:

| Method | Description |
| --- | --- |
| `init()` | Calls `Pharaonic.assistant.scan(document)` |
| `load(element)` | Calls `Pharaonic.assistant.scan(element)`; accepts an element or a jQuery object |

### Events

| Event | Direction | Purpose |
| --- | --- | --- |
| `pharaonic:assistant:error` | dispatched on `window` | Failures while mounting, updating, or cleaning up (see the Livewire Assistant diagnostics) |
| `pharaonic.select2.init` | listened on `window` | Deprecated: scans the document |
| `pharaonic.select2.load` | listened on `window` | Deprecated: scans `event.detail.target` |

### Error Codes

| Code | Raised when | Channel |
| --- | --- | --- |
| `invalid-function` | `define()` got an invalid name or a callback that is not a function | thrown |
| `function-conflict` | `define()` got a different function for a taken name | thrown |
| `select2-missing` | jQuery or Select2 is not on `window.jQuery` once the page has loaded | cause of `mount-failed` |

### Laravel

| Name | Purpose |
| --- | --- |
| `@livewireSelect2Scripts` / `@livewireSelect2Scripts(['nonce' => $nonce])` | Renders the Assistant runtime and the integration once per page |
| `pharaonic.livewire-select2.script` | Route name of `GET /pharaonic/livewire-select2/select2.js` |
| `Pharaonic\Livewire\Select2\Select2ServiceProvider` | Auto-discovered service provider |
| `<x-pharaonic-select2::scripts />` | Deprecated: renders `@livewireSelect2Scripts` |
| `livewire-select2` publish tag | Deprecated: copies the script to `public/vendor/pharaonic/pharaonic.select2.min.js` |
