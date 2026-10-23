import { expect, test } from '@playwright/test'
import { collectConsole, errors, ownHandlers, pick, problems, rendered, settle, value, widget, widgets } from './helpers.js'

test('#12: a value set by the server shows after the modal opens, and survives closing it', async ({ page }) => {
    await page.goto('/modal')
    await widgets(page, 1)

    await page.click('#edit-2')
    await expect(value(page, 'jenis')).toHaveText('"2"')
    await expect(rendered(page, 'jenis')).toContainText('Drink')

    await pick(page, 'jenis', 'Tools')
    await expect(value(page, 'jenis')).toHaveText('"3"')
    await page.click('#close')
    await page.click('#reopen')
    await settle(page)
    await expect(rendered(page, 'jenis')).toContainText('Tools')

    await page.click('#close')
    await page.click('#edit-2')
    await expect(rendered(page, 'jenis')).toContainText('Drink')
})

test('#12: data-parent without a value opens the dropdown inside the modal', async ({ page }) => {
    await page.goto('/modal')
    await widgets(page, 1)

    await page.click('#edit-2')
    await page.locator('#jenis + .select2 .select2-selection').click()
    await expect(page.locator('#modal-edit > .select2-container--open .select2-dropdown')).toHaveCount(1)
})

test('#10: rows added by wire:click mount and bind their own property', async ({ page }) => {
    await page.goto('/rows')
    await widgets(page, 1)

    await page.click('#add-row')
    await widgets(page, 2)
    await page.click('#add-row')
    await widgets(page, 3)

    await pick(page, 'row-2', 'Paper')
    await expect(value(page, 'rows')).toHaveText('[{"product":null},{"product":null},{"product":"p2"}]')

    await pick(page, 'row-0', 'Pen')
    await expect(value(page, 'rows')).toHaveText('[{"product":"p1"},{"product":null},{"product":"p2"}]')

    await page.click('#remove-1')
    await widgets(page, 2)
    expect(await ownHandlers(page, 'row-2')).toBe(1)
})

test('#6: wire:change runs once, after wire:model has the new value', async ({ page }) => {
    await page.goto('/dependent')
    await widgets(page, 4)

    await pick(page, 'subject', 'Math')
    await expect(page.locator('#changes-value')).toHaveText('["math"]')

    await pick(page, 'subject', 'Art')
    await expect(page.locator('#changes-value')).toHaveText('["math","art"]')
    await settle(page)
    await expect(page.locator('#changes-value')).toHaveText('["math","art"]')
})

test.describe('#6 and #10: dependent selects get new options from the server', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dependent')
        await widgets(page, 4)
    })

    for (const id of ['keyed', 'morphed']) {
        test(`${id} block`, async ({ page }) => {
            const messages = collectConsole(page)

            await pick(page, 'level', '11')
            await expect(value(page, 'level')).toHaveText('"11"')
            await widgets(page, 4)

            await page.locator(`#${id} + .select2 .select2-selection`).click()
            await expect(page.locator('.select2-results__option')).toHaveText(['Choose a group', '11 A', '11 B', '11 C'])
            await page.locator('.select2-results__option', { hasText: '11 B' }).click()
            await expect(value(page, id)).toHaveText('"11-b"')
            await expect(rendered(page, id)).toContainText('11 B')

            await pick(page, 'level', '10')
            await expect(value(page, id)).toHaveText('""')
            await widgets(page, 4)
            await expect.poll(() => widget(page, id)).toBe('')

            await page.locator(`#${id} + .select2 .select2-selection`).click()
            await expect(page.locator('.select2-results__option')).toHaveText(['Choose a group', '10 A', '10 B'])
            await page.keyboard.press('Escape')

            await settle(page)
            expect(await ownHandlers(page, id)).toBe(1)
            expect(problems(messages)).toEqual([])
            expect(await errors(page)).toEqual([])
        })
    }
})

test.describe('#9: templates through named functions', () => {
    for (const define of ['early', 'late']) {
        test(`renders results and selection with a function defined ${define}`, async ({ page }) => {
            await page.goto(`/templates?define=${define}`)
            await widgets(page, 3)

            await expect(page.locator('#flagged + .select2 .flag')).toHaveText('EG Egypt')
            await page.locator('#flagged + .select2 .select2-selection').click()
            await expect(page.locator('.select2-results__option .flag')).toHaveText(['EG Egypt', 'JO Jordan'])
            await page.locator('.select2-results__option', { hasText: 'Jordan' }).click()
            await expect(value(page, 'country')).toHaveText('"jo"')
        })
    }
})

test('#9: data-template sets both templates', async ({ page }) => {
    await page.goto('/templates')
    await widgets(page, 3)

    await expect(page.locator('#short + .select2 .flag')).toHaveText('JO Jordan')
    await page.locator('#short + .select2 .select2-selection').click()
    await expect(page.locator('.select2-results__option .flag')).toHaveText(['EG Egypt', 'JO Jordan'])
})

test('#9: data-image shows an image before the text, without JavaScript', async ({ page }) => {
    await page.goto('/templates')
    await widgets(page, 3)

    const selection = page.locator('#imaged + .select2 .select2-selection__rendered')

    await expect(selection.locator('img.pharaonic-select2-image')).toHaveCount(1)
    await expect(selection).toHaveText('Red <b>')
    await expect(selection.locator('b')).toHaveCount(0)

    await page.locator('#imaged + .select2 .select2-selection').click()
    await expect(page.locator('.select2-results__option img')).toHaveCount(1)
    await page.locator('.select2-results__option', { hasText: 'Plain' }).click()
    await expect(value(page, 'pick')).toHaveText('"plain"')
    await expect(selection.locator('img')).toHaveCount(0)
})

test('#13: works from an ES module bundle, as with Vite, without a global $', async ({ page }) => {
    const messages = collectConsole(page)

    await page.goto('/bundle')
    await widgets(page, 3)

    expect(await page.evaluate(() => typeof window.$)).toBe('undefined')
    await pick(page, 'country', 'Egypt')
    await expect(value(page, 'country')).toHaveText('"1"')
    expect(problems(messages)).toEqual([])
})
