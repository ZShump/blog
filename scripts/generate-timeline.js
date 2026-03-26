const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const knowledgePath = path.join(__dirname, '../docs/knowledge')
const outputPath = path.join(__dirname, '../docs/public/timeline.json')

// 确保输出目录存在
const outputDir = path.dirname(outputPath)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const articles = []

// 分类映射
const categoryMap = {
  'ai': 'AI',
  'bigdata': '大数据',
  'java': 'JAVA'
}

// 获取文件的首次提交时间（使用 git log）
const getFirstCommitDate = (filePath) => {
  try {
    // 转换为 git 路径格式（正斜杠）
    const gitPath = filePath.replace(/\\/g, '/')

    // 使用 git log 获取文件的最早提交记录
    const cmd = `git log --diff-filter=A --follow --format=%ci -- "${gitPath}"`
    const result = execSync(cmd, {
      encoding: 'utf-8',
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })

    if (result.trim()) {
      // 返回完整的 YYYY-MM-DD HH:mm:ss 格式
      return result.trim()
    }
    return null
  } catch (error) {
    console.warn(`  ⚠ 无法获取 git 历史: ${filePath}`)
    return null
  }
}

// 读取所有分类
const categories = ['ai', 'bigdata', 'java']

categories.forEach(category => {
  const categoryPath = path.join(knowledgePath, category)

  if (!fs.existsSync(categoryPath)) {
    return
  }

  // 读取该分类下的所有 .md 文件
  const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.md') && file !== 'index.md')

  files.forEach(file => {
    const filePath = path.join(categoryPath, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // 提取标题
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : file.replace('.md', '')

    // 提取 frontmatter 日期（优先级最高）
    const dateMatch = content.match(/^---\ndate:\s*(.+)\n---/m)
    let date = dateMatch ? dateMatch[1] : null

    // 如果没有 frontmatter 日期，从 git 提交记录获取
    if (!date) {
      date = getFirstCommitDate(filePath)
    }

    // 如果都没有，使用文件修改时间作为最后备选
    if (!date) {
      const stats = fs.statSync(filePath)
      date = stats.mtime.toISOString().split('T')[0]
    }

    // 生成 URL
    const url = `/knowledge/${category}/${file.replace('.md', '')}`

    articles.push({
      title,
      date,
      category: categoryMap[category] || category,
      url
    })
  })
})

// 按日期倒序排序
articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// 写入 JSON 文件
fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2), 'utf-8')

console.log(`✓ 时间线数据已生成: ${articles.length} 篇文章`)
console.log(`✓ 输出文件: ${outputPath}`)
