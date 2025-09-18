import { mockChat } from '~~/shared/utils/chat.mocks'

export default function useChats() {
  const chats = useState<Chat[]>('chats', () => [mockChat])

  function createChat(options: { projectId?: string } = {}) {
    const currentChatCount = chats.value.length
    const newChatIndex = currentChatCount + 1
    const newChat = {
      id: newChatIndex.toString(),
      title: `New Chat (${newChatIndex})`,
      messages: [],
      projectId: options.projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    chats.value.push(newChat)

    return newChat
  }

  async function createChatAndNavigate(options: { projectId?: string } = {}) {
    const chat = createChat(options)
    // Use the source of truth that was passed in
    if (options.projectId) {
      await navigateTo(`/projects/${options.projectId}/chats/${chat.id}`)
      return
    }

    await navigateTo(`/chats/${chat.id}`)
  }

  function findChatsByProjectId(projectId: string) {
    return chats.value.filter((c) => c.projectId === projectId)
  }

  return { chats, createChat, createChatAndNavigate, findChatsByProjectId }
}
