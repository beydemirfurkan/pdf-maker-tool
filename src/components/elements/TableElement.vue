<template>
    <div class="min-h-[100px] overflow-auto">
        <table class="w-full border-collapse">
            <tbody>
                <tr v-for="(row, rowIndex) in element.content" :key="rowIndex">
                    <td v-for="(cell, colIndex) in row" :key="colIndex" class="border p-2" :style="element.style">
                        <div :contenteditable="!isPreviewMode"
                            @input="(e) => updateCell(rowIndex, colIndex, e.target.textContent)" @blur="handleCellBlur"
                            class="outline-none focus:outline-none min-w-[50px]">
                            {{ cell }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="!isPreviewMode" class="mt-2 flex gap-2">
            <button @click="addRow" class="text-sm text-blue-500 hover:text-blue-700">
                + Satır Ekle
            </button>
            <button @click="addColumn" class="text-sm text-blue-500 hover:text-blue-700">
                + Sütun Ekle
            </button>
        </div>
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

const updateCell = (rowIndex, colIndex, content) => {
    const newContent = JSON.parse(JSON.stringify(props.element.content))
    newContent[rowIndex][colIndex] = content
    emit('update', {
        ...props.element,
        content: newContent
    })
}

const handleCellBlur = (event) => {
    if (!event.target.textContent.trim()) {
        event.target.textContent = ' '
    }
}

const addRow = () => {
    const newContent = JSON.parse(JSON.stringify(props.element.content))
    const newRow = Array(newContent[0].length).fill('')
    newContent.push(newRow)
    emit('update', {
        ...props.element,
        content: newContent
    })
}

const addColumn = () => {
    const newContent = JSON.parse(JSON.stringify(props.element.content))
    newContent.forEach(row => row.push(''))
    emit('update', {
        ...props.element,
        content: newContent
    })
}
</script>