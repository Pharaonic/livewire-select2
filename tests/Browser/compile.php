<?php

declare(strict_types=1);

/*
 * Compiles every fixture view, and the package's own view, before the browser
 * server starts. The server runs several PHP workers, and Blade writes a compiled
 * view without a lock: a worker that reads it while another one is still writing
 * it renders an empty view.
 */

use Pharaonic\Livewire\Select2\Tests\Browser\Fixtures\FixtureApplication;

require dirname(__DIR__, 2).'/vendor/autoload.php';

$app = (new FixtureApplication)->createApplication();
$views = __DIR__.'/views/';
$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($views, FilesystemIterator::SKIP_DOTS));
$names = ['pharaonic-select2::components.scripts'];

foreach ($files as $file) {
    $names[] = 'fixtures::'.str_replace('/', '.', substr($file->getPathname(), strlen($views), -strlen('.blade.php')));
}

foreach ($names as $name) {
    // The finder returns the path the workers compile to, so both share one compiled file.
    $app['blade.compiler']->compile($app['view']->getFinder()->find($name));
}
