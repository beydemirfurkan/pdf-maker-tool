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

        <Button variant="outline" @click="addElement('video')">
          <span class="material-icons-outlined mr-2">video_library</span> Video
        </Button>

        <Button variant="outline" @click="addElement('link')">
          <span class="material-icons-outlined mr-2">link</span> Bağlantı
        </Button>

        <Button variant="outline" @click="addElement('table')">
          <span class="material-icons-outlined mr-2">table_chart</span> Tablo
        </Button>

        <Button variant="outline" @click="addElement('list')">
          <span class="material-icons-outlined mr-2">format_list_bulleted</span> Liste
        </Button>

        <Button variant="outline" @click="addElement('shape')">
          <span class="material-icons-outlined mr-2">category</span> Şekil
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
                  <SelectLabel>Sınıflar</SelectLabel>
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
      class="md:hidden p-2 m-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
      <span class="material-icons">menu</span>
    </button>

    <!-- Ana İçerik -->
    <div class="flex-1 flex flex-col">
      <!-- Üst Araç Çubuğu -->
      <div class="h-16 border-b bg-white px-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <Button @click="generatePDF" :disabled="!canDownload" variant="primary"
            class="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="material-icons-outlined">picture_as_pdf</span>
            PDF Oluştur
          </Button>

          <Button @click="clearElements" variant="outline" class="flex items-center gap-2">
            <span class="material-icons-outlined">delete_sweep</span>
            Temizle
          </Button>
        </div>

        <div class="flex items-center space-x-4">
          <Button variant="ghost" @click="undoAction" :disabled="!canUndo"
            class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Geri Al">
            <span class="material-icons-outlined">undo</span>
          </Button>
          <Button variant="ghost" @click="redoAction" :disabled="!canRedo"
            class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="İleri Al">
            <span class="material-icons-outlined">redo</span>
          </Button>
          <Button variant="ghost" @click="togglePreview" :class="{ 'bg-blue-50': isPreviewMode }"
            class="p-2 rounded-lg hover:bg-gray-100" aria-label="Önizleme">
            <span class="material-icons-outlined">preview</span>
          </Button>
        </div>
      </div>

      <!-- Düzenleyici Alanı -->
      <div class="flex-1 p-4 md:p-8 overflow-auto bg-gray-100">
        <div class="page-container mx-auto bg-white transition-all duration-300" :class="{
          'w-full max-w-[595px]': pageSettings.orientation === 'portrait',
          'w-full max-w-[842px]': pageSettings.orientation === 'landscape'
        }" :style="pageContainerStyle">
          <draggable v-model="elements" :group="{ name: 'elements' }" item-key="id" class="min-h-full space-y-4"
            :disabled="isPreviewMode">
            <template #item="{ element }">
              <ContextMenu>
                <ContextMenuTrigger class="relative group">
                  <div
                    class="rounded p-2 transition-all duration-200 border-2 border-transparent hover:border-blue-200 cursor-pointer"
                    :class="{ 'border-blue-500': selectedElement?.id === element.id }">
                    <!-- Metin -->
                    <div v-if="element.type === 'text'" class="min-h-[30px]">
                      <p :style="element.style">
                        {{ element.content || 'Metin girin...' }}
                      </p>
                    </div>

                    <!-- Başlık -->
                    <div v-if="element.type === 'heading'" class="min-h-[40px]">
                      <h2 :style="element.style">
                        {{ element.content || 'Başlık girin...' }}
                      </h2>
                    </div>

                    <!-- Görsel -->
                    <div v-if="element.type === 'image'" class="min-h-[100px]">
                      <img v-if="element.content" :src="element.content" :style="element.style" class="max-w-full"
                        alt="Yüklenen görsel" />
                      <div v-else
                        class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                        Görsel Yükleyin
                      </div>
                    </div>

                    <!-- Video -->
                    <div v-if="element.type === 'video'" class="min-h-[200px]">
                      <video v-if="element.content" :src="element.content" :style="element.style" controls
                        class="max-w-full">
                        Tarayıcınız videoyu desteklemiyor.
                      </video>
                      <div v-else
                        class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                        Video Yükleyin
                      </div>
                    </div>

                    <!-- Bağlantı -->
                    <div v-if="element.type === 'link'" class="min-h-[30px]">
                      <a :href="element.href || '#'" :style="element.style" target="_blank" rel="noopener noreferrer">
                        {{ element.text || 'Bağlantı Metni' }}
                      </a>
                    </div>

                    <!-- Tablo -->
                    <div v-if="element.type === 'table'" class="min-h-[100px] overflow-auto">
                      <table class="w-full border-collapse">
                        <tbody>
                          <tr v-for="(row, rowIndex) in element.content" :key="rowIndex">
                            <td v-for="(cell, colIndex) in row" :key="colIndex" class="border p-2"
                              :style="element.style">
                              <Input type="text" v-model="element.content[rowIndex][colIndex]"
                                class="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500"
                                @input="addToHistory" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Liste -->
                    <div v-if="element.type === 'list'" class="min-h-[50px]">
                      <ul :class="listClass" :style="element.style">
                        <li v-for="(item, index) in element.content" :key="index" class="flex items-center space-x-2">
                          <Input type="text" v-model="element.content[index]"
                            class="flex-1 px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500"
                            @keydown.enter.prevent="addListItem(index)"
                            @keydown.backspace="handleBackspace(index, $event)" placeholder="Liste öğesi" />
                        </li>
                      </ul>
                    </div>

                    <!-- Şekil -->
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
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent class="w-64">
                  <ContextMenuItem @click="duplicateElement(element)">
                    <span class="material-icons-outlined mr-2">content_copy</span> Kopyala
                  </ContextMenuItem>
                  <ContextMenuItem @click="removeElement(element)">
                    <span class="material-icons-outlined mr-2">delete</span> Sil
                  </ContextMenuItem>
                  <ContextMenuItem @click="openEditPopover(element)">
                    <span class="material-icons-outlined mr-2">edit</span> Düzenle
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <!-- Popover for Editing Elements -->
    <Popover v-if="selectedElement">
      <PopoverTrigger as-child>
        <!-- Invisible trigger -->
        <div></div>
      </PopoverTrigger>
      <PopoverContent class="w-80">
        <div class="grid gap-4">
          <!-- Genel Ayarlar -->
          <div class="space-y-2">
            <h4 class="font-medium leading-none">Genel Ayarlar</h4>
            <div class="grid grid-cols-3 items-center gap-4">
              <Label for="font-size" class="sr-only">Yazı Boyutu</Label>
              <span class="material-icons">font_download</span>
              <Input id="font-size" type="number" v-model.number="selectedElement.style.fontSize"
                placeholder="Yazı Boyutu" min="8" max="72" />
              <span class="material-icons">format_color_text</span>
              <Input id="font-color" type="color" v-model="selectedElement.style.color" />
            </div>
          </div>

          <!-- Metin ve Başlık İçin Ayarlar -->
          <div v-if="['text', 'heading', 'link'].includes(selectedElement.type)">
            <h4 class="font-medium leading-none">İçerik Ayarları</h4>
            <div class="space-y-2">
              <Label for="content">İçerik</Label>
              <Input id="content" type="text" v-model="selectedElement.content" placeholder="İçerik girin..." />
            </div>
          </div>

          <!-- Başlık İçin Ek Ayarlar -->
          <div v-if="selectedElement.type === 'heading'">
            <h4 class="font-medium leading-none">Başlık Ayarları</h4>
            <div class="space-y-2">
              <Label for="heading-level">Başlık Seviyesi</Label>
              <Select v-model="selectedElement.headingLevel" id="heading-level">
                <SelectTrigger>
                  <SelectValue placeholder="Başlık Seviyesi Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Seviyeler</SelectLabel>
                    <SelectItem value="h1">H1</SelectItem>
                    <SelectItem value="h2">H2</SelectItem>
                    <SelectItem value="h3">H3</SelectItem>
                    <SelectItem value="h4">H4</SelectItem>
                    <SelectItem value="h5">H5</SelectItem>
                    <SelectItem value="h6">H6</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Bağlantılar İçin Ayarlar -->
          <div v-if="selectedElement.type === 'link'">
            <h4 class="font-medium leading-none">Bağlantı Ayarları</h4>
            <div class="space-y-2">
              <Label for="link-text">Bağlantı Metni</Label>
              <Input id="link-text" type="text" v-model="selectedElement.text" placeholder="Bağlantı metni" />
            </div>
            <div class="space-y-2">
              <Label for="link-url">URL</Label>
              <Input id="link-url" type="url" v-model="selectedElement.href" placeholder="https://example.com" />
            </div>
          </div>

          <!-- Görseller İçin Ayarlar -->
          <div v-if="selectedElement.type === 'image'">
            <h4 class="font-medium leading-none">Görsel Ayarları</h4>
            <div class="space-y-2">
              <Label for="image-upload">Görsel Yükle</Label>
              <Input id="image-upload" type="file" accept="image/*" @change="handleImageUpload" />
            </div>
            <div class="space-y-2">
              <Label for="image-width">Genişlik (px)</Label>
              <Input id="image-width" type="number" v-model.number="selectedElement.style.width" placeholder="Genişlik"
                min="10" />
            </div>
            <div class="space-y-2">
              <Label for="image-height">Yükseklik (px)</Label>
              <Input id="image-height" type="number" v-model.number="selectedElement.style.height"
                placeholder="Yükseklik" min="10" />
            </div>
          </div>

          <!-- Şekiller İçin Ayarlar -->
          <div v-if="selectedElement.type === 'shape'">
            <h4 class="font-medium leading-none">Şekil Ayarları</h4>
            <div class="space-y-2">
              <Label for="shape-type">Şekil Tipi</Label>
              <Select v-model="selectedElement.shapeType" id="shape-type">
                <SelectTrigger>
                  <SelectValue placeholder="Şekil Tipi Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipler</SelectLabel>
                    <SelectItem value="rectangle">Dikdörtgen</SelectItem>
                    <SelectItem value="circle">Daire</SelectItem>
                    <SelectItem value="line">Çizgi</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="shape-width">Genişlik (px)</Label>
              <Input id="shape-width" type="number" v-model.number="selectedElement.style.width" placeholder="Genişlik"
                min="10" />
            </div>
            <div class="space-y-2">
              <Label for="shape-height">Yükseklik (px)</Label>
              <Input id="shape-height" type="number" v-model.number="selectedElement.style.height"
                placeholder="Yükseklik" min="10" />
            </div>
            <div class="space-y-2">
              <Label for="shape-bg-color">Dolgu Rengi</Label>
              <Input id="shape-bg-color" type="color" v-model="selectedElement.style.backgroundColor" />
            </div>
            <div class="space-y-2">
              <Label for="shape-border-color">Kenarlık Rengi</Label>
              <Input id="shape-border-color" type="color" v-model="selectedElement.style.borderColor" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect, computed } from 'vue'
import draggable from 'vuedraggable'
import pdfMake from 'pdfmake/build/pdfmake'
import 'pdfmake/build/vfs_fonts.js'
import {
  Button
} from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { useToast } from '@/components/ui/toast/use-toast'

// Bildirim Sistemi
const { toast } = useToast()

// Elementler ve Seçili Element
const elements = ref([])
const selectedElement = ref(null)
const isPreviewMode = ref(false)

// Menü Durumu
const isMenuOpen = ref(false)

// Sayfa Ayarları
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

// PDF Fontları
const pdfFonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf'
  }
}
pdfMake.fonts = pdfFonts;

// Geçmiş ve Undo/Redo
const history = ref([])
const historyIndex = ref(-1)
const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

// Sayfa Boyutları
const PAGE_SIZES = {
  a4: { width: 595, height: 842 },
  a3: { width: 842, height: 1191 },
  letter: { width: 612, height: 792 },
  legal: { width: 612, height: 1008 }
}

// Sayfa Boyutu ve Yönünü İzleme
const pageContainerStyle = computed(() => {
  const size = PAGE_SIZES[pageSettings.size]
  if (size) {
    const width = pageSettings.orientation === 'portrait' ? size.width : size.height
    const height = pageSettings.orientation === 'portrait' ? size.height : size.width
    return {
      minHeight: `${height}px`,
      width: `${width}px`,
      padding: `${pageSettings.margins.top}px ${pageSettings.margins.right}px ${pageSettings.margins.bottom}px ${pageSettings.margins.left}px`
    }
  }
  return {}
})

// Element Ekleme
const addElement = (type) => {
  let newElement

  switch (type) {
    case 'table':
      newElement = {
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
      break
    case 'list':
      newElement = {
        id: `element-${Date.now()}`,
        type: 'list',
        content: ['Yeni liste öğesi'],
        style: {
          fontFamily: 'Roboto',
          fontSize: 16,
          color: '#000000',
          textAlign: 'left',
          listStyleType: 'disc'
        }
      }
      break
    case 'link':
      newElement = {
        id: `element-${Date.now()}`,
        type: 'link',
        text: 'Bağlantı Metni',
        href: 'https://example.com',
        style: {
          fontFamily: 'Roboto',
          fontSize: 16,
          color: '#0000FF',
          textAlign: 'left',
          textDecoration: 'underline'
        }
      }
      break
    case 'video':
      newElement = {
        id: `element-${Date.now()}`,
        type: 'video',
        content: '',
        style: {
          width: 480,
          height: 270,
          textAlign: 'center'
        }
      }
      break
    default:
      newElement = {
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
          borderWidth: 1,
          borderStyle: 'solid'
        }
      }
  }

  elements.value.push(newElement)
  addToHistory()
  toast({
    title: `${capitalize(type)} elementi eklendi!`,
    description: '',
    variant: 'success'
  })
}

// Element Güncelleme
const updateElement = (element, updates) => {
  const index = elements.value.findIndex(el => el.id === element.id)
  if (index !== -1) {
    elements.value[index] = { ...elements.value[index], ...updates }
    addToHistory()
  }
}

// Element Silme
const removeElement = (element) => {
  const index = elements.value.findIndex(el => el.id === element.id)
  if (index !== -1) {
    elements.value.splice(index, 1)
    if (selectedElement.value?.id === element.id) {
      selectedElement.value = null
    }
    addToHistory()
    toast({
      title: `${capitalize(element.type)} elementi silindi!`,
      description: '',
      variant: 'info'
    })
  }
}

// Element Kopyalama
const duplicateElement = (element) => {
  const newElement = JSON.parse(JSON.stringify({
    ...element,
    id: `element-${Date.now()}`
  }))
  elements.value.splice(elements.value.findIndex(el => el.id === element.id) + 1, 0, newElement)
  addToHistory()
  toast({
    title: `${capitalize(element.type)} elementi kopyalandı!`,
    description: '',
    variant: 'success'
  })
}

// Element Seçme ve Popover Açma
const openEditPopover = (element) => {
  selectedElement.value = element
}

// Görsel Yükleme
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
        toast({
          title: 'Görsel yüklendi!',
          description: '',
          variant: 'success'
        })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Stil Toggle Etme (Bu fonksiyon artık kullanılmıyor, kaldırılabilir)
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

// Liste Öğesi Ekleme
const addListItem = (index) => {
  if (selectedElement.value && selectedElement.value.type === 'list') {
    selectedElement.value.content.splice(index + 1, 0, '')
    addToHistory()
    toast({
      title: 'Yeni liste öğesi eklendi!',
      description: '',
      variant: 'success'
    })
  }
}

// Liste Öğesi Silme
const removeListItem = (index) => {
  if (selectedElement.value && selectedElement.value.type === 'list') {
    if (selectedElement.value.content.length > 1) {
      selectedElement.value.content.splice(index, 1)
      addToHistory()
      toast({
        title: 'Liste öğesi silindi!',
        description: '',
        variant: 'info'
      })
    } else {
      removeElement(selectedElement.value)
      toast({
        title: 'Son liste öğesi silindi!',
        description: '',
        variant: 'info'
      })
    }
  }
}

// Liste Backspace İşlevi
const handleBackspace = (index, event) => {
  const input = event.target
  if (input.value.length <= 1) {
    removeListItem(index)
  }
}

// Tablo İçeriğini Güncelleme
const updateTableContent = (rowIndex, colIndex, value) => {
  if (!selectedElement.value || selectedElement.value.type !== 'table') return

  const newContent = [...selectedElement.value.content]
  newContent[rowIndex][colIndex] = value
  selectedElement.value.content = newContent
  addToHistory()
}

// Geçmişi Güncelleme
const addToHistory = () => {
  historyIndex.value++
  history.value = history.value.slice(0, historyIndex.value)
  history.value.push(JSON.stringify(elements.value))
}

// İndirme Butonu Kontrolü
const canDownload = computed(() => elements.value.length > 0)

// Geri Al ve İleri Al
const undoAction = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    elements.value = JSON.parse(history.value[historyIndex.value])
    toast({
      title: 'Geri alındı!',
      description: '',
      variant: 'info'
    })
  }
}

const redoAction = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    elements.value = JSON.parse(history.value[historyIndex.value])
    toast({
      title: 'İleri alındı!',
      description: '',
      variant: 'info'
    })
  }
}

// PDF Oluşturma
const generatePDF = () => {
  if (elements.value.length === 0) {
    toast({
      title: 'PDF oluşturmak için en az bir element ekleyin!',
      description: '',
      variant: 'destructive'
    })
    return
  }

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

  try {
    elements.value.forEach(element => {
      if (!element) return // Null elementleri atla

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
            if (element.style.width.toString().includes('%')) {
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

        case 'video':
          if (element.content) {
            docDefinition.content.push({
              video: element.content,
              width: parseInt(element.style.width) || 480,
              height: parseInt(element.style.height) || 270,
              alignment: element.style.textAlign || 'center',
              margin: [0, 10, 0, 10]
            })
          }
          break

        case 'link':
          docDefinition.content.push({
            text: element.text || 'Bağlantı',
            link: element.href || 'https://example.com',
            fontSize: element.style.fontSize,
            color: element.style.color,
            decoration: 'underline',
            alignment: element.style.textAlign
          })
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
            const listType = element.style.listStyleType || 'disc'
            const list = {
              [listType === 'decimal' || listType === 'lower-alpha' || listType === 'upper-alpha' ? 'ol' : 'ul']:
                element.content.filter(item => item.trim()).map(item => ({
                  text: item,
                  fontSize: element.style.fontSize,
                  color: element.style.color,
                })),
              margin: [0, 5, 0, 5]
            }

            if (listType === 'lower-alpha') {
              list.type = 'lower-alpha'
            } else if (listType === 'upper-alpha') {
              list.type = 'upper-alpha'
            }

            docDefinition.content.push(list)
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

    const pdfDocGenerator = pdfMake.createPdf(docDefinition)
    pdfDocGenerator.download('document.pdf')
    toast({
      title: 'PDF başarıyla oluşturuldu!',
      description: '',
      variant: 'success'
    })
  } catch (error) {
    console.error('PDF oluşturma hatası:', error)
    toast({
      title: 'PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
      description: '',
      variant: 'destructive'
    })
  }
}

// Liste Sınıfı Hesaplama
const listClass = computed(() => {
  if (!selectedElement.value) return ''
  switch (selectedElement.value.style.listStyleType) {
    case 'decimal':
      return 'list-decimal list-inside'
    case 'lower-alpha':
      return 'list-lower-alpha list-inside'
    case 'upper-alpha':
      return 'list-upper-alpha list-inside'
    case 'circle':
      return 'list-circle list-inside'
    case 'square':
      return 'list-square list-inside'
    case 'disc':
    default:
      return 'list-disc list-inside'
  }
})

// Elementleri Temizleme
const clearElements = () => {
  if (confirm('Tüm içeriği silmek istediğinize emin misiniz?')) {
    elements.value = []
    selectedElement.value = null
    addToHistory()
    toast({
      title: 'Tüm içerikler temizlendi!',
      description: '',
      variant: 'info'
    })
  }
}

// Önizleme Modunu Toggle Etme
const togglePreview = () => {
  isPreviewMode.value = !isPreviewMode.value
  if (isPreviewMode.value) {
    selectedElement.value = null
    toast({
      title: 'Önizleme moduna geçildi!',
      description: '',
      variant: 'info'
    })
  } else {
    toast({
      title: 'Düzenleme moduna geçildi!',
      description: '',
      variant: 'info'
    })
  }
}

// Menü Toggle Fonksiyonu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Yardımcı Fonksiyon: İlk Harfi Büyük Yapma
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
</script>

<style scoped>
/* Responsive Düzenlemeler */
@media (max-width: 768px) {
  .page-container {
    max-width: 100% !important;
    width: 100% !important;
  }

  /* Ayar Paneli Mobilde Alttan Açılacak */
  .fixed.inset-0.z-40 {
    background: none;
    /* Overlay kaldırıldı */
  }

  /* Ayar Paneli Alttan Açılacak */
  @media (max-width: 768px) {
    .fixed.inset-0.z-40 {
      top: auto;
      bottom: 0;
      height: 50%;
    }
  }
}

/* Transition for Side Panels */
.transition-transform {
  transition-property: transform;
}

.transition-transform.duration-300 {
  transition-duration: 300ms;
}

/* Hide scrollbars */
.page-container::-webkit-scrollbar {
  display: none;
}

.page-container {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

/* Button Styles */
button {
  cursor: pointer;
}

/* Animation for Error Message */
.fixed {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>


// Yapılacaklar : 

// 1- Şuan düzenle dediğimiz zaman bir şey olmuyor. 
// 2- PDF e video ekleniyor mu ki? buraya yazmışız ama ekleniyor mu emin değilim.
// 3- Sayfayı böyle yazdıkça uzayıp gidiyor. Ama PDF de biliyorsun her şey sayfa sayfa. Yani bir sayfa bittiğinde ya diğer sayfaya geçsin. ya da sol alttan manuel olarak yeni bir sayfa ekleyebilsin. 
// 4- Şuan sadece bir sayfa var. Ama sayfa sayısını arttırabilmeli.
// 5- Elementlerde ki şekil kısmını tamamen kaldıralım lütfen. Bunu istemiyorum.
// 6- Şuan yeni bir görsel falan ekleyemiyorum. Metin düzenleyemiyorum.
// 7- Bildirim Özelleştirmeleri: useToast fonksiyonu ile bildirimlerin süresini ve konumunu daha da özelleştirebilirsiniz. Örneğin, kritik hatalar için kalıcı bildirimler veya belirli sürelerde otomatik kapanan bildirimler ekleyebilirsiniz.
// 8- Görsel Geri Bildirim: Elementler üzerinde sağ tıklama yapıldığında görsel olarak hangi işlemlerin yapılabileceğini belirtmek için ikonlar veya diğer görsel öğeler ekleyebilirsiniz.
// 9- PDF e eklenebilecek daha fazla element türü ekleyebilmek istiyorum. burayı daha da modüler hale getirmek istiyorum. Her element farklı bı component haline de getirilebilir.