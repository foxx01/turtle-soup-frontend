<template>
  <NCard class="rounded-3xl border-0 shadow-soft">
    <div class="grid gap-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="text-lg font-semibold text-slate-900">Room Input</div>
          <div class="text-sm text-slate-500">
            切换模式即可区分普通聊天和正式提问，避免两种消息流混在一起。
          </div>
        </div>

        <NRadioGroup :value="mode" size="large" @update:value="handleModeChange">
          <NRadioButton value="chat">Chat</NRadioButton>
          <NRadioButton value="question">Question</NRadioButton>
        </NRadioGroup>
      </div>

      <div class="grid gap-4 md:grid-cols-[1fr_auto]">
        <NInput
          :value="modelValue"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          :placeholder="placeholder"
          @update:value="handleInput"
        />

        <div class="flex flex-col gap-3">
          <NButton type="primary" :disabled="disabled" @click="$emit('submit')">
            {{ mode === 'chat' ? 'Send Chat' : 'Ask Question' }}
          </NButton>
          <NButton quaternary @click="$emit('clear')">Clear</NButton>
        </div>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NInput, NRadioButton, NRadioGroup, NCard } from 'naive-ui'

const props = defineProps<{
  modelValue: string
  mode: 'chat' | 'question'
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'update:mode', value: 'chat' | 'question'): void
  (event: 'submit'): void
  (event: 'clear'): void
}>()

const placeholder = computed(() =>
  props.mode === 'chat'
    ? 'Type a room chat message'
    : 'Write a formal yes/no question for the host'
)

function handleInput(value: string) {
  emit('update:modelValue', value)
}

function handleModeChange(value: 'chat' | 'question') {
  emit('update:mode', value)
}
</script>
