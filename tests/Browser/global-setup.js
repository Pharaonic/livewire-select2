import { build } from 'esbuild'

// Bundle tests/Browser/fixtures/bundle.js the way an application's Vite build would.
export default async function globalSetup() {
    await build({
        entryPoints: ['tests/Browser/fixtures/bundle.js'],
        bundle: true,
        format: 'esm',
        outfile: 'tests/Browser/.build/bundle.js',
        logLevel: 'warning',
    })
}
