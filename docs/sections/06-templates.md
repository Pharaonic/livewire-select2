## Templates and Callbacks

### Images Without JavaScript

Add `data-image` to an `<option>` to show an image before its text, in the dropdown and in the selection:

```blade
<div wire:ignore>
    <select data-pharaonic="select2" wire:model="country">
        @foreach ($countries as $country)
            <option value="{{ $country->id }}" data-image="{{ asset('flags/'.$country->code.'.svg') }}">{{ $country->name }}</option>
        @endforeach
    </select>
</div>
```

The image is 1.25em high, aligned with the text, and has the `pharaonic-select2-image` class for your own styling. Options without `data-image` show their text as usual. A select with its own `templateResult` or `templateSelection` uses those instead.

### Your Own Templates

Select2 options such as `templateResult` take functions. Define a function with a name, then use the name in `data-template` or `data-options`.

### define(name, callback)

```js title="resources/js/app.js"
Pharaonic.select2.define('flag', (state) => {
    if (!state.element) {
        return state.text
    }

    const span = document.createElement('span')

    span.textContent = `${state.element.dataset.flag} ${state.text}`

    return span
})
```

```blade title="resources/views/livewire/profile.blade.php"
<div wire:ignore>
    <select data-pharaonic="select2" wire:model="country" data-template="flag">
        <option value="eg" data-flag="🇪🇬">Egypt</option>
        <option value="jo" data-flag="🇯🇴">Jordan</option>
    </select>
</div>
```

`data-template` sets both `templateResult` and `templateSelection`. To use different functions, name them in `data-options`, which overrides `data-template`:

```blade
<select data-pharaonic="select2" wire:model="country" data-template="flag" data-options='{"templateSelection": "flagOnly"}'>
```

- A name starts with a letter or digit and continues with letters, digits, `.`, `:`, `_` or `-`. Anything else, or a callback that is not a function, throws an error with the code `invalid-function`.
- Defining the same function under the same name again does nothing. A different function under a taken name throws `function-conflict`.
- With a bundler, import `define` from the ES module instead of using `window.Pharaonic.select2`.

### Options That Accept a Name

| Option | Option |
| --- | --- |
| `templateResult` | `createTag` |
| `templateSelection` | `insertTag` |
| `matcher` | `tokenizer` |
| `sorter` | `ajax.data` |
| `escapeMarkup` | `ajax.processResults` |
| | `ajax.transport` |

Any other option keeps its JSON value. `ajax.url` stays a string.

### Load Order

Call `define` after `@livewireSelect2Scripts` has loaded, for example in a deferred or module script, or import it from the ES module. A select that uses a name that is not defined yet waits: a console warning names the function once, and the select mounts as soon as `define` is called.

With `wire:navigate`, Livewire runs every `<script>` in the new page's body again. A script that calls `define` again creates a new function under the same name, which throws `function-conflict`. Put such scripts in `<head>`, which Livewire merges instead of running again, give them `data-navigate-once`, or keep them in your bundle.

### Remote Data

```js title="resources/js/app.js"
Pharaonic.select2.define('countries', (data) => ({
    results: data.map((country) => ({ id: country.id, text: country.name })),
}))
```

```blade
<select data-pharaonic="select2" wire:model="country_id" data-options='{"ajax": {"url": "/api/countries", "dataType": "json", "processResults": "countries"}}'>
    @if ($country)
        <option value="{{ $country->id }}" selected>{{ $country->name }}</option>
    @endif
</select>
```

With remote data, Select2 can only show a value that has an `<option>`. Render the selected one in Blade, as above.

:::warning Build markup safely
Select2 escapes strings returned by templates. To render markup, return DOM nodes or a jQuery object built with `textContent` or `text()`, as in the examples. Never build HTML strings from option text or user data.
:::
