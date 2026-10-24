## Basic Usage

A Select2 field is a normal `<select>` with `data-pharaonic="select2"` and `wire:model`, wrapped in `wire:ignore`.

### The Component

```php title="app/Livewire/Profile.php"
<?php

namespace App\Livewire;

use Livewire\Component;

class Profile extends Component
{
    public $country = '2';

    public $languages = ['ar'];

    public function render()
    {
        return view('livewire.profile');
    }
}
```

### The View

```blade title="resources/views/livewire/profile.blade.php"
<div>
    <div wire:ignore>
        <select data-pharaonic="select2" wire:model.live="country" data-placeholder="Choose a country" data-clear>
            <option value=""></option>
            <option value="1">Egypt</option>
            <option value="2">Jordan</option>
        </select>
    </div>

    <div wire:ignore>
        <select multiple data-pharaonic="select2" wire:model="languages">
            <option value="ar">Arabic</option>
            <option value="en">English</option>
        </select>
    </div>
</div>
```

That is all. The first select shows Jordan; picking Egypt sets `$country` to `"1"` right away; `$this->country = '2'` on the server selects Jordan again. The second select holds an array, sent with the component's next request, because plain `wire:model` is deferred on Livewire 4. See [Binding](#binding).

### Why wire:ignore

Livewire updates a component's HTML after each request to match the server. Select2 hides the `<select>` and adds its own markup next to it, which that update would remove. `wire:ignore` tells Livewire to leave the block alone, so the widget survives every request. The package keeps the value in sync through the component, not through the HTML.

A select can also live outside `wire:ignore`. The package then rebuilds the widget after each Livewire update, which is useful when the server changes its options. See [Dynamic Selects](#dynamic-selects).

### The Attributes

| Attribute | Purpose |
| --- | --- |
| `data-pharaonic="select2"` | Marks the element; required |
| `wire:model="property"` | The property to bind, with its modifiers |
| `data-property="property"` | The property to bind, when you do not use `wire:model` |
| `data-tags`, `data-clear`, `data-search-off`, `data-parent` | Shorthands for common Select2 options (see [Options](#options)) |
| `data-placeholder` and other Select2 `data-*` attributes | Read by Select2 itself |
| `data-options='{...}'` | A JSON object passed to Select2, for everything else |
| `data-component-id` | Optional: bind to a specific component instead of the one around the select (`$this->getId()` in a Livewire 4 view) |

Without `wire:model` or `data-property`, the select becomes a Select2 widget that is not bound to anything.

:::tip Placeholders need an empty option
Select2 shows the placeholder of a single select only when it has an empty `<option value="">`. Put one first.
:::

### Labels and Validation Messages

Livewire never updates anything inside `wire:ignore`, including an `@error` message placed there. Keep labels and messages outside the ignored block, so they update with the component:

```blade
<label for="country">Country</label>

<div wire:ignore>
    <select id="country" data-pharaonic="select2" wire:model.live="country">...</select>
</div>

@error('country') <span class="text-danger">{{ $message }}</span> @enderror
```
