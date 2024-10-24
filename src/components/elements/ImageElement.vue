<template>
    <div class="min-h-[100px] relative group">
        <img v-if="element.content" :src="element.content" :style="element.style" class="max-w-full object-contain"
            alt="Yüklenen görsel" />
        <div v-else
            class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400"
            :class="{ 'cursor-pointer': !isPreviewMode }" @click="!isPreviewMode && triggerFileInput">
            <span class="material-icons-outlined mr-2">image</span>
            Görsel Yükleyin
        </div>
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload">
    </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
    element: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update'])
const isPreviewMode = inject('isPreviewMode', false)
const fileInput = ref(null)

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                const maxWidth = 800
                const aspectRatio = img.width / img.height

                let width = Math.min(img.width, maxWidth)
                let height = width / aspectRatio

                emit('update', {
                    ...props.element,
                    content: e.target.result,
                    style: {
                        ...props.element.style,
                        width: `${width}px`,
                        height: `${height}px`
                    }
                })
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
}
</script>