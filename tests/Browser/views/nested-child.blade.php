<div>
    <output id="child-value">{{ json_encode($selected_routine) }}</output>

    <div wire:ignore>
        <select id="routine_id" data-pharaonic="select2" data-component-id="{{ $this->id }}" wire:model="selected_routine">
            <option value="null">Choose a routine</option>
            <option value="7">Morning</option>
            <option value="8">Evening</option>
        </select>
    </div>
</div>
