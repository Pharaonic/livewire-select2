## Dynamic Selects

Livewire adds, removes, and re-renders elements. The package follows it.

### Selects Livewire Adds or Removes

Selects that appear after a Livewire update, such as a new row from `wire:click="addRow"`, mount and bind after that update. Selects that disappear are cleaned up: their handlers are removed and Select2 is destroyed.

```blade title="resources/views/livewire/invoice.blade.php"
@foreach ($rows as $index => $row)
    <div wire:key="row-{{ $row['id'] }}">
        <div wire:ignore>
            <select data-pharaonic="select2" wire:model.live="rows.{{ $index }}.product">...</select>
        </div>
    </div>
@endforeach

<button wire:click="addRow">Add row</button>
```

:::tip Key rows by something stable
Give each row a `wire:key` that stays with the row, such as an id, not its position. When a row in the middle is removed, position keys shift, and Livewire keeps the wrong widgets.
:::

### Dependent Selects

When one select decides the options of another, the second select needs its new `<option>` list from the server. There are two ways.

**A new wire:key per parent value.** Livewire replaces the ignored block when its key changes. The old widget is cleaned up and the new select mounts with the new options.

```blade
<div wire:ignore>
    <select data-pharaonic="select2" wire:model.live="level">...</select>
</div>

<div wire:ignore wire:key="group-{{ $level }}">
    <select data-pharaonic="select2" wire:model.live="group">
        <option value="">Choose a group</option>
        @foreach ($groups as $id => $name)
            <option value="{{ $id }}">{{ $name }}</option>
        @endforeach
    </select>
</div>
```

**No wire:ignore.** Livewire updates the select, and the package rebuilds the widget after each update.

```blade
<div>
    <select data-pharaonic="select2" wire:model.live="group">...</select>
</div>
```

The parent select needs `wire:model.live`: with plain `wire:model`, the server learns the parent value only on the next request, so the dependent options would not change.

The first way keeps the widget untouched by unrelated requests. The second is simpler, but every request that re-renders the component rebuilds the widget and closes an open dropdown.

Reset the child property when the parent changes:

```php title="app/Livewire/Enrollment.php"
public function updatedLevel()
{
    $this->group = '';
}
```

:::warning Key ignored blocks that come and go
Without keys, Livewire compares siblings by position. When ignored blocks can appear or disappear next to each other, give each a unique `wire:key`.
:::

### Nested Components and Many Selects

Each select binds to the closest Livewire component around it. A select in a nested component writes to that component, never to the parent. Any number of selects can share a page.

`data-component-id` binds a select to a specific component wherever it is. In a Livewire 3 view the id is `$this->getId()`; `$this->id` does not exist on Livewire 3 components and fails the page. An empty value means the closest component.

### Selects You Add Yourself

Selects you add with JavaScript, outside a Livewire update, need one call:

```js
Pharaonic.assistant.scan(container)     // mounts the selects in container
Pharaonic.assistant.destroy(container)  // cleans them up
```

### wire:navigate

Widgets are cleaned up just before `wire:navigate` leaves a page, so the page kept for the back button holds plain selects, and they are mounted again when a page is shown, through a link, back, or forward. The package's script tags carry `data-navigate-once`, so they run once.
