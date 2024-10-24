<template>
  <div class="h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Sol Menü -->
    <div :class="[
      'fixed inset-0 z-40 md:static md:z-auto md:translate-x-0 transition-transform duration-300',
      isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      'w-64 border-r bg-white p-4 flex flex-col'
    ]">
      <h2 class="text-xl font-bold mb-6">PDF Düzenleyici</h2>

      <div class="grid grid-cols-2 gap-3 mb-6">
        <Button variant="outline" @click="addElement('text')">
          <span class="material-icons-outlined mr-2">text_fields</span> Metin
        </Button>

        <Button variant="outline" @click="addElement('heading')">
          <span class="material-icons-outlined mr-2">title</span> Başlık
        </Button>

        <Button variant="outline" @click="addElement('image')">
          <span class="material-icons-outlined mr-2">image</span> Görsel
        </Button>

        <Button variant="outline" @click="addElement('list')">
          <span class="material-icons-outlined mr-2">format_list_bulleted</span> Liste
        </Button>

        <Button variant="outline" @click="addElement('table')">
          <span class="material-icons-outlined mr-2">table_chart</span> Tablo
        </Button>

        <Button variant="outline" @click="addElement('link')">
          <span class="material-icons-outlined mr-2">link</span> Bağlantı
        </Button>
      </div>

      <div class="border-t pt-6">
        <h3 class="text-sm font-semibold mb-4">Sayfa Ayarları</h3>

        <div class="space-y-4">
          <!-- Sayfa Boyutu -->
          <div>
            <Label for="page-size" class="block text-sm font-medium text-gray-700">Sayfa Boyutu</Label>
            <Select v-model="pageSettings.size" id="page-size">
              <SelectTrigger>
                <SelectValue placeholder="Sayfa Boyutu Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Boyutlar</SelectLabel>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="a3">A3</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <!-- Sayfa Yönü -->
          <div>
            <Label for="page-orientation" class="block text-sm font-medium text-gray-700">Sayfa Yönü</Label>
            <Select v-model="pageSettings.orientation" id="page-orientation">
              <SelectTrigger>
                <SelectValue placeholder="Sayfa Yönü Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Yön</SelectLabel>
                  <SelectItem value="portrait">Dikey</SelectItem>
                  <SelectItem value="landscape">Yatay</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <!-- Kenar Boşlukları -->
          <div>
            <Label class="block text-sm font-medium text-gray-700">Kenar Boşlukları (mm)</Label>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <Label for="margin-top" class="sr-only">Üst</Label>
                <Input id="margin-top" type="number" v-model.number="pageSettings.margins.top" placeholder="Üst"
                  min="0" />
              </div>
              <div>
                <Label for="margin-right" class="sr-only">Sağ</Label>
                <Input id="margin-right" type="number" v-model.number="pageSettings.margins.right" placeholder="Sağ"
                  min="0" />
              </div>
              <div>
                <Label for="margin-bottom" class="sr-only">Alt</Label>
                <Input id="margin-bottom" type="number" v-model.number="pageSettings.margins.bottom" placeholder="Alt"
                  min="0" />
              </div>
              <div>
                <Label for="margin-left" class="sr-only">Sol</Label>
                <Input id="margin-left" type="number" v-model.number="pageSettings.margins.left" placeholder="Sol"
                  min="0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hamburger Menü Butonu -->
    <button @click="toggleMenu"
      class="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
      <span class="material-icons">{{ isMenuOpen ? 'close' : 'menu' }}</span>
    </button>

    <!-- Ana İçerik -->
    <PageManager :current-page="currentPage" :total-pages="pages.length" :page-settings="pageSettings"
      :can-undo="canUndo" :can-redo="canRedo" :can-download="canDownload" :is-preview-mode="isPreviewMode"
      @page-added="addPage" @page-changed="changePage" @generate-pdf="generatePDF" @clear-page="clearPage"
      @undo="undoAction" @redo="redoAction" @toggle-preview="togglePreview">
      <draggable v-model="currentPageElements" :group="{ name: 'elements' }" item-key="id"
        class="min-h-full space-y-4 p-4" :disabled="isPreviewMode" @change="handleDragChange">
        <template #item="{ element }">
          <div @click="selectElement(element)" class="relative group">
            <div class="rounded p-2 transition-all duration-200 border-2" :class="[
              selectedElement?.id === element.id ? 'border-blue-500' : 'border-transparent hover:border-blue-200',
              isPreviewMode ? 'pointer-events-none' : 'cursor-pointer'
            ]">
              <component :is="getElementComponent(element.type)" :element="element" @update="updateElement" />

              <!-- Element Araç Çubuğu -->
              <div v-if="!isPreviewMode"
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                <button @click.stop="duplicateElement(element)" class="p-1 rounded bg-white shadow hover:bg-gray-100">
                  <span class="material-icons-outlined text-sm">content_copy</span>
                </button>
                <button @click.stop="removeElement(element)" class="p-1 rounded bg-white shadow hover:bg-gray-100">
                  <span class="material-icons-outlined text-sm">delete</span>
                </button>
                <button @click.stop="openElementEditor(element)" class="p-1 rounded bg-white shadow hover:bg-gray-100">
                  <span class="material-icons-outlined text-sm">edit</span>
                </button>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <!-- Element Düzenleyici Modal -->
      <ElementEditor v-if="editingElement" :element="editingElement" @update="handleElementUpdate"
        @close="closeElementEditor" />
    </PageManager>


    <!-- Toast Bildirimleri -->
    <ToastProvider />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import draggable from 'vuedraggable'
import pdfMake from 'pdfmake/build/pdfmake'
import 'pdfmake/build/vfs_fonts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue }
  from '@/components/ui/select'
  import { Tooltip } from '@/components/ui/tooltip'

import { ToastProvider } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import ElementEditor from './components/ElementEditor.vue'
import PageManager from './components/PageManager.vue'
import TextElement from './components/elements/TextElement.vue'
import HeadingElement from './components/elements/HeadingElement.vue'
import ImageElement from './components/elements/ImageElement.vue'
import TableElement from './components/elements/TableElement.vue'
import ListElement from './components/elements/ListElement.vue'
import LinkElement from './components/elements/LinkElement.vue'

const { toast } = useToast()

// Temel State Yönetimi
const isMenuOpen = ref(false)
const isPreviewMode = ref(false)
const selectedElement = ref(null)
const editingElement = ref(null)
const currentPage = ref(0)

// Sayfa ve Element Yönetimi
const pages = ref([{
  id: 'page-1',
  elements: []
}])

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

// Geçmiş İşlemleri
const history = ref([])
const historyIndex = ref(-1)

// Computed Properties
const currentPageElements = computed({
  get: () => pages.value[currentPage.value].elements,
  set: (newElements) => {
    pages.value[currentPage.value].elements = newElements
    addToHistory()
  }
})

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)
const canDownload = computed(() => pages.value.some(page => page.elements.length > 0))

// Element Component Mapping
const elementComponents = {
  text: TextElement,
  heading: HeadingElement,
  image: ImageElement,
  table: TableElement,
  list: ListElement,
  link: LinkElement
}

// Methods
const getElementComponent = (type) => elementComponents[type] || TextElement

const addElement = (type) => {
  const newElement = createElementByType(type)
  pages.value[currentPage.value].elements.push(newElement)
  addToHistory()
  showToast('success', `${capitalize(type)} elementi eklendi`)
}

const createElementByType = (type) => {
  const baseElement = {
    id: `element-${Date.now()}`,
    type,
    style: {
      fontFamily: 'Roboto',
      fontSize: 16,
      color: '#000000',
      textAlign: 'left'
    }
  }

  switch (type) {
    case 'table':
      return {
        ...baseElement,
        content: Array(3).fill().map(() => Array(3).fill('')),
        style: {
          ...baseElement.style,
          borderColor: '#000000',
          borderWidth: 1,
          cellPadding: 8
        }
      }
    case 'list':
      return {
        ...baseElement,
        content: ['Yeni liste öğesi'],
        style: {
          ...baseElement.style,
          listStyleType: 'disc'
        }
      }
    case 'link':
      return {
        ...baseElement,
        text: 'Bağlantı Metni',
        href: 'https://example.com',
        style: {
          ...baseElement.style,
          color: '#0000FF',
          textDecoration: 'underline'
        }
      }
    default:
      return {
        ...baseElement,
        content: ''
      }
  }
}

const updateElement = (element) => {
  const index = currentPageElements.value.findIndex(el => el.id === element.id)
  if (index !== -1) {
    currentPageElements.value[index] = { ...element }
    addToHistory()
  }
}

const removeElement = (element) => {
  const index = currentPageElements.value.findIndex(el => el.id === element.id)
  if (index !== -1) {
    currentPageElements.value.splice(index, 1)
    if (selectedElement.value?.id === element.id) {
      selectedElement.value = null
    }
    addToHistory()
    showToast('info', `${capitalize(element.type)} elementi silindi`)
  }
}

const duplicateElement = (element) => {
  const newElement = JSON.parse(JSON.stringify({
    ...element,
    id: `element-${Date.now()}`
  }))
  const index = currentPageElements.value.findIndex(el => el.id === element.id)
  currentPageElements.value.splice(index + 1, 0, newElement)
  addToHistory()
  showToast('success', `${capitalize(element.type)} elementi kopyalandı`)
}

// Sayfa İşlemleri
// Sayfa İşlemleri
const addPage = () => {
  pages.value.push({
    id: `page-${Date.now()}`,
    elements: []
  })
  changePage(pages.value.length - 1)
  showToast('success', 'Yeni sayfa eklendi')
}

const changePage = (pageIndex) => {
  currentPage.value = pageIndex
  selectedElement.value = null
}

const clearPage = () => {
  if (confirm('Bu sayfadaki tüm içeriği silmek istediğinize emin misiniz?')) {
    pages.value[currentPage.value].elements = []
    selectedElement.value = null
    addToHistory()
    showToast('info', 'Sayfa içeriği temizlendi')
  }
}

// Element Düzenleme
const selectElement = (element) => {
  if (!isPreviewMode.value) {
    selectedElement.value = element
  }
}

const openElementEditor = (element) => {
  editingElement.value = element
}

const closeElementEditor = () => {
  editingElement.value = null
}

const handleElementUpdate = (updatedElement) => {
  updateElement(updatedElement)
  showToast('success', 'Element güncellendi')
}

// Geçmiş İşlemleri
const addToHistory = () => {
  historyIndex.value++
  history.value = history.value.slice(0, historyIndex.value)
  history.value.push(JSON.stringify(pages.value))
}

const undoAction = () => {
  if (canUndo.value) {
    historyIndex.value--
    pages.value = JSON.parse(history.value[historyIndex.value])
    showToast('info', 'İşlem geri alındı')
  }
}

const redoAction = () => {
  if (canRedo.value) {
    historyIndex.value++
    pages.value = JSON.parse(history.value[historyIndex.value])
    showToast('info', 'İşlem tekrarlandı')
  }
}

// Sürükle-Bırak İşlemleri
const handleDragChange = () => {
  addToHistory()
}

// PDF Oluşturma
const generatePDF = async () => {
  if (!canDownload.value) {
    showToast('error', 'PDF oluşturmak için en az bir element ekleyin')
    return
  }

  try {
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

    pages.value.forEach((page, pageIndex) => {
      if (pageIndex > 0) {
        docDefinition.content.push({ text: '', pageBreak: 'before' })
      }

      page.elements.forEach(element => {
        const content = generatePDFContent(element)
        if (content) {
          docDefinition.content.push(content)
        }
      })
    })

    const pdfDocGenerator = pdfMake.createPdf(docDefinition)
    pdfDocGenerator.download('document.pdf')
    showToast('success', 'PDF başarıyla oluşturuldu')
  } catch (error) {
    console.error('PDF oluşturma hatası:', error)
    showToast('error', 'PDF oluşturulurken bir hata oluştu')
  }
}

const generatePDFContent = (element) => {
  switch (element.type) {
    case 'text':
    case 'heading':
      return {
        text: element.content || '',
        fontSize: element.style.fontSize,
        alignment: element.style.textAlign,
        color: element.style.color,
        bold: element.style.fontWeight === 'bold',
        italics: element.style.fontStyle === 'italic',
        decoration: element.style.textDecoration === 'underline' ? 'underline' : '',
        margin: [0, 5, 0, 5]
      }

    case 'image':
      if (element.content) {
        return {
          image: element.content,
          width: parseInt(element.style.width) || 200,
          alignment: element.style.textAlign || 'center',
          margin: [0, 10, 0, 10]
        }
      }
      break

    case 'table':
      if (element.content?.length) {
        return {
          table: {
            headerRows: 0,
            widths: Array(element.content[0].length).fill('*'),
            body: element.content
          },
          layout: {
            defaultBorder: true,
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 8,
            paddingBottom: () => 8
          }
        }
      }
      break

    case 'list':
      if (element.content?.length) {
        return {
          ul: element.content,
          margin: [0, 5, 0, 5]
        }
      }
      break

    case 'link':
      return {
        text: element.text || 'Bağlantı',
        link: element.href || '#',
        color: element.style.color,
        decoration: 'underline',
        margin: [0, 5, 0, 5]
      }
  }
}

// Yardımcı Fonksiyonlar
const showToast = (type, message) => {
  toast({
    title: message,
    variant: type,
    duration: 3000
  })
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const togglePreview = () => {
  isPreviewMode.value = !isPreviewMode.value
  selectedElement.value = null
  showToast('info', `${isPreviewMode.value ? 'Önizleme' : 'Düzenleme'} moduna geçildi`)
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
@media (max-width: 768px) {
  .page-container {
    max-width: 100% !important;
    width: 100% !important;
  }
}

.transition-transform {
  transition-property: transform;
  transition-duration: 300ms;
}

[v-cloak] {
  display: none;
}
</style>