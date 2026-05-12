<template>
  <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <template #header>
        <div>
          <div class="text-2xl font-semibold text-slate-900">Create Room</div>
          <NText depth="3" class="mt-2 block">
            房间创建页仅搭表单结构，便于后续直接接创建接口和配置校验。
          </NText>
        </div>
      </template>

      <NForm label-placement="top" size="large">
        <div class="grid gap-5">
          <NFormItem label="Room name">
            <NInput placeholder="Enter room name" />
          </NFormItem>
          <div class="grid gap-5 md:grid-cols-2">
            <NFormItem label="Mode">
              <NSelect :options="modeOptions" placeholder="Select mode" />
            </NFormItem>
            <NFormItem label="Capacity">
              <NSelect :options="capacityOptions" placeholder="Select capacity" />
            </NFormItem>
          </div>
          <NFormItem label="Description">
            <NInput
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              placeholder="Room introduction"
            />
          </NFormItem>
          <div class="grid gap-4 md:grid-cols-2">
            <NCheckbox>Private room</NCheckbox>
            <NCheckbox>Enable spectators</NCheckbox>
          </div>
          <div class="flex flex-wrap gap-3">
            <NButton type="primary">Create Now</NButton>
            <NButton @click="router.push('/lobby')">Back to Lobby</NButton>
          </div>
        </div>
      </NForm>
    </NCard>

    <NCard class="rounded-3xl border-0 shadow-soft">
      <template #header>
        <div class="text-lg font-semibold text-slate-900">Preset Summary</div>
      </template>

      <NSpace vertical :size="16">
        <div
          v-for="item in presets"
          :key="item.label"
          class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
        >
          <div class="text-sm text-slate-500">{{ item.label }}</div>
          <div class="mt-2 text-base font-semibold text-slate-900">{{ item.value }}</div>
        </div>
      </NSpace>
    </NCard>
  </section>
</template>

<script setup lang="ts">
import {
  NButton,
  NCard,
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NSpace,
  NText
} from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const modeOptions = [
  { label: 'Casual', value: 'casual' },
  { label: 'Ranked', value: 'ranked' },
  { label: 'Practice', value: 'practice' }
]

const capacityOptions = [
  { label: '4 players', value: 4 },
  { label: '6 players', value: 6 },
  { label: '8 players', value: 8 }
]

const presets = [
  { label: 'Default visibility', value: 'Public room' },
  { label: 'Join strategy', value: 'Manual entry or invitation' },
  { label: 'Realtime channel', value: 'Socket room ready' }
]
</script>
