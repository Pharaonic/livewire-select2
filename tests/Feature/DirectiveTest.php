<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Blade;
use Pharaonic\Livewire\Assistant\Script as AssistantScript;
use Pharaonic\Livewire\Select2\Script;

function renderBlade(string $template, array $data = []): string
{
    $path = tempnam(sys_get_temp_dir(), 'select2').'.blade.php';

    file_put_contents($path, $template);

    try {
        return view()->file($path, $data)->render();
    } finally {
        unlink($path);
    }
}

function assistantTag(string $attributes = ''): string
{
    return '<script src="http://localhost/pharaonic/livewire-assistant/assistant.js?id='.AssistantScript::version().'" data-turbo-eval="false" data-turbolinks-eval="false"'.$attributes.'></script>';
}

function select2Tag(string $attributes = ''): string
{
    return '<script src="http://localhost/pharaonic/livewire-select2/select2.js?id='.Script::version().'" data-turbo-eval="false" data-turbolinks-eval="false"'.$attributes.'></script>';
}

it('renders the Assistant runtime and the integration', function () {
    expect(renderBlade('@livewireSelect2Scripts'))->toBe(assistantTag().select2Tag());
});

it('renders once across the page, its partials, and @livewireAssistantScripts', function () {
    $directory = sys_get_temp_dir().'/select2-views-'.uniqid();

    mkdir($directory);
    file_put_contents($directory.'/partial.blade.php', '@livewireSelect2Scripts');
    file_put_contents($directory.'/page.blade.php', "@livewireAssistantScripts\n@livewireSelect2Scripts\n@include('partial')\n@livewireSelect2Scripts");

    view()->addLocation($directory);

    try {
        $html = view('page')->render();
    } finally {
        array_map('unlink', glob($directory.'/*.blade.php') ?: []);
        rmdir($directory);
    }

    expect(substr_count($html, '<script'))->toBe(2)
        ->and(substr_count($html, 'livewire-assistant/assistant.js'))->toBe(1)
        ->and(substr_count($html, 'livewire-select2/select2.js'))->toBe(1);
});

it('adds an escaped CSP nonce to both tags', function () {
    $html = renderBlade("@livewireSelect2Scripts(['nonce' => \$nonce])", ['nonce' => 'a"b<c>']);

    expect($html)->toBe(assistantTag(' nonce="a&quot;b&lt;c&gt;"').select2Tag(' nonce="a&quot;b&lt;c&gt;"'))
        ->and($html)->not->toContain('a"b<c>');
});

it('rejects unknown options and a non-string nonce', function (string $options) {
    renderBlade("@livewireSelect2Scripts({$options})");
})->with([
    "['nonse' => 'x']",
    "['nonce' => 123]",
    "'nonce'",
])->throws(Exception::class);

it('compiles to the shared once mechanism', function () {
    expect(Blade::compileString('@livewireSelect2Scripts'))
        ->toContain("hasRenderedOnce('pharaonic-livewire-assistant')")
        ->toContain("hasRenderedOnce('pharaonic-livewire-select2')")
        ->toContain("markAsRenderedOnce('pharaonic-livewire-select2')");
});

it('keeps the deprecated scripts view', function () {
    expect(view('pharaonic-select2::components.scripts')->render())->toBe(assistantTag().select2Tag());
});
