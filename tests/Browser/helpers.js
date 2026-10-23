import { expect } from '@playwright/test'

export const value = (page, id) => page.locator(`#${id}-value`)
export const widget = (page, id) => page.evaluate((selectId) => window.jQuery(`#${selectId}`).val(), id)
export const rendered = (page, id) => page.locator(`#${id} + .select2 .select2-selection__rendered`)
export const errors = (page) => page.evaluate(() => window.fixtureErrors)

/**
 * Wait until `count` Select2 widgets exist on the page. An open dropdown is a
 * `.select2-container` too, but only widgets carry the `select2` class.
 */
export async function widgets(page, count) {
    await expect(page.locator('span.select2.select2-container')).toHaveCount(count)
}

export async function pick(page, selectId, optionText) {
    await page.locator(`#${selectId} + .select2 .select2-selection`).click()
    await page.locator('.select2-results__option', { hasText: optionText }).first().click()
}

export async function settle(page) {
    // Livewire debounces messages by 5ms; wait for the request and the morph.
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 20)))
}

// Our handlers only: Select2 keeps its own namespaced handlers on the element.
export const ownHandlers = (page, id) => page.evaluate((selectId) => {
    const events = window.jQuery._data(document.getElementById(selectId), 'events') || {}

    return Object.values(events).flat().filter((handler) => handler.namespace === 'pharaonicSelect2').length
}, id)

export function collectConsole(page) {
    const messages = []

    page.on('console', (message) => messages.push({ type: message.type(), text: message.text() }))
    page.on('pageerror', (error) => messages.push({ type: 'pageerror', text: error.message }))

    return messages
}

export const problems = (messages) => messages.filter((message) => message.type === 'error' || message.type === 'pageerror' || message.type === 'warning')
