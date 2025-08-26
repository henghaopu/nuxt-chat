<script setup lang="ts">
const handleSendMessage = (message: string) => {
  console.log('Message sent:', message)
}
</script>

<template>
  <div class="h-full overflow-y-auto box-border">
    <UContainer class="max-w-4xl h-full">
      <div class="fixed bottom-6 w-[calc(100%-3rem)] max-w-4xl">
        <ChatInput @send-message="handleSendMessage" />
      </div>
    </UContainer>
  </div>
</template>
