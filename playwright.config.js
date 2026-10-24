import { execFileSync } from 'node:child_process'
import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.FIXTURE_PORT ?? 8124)
const php = process.env.FIXTURE_PHP ?? 'php8.1'

// The fixtures run on the PHP range of this line (composer.json "php": ">=8.1 <8.6").
const phpVersion = execFileSync(php, ['-r', 'echo PHP_VERSION;'], { encoding: 'utf8' })

if (!/^8\.[1-5]\./.test(phpVersion)) {
    throw new Error(`The browser fixtures need PHP 8.1 to 8.5, but "${php}" is PHP ${phpVersion}. Set FIXTURE_PHP to such a PHP binary.`)
}

export default defineConfig({
    testDir: 'tests/Browser',
    globalSetup: './tests/Browser/global-setup.js',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: process.env.CI ? 2 : 4,
    reporter: process.env.CI ? [['list'], ['github']] : 'list',
    use: {
        baseURL: `http://127.0.0.1:${port}`,
        trace: 'retain-on-failure',
    },
    projects: (process.env.BROWSERS ?? 'chromium,firefox').split(',').map((name) => ({
        name,
        use: { ...devices[{ chromium: 'Desktop Chrome', firefox: 'Desktop Firefox', webkit: 'Desktop Safari' }[name]] },
    })),
    webServer: {
        command: `${php} -S 127.0.0.1:${port} tests/Browser/server.php`,
        url: `http://127.0.0.1:${port}/select2`,
        env: { PHP_CLI_SERVER_WORKERS: '8' },
        reuseExistingServer: !process.env.CI,
        stdout: 'ignore',
        stderr: 'ignore',
    },
})
