export type Role = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  content: string
  role: Role
}

export interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
  projectId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
}
