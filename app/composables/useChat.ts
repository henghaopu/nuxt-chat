import type { Chat, ChatMessage, Role } from '~/types/chat.types'
import { mockChat } from '~/mocks/chat.mocks'

export default function useChat() {
  const chat = ref<Chat>(mockChat)
  const messages = computed<ChatMessage[]>(() => chat.value.messages)

  function createMessage(message: string, role: Role) {
    const id = messages.value.length.toString()

    return { id, role, content: message }
  }

  function sendMessage(message: string) {
    messages.value.push(createMessage(message, 'user'))

    setTimeout(() => {
      messages.value.push(createMessage(`You said: ${message}`, 'assistant'))
    }, 200)
  }

  return {
    chat,
    messages,
    sendMessage,
  }
}
