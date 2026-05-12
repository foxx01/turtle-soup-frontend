<template>
  <section class="grid gap-6">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-3">
          <NTag round type="warning">题库</NTag>
          <div>
            <h1 class="text-3xl font-semibold text-slate-900">海龟汤题库</h1>
            <NText depth="3" class="mt-2 block">
              这里预留题库列表和筛选入口，后续可以继续接入详情页、收藏和管理能力。
            </NText>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <NInput placeholder="搜索题目标题" />
          <NSelect :options="difficultyOptions" placeholder="选择难度" />
          <NButton type="primary">开始搜索</NButton>
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
            <span>{{ item.questions }} 道问题</span>
            <NButton text type="primary">查看详情</NButton>
          </div>
        </div>
      </NCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NButton, NCard, NInput, NSelect, NTag, NText } from 'naive-ui'

const difficultyOptions = [
  { label: '简单', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' }
]

const soups = [
  {
    title: '经典入门题',
    subtitle: '新手友好',
    tag: '简单',
    tagType: 'success' as const,
    description: '适合新玩家快速上手的题目集合，后续可以接入分页和详情跳转。',
    questions: 12
  },
  {
    title: '多人竞技题',
    subtitle: '适合排位',
    tag: '中等',
    tagType: 'warning' as const,
    description: '适合多人对战的中等难度题目，可以继续扩展收藏和推荐。',
    questions: 20
  },
  {
    title: '深夜档案室',
    subtitle: '高难度推理',
    tag: '困难',
    tagType: 'error' as const,
    description: '更强调叙事误导和反转设计，适合进阶玩家挑战。',
    questions: 8
  }
]
</script>
