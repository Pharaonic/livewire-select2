<div>
    <output id="country-value">{{ json_encode($country) }}</output>
    <output id="labels-value">{{ json_encode($labels) }}</output>
    <output id="city-value">{{ json_encode($city) }}</output>
    <output id="language-value">{{ json_encode($language) }}</output>
    <output id="extra-value">{{ json_encode($extra) }}</output>

    <div wire:ignore>
        <select id="country" data-pharaonic="select2" data-component-id="{{ $this->id }}" wire:model="country" data-placeholder="Choose a country" data-clear>
            <option></option>
            <option value="1">Egypt</option>
            <option value="2">Jordan</option>
            <option value="3">Morocco</option>
        </select>
    </div>

    <div wire:ignore>
        <select id="labels" multiple data-pharaonic="select2" data-component-id="{{ $this->id }}" wire:model="labels" data-tags>
            <option value="a">A</option>
            <option value="b">B</option>
        </select>
    </div>

    {{-- An empty data-component-id. --}}
    <div wire:ignore>
        <select id="city" data-pharaonic="select2" data-component-id="" wire:model.lazy="city" data-search-off>
            <option value="">Any city</option>
            <option value="cairo">Cairo</option>
            <option value="amman">Amman</option>
        </select>
    </div>

    <div id="modal">
        <div wire:ignore>
            <select id="language" data-pharaonic="select2" data-component-id="{{ $this->id }}" wire:model="language" data-parent="#modal">
                <option value="en">English</option>
                <option value="ar">Arabic</option>
            </select>
        </div>
    </div>

    <div wire:ignore id="manual"></div>

    <button id="set-country" wire:click="setCountry('3')">three</button>
</div>

@push('fixture-scripts')
    <script>
        window.addManualSelect = function (how) {
            var holder = document.getElementById('manual');

            holder.innerHTML = '<select id="extra" data-pharaonic="select2" wire:model="extra"><option value="">None</option><option value="x">X</option></select>';

            if (how === 'event') {
                window.dispatchEvent(new CustomEvent('pharaonic.select2.load', { detail: { target: document.getElementById('extra') } }));
            } else {
                window.Pharaonic.Select2.init();
            }
        };
    </script>
@endpush
