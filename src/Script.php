<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\URL;
use InvalidArgumentException;

/**
 * @internal The public API is the @livewireSelect2Scripts directive and the
 *           pharaonic.livewire-select2.script route.
 */
final class Script
{
    public const ROUTE = 'pharaonic.livewire-select2.script';

    private const ONCE = 'pharaonic-livewire-select2';

    private static ?string $version = null;

    public static function path(): string
    {
        return dirname(__DIR__).'/dist/livewire-select2.js';
    }

    /**
     * Content hash of the built integration, used to refresh browser caches after an update.
     */
    public static function version(): string
    {
        if (self::$version === null) {
            $hash = hash_file('sha256', self::path());

            if ($hash === false) {
                throw new InvalidArgumentException('The Pharaonic Livewire Select2 script is missing: '.self::path());
            }

            self::$version = substr($hash, 0, 16);
        }

        return self::$version;
    }

    /**
     * Compile @livewireSelect2Scripts(...): the Livewire Assistant runtime and this
     * integration, each printed once per page through the view factory's @once
     * bookkeeping, so partials, layouts, and @livewireAssistantScripts share it.
     */
    public static function directive(string $expression): string
    {
        $options = trim($expression) === '' ? '[]' : $expression;
        $once = var_export(self::ONCE, true);
        $assistant = Blade::getCustomDirectives()['livewireAssistantScripts'] ?? null;
        $runtime = is_callable($assistant) ? $assistant('$__pharaonicSelect2Options') : null;

        if (! is_string($runtime)) {
            throw new InvalidArgumentException('@livewireSelect2Scripts needs the @livewireAssistantScripts directive of pharaonic/livewire-assistant.');
        }

        return '<?php $__pharaonicSelect2Options = '.$options.'; \\'.self::class.'::validate($__pharaonicSelect2Options); ?>'
            .$runtime
            .'<?php if (! $__env->hasRenderedOnce('.$once.')): '
            .'$__env->markAsRenderedOnce('.$once.'); '
            .'echo \\'.self::class.'::tag($__pharaonicSelect2Options); '
            .'endif; unset($__pharaonicSelect2Options); ?>';
    }

    /**
     * @param  mixed  $options
     */
    public static function validate($options): void
    {
        if (! is_array($options)) {
            throw new InvalidArgumentException('The options of @livewireSelect2Scripts must be an array.');
        }

        $unknown = array_diff(array_keys($options), ['nonce']);

        if ($unknown !== []) {
            throw new InvalidArgumentException('Unknown @livewireSelect2Scripts option: '.implode(', ', $unknown).'. The only option is "nonce".');
        }

        $nonce = $options['nonce'] ?? null;

        if ($nonce !== null && ! is_string($nonce)) {
            throw new InvalidArgumentException('The "nonce" option of @livewireSelect2Scripts must be a string.');
        }
    }

    /**
     * @param  array<array-key, mixed>  $options
     */
    public static function tag(array $options = []): string
    {
        self::validate($options);

        $nonce = $options['nonce'] ?? null;
        $src = URL::route(self::ROUTE, ['id' => self::version()]);
        $nonceAttribute = is_string($nonce) ? ' nonce="'.e($nonce).'"' : '';

        return '<script src="'.e($src).'" data-turbo-eval="false" data-turbolinks-eval="false"'.$nonceAttribute.'></script>';
    }
}
