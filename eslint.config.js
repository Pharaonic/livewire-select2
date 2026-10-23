import js from '@eslint/js'
import globals from 'globals'

export default [
    {
        ignores: ['dist/', 'node_modules/', 'vendor/', 'tools/', 'test-results/', 'playwright-report/', 'tests/Browser/.build/'],
    },
    js.configs.recommended,
    {
        files: ['resources/js/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.browser },
        },
    },
    {
        files: ['tests/Browser/fixtures/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.browser },
        },
    },
    {
        files: ['*.js', 'tests/js/**/*.js', 'tests/Browser/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.node, ...globals.browser },
        },
    },
]
