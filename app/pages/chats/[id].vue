<script setup lang="ts">
import useChat from '~/composables/useChat'
const appConfig = useAppConfig()
const isTyping = ref(false)

useHead({
  title: () => chat.value.title?.trim() || undefined,
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
    :chat
    :messages
    :is-typing="isTyping"
    @send-message="handleSendMessage"
  />
</template>
