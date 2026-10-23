<div>
    <output id="jenis-value">{{ json_encode($jenis) }}</output>

    <div id="modal-edit" class="modal" style="display: {{ $open ? 'block' : 'none' }}">
        <div wire:ignore>
            <select id="jenis" data-clear data-parent wire:model="jenis" class="form-select" data-pharaonic="select2" data-component-id="{{ $this->id }}">
                <option></option>
                @foreach ($items as $id => $name)
                    <option value="{{ $id }}">{{ $name }}</option>
                @endforeach
            </select>
        </div>
        <button id="close" wire:click="close">close</button>
    </div>

    <button id="edit-2" wire:click="edit(2)">edit 2</button>
    <button id="edit-3" wire:click="edit(3)">edit 3</button>
    <button id="reopen" wire:click="reopen">reopen</button>
</div>
