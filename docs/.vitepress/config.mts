import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/blog/',
  title: "shump的个人博客",
  description: '个人学习笔记记录',
  head: [
    [
      'link',
      { rel: 'icon', href: '/logo.svg' }
    ]
  ],
  themeConfig: {
    logo: '/logo.svg',
    // 类型为 `DefaultTheme.Config`
    nav: [
      // 导航项，包含文字和跳转的链接
      { text: '首页', link: '/' },

      { text: '知识库', link: '/knowledge/' },
      { text: '工具', link: '/tools/' },
    ],

    sidebar: {
      '/knowledge/': [
        {
          items: [
            { text: '简介', link: '/knowledge/' },
            {
              text: 'JAVA',
              collapsed: true,
              items: [
                { text: '概览', link: '/knowledge/java/' },
              ]
            },
            {
              text: 'AI',
              collapsed: true,
              items: [
                { text: '概览', link: '/knowledge/ai/' },
              ]
            },
            {
              text: '大数据',
              collapsed: true,
              items: [
                { text: '概览', link: '/knowledge/bigdata/' },

              ]
            },

          ]
        }
      ],
      '/tools/': [
        {
          text: '工具',
          items: [
            { text: '首页', link: '/tools/' },
            // { text: '科学上网', link: '/tools/proxy' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ZShump' }
    ]
  }
})