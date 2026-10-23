<p align="center"><a href="https://pharaonic.dev/packages/livewire/select2" target="_blank"><img src="https://raw.githubusercontent.com/Pharaonic/livewire-select2/develop/docs/cover.webp" alt="Livewire Select2"></a></p>

<p align="center">
  <a href="https://php.net" target="_blank"><img src="https://img.shields.io/static/v1?label=PHP&message=7.4&color=blue&style=flat-square" alt="PHP Version : 7.4"></a>
  <a href="https://laravel.com" target="_blank"><img src="https://img.shields.io/static/v1?label=Laravel&message=7.x%20|%208.x&color=F05340&style=flat-square" alt="Laravel Version : 7.x | 8.x"></a>
  <a href="https://laravel-livewire.com" target="_blank"><img src="https://img.shields.io/static/v1?label=Livewire&message=1.x&color=fb70a9&style=flat-square" alt="Livewire Version : 1.x"></a>
  <img src="https://img.shields.io/static/v1?label=License&message=MIT&color=brightgreen&style=flat-square" alt="License">
  <img src="https://github.com/Pharaonic/livewire-select2/actions/workflows/build.yml/badge.svg?branch=1.x" alt="Build">
  <br>
  <a href="https://packagist.org/packages/Pharaonic/livewire-select2" target="_blank"><img src="https://img.shields.io/static/v1?label=Packagist&message=pharaonic/livewire-select2&color=blue&logo=packagist&logoColor=white" alt="Source"></a>
  <a href="https://packagist.org/packages/pharaonic/livewire-select2" target="_blank"><img src="https://poser.pugx.org/pharaonic/livewire-select2/v" alt="Packagist Version"></a>
  <a href="https://packagist.org/packages/pharaonic/livewire-select2" target="_blank"><img src="https://poser.pugx.org/pharaonic/livewire-select2/downloads" alt="Packagist Downloads"></a>
</p>

<h3 align="center">Select2 for Livewire components.</h3>
<h5 align="center">Two-way <code>wire:model</code> binding, dynamic and dependent selects, and templates, built on Livewire Assistant.</h5>
<br>

## Installation

```bash
composer require pharaonic/livewire-select2
```

Load jQuery and Select2 as usual, then add the scripts once in your layout, before or after `@livewireScripts`:

```blade
@livewireScripts
@livewireSelect2Scripts
```

No Node build is needed. The 1.x line supports Livewire 1 on Laravel 7.30+ and 8.75+ with PHP 7.4.

## Usage

```blade
<div wire:ignore>
    <select data-pharaonic="select2" wire:model="country" data-placeholder="Choose a country" data-clear>
        <option value=""></option>
        <option value="1">Egypt</option>
        <option value="2">Jordan</option>
    </select>
</div>
```

The select follows `country` both ways: picking an option updates the component, and setting the property on the server updates the widget. Shorthands such as `data-tags`, `data-clear`, `data-search-off`, and `data-parent` cover common options; `data-options` takes any other Select2 option as JSON.

## Documentation

Read the full [Livewire Select2 documentation](https://pharaonic.dev/packages/livewire/select2) for options, dependent selects, templates, and bundlers such as Vite.

## Support & Security

See [SUPPORT.md](SUPPORT.md) and [SECURITY.md](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE).
