<template>
  <div class="h-screen flex bg-gray-50">
    <div class="w-64 border-r bg-white shadow-lg p-4 flex flex-col">
      <h2 class="text-xl font-bold mb-6">PDF Düzenleyici</h2>

      <div class="grid grid-cols-2 gap-3 mb-6">
        <button @click="addElement('text')"
          class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <span class="material-icons-outlined mb-2">text_fields</span>
          <span class="text-sm">Metin</span>
        </button>

        <button @click="addElement('heading')"
          class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <span class="material-icons-outlined mb-2">title</span>
          <span class="text-sm">Başlık</span>
        </button>

        <button @click="addElement('image')"
          class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <span class="material-icons-outlined mb-2">image</span>
          <span class="text-sm">Görsel</span>
        </button>

        <button @click="addElement('shape')"
          class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <span class="material-icons-outlined mb-2">category</span>
          <span class="text-sm">Şekil</span>
        </button>

        <button @click="addElement('table')"
          class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <span class="material-icons-outlined mb-2">table_chart</span>
          <span class="text-sm">Tablo</span>
        </button>

        <button @click="addElement('list')"
          class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <span class="material-icons-outlined mb-2">format_list_bulleted</span>
          <span class="text-sm">Liste</span>
        </button>
      </div>

      <div class="border-t pt-6">
        <h3 class="text-sm font-semibold mb-4">Sayfa Ayarları</h3>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Sayfa Boyutu</label>
            <select v-model="pageSettings.size"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="a4">A4</option>
              <option value="a3">A3</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Sayfa Yönü</label>
            <select v-model="pageSettings.orientation"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="portrait">Dikey</option>
              <option value="landscape">Yatay</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Kenar Boşlukları</label>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="pageSettings.margins.top" type="number" placeholder="Üst"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0">
              <input v-model="pageSettings.margins.right" type="number" placeholder="Sağ"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0">
              <input v-model="pageSettings.margins.bottom" type="number" placeholder="Alt"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0">
              <input v-model="pageSettings.margins.left" type="number" placeholder="Sol"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0">
            </div>
          </div>
        </div>
      </div>

      <div class="border-t pt-6 mt-6">
        <h3 class="text-sm font-semibold mb-4">Hazır Şablonlar</h3>
        <div class="space-y-2">
          <button v-for="template in templates" :key="template.id" @click="loadTemplate(template)"
            class="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            {{ template.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col">
      <div class="h-16 border-b bg-white px-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="generatePDF"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <span class="material-icons-outlined">picture_as_pdf</span>
            PDF Oluştur
          </button>

          <button @click="clearElements"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <span class="material-icons-outlined">delete_sweep</span>
            Temizle
          </button>

          <button @click="saveTemplate"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <span class="material-icons-outlined">save</span>
            Şablon Kaydet
          </button>
        </div>

        <div class="flex items-center space-x-4">
          <button @click="undoAction"
            class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canUndo" title="Geri Al">
            <span class="material-icons-outlined">undo</span>
          </button>
          <button @click="redoAction"
            class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canRedo" title="İleri Al">
            <span class="material-icons-outlined">redo</span>
          </button>
          <button @click="togglePreview" class="p-2 rounded-lg hover:bg-gray-100"
            :class="{ 'bg-blue-50': isPreviewMode }" title="Önizleme">
            <span class="material-icons-outlined">preview</span>
          </button>
        </div>
      </div>

      <div class="flex-1 p-8 overflow-auto bg-gray-100">
        <div :class="[
          'mx-auto bg-white shadow-xl',
          'transition-all duration-300',
          pageSettings.orientation === 'portrait' ? 'w-[595px]' : 'w-[842px]'
        ]" :style="{
          minHeight: pageSettings.orientation === 'portrait' ? '842px' : '595px',
          padding: `${pageSettings.margins.top}px ${pageSettings.margins.right}px ${pageSettings.margins.bottom}px ${pageSettings.margins.left}px`
        }">
          <draggable v-model="elements" :group="{ name: 'elements' }" item-key="id" class="min-h-full space-y-4"
            :disabled="isPreviewMode">
            <template #item="{ element }">
              <div class="relative group" :class="{ 'cursor-move': !isPreviewMode }"
                @click.stop="selectElement(element)">
                <div class="relative rounded p-2" :class="[
                  !isPreviewMode && 'border-2 border-transparent hover:border-blue-200',
                  !isPreviewMode && selectedElement?.id === element.id && 'border-blue-500'
                ]">
                  <div v-if="element.type === 'text'" class="min-h-[30px]">
                    <p :style="element.style">
                      {{ element.content || 'Metin girin...' }}
                    </p>
                  </div>

                  <div v-if="element.type === 'heading'" class="min-h-[40px]">
                    <h2 :style="element.style">
                      {{ element.content || 'Başlık girin...' }}
                    </h2>
                  </div>

                  <div v-if="element.type === 'image'" class="min-h-[100px]">
                    <img v-if="element.content" :src="element.content" :style="element.style" class="max-w-full"
                      alt="Yüklenen görsel" />
                    <div v-else
                      class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                      Görsel Yükleyin
                    </div>
                  </div>

                  <div v-if="element.type === 'table'" class="min-h-[100px] overflow-auto">
                    <table class="w-full border-collapse">
                      <tbody>
                        <tr v-for="(row, rowIndex) in element.content" :key="rowIndex">
                          <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="border p-2"
                            :style="element.style">
                            {{ cell || 'Hücre' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-if="element.type === 'list'" class="min-h-[50px]">
                    <ul class="list-disc list-inside" :style="element.style">
                      <li v-for="(item, index) in element.content" :key="index">
                        {{ item || 'Liste öğesi' }}
                      </li>
                    </ul>
                  </div>

                  <div v-if="element.type === 'shape'" class="min-h-[100px]">
                    <div :style="{
                      width: element.style.width || '100px',
                      height: element.style.height || '100px',
                      backgroundColor: element.style.backgroundColor,
                      borderColor: element.style.borderColor,
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderRadius: element.shapeType === 'circle' ? '50%' : '0'
                    }"></div>
                  </div>

                  <div v-if="!isPreviewMode"
                    class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-2 bg-white shadow-sm rounded-lg">
                    <button @click.stop="duplicateElement(element)" class="p-1 hover:bg-gray-100 rounded"
                      title="Kopyala">
                      <span class="material-icons-outlined text-sm">content_copy</span>
                    </button>
                    <button @click.stop="removeElement(element)" class="p-1 hover:bg-red-100 text-red-600 rounded"
                      title="Sil">
                      <span class="material-icons-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <div v-if="selectedElement && !isPreviewMode" class="w-64 border-l bg-white shadow-lg p-4">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">Element Ayarları</h3>
        <button @click="selectedElement = null" class="text-gray-400 hover:text-gray-600">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>

      <div class="space-y-4">
        <template v-if="['text', 'heading'].includes(selectedElement.type)">
          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">İçerik</label>
            <textarea v-model="selectedElement.content" rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="İçerik girin..."></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Yazı Tipi</label>
            <select v-model="selectedElement.style.fontFamily"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Courier">Courier</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Yazı Boyutu</label>
            <input type="number" v-model="selectedElement.style.fontSize"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="8"
              max="72">
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Yazı Rengi</label>
            <input type="color" v-model="selectedElement.style.color" class="w-full h-10 rounded-lg">
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Hizalama</label>
            <div class="flex space-x-2">
              <button v-for="align in ['left', 'center', 'right', 'justify']" :key="align"
                @click="selectedElement.style.textAlign = align" class="flex-1 p-2 border rounded-lg hover:bg-gray-50"
                :class="{ 'bg-blue-50 border-blue-500': selectedElement.style.textAlign === align }">
                <span class="material-icons-outlined text-sm">format_align_{{ align }}</span>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Stil</label>
            <div class="flex space-x-2">
              <button @click="toggleStyle('bold')" class="p-2 border rounded-lg hover:bg-gray-50"
                :class="{ 'bg-blue-50 border-blue-500': selectedElement.style.fontWeight === 'bold' }">
                <span class="material-icons-outlined text-sm">format_bold</span>
              </button>
              <button @click="toggleStyle('italic')" class="p-2 border rounded-lg hover:bg-gray-50"
                :class="{ 'bg-blue-50 border-blue-500': selectedElement.style.fontStyle === 'italic' }">
                <span class="material-icons-outlined text-sm">format_italic</span>
              </button>
              <button @click="toggleStyle('underline')" class="p-2 border rounded-lg hover:bg-gray-50"
                :class="{ 'bg-blue-50 border-blue-500': selectedElement.style.textDecoration === 'underline' }">
                <span class="material-icons-outlined text-sm">format_underlined</span>
              </button>
            </div>
          </div>
        </template>

        <!-- Görsel Ayarları -->
        <template v-if="selectedElement.type === 'image'">
          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Görsel Yükle</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="w-full">
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Boyut</label>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="selectedElement.style.width" type="number" placeholder="Genişlik"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <input v-model="selectedElement.style.height" type="number" placeholder="Yükseklik"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Hizalama</label>
            <div class="flex space-x-2">
              <button v-for="align in ['left', 'center', 'right']" :key="align"
                @click="selectedElement.style.textAlign = align" class="flex-1 p-2 border rounded-lg hover:bg-gray-50"
                :class="{ 'bg-blue-50 border-blue-500': selectedElement.style.textAlign === align }">
                <span class="material-icons-outlined text-sm">format_align_{{ align }}</span>
              </button>
            </div>
          </div>
        </template>

        <!-- Tablo Ayarları -->
        <template v-if="selectedElement?.type === 'table'">
          <div class="space-y-4">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <tbody>
                  <tr v-for="(row, rowIndex) in selectedElement.content" :key="rowIndex">
                    <td v-for="(cell, colIndex) in row" :key="colIndex" class="border p-2 min-w-[100px]">
                      <input type="text" v-model="selectedElement.content[rowIndex][colIndex]"
                        class="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500"
                        @input="updateTableContent(rowIndex, colIndex, $event.target.value)">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-600 block mb-2">Hücre Dolgusu</label>
                <input type="number" v-model="selectedElement.style.cellPadding"
                  class="w-full px-3 py-2 border rounded-lg" min="0" max="20">
              </div>
              <div>
                <label class="text-sm text-gray-600 block mb-2">Kenarlık Kalınlığı</label>
                <input type="number" v-model="selectedElement.style.borderWidth"
                  class="w-full px-3 py-2 border rounded-lg" min="0" max="5">
              </div>
            </div>

            <div>
              <label class="text-sm text-gray-600 block mb-2">Kenarlık Rengi</label>
              <input type="color" v-model="selectedElement.style.borderColor" class="w-full h-10 rounded-lg">
            </div>
          </div>
        </template>

        <!-- Şekil Ayarları -->
        <template v-if="selectedElement.type === 'shape'">
          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Şekil Tipi</label>
            <select v-model="selectedElement.shapeType"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="rectangle">Dikdörtgen</option>
              <option value="circle">Daire</option>
              <option value="line">Çizgi</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Boyut</label>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="selectedElement.style.width" type="number" placeholder="Genişlik"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <input v-model="selectedElement.style.height" type="number" placeholder="Yükseklik"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Dolgu Rengi</label>
            <input type="color" v-model="selectedElement.style.backgroundColor" class="w-full h-10 rounded-lg">
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Kenarlık Rengi</label>
            <input type="color" v-model="selectedElement.style.borderColor" class="w-full h-10 rounded-lg">
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect } from 'vue'
import draggable from 'vuedraggable'
import pdfMake from 'pdfmake/build/pdfmake'

const elements = ref([])
const selectedElement = ref(null)
const isPreviewMode = ref(false)

const pageSettings = reactive({
  size: 'a4',
  orientation: 'portrait',
  margins: {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
  }
})

const pdfFonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
}

pdfMake.fonts = pdfFonts;

const history = ref([])
const historyIndex = ref(-1)
const canUndo = ref(false)
const canRedo = ref(false)

const PAGE_SIZES = {
  a4: { width: 595, height: 842 },
  a3: { width: 842, height: 1191 },
  letter: { width: 612, height: 792 },
  legal: { width: 612, height: 1008 }
}

const templates = ref([
  { id: 1, name: 'Boş Belge' },
  { id: 2, name: 'Rapor Şablonu' },
  { id: 3, name: 'Mektup Şablonu' }
])

watchEffect(() => {
  const size = PAGE_SIZES[pageSettings.size]
  if (size) {
    const container = document.querySelector('.page-container')
    if (container) {
      if (pageSettings.orientation === 'portrait') {
        container.style.width = `${size.width}px`
        container.style.minHeight = `${size.height}px`
      } else {
        container.style.width = `${size.height}px`
        container.style.minHeight = `${size.width}px`
      }
    }
  }
})

const initTableElement = () => {
  return {
    id: `element-${Date.now()}`,
    type: 'table',
    rows: 3,
    columns: 3,
    content: Array(3).fill().map(() => Array(3).fill('')),
    style: {
      fontFamily: 'Roboto',
      fontSize: 14,
      color: '#000000',
      textAlign: 'left',
      borderColor: '#000000',
      borderWidth: 1,
      cellPadding: 8
    }
  }
}

const updateTableContent = (rowIndex, colIndex, value) => {
  if (!selectedElement.value || selectedElement.value.type !== 'table') return

  const newContent = [...selectedElement.value.content]
  newContent[rowIndex][colIndex] = value
  selectedElement.value.content = newContent
  addToHistory()
}

const addElement = (type) => {
  const newElement = {
    id: `element-${Date.now()}`,
    type,
    content: '',
    style: {
      fontFamily: 'Roboto',
      fontSize: 16,
      color: '#000000',
      textAlign: 'left',
      width: '100%',
      backgroundColor: '#ffffff',
      borderColor: '#000000',
    }
  }

  if (type === 'image') {
    newElement.style = {
      ...newElement.style,
      width: '100%',
      textAlign: 'center'
    }
  }

  elements.value.push(newElement)
}

const updateElement = (element, updates) => {
  const index = elements.value.findIndex(el => el.id === element.id)
  if (index !== -1) {
    elements.value[index] = { ...elements.value[index], ...updates }
    addToHistory()
  }
}

const removeElement = (element) => {
  const index = elements.value.findIndex(el => el.id === element.id)
  if (index !== -1) {
    elements.value.splice(index, 1)
    if (selectedElement.value?.id === element.id) {
      selectedElement.value = null
    }
    addToHistory()
  }
}

const duplicateElement = (element) => {
  const newElement = JSON.parse(JSON.stringify({
    ...element,
    id: `element-${Date.now()}`
  }))
  const index = elements.value.findIndex(el => el.id === element.id)
  elements.value.splice(index + 1, 0, newElement)
  addToHistory()
}

const selectElement = (element) => {
  if (!isPreviewMode.value) {
    selectedElement.value = element
  }
}

const handleImageUpload = (event) => {
  if (!selectedElement.value || selectedElement.value.type !== 'image') return

  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const maxWidth = pageSettings.orientation === 'portrait' ? 515 : 762
        const aspectRatio = img.width / img.height

        const width = Math.min(img.width, maxWidth)
        const height = width / aspectRatio

        updateElement(selectedElement.value, {
          content: e.target.result,
          style: {
            ...selectedElement.value.style,
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

const toggleStyle = (style) => {
  if (!selectedElement.value) return

  switch (style) {
    case 'bold':
      selectedElement.value.style.fontWeight =
        selectedElement.value.style.fontWeight === 'bold' ? 'normal' : 'bold'
      break
    case 'italic':
      selectedElement.value.style.fontStyle =
        selectedElement.value.style.fontStyle === 'italic' ? 'normal' : 'italic'
      break
    case 'underline':
      selectedElement.value.style.textDecoration =
        selectedElement.value.style.textDecoration === 'underline' ? 'none' : 'underline'
      break
  }
  addToHistory()
}

const updateTableSize = () => {
  if (!selectedElement.value || selectedElement.value.type !== 'table') return

  const newContent = []
  for (let i = 0; i < selectedElement.value.rows; i++) {
    const row = []
    for (let j = 0; j < selectedElement.value.columns; j++) {
      row.push(selectedElement.value.content[i]?.[j] || '')
    }
    newContent.push(row)
  }
  selectedElement.value.content = newContent
  addToHistory()
}

const addToHistory = () => {
  historyIndex.value++
  history.value = history.value.slice(0, historyIndex.value)
  history.value.push(JSON.stringify(elements.value))
  updateHistoryState()
}

const updateHistoryState = () => {
  canUndo.value = historyIndex.value > 0
  canRedo.value = historyIndex.value < history.value.length - 1
}

const undoAction = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    elements.value = JSON.parse(history.value[historyIndex.value])
    updateHistoryState()
  }
}

const redoAction = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    elements.value = JSON.parse(history.value[historyIndex.value])
    updateHistoryState()
  }
}

const generatePDF = () => {
  const docDefinition = {
    pageSize: pageSettings.size.toUpperCase(),
    pageOrientation: pageSettings.orientation,
    pageMargins: [
      pageSettings.margins.left,
      pageSettings.margins.top,
      pageSettings.margins.right,
      pageSettings.margins.bottom
    ],
    defaultStyle: {
      font: 'Roboto'
    },
    content: []
  }

  elements.value.forEach(element => {
    switch (element.type) {
      case 'text':
      case 'heading':
        docDefinition.content.push({
          text: element.content || '',
          fontSize: element.style.fontSize,
          alignment: element.style.textAlign,
          color: element.style.color,
          bold: element.style.fontWeight === 'bold',
          italics: element.style.fontStyle === 'italic',
          decoration: element.style.textDecoration === 'underline' ? 'underline' : '',
          margin: [0, 5, 0, 5]
        })
        break

      case 'image':
        if (element.content) {
          const maxWidth = pageSettings.orientation === 'portrait'
            ? PAGE_SIZES[pageSettings.size].width - pageSettings.margins.left - pageSettings.margins.right
            : PAGE_SIZES[pageSettings.size].height - pageSettings.margins.left - pageSettings.margins.right

          let width = parseInt(element.style.width)
          if (element.style.width.includes('%')) {
            width = (maxWidth * parseInt(element.style.width)) / 100
          }

          docDefinition.content.push({
            image: element.content,
            width: width,
            alignment: element.style.textAlign || 'center',
            margin: [0, 10, 0, 10]
          })
        }
        break

      case 'table':
        if (element.content && element.content.length > 0) {
          docDefinition.content.push({
            table: {
              headerRows: 0,
              widths: Array(element.content[0].length).fill('*'),
              body: element.content.map(row =>
                row.map(cell => ({
                  text: cell || '',
                  fontSize: element.style.fontSize,
                  alignment: element.style.textAlign,
                  color: element.style.color
                }))
              )
            },
            layout: {
              defaultBorder: true,
              hLineWidth: () => parseInt(element.style.borderWidth) || 1,
              vLineWidth: () => parseInt(element.style.borderWidth) || 1,
              hLineColor: () => element.style.borderColor || '#000000',
              vLineColor: () => element.style.borderColor || '#000000',
              paddingLeft: () => parseInt(element.style.cellPadding) || 8,
              paddingRight: () => parseInt(element.style.cellPadding) || 8,
              paddingTop: () => parseInt(element.style.cellPadding) || 8,
              paddingBottom: () => parseInt(element.style.cellPadding) || 8
            }
          })
        }
        break

      case 'list':
        if (element.content && element.content.length > 0) {
          docDefinition.content.push({
            ul: element.content.filter(item => item.trim()).map(item => ({
              text: item,
              fontSize: element.style.fontSize,
              color: element.style.color
            })),
            margin: [0, 5, 0, 5]
          })
        }
        break

      case 'shape':
        docDefinition.content.push({
          canvas: [{
            type: element.shapeType === 'circle' ? 'ellipse' : 'rect',
            x: 0,
            y: 0,
            w: parseInt(element.style.width) || 100,
            h: parseInt(element.style.height) || 100,
            color: element.style.backgroundColor
          }],
          margin: [0, 5, 0, 5]
        })
        break
    }
  })

  try {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition)
    pdfDocGenerator.download('document.pdf')
  } catch (error) {
    console.error('PDF oluşturma hatası:', error)
    alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
  }
}

const loadTemplate = (template) => {
}

const saveTemplate = () => {
}

const clearElements = () => {
  if (confirm('Tüm içeriği silmek istediğinize emin misiniz?')) {
    elements.value = []
    selectedElement.value = null
    addToHistory()
  }
}

const togglePreview = () => {
  isPreviewMode.value = !isPreviewMode.value
  if (isPreviewMode.value) {
    selectedElement.value = null
  }
}
</script>