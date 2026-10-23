<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2\Tests\Browser\Fixtures;

use Livewire\Component;

final class ModalDemo extends Component
{
    public bool $open = false;

    /** @var mixed */
    public $jenis = null;

    /** @var array<int, string> */
    public $items = [1 => 'Food', 2 => 'Drink', 3 => 'Tools'];

    public function edit(int $id): void
    {
        $this->jenis = (string) $id;
        $this->open = true;
    }

    public function reopen(): void
    {
        $this->open = true;
    }

    public function close(): void
    {
        $this->open = false;
    }

    public function render()
    {
        return view('fixtures::modal-demo');
    }
}
