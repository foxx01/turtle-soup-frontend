import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { configureRequest } from './api/request'
import './assets/styles/index.css'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useChatStore } from './stores/chat'
import { useGameStore } from './stores/game'
import { useRoomStore } from './stores/room'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()

configureRequest({
  getAccessToken: () => useAuthStore(pinia).accessToken,
  onUnauthorized: async () => {
    const authStore = useAuthStore(pinia)
    const userStore = useUserStore(pinia)
    const roomStore = useRoomStore(pinia)
    const gameStore = useGameStore(pinia)
    const chatStore = useChatStore(pinia)

    authStore.disconnectRealtime()
    roomStore.resetState()
    gameStore.resetState()
    chatStore.resetState()
    userStore.clearProfile()
    authStore.clearSession()

    if (router.currentRoute.value.path !== '/login') {
      await router.push('/login')
    }
  }
})

app.use(pinia)
app.use(router)
app.mount('#app')
