---
name: publish-note
description: 发布新笔记到 shump 的 VitePress 博客。当用户想要添加新文章时使用。
license: MIT
compatibility: 无需特定目录，自动操作固定博客路径。
metadata:
  author: shump
  version: "1.0"
---

发布新笔记到 VitePress 博客，自动更新配置。支持三种模式：
1. 从本地文件/文件夹读取已写好的文章
2. 直接粘贴已写好的 markdown 内容
3. 提供原始材料，AI 总结并生成文章后发布

发布完成后自动生成 git 提交并推送到远程仓库。

**重要**：此 skill 固定操作博客目录 `c:\Users\27929\Desktop\repos\blog`，可在任何位置调用。

**固定路径配置**
- 博客根目录：`c:\Users\27929\Desktop\repos\blog`
- 知识库目录：`c:\Users\27929\Desktop\repos\blog\docs\knowledge`
- 配置文件：`c:\Users\27929\Desktop\repos\blog\docs\.vitepress\config.mts`

**输入**：用户指定文档路径、粘贴内容，或提供原始材料要求总结。

**步骤**

1. **确定发布模式**

   使用 AskUserQuestion 工具询问：
   - **模式 A**：已有写好的文章
     - 选项 A1：指定本地文件路径
     - 选项 A2：直接粘贴内容
   - **模式 B**：提供原始材料，需要 AI 总结生成文章

2. **读取文章内容**（模式 A）

   如果用户指定了文件路径：
   - 使用 Read 工具读取文件内容
   - 提取文件名作为默认标题（去除 .md 后缀）
   - 如果用户指定了文件夹，查找该文件夹下的 .md 文件

   如果用户直接粘贴内容：
   - 使用用户提供的内容

3. **总结生成文章**（模式 B）

   如果用户提供原始材料：
   - 分析材料内容，理解主题和结构
   - 总结并组织成清晰的 markdown 文章
   - 添加合适的标题、章节
   - 保持专业性和可读性
   - 生成完成后，展示给用户确认：
     ```
     我已根据材料生成文章，请确认是否满意：
     [显示文章内容]

     是否直接发布？
     - 是：直接发布
     - 否：我手动修改后再发布
     - 重新生成：提供新的要求
     ```

4. **收集文章信息**

   如果未在步骤 1-3 中确定，使用 AskUserQuestion 工具询问：
   - **分类**：AI (docs/knowledge/ai/)、大数据 (docs/knowledge/bigdata/) 或 JAVA (docs/knowledge/java/)
   - **标题**：文章标题（如果未指定，从文件名或内容中提取）

   示例：
   - 分类：AI
   - 标题：Transformer 模型详解

5. **处理本地图片**（仅模式 A）

   - 扫描内容中的本地图片引用（相对路径或绝对路径）
   - 识别模式：
     - `![](./images/xxx.png)`
     - `![](../images/xxx.png)`
     - `![](C:\Users\...\xxx.png)`
     - 或其他本地路径格式
   - 对于每个本地图片：
     - 使用 Bash 工具复制到 `c:\Users\27929\Desktop\repos\blog\docs\public\images\{category}\` 目录
     - 生成新文件名（保持原扩展名）
     - 更新文章中的图片路径为 `/images/{category}/{filename}`

   示例：
   ```
   原路径：./images/transformer-arch.png
   新路径：/images/ai/transformer-arch.png
   ```

6. **创建文章文件**

   - 清理标题用作文件名（移除特殊字符，保留中文）
   - 在 `c:\Users\27929\Desktop\repos\blog\docs\knowledge\{category}\` 创建 markdown 文件
   - 写入处理后的内容（模式 B 为生成的文章，模式 A 为图片路径已更新）

   示例文件路径：
   ```
   c:\Users\27929\Desktop\repos\blog\docs\knowledge\ai\深度学习基础.md
   c:\Users\27929\Desktop\repos\blog\docs\knowledge\bigdata\Kafka入门.md
   c:\Users\27929\Desktop\repos\blog\docs\knowledge\java\并发编程.md
   ```

7. **更新 VitePress 配置**

   读取 `c:\Users\27929\Desktop\repos\blog\docs\.vitepress\config.mts` 并更新侧边栏：
   - 找到对应的分类部分
   - 将新文章添加到 items 列表
   - 保持格式和现有条目不变

   示例侧边栏条目：
   ```typescript
   {
     text: '深度学习基础',
     link: '/knowledge/ai/深度学习基础'
   }
   ```

8. **更新分类索引页**（可选）

   如果分类有 index.md 文件（如 `c:\Users\27929\Desktop\repos\blog\docs\knowledge\bigdata\index.md`），将文章添加到列表中。

9. **自动提交并推送**（重要）

   发布完成后，切换到博客目录并自动执行以下操作：

   ```bash
   # 切换到博客目录
   cd c:\Users\27929\Desktop\repos\blog

   # 查看当前 git 状态
   git status

   # 添加所有更改
   git add .

   # 生成规范的提交信息
   git commit -m "feat: 添加 {title} 文章"

   # 推送到远程仓库
   git push
   ```

   提交信息格式：
   - `feat: 添加 {文章标题} 文章` - 新增文章
   - 自动包含文章分类信息

   如果推送失败（如网络问题或冲突），显示错误信息并提示用户手动处理。

10. **验证和总结**

    - 验证文件创建正确
    - 验证图片已复制（如适用）
    - 验证配置已更新
    - 验证 git 提交和推送成功
    - 向用户显示完整的发布总结

**模式 A 发布过程中的输出**

```
## 正在发布笔记: {title}

**分类**: {category}
**文件**: {filepath}
**博客目录**: c:\Users\27929\Desktop\repos\blog

读取文章内容...
✓ 从 {source} 读取成功

处理本地图片...
✓ 发现 N 张本地图片
✓ 复制图片 1/N: {filename}
...
✓ 所有图片已复制到 {path}

创建文章文件...
✓ 文件已创建: {filepath}

更新配置...
✓ {category} 侧边栏已更新

提交并推送...
✓ 切换到博客目录
✓ Git 状态检查完成
✓ 已添加所有更改
✓ 提交成功：feat: 添加 {title} 文章
✓ 推送成功

完成！文章已发布并推送到远程仓库。
```

**模式 B 发布过程中的输出**

```
## 正在生成并发布笔记

**博客目录**: c:\Users\27929\Desktop\repos\blog

分析材料中...
✓ 主题：{topic}
✓ 结构规划完成

生成文章...
✓ 文章已生成，共 {word_count} 字

--- 文章预览 ---
{展示前几个段落}
...

文章已生成！请确认是否满意并直接发布？
[ ] 是，直接发布
[ ] 否，我手动修改
[ ] 重新生成（提供新要求）
```

用户确认后：

```
**分类**: {category}
**标题**: {title}

创建文章文件...
✓ 文件已创建: {filepath}

更新配置...
✓ {category} 侧边栏已更新

提交并推送...
✓ 切换到博客目录
✓ Git 状态检查完成
✓ 已添加所有更改
✓ 提交成功：feat: 添加 {title} 文章
✓ 推送成功

完成！文章已发布并推送到远程仓库。
```

**完成时的输出**

```
## 笔记发布成功 ✓

**文章**: {title}
**分类**: {category}
**文件**: {filepath}
**图片**: {count} 张图片已处理（模式 A）
**字数**: {word_count} 字（模式 B）
**Git**: 已提交并推送

**位置**: c:\Users\27929\Desktop\repos\blog\docs\knowledge\{category}\{filename}.md

### 提交信息
```
commit {commit_hash}
Author: {author}
Date: {date}

feat: 添加 {title} 文章

{files_changed} 个文件被修改，{insertions} 行插入(+)
```

### 后续步骤
1. 等待 GitHub Actions 自动部署
2. 几分钟后访问博客查看：https://shump.github.io/blog/knowledge/{category}/{filename}
3. 如需本地预览，运行：`cd c:\Users\27929\Desktop\repos\blog && pnpm docs:dev`
```

**注意事项**
- **所有操作都在固定博客目录进行，无论当前在哪个目录调用此 skill**
- 始终清理文件名以避免文件系统问题
- 创建前检查文件是否已存在 - 询问用户是否要覆盖
- 更新配置时保留现有侧边栏条目
- 对中文文件名的链接使用正确的 URL 编码（空格用 %20）
- 始终保持配置文件格式（TypeScript，正确的缩进）
- 复制图片前检查源文件是否存在
- 如果图片复制失败，显示警告但继续处理
- 模式 B 生成文章时，确保内容专业、准确、结构清晰
- 模式 B 生成后必须经过用户确认才能发布
- **git 操作前先切换到博客目录**
- **git 提交前检查 git status，确保只提交相关文件**
- **推送前确保在正确的分支上（通常是 master）**
- **如果推送失败，保留本地提交，提示用户手动处理**

**支持的分类**

- **AI**: `/knowledge/ai/` - 人工智能和机器学习
- **大数据**: `/knowledge/bigdata/` - 大数据技术
- **JAVA**: `/knowledge/java/` - Java 编程

**使用示例**

### 模式 A1：指定文件
```
帮我发布 C:\Users\27929\Desktop\articles\Transformer.md 这篇文章
```

### 模式 A2：指定文件夹
```
帮我发布 C:\Users\27929\Desktop\articles 文件夹下的文章
```
你应该：
1. 列出该文件夹下的 .md 文件
2. 让用户选择要发布的文件
3. 继续后续流程

### 模式 A3：直接粘贴
```
帮我发布一篇 AI 文章

[粘贴 markdown 内容]
```

### 模式 B：提供材料总结
```
我给你一些材料，你帮我总结后发布成 AI 文章

Transformer 是一种基于自注意力机制的深度学习模型...
[提供更多材料]
```

你应该：
1. 分析材料
2. 生成结构清晰的文章
3. 展示给用户确认
4. 确认后发布并自动提交推送

**Git 操作详细说明**

自动执行的 git 命令序列：

```bash
# 切换到博客目录（重要！）
cd c:\Users\27929\Desktop\repos\blog

# 1. 查看状态（用于显示信息）
git status

# 2. 添加所有更改
git add .

# 3. 提交（使用规范的提交信息）
git commit -m "feat: 添加 Transformer 模型详解 文章"

# 4. 推送
git push
```

提交信息格式：
- 标题：`feat: 添加 {文章标题} 文章`
- 如果失败，使用更简单的格式：`feat: add {filename}`

错误处理：
- 如果 `git push` 失败，显示：
  ```
  ⚠ 推送失败，可能是网络问题或远程仓库有冲突

  本地提交已保存，你可以：
  1. 稍后手动执行 `cd c:\Users\27929\Desktop\repos\blog && git push`
  2. 先执行 `git pull --rebase` 解决冲突后再推送
  ```

**文件结构参考**

```
c:\Users\27929\Desktop\repos\blog\
├── docs/
│   ├── knowledge/
│   │   ├── ai/
│   │   │   ├── index.md
│   │   │   ├── 神经网络.md
│   │   │   └── Transformer模型.md
│   │   ├── bigdata/
│   │   │   ├── index.md
│   │   │   ├── HBase.md
│   │   │   └── Kafka入门.md
│   │   └── java/
│   │       └── index.md
│   ├── public/
│   │   └── images/
│   │       ├── ai/
│   │       │   └── transformer-arch.png  # 复制的本地图片（模式 A）
│   │       └── bigdata/
│   │           └── kafka-flow.png
│   └── .vitepress/
│       └── config.mts  # 将更新为新文章
```

**图片处理详细说明**（仅模式 A）

当文章包含本地图片时：
1. 使用 Grep 或正则匹配查找 `![](...)` 语法
2. 提取图片路径
3. 判断是否为本地路径（非 http/https）
4. 使用 Bash 工具复制图片：
   ```bash
   cp "/path/to/source/image.png" "c:\Users\27929\Desktop\repos\blog\docs\public\images\{category}\image.png"
   ```
5. 更新文章中的路径为 `/images/{category}/image.png`

**文章生成详细说明**（模式 B）

当用户提供原始材料时：
1. 理解材料的核心主题和要点
2. 规划文章结构（标题、章节、子章节）
3. 用清晰专业的语言重新组织内容
4. 添加必要的格式（标题、列表、代码块等）
5. 确保逻辑连贯、重点突出
6. 生成 500-2000 字的精简文章（根据材料量）
7. 展示给用户确认后再发布
8. **确认后自动提交并推送到 GitHub**

**全局使用说明**

此 skill 同时安装在全局配置目录和项目目录，可在任何位置使用：

```bash
# 在任何目录下都可以调用
C:\Users\27929\Downloads> /publish-note

# 或直接说
"帮我发布一篇文章"
```

所有操作都会自动定位到固定博客目录：`c:\Users\27929\Desktop\repos\blog`
