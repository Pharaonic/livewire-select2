# Changelog

All notable changes to this project are documented here.

## 2.0.1 - 2026-10-24

### Changed

- Documentation: keep labels and `@error` messages outside `wire:ignore`, which Livewire never updates; key rows by a stable id instead of their position; `data-theme` is listed among the Select2 attributes; and troubleshooting covers validation messages that do not show.

## 2.0.0 - 2026-10-24

The 2.x line for Livewire 2, and the successor of 1.2.0. A `^1.2` constraint never moves here: run `composer require pharaonic/livewire-select2:^2.0`. The documentation's upgrade guide lists every change.

### Added

- Built on `pharaonic/livewire-assistant`: selects are found, bound to their Livewire component, and cleaned up automatically, including selects Livewire adds later.
- Two-way binding: server-side changes to the property now update the widget.
- `wire:model` keeps Livewire 2's meaning: live by default, `.defer` with the next request. `data-property` binds without `wire:model`.
- `@livewireSelect2Scripts` Blade directive with an optional CSP nonce, rendering the Assistant runtime and the integration once per page.
- `pharaonic.livewire-select2.script` route serving the prebuilt script with content-hash cache busting.
- `data-tags`, `data-clear`, `data-search-off`, and `data-parent` accept `"false"` to turn the option off.
- `data-parent` without a value opens the dropdown in the closest modal or dialog (`.modal`, `<dialog>`, or `[role="dialog"]`).
- `data-options`: a JSON object passed to Select2, for options without a shorthand.
- `Pharaonic.select2.define(name, callback)`: named functions for function options such as `templateResult` and `templateSelection`. Selects wait until the names they use are defined.
- `data-template="name"`: one named function for both `templateResult` and `templateSelection`.
- `data-image` on an `<option>` shows an image before its text, without JavaScript.
- Tag values without a matching option get one, so they show on the first render.
- Selects outside `wire:ignore` are rebuilt after Livewire updates them, so options from the server show up.
- ES module build for bundlers such as Vite.

### Changed

- `data-component-id` is optional. Without it, or when it is empty, the select binds to the component around it.
- jQuery and Select2 are read from `window.jQuery` when a select mounts, not from `$` when the script loads.
- A select without a `class` no longer gets `form-select`.
- No placeholder is set unless you give one. With `data-clear` and no placeholder, an empty one is used so the clear button still works.
- Language and direction are no longer forced to `en` and `ltr`; Select2 takes them from the page unless `data-language` or `data-dir` is set.

### Deprecated

These keep working on every 2.x release.

- `<x-pharaonic-select2::scripts />`: use `@livewireSelect2Scripts`.
- The `livewire-select2` publish tag: the script is served by the package route.
- `Pharaonic.Select2.init()`, `Pharaonic.Select2.load()`, and the `pharaonic.select2.init` and `pharaonic.select2.load` events: call `Pharaonic.assistant.scan(element)` for selects you add outside a Livewire update.

### Fixed

- `wire:change` on the select runs after the new value is written; with `wire:model.defer`, its request carries the value.
- Selects that Livewire adds later, such as new rows, mount and bind.
- A select without `wire:model` no longer throws.
- Selects whose component cannot be found no longer fail silently. The Assistant reports them with the `pharaonic:assistant:error` event.

### Compatibility

- Livewire 2.12.7 or later, the first Livewire 2 release with the fix for CVE-2024-47823.
- Laravel 7.30+, 8.75+, 9, and 10, each on the PHP minors it supports, from PHP 8.0 to 8.3.
- jQuery and Select2 4 remain your application's dependencies.
- Laravel 7, 8, 9, and 10 no longer receive security fixes.

## 1.3.0 - 2026-10-23

The first release for Livewire 1. Releases 1.0.0 to 1.2.0 were built for Livewire 2, so Composer never installs 1.3.0 in a Livewire 2 application.

### Added

- Built on `pharaonic/livewire-assistant`: selects are found, bound to their Livewire component, and cleaned up automatically, including selects Livewire adds later.
- Two-way binding through `wire:model` or `data-property`: user choices update the property, and server-side changes update the widget.
- Each select binds to the component around it; `data-component-id` binds to a specific component, and an empty value means the closest one.
- `@livewireSelect2Scripts` Blade directive with an optional CSP nonce, rendering the Assistant runtime and the integration once per page.
- `pharaonic.livewire-select2.script` route serving the prebuilt script with content-hash cache busting.
- Shorthand attributes `data-tags`, `data-clear`, `data-search-off`, and `data-parent`, on when present and off with `"false"`.
- `data-parent` without a value opens the dropdown in the closest modal or dialog (`.modal`, `<dialog>`, or `[role="dialog"]`).
- `data-options`: a JSON object passed to Select2, for options without a shorthand.
- `Pharaonic.select2.define(name, callback)`: named functions for function options such as `templateResult` and `templateSelection`. Selects wait until the names they use are defined.
- `data-template="name"`: one named function for both `templateResult` and `templateSelection`.
- `data-image` on an `<option>` shows an image before its text, without JavaScript.
- `wire:change` on the select runs after the new value is written.
- Tag values without a matching option get one, so they show on the first render.
- Selects outside `wire:ignore` are rebuilt after Livewire updates them, so options from the server show up.
- jQuery and Select2 are read from `window.jQuery` when a select mounts; no global `$` is needed.
- ES module build for bundlers such as Vite.

### Deprecated

These aliases keep working on every 1.x release.

- `<x-pharaonic-select2::scripts />`: use `@livewireSelect2Scripts`.
- The `livewire-select2` publish tag: the script is served by the package route.
- `Pharaonic.Select2.init()`, `Pharaonic.Select2.load()`, and the `pharaonic.select2.init` and `pharaonic.select2.load` events: call `Pharaonic.assistant.scan(element)` for selects you add outside a Livewire update.

### Compatibility

- Livewire 1.3.0 to 1.3.9, except 1.3.7, which contains Livewire 2 code.
- Laravel 7.30+ and 8.75+.
- PHP 7.4, because every Livewire 1 release requires PHP 7.
- jQuery and Select2 4 remain your application's dependencies.
- Livewire 1, Laravel 7, and Laravel 8 no longer receive security fixes.
