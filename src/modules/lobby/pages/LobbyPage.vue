<template>
  <section class="grid gap-6">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-3">
          <NTag round type="info">Lobby</NTag>
          <div>
            <h1 class="text-3xl font-semibold text-slate-900">Room Lobby</h1>
            <NText depth="3" class="mt-2 block">
              大厅页保留筛选、房间列表和快捷创建入口，后续接实时房态和匹配能力。
            </NText>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <NButton type="primary" round @click="router.push('/lobby/create')">
            Create Room
          </NButton>
          <NButton round>Refresh</NButton>
        </div>
      </div>
    </NCard>

    <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
      <NCard class="rounded-3xl border-0 shadow-soft">
        <template #header>Lobby Filters</template>
        <NSpace vertical :size="16">
          <NInput placeholder="Search room name" />
          <NSelect :options="modeOptions" placeholder="Mode" />
          <NSelect :options="statusOptions" placeholder="Status" />
          <NButton block>Apply Filters</NButton>
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
                <span>{{ room.members }}/{{ room.capacity }} members</span>
                <span>{{ room.mode }}</span>
                <span>{{ room.owner }}</span>
              </div>
            </div>

            <NButton type="primary" @click="router.push(`/room/${room.id}`)">Join Room</NButton>
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
  { label: 'Casual', value: 'casual' },
  { label: 'Ranked', value: 'ranked' },
  { label: 'Private', value: 'private' }
]

const statusOptions = [
  { label: 'Waiting', value: 'waiting' },
  { label: 'Playing', value: 'playing' }
]

const rooms = [
  {
    id: 'alpha',
    name: 'Alpha Squad',
    status: 'Waiting',
    tagType: 'success' as const,
    description: '标准房间骨架，适合放置实时成员和游戏状态。',
    members: 4,
    capacity: 8,
    mode: 'Casual',
    owner: 'Host: Kira'
  },
  {
    id: 'bravo',
    name: 'Bravo Table',
    status: 'Playing',
    tagType: 'warning' as const,
    description: '正在游戏中的房间占位数据，后续可接观战和锁房逻辑。',
    members: 6,
    capacity: 6,
    mode: 'Ranked',
    owner: 'Host: Miki'
  },
  {
    id: 'charlie',
    name: 'Charlie Night',
    status: 'Waiting',
    tagType: 'info' as const,
    description: '带描述的房间卡片骨架，用于扩展密码房和标签筛选。',
    members: 2,
    capacity: 5,
    mode: 'Private',
    owner: 'Host: Allen'
  }
]
</script>
