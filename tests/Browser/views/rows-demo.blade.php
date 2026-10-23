<div>
    <output id="rows-value">{{ json_encode($rows) }}</output>

    @foreach ($rows as $index => $row)
        <div wire:key="row-{{ $index }}">
            <div wire:ignore>
                <select id="row-{{ $index }}" data-pharaonic="select2" wire:model="rows.{{ $index }}.product">
                    <option value="">Choose a product</option>
                    <option value="p1">Pen</option>
                    <option value="p2">Paper</option>
                </select>
            </div>
            <button id="remove-{{ $index }}" wire:click="removeRow({{ $index }})">remove</button>
        </div>
    @endforeach

    <button id="add-row" wire:click="addRow">add row</button>
</div>
