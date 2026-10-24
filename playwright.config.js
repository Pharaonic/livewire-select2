import { execFileSync } from 'node:child_process'
import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.FIXTURE_PORT ?? 8124)
const php = process.env.FIXTURE_PHP ?? 'php7.4'

// Livewire 1 only runs on PHP 7; on PHP 8 every Livewire request fails.
const phpVersion = execFileSync(php, ['-r', 'echo PHP_VERSION;'], { encoding: 'utf8' })

if (!phpVersion.startsWith('7.4.')) {
    throw new Error(`The browser fixtures need PHP 7.4, but "${php}" is PHP ${phpVersion}. Set FIXTURE_PHP to a PHP 7.4 binary.`)
}

export default defineConfig({
    testDir: 'tests/Browser',
    globalSetup: './tests/Browser/global-setup.js',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: process.env.CI ? 2 : 4,
    reporter: process.env.CI ? [['list'], ['github']] : 'list',
    // The first visit of a fixture compiles its views; on a busy CI runner that alone can take over five seconds.
    expect: { timeout: 15_000 },
    use: {
        baseURL: `http://127.0.0.1:${port}`,
        trace: 'retain-on-failure',
    },
    projects: (process.env.BROWSERS ?? 'chromium,firefox').split(',').map((name) => ({
        name,
        use: { ...devices[{ chromium: 'Desktop Chrome', firefox: 'Desktop Firefox', webkit: 'Desktop Safari' }[name]] },
    })),
    webServer: {
        // Views are compiled before the workers start; see tests/Browser/compile.php.
        command: `${php} tests/Browser/compile.php && ${php} -S 127.0.0.1:${port} tests/Browser/server.php`,
        url: `http://127.0.0.1:${port}/select2`,
        env: { PHP_CLI_SERVER_WORKERS: '8' },
        reuseExistingServer: !process.env.CI,
        stdout: 'ignore',
        stderr: 'ignore',
    },
})
