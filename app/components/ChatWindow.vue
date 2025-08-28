<script setup lang="ts">
import { refIds } from '~/constants/refId.constants'

const { chat, messages, sendMessage } = useChat()

function handleSendMessage(message: string) {
  sendMessage(message)
}
</script>

<template>
  <div :ref="refIds.chatHistoryDiv" class="h-full overflow-y-auto box-border">
    <UContainer class="max-w-4xl h-full">
      <div
        v-if="!messages?.length"
        class="flex items-center justify-center min-h-full flex-1"
      >
        <div class="flex flex-col gap-8 p-8 bg-[var(--ui-bg-elevated)] w-full">
          <h1
            class="text-[1.25rem] font-medium text-center text-[var(--ui-text-muted)]"
          >
            Hi there!
          </h1>
          <ChatInput @send-message="handleSendMessage" />
        </div>
      </div>
      <template v-else>
        <div class="mb-6 py-4">
          <h1 class="text-2xl font-bold">
            {{ chat?.title || 'Untitled Chat' }}
          </h1>
        </div>
        <div class="flex flex-col gap-4 mb-6 pb-32">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="{
              'p-4 rounded-[var(--ui-radius)]': true,
              'self-end border border-solid border-[var(--ui-border)] bg-[var(--ui-bg-muted)] w-[70%]':
                message.role === 'user',
            }"
          >
            <p class="wrap-break-word">{{ message.content }}</p>
          </div>
        </div>
        <div class="fixed bottom-6 w-[calc(100%-3rem)] max-w-4xl">
          <ChatInput @send-message="handleSendMessage" />
        </div>
      </template>
    </UContainer>
  </div>
</template>
