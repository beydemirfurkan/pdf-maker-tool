<template>
  <div class="h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Sol Menü -->
    <div :class="[
      'fixed inset-0 z-40 md:static md:z-auto md:translate-x-0 transition-transform duration-300',
      isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      'w-64 border-r bg-white shadow-lg p-4 flex flex-col'
    ]">
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

        <button @click="addElement('video')"
          class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <span class="material-icons-outlined mb-2">video_library</span>
          <span class="text-sm">Video</span>
        </button>

        <button @click="addElement('link')"
          class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <span class="material-icons-outlined mb-2">link</span>
          <span class="text-sm">Bağlantı</span>
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

        <button @click="addElement('shape')"
          class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <span class="material-icons-outlined mb-2">category</span>
          <span class="text-sm">Şekil</span>
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
              <input v-model.number="pageSettings.margins.top" type="number" placeholder="Üst"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0">
              <input v-model.number="pageSettings.margins.right" type="number" placeholder="Sağ"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0">
              <input v-model.number="pageSettings.margins.bottom" type="number" placeholder="Alt"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0">
              <input v-model.number="pageSettings.margins.left" type="number" placeholder="Sol"
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
          <button @click="generatePDF" :disabled="!canDownload"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="material-icons-outlined">picture_as_pdf</span>
            PDF Oluştur
          </button>

          <button @click="clearElements"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <span class="material-icons-outlined">delete_sweep</span>
            Temizle
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
          <!-- Ayar Paneli Toggle Butonu (Mobil) -->
          <button @click="toggleSettings" class="md:hidden p-2 rounded-lg hover:bg-gray-100"
            :class="{ 'bg-blue-50': isSettingsOpen }" title="Ayarlar">
            <span class="material-icons-outlined">settings</span>
          </button>
        </div>
      </div>

      <!-- Hata Bildirimi -->
      <Toast />

      <!-- Düzenleyici Alanı -->
      <div class="flex-1 p-4 md:p-8 overflow-auto bg-gray-100">
        <div class="page-container mx-auto bg-white shadow-xl transition-all duration-300" :class="{
          'w-full max-w-[595px]': pageSettings.orientation === 'portrait',
          'w-full max-w-[842px]': pageSettings.orientation === 'landscape'
        }" :style="{
          minHeight: pageSettings.orientation === 'portrait' ? '842px' : '595px',
          padding: `${pageSettings.margins.top}px ${pageSettings.margins.right}px ${pageSettings.margins.bottom}px ${pageSettings.margins.left}px`
        }">
          <draggable v-model="elements" :group="{ name: 'elements' }" item-key="id" class="min-h-full space-y-4"
            :disabled="isPreviewMode">
            <template #item="{ element }">
              <div class="relative group" :class="{ 'cursor-move': !isPreviewMode }"
                @click.stop="selectElement(element)">
                <div class="relative rounded p-2 transition-all duration-200" :class="[
                  !isPreviewMode && 'border-2 border-transparent hover:border-blue-200',
                  !isPreviewMode && selectedElement?.id === element.id && 'border-blue-500 shadow-lg'
                ]">
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
                          <td v-for="(cell, colIndex) in row" :key="colIndex" class="border p-2" :style="element.style">
                            <input type="text" v-model="element.content[rowIndex][colIndex]"
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
                        <input type="text" v-model="element.content[index]"
                          class="flex-1 px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500"
                          @keydown.enter.prevent="addListItem(index)" @keydown.backspace.prevent="removeListItem(index)"
                          placeholder="Liste öğesi" />
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

                  <!-- Element Ayarları -->
                  <div v-if="!isPreviewMode && element === selectedElement"
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

    <!-- Sağ Ayar Paneli -->
    <div :class="[
      'fixed inset-0 z-40 md:static md:z-auto md:translate-x-0 transition-transform duration-300',
      isSettingsOpen ? 'translate-x-0 md:translate-x-0' : 'translate-x-full md:translate-x-0',
      'w-full md:w-64 border-t md:border-l bg-white shadow-lg p-4 md:p-4 flex flex-col md:flex-col'
    ]">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">Element Ayarları</h3>
        <button @click="toggleSettings" class="text-gray-400 hover:text-gray-600">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>

      <div class="space-y-4 overflow-auto">
        <!-- Metin ve Başlık Ayarları -->
        <template v-if="selectedElement && ['text', 'heading'].includes(selectedElement.type)">
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
            <input type="number" v-model.number="selectedElement.style.fontSize"
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
        <template v-if="selectedElement && selectedElement.type === 'image'">
          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Görsel Yükle</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="w-full">
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Boyut</label>
            <div class="grid grid-cols-2 gap-2">
              <input v-model.number="selectedElement.style.width" type="number" placeholder="Genişlik"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <input v-model.number="selectedElement.style.height" type="number" placeholder="Yükseklik"
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

        <!-- Video Ayarları -->
        <template v-if="selectedElement && selectedElement.type === 'video'">
          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Video Yükle veya Bağlantı Ekle</label>
            <input type="text" v-model="selectedElement.content" placeholder="Video URL'si veya dosya yolu"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Boyut</label>
            <div class="grid grid-cols-2 gap-2">
              <input v-model.number="selectedElement.style.width" type="number" placeholder="Genişlik"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <input v-model.number="selectedElement.style.height" type="number" placeholder="Yükseklik"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
        </template>

        <!-- Bağlantı Ayarları -->
        <template v-if="selectedElement && selectedElement.type === 'link'">
          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">Bağlantı Metni</label>
            <input type="text" v-model="selectedElement.text" placeholder="Bağlantı metni"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-600 block">URL</label>
            <input type="url" v-model="selectedElement.href" placeholder="https://example.com"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
        </template>

        <!-- Tablo Ayarları -->
        <template v-if="selectedElement && selectedElement.type === 'table'">
          <div class="space-y-4">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <tbody>
                  <tr v-for="(row, rowIndex) in selectedElement.content" :key="rowIndex">
                    <td v-for="(cell, colIndex) in row" :key="colIndex" class="border p-2 min-w-[100px]">
                      <input type="text" v-model="selectedElement.content[rowIndex][colIndex]"
                        class="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500" @input="addToHistory">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-600 block mb-2">Hücre Dolgusu</label>
                <input type="number" v-model.number="selectedElement.style.cellPadding"
                  class="w-full px-3 py-2 border rounded-lg" min="0" max="20">
              </div>
              <div>
                <label class="text-sm text-gray-600 block mb-2">Kenarlık Kalınlığı</label>
                <input type="number" v-model.number="selectedElement.style.borderWidth"
                  class="w-full px-3 py-2 border rounded-lg" min="0" max="5">
              </div>
            </div>

            <div>
              <label class="text-sm text-gray-600 block mb-2">Kenarlık Rengi</label>
              <input type="color" v-model="selectedElement.style.borderColor" class="w-full h-10 rounded-lg">
            </div>
          </div>
        </template>

        <!-- Liste Ayarları -->
        <template v-if="selectedElement && selectedElement.type === 'list'">
          <div class="space-y-4">
            <div>
              <label class="text-sm text-gray-600 block mb-2">Liste Tipi</label>
              <select v-model="selectedElement.style.listStyleType"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="disc">Nokta</option>
                <option value="circle">Halka</option>
                <option value="square">Kare</option>
                <option value="decimal">Sayı</option>
                <option value="lower-alpha">Harf (a, b, c)</option>
                <option value="upper-alpha">Harf (A, B, C)</option>
              </select>
            </div>
          </div>
        </template>

        <!-- Şekil Ayarları -->
        <template v-if="selectedElement && selectedElement.type === 'shape'">
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
              <input v-model.number="selectedElement.style.width" type="number" placeholder="Genişlik"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <input v-model.number="selectedElement.style.height" type="number" placeholder="Yükseklik"
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

    <!-- Ayar Paneli Toggle Butonu (Mobil) -->
    <button @click="toggleSettings"
      class="md:hidden p-2 m-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
      <span class="material-icons">settings</span>
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect, computed } from 'vue'
import draggable from 'vuedraggable'
import pdfMake from 'pdfmake/build/pdfmake'
import { useToast } from 'vue-toast-notification'

// Bildirim Sistemi
const toast = useToast()

// Elementler ve Seçili Element
const elements = ref([])
const selectedElement = ref(null)
const isPreviewMode = ref(false)

// Menü ve Ayar Paneli Durumu
const isMenuOpen = ref(false)
const isSettingsOpen = ref(false)

// Hata Mesajı
const errorMessage = ref('')

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

// Hazır Şablonlar
const templates = ref([
  { id: 1, name: 'Boş Belge' },
  { id: 2, name: 'Rapor Şablonu' },
  { id: 3, name: 'Mektup Şablonu' }
])

// Sayfa Boyutu ve Yönünü İzleme
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
          height: 270
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
        }
      }
  }

  elements.value.push(newElement)
  addToHistory()
  toast.success(`${capitalize(type)} elementi eklendi!`)
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
    toast.info(`${capitalize(element.type)} elementi silindi!`)
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
  toast.success(`${capitalize(element.type)} elementi kopyalandı!`)
}

// Element Seçme
const selectElement = (element) => {
  if (!isPreviewMode.value) {
    selectedElement.value = element
    // Otomatik olarak sağ ayar panelini aç
    if (window.innerWidth < 768) {
      isSettingsOpen.value = true
    }
  }
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
        toast.success('Görsel yüklendi!')
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Video Yükleme veya Bağlantı Ekleme
const handleVideoUpload = (event) => {
  if (!selectedElement.value || selectedElement.value.type !== 'video') return

  const url = event.target.value
  if (url) {
    updateElement(selectedElement.value, {
      content: url,
      style: {
        ...selectedElement.value.style,
        width: 480,
        height: 270
      }
    })
    toast.success('Video eklendi!')
  }
}

// Stil Toggle Etme
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
    elements.value.forEach((el, idx) => {
      if (el.id === selectedElement.value.id) {
        el.content.splice(index + 1, 0, '')
      }
    })
    addToHistory()
    toast.success('Yeni liste öğesi eklendi!')
  }
}

// Liste Öğesi Silme
const removeListItem = (index) => {
  if (selectedElement.value && selectedElement.value.type === 'list') {
    if (selectedElement.value.content.length > 1) {
      selectedElement.value.content.splice(index, 1)
      addToHistory()
      toast.info('Liste öğesi silindi!')
    }
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

// Hedef: İndirme butonu, PDF'de hiçbir içerik yoksa devre dışı kalmalı
const canDownload = computed(() => elements.value.length > 0)

// Geri Al ve İleri Al
const undoAction = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    elements.value = JSON.parse(history.value[historyIndex.value])
    toast.info('Geri alındı!')
  }
}

const redoAction = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    elements.value = JSON.parse(history.value[historyIndex.value])
    toast.info('İleri alındı!')
  }
}

// PDF Oluşturma
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
    toast.success('PDF başarıyla oluşturuldu!')
  } catch (error) {
    console.error('PDF oluşturma hatası:', error)
    toast.error('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
  }
}

// Şablon Yükleme (Örnek olarak Boş Belge)
const loadTemplate = (template) => {
  if (template.name === 'Boş Belge') {
    elements.value = []
    selectedElement.value = null
    addToHistory()
    toast.info('Boş belge şablonu yüklendi!')
  }
  // Diğer şablonlar için ekleme yapılabilir
}

// Elementleri Temizleme
const clearElements = () => {
  if (confirm('Tüm içeriği silmek istediğinize emin misiniz?')) {
    elements.value = []
    selectedElement.value = null
    addToHistory()
    toast.info('Tüm içerikler temizlendi!')
  }
}

// Önizleme Modunu Toggle Etme
const togglePreview = () => {
  isPreviewMode.value = !isPreviewMode.value
  if (isPreviewMode.value) {
    selectedElement.value = null
    toast.info('Önizleme moduna geçildi!')
  } else {
    toast.info('Düzenleme moduna geçildi!')
  }
}

// Menü ve Ayar Paneli Toggle Fonksiyonları
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

// Yardımcı Fonksiyon: İlk Harfi Büyük Yapma
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
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
    case 'disc':
    default:
      return 'list-disc list-inside'
  }
})
</script>

<style scoped>
@media (max-width: 768px) {
  .page-container {
    max-width: 100% !important;
    width: 100% !important;
  }

  @media (max-width: 768px) {
    .fixed.inset-0.z-40 {
      top: auto;
      bottom: 0;
      height: 50%;
    }
  }
}

.transition-transform {
  transition-property: transform;
}

.transition-transform.duration-300 {
  transition-duration: 300ms;
}

.page-container::-webkit-scrollbar {
  display: none;
}

.page-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

button {
  cursor: pointer;
}

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
