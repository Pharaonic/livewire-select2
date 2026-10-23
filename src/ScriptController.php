<?php

declare(strict_types=1);

namespace Pharaonic\Livewire\Select2;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * @internal
 */
final class ScriptController
{
    public function __invoke(Request $request): BinaryFileResponse
    {
        // A matching version can be cached forever; any other URL must revalidate.
        $cacheControl = $request->query('id') === Script::version()
            ? 'public, max-age=31536000, immutable'
            : 'no-cache';

        return new BinaryFileResponse(Script::path(), 200, [
            'Content-Type' => 'application/javascript; charset=utf-8',
            'Cache-Control' => $cacheControl,
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
