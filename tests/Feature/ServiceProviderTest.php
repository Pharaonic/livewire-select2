<?php

declare(strict_types=1);

use Illuminate\Support\ServiceProvider;
use Pharaonic\Livewire\Assistant\AssistantServiceProvider;
use Pharaonic\Livewire\Select2\Script;
use Pharaonic\Livewire\Select2\Select2ServiceProvider;

it('registers the service provider and Livewire Assistant', function () {
    expect($this->app->getProviders(Select2ServiceProvider::class))->not->toBeEmpty()
        ->and($this->app->getProviders(AssistantServiceProvider::class))->toHaveCount(1);
});

it('is auto-discovered by Laravel', function () {
    $composer = json_decode((string) file_get_contents(__DIR__.'/../../composer.json'), true);

    expect($composer['extra']['laravel']['providers'])->toBe([Select2ServiceProvider::class]);
});

it('registers the script route', function () {
    expect(route('pharaonic.livewire-select2.script', [], false))->toBe('/pharaonic/livewire-select2/select2.js');
});

it('keeps the deprecated publish tag', function () {
    expect(ServiceProvider::pathsToPublish(Select2ServiceProvider::class, 'livewire-select2'))
        ->toBe([Script::path() => public_path('vendor/pharaonic/pharaonic.select2.min.js')]);
});
