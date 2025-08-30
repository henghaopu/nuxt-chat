<script setup lang="ts">
const { chat, messages, sendMessage } = useChat()
const appConfig = useAppConfig()

useHead({
  title: () => chat.value.title?.trim() || undefined,
  titleTemplate: (t) => {
    const base = appConfig.title
    if (t && base) return `${t} - ${base}`
    return t || base || ''
  },
})
</script>

<template>
  <ChatWindow :chat :messages @send-message="sendMessage" />
</template>
