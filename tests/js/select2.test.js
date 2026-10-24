import assert from 'node:assert/strict'
import { test } from 'node:test'
import { modelBinding } from '../../resources/js/livewire.js'
import { component, setup } from './helpers.js'

const COUNTRIES = `
    <option value="">Choose</option>
    <option value="0">Zero Land</option>
    <option value="1">Egypt</option>
    <option value="2">Jordan</option>`

const ownHandlers = (page, element) => {
    const events = page.win.jQuery._data(element, 'events') || {}

    return Object.values(events).flat().filter((handler) => handler.namespace === 'pharaonicSelect2').length
}

test('shows the initial Livewire value', () => {
    const page = setup(`<select id="country">${COUNTRIES}</select>`)
    const { $ } = page.mount('#country', { property: 'country', bound: component({ country: 2 }) })

    assert.equal($.val(), '2')
})

test('writes a user change once, live, and never echoes a server value', () => {
    const page = setup(`<select id="country">${COUNTRIES}</select>`)
    const bound = component({ country: '2' })
    const { $ } = page.mount('#country', { property: 'country', bound })

    $.val('1').trigger('change')
    assert.deepEqual(bound.writes, [['country', '1', { live: true }]])

    for (const [value, shown] of [[null, ''], ['', ''], [0, '0'], ['2', '2']]) {
        bound.serverSets('country', value)
        assert.equal($.val(), shown)
    }

    assert.equal(bound.writes.length, 1)
})

test('does not write a value Livewire already holds', () => {
    const page = setup(`<select id="country">${COUNTRIES}</select>`)
    const bound = component({ country: 0 })
    const { $ } = page.mount('#country', { property: 'country', bound })

    $.trigger('change')
    assert.deepEqual(bound.writes, [])
})

test('keeps tags off for data-tags="false" although Select2 reads "false" as on', () => {
    const page = setup('<select id="plain" data-tags="false"></select>')
    const { element, $ } = page.mount('#plain')

    assert.equal($.data('select2').options.get('tags'), false)
    assert.equal(element.getAttribute('data-tags'), 'false')
})

test('binds wire:model when there is no data-property, and data-property wins', () => {
    const page = setup(`<select id="a" wire:model="country">${COUNTRIES}</select><select id="b" wire:model="ignored">${COUNTRIES}</select>`, { modelBinding })
    const a = page.mount('#a', { bound: component({ country: '1' }) })
    const b = page.mount('#b', { property: 'chosen', bound: component({ chosen: '2', ignored: '0' }) })

    assert.equal(a.$.val(), '1')
    assert.equal(b.$.val(), '2')

    a.$.val('2').trigger('change')
    b.$.val('1').trigger('change')
    // Plain wire:model is deferred on Livewire 3; data-property is always live.
    assert.deepEqual(a.component.writes, [['country', '2', { live: false }]])
    assert.deepEqual(b.component.writes, [['chosen', '1', { live: true }]])
})

test('fires a native change for wire:change once the value is written, and ignores it itself', async () => {
    const page = setup(`<select id="a" wire:model.live="country" wire:change="countryChanged">${COUNTRIES}</select><select id="b" wire:model.live="country">${COUNTRIES}</select>`, { modelBinding })
    const a = page.mount('#a', { bound: component({ country: '1' }) })
    const b = page.mount('#b', { bound: component({ country: '1' }) })
    const native = { a: 0, b: 0 }

    a.element.addEventListener('change', () => native.a++)
    b.element.addEventListener('change', () => native.b++)

    a.$.val('2').trigger('change')
    b.$.val('2').trigger('change')
    assert.equal(native.a, 0, 'not before the write has finished')

    await new Promise((resolve) => setTimeout(resolve, 0))

    assert.equal(native.a, 1)
    assert.equal(native.b, 0)
    assert.deepEqual(a.component.writes, [['country', '2', { live: true }]])
})

test('writes plain wire:model as a deferred update, and still fires wire:change after it', async () => {
    const page = setup(`<select id="a" wire:model="country" wire:change="countryChanged">${COUNTRIES}</select>`, { modelBinding })
    const { element, $, component: bound } = page.mount('#a', { bound: component({ country: '1' }) })
    let native = 0

    element.addEventListener('change', () => native++)
    $.val('2').trigger('change')
    await new Promise((resolve) => setTimeout(resolve, 0))

    assert.deepEqual(bound.writes, [['country', '2', { live: false }]])
    assert.equal(native, 1)
})

test('lets Select2 observe its select inside wire:ignore only', () => {
    const page = setup(`<div wire:ignore><select id="a">${COUNTRIES}</select></div><div><select id="b">${COUNTRIES}</select></div>`)
    const a = page.mount('#a')
    const b = page.mount('#b')

    a.element.appendChild(page.document.createElement('option'))
    b.element.appendChild(page.document.createElement('option'))

    assert.ok(a.$.data('select2')._observer.takeRecords().length > 0)
    assert.equal(b.$.data('select2')._observer.takeRecords().length, 0)
})

test('fires wire:change for a select without a binding', async () => {
    const page = setup(`<select id="a" wire:change.prevent="picked">${COUNTRIES}</select>`)
    const { element, $ } = page.mount('#a')
    let native = 0

    element.addEventListener('change', () => native++)
    $.val('2').trigger('change')
    await new Promise((resolve) => setTimeout(resolve, 0))

    assert.equal(native, 1)
})

test('renders a widget without binding when there is no property', () => {
    const page = setup(`<select id="plain">${COUNTRIES}</select>`)
    const { element, component: bound } = page.mount('#plain')

    assert.ok(element.classList.contains('select2-hidden-accessible'))
    assert.deepEqual(bound.watchers, [])
})

test('cleanup removes only its own handlers and restores the select', () => {
    const page = setup(`<select id="country">${COUNTRIES}</select>`)
    const { element, $, cleanup } = page.mount('#country', { property: 'country', bound: component({ country: '1' }) })
    let consumer = 0

    $.on('change.consumer', () => consumer++)
    assert.equal(ownHandlers(page, element), 1)

    cleanup()
    assert.equal(ownHandlers(page, element), 0)
    assert.equal(element.classList.contains('select2-hidden-accessible'), false)
    assert.equal(page.document.querySelectorAll('.select2-container').length, 0)

    $.trigger('change')
    assert.equal(consumer, 1)
})

test('update rebuilds a widget whose markup a morph removed, keeping one handler', () => {
    const page = setup(`<div id="field"><select id="country">${COUNTRIES}</select></div>`)
    const bound = component({ country: '1' })
    const { element, $ } = page.mount('#country', { property: 'country', bound })

    // What Livewire does to a select outside wire:ignore.
    element.nextElementSibling.remove()
    element.removeAttribute('class')
    element.removeAttribute('data-select2-id')
    element.innerHTML = '<option value="">Choose</option><option value="5">Libya</option>'
    bound.data.country = '5'

    page.integration.update({ element })

    assert.ok(element.classList.contains('select2-hidden-accessible'))
    assert.equal(page.document.querySelectorAll('.select2-container').length, 1)
    assert.equal($.val(), '5')
    assert.equal(ownHandlers(page, element), 1)

    page.integration.update({ element })
    assert.equal(page.document.querySelectorAll('.select2-container').length, 1)
})

test('waits for a named function, warns once, and remounts when it is defined', () => {
    const page = setup('<select id="a"></select><select id="b"></select>')
    const a = page.mount('#a', { options: { templateResult: 'flag' } })
    const b = page.mount('#b', { options: { templateResult: 'flag' } })

    assert.equal(a.element.classList.contains('select2-hidden-accessible'), false)
    assert.equal(page.warnings.length, 1)
    assert.match(page.warnings[0], /"flag"/)

    b.cleanup()
    page.functions.define('flag', () => 'x')

    assert.deepEqual(page.assistantCalls, [['destroy', a.element], ['scan', a.element]])
})

test('waits for jQuery and Select2 until the page has loaded', () => {
    const page = setup('<select id="a"></select>', { withSelect2: false, readyState: 'loading' })
    const { element } = page.mount('#a')

    page.loadSelect2()
    page.win.dispatchEvent(new page.win.Event('load'))

    assert.deepEqual(page.assistantCalls, [['destroy', element], ['scan', element]])
})

test('fails clearly when Select2 is still missing after the page has loaded', () => {
    const page = setup('<select id="a"></select>', { withSelect2: false })

    assert.throws(() => page.mount('#a'), { code: 'select2-missing' })
})
