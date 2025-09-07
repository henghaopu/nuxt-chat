import useChats from './useChats'

export default function useChat(chatId: string) {
  const { chats } = useChats()
  const chat = computed<Chat | undefined>(() =>
    chats.value.find((c) => c.id === chatId),
  )
  const messages = computed<ChatMessage[]>(() => chat.value?.messages ?? [])
  const currentMessageCount = messages.value.length
  const newMessageIndex = currentMessageCount + 1

  async function sendMessage(message: string) {
    if (!chat.value) return

    messages.value.push({
      id: newMessageIndex.toString(),
      content: message,
      role: 'user',
    })

    const aiResponseMessage = await $fetch<ChatMessage>('/api/ai', {
      method: 'POST',
      body: { messages: messages.value },
    })

    messages.value.push(aiResponseMessage)

    chat.value.updatedAt = new Date()
  }

  return {
    chat,
    messages,
    sendMessage,
  }
}
