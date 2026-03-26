# Claude Code 完全使用指南

Claude Code 是 Anthropic 官方推出的命令行 AI 编程助手，集成了代码编辑、文件操作、智能代理等强大功能。

## 安装与启动

```bash
npm install -g @anthropic-ai/claude-code
claude
```

## 核心概念

### 1. Permissions（权限系统）

Claude Code 采用细粒度权限控制，保护你的系统安全：

```json
// ~/.claude/settings.json
{
  "permissions": {
    "bash": "prompt",          // 每次执行命令前询问
    "edit": "allow",           // 允许编辑文件
    "read": "allow",           // 允许读取文件
    "network": "deny"          // 拒绝网络请求
  }
}
```

权限级别：
- `allow` - 自动允许
- `deny` - 自动拒绝
- `prompt` - 每次询问

### 2. Rules（规则系统）

通过规则自定义 Claude 的行为。

#### 全局规则（`~/.claude/rules.md`）

对所有项目生效：

```markdown
## 代码风格

- 使用 2 空格缩进
- 优先使用箭头函数
- 组件使用函数式写法
```

#### 项目规则（`./CLAUDE.md`）

项目特定规则，优先级更高：

```markdown
# 项目：电商平台

## 架构原则

- 前后端分离
- RESTful API 设计
- 状态管理使用 Zustand

## 禁止事项

- 不要直接修改 `lib/` 目录下的文件
- 不要使用 any 类型
```

### 3. Skills（技能系统）

Skills 是可复用的命令模板，可以扩展 Claude 的能力。

#### 创建自定义 Skill

在 `~/.claude/skills/` 目录创建文件：

**`~/.claude/skills/deploy.md`**

```markdown
---
name: deploy
description: 部署应用到生产环境
---

请按照以下步骤部署：

1. 运行测试套件
2. 构建生产版本
3. 推送到生产分支
4. 验证部署状态
```

使用技能：

```
> /deploy
```

#### 内置技能

- `/commit` - 智能生成提交信息
- `/review` - 代码审查
- `/test` - 运行测试
- `/docs` - 生成文档

### 4. Agents & Subagents（代理系统）

Claude Code 支持多代理协作，处理复杂任务。

#### 代理类型

```yaml
# 通用代理
general-purpose:
  tools: [Read, Edit, Bash, Agent]
  capabilities: 全功能访问

# 探索代理
explore:
  tools: [Glob, Grep, Read]
  capabilities: 快速代码搜索
  focus: 只读操作

# 规划代理
plan:
  tools: [Read, Glob, Grep]
  capabilities: 架构设计
  cannot_edit: true
```

#### 使用代理

```
> 用 explore 代理找出所有 API 端点
> 用 plan 代理设计新的认证系统
```

#### 子代理（Subagents）

创建专门的子代理处理特定任务：

```javascript
// 创建子代理
agent({
  type: 'code-reviewer',
  task: '审查 src/auth.ts 的安全性',
  focus: 'security patterns'
})
```

### 5. MCP（Model Context Protocol）

MCP 允许 Claude 连接外部数据源和服务。

#### 配置 MCP Server

```json
// ~/.claude/mcp.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "/path/to/allowed/files"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-github"]
    }
  }
}
```

#### 使用 MCP 工具

```
> 列出 GitHub 仓库的所有 issues
> 搜索文件系统中的配置文件
```

### 6. CLAUDE.md（项目配置）

`CLAUDE.md` 是项目级别的配置文件，定义 Claude 在该项目的行为规则。

#### 完整示例

```markdown
# 项目：微服务架构博客系统

## 项目结构

\`\`\`
src/
├── services/     # 微服务
├── shared/       # 共享代码
├── gateway/      # API 网关
└── tests/        # 测试
\`\`\`

## 开发规范

### 代码风格
- TypeScript 严格模式
- 使用 ESLint + Prettier
- 组件单一职责原则

### Git 工作流
- 功能分支：`feature/*`
- 修复分支：`fix/*`
- 提交格式：Conventional Commits

### 禁止操作
- 不要修改 `.env` 文件
- 不要删除 `migrations/` 目录
- 不要在生产环境使用测试数据

## 上下文信息

- 数据库：PostgreSQL
- 缓存：Redis
- 消息队列：RabbitMQ
- 部署：Docker + K8s

## 常用命令

\`\`\`bash
# 启动开发环境
make dev

# 运行测试
make test

# 构建镜像
make build
\`\`\`
```

## 高级用法

### 任务规划（Plan Mode）

对于复杂任务，使用规划模式：

```
> /plan
```

Claude 会：
1. 分析项目结构
2. 制定实施计划
3. 征求你的同意
4. 逐步执行

### 团队协作

#### 共享配置

将 `CLAUDE.md` 提交到版本控制：

```bash
git add CLAUDE.md
git commit -m "docs: 添加 Claude Code 配置"
```

#### 统一规范

团队成员使用相同的规则和技能，确保代码风格一致。

### 钩子（Hooks）

自动化工作流：

```json
{
  "hooks": {
    "pre-edit": "echo '即将编辑文件'",
    "post-bash": "echo '命令执行完成'",
    "pre-commit": "npm run lint"
  }
}
```

### 记忆系统（Memory）

Claude Code 会记住项目特定的信息：

```
> 记住：这个项目使用 Yarn 而不是 npm
> 记住：API 基础 URL 是 https://api.example.com
```

这些信息会在后续对话中自动应用。

## 最佳实践

### 1. 合理使用权限

```json
{
  "permissions": {
    "bash": "prompt",      // 命令操作需要确认
    "edit": "allow",       // 信任编辑操作
    "network": "deny"      // 禁止网络访问
  }
}
```

### 2. 组织好 Skills

```
~/.claude/skills/
├── testing.md       # 测试相关
├── deployment.md    # 部署相关
└── docs.md          # 文档生成
```

### 3. 编写清晰的 CLAUDE.md

好的 `CLAUDE.md` 应该：
- 描述项目架构
- 定义编码规范
- 列出禁止操作
- 提供常用命令

### 4. 利用 MCP 扩展能力

连接常用工具和服务，提升效率。

### 5. 使用代理处理复杂任务

将大任务分解，使用专门的代理处理。

## 常见场景

### 场景 1：重构代码

```
> 用 explore 代理找出所有重复的组件
> 用 general-purpose 代理提取共享逻辑
```

### 场景 2：调试问题

```
> 解释为什么这个 API 返回 500
> 查看日志文件找出错误原因
```

### 场景 3：添加新功能

```
> 进入规划模式
> 设计用户认证功能
> 逐步实施并测试
```

## 配置文件汇总

```
~/.claude/
├── settings.json        # 全局配置
├── rules.md             # 全局规则
├── skills/              # 自定义技能
├── mcp.json             # MCP 配置
└── memory/              # 记忆存储

项目目录/
└── CLAUDE.md            # 项目规则
```

## 总结

Claude Code 是一个功能强大的 AI 编程助手。通过掌握：

- **Permissions** - 控制安全权限
- **Rules** - 定义行为规范
- **Skills** - 扩展命令能力
- **Agents** - 多代理协作
- **MCP** - 连接外部服务
- **CLAUDE.md** - 项目级配置

你可以构建一个高效、安全、符合团队规范的 AI 辅助开发环境。
