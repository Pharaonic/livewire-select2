## Upgrading from 1.2

Releases 1.0 to 1.2 supported Livewire 2. Their successor is this 2.x line. Your markup keeps working, attributes included.

### Install 2.x

A `^1.2` constraint never moves to 2.x, so require the new line:

```bash title="Terminal" no-line-numbers
composer require pharaonic/livewire-select2:^2.0
```

The requirements are higher than 1.2's:

| | 1.2 | 2.x |
| --- | --- | --- |
| PHP | 7.2+ | 8.0 to 8.3 |
| Livewire | 2.0+ | 2.12.7+ |
| Laravel | through Livewire | 7.30+, 8.75+, 9, 10 |

Composer also installs `pharaonic/livewire-assistant`.

### Scripts

Use the directive in new code:

```blade title="resources/views/layouts/app.blade.php"
{{-- 1.2 --}}
<x-pharaonic-select2::scripts />

{{-- 2.x --}}
@livewireSelect2Scripts
```

`<x-pharaonic-select2::scripts />` renders exactly the same tags, so you can switch whenever you like.

If you published `vendor/pharaonic/pharaonic.select2.min.js` and load it with your own `<script>` tag, switch to the directive now: the file needs the Livewire Assistant runtime, which the directive loads. Then delete the published file.

:::info Deprecated, not removed
The scripts component, the publish tag, and the old JavaScript functions still work on every 2.x release. New code should use their replacements. They will be removed no earlier than a future major line.
:::

### Attributes

| 1.2 | 2.x |
| --- | --- |
| `data-component-id="{{ $this->id }}"` | Optional: the closest component is used |
| `wire:model`, `wire:model.defer` | Unchanged |
| `data-tags`, `data-clear`, `data-search-off`, `data-parent` | Unchanged; `"false"` now turns one off, and `data-parent` without a value means the closest modal |
| `data-placeholder`, `data-language`, `data-dir` | Unchanged: Select2 reads them itself |

New: `data-options` for any other Select2 option, `data-template` and `Pharaonic.select2.define()` for templates, and `data-image` on options. See [Options](#options) and [Templates and Callbacks](#templates).

### Behaviour Changes

- Server-side changes to the property now show in the widget.
- Selects that Livewire adds later mount by themselves; you no longer need to dispatch `pharaonic.select2.init`.
- `wire:change` on the select now runs.
- A select without `wire:model` no longer throws.
- The script no longer needs a global `$`; it reads `window.jQuery`.
- A select without a `class` no longer gets `form-select`. Add the class yourself if your theme needs it.
- No placeholder is set unless you give one; 1.2 used "Select an option".
- Language and direction are no longer forced to `en` and `ltr`. Select2 takes them from the page (`lang` and `dir`) unless you set `data-language` or `data-dir`.

### JavaScript

`Pharaonic.Select2.init()`, `Pharaonic.Select2.load()`, and the `pharaonic.select2.init` and `pharaonic.select2.load` events still work: they call `Pharaonic.assistant.scan()`. In new code, call that directly for selects you add yourself.
