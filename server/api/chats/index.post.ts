import { createChat } from '~~/server/repositories/chatRepository'

// post to the chats collection
export default defineEventHandler(async (_event) => {
  return createChat({
    title: 'New Chat',
  })
})
