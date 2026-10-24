<div>
    <output id="draft-value">{{ json_encode($draft) }}</output>
    <output id="saved-value">{{ json_encode($saved) }}</output>
    <output id="topics-value">{{ json_encode($topics) }}</output>

    <div wire:ignore>
        <select id="draft" data-pharaonic="select2" wire:model="draft">
            <option value="">Choose</option>
            <option value="a">A</option>
            <option value="b">B</option>
        </select>
    </div>

    <div wire:ignore>
        <select id="topic" data-pharaonic="select2" wire:model="topic" wire:change="topicChanged">
            <option value="">Choose</option>
            <option value="news">News</option>
            <option value="sport">Sport</option>
        </select>
    </div>

    <button id="save" wire:click="save">save</button>
</div>
