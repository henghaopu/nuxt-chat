<script setup lang="ts">
import useChat from '~/composables/useChat'

const route = useRoute()
const { projectId, id } = route.params as {
  projectId: string
  id: string
}

const { chat, messages, sendMessage } = useChat(id)
const appConfig = useAppConfig()
const isTyping = ref(false)

if (!chat.value) {
  await navigateTo(`/projects/${projectId}`, { replace: true })
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
    await sendMessage(message)
  } finally {
    isTyping.value = false
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
