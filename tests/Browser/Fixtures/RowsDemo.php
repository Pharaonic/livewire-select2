<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2\Tests\Browser\Fixtures;

use Livewire\Component;

final class RowsDemo extends Component
{
    /** @var array<int, array<string, mixed>> */
    public $rows = [['product' => null]];

    public function addRow(): void
    {
        $this->rows[] = ['product' => null];
    }

    public function removeRow(int $index): void
    {
        unset($this->rows[$index]);
    }

    public function render()
    {
        return view('fixtures::rows-demo');
    }
}
