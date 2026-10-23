:::badges
- Livewire Package {color=blue}
- {release.label} {color=green}
- {package.license} License {color=purple}
:::

# Livewire Select2

Livewire Select2 turns a `<select>` in a Livewire component into a Select2 widget that stays in sync with the component. Put `data-pharaonic="select2"` and `wire:model` on the select, load one Blade directive, and the widget follows the property in both directions: what the user picks reaches the component, and what the server sets shows in the widget. It is built on Livewire Assistant, which finds the elements, binds each one to the component that owns it, and cleans them up when Livewire removes them.

:::features
### Two-way binding {icon="switch"}
User choices update the property, and values the server sets update the widget, without echo requests.

### Native wire:model {icon="code-brackets"}
Use wire:model with its usual modifiers, or data-property, on single and multiple selects and dot paths.

### Dynamic and dependent selects {icon="automation"}
Selects that Livewire adds, removes, or re-renders with new options are mounted, cleaned up, or rebuilt for you.

### Right component, always {icon="users"}
Each select binds to the component around it, so nested components and many selects per page just work.

### Images and templates {icon="pencil"}
Show an image beside each option without JavaScript, or name a template function once and reuse it.

### No Node build required {icon="package"}
The script ships prebuilt in the Composer package, or as an ES module for bundlers such as Vite.
:::

:::info Livewire 2 line
This documentation covers the 2.x line, which supports Livewire 2. Each Livewire major gets its own line. Coming from 1.2? See [Upgrading from 1.2](#upgrading).
:::
