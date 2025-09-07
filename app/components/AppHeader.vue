<script setup lang="ts">
import useChats from '~/composables/useChats'

type AppHeaderEmits = {
  'toggle-sidebar': []
}

defineOptions({ name: 'AppHeader' })
const emit = defineEmits<AppHeaderEmits>()

const { title } = useAppConfig()
const { createChatAndNavigate } = useChats()

function handleMenuClick() {
  emit('toggle-sidebar')
}

async function handleCreateChat() {
  await createChatAndNavigate()
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 h-16 px-4 bg-[var(--ui-bg-muted)] border-b border-[var(--ui-border)] flex items-center justify-between gap-4"
  >
    <div class="flex items-center gap-4">
      <UButton icon="i-lucide-menu" variant="ghost" @click="handleMenuClick" />
      <UButton icon="i-lucide-plus" @click="handleCreateChat">New Chat</UButton>
    </div>
    <div class="font-semibold text-[1.125rem]">
      {{ title }}
    </div>
    <div />
  </header>
</template>
