<script>document.addEventListener("DOMContentLoaded",e=>{if(void 0===a)var a={};var t={Select2:{init:function(){$('[data-pharaonic="select2"]:not("[data-select2-id]")').each(function(){a.Select2.load($(this),$(this).is("[data-component-id]")?$(this).data("component-id"):null)})},load:function(e,a){if(a){var t={multiple:$(e).is("[multiple]"),placeholder:$(e).is("[data-placeholder]")?$(e).data("placeholder"):"Select an option",language:$(e).is("[data-language]")?$(e).data("language"):"en",dir:$(e).is("[data-dir]")?$(e).data("dir"):"ltr",dropdownParent:$(e).is("[data-parent]")?$($(e).data("parent")):null,minimumResultsForSearch:$(e).is("[data-search-off]")?-1:0},d=e[0].attributes,i=d.getNamedItem("wire:model")||d.getNamedItem("wire:model.defer")||null;if(delete d,e=$(e).select2(t),i){var n=i.value,l=i.name.search("defer")>0;e.on("select2:select",function(){Livewire.first(a).set(n,$(e).val(),l)})}}}}};Object.assign(a,t),$(document).ready(function(){a.Select2.init()}),window.addEventListener("pharaonic.select2.load",e=>{a.Select2.load(e.detail.target,e.detail.component)})});</script>
