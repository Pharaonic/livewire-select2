## Compatibility

Every combination below installs with Composer and passes PHPStan and the PHP suite with lowest and highest dependencies. The real-browser suite (real Livewire 4 components, the real Livewire Assistant runtime, jQuery, and Select2, driven in real browsers) runs on the lowest PHP of each Laravel version, with lowest and highest dependencies.

| Line | Livewire | Laravel | PHP | Browsers |
| --- | --- | --- | --- | --- |
| 4.x | 4.3.4+ | 10.16+ | 8.1, 8.2, 8.3 | Chromium, Firefox, WebKit |
| 4.x | 4.3.4+ | 11 | 8.2, 8.3, 8.4 | Chromium, Firefox, WebKit |
| 4.x | 4.3.4+ | 12 | 8.2, 8.3, 8.4, 8.5 | Chromium, Firefox, WebKit |
| 4.x | 4.3.4+ | 13 | 8.3, 8.4, 8.5 | Chromium, Firefox, WebKit |

The browser suite uses jQuery 4 and Select2 4.1. Laravel 10 starts at 10.16, because Livewire 4.3.4 registers its Blade precompiler with `prepareStringsForCompilationUsing()`, which earlier Laravel 10 releases do not have.

### Why Livewire 4.3.4

Livewire 4.3.3 and earlier are affected by CVE-2026-81887 (DOM-based cross-site scripting during client-side state handling). Requiring 4.3.4 keeps every known Livewire advisory out of applications that install this line, and every Livewire 4 application can update to it within its major.

:::warning Unmaintained Laravel versions
Laravel 10 and 11 no longer receive security fixes. This line supports them because Livewire 4 does, but your application still carries their advisories. Plan your upgrade to Laravel 12 or 13.
:::
