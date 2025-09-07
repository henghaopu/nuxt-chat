<script setup lang="ts">
import useChat from '~/composables/useChat'

const route = useRoute()
const { chat, messages, sendMessage } = useChat(route.params.id as string)
const appConfig = useAppConfig()
const isTyping = ref(false)

if (!chat.value) {
  // https://nuxt.com/docs/4.x/guide/directory-structure/app/pages#programmatic-navigation
  await navigateTo('/', { replace: true })
}

useHead({
  title: () => chat.value?.title?.trim() || undefined,
  titleTemplate: (t) => {
    const base = appConfig.title
    if (t && base) return `${t} - ${base}`
    return t || base || ''
  },
})

async function handleSendMessage(message: string) {
  isTyping.value = true
  try {
    await sendMessage(message) // Might succeed or fail
  } finally {
    isTyping.value = false // Always runs, no matter what
  }
}
</script>

<template>
  <ChatWindow
    v-if="chat"
    :chat="chat"
    :messages="messages"
    :is-typing="isTyping"
    @send-message="handleSendMessage"
  />
</template>
