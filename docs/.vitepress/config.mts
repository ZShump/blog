import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/blog/',
  title: "shump的个人博客",
  description: '个人学习笔记记录',
  head: [
    [
      'link',
      { rel: 'icon', href: '/blog/logo.svg' }
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
              text: 'AI',
              collapsed: true,
              items: [
                { text: '概览', link: '/knowledge/ai/' },
                { text: '神经网络', link: '/knowledge/ai/神经网络' },
                { text: '线性代数', link: '/knowledge/ai/线性代数' },
                { text: 'Transformer 模型', link: '/knowledge/ai/Transformer模型' },
              ]
            },
            {
              text: '大数据',
              collapsed: true,
              items: [
                { text: '概览', link: '/knowledge/bigdata/' },
                { text: '平台概念了解', link: '/knowledge/bigdata/平台概念了解' },
                { text: '深入浅出 Hadoop YARN', link: '/knowledge/bigdata/深入浅出 Hadoop YARN' },
                { text: 'HBase', link: '/knowledge/bigdata/HBase' },
                { text: 'Hive与数据库（Derby、MySQL）之间的关系', link: '/knowledge/bigdata/Hive与数据库（Derby、MySQL）之间的关系' },
                { text: 'Impala and Hive Q&A', link: '/knowledge/bigdata/impala and Hive Q&A' },
                { text: '大数据场景下的消息队列：Kafka3.0快速入门', link: '/knowledge/bigdata/大数据场景下的消息队列：Kafka3.0快速入门' },
              ]
            },
            {
              text: 'JAVA',
              collapsed: true,
              items: [
                { text: '概览', link: '/knowledge/java/' },
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
            { text: 'PageAgent AI 助手', link: '/tools/page-agent' }
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
