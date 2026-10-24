<div>
    <output id="level-value">{{ json_encode($level) }}</output>
    <output id="keyed-value">{{ json_encode($keyed) }}</output>
    <output id="morphed-value">{{ json_encode($morphed) }}</output>

    <div wire:ignore>
        <select id="level" data-pharaonic="select2" wire:model.live="level">
            <option value="">Choose a level</option>
            <option value="10">10</option>
            <option value="11">11</option>
        </select>
    </div>

    <output id="changes-value">{{ json_encode($changes) }}</output>

    {{-- The pattern of #6: wire:change next to wire:model. --}}
    <div wire:ignore>
        <select id="subject" data-pharaonic="select2" wire:model.live="subject" wire:change="subjectChanged">
            <option value="">Choose a subject</option>
            <option value="math">Math</option>
            <option value="art">Art</option>
        </select>
    </div>

    {{-- Recipe 1: a new wire:key per parent value replaces the ignored block. --}}
    <div wire:ignore wire:key="keyed-{{ $level }}">
        <select id="keyed" data-pharaonic="select2" wire:model.live="keyed">
            <option value="">Choose a group</option>
            @foreach ($groups as $id => $name)
                <option value="{{ $id }}">{{ $name }}</option>
            @endforeach
        </select>
    </div>

    {{-- Recipe 2: no wire:ignore; the widget is rebuilt after Livewire morphs it. --}}
    <div>
        <select id="morphed" data-pharaonic="select2" wire:model.live="morphed">
            <option value="">Choose a group</option>
            @foreach ($groups as $id => $name)
                <option value="{{ $id }}">{{ $name }}</option>
            @endforeach
        </select>
    </div>
</div>
