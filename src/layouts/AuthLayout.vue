<template>
  <NConfigProvider>
    <NGlobalStyle />
    <NMessageProvider>
      <div
        class="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(53,94,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]"
        />

        <div class="relative z-10 grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_480px]">
          <section class="hidden rounded-[32px] border border-white/60 bg-white/60 p-10 shadow-soft backdrop-blur lg:block">
            <NTag round type="info">账号中心</NTag>
            <h1 class="mt-6 text-4xl font-semibold tracking-tight text-slate-900">
              欢迎来到海龟汤多人在线游玩
            </h1>
            <p class="mt-4 max-w-xl text-base leading-7 text-slate-600">
              这里承载登录与注册流程，后续可以继续接入短信验证码、第三方登录和更完整的账号安全能力。
            </p>

            <div class="mt-10 grid gap-4 sm:grid-cols-2">
              <div
                v-for="item in highlights"
                :key="item.title"
                class="rounded-3xl border border-slate-200 bg-white/80 p-5"
              >
                <div class="text-sm text-slate-500">{{ item.title }}</div>
                <div class="mt-2 text-lg font-semibold text-slate-900">{{ item.value }}</div>
              </div>
            </div>
          </section>

          <div class="relative">
            <RouterView />
          </div>
        </div>
      </div>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  NTag
} from 'naive-ui'
import { RouterView } from 'vue-router'

const highlights = [
  { title: '账号流程', value: '登录 / 注册' },
  { title: '界面方案', value: 'Naive UI + Tailwind CSS' },
  { title: '扩展能力', value: '已预留表单与接口接入点' },
  { title: '布局方式', value: '独立认证页布局' }
]
</script>
