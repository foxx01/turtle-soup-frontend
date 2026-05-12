<template>
  <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <template #header>
        <div>
          <div class="text-2xl font-semibold text-slate-900">创建房间</div>
          <NText depth="3" class="mt-2 block">
            这里预留房间创建表单结构，后续可以直接接入创建接口和配置校验。
          </NText>
        </div>
      </template>

      <NForm label-placement="top" size="large">
        <div class="grid gap-5">
          <NFormItem label="房间名称">
            <NInput placeholder="请输入房间名称" />
          </NFormItem>
          <div class="grid gap-5 md:grid-cols-2">
            <NFormItem label="房间模式">
              <NSelect :options="modeOptions" placeholder="请选择模式" />
            </NFormItem>
            <NFormItem label="房间人数上限">
              <NSelect :options="capacityOptions" placeholder="请选择人数上限" />
            </NFormItem>
          </div>
          <NFormItem label="房间简介">
            <NInput
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              placeholder="简单介绍一下这个房间"
            />
          </NFormItem>
          <div class="grid gap-4 md:grid-cols-2">
            <NCheckbox>私密房间</NCheckbox>
            <NCheckbox>允许旁观</NCheckbox>
          </div>
          <div class="flex flex-wrap gap-3">
            <NButton type="primary">立即创建</NButton>
            <NButton @click="router.push('/lobby')">返回大厅</NButton>
          </div>
        </div>
      </NForm>
    </NCard>

    <NCard class="rounded-3xl border-0 shadow-soft">
      <template #header>
        <div class="text-lg font-semibold text-slate-900">预设说明</div>
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
  { label: '休闲', value: 'casual' },
  { label: '竞技', value: 'ranked' },
  { label: '私密', value: 'private' }
]

const capacityOptions = [
  { label: '4 人', value: 4 },
  { label: '6 人', value: 6 },
  { label: '8 人', value: 8 }
]

const presets = [
  { label: '默认可见性', value: '公开房间' },
  { label: '加入方式', value: '手动进入或邀请加入' },
  { label: '实时通信', value: '房间频道已预留接入点' }
]
</script>
