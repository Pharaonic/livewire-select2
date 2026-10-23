---
view: components.packages.package-hero
badges:
  - label: Livewire Package
    color: blue
  - label: "{package.latestVersionLabel}"
    color: green
  - label: "{package.license} License"
    color: purple
  - label: "{package.downloadsShort}+ downloads"
    color: blue
eyebrow: "{package.name}"
title: Select2 that speaks
highlight: wire:model
buttons:
  - label: View Full Documentation
    href: "{card.docsUrl}"
    style: primary
    icon: arrow-right
  - label: View on GitHub
    href: "{package.githubUrl}"
    style: ghost
    external: true
install: "{card.install}"
labels:
  copy: Copy
  copied: Copied!
---

Livewire Select2 turns any `<select>` in a Livewire component into a Select2 widget bound to a property in both directions. Rows added with `wire:click`, dependent dropdowns, nested components, and modals keep working without custom JavaScript.
