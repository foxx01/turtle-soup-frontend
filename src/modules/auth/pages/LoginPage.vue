<template>
  <NCard class="rounded-[32px] border-0 shadow-soft">
    <div class="space-y-8">
      <div class="space-y-3">
        <NTag round type="primary">登录</NTag>
        <div>
          <h2 class="text-3xl font-semibold text-slate-900">欢迎回来</h2>
          <NText depth="3" class="mt-2 block">
            使用用户名和密码即可进入房间大厅，后续可以继续接入真实登录接口。
          </NText>
        </div>
      </div>

      <NForm ref="formRef" :model="formValue" :rules="rules" label-placement="top" size="large">
        <div class="grid gap-5">
          <NFormItem label="用户名" path="username">
            <NInput
              v-model:value="formValue.username"
              placeholder="请输入用户名"
              @keydown.enter.prevent="handleSubmit"
            />
          </NFormItem>
          <NFormItem label="密码" path="password">
            <NInput
              v-model:value="formValue.password"
              type="password"
              show-password-on="click"
              placeholder="请输入密码"
              @keydown.enter.prevent="handleSubmit"
            />
          </NFormItem>
          <div class="flex items-center justify-between gap-3">
            <NCheckbox v-model:checked="rememberMe">记住我</NCheckbox>
            <NButton text type="primary">忘记密码</NButton>
          </div>
          <NButton type="primary" size="large" block :loading="authStore.authLoading" @click="handleSubmit">
            立即登录
          </NButton>
        </div>
      </NForm>

      <div class="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 px-5 py-4">
        <NText depth="3">还没有账号？</NText>
        <NButton tertiary type="primary" @click="router.push('/register')">
          去注册
        </NButton>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import {
  NButton,
  NCard,
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  NTag,
  NText,
  useMessage
} from 'naive-ui'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()
const formRef = ref<FormInst | null>(null)
const rememberMe = ref(true)
const formValue = reactive({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['blur', 'input']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur', 'input']
    }
  ]
}

async function handleSubmit() {
  await formRef.value?.validate()

  await authStore.login({
    username: formValue.username.trim(),
    password: formValue.password
  })

  message.success(`欢迎回来，${formValue.username || '玩家'}。`)
  await router.push('/lobby')
}
</script>
