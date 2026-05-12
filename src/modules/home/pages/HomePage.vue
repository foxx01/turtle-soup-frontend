<template>
  <section class="grid gap-6">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <div class="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
        <div class="space-y-5">
          <NTag round type="info">Project Hub</NTag>
          <div class="space-y-3">
            <h1 class="text-4xl font-semibold tracking-tight text-slate-900">
              Turtle Front Skeleton
            </h1>
            <NText depth="3" class="block max-w-2xl text-base leading-7">
              当前首页作为项目入口，先承载导航、系统概览和后续模块入口，方便继续往业务域扩展。
            </NText>
          </div>
          <div class="flex flex-wrap gap-3">
            <NButton type="primary" round @click="router.push('/lobby')">
              Enter Lobby
            </NButton>
            <NButton round @click="router.push('/soups')">Browse Soups</NButton>
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
              <div class="text-xl font-semibold text-slate-900">Tech Stack</div>
              <NText depth="3">基础框架和 UI 能力已接入。</NText>
            </div>
            <NTag round type="success">Ready</NTag>
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
          <div class="text-lg font-semibold text-slate-900">Launch Checklist</div>
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
  { label: 'Modules', value: '8' },
  { label: 'Layouts', value: '2' },
  { label: 'Base Routes', value: '10' }
]

const techStack = [
  'Vue 3',
  'Vite',
  'TypeScript',
  'Vue Router',
  'Pinia',
  'Axios',
  'Socket.IO Client',
  'Tailwind CSS',
  'Naive UI'
]

const checklist = [
  {
    title: 'Routing ready',
    content: '模块化路由已拆分，页面层可继续独立扩展。'
  },
  {
    title: 'Layouts ready',
    content: '主站和认证页面复用不同布局。'
  },
  {
    title: 'Pages ready',
    content: '首页、房间、用户、管理后台等页面骨架已生成。'
  }
]
</script>
