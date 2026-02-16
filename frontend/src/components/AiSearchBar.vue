<template>
  <div class="ai-search-bar" :class="{ 'focused': isFocused }">
    <!-- Trigger Button -->
    <button
      class="search-trigger"
      @click="openChat"
      title="AI 助手"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
      </svg>
      <span class="trigger-label">{{ label }}</span>
    </button>

    <!-- Inline Input (expanded mode) -->
    <div v-if="expanded" class="inline-input-wrapper">
      <input
        ref="inlineInput"
        v-model="query"
        type="text"
        placeholder="向 AI 助手提问..."
        class="inline-input"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown="handleKeydown"
      >
      <button
        class="inline-send-btn"
        @click="sendInlineQuery"
        :disabled="!query.trim()"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.01 21L23 12 2.01 3 2 10L15 12L2.01 21ZM2.01 21L12 15 2.01 3" fill="currentColor"/>
        </svg>
      </button>
      <button class="inline-expand-btn" @click="expanded = false" title="收起">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
        </svg>
      </button>
    </div>

    <!-- Quick Suggestions -->
    <div v-if="!expanded && showSuggestions" class="suggestions-dropdown">
      <div class="suggestions-header">
        <span>快速提问</span>
        <button class="close-suggestions" @click="showSuggestions = false">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div class="suggestions-list">
        <button
          v-for="(suggestion, idx) in suggestions"
          :key="idx"
          class="suggestion-item"
          @click="selectSuggestion(suggestion)"
        >
          <svg class="suggestion-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
          </svg>
          <span>{{ suggestion }}</span>
        </button>
      </div>
    </div>

    <!-- Chat Sidebar Portal -->
    <Teleport to="body">
      <AiChatSidebar
        v-model="isChatOpen"
        :session-id="sessionId"
        @open-search="expanded = true"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AiChatSidebar from './AiChatSidebar.vue'

const props = defineProps<{
  label?: string
  expanded?: boolean
}>()

const emit = defineEmits<{
  'search': [query: string]
}>()

// State
const isChatOpen = ref(false)
const expanded = ref(props.expanded ?? false)
const query = ref('')
const isFocused = ref(false)
const showSuggestions = ref(false)
const sessionId = ref(`global_${Date.now()}`)

// Suggestions based on current page
const suggestions = ref<string[]>([
  '如何使用本系统？',
  'MPI指标如何计算？',
  '如何导入钻孔数据？'
])

// Methods
const openChat = () => {
  isChatOpen.value = true
  showSuggestions.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    sendInlineQuery()
  }
}

const sendInlineQuery = async () => {
  const q = query.value.trim()
  if (!q) return

  // Open chat and send message
  isChatOpen.value = true
  emit('search', q)
  query.value = ''
}

const selectSuggestion = (suggestion: string) => {
  query.value = suggestion
  sendInlineQuery()
  showSuggestions.value = false
}

// Watch for search events from sidebar
const handleSearchFromChat = (e: CustomEvent) => {
  if (e.detail) {
    query.value = e.detail
    sendInlineQuery()
  }
}

onMounted(() => {
  window.addEventListener('ai-search', handleSearchFromChat)
})
</script>

<style scoped>
.ai-search-bar {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-trigger:hover {
  border-color: #667eea;
  background: #f8f8ff;
}

.search-trigger svg {
  width: 18px;
  height: 18px;
  color: #667eea;
}

.trigger-label {
  font-size: 14px;
  color: #333;
}

.ai-search-bar.focused .search-trigger {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.inline-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.inline-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  min-width: 200px;
}

.inline-input::placeholder {
  color: #999;
}

.inline-send-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #667eea;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.inline-send-btn:hover:not(:disabled) {
  background: #5568d3;
}

.inline-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.inline-expand-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.inline-expand-btn:hover {
  background: #e0e0e0;
}

.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideDown 0.2s ease;
  z-index: 100;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.close-suggestions {
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-suggestions:hover {
  background: #f0f0f0;
  color: #333;
}

.suggestions-list {
  padding: 8px;
}

.suggestion-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.suggestion-item:hover {
  background: #f8f8ff;
}

.suggestion-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
  flex-shrink: 0;
}

.suggestion-item span {
  font-size: 13px;
  color: #333;
}
</style>
