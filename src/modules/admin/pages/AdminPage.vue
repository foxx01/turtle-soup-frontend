<template>
  <section class="grid gap-6">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-3">
          <NTag round type="error">Admin</NTag>
          <div>
            <h1 class="text-3xl font-semibold text-slate-900">Admin Console</h1>
            <NText depth="3" class="mt-2 block">
              管理后台预留系统概览、审核入口和内容治理区，当前只搭控制台骨架。
            </NText>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <NButton>Export Data</NButton>
          <NButton type="primary">Create Notice</NButton>
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
          <div class="text-lg font-semibold text-slate-900">Moderation Queue</div>
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
              <NButton size="small">Review</NButton>
              <NButton size="small" type="primary">Resolve</NButton>
            </div>
          </div>
        </div>
      </NCard>

      <NCard class="rounded-3xl border-0 shadow-soft">
        <template #header>
          <div class="text-lg font-semibold text-slate-900">System Widgets</div>
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
  { label: 'Online Users', value: '1,248' },
  { label: 'Open Rooms', value: '86' },
  { label: 'Pending Reports', value: '12' },
  { label: 'Soup Entries', value: '314' }
]

const queue = [
  {
    title: 'Reported chat message',
    description: '预留举报审核记录行，用于接列表、过滤和审核动作。'
  },
  {
    title: 'Pending soup review',
    description: '预留题库审核项，用于接入内容发布流程。'
  }
]

const widgets = [
  { label: 'Server status', value: 'Healthy' },
  { label: 'Realtime channel', value: 'Connected placeholder' },
  { label: 'Audit mode', value: 'Manual review enabled' }
]
</script>
