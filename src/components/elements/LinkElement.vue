<template>
    <div class="min-h-[30px] flex items-center gap-2">
        <a :href="element.href" :style="element.style" :target="isPreviewMode ? '_blank' : undefined"
            :class="{ 'pointer-events-none': !isPreviewMode }" class="hover:opacity-80">
            {{ element.text || 'Bağlantı metni' }}
        </a>
        <div v-if="!isPreviewMode" class="flex items-center gap-2">
            <input v-model="localText" @input="updateLink" placeholder="Bağlantı Metni"
                class="px-2 py-1 border rounded text-sm">
            <input v-model="localHref" @input="updateLink" placeholder="https://example.com"
                class="px-2 py-1 border rounded text-sm">
        </div>
    </div>
</template>

<script setup>
import { ref, inject, watch } from 'vue'

const props = defineProps({
    element: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update'])
const isPreviewMode = inject('isPreviewMode', false)

const localText = ref(props.element.text || '')
const localHref = ref(props.element.href || '')

watch(() => props.element, (newElement) => {
    localText.value = newElement.text || ''
    localHref.value = newElement.href || ''
}, { deep: true })

const updateLink = () => {
    emit('update', {
        ...props.element,
        text: localText.value,
        href: localHref.value
    })
}
</script>