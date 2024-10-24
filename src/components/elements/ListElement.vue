<template>
    <div class="min-h-[50px]">
        <ul :class="listClass" :style="element.style">
            <li v-for="(item, index) in element.content" :key="index" class="flex items-center gap-2 min-h-[24px]">
                <div :contenteditable="!isPreviewMode" @input="(e) => updateItem(index, e.target.textContent)"
                    @keydown.enter.prevent="addItem(index)" @keydown.backspace="handleBackspace($event, index)"
                    class="outline-none focus:outline-none flex-1">
                    {{ item }}
                </div>
                <button v-if="!isPreviewMode" @click="removeItem(index)"
                    class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700">
                    <span class="material-icons-outlined text-sm">close</span>
                </button>
            </li>
        </ul>
        <button v-if="!isPreviewMode" @click="addItem(element.content.length)"
            class="mt-2 text-sm text-blue-500 hover:text-blue-700">
            + Yeni Öğe Ekle
        </button>
    </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
    element: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update'])
const isPreviewMode = inject('isPreviewMode', false)

const listClass = computed(() => {
    const type = props.element.style.listStyleType || 'disc'
    return `list-${type} list-inside`
})

const updateItem = (index, content) => {
    const newContent = [...props.element.content]
    newContent[index] = content
    emit('update', {
        ...props.element,
        content: newContent
    })
}

const addItem = (index) => {
    const newContent = [...props.element.content]
    newContent.splice(index + 1, 0, '')
    emit('update', {
        ...props.element,
        content: newContent
    })
}

const removeItem = (index) => {
    if (props.element.content.length > 1) {
        const newContent = props.element.content.filter((_, i) => i !== index)
        emit('update', {
            ...props.element,
            content: newContent
        })
    }
}

const handleBackspace = (event, index) => {
    if (event.target.textContent === '' && props.element.content.length > 1) {
        event.preventDefault()
        removeItem(index)
    }
}
</script>