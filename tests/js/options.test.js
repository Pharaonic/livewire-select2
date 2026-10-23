import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createFunctions } from '../../resources/js/functions.js'
import { modelBinding } from '../../resources/js/livewire.js'
import { buildOptions, withImage } from '../../resources/js/options.js'
import { setup } from './helpers.js'

// Options without the default image templates, which every select gets.
const plain = ({ templateResult, templateSelection, ...rest }) => {
    assert.equal(templateResult, withImage)
    assert.equal(templateSelection, withImage)

    return rest
}

const build = (html, options = {}, functions = createFunctions()) => {
    const page = setup(html)

    return buildOptions({ element: page.document.body.firstElementChild, options, functions, jQuery: page.win.jQuery })
}

test('define validates names and functions', () => {
    const functions = createFunctions()

    assert.throws(() => functions.define('', () => {}), { code: 'invalid-function' })
    assert.throws(() => functions.define('-bad', () => {}), { code: 'invalid-function' })
    assert.throws(() => functions.define('flag', 'nope'), { code: 'invalid-function' })
})

test('define is idempotent for the same function and rejects another one', () => {
    const functions = createFunctions()
    const flag = () => 'flag'
    const defined = []

    functions.onDefine((name) => defined.push(name))
    functions.define(' flag ', flag)
    functions.define('flag', flag)

    assert.equal(functions.get('flag'), flag)
    assert.deepEqual(defined, ['flag'])
    assert.throws(() => functions.define('flag', () => 'other'), { code: 'function-conflict' })
})

test('turns the shorthand attributes on by their presence', () => {
    const { options } = build('<select data-tags data-search-off data-clear data-parent="body"></select>')

    assert.equal(options.tags, true)
    assert.equal(options.minimumResultsForSearch, -1)
    assert.equal(options.allowClear, true)
    assert.equal(options.dropdownParent.length, 1)
    assert.equal(options.dropdownParent[0].tagName, 'BODY')
})

test('turns shorthands off with an explicit "false"', () => {
    const { options } = build('<select data-tags="false" data-clear="FALSE" data-search-off="false" data-parent="false"></select>')

    assert.deepEqual(plain(options), { tags: false, allowClear: false })
})

test('accepts any other value as on', () => {
    const { options } = build('<select data-tags="true" data-clear="1" data-search-off="yes"></select>')

    assert.deepEqual(plain(options), { tags: true, allowClear: true, minimumResultsForSearch: -1, placeholder: '' })
})

test('lets data-options override shorthands without sharing the parsed object', () => {
    const source = { tags: false, width: '300px' }
    const { options } = build('<select data-tags></select>', source)

    assert.deepEqual(plain(options), { tags: false, width: '300px' })
    assert.notEqual(options, source)
})

test('opens in the closest modal or dialog for data-parent without a value', () => {
    for (const [html, id] of [
        ['<div class="modal" id="m"><div><select data-parent></select></div></div>', 'm'],
        ['<dialog id="d" open><select data-parent></select></dialog>', 'd'],
        ['<div role="dialog" id="r"><select data-parent></select></div>', 'r'],
    ]) {
        const page = setup(html)
        const { options } = buildOptions({ element: page.document.querySelector('select'), options: {}, functions: createFunctions(), jQuery: page.win.jQuery })

        assert.equal(options.dropdownParent[0].id, id)
    }

    assert.equal('dropdownParent' in build('<select data-parent></select>').options, false)
})

test('uses data-template for both templates, below data-options', () => {
    const functions = createFunctions()
    const flag = () => 'flag'
    const plainText = () => 'plain'

    functions.define('flag', flag)
    functions.define('plain', plainText)

    const both = build('<select data-template="flag"></select>', {}, functions).options
    const mixed = build('<select data-template="flag"></select>', { templateSelection: 'plain' }, functions).options

    assert.equal(both.templateResult, flag)
    assert.equal(both.templateSelection, flag)
    assert.equal(mixed.templateResult, flag)
    assert.equal(mixed.templateSelection, plainText)
    assert.deepEqual(build('<select data-template="later"></select>').missing, ['later'])
})

test('keeps templates the select defines instead of the image templates', () => {
    const functions = createFunctions()
    const flag = () => 'flag'

    functions.define('flag', flag)

    assert.equal(build('<select></select>', { templateResult: 'flag' }, functions).options.templateResult, flag)
    assert.equal(build('<select></select>', { templateResult: 'flag' }, functions).options.templateSelection, withImage)
})

test('renders data-image before the text with DOM nodes, and plain text otherwise', () => {
    const page = setup('<select><option id="a" data-image="/flags/eg.svg">Egypt &lt;b&gt;</option><option id="b">Jordan</option></select>')
    const imaged = withImage({ element: page.document.getElementById('a'), text: 'Egypt <b>' })

    assert.equal(imaged.tagName, 'SPAN')
    assert.equal(imaged.querySelector('img').getAttribute('src'), '/flags/eg.svg')
    assert.equal(imaged.querySelector('img').getAttribute('alt'), '')
    assert.equal(imaged.textContent, 'Egypt <b>')
    assert.equal(imaged.querySelector('b'), null)
    assert.equal(withImage({ element: page.document.getElementById('b'), text: 'Jordan' }), 'Jordan')
    assert.equal(withImage({ id: '', text: 'Choose' }), 'Choose')
})

test('drops a dropdown parent that matches nothing', () => {
    const { options } = build('<select></select>', { dropdownParent: '#missing' })

    assert.equal('dropdownParent' in options, false)
})

test('gives allowClear an empty placeholder only when none is set', () => {
    assert.equal(build('<select data-clear></select>').options.placeholder, '')
    assert.equal(build('<select></select>', { allowClear: true, placeholder: 'Pick' }).options.placeholder, 'Pick')
    assert.equal('placeholder' in build('<select></select>').options, false)
})

test('resolves named functions, including nested ajax callbacks', () => {
    const functions = createFunctions()
    const flag = () => 'flag'
    const results = () => ({ results: [] })

    functions.define('flag', flag)
    functions.define('results', results)

    const { options, missing } = build('<select></select>', {
        templateResult: 'flag',
        templateSelection: ' flag ',
        ajax: { url: '/countries', processResults: 'results' },
    }, functions)

    assert.equal(options.templateResult, flag)
    assert.equal(options.templateSelection, flag)
    assert.equal(options.ajax.processResults, results)
    assert.equal(options.ajax.url, '/countries')
    assert.deepEqual(missing, [])
})

test('reports each missing function once', () => {
    const { missing } = build('<select></select>', { templateResult: 'flag', templateSelection: 'flag', matcher: 'match' })

    assert.deepEqual(missing, ['flag', 'match'])
})

test('reads wire:model with Livewire 2 semantics: live unless deferred', () => {
    const page = setup('<select id="a" wire:model="country"></select><select id="b" wire:model.lazy="a.b"></select><select id="c" wire:model.debounce.500ms="c"></select><select id="d" wire:model=" "></select><select id="e"></select><select id="f" wire:model.defer="f"></select>')
    const binding = (id) => modelBinding(page.document.getElementById(id))

    assert.deepEqual(binding('a'), { property: 'country', live: true })
    assert.deepEqual(binding('b'), { property: 'a.b', live: true })
    assert.deepEqual(binding('c'), { property: 'c', live: true })
    assert.deepEqual(binding('f'), { property: 'f', live: false })
    assert.equal(binding('d'), null)
    assert.equal(binding('e'), null)
})
