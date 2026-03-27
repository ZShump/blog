import { withMermaid } from 'vitepress-plugin-mermaid'
import { nav, sidebar } from './sidebar-nav.js'

export default withMermaid({
  base: '/blog/',
  title: "shump的个人博客",
  description: '个人学习笔记记录',
  lastUpdated: true,
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (
            warning.code === 'EVAL' &&
            warning.id?.includes('@page-agent/page-controller')
          ) {
            return
          }

          defaultHandler(warning)
        }
      }
    }
  },
  head: [
    [
      'link',
      { rel: 'icon', href: '/blog/logo.svg' }
    ]
  ],
  themeConfig: {
    logo: '/logo.svg',
    // 导航配置（由 scripts/generate-nav-sidebar.js 自动生成）
    nav,
    search: {
      provider: 'local'
    },

    // 侧边栏配置（由 scripts/generate-nav-sidebar.js 自动生成）
    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ZShump' }
    ]
  }
})
