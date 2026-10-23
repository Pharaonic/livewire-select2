<?php

declare(strict_types=1);

use Pharaonic\Livewire\Select2\Script;

it('serves the built runtime', function () {
    $response = $this->get('/pharaonic/livewire-select2/select2.js?id='.Script::version());

    $response->assertOk();

    expect($response->headers->get('Content-Type'))->toBe('application/javascript; charset=utf-8')
        ->and($response->headers->get('X-Content-Type-Options'))->toBe('nosniff')
        ->and($response->headers->get('Cache-Control'))->toContain('max-age=31536000')
        ->and($response->headers->get('Cache-Control'))->toContain('immutable')
        ->and($response->baseResponse->getFile()->getPathname())->toBe(Script::path());
});

it('does not let an unknown version be cached', function (?string $id) {
    $response = $this->get('/pharaonic/livewire-select2/select2.js'.($id === null ? '' : '?id='.$id));

    $response->assertOk();

    expect($response->headers->get('Cache-Control'))->toContain('no-cache')
        ->and($response->headers->get('Cache-Control'))->not->toContain('max-age=31536000');
})->with([null, 'outdated']);

it('needs no session, cookies, or middleware group', function () {
    $response = $this->get('/pharaonic/livewire-select2/select2.js');

    expect($response->headers->getCookies())->toBe([]);
});

it('versions the runtime by its content', function () {
    expect(Script::version())
        ->toMatch('/^[0-9a-f]{16}$/')
        ->toBe(substr((string) hash_file('sha256', Script::path()), 0, 16));
});
