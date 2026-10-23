---
name: Livewire Select2

action:
  label: View on Packagist
  href: "{package.packagistUrl}"

views: components.packages

breadcrumbs:
  - label: Home
    href: route:home
  - label: Packages
    href: route:packages.index
  - label: "{technology.name} Packages"
    href: "url:/packages/{technology.slug}"
  - label: "{package.name}"

card:
  topic: forms
  icon: menu
  tags: livewire select2 select dropdown wire:model tags autocomplete jquery
  description: Select2 for Livewire components, with two-way wire:model binding, dynamic and dependent selects, templates, and automatic cleanup.

seo:
  title: "{package.fullName} - Select2 with wire:model for Livewire"
  description: "{package.name} binds Select2 to Livewire components with two-way wire:model sync, dependent selects, and templates. {package.downloadsShort}+ downloads, {package.license} licensed."
  keywords: livewire select2, select2 livewire, wire:model select2, livewire dropdown, livewire tags, laravel select2
  author: Pharaonic
  images:
    - "{package.cover}"
  openGraph:
    type: website
    siteName: Pharaonic
  twitter:
    card: summary_large_image

schema:
  "@type": SoftwareSourceCode
  name: "{package.name}"
  description: "{package.name} is a Livewire package that binds Select2 to Livewire components."
  image: "{package.cover}"
  codeRepository: "{package.githubUrl}"
  programmingLanguage: JavaScript
  runtimePlatform: "{technology.name}"
  version: "{package.version}"
  datePublished: "{package.publishedAt}"
  dateModified: "{package.updatedAt}"
  license: "https://opensource.org/licenses/{package.license}"
  isAccessibleForFree: true
  sameAs:
    - "{package.githubUrl}"
    - "{package.packagistUrl}"
  author:
    "@id": url:/#organization
  publisher:
    "@id": url:/#organization
  interactionStatistic:
    "@type": InteractionCounter
    interactionType: https://schema.org/DownloadAction
    userInteractionCount: "{package.downloads}"
---
