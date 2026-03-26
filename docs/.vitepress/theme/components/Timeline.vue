<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Article {
  title: string
  date: string  // 格式: YYYY-MM-DD HH:mm:ss
  category: string
  url: string
}

const articles = ref<Article[]>([])
const loading = ref(true)

// 从构建时生成的 JSON 文件加载文章数据
const loadArticles = async () => {
  try {
    const response = await fetch('/blog/timeline.json')
    if (!response.ok) {
      throw new Error('无法加载时间线数据')
    }
    const data = await response.json()
    articles.value = data
  } catch (error) {
    console.error('加载时间线失败:', error)
    articles.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticles()
})

// 按年份分组
const groupedArticles = computed(() => {
  const groups: Record<string, Article[]> = {}
  articles.value.forEach(article => {
    const year = new Date(article.date).getFullYear().toString()
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(article)
  })
  return groups
})

// 统计信息
const stats = computed(() => {
  const categoryCount: Record<string, number> = {}
  articles.value.forEach(article => {
    categoryCount[article.category] = (categoryCount[article.category] || 0) + 1
  })

  const yearCount: Record<string, number> = {}
  articles.value.forEach(article => {
    const year = new Date(article.date).getFullYear().toString()
    yearCount[year] = (yearCount[year] || 0) + 1
  })

  return {
    total: articles.value.length,
    byCategory: categoryCount,
    byYear: yearCount
  }
})
</script>

<template>
  <div class="timeline">
    <h1>时间线</h1>
    <p class="subtitle">记录我的学习历程</p>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="articles.length === 0" class="empty">
      <p>暂无文章</p>
      <p class="empty-hint">请先运行 <code>pnpm run generate:timeline</code> 生成时间线数据</p>
    </div>

    <div v-else>
      <!-- 统计信息 -->
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-number">{{ stats.total }}</span>
          <span class="stat-label">文章总数</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ Object.keys(stats.byYear).length }}</span>
          <span class="stat-label">年份</span>
        </div>
      </div>

      <!-- 时间线 -->
      <div v-for="(yearArticles, year) in groupedArticles" :key="year" class="timeline-year">
        <h2 class="year">
          {{ year }}
          <span class="year-count">({{ yearArticles.length }} 篇)</span>
        </h2>

        <div class="timeline-list">
          <div v-for="article in yearArticles" :key="article.url" class="timeline-item">
            <div class="timeline-date">
              <div class="date-full">{{ article.date }}</div>
            </div>
            <div class="timeline-content">
              <a :href="article.url" class="timeline-title">
                {{ article.title }}
              </a>
              <span class="timeline-category">{{ article.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分类统计 -->
      <div class="category-stats">
        <h3>分类统计</h3>
        <div class="category-list">
          <div v-for="(count, category) in stats.byCategory" :key="category" class="category-stat">
            <span class="category-name">{{ category }}</span>
            <span class="category-count">{{ count }} 篇</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.timeline h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
  color: var(--vp-c-text-1);
}

.subtitle {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.loading,
.empty {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
}

.empty-hint {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin-top: 1rem;
}

.empty-hint code {
  padding: 0.2rem 0.4rem;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.85em;
}

.stats-overview {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.timeline-year {
  margin-bottom: 3rem;
}

.year {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-border);
}

.year-count {
  font-size: 1rem;
  font-weight: 400;
  color: var(--vp-c-text-2);
}

.timeline-list {
  position: relative;
  padding-left: 2rem;
}

.timeline-list::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--vp-c-border);
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
  padding-left: 1.5rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -2.5rem;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  border: 2px solid var(--vp-c-bg);
}

.timeline-date {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.date-full {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  line-height: 1.4;
}

.timeline-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.timeline-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.timeline-title:hover {
  color: var(--vp-c-brand);
}

.timeline-category {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-radius: 9999px;
  font-weight: 500;
}

.category-stats {
  margin-top: 4rem;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.category-stats h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.category-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border-radius: 6px;
}

.category-name {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.category-count {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  padding: 0.125rem 0.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 9999px;
}

@media (max-width: 768px) {
  .timeline h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .stats-overview {
    gap: 1.5rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .year {
    font-size: 1.5rem;
  }

  .year-count {
    font-size: 0.875rem;
  }

  .timeline-list {
    padding-left: 1.5rem;
  }

  .timeline-item::before {
    left: -2rem;
  }

  .category-stats {
    padding: 1.5rem;
  }
}
</style>
