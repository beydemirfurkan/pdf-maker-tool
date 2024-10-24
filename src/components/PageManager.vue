<template>
    <div class="flex-1 flex flex-col">
        <!-- Birleştirilmiş Minimal Üst Bar -->
        <div class="h-12 border-b bg-white px-4 flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <!-- Sol Taraf - PDF ve Sayfa İşlemleri -->
                <div class="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" @click="$emit('generate-pdf')"
                                    :disabled="!canDownload" class="h-8 w-8">
                                    <span class="material-icons-outlined text-lg">picture_as_pdf</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>PDF Oluştur</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" @click="$emit('clear-page')" class="h-8 w-8">
                                    <span class="material-icons-outlined text-lg">delete_sweep</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Sayfayı Temizle</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div class="h-4 w-px bg-gray-200 mx-2" />

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" @click="$emit('undo')" :disabled="!canUndo"
                                    class="h-8 w-8">
                                    <span class="material-icons-outlined text-lg">undo</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Geri Al</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" @click="$emit('redo')" :disabled="!canRedo"
                                    class="h-8 w-8">
                                    <span class="material-icons-outlined text-lg">redo</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>İleri Al</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" @click="$emit('toggle-preview')"
                                    :class="{ 'bg-blue-50': isPreviewMode }" class="h-8 w-8">
                                    <span class="material-icons-outlined text-lg">preview</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Önizleme</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <!-- Orta Kısım - Sayfa Bilgisi ve Navigasyon -->
            <div class="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" @click="$emit('page-added')" class="h-8 w-8">
                                <span class="material-icons-outlined text-lg">add</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Yeni Sayfa Ekle</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div class="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" @click="$emit('page-changed', currentPage - 1)"
                                    :disabled="currentPage === 0" class="h-8 w-8">
                                    <span class="material-icons-outlined text-lg">chevron_left</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Önceki Sayfa</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <span class="text-sm text-gray-600 min-w-[60px] text-center">
                        {{ currentPage + 1 }} / {{ totalPages }}
                    </span>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" @click="$emit('page-changed', currentPage + 1)"
                                    :disabled="currentPage === totalPages - 1" class="h-8 w-8">
                                    <span class="material-icons-outlined text-lg">chevron_right</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Sonraki Sayfa</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>

        <!-- Sayfa İçeriği -->
        <div class="flex-1 overflow-auto bg-gray-100 p-8" ref="pageContainer">
            <div class="bg-white shadow-lg mx-auto transition-all duration-300" :style="pageStyle">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    pageSettings: {
        type: Object,
        required: true
    },
    canUndo: {
        type: Boolean,
        default: false
    },
    canRedo: {
        type: Boolean,
        default: false
    },
    canDownload: {
        type: Boolean,
        default: false
    },
    isPreviewMode: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits([
    'page-added',
    'page-changed',
    'generate-pdf',
    'clear-page',
    'undo',
    'redo',
    'toggle-preview'
])

const pageContainer = ref(null)

const PAGE_SIZES = {
    a4: { width: 595, height: 842 },
    a3: { width: 842, height: 1191 },
    letter: { width: 612, height: 792 },
    legal: { width: 612, height: 1008 }
}

const pageStyle = computed(() => {
    const size = PAGE_SIZES[props.pageSettings.size]
    const isPortrait = props.pageSettings.orientation === 'portrait'

    return {
        width: `${isPortrait ? size.width : size.height}px`,
        minHeight: `${isPortrait ? size.height : size.width}px`,
        padding: `${props.pageSettings.margins.top}px ${props.pageSettings.margins.right}px ${props.pageSettings.margins.bottom}px ${props.pageSettings.margins.left}px`
    }
})
</script>