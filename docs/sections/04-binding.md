## Binding

The package binds a select to one component property, in both directions.

### wire:model or data-property

The property comes from `wire:model` on the select, or from `data-property`. When both are present, `data-property` wins.

```blade
<select data-pharaonic="select2" wire:model="country">...</select>
<select data-pharaonic="select2" data-property="address.country_id">...</select>
```

Both accept a property name or a dot path (`address.city`, `rows.2.product`).

### Modifiers on Livewire 4

The modifiers mean what they mean in Livewire 4:

| Attribute | The choice is sent |
| --- | --- |
| `wire:model` | with the component's next request, such as a `wire:click` or a form submit |
| `wire:model.live`, `wire:model.live.blur`, `wire:model.live.change` | right away |
| `wire:model.lazy` | right away: a Select2 choice is the change |
| `wire:model.change`, `wire:model.blur` (without `.live`) | with the next request: on Livewire 4 they only decide when the browser-side value updates |
| `wire:model.debounce.500ms` (without `.live`) | with the next request, like `wire:model` |

Use `wire:model.live` when the server has to react to the choice at once, for example to load dependent options. `data-property` always sends right away.

:::info Coming from Livewire 3
On Livewire 3, `wire:model.change` and `wire:model.blur` sent the choice right away. On Livewire 4 they no longer send a request on their own; write `wire:model.live` (or `wire:model.live.blur`) instead.
:::

### How Values Move

- **Initial value.** When the select mounts, it shows the property's current value.
- **User to server.** A Select2 change sends the new value to the property in a Livewire request.
- **Server to widget.** When a Livewire update changes the property, from an action, a lifecycle hook, or another field, the widget selects the new value.
- **No echo.** Values the server sets are shown without being sent back, and a choice equal to the current value sends nothing.

### Value Types

Select2 works with strings. The package converts at the boundary:

| Property value | Single select shows | Multiple select shows |
| --- | --- | --- |
| `null` | the empty option | nothing |
| `''` | the empty option | nothing |
| `0` or `'0'` | the option with value `0` | |
| `2` or `'2'` | the option with value `2` | |
| `['1', 2]` | | options `1` and `2` |

What the user picks is sent as a string, or an array of strings for a multiple select. Cast it in the component if you need integers.

### Tags

With `data-tags`, users can type new values. Values in the property that have no `<option>`, such as tags saved earlier, get one when they are shown, so they appear on the first render.

```blade
<div wire:ignore>
    <select multiple data-pharaonic="select2" wire:model="labels" data-tags>
        <option value="urgent">urgent</option>
    </select>
</div>
```

### Reacting to Changes

`wire:change` on the select runs after the new value is written, so the action sees it:

```blade
<div wire:ignore>
    <select data-pharaonic="select2" wire:model="country" wire:change="countryChanged">...</select>
</div>
```

Select2 itself never fires the native `change` event; the package fires one for selects that have `wire:change`. With plain `wire:model`, the deferred value travels in the `wire:change` request. Change handlers you attach with jQuery receive that event too, so on these selects they run twice. An `updated` hook in the component needs no event at all:

```php title="app/Livewire/Order.php"
public function updatedCountry($value)
{
    $this->city = null;
}
```
