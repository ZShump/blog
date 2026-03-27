// 此文件由 scripts/generate-nav-sidebar.js 自动生成
// 请勿手动编辑

export const nav = [
  {
    "text": "首页",
    "link": "/"
  },
  {
    "text": "时间线",
    "link": "/timeline"
  },
  {
    "text": "关于我",
    "link": "/config/"
  },
  {
    "text": "工具箱",
    "link": "/工具/"
  },
  {
    "text": "知识库",
    "link": "/知识库/"
  }
]

export const sidebar = {
  "/config/": [
    {
      "text": "关于我",
      "link": "/config/"
    }
  ],
  "/工具/": [
    {
      "text": "工具箱",
      "link": "/工具/"
    },
    {
      "text": "PageAgent AI 助手使用指南",
      "link": "/工具/01-page-agent"
    }
  ],
  "/知识库/": [
    {
      "text": "知识库",
      "link": "/知识库/"
    },
    {
      "text": "AI 人工智能",
      "collapsed": true,
      "items": [
        {
          "text": "线性代数",
          "link": "/知识库/ai/01-线性代数"
        },
        {
          "text": "神经网络",
          "link": "/知识库/ai/02-神经网络"
        },
        {
          "text": "Transformer 模型",
          "link": "/知识库/ai/03-Transformer模型"
        },
        {
          "text": "Claude Code 完全使用指南",
          "link": "/知识库/ai/04-Claude Code 完全使用指南"
        },
        {
          "text": "Harness Engineering 是什么？给小白看的入门指南",
          "link": "/知识库/ai/05-harness-engineering入门"
        }
      ]
    },
    {
      "text": "JAVA 编程",
      "collapsed": true,
      "items": []
    },
    {
      "text": "大数据",
      "collapsed": true,
      "items": [
        {
          "text": "平台概念了解",
          "link": "/知识库/大数据/01-平台概念了解"
        },
        {
          "text": "深入浅出 Hadoop YARN",
          "link": "/知识库/大数据/02-深入浅出 Hadoop YARN"
        },
        {
          "text": "HBase",
          "link": "/知识库/大数据/03-HBase"
        },
        {
          "text": "Hive与数据库（Derby、MySQL）之间的关系",
          "link": "/知识库/大数据/04-Hive与数据库（Derby、MySQL）之间的关系"
        },
        {
          "text": "Impala and Hive Q&A",
          "link": "/知识库/大数据/05-impala and Hive Q&A"
        },
        {
          "text": "大数据场景下的消息队列：Kafka3.0快速入门",
          "link": "/知识库/大数据/06-大数据场景下的消息队列：Kafka3.0快速入门"
        }
      ]
    }
  ]
}
