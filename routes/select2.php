<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Pharaonic\Livewire\Select2\Script;
use Pharaonic\Livewire\Select2\ScriptController;

Route::get('pharaonic/livewire-select2/select2.js', ScriptController::class)->name(Script::ROUTE);
