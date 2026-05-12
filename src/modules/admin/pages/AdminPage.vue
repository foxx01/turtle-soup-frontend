<template>
  <section class="grid gap-6">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-3">
          <NTag round type="error">管理后台</NTag>
          <div>
            <h1 class="text-3xl font-semibold text-slate-900">后台控制台</h1>
            <NText depth="3" class="mt-2 block">
              这里预留系统概览、审核入口和内容治理区域，当前先保留稳定的后台骨架。
            </NText>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <NButton>导出数据</NButton>
          <NButton type="primary">发布公告</NButton>
        </div>
      </div>
    </NCard>

    <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <NCard
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-3xl border-0 shadow-soft"
      >
        <div class="text-sm text-slate-500">{{ metric.label }}</div>
        <div class="mt-3 text-3xl font-semibold text-slate-900">{{ metric.value }}</div>
      </NCard>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <NCard class="rounded-3xl border-0 shadow-soft">
        <template #header>
          <div class="text-lg font-semibold text-slate-900">审核队列</div>
        </template>

        <div class="grid gap-4">
          <div
            v-for="item in queue"
            :key="item.title"
            class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <div class="font-semibold text-slate-900">{{ item.title }}</div>
              <div class="mt-1 text-sm text-slate-500">{{ item.description }}</div>
            </div>
            <div class="flex gap-2">
              <NButton size="small">查看详情</NButton>
              <NButton size="small" type="primary">处理完成</NButton>
            </div>
          </div>
        </div>
      </NCard>

      <NCard class="rounded-3xl border-0 shadow-soft">
        <template #header>
          <div class="text-lg font-semibold text-slate-900">系统信息</div>
        </template>

        <NSpace vertical :size="16">
          <div
            v-for="item in widgets"
            :key="item.label"
            class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <div class="text-sm text-slate-500">{{ item.label }}</div>
            <div class="mt-2 text-base font-semibold text-slate-900">{{ item.value }}</div>
          </div>
        </NSpace>
      </NCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NButton, NCard, NSpace, NTag, NText } from 'naive-ui'

const metrics = [
  { label: '在线用户', value: '1,248' },
  { label: '开放房间', value: '86' },
  { label: '待处理举报', value: '12' },
  { label: '题库条目', value: '314' }
]

const queue = [
  {
    title: '聊天消息举报',
    description: '预留举报审核入口，后续可以接入过滤、封禁和人工复核流程。'
  },
  {
    title: '题目待审核',
    description: '预留题库发布审核能力，方便后续接入内容上架流程。'
  }
]

const widgets = [
  { label: '服务状态', value: '运行正常' },
  { label: '实时通道', value: '已预留连接状态展示' },
  { label: '审核模式', value: '当前为人工复核' }
]
</script>
