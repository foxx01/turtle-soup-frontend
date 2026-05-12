<template>
  <NCard class="rounded-[32px] border-0 shadow-soft">
    <div class="space-y-8">
      <div class="space-y-3">
        <NTag round type="primary">Login</NTag>
        <div>
          <h2 class="text-3xl font-semibold text-slate-900">Sign in</h2>
          <NText depth="3" class="mt-2 block">
            登录页先保留为结构化骨架，后续直接替换成真实表单和接口逻辑。
          </NText>
        </div>
      </div>

      <NForm label-placement="top" size="large">
        <div class="grid gap-5">
          <NFormItem label="Email">
            <NInput placeholder="name@example.com" />
          </NFormItem>
          <NFormItem label="Password">
            <NInput type="password" show-password-on="click" placeholder="Enter password" />
          </NFormItem>
          <div class="flex items-center justify-between gap-3">
            <NCheckbox>Remember me</NCheckbox>
            <NButton text type="primary">Forgot password</NButton>
          </div>
          <NButton type="primary" size="large" block>Login</NButton>
        </div>
      </NForm>

      <div class="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 px-5 py-4">
        <NText depth="3">Need an account?</NText>
        <NButton tertiary type="primary" @click="router.push('/register')">
          Go to Register
        </NButton>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import {
  NButton,
  NCard,
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  NTag,
  NText
} from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
