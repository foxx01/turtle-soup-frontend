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
            <NTag round type="info">Auth Portal</NTag>
            <h1 class="mt-6 text-4xl font-semibold tracking-tight text-slate-900">
              Welcome back to Turtle
            </h1>
            <p class="mt-4 max-w-xl text-base leading-7 text-slate-600">
              认证布局只负责承载登录和注册页面，方便后续独立接入表单校验、验证码和第三方登录。
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
  { title: 'Auth Flow', value: 'Login / Register' },
  { title: 'UI Style', value: 'Naive UI + Tailwind' },
  { title: 'Extensible', value: 'Ready for forms and API' },
  { title: 'Layout', value: 'Dedicated auth shell' }
]
</script>
