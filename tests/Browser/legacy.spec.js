import { expect, test } from '@playwright/test'
import { collectConsole, errors, pick, problems, rendered, settle, value, widget, widgets } from './helpers.js'

// wire:model with data-component-id, the shorthand attributes, and the deprecated aliases.
test.describe('shorthand markup', () => {
    for (const scripts of ['directive', 'legacy-view']) {
        test(`binds wire:model in both directions (${scripts})`, async ({ page }) => {
            await page.goto(`/legacy?scripts=${scripts}`)
            await widgets(page, 4)

            await expect(rendered(page, 'country')).toContainText('Jordan')
            await pick(page, 'country', 'Egypt')
            await expect(value(page, 'country')).toHaveText('"1"')

            await page.click('#set-country')
            await expect(value(page, 'country')).toHaveText('"3"')
            await expect(rendered(page, 'country')).toContainText('Morocco')
        })
    }

    test('maps data-placeholder and data-clear', async ({ page }) => {
        await page.goto('/legacy')
        await widgets(page, 4)

        await page.locator('#country + .select2 .select2-selection__clear').click()
        await expect(value(page, 'country')).toHaveText('""')
        await expect(rendered(page, 'country')).toContainText('Choose a country')
    })

    test('maps data-tags, including values the markup has no option for', async ({ page }) => {
        await page.goto('/legacy')
        await widgets(page, 4)

        expect(await widget(page, 'labels')).toEqual(['a', 'custom'])

        await page.locator('#labels + .select2 .select2-search__field').fill('fresh')
        await page.keyboard.press('Enter')
        await expect(value(page, 'labels')).toHaveText('["a","custom","fresh"]')
    })

    test('maps data-search-off and data-parent', async ({ page }) => {
        await page.goto('/legacy')
        await widgets(page, 4)

        await page.locator('#city + .select2 .select2-selection').click()
        await expect(page.locator('.select2-container--open .select2-search__field')).toBeHidden()
        await page.keyboard.press('Escape')

        await page.locator('#language + .select2 .select2-selection').click()
        await expect(page.locator('#modal > .select2-container--open .select2-dropdown')).toHaveCount(1)
    })

    test('leaves the class attribute alone', async ({ page }) => {
        await page.goto('/legacy')
        await widgets(page, 4)

        await expect(page.locator('#country')).not.toHaveClass(/form-select/)
    })

    for (const how of ['event', 'init']) {
        test(`mounts manually added elements through the deprecated ${how}`, async ({ page }) => {
            await page.goto('/legacy')
            await widgets(page, 4)

            await page.evaluate((mode) => window.addManualSelect(mode), how)
            await widgets(page, 5)
            await pick(page, 'extra', 'X')
            await expect(value(page, 'extra')).toHaveText('"x"')
        })
    }

    test('runs without console errors', async ({ page }) => {
        const messages = collectConsole(page)

        await page.goto('/legacy')
        await widgets(page, 4)
        await pick(page, 'language', 'Arabic')
        await settle(page)

        expect(problems(messages)).toEqual([])
        expect(await errors(page)).toEqual([])
    })
})

test('#14: an empty data-component-id binds to the surrounding component', async ({ page }) => {
    await page.goto('/legacy')
    await widgets(page, 4)

    await pick(page, 'city', 'Amman')
    await expect(value(page, 'city')).toHaveText('"amman"')
})

test('#6: selects in nested components each write to their own component', async ({ page }) => {
    await page.goto('/nested')
    await widgets(page, 2)

    await pick(page, 'routine_id', 'Evening')
    await expect(page.locator('#child-value')).toHaveText('"8"')
    await expect(page.locator('#parent-value')).toHaveText('null')

    await pick(page, 'users_id', 'Mona')
    await expect(page.locator('#parent-value')).toHaveText('"2"')
    await expect(page.locator('#child-value')).toHaveText('"8"')
    await widgets(page, 2)
})
