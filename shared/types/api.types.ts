// Shared API types for better type safety across frontend and backend

export interface CreateProjectInput {
  name: string
}

export interface UpdateProjectInput {
  // fields should typically be optional since we might want partial updates.
  name?: string
}

export interface CreateChatInput {
  title: string
  projectId: string
}

export interface CreateMessageInput {
  role: 'user' | 'assistant'
  content: string
}
