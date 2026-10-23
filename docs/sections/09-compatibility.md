## Compatibility

Every combination below installs with Composer and passes the PHP suite and the real-browser suite (real Livewire 1 components, the real Livewire Assistant runtime, jQuery, and Select2, driven in real browsers) with lowest and highest dependencies.

| Line | Livewire | Laravel | PHP | Browsers |
| --- | --- | --- | --- | --- |
| 1.x | 1.3.0 to 1.3.9, except 1.3.7 | 7.30+ | 7.4 | Chromium, Firefox, WebKit |
| 1.x | 1.3.0 to 1.3.9, except 1.3.7 | 8.75+ | 7.4 | Chromium, Firefox, WebKit |

The browser suite uses jQuery 4 and Select2 4.1.

### Why PHP 7.4

Every Livewire 1 release requires PHP 7. PHP 7.4 is the oldest PHP the package's test and analysis tools run on.

### What Livewire 1 Cannot Do

Livewire 1 has no deferred updates, so every write is live, whatever the `wire:model` modifiers.

:::warning Livewire 1 security
Livewire 1 no longer receives fixes. CVE-2024-47823 (remote code execution through file uploads) affects every Livewire release before 2.12.7, including all of Livewire 1. This package does not use file uploads, but your application does if it uses Livewire's `WithFileUploads`. Plan your upgrade.
:::
