<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Pharaonic\Livewire\Assistant\AssistantServiceProvider;

final class Select2ServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // The directive builds on @livewireAssistantScripts, whatever the provider order.
        $this->app->register(AssistantServiceProvider::class);
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/select2.php');

        Blade::directive('livewireSelect2Scripts', [Script::class, 'directive']);

        // Deprecated aliases: <x-pharaonic-select2::scripts /> and the "livewire-select2" publish tag.
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'pharaonic-select2');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                Script::path() => public_path('vendor/pharaonic/pharaonic.select2.min.js'),
            ], 'livewire-select2');
        }
    }
}
