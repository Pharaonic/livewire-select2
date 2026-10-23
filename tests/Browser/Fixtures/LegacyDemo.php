<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2\Tests\Browser\Fixtures;

use Livewire\Component;

/**
 * wire:model with data-component-id, the shorthand attributes, and the deprecated aliases.
 */
final class LegacyDemo extends Component
{
    /** @var mixed */
    public $country = '2';

    /** @var array<int, string> */
    public $labels = ['a', 'custom'];

    /** @var mixed */
    public $city = null;

    /** @var mixed */
    public $language = 'en';

    /** @var mixed */
    public $extra = null;

    /**
     * @param  mixed  $value
     */
    public function setCountry($value): void
    {
        $this->country = $value;
    }

    public function render()
    {
        return view('fixtures::legacy-demo');
    }
}
