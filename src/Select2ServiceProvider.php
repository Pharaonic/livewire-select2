<?php

namespace Pharaonic\Livewire\Select2;

use Illuminate\Support\ServiceProvider;

class Select2ServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Views
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'pharaonic-select2');

        // Publishing
        $this->publishes([
            __DIR__.'/../public' => public_path('vendor/pharaonic'),
        ], 'livewire-select2');
    }
}
