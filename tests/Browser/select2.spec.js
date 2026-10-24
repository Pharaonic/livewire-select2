import { expect, test } from '@playwright/test'
import { collectConsole, errors, ownHandlers, pick, problems, rendered, settle, value, widget, widgets } from './helpers.js'

test.beforeEach(async ({ page }) => {
    await page.goto('/select2')
    await widgets(page, 3)
})

test('reflects the initial Livewire value', async ({ page }) => {
    expect(await widget(page, 'country')).toBe('2')
    await expect(rendered(page, 'country')).toContainText('Jordan')
    expect(await widget(page, 'tags')).toEqual(['a'])
    expect(await widget(page, 'size')).toBe('')
})

test('writes user changes to the bound property', async ({ page }) => {
    await pick(page, 'country', 'Egypt')
    await expect(value(page, 'country')).toHaveText('"1"')
    await settle(page)
    expect(await widget(page, 'country')).toBe('1')
})

test('applies server-originated values', async ({ page }) => {
    const cases = [
        ['set-null', 'null', ''],
        ['set-three', '"3"', '3'],
        ['set-zero', '0', '0'],
        ['set-empty', '""', ''],
    ]

    for (const [button, server, shown] of cases) {
        await page.click(`#${button}`)
        await expect(value(page, 'country')).toHaveText(server)
        await expect.poll(() => widget(page, 'country')).toBe(shown)
    }
})

test('does not send a server value back to the server', async ({ page }) => {
    const requests = []

    page.on('request', (request) => /\/livewire[^/]*\/update/.test(request.url()) && requests.push(request.postData()))

    await page.click('#set-three')
    await expect.poll(() => widget(page, 'country')).toBe('3')
    await settle(page)

    expect(requests).toHaveLength(1)
})

test('selects "0" without losing it to truthiness', async ({ page }) => {
    await pick(page, 'country', 'Zero Land')
    await expect(value(page, 'country')).toHaveText('"0"')
})

test('clears with allowClear', async ({ page }) => {
    await page.locator('#country + .select2 .select2-selection__clear').click()
    await expect(value(page, 'country')).toHaveText('""')
})

test('synchronizes multiple selection both ways', async ({ page }) => {
    await pick(page, 'tags', 'B')
    await expect(value(page, 'tags')).toHaveText('["a","b"]')

    await page.click('#set-tags')
    await expect(value(page, 'tags')).toHaveText('["b","c"]')
    await expect.poll(() => widget(page, 'tags')).toEqual(['b', 'c'])
})

test('binds a dot path', async ({ page }) => {
    await pick(page, 'size', 'Medium')
    await expect(value(page, 'size')).toHaveText('"m"')
})

test('keeps one widget and one handler across repeated renders', async ({ page }) => {
    for (let render = 2; render <= 5; render++) {
        await page.click('#refresh')
        await expect(page.locator('#renders')).toHaveText(String(render))
    }

    await settle(page)
    await widgets(page, 3)
    expect(await ownHandlers(page, 'country')).toBe(1)
})

test('cleans up removed elements and mounts them again when they return', async ({ page }) => {
    await page.click('#toggle')
    await expect(page.locator('#country')).toHaveCount(0)
    await widgets(page, 2)

    await page.click('#toggle')
    await widgets(page, 3)
    expect(await widget(page, 'country')).toBe('2')
    expect(await ownHandlers(page, 'country')).toBe(1)
})

test('does not log console errors or warnings during normal use', async ({ page }) => {
    const messages = collectConsole(page)

    await pick(page, 'country', 'Morocco')
    await page.click('#refresh')
    await settle(page)

    expect(problems(messages)).toEqual([])
    expect(await errors(page)).toEqual([])
})
