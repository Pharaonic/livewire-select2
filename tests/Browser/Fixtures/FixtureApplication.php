<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2\Tests\Browser\Fixtures;

use Illuminate\Support\Facades\Route;
use Livewire\Livewire;
use Livewire\LivewireServiceProvider;
use Orchestra\Testbench\Concerns\CreatesApplication;
use Pharaonic\Livewire\Assistant\AssistantServiceProvider;
use Pharaonic\Livewire\Select2\Select2ServiceProvider;

final class FixtureApplication
{
    use CreatesApplication;

    public const FIXTURES = ['select2', 'legacy', 'nested', 'modal', 'rows', 'dependent', 'templates', 'bundle', 'defer', 'navigate-one', 'navigate-two'];

    /**
     * @param  \Illuminate\Foundation\Application  $app
     * @return array<int, class-string>
     */
    protected function getPackageProviders($app): array
    {
        return [LivewireServiceProvider::class, AssistantServiceProvider::class, Select2ServiceProvider::class];
    }

    /**
     * @param  \Illuminate\Foundation\Application  $app
     */
    protected function getEnvironmentSetUp($app): void
    {
        $app['config']->set('app.key', 'base64:'.base64_encode(str_repeat('a', 32)));
        $app['config']->set('app.debug', true);
        $app['config']->set('session.driver', 'cookie');
        $app['config']->set('livewire.middleware_group', 'web');
        $app['view']->addNamespace('fixtures', __DIR__.'/../views');

        Livewire::component('select2-demo', Select2Demo::class);
        Livewire::component('legacy-demo', LegacyDemo::class);
        Livewire::component('nested-parent', NestedParent::class);
        Livewire::component('nested-child', NestedChild::class);
        Livewire::component('modal-demo', ModalDemo::class);
        Livewire::component('rows-demo', RowsDemo::class);
        Livewire::component('dependent-demo', DependentDemo::class);
        Livewire::component('templates-demo', TemplatesDemo::class);
        Livewire::component('defer-demo', DeferDemo::class);

        Route::middleware('web')->group(function (): void {
            Route::get('/{fixture}', fn (string $fixture) => view('fixtures::page', ['fixture' => $fixture]))
                ->where('fixture', implode('|', self::FIXTURES));
        });
    }
}
