## Compatibility

Every combination below installs with Composer and passes PHPStan and the PHP suite with lowest and highest dependencies. The real-browser suite (real Livewire 3 components, the real Livewire Assistant runtime, jQuery, and Select2, driven in real browsers) runs on the lowest PHP of each Laravel version, with lowest and highest dependencies.

| Line | Livewire | Laravel | PHP | Browsers |
| --- | --- | --- | --- | --- |
| 3.x | 3.8.3+ | 10.15+ | 8.1, 8.2, 8.3 | Chromium, Firefox, WebKit |
| 3.x | 3.8.3+ | 11 | 8.2, 8.3, 8.4 | Chromium, Firefox, WebKit |
| 3.x | 3.8.3+ | 12 | 8.2, 8.3, 8.4, 8.5 | Chromium, Firefox, WebKit |
| 3.x | 3.8.3+ | 13 | 8.3, 8.4, 8.5 | Chromium, Firefox, WebKit |

The browser suite uses jQuery 4 and Select2 4.1. Laravel 10 starts at 10.15, because Livewire 3.8.3 renders its scripts with `Stringable::isUrl()`, which earlier Laravel 10 releases do not have.

### Why Livewire 3.8.3

Livewire 3.8.2 and earlier are affected by CVE-2026-81887 (DOM-based cross-site scripting during client-side state handling), and earlier releases by CVE-2025-54068 (remote command execution during property hydration) and CVE-2024-47823. Requiring 3.8.3 keeps every known Livewire advisory out of applications that install this line, and every Livewire 3 application can update to it within its major.

:::warning Unmaintained Laravel versions
Laravel 10 and 11 no longer receive security fixes. This line supports them because Livewire 3 does, but your application still carries their advisories. Plan your upgrade to Laravel 12 or 13.
:::
