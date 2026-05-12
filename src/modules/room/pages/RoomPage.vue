<template>
  <section class="grid gap-6">
    <RoomHeader
      :room-code="roomCode"
      :title="roomTitle"
      :description="roomDescription"
      :status="roomStatus"
      :mode="roomMode"
      :current-round="gameStore.currentRound"
      :total-rounds="gameStore.totalRounds"
      :formatted-timer="gameStore.formattedTimer"
      :online-member-count="roomStore.onlineMemberCount"
    />

    <div class="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
      <MemberList
        :room-code="roomCode"
        :status="roomStatus"
        :members="roomMembers"
        class="xl:sticky xl:top-24 xl:self-start"
      />

      <div class="grid gap-6">
        <SoupPanel
          :soup-title="gameStore.soupTitle"
          :prompt="gameStore.prompt"
          :host-hint="gameStore.hostHint"
          :phase-label="gameStore.phaseLabel"
          :current-round="gameStore.currentRound"
          :total-rounds="gameStore.totalRounds"
          :formatted-timer="gameStore.formattedTimer"
          :questions="gameStore.questionList"
          :answers="gameStore.answerRecords"
        />

        <QuestionList
          :questions="gameStore.questionList"
          :answers="gameStore.answerRecords"
        />

        <HostControlPanel
          :is-host="isHost"
          :pending-questions="gameStore.pendingQuestions"
          :selected-question-id="selectedQuestionId"
          :selected-outcome="selectedOutcome"
          :answer-draft="answerDraft"
          @update:selected-question-id="selectedQuestionId = $event"
          @update:selected-outcome="selectedOutcome = $event"
          @update:answer-draft="answerDraft = $event"
          @submit-answer="handleSubmitAnswer"
          @fill-template="fillHostTemplate"
          @start-round="handleStartRound"
          @advance-round="handleAdvanceRound"
          @settle-round="handleSettleRound"
        />
      </div>

      <ChatPanel
        :messages="chatStore.activeMessages"
        class="xl:sticky xl:top-24 xl:self-start"
      />

      <div class="xl:col-start-2 xl:col-span-2">
        <MessageInput
          v-model="messageDraft"
          v-model:mode="messageMode"
          :disabled="submitDisabled"
          @submit="handleSubmitInput"
          @clear="messageDraft = ''"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import ChatPanel from '@/modules/room/components/ChatPanel.vue'
import HostControlPanel from '@/modules/room/components/HostControlPanel.vue'
import MemberList from '@/modules/room/components/MemberList.vue'
import MessageInput from '@/modules/room/components/MessageInput.vue'
import QuestionList from '@/modules/room/components/QuestionList.vue'
import RoomHeader from '@/modules/room/components/RoomHeader.vue'
import SoupPanel from '@/modules/room/components/SoupPanel.vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { useGameStore, type AnswerRecord } from '@/stores/game'
import { useRoomStore } from '@/stores/room'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const authStore = useAuthStore()
const userStore = useUserStore()
const roomStore = useRoomStore()
const gameStore = useGameStore()
const chatStore = useChatStore()

const messageDraft = ref('')
const messageMode = ref<'chat' | 'question'>('chat')
const selectedQuestionId = ref<string | null>(null)
const selectedOutcome = ref<AnswerRecord['outcome']>('yes')
const answerDraft = ref('')

const roomId = computed(() => String(route.params.roomId || 'alpha'))
const roomTitle = computed(() => roomStore.currentRoom?.name ?? `Room ${roomId.value.toUpperCase()}`)
const roomDescription = computed(
  () => roomStore.currentRoom?.description ?? 'A synchronized multiplayer room for the current turtle soup round.'
)
const roomStatus = computed(() => roomStore.currentRoom?.status ?? 'waiting')
const roomMode = computed(() => roomStore.currentRoom?.mode ?? 'casual')
const roomMembers = computed(() => roomStore.currentRoom?.members ?? [])
const roomCode = computed(() => roomStore.roomCode)

const currentUserId = computed(() => authStore.currentUserId ?? userStore.profile?.id ?? 'user-001')
const currentUserName = computed(() => userStore.displayName || authStore.currentUserName || 'Turtle Player')

const isHost = computed(() =>
  roomMembers.value.some((member) => member.id === currentUserId.value && member.role === 'host')
)

const submitDisabled = computed(
  () => messageDraft.value.trim().length === 0 || !roomStore.currentRoom || gameStore.loading || chatStore.sending
)

watch(
  () => gameStore.pendingQuestions,
  (pendingQuestions) => {
    if (!selectedQuestionId.value && pendingQuestions.length > 0) {
      selectedQuestionId.value = pendingQuestions[0].id
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => route.params.roomId,
  async (value) => {
    if (typeof value === 'string') {
      await roomStore.joinRoom(value)
    }
  }
)

onMounted(async () => {
  if (!userStore.profile) {
    userStore.hydrateCurrentUserMock('user-001', 'Kira')
  }

  if (!authStore.currentUserId) {
    authStore.applySession({
      userId: 'user-001',
      username: 'Kira',
      tokens: {
        accessToken: 'mock-room-access-token',
        refreshToken: 'mock-room-refresh-token'
      }
    })
  }

  await roomStore.joinRoom(roomId.value)
})

async function handleSubmitInput() {
  const content = messageDraft.value.trim()

  if (!content || !roomStore.currentRoom) {
    return
  }

  if (messageMode.value === 'chat') {
    await chatStore.sendMessage({
      roomId: roomStore.currentRoom.id,
      senderId: currentUserId.value,
      senderName: currentUserName.value,
      content
    })
  } else {
    await gameStore.submitQuestion({
      roomId: roomStore.currentRoom.id,
      senderId: currentUserId.value,
      senderName: currentUserName.value,
      content
    })
  }

  messageDraft.value = ''
}

async function handleSubmitAnswer() {
  if (!roomStore.currentRoom || !selectedQuestionId.value || !answerDraft.value.trim()) {
    return
  }

  await gameStore.respondToQuestion({
    roomId: roomStore.currentRoom.id,
    questionId: selectedQuestionId.value,
    responderName: currentUserName.value,
    outcome: selectedOutcome.value,
    content: answerDraft.value.trim()
  })

  selectedQuestionId.value = gameStore.pendingQuestions[0]?.id ?? null
  answerDraft.value = ''
}

function fillHostTemplate() {
  const templateMap: Record<AnswerRecord['outcome'], string> = {
    yes: 'Yes. This line of reasoning is important. Keep digging in that direction.',
    no: 'No. That assumption does not match the hidden story.',
    irrelevant: 'Irrelevant. The clue is elsewhere.',
    partial: 'Partially related. You found one useful edge but not the core trigger.'
  }

  answerDraft.value = templateMap[selectedOutcome.value]
}

function handleStartRound() {
  gameStore.startRoundCountdown()
}

function handleAdvanceRound() {
  gameStore.advanceRound()
}

function handleSettleRound() {
  gameStore.settleRound()
}
</script>
