<template>
    <div class="min-h-[30px]">
        <p :style="element.style" :contenteditable="!isPreviewMode" @input="handleInput" @blur="handleBlur"
            class="outline-none focus:outline-none">
            {{ element.content || 'Metin girin...' }}
        </p>
    </div>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
    element: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update'])
const isPreviewMode = inject('isPreviewMode', false)

const handleInput = (event) => {
    emit('update', {
        ...props.element,
        content: event.target.textContent
    })
}

const handleBlur = (event) => {
    if (!event.target.textContent.trim()) {
        event.target.textContent = 'Metin girin...'
    }
}
</script>