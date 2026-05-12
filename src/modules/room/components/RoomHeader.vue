<template>
  <NCard class="rounded-3xl border-0 shadow-soft">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
          <NTag round type="info">Room {{ roomCode }}</NTag>
          <NTag :type="statusTagType" size="small">{{ statusLabel }}</NTag>
          <NTag size="small" type="warning">Round {{ currentRound }}/{{ totalRounds }}</NTag>
        </div>
        <div>
          <h1 class="text-3xl font-semibold tracking-tight text-slate-900">{{ title }}</h1>
          <NText depth="3" class="mt-2 block max-w-3xl leading-7">
            {{ description }}
          </NText>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div class="text-xs uppercase tracking-[0.18em] text-slate-400">Mode</div>
          <div class="mt-2 text-base font-semibold text-slate-900">{{ modeLabel }}</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div class="text-xs uppercase tracking-[0.18em] text-slate-400">Timer</div>
          <div class="mt-2 text-base font-semibold text-slate-900">{{ formattedTimer }}</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div class="text-xs uppercase tracking-[0.18em] text-slate-400">Online</div>
          <div class="mt-2 text-base font-semibold text-slate-900">{{ onlineMemberCount }}</div>
        </div>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NTag, NText } from 'naive-ui'

import type { RoomMode, RoomStatus } from '@/stores/room'

const props = defineProps<{
  roomCode: string
  title: string
  description: string
  status: RoomStatus
  mode: RoomMode
  currentRound: number
  totalRounds: number
  formattedTimer: string
  onlineMemberCount: number
}>()

const statusLabel = computed(() => {
  switch (props.status) {
    case 'playing':
      return 'Playing'
    case 'closed':
      return 'Closed'
    default:
      return 'Waiting'
  }
})

const statusTagType = computed(() => {
  switch (props.status) {
    case 'playing':
      return 'success'
    case 'closed':
      return 'default'
    default:
      return 'warning'
  }
})

const modeLabel = computed(() => {
  switch (props.mode) {
    case 'ranked':
      return 'Ranked'
    case 'private':
      return 'Private'
    default:
      return 'Casual'
  }
})
</script>
