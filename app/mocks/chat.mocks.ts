const mockMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello!',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
  },
]

const mockChat: Chat = {
  id: '1',
  title: 'Welcome to the chat!',
  messages: [...mockMessages],
  projectId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockProject: Project = {
  id: '1',
  name: 'Project 1',
}

export { mockChat, mockMessages, mockProject }
