<template>
  <section class="grid gap-6">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <div class="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
        <div class="space-y-5">
          <NTag round type="info">项目入口</NTag>
          <div class="space-y-3">
            <h1 class="text-4xl font-semibold tracking-tight text-slate-900">
              海龟汤多人在线游玩
            </h1>
            <NText depth="3" class="block max-w-2xl text-base leading-7">
              当前首页承载导航、系统概览和后续模块入口，适合作为项目第一层落地页。
            </NText>
          </div>
          <div class="flex flex-wrap gap-3">
            <NButton type="primary" round @click="router.push('/lobby')">
              进入房间大厅
            </NButton>
            <NButton round @click="router.push('/soups')">查看题库</NButton>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div
            v-for="metric in metrics"
            :key="metric.label"
            class="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4"
          >
            <div class="text-sm text-slate-500">{{ metric.label }}</div>
            <div class="mt-2 text-2xl font-semibold text-slate-900">{{ metric.value }}</div>
          </div>
        </div>
      </div>
    </NCard>

    <div class="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <NCard class="rounded-3xl border-0 shadow-soft" :segmented="{ content: true }">
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="text-xl font-semibold text-slate-900">技术栈</div>
              <NText depth="3">基础框架与 UI 能力已经接入。</NText>
            </div>
            <NTag round type="success">可继续开发</NTag>
          </div>
        </template>

        <div class="grid gap-4 md:grid-cols-2">
          <div
            v-for="item in techStack"
            :key="item"
            class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
          >
            {{ item }}
          </div>
        </div>
      </NCard>

      <NCard class="rounded-3xl border-0 shadow-soft">
        <template #header>
          <div class="text-lg font-semibold text-slate-900">启动清单</div>
        </template>

        <NTimeline>
          <NTimelineItem
            v-for="item in checklist"
            :key="item.title"
            :content="item.content"
            :title="item.title"
            type="success"
          />
        </NTimeline>
      </NCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NButton, NCard, NTag, NText, NTimeline, NTimelineItem } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const metrics = [
  { label: '页面模块', value: '8' },
  { label: '布局方案', value: '2' },
  { label: '基础路由', value: '10' }
]

const techStack = [
  'Vue 3',
  'Vite',
  'TypeScript',
  'Vue Router',
  'Pinia',
  'Axios',
  '原生 WebSocket / Socket 封装',
  'Tailwind CSS',
  'Naive UI'
]

const checklist = [
  {
    title: '路由已准备',
    content: '模块化路由已拆分，可以继续扩展业务页面。'
  },
  {
    title: '布局已准备',
    content: '主站与认证页使用不同布局，方便后续独立维护。'
  },
  {
    title: '页面已准备',
    content: '首页、房间、题库、用户中心和后台占位页都已经生成。'
  }
]
</script>
