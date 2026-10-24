## Upgrading from 1.2

Releases 1.0 to 1.2 were built for Livewire 2. On Livewire 4, this 4.x line replaces them. Your markup keeps working, with two Livewire 4 changes below.

### Install 4.x

A `^1.2` constraint never moves to 4.x, so require the new line:

```bash title="Terminal" no-line-numbers
composer require pharaonic/livewire-select2:^4.0
```

| | 1.2 | 4.x |
| --- | --- | --- |
| PHP | 7.2+ | 8.1 to 8.5 |
| Livewire | 2.0+ | 4.3.4+ |
| Laravel | through Livewire | 10.16+, 11, 12, 13 |

Composer also installs `pharaonic/livewire-assistant`.

### Two Livewire 4 Changes

**`$this->id` fails on Livewire 4.** Livewire 4 components have no `id` property, so `data-component-id="{{ $this->id }}"` throws "Property [$id] not found on component" and the page fails. Remove the attribute, because each select binds to the component around it, or write `{{ $this->getId() }}`.

**Plain `wire:model` is deferred.** On Livewire 4, `wire:model` sends the choice with the component's next request, and `wire:model.live` sends it right away. Add `.live` where the server must react at once, such as a select that loads dependent options. `wire:model.defer` is not a Livewire 4 modifier; it behaves like plain `wire:model`.

### Scripts

Use the directive in new code:

```blade title="resources/views/layouts/app.blade.php"
{{-- 1.2 --}}
<x-pharaonic-select2::scripts />

{{-- 4.x --}}
@livewireSelect2Scripts
```

`<x-pharaonic-select2::scripts />` renders exactly the same tags, so you can switch whenever you like.

If you published `vendor/pharaonic/pharaonic.select2.min.js` and load it with your own `<script>` tag, switch to the directive now: the file needs the Livewire Assistant runtime, which the directive loads. Then delete the published file.

:::info Deprecated, not removed
The scripts component, the publish tag, and the old JavaScript functions still work on every 4.x release. New code should use their replacements. They will be removed no earlier than a future major line.
:::

### Attributes

| 1.2 | 4.x |
| --- | --- |
| `data-component-id="{{ $this->id }}"` | Optional; `{{ $this->getId() }}` when you need it |
| `wire:model` | Deferred on Livewire 4; `wire:model.live` sends right away |
| `data-tags`, `data-clear`, `data-search-off`, `data-parent` | Unchanged; `"false"` now turns one off, and `data-parent` without a value means the closest modal |
| `data-placeholder`, `data-language`, `data-dir` | Unchanged: Select2 reads them itself |

New: `data-options` for any other Select2 option, `data-template` and `Pharaonic.select2.define()` for templates, and `data-image` on options. See [Options](#options) and [Templates and Callbacks](#templates).

### Behaviour Changes

- Server-side changes to the property now show in the widget.
- Selects that Livewire adds later mount by themselves; you no longer need to dispatch `pharaonic.select2.init`.
- `wire:change` on the select now runs.
- A select without `wire:model` no longer throws.
- Widgets work across `wire:navigate` visits.
- The script no longer needs a global `$`; it reads `window.jQuery`.
- A select without a `class` no longer gets `form-select`. Add the class yourself if your theme needs it.
- No placeholder is set unless you give one; 1.2 used "Select an option".
- Language and direction are no longer forced to `en` and `ltr`. Select2 takes them from the page (`lang` and `dir`) unless you set `data-language` or `data-dir`.

### JavaScript

`Pharaonic.Select2.init()`, `Pharaonic.Select2.load()`, and the `pharaonic.select2.init` and `pharaonic.select2.load` events still work: they call `Pharaonic.assistant.scan()`. In new code, call that directly for selects you add yourself.
