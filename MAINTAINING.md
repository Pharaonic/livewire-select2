# Maintaining This Package

This file records package-specific maintainer facts that are safe to keep in the public repository.

## Purpose

Select2 for Livewire components. The package is the `select2` integration of `pharaonic/livewire-assistant`: the Assistant finds `data-pharaonic="select2"` elements, resolves their component, and runs the lifecycle; this package creates the widget, binds it to `wire:model` or `data-property` in both directions, and rebuilds it after Livewire morphs it.

## Supported lines

One line per Livewire major, each on the Assistant line of the same major. `develop` follows the newest line.

| Line | Livewire | Livewire Assistant | Laravel | PHP |
| --- | --- | --- | --- | --- |
| 1.x | `>=1.3.0 <1.3.7 \|\| >=1.3.8 <2.0` | `^1.0` | `^7.30 \|\| ^8.75` | `>=7.4 <8.0` |
| 2.x | `^2.12.7` | `^2.0` | `^7.30 \|\| ^8.75 \|\| ^9.0 \|\| ^10.0` | `>=8.0 <8.4` |

Versions are `N.minor.patch`, where `N` is the Livewire major. Releases 1.0.0 to 1.2.0 predate this scheme and were built for Livewire 2; the 1.x line continues at 1.3.0 for Livewire 1, and 2.x is their successor.

## Core library

`pharaonic/livewire-assistant`. Everything about discovery, component resolution, the bridge, cleanup, and diagnostics belongs there; fix it there, not here.

## Public API invariants

- Blade directive `@livewireSelect2Scripts` and its `nonce` option.
- Route `GET /pharaonic/livewire-select2/select2.js`, named `pharaonic.livewire-select2.script`.
- The `select2` integration name, `data-property`, and the `wire:model` modifiers each line documents.
- The shorthand attributes `data-tags`, `data-clear`, `data-search-off`, `data-parent` (on when present, off with `"false"`; `data-parent` without a value means the closest `.modal`, `<dialog>`, or `[role="dialog"]`), and `data-template`, plus `data-options`, which overrides them.
- `data-image` on `<option>` and the `pharaonic-select2-image` class, through the default templates.
- A select with `wire:change` gets a native `change` event after its value is written.
- `window.Pharaonic.select2.define()`, the ESM `define` export, the named-function option list, and the error codes `invalid-function`, `function-conflict`, and `select2-missing`.
- Deprecated, kept for the whole line: `<x-pharaonic-select2::scripts />`, the `livewire-select2` publish tag, `Pharaonic.Select2.init()`/`.load()`, and the `pharaonic.select2.init`/`pharaonic.select2.load` events.

## Package-specific constraints

- Only `resources/js/livewire.js` differs between lines: it maps `wire:model` modifiers to live or deferred writes with the line's Livewire semantics. Everything else talks to Livewire through the Assistant bridge, so fixes port between lines unchanged.
- `dist/` is committed so Composer users need no Node build. Run `npm run build` after any change under `resources/js/` and commit the result; CI fails when `dist/` is out of date.
- Shorthands exist only where Select2's own `data-*` attributes fall short: Select2 reads them as raw strings (`""` is false, `"false"` is true) and cannot take a selector for `dropdownParent`. Options Select2 reads correctly from `data-*` get no shorthand. Select2 also lets its `data-*` attributes override constructor options, so `data-tags`, which is a Select2 key too, is hidden while Select2 reads its options.
- 1.x: every genuine Livewire 1 release requires PHP 7, so the line runs on PHP 7.4. Pint lives in `tools/pint` and runs on PHP 8.1. `livewire/livewire` 1.3.7 contains Livewire 2 code and is excluded. The advisory ignore list adds Livewire 1 (CVE-2024-47823 has no Livewire 1 fix) and `zbateson/mail-mime-parser`.
- Outside `wire:ignore`, Select2's own `MutationObserver` is disconnected: on Livewire 2 it reacts to the half-done morph and throws, and `update()` rebuilds the widget after the morph anyway.
- 2.x: Livewire 2 supports Laravel 7 to 10, so one line covers four Laravel majors, each on the PHP minors it supports (8.0 to 8.3). `^2.12.7` keeps every Livewire release with CVE-2024-47823 out. `.defer` writes are deferred through the bridge; they settle only with the next request, so `wire:change` is fired right away instead of after the write. `composer check`, including Pint, runs on PHP 8.0 with the highest dependencies, which resolve Laravel 9.
- The advisory ignore list covers the Laravel framework tree of the line, which no longer receives security fixes, following the Laravel DNA.

## Verification

```bash
php8.0 composer check     # 2.x
php7.4 composer check     # 1.x, then: php8.1 tools/pint/vendor/bin/pint --test
npm ci
npm run check            # lint, unit tests, dist check, browser tests
```

Browser tests start `php -S` on the fixture app in `tests/Browser` with real Livewire components, the real Assistant runtime from `vendor/`, and jQuery and Select2 from `node_modules/`. They use the lowest PHP of the line (`php7.4` on 1.x, `php8.0` on 2.x) unless `FIXTURE_PHP` names another PHP of the line. Set `BROWSERS=chromium,firefox,webkit` to choose browsers. Each open issue the line fixes has a browser test named after it. Run them for every Laravel major with lowest and highest dependencies, for example:

```bash
php7.4 composer update --with laravel/framework:^7.30 --with orchestra/testbench:^5.20 --prefer-lowest
```

## Branch notes

`main` holds the 1.0 to 1.2 releases, which were built for Livewire 2, and is not developed further. The 1.x line was started from it for Livewire 1, and 2.x from 1.x for Livewire 2. `develop` follows the newest line.

## Documentation

https://pharaonic.dev/packages/livewire/select2

Keep this file factual and package-specific. General Pharaonic engineering policy belongs in the private engineering repository, not here.
