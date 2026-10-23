<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2\Tests\Browser\Fixtures;

use Livewire\Component;

final class DependentDemo extends Component
{
    private const GROUPS = [
        '10' => ['10-a' => '10 A', '10-b' => '10 B'],
        '11' => ['11-a' => '11 A', '11-b' => '11 B', '11-c' => '11 C'],
    ];

    /** @var mixed */
    public $level = '';

    /** @var mixed */
    public $keyed = '';

    /** @var mixed */
    public $morphed = '';

    /** @var mixed */
    public $subject = '';

    /** @var array<int, mixed> */
    public $changes = [];

    public function subjectChanged(): void
    {
        $this->changes[] = $this->subject;
    }

    public function updatedLevel(): void
    {
        $this->keyed = '';
        $this->morphed = '';
    }

    public function render()
    {
        return view('fixtures::dependent-demo', ['groups' => self::GROUPS[(string) $this->level] ?? []]);
    }
}
