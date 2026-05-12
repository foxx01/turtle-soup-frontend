<template>
  <section class="grid gap-6 lg:grid-cols-[320px_1fr]">
    <NCard class="rounded-3xl border-0 shadow-soft">
      <div class="space-y-5 text-center">
        <NAvatar :size="88" round class="mx-auto bg-brand-600">TF</NAvatar>
        <div>
          <div class="text-2xl font-semibold text-slate-900">海龟玩家</div>
          <NText depth="3" class="mt-2 block">个人资料概览与身份设置</NText>
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
          <div class="text-lg font-semibold text-slate-900">基础信息</div>
        </template>

        <NForm label-placement="top">
          <div class="grid gap-5 md:grid-cols-2">
            <NFormItem label="昵称">
              <NInput placeholder="请输入昵称" />
            </NFormItem>
            <NFormItem label="邮箱">
              <NInput placeholder="请输入邮箱地址" />
            </NFormItem>
            <NFormItem label="个人简介" class="md:col-span-2">
              <NInput
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="介绍一下你自己"
              />
            </NFormItem>
          </div>
        </NForm>
      </NCard>

      <NCard class="rounded-3xl border-0 shadow-soft">
        <template #header>
          <div class="text-lg font-semibold text-slate-900">活跃概览</div>
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
  { label: '等级', value: '18' },
  { label: '胜场', value: '42' },
  { label: '徽章', value: '9' }
]

const panels = [
  { label: '加入房间', value: '128' },
  { label: '好友数量', value: '36' },
  { label: '被举报次数', value: '0' }
]
</script>
