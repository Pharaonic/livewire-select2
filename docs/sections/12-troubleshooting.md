## Troubleshooting

### Nothing happens and there is no widget

Check the console. `select2-missing` means jQuery or Select2 is not on `window.jQuery`: load them, or with a bundler set `window.jQuery` and call `select2()` (see [Installation](#installation)). Make sure `@livewireSelect2Scripts` is on the page.

### "$ is not a function"

The package never uses `$`; it reads `window.jQuery` when a select mounts. The error comes from code that expects a global `$`. With a bundler, set `window.jQuery` as shown in [Installation](#installation).

### The widget disappears or resets after a request

The select is outside `wire:ignore` and the package rebuilds it after each update, or Livewire replaced the block. Wrap the select in `wire:ignore` unless you want the server to change its options.

### New options from the server do not appear

Inside `wire:ignore`, Livewire never changes the select. Give the ignored block a `wire:key` that changes with the data, or remove `wire:ignore`. See [Dependent Selects](#dynamic-selects).

### My jQuery change handler runs twice

The select has `wire:change`. Select2 fires its own jQuery change event, and the package fires a native one so `wire:change` runs. Use `wire:change` or the `updated` hook instead of the jQuery handler, or remove `wire:change`.

### The value is a string, but my property is an integer

Select2 works with strings. Cast in the component, for example in an `updated` hook.

### The dropdown opens behind a modal, or its search field cannot take focus

Add `data-parent` to the select. It opens the dropdown in the closest `.modal`, `<dialog>`, or `[role="dialog"]`; give it a selector when the modal is something else.

### A select in a nested component updates the parent

Remove a `data-component-id` that names the parent, or leave the attribute out: the closest component is used.

### Composer refuses to install or update Laravel 7, 8, 9, or 10

Those releases have unfixed security advisories. See the warning in [Installation](#installation).
