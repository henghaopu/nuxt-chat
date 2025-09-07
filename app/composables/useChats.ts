import { mockChat } from '~/mocks/chat.mocks'

export default function useChats() {
  const chats = useState<Chat[]>('chats', () => [mockChat])

  function createChat() {
    const currentChatCount = chats.value.length
    const newChatIndex = currentChatCount + 1
    const newChat = {
      id: newChatIndex.toString(),
      title: 'New Chat',
      messages: [],
    }

    chats.value.push(newChat)
  }

  return { chats, createChat }
}
