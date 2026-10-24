<div>
    <output id="country-value">{{ json_encode($country) }}</output>

    <div wire:ignore>
        <select id="flagged" data-pharaonic="select2" wire:model.live="country" data-options='{"templateResult": "flag", "templateSelection": "flag", "width": "300px"}'>
            <option value="eg" data-flag="EG">Egypt</option>
            <option value="jo" data-flag="JO">Jordan</option>
        </select>
    </div>

    <output id="other-value">{{ json_encode($other) }}</output>

    <div wire:ignore>
        <select id="short" data-pharaonic="select2" wire:model.live="other" data-template="flag" data-width="300px">
            <option value="eg" data-flag="EG">Egypt</option>
            <option value="jo" data-flag="JO">Jordan</option>
        </select>
    </div>

    <output id="pick-value">{{ json_encode($pick) }}</output>

    <div wire:ignore>
        <select id="imaged" data-pharaonic="select2" wire:model.live="pick" data-width="300px">
            <option value="red" data-image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='red'/%3E%3C/svg%3E">Red &lt;b&gt;</option>
            <option value="plain">Plain</option>
        </select>
    </div>
</div>

@push('fixture-scripts')
    <script>
        (function () {
            var define = function () {
                window.Pharaonic.select2.define('flag', function (state) {
                    if (!state.element) {
                        return state.text;
                    }

                    var span = document.createElement('span');

                    span.className = 'flag';
                    span.textContent = state.element.getAttribute('data-flag') + ' ' + state.text;

                    return span;
                });
            };

            if (new URLSearchParams(location.search).get('define') === 'late') {
                window.addEventListener('load', function () { setTimeout(define, 300); });
            } else {
                define();
            }
        })();
    </script>
@endpush
