<template>
  <NCard class="rounded-3xl border-0 shadow-soft">
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div>
          <div class="text-lg font-semibold text-slate-900">提问与回答</div>
          <div class="text-sm text-slate-500">中间区域集中展示正式提问和主持人的回答记录。</div>
        </div>
        <NTag size="small" type="info">{{ pendingQuestions.length }} 条待回答</NTag>
      </div>
    </template>

    <NTabs type="line" animated>
      <NTabPane name="questions" tab="问题列表">
        <div class="grid gap-3">
          <div
            v-for="question in questions"
            :key="question.id"
            class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-slate-900">{{ question.senderName }}</span>
                  <NTag size="tiny" :type="question.status === 'pending' ? 'warning' : 'success'">
                    {{ QUESTION_STATUS_LABELS[question.status] }}
                  </NTag>
                </div>
                <div class="mt-2 text-sm leading-7 text-slate-600">{{ question.content }}</div>
              </div>
              <span class="text-xs text-slate-400">{{ formatTime(question.createdAt) }}</span>
            </div>
          </div>

          <NEmpty
            v-if="questions.length === 0"
            description="暂时还没有正式提问"
            class="rounded-2xl border border-dashed border-slate-200 py-8"
          />
        </div>
      </NTabPane>

      <NTabPane name="answers" tab="回答记录">
        <div class="grid gap-3">
          <div
            v-for="answer in answers"
            :key="answer.id"
            class="rounded-2xl border border-slate-200 bg-white px-4 py-4"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-slate-900">{{ answer.responderName }}</span>
                  <NTag size="tiny" :type="answerTagType(answer.outcome)">
                    {{ ANSWER_TYPE_LABELS[answer.outcome] }}
                  </NTag>
                </div>
                <div class="mt-2 text-sm leading-7 text-slate-600">{{ answer.content }}</div>
              </div>
              <span class="text-xs text-slate-400">{{ formatTime(answer.createdAt) }}</span>
            </div>
          </div>

          <NEmpty
            v-if="answers.length === 0"
            description="暂时还没有回答记录"
            class="rounded-2xl border border-dashed border-slate-200 py-8"
          />
        </div>
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NEmpty, NTabPane, NTabs, NTag } from 'naive-ui'

import { ANSWER_TYPE_LABELS, QUESTION_STATUS_LABELS } from '@/constants/labels'
import type { AnswerRecord, FormalQuestion } from '@/stores/game'

const props = defineProps<{
  questions: FormalQuestion[]
  answers: AnswerRecord[]
}>()

const pendingQuestions = computed(() =>
  props.questions.filter((question) => question.status === 'pending')
)

function answerTagType(outcome: AnswerRecord['outcome']) {
  switch (outcome) {
    case 'yes':
      return 'success'
    case 'no':
      return 'error'
    case 'partial':
      return 'warning'
    default:
      return 'info'
  }
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
