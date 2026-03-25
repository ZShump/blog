# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 VitePress 构建的个人博客，用于记录学习笔记和技术分享。博客托管在 GitHub Pages，通过 GitHub Actions 自动部署。

## 开发命令

### 本地开发
```bash
pnpm docs:dev      # 启动开发服务器（http://localhost:5173）
pnpm docs:build    # 构建生产版本到 docs/.vitepress/dist
pnpm docs:preview  # 预览生产构建
pnpm install       # 安装依赖
```

### 环境要求
- Node.js >= 20
- pnpm >= 9（项目使用 pnpm@10.33.0）

## 项目架构

### 核心配置
- **VitePress 配置**: [docs/.vitepress/config.mts](docs/.vitepress/config.mts) - 包含站点配置、导航栏、侧边栏、社交链接等
- **部署配置**: [.github/workflows/deploy.yml](.github/workflows/deploy.yml) - GitHub Actions 自动部署到 GitHub Pages

### 重要配置说明
- **base 路径**: `/blog/` - 所有静态资源路径需要包含此前缀（GitHub Pages 子路径要求）
- **主分支**: `master` - 推送到此分支会触发自动部署
- **构建输出**: `docs/.vitepress/dist` - 静态站点生成目录

### 内容结构
```
docs/
├── index.md              # 首页（使用 home layout，包含 hero 和 features）
├── knowledge/            # 知识库目录
│   ├── index.md          # 知识库首页
│   ├── java/             # JAVA 相关内容
│   ├── ai/               # AI 相关内容
│   └── bigdata/          # 大数据相关内容
├── tools/                # 工具目录
├── public/               # 静态资源（favicon.ico, logo.svg）
└── .vitepress/
    └── config.mts        # VitePress 配置文件
```

### 导航和侧边栏
导航栏和侧边栏在 [config.mts](docs/.vitepress/config.mts#L16-L64) 中配置：
- **导航栏**（`nav`）: 顶部导航菜单
- **侧边栏**（`sidebar`）: 按路径分组配置侧边栏菜单
  - `/knowledge/` 路径下的文档使用知识库侧边栏
  - `/tools/` 路径下的文档使用工具侧边栏

### 添加新内容
1. 在相应目录下创建 `.md` 文件
2. 如需在导航或侧边栏显示，在 [config.mts](docs/.vitepress/config.mts) 中添加对应配置

### 首页特殊布局
首页使用 `layout: home`，支持：
- **hero**: 主标题区（名称、标语、图片、操作按钮）
- **features**: 特性卡片展示区（标题、描述、链接）

## 部署流程

推送到 `master` 分支后，GitHub Actions 自动执行：
1. 安装 pnpm 和 Node.js 20
2. 安装依赖（`pnpm install`）
3. 构建项目（`pnpm docs:build`）
4. 部署 `docs/.vitepress/dist` 到 GitHub Pages
