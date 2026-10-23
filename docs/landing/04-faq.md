---
view: components.home.faq
badge: FAQ
title: "{package.name}"
highlight: Questions
subtitle: "Quick answers about installing and using {package.name}."
---

## What is {package.name}?

{card.description} It's a free, open-source {technology.name} package by Pharaonic.

## How do I install {package.name}?

Run `composer require {package.composer}` in your project's root directory, then add `@livewireSelect2Scripts` to your layout.

## What does {package.name} require?

The latest release requires {package.requiresText}. jQuery and Select2 are loaded by your application.

## Which Livewire versions are supported?

Every Livewire major has its own line, and Composer installs the one that matches your Livewire version. See the compatibility section of the documentation.

## How do I make one select depend on another?

Give the ignored block of the dependent select a `wire:key` that changes with the parent value, or leave it outside `wire:ignore`. The documentation shows both.

## Does it work with Vite?

Yes. Set `window.jQuery` and attach Select2 to it in your bundle, or import the package's ES module. No global `$` is needed.

## Is {package.name} free to use?

Yes. {package.name} is open source under the {package.license} license, so you can use it in personal and commercial projects.

## Where can I find the {package.name} documentation?

Read the [{package.name} documentation]({package.docsUrl}) for setup, binding, options, templates, and examples.

## How do I report a bug or contribute to {package.name}?

Open an issue or a pull request on [GitHub]({package.githubUrl}), or ask in the [Pharaonic Discord](https://discord.gg/XQG9RhvEvf).
