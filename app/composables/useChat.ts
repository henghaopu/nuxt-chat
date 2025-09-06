import { mockChat } from '~/mocks/chat.mocks'

export default function useChat() {
  const chat = ref<Chat>(mockChat)
  const messages = computed<ChatMessage[]>(() => chat.value.messages)

  function createMessage(content: string, role: Role) {
    const currentMessageCount = messages.value.length
    const newMessageIndex = currentMessageCount + 1

    return { id: newMessageIndex.toString(), content, role }
  }

  async function sendMessage(message: string) {
    messages.value.push(createMessage(message, 'user'))

    const data = await $fetch<ChatMessage>('/api/ai', {
      method: 'POST',
      body: { messages: messages.value },
    })

    messages.value.push(data)
  }

  return {
    chat,
    messages,
    sendMessage,
  }
}
