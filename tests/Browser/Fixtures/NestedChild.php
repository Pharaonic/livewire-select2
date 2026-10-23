<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2\Tests\Browser\Fixtures;

use Livewire\Component;

final class NestedChild extends Component
{
    /** @var mixed */
    public $selected_routine = null;

    public function render()
    {
        return view('fixtures::nested-child');
    }
}
