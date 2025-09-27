import { v4 as uuidv4 } from 'uuid'

export default function useChats() {
  const chats = useState<Chat[]>('chats', () => [])
  // Setup phase registration: Vue tracks composables during the setup phase
  const {
    data: fetchedChats,
    execute,
    status,
  } = useFetch<Chat[]>('/api/chats', {
    immediate: false,
    default: () => [],
  })

  async function fetchChats() {
    // Prevent multiple callback executions (only fetch when the request has not started)
    if (status.value !== 'idle') return
    await execute()
    chats.value = fetchedChats.value
  }

  function createChat(options: { projectId?: string } = {}) {
    const currentChatCount = chats.value.length
    const newChatIndex = currentChatCount + 1
    const newChat = {
      id: uuidv4(),
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

  return {
    chats,
    createChat,
    createChatAndNavigate,
    findChatsByProjectId,
    fetchChats,
  }
}
