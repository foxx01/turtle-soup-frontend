<template>
  <div class="flex min-h-[70vh] items-center justify-center">
    <NCard class="w-full max-w-2xl rounded-[32px] border-0 text-center shadow-soft">
      <div class="space-y-6">
        <NTag round type="warning">404</NTag>
        <div>
          <h1 class="text-5xl font-semibold text-slate-900">Page Not Found</h1>
          <NText depth="3" class="mt-3 block text-base">
            当前页面不存在或路由未接入。可以先返回首页，或者回到大厅继续搭业务流。
          </NText>
        </div>
        <div class="flex flex-wrap justify-center gap-3">
          <NButton type="primary" @click="router.push('/')">Go Home</NButton>
          <NButton @click="router.push('/lobby')">Go Lobby</NButton>
        </div>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NButton, NCard, NTag, NText } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
