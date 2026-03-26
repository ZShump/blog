<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <!-- 首页使用完全自定义布局 -->
  <div v-if="frontmatter.layout === 'custom-home'" class="layout-custom-home">
    <slot />
    <!-- 首页也显示 PageAgent 按钮 -->
    <PageAgentButton />
  </div>

  <!-- 其他页面使用默认布局，并添加 PageAgent 按钮 -->
  <Layout v-else>
    <!-- 使用布局底部插槽 -->
    <template #layout-bottom>
      <PageAgentButton />
    </template>
  </Layout>
</template>
