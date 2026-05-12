<template>
  <NCard class="rounded-3xl border-0 shadow-soft">
    <div class="grid gap-5">
      <div class="rounded-[28px] bg-slate-900 px-6 py-7 text-white">
        <div class="flex flex-wrap items-center gap-3">
          <NTag round type="warning">{{ soupTitle }}</NTag>
          <NTag round type="success">{{ phaseLabel }}</NTag>
        </div>
        <div class="mt-5 text-sm uppercase tracking-[0.22em] text-slate-300">当前题面</div>
        <div class="mt-3 text-2xl font-semibold leading-tight">{{ prompt }}</div>
        <div class="mt-4 text-sm leading-7 text-slate-300">
          {{ hostHint }}
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-4">
        <div
          v-for="panel in panels"
          :key="panel.label"
          class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
        >
          <div class="text-xs uppercase tracking-[0.18em] text-slate-400">{{ panel.label }}</div>
          <div class="mt-2 text-xl font-semibold text-slate-900">{{ panel.value }}</div>
          <div class="mt-1 text-sm text-slate-500">{{ panel.caption }}</div>
        </div>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NTag } from 'naive-ui'

import type { AnswerRecord, FormalQuestion } from '@/stores/game'

const props = defineProps<{
  soupTitle: string
  prompt: string
  hostHint: string
  phaseLabel: string
  currentRound: number
  totalRounds: number
  formattedTimer: string
  questions: FormalQuestion[]
  answers: AnswerRecord[]
}>()

const panels = computed(() => [
  {
    label: '回合',
    value: `${props.currentRound}/${props.totalRounds}`,
    caption: '当前进度'
  },
  {
    label: '计时',
    value: props.formattedTimer,
    caption: '本回合时间'
  },
  {
    label: '问题数',
    value: String(props.questions.length),
    caption: '正式提问'
  },
  {
    label: '回答数',
    value: String(props.answers.length),
    caption: '主持人回应'
  }
])
</script>
