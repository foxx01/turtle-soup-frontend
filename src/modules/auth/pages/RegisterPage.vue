<template>
  <NCard class="rounded-[32px] border-0 shadow-soft">
    <div class="space-y-8">
      <div class="space-y-3">
        <NTag round type="success">注册</NTag>
        <div>
          <h2 class="text-3xl font-semibold text-slate-900">创建账号</h2>
          <NText depth="3" class="mt-2 block">
            注册只需要用户名和密码，确认密码仅在前端做校验，不会提交给后端。
          </NText>
        </div>
      </div>

      <NForm ref="formRef" :model="formValue" :rules="rules" label-placement="top" size="large">
        <div class="grid gap-5">
          <NFormItem label="用户名" path="username">
            <NInput
              v-model:value="formValue.username"
              placeholder="请设置用户名"
              @keydown.enter.prevent="handleSubmit"
            />
          </NFormItem>
          <div class="grid gap-5 md:grid-cols-2">
            <NFormItem label="密码" path="password">
              <NInput
                v-model:value="formValue.password"
                type="password"
                show-password-on="click"
                placeholder="请设置密码"
                @keydown.enter.prevent="handleSubmit"
              />
            </NFormItem>
            <NFormItem label="确认密码" path="confirmPassword">
              <NInput
                v-model:value="formValue.confirmPassword"
                type="password"
                show-password-on="click"
                placeholder="请再次输入密码"
                @keydown.enter.prevent="handleSubmit"
              />
            </NFormItem>
          </div>
          <NCheckbox v-model:checked="agreed">我已阅读并同意平台规则</NCheckbox>
          <NButton type="primary" size="large" block :loading="authStore.authLoading" @click="handleSubmit">
            创建账号
          </NButton>
        </div>
      </NForm>

      <div class="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 px-5 py-4">
        <NText depth="3">已经有账号了？</NText>
        <NButton tertiary type="primary" @click="router.push('/login')">
          去登录
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
const agreed = ref(true)
const formValue = reactive({
  username: '',
  password: '',
  confirmPassword: ''
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
  ],
  confirmPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['blur', 'input']
    },
    {
      validator: (_rule, value: string) => value === formValue.password,
      message: '两次输入的密码不一致',
      trigger: ['blur', 'input']
    }
  ]
}

async function handleSubmit() {
  if (!agreed.value) {
    message.warning('请先同意平台规则。')
    return
  }

  await formRef.value?.validate()

  await authStore.register({
    username: formValue.username.trim(),
    password: formValue.password
  })

  message.success('注册成功，请使用新账号登录。')
  await router.push('/login')
}
</script>
