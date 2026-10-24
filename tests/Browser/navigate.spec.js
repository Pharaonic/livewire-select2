import { expect, test } from '@playwright/test'
import { collectConsole, errors, ownHandlers, pick, problems, settle, value, widget, widgets } from './helpers.js'

test('mounts widgets after wire:navigate visits and back, once each', async ({ page }) => {
    const messages = collectConsole(page)

    await page.goto('/navigate-one')
    await widgets(page, 3)

    await page.click('#to-two')
    await expect(page.locator('#rows-value')).toBeVisible()
    await widgets(page, 1)
    await pick(page, 'row-0', 'Paper')
    await expect(value(page, 'rows')).toHaveText('[{"product":"p2"}]')

    await page.goBack()
    await expect(page.locator('#country-value')).toBeVisible()
    await widgets(page, 3)
    expect(await widget(page, 'country')).toBe('2')
    expect(await ownHandlers(page, 'country')).toBe(1)

    await pick(page, 'country', 'Egypt')
    await expect(value(page, 'country')).toHaveText('"1"')
    await settle(page)

    expect(await page.evaluate(() => document.querySelectorAll('script[src*="livewire-select2/select2.js"]').length)).toBe(1)
    expect(problems(messages)).toEqual([])
    expect(await errors(page)).toEqual([])
})
