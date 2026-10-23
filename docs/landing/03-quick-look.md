---
view: components.packages.quick-look
title: A quick look
subtitle: Mark the select and bind it; the widget follows the property both ways.
file: resources/views/livewire/profile.blade.php
language: blade
code: |
  <div wire:ignore>
      <select data-pharaonic="select2" wire:model="country"
              data-placeholder="Choose a country" data-clear>
          <option value=""></option>
          @foreach ($countries as $id => $name)
              <option value="{{ $id }}">{{ $name }}</option>
          @endforeach
      </select>
  </div>
---
