import { v4 as uuidv4 } from 'uuid'
import { getProjectById } from './projectRepository'

const chats: Chat[] = [mockChat]

/**
 * Retrieves all chats, sorted by most recently updated first.
 * For performance optimization, only returns the last message for each chat
 * instead of the complete message history.
 *
 * @returns Promise<Chat[]> Array of chats with only their last message,
 *                         sorted by updatedAt in descending order (newest first)
 */
export async function getAllChats(): Promise<Chat[]> {
  return [...chats]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map((chat) => {
      const lastMessage = chat.messages.at(-1) // Get the last message (most recent)
      return {
        ...chat,
        messages: lastMessage ? [lastMessage] : [],
      }
    })
}

export async function createChat(data: {
  title?: string
  projectId?: string
}): Promise<PopulatedChat> {
  const now = new Date()
  const newChat: Chat = {
    id: uuidv4(),
    title: data.title || 'New Chat',
    projectId: data.projectId,
    messages: [],
    createdAt: now,
    updatedAt: now,
  }
  chats.push(newChat)
  return {
    ...newChat,
    messages: [],
    project: data.projectId ? getProjectById(data.projectId) : undefined,
  }
}

export async function getChatById(
  chatId: string,
): Promise<PopulatedChat | undefined> {
  const chat = chats.find((c) => c.id === chatId)
  if (!chat) return undefined

  return {
    ...chat,
    project: chat.projectId ? getProjectById(chat.projectId) : undefined,
  }
}

/**
 * Updates an existing chat with new data.
 * Only allows updating the title and projectId fields.
 * Automatically updates the updatedAt timestamp.
 *
 * @param chatId - The unique identifier of the chat to update
 * @param updates - Partial object containing the fields to update (title and/or projectId)
 * @returns Promise<Chat | undefined> The updated chat object, or undefined if chat not found
 */
export async function updateChat(
  chatId: string,
  updates: Partial<Pick<Chat, 'title' | 'projectId'>>,
): Promise<Chat | undefined> {
  const chatIndex = chats.findIndex((c) => c.id === chatId)
  if (chatIndex === -1) return undefined

  const chat = chats[chatIndex]
  const updatedChat: Chat = {
    ...chat,
    ...updates,
    updatedAt: new Date(),
  }
  chats[chatIndex] = updatedChat
  return updatedChat
}

export async function deleteChat(chatId: string): Promise<boolean> {
  const chatIndex = chats.findIndex((c) => c.id === chatId)
  if (chatIndex === -1) return false

  chats.splice(chatIndex, 1)
  deleteAllMessagesInChat(chatId)
  return true
}

export function getAllMessagesInChat(
  chatId: string,
): ChatMessage[] | undefined {
  const chat = chats.find((c) => c.id === chatId)
  return chat?.messages
}

export async function createMessageInChat(
  chatId: string,
  // Repository handles ID generation and timestamps (DDD pattern)
  newMessage: Omit<ChatMessage, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ChatMessage | undefined> {
  const chat = chats.find((c) => c.id === chatId)
  if (!chat) return undefined

  const now = new Date()
  const messageToAdd: ChatMessage = {
    id: uuidv4(),
    content: newMessage.content,
    role: newMessage.role,
    createdAt: now,
    updatedAt: now,
  }

  chat.messages.push(messageToAdd)
  chat.updatedAt = now
  return messageToAdd
}

export function deleteAllMessagesInChat(chatId: string): boolean {
  const chat = chats.find((c) => c.id === chatId)
  if (!chat) return false

  chat.messages = []
  chat.updatedAt = new Date()
  return true
}
