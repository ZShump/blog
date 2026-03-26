# PageAgent AI 助手使用指南

## 什么是 PageAgent？

PageAgent 是一个可以直接运行在网页中的 AI Agent，可以通过自然语言控制浏览器操作。

### 功能特点

- 🎯 **自然语言控制**：用中文描述操作，AI 自动执行
- 🤖 **智能交互**：支持点击、输入、滚动等浏览器操作
- 🔒 **数据安全**：所有数据在本地处理，不会上传到其他服务器
- 🌐 **多模型支持**：支持 OpenAI、通义千问、DeepSeek 等多种模型

## 配置步骤

### 1. 安装依赖（已完成）

```bash
pnpm install
```

### 2. 配置 API

1. 复制配置模板：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local` 文件，填写你的 API 配置：

```env
# API 基础地址
# 硅基流动: https://api.siliconflow.cn/v1
# DeepSeek: https://api.deepseek.com/v1
# 火山引擎: https://ark.cn-beijing.volces.com/api/v3
VITE_PAGE_AGENT_BASE_URL=https://api.siliconflow.cn/v1

# API Key（替换为你的实际 Key）
VITE_PAGE_AGENT_API_KEY=sk-your-actual-api-key

# 模型名称
VITE_PAGE_AGENT_MODEL=gpt-4o-mini

# 界面语言
VITE_PAGE_AGENT_LANGUAGE=zh-CN
```

### 3. 重启开发服务器

配置 `.env.local` 后需要重启开发服务器：

```bash
pnpm docs:dev
```

## 使用方法

### 启动 AI 助手

1. 打开博客任意页面
2. 点击右下角的绿色圆形按钮（🤖 AI 助手图标）
3. AI 助手面板会显示在页面中

### 与 AI 对话

在 AI 助手面板中输入自然语言指令，例如：

```
帮我滚动到页面底部
```

```
点击侧边栏的"知识库"链接
```

```
找到页面中所有的标题并告诉我有哪些
```

```
点击"开始阅读"按钮
```

### 常用指令示例

- **导航操作**："点击导航栏的第一个链接"、"返回首页"
- **内容查找**："找出页面中所有的代码块"、"找到所有包含'Java'的文本"
- **页面交互**："滚动到页面中间"、"点击所有可展开的折叠项"
- **信息提取**："告诉我当前页面的标题是什么"、"总结页面内容"

## API 服务商推荐

### 国内服务商

| 服务商 | Base URL | 推荐模型 | 特点 |
|--------|----------|----------|------|
| 硅基流动 | `https://api.siliconflow.cn/v1` | `gpt-4o-mini` | 价格实惠，稳定 |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` | 国产模型，效果好 |
| 火山引擎 | `https://ark.cn-beijing.volces.com/api/v3` | `ep-20250703001111-mj7m8` | 字节跳动出品 |

### 国外服务商

| 服务商 | Base URL | 推荐模型 | 特点 |
|--------|----------|----------|------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o`, `gpt-4o-mini` | 官方 API，效果最好 |
| Azure | `https://your-resource.openai.azure.com/openai/deployments/your-deployment` | `gpt-4` | 企业级服务 |

## 注意事项

1. **API Key 安全**
   - `.env.local` 文件不会被提交到 Git
   - 不要分享你的 API Key
   - 定期更换 API Key

2. **使用限制**
   - 确保你的 API 额度充足
   - 某些 API 有速率限制
   - 建议使用便宜的模型（如 gpt-4o-mini）以降低成本

3. **功能限制**
   - PageAgent 无法访问浏览器之外的系统资源
   - 某些复杂的操作可能需要多次尝试
   - 建议使用清晰、具体的指令

## 故障排除

### AI 助手按钮不显示

- 检查 `.env.local` 中的 API Key 是否正确配置
- 确保重启了开发服务器
- 查看浏览器控制台是否有错误信息

### AI 执行失败

- 检查 API 额度是否充足
- 确认 Base URL 和模型名称是否正确
- 尝试使用更简单的指令

### 请求超时

- 检查网络连接
- 尝试切换到其他 API 服务商
- 使用响应更快的模型

## 进阶使用

### 自定义提示词

你可以在对话中给出更详细的指令：

```
作为我的助手，请：
1. 滚动到页面底部
2. 找到所有的链接
3. 只保留包含"Java"关键词的链接
4. 点击第一个匹配的链接
```

### 组合操作

支持多步骤操作：

```
先展开所有折叠的代码块，然后找到包含"Spring"的代码块并滚动到该位置
```

## 技术支持

- PageAgent 官方文档：https://alibaba.github.io/page-agent/
- GitHub 仓库：https://github.com/alibaba/page-agent

## 更新日志

- **2026-03-25**: 集成 PageAgent 到博客，支持全站使用
