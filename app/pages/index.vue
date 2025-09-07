<script setup lang="ts">
import useChats from '~/composables/useChats'

const { createChatAndNavigate } = useChats()

async function handleStartChat() {
  await createChatAndNavigate()
}
</script>

<template>
  <UContainer class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold">Ready to chat with AI?</h1>
    <UButton class="mt-4" @click="handleStartChat">Start Chat</UButton>
  </UContainer>
</template>
