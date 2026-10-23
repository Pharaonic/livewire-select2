<div>
    <output id="parent-value">{{ json_encode($selected) }}</output>

    <div wire:ignore>
        <select id="users_id" data-pharaonic="select2" data-component-id="{{ $this->id }}" wire:model="selected">
            <option value="null">Choose a client</option>
            <option value="1">Ahmed</option>
            <option value="2">Mona</option>
        </select>
    </div>

    @livewire('nested-child')
</div>
