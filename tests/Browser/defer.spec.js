import { expect, test } from '@playwright/test'
import { pick, settle, value, widgets } from './helpers.js'

const messages = (page) => {
    const sent = []

    page.on('request', (request) => request.url().includes('/livewire/message/') && sent.push(request.postDataJSON()))

    return sent
}

test.beforeEach(async ({ page }) => {
    await page.goto('/defer')
    await widgets(page, 2)
})

test('wire:model.defer sends nothing until the next request', async ({ page }) => {
    const sent = messages(page)

    await pick(page, 'draft', 'B')
    await settle(page)
    expect(sent).toHaveLength(0)
    await expect(value(page, 'draft')).toHaveText('""')

    await page.click('#save')
    await expect(page.locator('#saved-value')).toHaveText('"b"')
    expect(sent).toHaveLength(1)
})

test('wire:change on a deferred select carries the new value in its request', async ({ page }) => {
    const sent = messages(page)

    await pick(page, 'topic', 'Sport')
    await expect(page.locator('#topics-value')).toHaveText('["sport"]')
    await settle(page)
    expect(sent).toHaveLength(1)

    await pick(page, 'topic', 'News')
    await expect(page.locator('#topics-value')).toHaveText('["sport","news"]')
})
