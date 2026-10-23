<div>
    <output id="renders">{{ $renders }}</output>
    <output id="country-value">{{ json_encode($country) }}</output>
    <output id="tags-value">{{ json_encode($tags) }}</output>
    <output id="size-value">{{ json_encode($filters['size']) }}</output>

    @if ($show)
        <div wire:ignore wire:key="country-field">
            <select id="country" data-pharaonic="select2" data-property="country" data-options='{"placeholder": "Choose a country", "allowClear": true, "width": "300px"}'>
                <option value="">Choose a country</option>
                <option value="0">Zero Land</option>
                <option value="1">Egypt</option>
                <option value="2">Jordan</option>
                <option value="3">Morocco</option>
            </select>
        </div>
    @endif

    <div wire:ignore wire:key="tags-field">
        <select id="tags" multiple data-pharaonic="select2" data-property="tags" data-options='{"width": "300px"}'>
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
        </select>
    </div>

    <div wire:ignore wire:key="size-field">
        <select id="size" data-pharaonic="select2" data-property="filters.size" data-options='{"width": "300px"}'>
            <option value="">Any size</option>
            <option value="s">Small</option>
            <option value="m">Medium</option>
        </select>
    </div>

    <button id="set-null" wire:click="setCountry(null)">null</button>
    <button id="set-empty" wire:click="setCountry('')">empty</button>
    <button id="set-zero" wire:click="setCountry(0)">zero</button>
    <button id="set-three" wire:click="setCountry('3')">three</button>
    <button id="set-tags" wire:click="setTags(['b', 'c'])">tags</button>
    <button id="toggle" wire:click="toggle">toggle</button>
    <button id="refresh" wire:click="$refresh">refresh</button>
</div>
