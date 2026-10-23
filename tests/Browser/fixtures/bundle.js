/*
 * An application bundle as Vite builds it: jQuery and Select2 from npm, the
 * Assistant and this package from their ES modules. Nothing defines `$`.
 */
import jQuery from 'jquery'
import select2 from 'select2'
import '../../../vendor/pharaonic/livewire-assistant/dist/livewire-assistant.esm.js'
import '../../../dist/livewire-select2.esm.js'

window.jQuery = jQuery
select2()
