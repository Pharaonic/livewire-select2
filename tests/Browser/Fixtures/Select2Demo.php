<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2\Tests\Browser\Fixtures;

use Livewire\Component;

final class Select2Demo extends Component
{
    /** @var mixed */
    public $country = '2';

    /** @var array<int, string> */
    public $tags = ['a'];

    /** @var array<string, mixed> */
    public $filters = ['size' => null];

    public bool $show = true;

    public int $renders = 0;

    /**
     * @param  mixed  $value
     */
    public function setCountry($value): void
    {
        $this->country = $value;
    }

    /**
     * @param  array<int, string>  $tags
     */
    public function setTags(array $tags): void
    {
        $this->tags = $tags;
    }

    public function toggle(): void
    {
        $this->show = ! $this->show;
    }

    public function render()
    {
        $this->renders++;

        return view('fixtures::select2-demo');
    }
}
