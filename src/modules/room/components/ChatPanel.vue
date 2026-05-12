<template>
  <NCard class="rounded-3xl border-0 shadow-soft">
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div>
          <div class="text-lg font-semibold text-slate-900">Chat</div>
          <div class="text-sm text-slate-500">右栏只保留普通聊天流，正式提问从底部输入区进入。</div>
        </div>
        <NTag size="small" type="info">{{ messages.length }} msgs</NTag>
      </div>
    </template>

    <div class="grid gap-3">
      <div
        v-for="message in messages"
        :key="message.id"
        class="rounded-2xl border border-slate-200 px-4 py-3"
        :class="message.kind === 'system' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50'"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-slate-900">{{ message.senderName }}</span>
            <NTag v-if="message.kind === 'system'" size="tiny" type="warning">System</NTag>
          </div>
          <span class="text-xs text-slate-400">{{ formatTime(message.createdAt) }}</span>
        </div>
        <div class="mt-2 text-sm leading-7 text-slate-600">{{ message.content }}</div>
      </div>

      <NEmpty
        v-if="messages.length === 0"
        description="No chat messages yet"
        class="rounded-2xl border border-dashed border-slate-200 py-10"
      />
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NEmpty, NTag } from 'naive-ui'

import type { ChatMessage } from '@/stores/chat'

defineProps<{
  messages: ChatMessage[]
}>()

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
