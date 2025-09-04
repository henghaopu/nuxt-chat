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
}

export { mockChat, mockMessages }
