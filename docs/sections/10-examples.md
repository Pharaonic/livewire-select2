## Examples

### 1. Edit Form in a Modal

The server fills the form when the modal opens; the select shows the saved value and opens its dropdown inside the modal.

- ===Component

  ```php title="app/Http/Livewire/Items.php"
  <?php

  namespace App\Http\Livewire;

  use App\Models\Category;
  use App\Models\Item;
  use Livewire\Component;

  class Items extends Component
  {
      public $editing = false;

      public $itemId;

      public $category_id;

      public function edit($id)
      {
          $item = Item::findOrFail($id);

          $this->itemId = $item->id;
          $this->category_id = $item->category_id;
          $this->editing = true;
      }

      public function render()
      {
          return view('livewire.items', ['categories' => Category::pluck('name', 'id')]);
      }
  }
  ```

- ===View

  ```blade title="resources/views/livewire/items.blade.php"
  <div>
      <div class="modal" style="display: {{ $editing ? 'block' : 'none' }}">
          <div wire:ignore>
              <select data-pharaonic="select2" wire:model="category_id" data-placeholder="Category" data-clear data-parent>
                  <option value=""></option>
                  @foreach ($categories as $id => $name)
                      <option value="{{ $id }}">{{ $name }}</option>
                  @endforeach
              </select>
          </div>
      </div>
  </div>
  ```

### 2. Country and City

The city list depends on the country. A new `wire:key` replaces the city select whenever the country changes.

- ===Component

  ```php title="app/Http/Livewire/Address.php"
  public $country_id = '';

  public $city_id = '';

  public function updatedCountryId()
  {
      $this->city_id = '';
  }

  public function render()
  {
      return view('livewire.address', [
          'countries' => Country::pluck('name', 'id'),
          'cities' => City::where('country_id', $this->country_id)->pluck('name', 'id'),
      ]);
  }
  ```

- ===View

  ```blade title="resources/views/livewire/address.blade.php"
  <div>
      <div wire:ignore>
          <select data-pharaonic="select2" wire:model="country_id">
              <option value="">Country</option>
              @foreach ($countries as $id => $name)
                  <option value="{{ $id }}">{{ $name }}</option>
              @endforeach
          </select>
      </div>

      <div wire:ignore wire:key="cities-{{ $country_id }}">
          <select data-pharaonic="select2" wire:model="city_id">
              <option value="">City</option>
              @foreach ($cities as $id => $name)
                  <option value="{{ $id }}">{{ $name }}</option>
              @endforeach
          </select>
      </div>
  </div>
  ```

### 3. Invoice Rows

Each row has its own select bound to its own array item.

```blade title="resources/views/livewire/invoice.blade.php"
<div>
    @foreach ($rows as $index => $row)
        <div wire:key="row-{{ $row['id'] }}">
            <div wire:ignore>
                <select data-pharaonic="select2" wire:model="rows.{{ $index }}.product_id">
                    <option value="">Product</option>
                    @foreach ($products as $id => $name)
                        <option value="{{ $id }}">{{ $name }}</option>
                    @endforeach
                </select>
            </div>
            <button wire:click="removeRow({{ $index }})">Remove</button>
        </div>
    @endforeach

    <button wire:click="addRow">Add row</button>
</div>
```

### 4. Tags

Users pick existing tags or type new ones; saved tags show on load even without an option.

```blade title="resources/views/livewire/post-form.blade.php"
<div wire:ignore>
    <select multiple data-pharaonic="select2" wire:model="tags" data-tags data-options='{"tokenSeparators": [","]}'>
        @foreach ($suggestions as $tag)
            <option value="{{ $tag }}">{{ $tag }}</option>
        @endforeach
    </select>
</div>
```
