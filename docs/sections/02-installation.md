## Installation

Install the package with Composer, keep jQuery and Select2 on the page, and load the scripts once.

### Requirements

- PHP 7.4 (Livewire 1 only installs on PHP 7)
- Laravel 7.30+ or 8.75+
- Livewire 1.3.0 to 1.3.9, except 1.3.7 (see [Compatibility](#compatibility))
- jQuery and Select2 4, loaded by your application
- A modern browser (ES2019); Internet Explorer is not supported

### Composer Installation

```bash title="Terminal" no-line-numbers
composer require pharaonic/livewire-select2
```

Composer also installs `pharaonic/livewire-assistant`. Laravel discovers both service providers automatically. There is nothing to publish and no configuration file.

:::warning Composer and unmaintained releases
Every Livewire 1 release, and every Laravel 7 and 8 release, has security advisories that no release in its major fixes. Recent Composer versions refuse to install or update them until you allow them. If you accept the risk, allow them in your application's `composer.json`:

```bash title="Terminal" no-line-numbers
composer config --json policy.advisories.ignore '{"livewire/livewire": "No fixed release within Livewire 1.", "laravel/framework": "No fixed release within this Laravel major.", "league/commonmark": "No fixed release within this Laravel major.", "league/flysystem": "No fixed release within this Laravel major."}'
```

Read [Compatibility](#compatibility) before accepting the risk.
:::

### Load the Scripts

Load jQuery and Select2 the way you already do, then add `@livewireSelect2Scripts` to your layout. It can go before or after `@livewireScripts`.

```blade title="resources/views/layouts/app.blade.php"
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    @livewireStyles
</head>
<body>
    {{ $slot }}

    @livewireScripts
    @livewireSelect2Scripts
</body>
```

The directive renders two `<script>` tags: the Livewire Assistant runtime and this integration. Each is rendered once per page, even when layouts, partials, and `@livewireAssistantScripts` ask for it again.

```html no-copy
<script src="https://example.com/pharaonic/livewire-assistant/assistant.js?id=3f9a1c2b7d4e5f60" data-turbolinks-eval="false"></script>
<script src="https://example.com/pharaonic/livewire-select2/select2.js?id=0d8eee40cb71f6d7" data-turbolinks-eval="false"></script>
```

jQuery and Select2 are read from `window.jQuery` when a select mounts, not when the script loads, so their order relative to the directive does not matter. If they are still missing when the page has finished loading, the select is reported as `mount-failed` with the `select2-missing` cause.

### Vite and Other Bundlers

When jQuery and Select2 come from npm, expose jQuery on `window` and attach Select2 to that same jQuery. The package never uses `$`, so you do not need a global `$`.

```js title="resources/js/app.js"
import jQuery from 'jquery'
import select2 from 'select2'

window.jQuery = jQuery
select2()
```

Keep `@livewireSelect2Scripts` in the layout, or import the ES modules instead (see below).

### Content Security Policy

Pass a nonce when your CSP uses one. Both tags get it, escaped.

```blade title="resources/views/layouts/app.blade.php"
@livewireSelect2Scripts(['nonce' => $cspNonce])
```

`nonce` is the only option. An unknown option or a non-string nonce throws an `InvalidArgumentException` while the view renders. The scripts never use `eval` or inline code.

### How the Script Is Served

| Route | Name |
| --- | --- |
| `GET /pharaonic/livewire-select2/select2.js` | `pharaonic.livewire-select2.script` |

The route serves `dist/livewire-select2.js` from the installed package, without session or cookies. The `id` query value is a hash of the file: a matching `id` is cached for a year, anything else is served with `no-cache`. After `composer update` the hash changes, so browsers fetch the new script on the next page load. Nothing needs publishing, and the route works with `php artisan route:cache`.

### ES Module

If you bundle your JavaScript, import the ES modules from the Composer packages instead of using the directive. Import the Assistant too: the integration registers with it but never loads it.

```js title="resources/js/app.js"
import jQuery from 'jquery'
import select2 from 'select2'
import '../../vendor/pharaonic/livewire-assistant/dist/livewire-assistant.esm.js'
import { define } from '../../vendor/pharaonic/livewire-select2/dist/livewire-select2.esm.js'

window.jQuery = jQuery
select2()
```

The ES module and the browser build share one integration per page, so loading both is harmless.

:::success Installation Complete
Mark a select with `data-pharaonic="select2"` and you are done. See [Basic Usage](#basic-usage).
:::
