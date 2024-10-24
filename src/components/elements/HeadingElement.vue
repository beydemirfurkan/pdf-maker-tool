<template>
    <component :is="headingTag" :style="element.style" :contenteditable="!isPreviewMode" @input="handleInput"
        @blur="handleBlur" class="outline-none focus:outline-none font-bold">
        {{ element.content || 'Başlık girin...' }}
    </component>
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

const headingTag = computed(() => {
    return props.element.headingLevel || 'h2'
})

const handleInput = (event) => {
    emit('update', {
        ...props.element,
        content: event.target.textContent
    })
}

const handleBlur = (event) => {
    if (!event.target.textContent.trim()) {
        event.target.textContent = 'Başlık girin...'
    }
}
</script>