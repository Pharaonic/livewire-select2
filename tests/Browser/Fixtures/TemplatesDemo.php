<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2\Tests\Browser\Fixtures;

use Livewire\Component;

final class TemplatesDemo extends Component
{
    /** @var mixed */
    public $country = 'eg';

    /** @var mixed */
    public $other = 'jo';

    /** @var mixed */
    public $pick = 'red';

    public function render()
    {
        return view('fixtures::templates-demo');
    }
}
