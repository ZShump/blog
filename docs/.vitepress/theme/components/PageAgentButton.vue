<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

type PageAgentLike = {
  panel: {
    show: () => void
    hide: () => void
  }
}

// 默认配置
const defaultConfig = {
  baseURL: 'https://api.page-agent.com',
  apiKey: '',
  model: 'gpt-4o-mini',
  language: 'zh-CN'
}

const isVisible = ref(false)
const isPanelVisible = ref(false)
const showConfig = ref(false)
const apiKeyInput = ref('')
const baseURLInput = ref('')
const modelInput = ref('')
const languageInput = ref('')
const debugInfo = ref<any>({})
const apiKeyInputRef = ref<HTMLInputElement>()

// 当配置对话框打开时自动聚焦到 API Key 输入框
watch(showConfig, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    apiKeyInputRef.value?.focus()
  }
})

// 从 localStorage 读取配置
const loadConfig = () => {
  if (typeof window === 'undefined') return defaultConfig

  const stored = localStorage.getItem('pageAgentConfig')
  if (stored) {
    try {
      return { ...defaultConfig, ...JSON.parse(stored) }
    } catch {
      return defaultConfig
    }
  }
  return defaultConfig
}

// 保存配置到 localStorage
const saveConfig = () => {
  if (!apiKeyInput.value.trim()) {
    alert('请输入 API Key')
    return
  }

  const config = {
    apiKey: apiKeyInput.value.trim(),
    baseURL: baseURLInput.value.trim() || defaultConfig.baseURL,
    model: modelInput.value.trim() || defaultConfig.model,
    language: languageInput.value.trim() || defaultConfig.language
  }

  localStorage.setItem('pageAgentConfig', JSON.stringify(config))
  showConfig.value = false

  // 重新加载页面以应用新配置
  window.location.reload()
}

const syncPanelState = (agent: PageAgentLike) => {
  const panel = agent.panel as typeof agent.panel & {
    __pageAgentPatched?: boolean
  }

  if (panel.__pageAgentPatched) {
    return
  }

  const originalShow = panel.show.bind(panel)
  const originalHide = panel.hide.bind(panel)

  panel.show = () => {
    console.log('Panel: show called')
    originalShow()
    isPanelVisible.value = true
  }

  panel.hide = () => {
    console.log('Panel: hide called')
    originalHide()
    isPanelVisible.value = false
  }

  panel.__pageAgentPatched = true
  console.log('Panel state sync enabled')
}

onMounted(async () => {
  // 只在客户端环境中加载 PageAgent
  if (typeof window !== 'undefined') {
    await initPageAgent()
  }
})

// 初始化 PageAgent
const initPageAgent = async () => {
  const config = loadConfig()
  const { baseURL, apiKey, model, language } = config
  debugInfo.value = { baseURL, model, language }

  // 检查 API Key
  if (!apiKey || apiKey.length < 10) {
    console.warn('PageAgent: API Key 未配置')
    console.log('点击按钮配置 API Key')
    isVisible.value = true // 显示按钮，点击后会显示配置界面
    return null
  }

  try {
    // 动态导入 PageAgent
    const module = await import('page-agent')

    // 初始化 PageAgent
    const agent = new module.PageAgent({
      model,
      baseURL,
      apiKey,
      language
    })

    syncPanelState(agent)

    // 显示按钮
    isVisible.value = true

    // 保存实例到 window 对象
    ;(window as any).__pageAgent = agent

    // 重置面板状态
    isPanelVisible.value = false

    console.log('✅ PageAgent 初始化成功')
    return agent
  } catch (error) {
    console.error('❌ PageAgent 初始化失败:', error)
    console.error('错误详情:', error instanceof Error ? error.message : error)
    return null
  }
}

const togglePanel = async () => {
  console.log('=== togglePanel called ===')

  const agent = (window as any).__pageAgent as PageAgentLike | undefined
  console.log('agent exists:', !!agent)

  // 如果 agent 不存在，显示配置界面
  if (!agent) {
    console.log('No agent, showing config')
    // 打开配置时，预填充当前配置
    const config = loadConfig()
    apiKeyInput.value = config.apiKey || ''
    baseURLInput.value = config.baseURL || ''
    modelInput.value = config.model || ''
    languageInput.value = config.language || ''
    showConfig.value = true
    return
  }

  // 清理可能已失效的 agent 引用
  delete (window as any).__pageAgent

  console.log('Reinitializing PageAgent...')
  // 每次都重新初始化，确保是最新状态
  const newAgent = await initPageAgent()
  if (newAgent) {
    try {
      newAgent.panel.show()
      isPanelVisible.value = true
      console.log('✅ Panel shown successfully')
    } catch (error) {
      console.error('❌ Failed to show panel:', error)
    }
  } else {
    console.log('❌ Failed to initialize PageAgent')
  }
}
</script>

<template>
  <div class="page-agent-wrapper">
    <Transition name="fade">
      <button
        v-if="isVisible"
        class="page-agent-button"
        :class="{ 'is-active': isPanelVisible }"
        @click="togglePanel"
        title="AI 助手"
      >
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 18.2C9.5 18.2 7.29 16.92 6 15.03C6.03 13.04 10 11.96 12 11.96C13.99 11.96 17.97 13.04 18 15.03C16.71 16.92 14.5 18.2 12 18.2Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </Transition>

    <!-- 配置对话框 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showConfig" class="config-modal">
          <div class="config-content">
            <h3>配置 PageAgent</h3>
            <p class="config-hint">请输入您的 PageAgent 配置信息（保存在浏览器本地）</p>

            <div class="config-form" @keyup.enter="saveConfig">
              <div class="config-field">
                <label for="apiKey">API Key <span class="required">*</span>:</label>
                <input
                  id="apiKey"
                  v-model="apiKeyInput"
                  type="password"
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                  class="config-input"
                  ref="apiKeyInputRef"
                />
              </div>

              <div class="config-field">
                <label for="baseURL">Base URL:</label>
                <input
                  id="baseURL"
                  v-model="baseURLInput"
                  type="text"
                  placeholder="https://api.page-agent.com"
                  class="config-input"
                />
                <span class="config-hint-text">留空使用默认值</span>
              </div>

              <div class="config-field">
                <label for="model">Model:</label>
                <input
                  id="model"
                  v-model="modelInput"
                  type="text"
                  placeholder="gpt-4o-mini"
                  class="config-input"
                />
                <span class="config-hint-text">留空使用默认值</span>
              </div>

              <div class="config-field">
                <label for="language">Language:</label>
                <select id="language" v-model="languageInput" class="config-select">
                  <option value="">默认（zh-CN）</option>
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>

              <div class="config-buttons">
                <button @click="saveConfig" class="config-btn config-btn-primary" type="button">
                  保存
                </button>
                <button @click="showConfig = false" class="config-btn config-btn-secondary" type="button">
                  取消
                </button>
              </div>
            </div>

            <p class="config-note">
              💡 提示：配置信息仅保存在您的浏览器本地存储中，不会上传到服务器
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 调试信息（开发时显示） -->
    <div v-if="!isVisible && debugInfo.model" class="page-agent-debug">
      <p>⚠️ PageAgent 未初始化</p>
      <p>Base URL: {{ debugInfo.baseURL }}</p>
      <p>Model: {{ debugInfo.model }}</p>
    </div>
  </div>
</template>

<style scoped>
.page-agent-button {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3D8A5A 0%, #2D7A50 100%);
  border: none;
  box-shadow: 0 4px 24px rgba(61, 138, 90, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 9999;
  color: #FFFFFF;
}

.page-agent-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 32px rgba(61, 138, 90, 0.4);
}

.page-agent-button.is-active {
  transform: scale(1.06);
  box-shadow: 0 6px 32px rgba(61, 138, 90, 0.42);
}

.icon {
  width: 28px;
  height: 28px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 调试信息 */
.page-agent-debug {
  position: fixed;
  bottom: 40px;
  right: 40px;
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  font-size: 12px;
  z-index: 9998;
}

.page-agent-debug p {
  margin: 4px 0;
}

/* 配置对话框 */
.config-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.config-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.config-content h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.config-hint {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.config-form {
  margin-bottom: 16px;
}

.config-field {
  margin-bottom: 16px;
}

.config-field label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.config-field .required {
  color: #e74c3c;
  margin-left: 2px;
}

.config-hint-text {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.config-input,
.config-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.config-input:focus,
.config-select:focus {
  outline: none;
  border-color: #3D8A5A;
  box-shadow: 0 0 0 3px rgba(61, 138, 90, 0.1);
}

.config-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.config-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.config-btn-primary {
  background: #3D8A5A;
  color: white;
}

.config-btn-primary:hover {
  background: #2D7A50;
}

.config-btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.config-btn-secondary:hover {
  background: #e5e5e5;
}

.config-note {
  margin: 12px 0 0 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

/* Modal 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .config-content,
.modal-leave-to .config-content {
  transform: scale(0.9);
}

.modal-enter-active .config-content,
.modal-leave-active .config-content {
  transition: transform 0.3s ease;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-agent-button {
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
  }

  .icon {
    width: 24px;
    height: 24px;
  }

  .config-content {
    padding: 20px;
    width: 95%;
  }
}
</style>
