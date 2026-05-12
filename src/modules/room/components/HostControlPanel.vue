<template>
  <NCard class="rounded-3xl border-0 shadow-soft">
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div>
          <div class="text-lg font-semibold text-slate-900">Host Control</div>
          <div class="text-sm text-slate-500">主持人可以控制阶段、回答正式提问、推进回合。</div>
        </div>
        <NTag :type="isHost ? 'error' : 'default'" size="small">
          {{ isHost ? 'Host View' : 'Read Only' }}
        </NTag>
      </div>
    </template>

    <div class="grid gap-5">
      <div class="grid gap-4 md:grid-cols-3">
        <NButton type="primary" :disabled="!isHost" @click="$emit('start-round')">
          Start Round
        </NButton>
        <NButton :disabled="!isHost" @click="$emit('advance-round')">Advance Round</NButton>
        <NButton :disabled="!isHost" @click="$emit('settle-round')">Settle Round</NButton>
      </div>

      <div class="grid gap-5 lg:grid-cols-[1fr_220px]">
        <NSelect
          :value="selectedQuestionId"
          :disabled="!isHost"
          :options="questionOptions"
          placeholder="Select a pending question"
          @update:value="handleQuestionChange"
        />
        <NSelect
          :value="selectedOutcome"
          :disabled="!isHost"
          :options="outcomeOptions"
          placeholder="Answer type"
          @update:value="handleOutcomeChange"
        />
      </div>

      <NInput
        :value="answerDraft"
        :disabled="!isHost"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 5 }"
        placeholder="Write the official host response"
        @update:value="handleAnswerDraftChange"
      />

      <div class="flex flex-wrap gap-3">
        <NButton type="primary" :disabled="!canSubmit" @click="$emit('submit-answer')">
          Submit Answer
        </NButton>
        <NButton :disabled="!isHost" @click="$emit('fill-template')">Use Template</NButton>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NCard, NInput, NSelect, NTag } from 'naive-ui'

import type { AnswerRecord, FormalQuestion } from '@/stores/game'

const props = defineProps<{
  isHost: boolean
  pendingQuestions: FormalQuestion[]
  selectedQuestionId: string | null
  selectedOutcome: AnswerRecord['outcome']
  answerDraft: string
}>()

const emit = defineEmits<{
  (event: 'update:selected-question-id', value: string | null): void
  (event: 'update:selected-outcome', value: AnswerRecord['outcome']): void
  (event: 'update:answer-draft', value: string): void
  (event: 'submit-answer'): void
  (event: 'fill-template'): void
  (event: 'start-round'): void
  (event: 'advance-round'): void
  (event: 'settle-round'): void
}>()

const questionOptions = computed(() =>
  props.pendingQuestions.map((question) => ({
    label: `${question.senderName}: ${question.content}`,
    value: question.id
  }))
)

const outcomeOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Irrelevant', value: 'irrelevant' },
  { label: 'Partial', value: 'partial' }
]

const canSubmit = computed(
  () =>
    props.isHost &&
    Boolean(props.selectedQuestionId) &&
    props.answerDraft.trim().length > 0
)

function handleQuestionChange(value: string | null) {
  emit('update:selected-question-id', value)
}

function handleOutcomeChange(value: AnswerRecord['outcome']) {
  emit('update:selected-outcome', value)
}

function handleAnswerDraftChange(value: string) {
  emit('update:answer-draft', value)
}
</script>
