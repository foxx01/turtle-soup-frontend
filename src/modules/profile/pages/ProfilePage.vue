<template>
  <section class="grid gap-6 lg:grid-cols-[320px_1fr]">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <div class="space-y-5 text-center">
        <NAvatar :size="88" round class="mx-auto bg-brand-600">TF</NAvatar>
        <div>
          <div class="text-2xl font-semibold text-slate-900">Turtle Player</div>
          <NText depth="3" class="mt-2 block">Profile overview and identity settings</NText>
        </div>
        <div class="grid gap-3">
          <div
            v-for="item in stats"
            :key="item.label"
            class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <div class="text-sm text-slate-500">{{ item.label }}</div>
            <div class="mt-2 text-xl font-semibold text-slate-900">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </NCard>

    <div class="grid gap-6">
      <NCard class="rounded-3xl border-0 shadow-soft">
        <template #header>
          <div class="text-lg font-semibold text-slate-900">Basic Information</div>
        </template>

        <NForm label-placement="top">
          <div class="grid gap-5 md:grid-cols-2">
            <NFormItem label="Nickname">
              <NInput placeholder="Player nickname" />
            </NFormItem>
            <NFormItem label="Email">
              <NInput placeholder="player@example.com" />
            </NFormItem>
            <NFormItem label="Bio" class="md:col-span-2">
              <NInput
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="Introduce yourself"
              />
            </NFormItem>
          </div>
        </NForm>
      </NCard>

      <NCard class="rounded-3xl border-0 shadow-soft">
        <template #header>
          <div class="text-lg font-semibold text-slate-900">Activity Summary</div>
        </template>

        <div class="grid gap-4 md:grid-cols-3">
          <div
            v-for="panel in panels"
            :key="panel.label"
            class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <div class="text-sm text-slate-500">{{ panel.label }}</div>
            <div class="mt-2 text-xl font-semibold text-slate-900">{{ panel.value }}</div>
          </div>
        </div>
      </NCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  NAvatar,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NText
} from 'naive-ui'

const stats = [
  { label: 'Level', value: '18' },
  { label: 'Wins', value: '42' },
  { label: 'Badges', value: '9' }
]

const panels = [
  { label: 'Rooms Joined', value: '128' },
  { label: 'Friends', value: '36' },
  { label: 'Reports', value: '0' }
]
</script>
