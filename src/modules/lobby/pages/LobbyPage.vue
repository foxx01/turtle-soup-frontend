<template>
  <section class="grid gap-6">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-3">
          <NTag round type="info">房间大厅</NTag>
          <div>
            <h1 class="text-3xl font-semibold text-slate-900">多人房间列表</h1>
            <NText depth="3" class="mt-2 block">
              在这里可以浏览房间、查看当前状态，并快速进入创建房间流程。
            </NText>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <NButton type="primary" round @click="router.push('/lobby/create')">
            创建房间
          </NButton>
          <NButton round>刷新列表</NButton>
        </div>
      </div>
    </NCard>

    <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
      <NCard class="rounded-3xl border-0 shadow-soft">
        <template #header>筛选条件</template>
        <NSpace vertical :size="16">
          <NInput placeholder="搜索房间名称" />
          <NSelect :options="modeOptions" placeholder="选择模式" />
          <NSelect :options="statusOptions" placeholder="选择状态" />
          <NButton block>应用筛选</NButton>
        </NSpace>
      </NCard>

      <div class="grid gap-4">
        <NCard
          v-for="room in rooms"
          :key="room.name"
          class="rounded-3xl border-0 shadow-soft"
          hoverable
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="text-lg font-semibold text-slate-900">{{ room.name }}</div>
                <NTag :type="room.tagType" size="small">{{ room.status }}</NTag>
              </div>
              <NText depth="3">
                {{ room.description }}
              </NText>
              <div class="flex flex-wrap gap-4 text-sm text-slate-500">
                <span>{{ room.members }}/{{ room.capacity }} 人</span>
                <span>{{ room.mode }}</span>
                <span>{{ room.owner }}</span>
              </div>
            </div>

            <NButton type="primary" @click="router.push(`/room/${room.id}`)">进入房间</NButton>
          </div>
        </NCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NButton, NCard, NInput, NSelect, NSpace, NTag, NText } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const modeOptions = [
  { label: '休闲', value: 'casual' },
  { label: '竞技', value: 'ranked' },
  { label: '私密', value: 'private' }
]

const statusOptions = [
  { label: '等待中', value: 'waiting' },
  { label: '游戏中', value: 'playing' },
  { label: '已结束', value: 'finished' }
]

const rooms = [
  {
    id: 'alpha',
    name: '午夜推理局',
    status: '等待中',
    tagType: 'success' as const,
    description: '适合轻松开局的休闲房间，当前人数较少也可以直接开始游戏。',
    members: 1,
    capacity: 8,
    mode: '休闲',
    owner: '房主：小七'
  },
  {
    id: 'bravo',
    name: '竞技排位房',
    status: '游戏中',
    tagType: 'warning' as const,
    description: '当前正在进行推理对战，后续可以接入观战和锁房逻辑。',
    members: 6,
    capacity: 6,
    mode: '竞技',
    owner: '房主：米琪'
  },
  {
    id: 'charlie',
    name: '好友私密房',
    status: '已结束',
    tagType: 'default' as const,
    description: '适合邀请好友一起玩的私密房间，后续可扩展密码与邀请链接。',
    members: 2,
    capacity: 5,
    mode: '私密',
    owner: '房主：阿澜'
  }
]
</script>
