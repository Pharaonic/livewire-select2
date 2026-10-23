## Compatibility

Every combination below installs with Composer and passes PHPStan and the PHP suite with lowest and highest dependencies. The real-browser suite (real Livewire 2 components, the real Livewire Assistant runtime, jQuery, and Select2, driven in real browsers) runs on the lowest PHP of each Laravel version, with lowest and highest dependencies.

| Line | Livewire | Laravel | PHP | Browsers |
| --- | --- | --- | --- | --- |
| 2.x | 2.12.7+ | 7.30+ | 8.0 | Chromium, Firefox, WebKit |
| 2.x | 2.12.7+ | 8.75+ | 8.0, 8.1 | Chromium, Firefox, WebKit |
| 2.x | 2.12.7+ | 9 | 8.0, 8.1, 8.2 | Chromium, Firefox, WebKit |
| 2.x | 2.12.7+ | 10 | 8.1, 8.2, 8.3 | Chromium, Firefox, WebKit |

The browser suite uses jQuery 4 and Select2 4.1.

### Why Livewire 2.12.7

CVE-2024-47823 (remote code execution through file uploads) affects every Livewire release before 2.12.7. Requiring 2.12.7 keeps it out of every application that installs this line, and every Livewire 2 application can update to it within its major.

:::warning Unmaintained Laravel versions
Laravel 7, 8, 9, and 10 no longer receive security fixes. This line supports them because Livewire 2 does, but your application still carries their advisories. Plan your upgrade to a maintained Laravel version, which means Livewire 3 or later.
:::
