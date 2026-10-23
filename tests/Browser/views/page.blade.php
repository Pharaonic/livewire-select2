@php
    $bundle = $fixture === 'bundle';
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ $fixture }}</title>
    <link rel="stylesheet" href="/static/select2.css">
    <script>
        window.fixtureErrors = [];
        window.addEventListener('pharaonic:assistant:error', function (event) {
            window.fixtureErrors.push({ code: event.detail.code, integration: event.detail.integration });
        });
    </script>
    @unless ($bundle)
        <script src="/static/jquery.js"></script>
        <script src="/static/select2.js"></script>
    @endunless
    @livewireStyles
</head>
<body>
    @include('fixtures::fixtures.'.$fixture)

    @livewireScripts

    @if ($bundle)
        {{-- jQuery, Select2, the Assistant, and this package from one ES module bundle, as with Vite. --}}
        <script type="module" src="/static/bundle.js"></script>
    @elseif (request('scripts') === 'legacy-view')
        <x-pharaonic-select2::scripts />
    @else
        @livewireSelect2Scripts
    @endif

    @stack('fixture-scripts')
</body>
</html>
