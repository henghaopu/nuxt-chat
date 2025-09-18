import { v4 as uuidv4 } from 'uuid'
import type { Chat, ChatMessage, Project } from '../types/chat.types'

const mockMessages: ChatMessage[] = [
  {
    id: uuidv4(),
    role: 'user',
    content: 'Hello!',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockProject: Project = {
  id: uuidv4(),
  name: 'Project 1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockChat: Chat = {
  id: uuidv4(),
  title: 'Welcome to the chat!',
  messages: mockMessages,
  projectId: mockProject.id,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export { mockChat, mockMessages, mockProject }
