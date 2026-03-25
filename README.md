# 📝 shump的个人博客

基于 [VitePress](https://vitepress.dev/) 构建的个人知识博客，记录学习笔记和技术分享。

## 🌐 在线访问

- **博客地址**：https://zshump.github.io/blog/
- **GitHub 仓库**：https://github.com/ZShump/blog

## ✨ 特性

- 🚀 基于 VitePress，快速构建
- 📦 使用 pnpm 管理依赖
- 🎨 简洁美观的主题
- 📱 响应式设计，支持移动端
- 🔄 GitHub Actions 自动部署到 GitHub Pages

## 🛠️ 本地开发

### 环境要求

- Node.js >= 20
- pnpm >= 9

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm docs:dev
```

访问 http://localhost:5173 查看博客

### 构建生产版本

```bash
pnpm docs:build
```

### 预览生产构建

```bash
pnpm docs:preview
```

## 📦 项目结构

```
blog/
├── docs/                    # 文档源文件
│   ├── .vitepress/         # VitePress 配置
│   │   └── config.mts      # 站点配置文件
│   ├── public/             # 静态资源
│   │   ├── favicon.ico     # 网站图标
│   │   └── logo.svg        # Logo
│   ├── index.md            # 首页
│   ├── knowledge/          # 知识库目录
│   │   ├── index.md
│   │   ├── java/
│   │   ├── ai/
│   │   └── bigdata/
│   └── tools/              # 工具目录
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 部署配置
├── package.json            # 项目配置
└── pnpm-lock.yaml          # 依赖锁定文件
```

## 🚀 部署

### 自动部署

推送代码到 `master` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。

### 手动部署

1. 构建项目
```bash
pnpm docs:build
```

2. 将 `docs/.vitepress/dist` 目录部署到静态服务器

## 📝 内容管理

### 新增文章

在 `docs` 目录下创建 Markdown 文件：

```bash
# 例如：新增一篇 Java 文章
docs/knowledge/java/jvm-gc.md
```

### 修改导航和侧边栏

编辑 `docs/.vitepress/config.mts` 文件中的 `nav` 和 `sidebar` 配置。

## 📄 许可证

[MIT](LICENSE)

## 💬 联系方式

- GitHub: [@ZShump](https://github.com/ZShump)
- Email: 2792910237@qq.com
