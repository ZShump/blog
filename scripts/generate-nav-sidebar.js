const fs = require('fs')
const path = require('path')

const docsPath = path.join(__dirname, '../docs')
const outputPath = path.join(__dirname, '../docs/.vitepress/sidebar-nav.js')

// 从 markdown 文件中提取标题
const extractTitle = (content) => {
  // 先尝试从 frontmatter 中提取 title
  const frontmatterMatch = content.match(/^---\ntitle:\s*(.+)\n---/ms)
  if (frontmatterMatch) {
    return frontmatterMatch[1].trim()
  }

  // 如果没有 frontmatter，从第一个 # 标题提取
  const headingMatch = content.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return headingMatch[1].trim()
  }

  // 如果都没有，返回 null
  return null
}

// 递归扫描目录，构建侧边栏配置
const scanDirectory = (dirPath, basePath = '') => {
  const items = []
  const files = fs.readdirSync(dirPath)

  // 分离文件和目录
  const directories = []
  const markdownFiles = []

  files.forEach(file => {
    // 跳过 README.md 和 index.md（它们会被单独处理）
    if (file === 'README.md' || file === 'index.md') return

    const fullPath = path.join(dirPath, file)
    if (!fs.existsSync(fullPath)) return

    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // 检查目录中是否有 README.md 或 index.md
      const readmePath = path.join(fullPath, 'README.md')
      const indexPath = path.join(fullPath, 'index.md')
      if (fs.existsSync(readmePath) || fs.existsSync(indexPath)) {
        directories.push(file)
      }
    } else if (file.endsWith('.md')) {
      markdownFiles.push(file)
    }
  })

  // 排序
  directories.sort()
  markdownFiles.sort((a, b) => {
    // 提取数字前缀进行排序
    const aNum = a.match(/^(\d+)-/)
    const bNum = b.match(/^(\d+)-/)
    if (aNum && bNum) {
      return parseInt(aNum[1]) - parseInt(bNum[1])
    }
    return a.localeCompare(b)
  })

  // 添加子目录
  directories.forEach(dir => {
    const dirFullPath = path.join(dirPath, dir)
    const subPath = basePath ? `${basePath}/${dir}` : dir

    // 读取 README.md 或 index.md 获取分类名称
    const readmePath = path.join(dirFullPath, 'README.md')
    const indexPath = path.join(dirFullPath, 'index.md')
    const indexFile = fs.existsSync(readmePath) ? readmePath : indexPath
    const content = fs.readFileSync(indexFile, 'utf-8')
    const categoryName = extractTitle(content) || dir

    const subItems = scanDirectory(dirFullPath, subPath)

    // 添加分类（即使没有子文章也添加，只要有 index.md）
    items.push({
      text: categoryName,
      collapsed: true,
      items: subItems
    })
  })

  // 添加 markdown 文件
  markdownFiles.forEach(file => {
    const filePath = path.join(dirPath, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const title = extractTitle(content) || file.replace(/^(\d+-)?/, '').replace('.md', '')

    // 链接路径基于实际文件名（不修改，只移除 .md 后缀）
    const linkName = file.replace('.md', '')
    const link = basePath ? `${basePath}/${linkName}` : linkName

    items.push({
      text: title,
      link: link
    })
  })

  return items
}

// 生成侧边栏配置
const generateSidebar = (dirPath, basePath) => {
  const readmePath = path.join(dirPath, 'README.md')
  const indexPath = path.join(dirPath, 'index.md')

  // 检查是否有 README.md 或 index.md
  const indexFile = fs.existsSync(readmePath) ? readmePath : indexPath

  // 如果都没有，返回 null
  if (!fs.existsSync(indexFile)) {
    return null
  }

  const content = fs.readFileSync(indexFile, 'utf-8')
  const title = extractTitle(content) || '简介'

  const items = [
    { text: title, link: basePath + '/' }
  ]

  // 扫描子目录和文件
  const subItems = scanDirectory(dirPath, basePath)
  items.push(...subItems)

  return items
}

// 生成配置
const generateConfig = () => {
  // 生成 nav 配置
  const nav = []
  nav.push({ text: '首页', link: '/' })

  // 查找 timeline.md
  if (fs.existsSync(path.join(docsPath, 'timeline.md'))) {
    nav.push({ text: '时间线', link: '/timeline' })
  }

  // 扫描 docs 目录下的一级目录
  const entries = fs.readdirSync(docsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort()

  // 添加目录导航
  entries.forEach(dir => {
    const dirPath = path.join(docsPath, dir)
    const readmePath = path.join(dirPath, 'README.md')
    const indexPath = path.join(dirPath, 'index.md')

    // 只添加有 README.md 或 index.md 的目录
    const indexFile = fs.existsSync(readmePath) ? readmePath : indexPath
    if (fs.existsSync(indexFile)) {
      const content = fs.readFileSync(indexFile, 'utf-8')
      const title = extractTitle(content) || dir
      nav.push({ text: title, link: `/${dir}/` })
    }
  })

  // 生成 sidebar 配置
  const sidebar = {}

  entries.forEach(dir => {
    const dirPath = path.join(docsPath, dir)
    const items = generateSidebar(dirPath, `/${dir}`)
    if (items) {
      sidebar[`/${dir}/`] = items
    }
  })

  return { nav, sidebar }
}

// 生成配置文件
const generateConfigFile = () => {
  const { nav, sidebar } = generateConfig()

  const content = `// 此文件由 scripts/generate-nav-sidebar.js 自动生成
// 请勿手动编辑

export const nav = ${JSON.stringify(nav, null, 2)}

export const sidebar = ${JSON.stringify(sidebar, null, 2)}
`

  fs.writeFileSync(outputPath, content, 'utf-8')

  console.log(`✓ 导航项: ${nav.length} 个`)
  console.log(`✓ 侧边栏分组: ${Object.keys(sidebar).length} 个`)
  console.log(`✓ 配置已生成: ${path.relative(process.cwd(), outputPath)}`)
}

// 运行
try {
  generateConfigFile()
} catch (error) {
  console.error('配置生成失败:', error.message)
  console.error(error.stack)
  process.exit(1)
}
