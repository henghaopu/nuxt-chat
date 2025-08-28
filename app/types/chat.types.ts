import type { refIds } from '~/constants/refId.constants'

export type Role = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: Role
  content: string
}

export interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
}

export type ChatRefId = (typeof refIds)[keyof typeof refIds]
