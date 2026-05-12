<template>
  <NCard class="rounded-[32px] border-0 shadow-soft">
    <div class="space-y-8">
      <div class="space-y-3">
        <NTag round type="success">Register</NTag>
        <div>
          <h2 class="text-3xl font-semibold text-slate-900">Create account</h2>
          <NText depth="3" class="mt-2 block">
            注册页保留基础信息区、协议区和操作区，后续可直接接表单校验。
          </NText>
        </div>
      </div>

      <NForm label-placement="top" size="large">
        <div class="grid gap-5">
          <div class="grid gap-5 md:grid-cols-2">
            <NFormItem label="Nickname">
              <NInput placeholder="Choose a nickname" />
            </NFormItem>
            <NFormItem label="Email">
              <NInput placeholder="name@example.com" />
            </NFormItem>
          </div>
          <div class="grid gap-5 md:grid-cols-2">
            <NFormItem label="Password">
              <NInput type="password" show-password-on="click" placeholder="Create password" />
            </NFormItem>
            <NFormItem label="Confirm password">
              <NInput type="password" show-password-on="click" placeholder="Confirm password" />
            </NFormItem>
          </div>
          <NFormItem label="Invitation code">
            <NInput placeholder="Optional for now" />
          </NFormItem>
          <NCheckbox>I agree to the platform terms and community rules</NCheckbox>
          <NButton type="primary" size="large" block>Create account</NButton>
        </div>
      </NForm>

      <div class="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 px-5 py-4">
        <NText depth="3">Already registered?</NText>
        <NButton tertiary type="primary" @click="router.push('/login')">
          Go to Login
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
