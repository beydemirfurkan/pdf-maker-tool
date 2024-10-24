<template>
    <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" v-if="element">
        <div class="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Düzenle: {{ elementTypeLabel }}</h3>
                <button @click="close" class="text-gray-500 hover:text-gray-700">
                    <span class="material-icons">close</span>
                </button>
            </div>

            <!-- Metin/Başlık Düzenleme -->
            <div v-if="['text', 'heading'].includes(element.type)" class="space-y-4">
                <div>
                    <Label>İçerik</Label>
                    <textarea v-model="elementData.content" class="w-full min-h-[100px] p-2 border rounded"
                        @input="updateElement"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Yazı Boyutu</Label>
                        <Input type="number" v-model.number="elementData.style.fontSize" @input="updateElement" min="8"
                            max="72" />
                    </div>
                    <div>
                        <Label>Renk</Label>
                        <Input type="color" v-model="elementData.style.color" @input="updateElement" />
                    </div>
                </div>

                <div class="flex space-x-2">
                    <Button variant="outline" @click="toggleStyle('bold')"
                        :class="{ 'bg-gray-200': elementData.style.fontWeight === 'bold' }">
                        <span class="material-icons">format_bold</span>
                    </Button>
                    <Button variant="outline" @click="toggleStyle('italic')"
                        :class="{ 'bg-gray-200': elementData.style.fontStyle === 'italic' }">
                        <span class="material-icons">format_italic</span>
                    </Button>
                    <Button variant="outline" @click="toggleStyle('underline')"
                        :class="{ 'bg-gray-200': elementData.style.textDecoration === 'underline' }">
                        <span class="material-icons">format_underlined</span>
                    </Button>
                </div>
            </div>

            <!-- Görsel Düzenleme -->
            <div v-if="element.type === 'image'" class="space-y-4">
                <div>
                    <Label>Görsel Yükle</Label>
                    <Input type="file" accept="image/*" @change="handleImageUpload" />
                </div>
                <div v-if="elementData.content" class="aspect-video relative">
                    <img :src="elementData.content" class="w-full h-full object-contain" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Genişlik</Label>
                        <Input type="number" v-model.number="elementData.style.width" @input="updateElement" />
                    </div>
                    <div>
                        <Label>Yükseklik</Label>
                        <Input type="number" v-model.number="elementData.style.height" @input="updateElement" />
                    </div>
                </div>
            </div>

            <div class="mt-6 flex justify-end space-x-2">
                <Button variant="outline" @click="close">İptal</Button>
                <Button @click="save">Kaydet</Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps({
    element: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update', 'close'])

const elementData = ref(null)

// Element verilerini kopyala
watch(() => props.element, (newElement) => {
    if (newElement) {
        elementData.value = JSON.parse(JSON.stringify(newElement))
    }
}, { immediate: true })

const elementTypeLabel = computed(() => {
    const labels = {
        text: 'Metin',
        heading: 'Başlık',
        image: 'Görsel',
        list: 'Liste',
        table: 'Tablo'
    }
    return labels[props.element?.type] || ''
})

const toggleStyle = (style) => {
    switch (style) {
        case 'bold':
            elementData.value.style.fontWeight =
                elementData.value.style.fontWeight === 'bold' ? 'normal' : 'bold'
            break
        case 'italic':
            elementData.value.style.fontStyle =
                elementData.value.style.fontStyle === 'italic' ? 'normal' : 'italic'
            break
        case 'underline':
            elementData.value.style.textDecoration =
                elementData.value.style.textDecoration === 'underline' ? 'none' : 'underline'
            break
    }
    updateElement()
}

const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            elementData.value.content = e.target.result
            updateElement()
        }
        reader.readAsDataURL(file)
    }
}

const updateElement = () => {
    emit('update', elementData.value)
}

const save = () => {
    emit('update', elementData.value)
    emit('close')
}

const close = () => {
    emit('close')
}
</script>