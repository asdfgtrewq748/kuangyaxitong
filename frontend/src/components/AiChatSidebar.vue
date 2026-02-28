<template>
  <div
    class="ai-chat-sidebar"
    :class="{ 'open': isOpen, 'collapsed': isCollapsed }"
  >
    <!-- Header -->
    <div class="chat-header">
      <div class="header-left">
        <div class="ai-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
          </svg>
        </div>
        <span class="header-title" v-if="!isCollapsed">AI 助手</span>
      </div>
      <div class="header-actions">
        <button
          class="icon-btn"
          @click="toggleCollapse"
          :title="isCollapsed ? '展开' : '折叠'"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor" v-if="!isCollapsed"/>
            <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor" v-else/>
          </svg>
        </button>
        <button
          class="icon-btn close-btn"
          @click="close"
          title="关闭"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="chat-messages" ref="messagesContainer">
      <!-- Welcome Message -->
      <div v-if="messages.length === 0" class="welcome-message">
        <div class="ai-avatar">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
          </svg>
        </div>
        <h3 v-if="!isCollapsed">欢迎使用 AI 助手</h3>
        <p v-if="!isCollapsed">我可以帮您：</p>
        <ul v-if="!isCollapsed" class="help-list">
          <li>解释系统功能和操作方法</li>
          <li>分析钻孔数据和MPI指标</li>
          <li>提供故障排除建议</li>
          <li>指导数据导入和可视化</li>
        </ul>
        <div class="quick-actions" v-if="!isCollapsed">
          <button
            v-for="(action, idx) in quickActions"
            :key="idx"
            class="quick-action-btn"
            @click="sendQuickAction(action)"
          >
            {{ action }}
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div
        v-for="(msg, idx) in displayedMessages"
        :key="idx"
        class="message-row"
        :class="msg.role"
      >
        <div class="message-avatar" v-if="msg.role === 'assistant'">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
          </svg>
        </div>
        <div class="message-content">
          <div class="message-text" v-html="formatMessage(msg.content)"></div>
          <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="message-row assistant">
        <div class="message-avatar">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
          </svg>
        </div>
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="chat-input" v-if="!isCollapsed">
      <div class="input-wrapper">
        <textarea
          ref="messageInput"
          v-model="inputMessage"
          placeholder="输入您的问题..."
          rows="1"
          @keydown="handleKeydown"
          @input="autoResize"
          :disabled="isLoading"
        ></textarea>
        <button
          class="send-btn"
          type="button"
          title="发送消息"
          aria-label="发送消息"
          @click="sendMessage"
          :disabled="isLoading || !inputMessage.trim()"
          :class="{ 'active': inputMessage.trim() && !isLoading }"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10L15 12L2.01 21ZM2.01 21L12 15 2.01 3" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div class="input-actions">
        <button
          class="action-btn"
          @click="clearChat"
          title="清空对话"
          v-if="messages.length > 0"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3V2h-2v2H7V2H5v2H2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H5v-2h12v2z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

const props = defineProps<{
  modelValue?: boolean
  sessionId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'openSearch': []
}>()

// State
const isOpen = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', val)
})

const isCollapsed = ref(false)
const inputMessage = ref('')
const messages = ref<ChatMessage[]>([])
const isLoading = ref(false)
const streamingContent = ref('')

// Refs
const messagesContainer = ref<HTMLElement>()
const messageInput = ref<HTMLTextAreaElement>()

// Quick actions
const quickActions = ref([
  '如何导入钻孔数据？',
  '什么是MPI指标？',
  '如何生成等值线图？'
])

// Computed
const displayedMessages = computed(() => {
  if (streamingContent.value) {
    return [...messages.value, {
      role: 'assistant',
      content: streamingContent.value
    }]
  }
  return messages.value
})

// Session management
const sessionId = ref(props.sessionId || `session_${Date.now()}`)

// Methods
const close = () => isOpen.value = false

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const autoResize = () => {
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.style.height = 'auto'
      messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
    }
  })
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const formatMessage = (content: string) => {
  // Simple markdown-like formatting
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
}

const formatTime = (timestamp?: string) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendQuickAction = (action: string) => {
  inputMessage.value = action
  sendMessage()
}

const clearChat = () => {
  messages.value = []
  localStorage.removeItem(`ai_chat_${sessionId.value}`)
}

const sendMessage = async () => {
  const message = inputMessage.value.trim()
  if (!message || isLoading.value) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  })

  inputMessage.value = ''
  autoResize()
  scrollToBottom()

  isLoading.value = true
  streamingContent.value = ''

  try {
    const response = await fetch('http://localhost:8001/api/ai-chat/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        session_id: sessionId.value,
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'chunk') {
              streamingContent.value += parsed.content
              scrollToBottom()
            } else if (parsed.type === 'end') {
              // Finalize the message
              if (streamingContent.value) {
                messages.value.push({
                  role: 'assistant',
                  content: streamingContent.value,
                  timestamp: new Date().toISOString()
                })
                streamingContent.value = ''
                saveMessages()
              }
            } else if (parsed.type === 'error') {
              streamingContent.value = `[错误] ${parsed.message}`
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      role: 'assistant',
      content: '抱歉，AI助手暂时无法响应。请稍后再试。',
      timestamp: new Date().toISOString()
    })
  } finally {
    isLoading.value = false
    streamingContent.value = ''
  }
}

const saveMessages = () => {
  try {
    localStorage.setItem(`ai_chat_${sessionId.value}`, JSON.stringify(messages.value))
  } catch (e) {
    console.error('Failed to save messages:', e)
  }
}

const loadMessages = () => {
  try {
    const saved = localStorage.getItem(`ai_chat_${sessionId.value}`)
    if (saved) {
      messages.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load messages:', e)
  }
}

// Lifecycle
onMounted(() => {
  loadMessages()
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
})
</script>

<style scoped>
.ai-chat-sidebar {
  position: fixed;
  top: 60px;
  right: 0;
  width: 380px;
  height: calc(100vh - 60px);
  background: #ffffff;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease, width 0.3s ease;
  z-index: 1000;
}

.ai-chat-sidebar.open {
  transform: translateX(0);
}

.ai-chat-sidebar.collapsed {
  width: 60px;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  gap: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ai-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.8);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.welcome-message {
  text-align: center;
  padding: 24px;
  color: #666;
}

.ai-avatar {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #667eea;
}

.welcome-message h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.help-list {
  text-align: left;
  display: inline-block;
  margin: 16px 0;
  padding-left: 20px;
}

.help-list li {
  margin: 4px 0;
  color: #666;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.quick-action-btn {
  padding: 8px 12px;
  border: 1px solid #3f5abf;
  background: white;
  color: #2f469e;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  background: #3f5abf;
  color: white;
}

.message-row {
  display: flex;
  gap: 8px;
  animation: messageIn 0.3s ease;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-row.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-row.assistant .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-content {
  max-width: 280px;
}

.message-row.user .message-content {
  background: #667eea;
  color: white;
  border-radius: 16px 16px 4px 16px;
  padding: 12px 16px;
}

.message-row.assistant .message-content {
  background: #f5f5f5;
  color: #333;
  border-radius: 4px 16px 16px 16px;
  padding: 12px 16px;
}

.message-text {
  word-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.5;
}

.message-text code {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.message-row.user .message-time {
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
}

.typing-indicator {
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 4px 16px 16px 16px;
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.chat-input {
  border-top: 1px solid #f0f0f0;
  padding: 12px;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 8px;
}

.input-wrapper textarea {
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  max-height: 120px;
  outline: none;
}

.input-wrapper textarea::placeholder {
  color: #999;
}

.send-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #667eea;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0.5;
}

.send-btn.active {
  opacity: 1;
}

.send-btn:hover {
  background: #5568d3;
}

.send-btn:disabled {
  cursor: not-allowed;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
  color: #666;
}
</style>
