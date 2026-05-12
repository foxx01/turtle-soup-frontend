<template>
  <section class="grid gap-6">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-3">
          <NTag round type="warning">Soups</NTag>
          <div>
            <h1 class="text-3xl font-semibold text-slate-900">Soup Collection</h1>
            <NText depth="3" class="mt-2 block">
              这里预留为题库、卡牌或内容列表入口，目前只搭列表结构和筛选区。
            </NText>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <NInput placeholder="Search soup title" />
          <NSelect :options="difficultyOptions" placeholder="Difficulty" />
          <NButton type="primary">Search</NButton>
        </div>
      </div>
    </NCard>

    <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <NCard
        v-for="item in soups"
        :key="item.title"
        class="rounded-3xl border-0 shadow-soft"
        hoverable
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-lg font-semibold text-slate-900">{{ item.title }}</div>
              <div class="mt-1 text-sm text-slate-500">{{ item.subtitle }}</div>
            </div>
            <NTag size="small" :type="item.tagType">{{ item.tag }}</NTag>
          </div>

          <NText depth="3">{{ item.description }}</NText>

          <div class="flex items-center justify-between text-sm text-slate-500">
            <span>{{ item.questions }} questions</span>
            <NButton text type="primary">Open</NButton>
          </div>
        </div>
      </NCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NButton, NCard, NInput, NSelect, NTag, NText } from 'naive-ui'

const difficultyOptions = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' }
]

const soups = [
  {
    title: 'Classic Mystery',
    subtitle: 'Starter pack',
    tag: 'Easy',
    tagType: 'success' as const,
    description: '适合新手的题库占位卡片，后续可接内容列表和分页。',
    questions: 12
  },
  {
    title: 'Competitive Round',
    subtitle: 'Ranked mode',
    tag: 'Medium',
    tagType: 'warning' as const,
    description: '适合作为多人对战的题单模板，后续补成动态数据。',
    questions: 20
  },
  {
    title: 'Dark Archive',
    subtitle: 'Advanced',
    tag: 'Hard',
    tagType: 'error' as const,
    description: '高难度内容区骨架，用来挂详情跳转和管理入口。',
    questions: 8
  }
]
</script>
