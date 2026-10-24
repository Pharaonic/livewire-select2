# Contributing

Thanks for contributing to this Pharaonic package.

## Branches

Each supported Livewire major has its own line. A line only uses syntax and APIs available on the lowest PHP, Laravel, and Livewire version it supports. `develop` follows the newest line.

```text
1.x → Livewire 1
2.x → Livewire 2
3.x → Livewire 3
4.x → Livewire 4
```

Open fixes against the oldest affected line; maintainers port them to the other lines.

## Before coding

- Target the correct Livewire line.
- Keep changes focused.
- Prefer native Laravel capabilities over new abstractions/dependencies.
- Keep code that depends on the Livewire major inside `resources/js/livewire.js`; the integration only uses the Livewire Assistant bridge otherwise.
- Preserve public compatibility; configuration keys, publish tags, and Blade/Artisan names are public API.

## Local quality gate

Install dependencies and run:

```bash
composer check
npm ci
npm run check
```

The package expects formatting, static analysis, tests, Composer validation, security audit, JavaScript lint, unit and browser tests, and a reproducible `dist/` build to pass. Commit the rebuilt `dist/` files with any change under `resources/js/`.

## Pull requests

Keep the PR focused, target the line you started from, and explain what changed and why. Public API additions should be deliberate and small.

Security vulnerabilities must follow `SECURITY.md`, not a public PR or issue.
