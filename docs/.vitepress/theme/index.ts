import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './layouts/Layout.vue'
import PageAgentButton from './components/PageAgentButton.vue'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // 注册 PageAgent 全局组件
    app.component('PageAgentButton', PageAgentButton)
  }
} satisfies Theme
