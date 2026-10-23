## Options

There are three ways to configure Select2, from the simplest:

1. the package's shorthand attributes, for the most common options;
2. Select2's own `data-*` attributes;
3. `data-options`, a JSON object, for everything else.

### Shorthand Attributes

```blade
<select data-pharaonic="select2" wire:model="country" data-placeholder="Choose a country" data-clear data-search-off>
```

| Attribute | Select2 option |
| --- | --- |
| `data-tags` | `tags: true`: users can type new values |
| `data-clear` | `allowClear: true`: shows a clear button |
| `data-search-off` | `minimumResultsForSearch: -1`: hides the search field |
| `data-parent="#selector"` | `dropdownParent`: opens the dropdown inside that element |
| `data-parent` (no value) | `dropdownParent`: the closest modal or dialog |
| `data-template="name"` | `templateResult` and `templateSelection`: a function defined with `define()` (see [Templates and Callbacks](#templates)) |

A shorthand is on when the attribute is present, with or without a value. `data-clear="false"` turns it off, which helps when Blade decides: `data-clear="{{ $nullable ? 'true' : 'false' }}"`.

Select2 shows the clear button only when there is a placeholder. When you turn `data-clear` on without a placeholder, the package sets an empty one, so the button appears without adding text.

Use `data-parent` for selects inside modals, so the dropdown opens inside the modal and its search field can take focus. Without a value, it picks the closest `.modal` (Bootstrap), `<dialog>`, or `[role="dialog"]`:

```blade
<div class="modal" id="edit-modal">
    <div wire:ignore>
        <select data-pharaonic="select2" wire:model="type" data-parent>...</select>
    </div>
</div>
```

With a CSS selector, it uses that element instead: `data-parent="#edit-modal"`. When nothing matches, the dropdown opens in `body` as usual.

### Select2's Own data-* Attributes

Select2 reads any option from a `data-*` attribute, with the option name in kebab case. These need no help from the package:

| Attribute | Select2 option |
| --- | --- |
| `data-placeholder="Choose"` | `placeholder` |
| `data-width="100%"` | `width` |
| `data-language="ar"` | `language` |
| `data-dir="rtl"` | `dir` |
| `data-minimum-input-length="2"` | `minimumInputLength` |
| `data-maximum-selection-length="3"` | `maximumSelectionLength` |
| `data-ajax--url="/api/countries"` | `ajax.url` |

:::warning Booleans in Select2's attributes
Select2 reads its `data-*` attributes as plain strings, so any non-empty value counts as true: `data-close-on-select="false"` keeps closing the dropdown. Set booleans that have no shorthand in `data-options`.
:::

### data-options

Anything else goes in `data-options` as a JSON object:

```blade
<select data-pharaonic="select2" wire:model="labels" multiple data-options='{"closeOnSelect": false, "tokenSeparators": [","]}'>
```

Use single quotes around the attribute so the JSON can use double quotes. In Blade you can build it from PHP:

```blade
<select data-pharaonic="select2" wire:model="country" data-options='@json(["placeholder" => __("Choose a country"), "allowClear" => true])'>
```

`data-options` can also hold `dropdownParent` as a selector. Invalid JSON, or JSON that is not an object, is reported as `invalid-options` and the select is not mounted.

### Which Wins

`data-options` overrides the shorthand attributes. Select2's own `data-*` attributes override both, because Select2 applies them last. Set each option in one place.

### Functions in Options

Some Select2 options are JavaScript functions, which attributes cannot hold. Define the function once in JavaScript and use its name in `data-options`. See [Templates and Callbacks](#templates).

### Changing Options

Inside `wire:ignore`, Livewire never changes the select, so new attributes from the server are not applied. To change options or the list of `<option>` elements, let Livewire replace the block with a new `wire:key`. See [Dynamic Selects](#dynamic-selects).
