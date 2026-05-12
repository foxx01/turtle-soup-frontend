<template>
  <NConfigProvider>
    <NGlobalStyle />
    <NMessageProvider>
      <div class="min-h-screen text-slate-900">
        <NLayout embedded class="min-h-screen bg-transparent">
          <NLayoutHeader bordered class="bg-white/80 backdrop-blur">
            <div
              class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-sm font-semibold text-white shadow-soft"
                >
                  TF
                </div>
                <div>
                  <div class="text-lg font-semibold">{{ appStore.projectName }}</div>
                  <div class="text-xs text-slate-500">多人海龟汤在线游玩前端</div>
                </div>
              </div>

              <div class="hidden min-w-0 flex-1 lg:flex lg:justify-end">
                <NMenu
                  :value="activeKey"
                  :options="menuOptions"
                  mode="horizontal"
                  responsive
                  @update:value="handleMenuSelect"
                />
              </div>

              <div class="flex items-center gap-3">
                <NButton quaternary @click="router.push('/login')">登录</NButton>
                <NButton type="primary" round @click="router.push('/register')">
                  注册
                </NButton>
              </div>
            </div>
          </NLayoutHeader>

          <NLayoutContent content-style="padding: 24px;">
            <div class="mx-auto w-full max-w-6xl">
              <RouterView />
            </div>
          </NLayoutContent>
        </NLayout>
      </div>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NButton,
  NConfigProvider,
  NGlobalStyle,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NMenu,
  NMessageProvider
} from 'naive-ui'
import { RouterView, useRoute, useRouter } from 'vue-router'

import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const menuOptions = computed(() =>
  appStore.navigation.map((item) => ({
    label: item.label,
    key: item.key
  }))
)

const activeKey = computed(() => {
  if (typeof route.meta.activeMenu === 'string') {
    return route.meta.activeMenu
  }

  return route.path
})

function handleMenuSelect(key: string) {
  if (key !== route.path) {
    void router.push(key)
  }
}
</script>
